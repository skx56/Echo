'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { percentile } from '@/lib/echo/metrics'
import { EchoSession } from '@/lib/echo/session'
import { overlapsAgent } from '@/lib/echo/text'
import type { Snapshot, StageName, StageStatus } from '@/lib/echo/types'
import { startVad, type VadHandle } from '@/lib/echo/vad'

const STAGES: { id: StageName; label: string }[] = [
  { id: 'transport', label: 'Transport' },
  { id: 'vad', label: 'VAD' },
  { id: 'stt', label: 'STT' },
  { id: 'agent', label: 'Agent' },
  { id: 'tools', label: 'Tools' },
  { id: 'tts', label: 'TTS' },
]

const PROMPTS = [
  'kal subah 10 baje dentist book karo',
  'Bangalore ka mausam batao',
  'yaar remind kar dena 6 baje gym',
  'order 4821 ka status kya hai',
  "what's on my calendar today",
]

type RecResult = { isFinal: boolean; 0: { transcript: string }; length: number }
type RecEvent = { resultIndex: number; results: ArrayLike<RecResult> }
type Recognizer = {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  abort: () => void
  onresult: ((event: RecEvent) => void) | null
  onerror: ((event: { error: string }) => void) | null
  onend: (() => void) | null
}

function getRecognizerCtor(): (new () => Recognizer) | null {
  if (typeof window === 'undefined') return null
  const host = window as Window & {
    SpeechRecognition?: new () => Recognizer
    webkitSpeechRecognition?: new () => Recognizer
  }
  return host.SpeechRecognition || host.webkitSpeechRecognition || null
}

function ms(value: number | null): string {
  if (value == null || Number.isNaN(value)) return '—'
  if (value < 1) return '<1ms'
  return `${Math.round(value)}ms`
}

export default function EchoApp() {
  const sessionRef = useRef<EchoSession | null>(null)
  if (!sessionRef.current) sessionRef.current = new EchoSession()
  const session = sessionRef.current
  const snap = useSyncExternalStore(session.subscribe, session.getSnapshot, session.getSnapshot)
  const [draft, setDraft] = useState('')
  const [tab, setTab] = useState<'metrics' | 'bench' | 'design'>('metrics')
  const [micError, setMicError] = useState<string | null>(null)
  const vadRef = useRef<VadHandle | null>(null)
  const recRef = useRef<Recognizer | null>(null)
  const micWanted = useRef(false)
  const lastSent = useRef('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const synth = window.speechSynthesis
    if (!synth) return
    synth.getVoices()
    const load = () => synth.getVoices()
    synth.addEventListener('voiceschanged', load)
    return () => synth.removeEventListener('voiceschanged', load)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const mic: number[] = []
    const agent: number[] = []
    let frame = 0
    const draw = () => {
      const dpr = window.devicePixelRatio || 1
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      if (width === 0 || height === 0) {
        frame = requestAnimationFrame(draw)
        return
      }
      if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
        canvas.width = Math.floor(width * dpr)
        canvas.height = Math.floor(height * dpr)
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      mic.push(session.micLevel)
      agent.push(session.agentLevel)
      if (mic.length > 96) mic.shift()
      if (agent.length > 96) agent.shift()
      ctx.clearRect(0, 0, width, height)
      strokeSeries(ctx, mic, width, height, '#22d3ee', -1)
      strokeSeries(ctx, agent, width, height, '#c4b5fd', 1)
      frame = requestAnimationFrame(draw)
    }
    frame = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(frame)
  }, [session])

  useEffect(() => {
    const node = scrollRef.current
    if (!node) return
    node.scrollTop = node.scrollHeight
  }, [snap.turns, snap.liveUser, snap.phase])

  useEffect(() => {
    return () => {
      micWanted.current = false
      vadRef.current?.stop()
      recRef.current?.abort()
      session.setMic(false)
    }
  }, [session])

  function stopMic() {
    micWanted.current = false
    recRef.current?.abort()
    recRef.current = null
    vadRef.current?.stop()
    vadRef.current = null
    session.setMic(false)
  }

  async function startMic() {
    setMicError(null)
    const Ctor = getRecognizerCtor()
    if (!navigator.mediaDevices?.getUserMedia || !Ctor) {
      setMicError('This browser has no mic recognizer. Typed turns and the bench still run the same runtime.')
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      })
      micWanted.current = true
      session.setMic(true)
      vadRef.current = startVad(stream, {
        onLevel: (level) => {
          session.micLevel = level
        },
        agentIsLoud: () => session.agentIsLoud(),
        onSpeechStart: (onset) => {
          if (!session.canBarge(performance.now())) return false
          session.interruptFrom(onset, 'barge-in', 'live')
          return true
        },
      })
      const rec = new Ctor()
      rec.continuous = true
      rec.interimResults = true
      rec.lang = 'en-IN'
      rec.onresult = (event) => {
        let interim = ''
        let finalText = ''
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const piece = event.results[i][0]?.transcript ?? ''
          if (event.results[i].isFinal) finalText += piece
          else interim += piece
        }
        session.setLiveUser(interim)
        const heard = finalText.trim()
        if (!heard || heard.length < 2) return
        if (overlapsAgent(heard, session.lastAgentText)) return
        if (heard === lastSent.current) return
        lastSent.current = heard
        void session.submit(heard, {
          source: 'mic',
          tts: 'speech',
          speechEndedAt: performance.now(),
        })
      }
      rec.onerror = (event) => {
        if (event.error === 'not-allowed') setMicError('Microphone permission blocked.')
        if (event.error !== 'aborted' && event.error !== 'no-speech') {
          session.setLiveUser('')
        }
      }
      rec.onend = () => {
        if (!micWanted.current) return
        try {
          rec.start()
        } catch {
          /* already started */
        }
      }
      recRef.current = rec
      rec.start()
    } catch {
      setMicError('Microphone permission blocked.')
      stopMic()
    }
  }

  function send(text: string) {
    const value = text.trim()
    if (!value) return
    setDraft('')
    void session.submit(value, { source: 'text', tts: 'speech', speechEndedAt: performance.now() })
  }

  async function drill() {
    const first = session.submit('how do you handle barge-in and cancel TTS', {
      source: 'text',
      tts: 'speech',
    })
    const started = performance.now()
    while (session.getSnapshot().phase !== 'speaking' && performance.now() - started < 5000) {
      await new Promise((resolve) => setTimeout(resolve, 30))
    }
    await new Promise((resolve) => setTimeout(resolve, 650))
    session.interruptFrom(performance.now(), 'barge-in', 'live')
    await first
    await session.submit('nahi mumbai ka mausam batao', { source: 'text', tts: 'speech' })
  }

  async function callIn() {
    session.setTransport('twilio')
    await session.playInbound()
    await session.submit('kal subah 10 baje dentist ka appointment book kar do', {
      source: 'pstn',
      tts: 'speech',
      speechEndedAt: performance.now(),
    })
  }

  const callerSamples = snap.voiceTtfa.length
    ? snap.voiceTtfa
    : snap.textTtfa.length
      ? snap.textTtfa
      : snap.benchTtfa
  const callerLabel = snap.voiceTtfa.length ? 'Caller TTFA' : snap.textTtfa.length ? 'Text TTFA' : 'Bench TTFA'
  const bargeSamples = snap.bargeMs.length ? snap.bargeMs : snap.benchBargeMs
  const bargeLabel = snap.bargeMs.length ? 'Barge-in stop' : 'Bench stop'

  const busy = snap.phase === 'thinking' || snap.phase === 'speaking'
  const phaseLabel =
    snap.phase === 'listening' ? 'Listening' : snap.phase === 'thinking' ? 'Thinking' : snap.phase === 'speaking' ? 'Speaking' : 'Ready'

  return (
    <div
      className="min-h-screen text-zinc-100"
      style={{
        background:
          'radial-gradient(900px 480px at 10% -10%, rgba(34,211,238,0.18), transparent 55%), radial-gradient(700px 420px at 100% 0%, rgba(167,139,250,0.16), transparent 50%), #09090b',
      }}
    >
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#09090b]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-5">
          <a href="https://skx56.github.io/" className="text-sm text-zinc-400 transition hover:text-white">
            Portfolio
          </a>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-cyan-300 text-sm font-bold text-cyan-950">E</span>
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-none text-white">Echo</p>
              <p className="mt-1 truncate text-xs text-zinc-500">Real-time voice agent</p>
            </div>
          </div>
          <div className="ml-auto">
            <PhasePill label={phaseLabel} phase={snap.phase} />
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl items-start gap-5 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-5">
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="border-b border-white/10 px-6 pb-6 pt-8 text-center">
            <div className="relative mx-auto h-52 w-52">
              <span
                className="absolute inset-0 rounded-full border border-cyan-300/20"
                style={{ animation: busy || snap.micOn ? 'echo-pulse 1.8s ease-in-out infinite' : undefined }}
              />
              <span className="absolute inset-3 rounded-full border border-white/10" />
              <span
                className="absolute inset-6 rounded-full"
                style={{
                  background:
                    snap.phase === 'speaking'
                      ? 'radial-gradient(circle, rgba(196,181,253,0.55), rgba(12,14,20,0.2) 70%)'
                      : snap.phase === 'listening'
                        ? 'radial-gradient(circle, rgba(34,211,238,0.45), rgba(12,14,20,0.2) 70%)'
                        : 'radial-gradient(circle, rgba(34,211,238,0.16), rgba(12,14,20,0.4) 72%)',
                }}
              />
              <div className="absolute inset-8 overflow-hidden rounded-full border border-white/10 bg-[#10131a] shadow-[inset_0_0_24px_rgba(34,211,238,0.15)]">
                <canvas ref={canvasRef} className="h-full w-full" />
              </div>
            </div>
            <button
              type="button"
              onClick={() => (snap.micOn ? stopMic() : void startMic())}
              className="mt-5 inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-semibold shadow-lg transition hover:brightness-110"
              style={{
                background: snap.micOn ? '#fb7185' : '#22d3ee',
                color: snap.micOn ? '#fff' : '#083344',
              }}
            >
              <span className="h-2 w-2 rounded-full bg-current" />
              {snap.micOn ? 'Stop' : 'Talk'}
            </button>
            <p className="mx-auto mt-3 max-w-sm text-xs leading-relaxed text-zinc-500">
              Headphones keep barge-in from hearing the agent. You can also type, or interrupt a reply mid-sentence.
            </p>
          </div>

          <div
            ref={scrollRef}
            className={`flex flex-col gap-4 overflow-y-auto px-5 py-5 ${
              snap.turns.length === 0 && !snap.liveUser ? 'min-h-[280px]' : 'h-[min(460px,54vh)]'
            }`}
          >
            {snap.turns.length === 0 && !snap.liveUser && (
              <div className="m-auto w-full max-w-md text-center">
                <p className="text-base font-medium text-white">Ask in English or Hinglish</p>
                <p className="mt-1 text-sm text-zinc-400">Calendar, weather, reminders, and orders. A new utterance cancels the one in flight.</p>
                <div className="mt-5 grid gap-2 text-left">
                  {PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => send(prompt)}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-200 transition hover:border-cyan-300/40 hover:bg-white/[0.06]"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {snap.turns.map((turn) => (
              <div key={turn.id} className="space-y-2">
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-br-md bg-cyan-300/15 px-4 py-2.5 text-sm leading-relaxed text-cyan-50">
                    {turn.user}
                  </div>
                </div>
                <div className="flex justify-start">
                  <div
                    className="max-w-[85%] rounded-2xl rounded-bl-md px-4 py-2.5 text-sm leading-relaxed"
                    style={{
                      background: turn.cancelled ? 'rgba(251,113,133,0.08)' : 'rgba(255,255,255,0.06)',
                      border: turn.cancelled ? '1px solid rgba(251,113,133,0.25)' : '1px solid transparent',
                    }}
                  >
                    <p className="text-zinc-100">
                      {turn.agent || (turn.id === snap.generation && busy ? '…' : '')}
                    </p>
                    {turn.cancelled && <p className="mt-1 text-xs font-medium text-rose-300">Interrupted</p>}
                    {turn.tools.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {turn.tools.map((tool) => (
                          <span
                            key={`${turn.id}-${tool.name}`}
                            className="rounded-full bg-violet-400/15 px-2.5 py-1 text-[11px] text-violet-100"
                          >
                            {tool.name.split('_').join(' ')} · {tool.ms}ms
                          </span>
                        ))}
                      </div>
                    )}
                    {turn.ttfaMs != null && (
                      <p className="mt-2 text-[11px] text-zinc-500">
                        First audio {turn.ttfaMs}ms · {turn.language === 'hinglish' ? 'Hinglish' : 'English'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {snap.liveUser && (
              <div className="flex justify-end">
                <p className="max-w-[85%] rounded-2xl bg-white/5 px-4 py-2 text-sm text-cyan-100/80">{snap.liveUser}</p>
              </div>
            )}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault()
              send(draft)
            }}
            className="border-t border-white/10 p-4"
          >
            {snap.turns.length > 0 && (
              <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                {PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => send(prompt)}
                    className="shrink-0 rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-300 hover:border-cyan-300/40 hover:text-white"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Type a turn, or tap Talk"
                className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none placeholder:text-zinc-600 focus:border-cyan-300/50"
              />
              {busy ? (
                <button
                  type="button"
                  onClick={() => session.interruptFrom(performance.now(), 'barge-in', 'live')}
                  className="rounded-2xl bg-rose-400 px-4 text-sm font-semibold text-rose-950"
                >
                  Interrupt
                </button>
              ) : (
                <button type="submit" className="rounded-2xl bg-white px-5 text-sm font-semibold text-zinc-900">
                  Send
                </button>
              )}
            </div>
            {(micError || snap.lastError) && <p className="mt-2 text-xs text-rose-300">{micError || snap.lastError}</p>}
          </form>
        </section>

        <aside className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <Stat label={callerLabel} value={ms(percentile(callerSamples, 50))} hint={`p95 ${ms(percentile(callerSamples, 95))}`} />
            <Stat label={bargeLabel} value={ms(percentile(bargeSamples, 50))} hint={`p95 ${ms(percentile(bargeSamples, 95))}`} />
            <Stat
              label="Bench"
              value={snap.bench ? `${snap.bench.filter((row) => row.pass).length}/${snap.bench.length}` : '—'}
              hint={snap.benchRunning ? 'Running' : '8 tasks'}
            />
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-white">Pipeline</p>
              <p className="text-xs text-zinc-500">{snap.generation ? `Turn ${snap.generation}` : 'Idle'}</p>
            </div>
            <ol className="space-y-2.5">
              {STAGES.map((stage, index) => (
                <li key={stage.id} className="flex items-center gap-3">
                  <span className="relative grid h-5 w-5 place-items-center">
                    {index < STAGES.length - 1 && (
                      <span className="absolute top-5 h-3 w-px bg-white/10" />
                    )}
                    <StageDot status={snap.stages[stage.id]} />
                  </span>
                  <span className="flex-1 text-sm text-zinc-200">{stage.label}</span>
                  <span className="text-xs capitalize text-zinc-500">{snap.stages[stage.id]}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-2">
            <div className="grid grid-cols-3 gap-1">
              {(
                [
                  ['metrics', 'Session'],
                  ['bench', 'Eval'],
                  ['design', 'How'],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className="rounded-2xl px-2 py-2 text-xs font-semibold"
                  style={{
                    background: tab === id ? 'rgba(255,255,255,0.08)' : 'transparent',
                    color: tab === id ? '#fff' : '#a1a1aa',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="p-2">
              {tab === 'metrics' && (
                <Metrics
                  snap={snap}
                  transport={snap.transport}
                  onTransport={(transport) => session.setTransport(transport)}
                  onDrill={() => void drill()}
                  onCall={() => void callIn()}
                  busy={busy || snap.benchRunning}
                />
              )}
              {tab === 'bench' && (
                <Bench
                  snap={snap}
                  onRun={() => {
                    stopMic()
                    setTab('bench')
                    void session.runBench()
                  }}
                />
              )}
              {tab === 'design' && <Design />}
            </div>
          </div>
        </aside>
      </main>
      <style>{`
        @keyframes echo-pulse {
          0%, 100% { transform: scale(0.96); opacity: 0.7; }
          50% { transform: scale(1.06); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

function strokeSeries(
  ctx: CanvasRenderingContext2D,
  series: number[],
  width: number,
  height: number,
  color: string,
  direction: number
) {
  ctx.beginPath()
  series.forEach((value, index) => {
    const x = (index / 95) * width
    const y = height / 2 + direction * Math.max(1.5, value) * (height / 2 - 6)
    if (index === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  })
  ctx.strokeStyle = color
  ctx.lineWidth = 1.6
  ctx.stroke()
}

function PhasePill({ label, phase }: { label: string; phase: Snapshot['phase'] }) {
  const color =
    phase === 'speaking' ? '#c4b5fd' : phase === 'thinking' ? '#fbbf24' : phase === 'listening' ? '#22d3ee' : '#d4d4d8'
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium" style={{ color }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  )
}

function StageDot({ status }: { status: StageStatus }) {
  const color =
    status === 'live' ? '#22d3ee' : status === 'done' ? '#86efac' : status === 'cancelled' ? '#fb7185' : '#3f3f46'
  return <span className="h-2 w-2 rounded-full" style={{ background: color, boxShadow: status === 'live' ? `0 0 8px ${color}` : undefined }} />
}

function Stat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-2 py-3 text-center">
      <p className="font-mono text-lg font-semibold text-white">{value}</p>
      <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-zinc-500">{label}</p>
      <p className="mt-0.5 font-mono text-[10px] text-zinc-600">{hint}</p>
    </div>
  )
}

function Metrics({
  snap,
  transport,
  onTransport,
  onDrill,
  onCall,
  busy,
}: {
  snap: Snapshot
  transport: Snapshot['transport']
  onTransport: (transport: Snapshot['transport']) => void
  onDrill: () => void
  onCall: () => void
  busy: boolean
}) {
  const last = snap.turns[snap.turns.length - 1]
  const samples = snap.voiceTtfa.length ? snap.voiceTtfa : snap.textTtfa.length ? snap.textTtfa : snap.benchTtfa
  const peak = Math.max(1, ...samples)
  return (
    <div className="space-y-4 px-1 pb-1 pt-2">
      <div className="grid grid-cols-2 gap-1 rounded-2xl bg-black/30 p-1 text-xs font-medium">
        {(['webrtc', 'twilio'] as const).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => onTransport(id)}
            className="rounded-xl px-2 py-2"
            style={{
              background: transport === id ? '#22d3ee' : 'transparent',
              color: transport === id ? '#083344' : '#a1a1aa',
            }}
          >
            {id === 'webrtc' ? 'WebRTC mic' : 'Twilio leg'}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onDrill}
          disabled={busy}
          className="rounded-2xl border border-white/10 px-3 py-2.5 text-left text-xs font-medium text-zinc-200 disabled:opacity-40"
        >
          Barge-in drill
          <span className="mt-0.5 block font-normal text-zinc-500">Cut a reply off</span>
        </button>
        <button
          type="button"
          onClick={onCall}
          disabled={busy}
          className="rounded-2xl border border-white/10 px-3 py-2.5 text-left text-xs font-medium text-zinc-200 disabled:opacity-40"
        >
          PSTN caller
          <span className="mt-0.5 block font-normal text-zinc-500">μ-law frames in</span>
        </button>
      </div>
      <p className="text-xs leading-relaxed text-zinc-500">
        First audio is measured from send to the first spoken sample. p50 and p95 are this session only.
      </p>
      <div className="flex h-16 items-end gap-1">
        {samples.slice(-18).map((sample, index) => (
          <div
            key={`${sample}-${index}`}
            className="flex-1 rounded-sm bg-cyan-300/80"
            style={{ height: `${Math.max(8, (sample / peak) * 100)}%` }}
            title={`${sample}ms`}
          />
        ))}
        {samples.length === 0 && <p className="text-xs text-zinc-500">No samples yet.</p>}
      </div>
      <dl className="grid grid-cols-2 gap-2 font-mono text-[11px] text-zinc-300">
        <Metric label="caller n" value={String(snap.voiceTtfa.length)} />
        <Metric label="text n" value={String(snap.textTtfa.length)} />
        <Metric label="caller p50" value={ms(percentile(snap.voiceTtfa, 50))} />
        <Metric label="caller p95" value={ms(percentile(snap.voiceTtfa, 95))} />
        <Metric label="barge p50" value={ms(percentile(snap.bargeMs, 50))} />
        <Metric label="barge p95" value={ms(percentile(snap.bargeMs, 95))} />
      </dl>
      {last && (
        <div>
          <p className="mb-1 text-[10px] uppercase tracking-wider text-zinc-500">Last turn</p>
          <Waterfall label="plan" ms={last.planMs} />
          {last.tools.map((tool) => (
            <Waterfall key={tool.name} label={tool.name} ms={tool.ms} />
          ))}
          <Waterfall label="first audio" ms={last.ttfaMs} />
        </div>
      )}
      {snap.twilio.length > 0 && (
        <div>
          <p className="mb-1 text-[10px] uppercase tracking-wider text-zinc-500">Twilio frames</p>
          <ul className="space-y-1 font-mono text-[10px] leading-relaxed text-cyan-100/80">
            {snap.twilio.map((line, index) => (
              <li key={`${index}-${line.slice(0, 24)}`}>{line}</li>
            ))}
          </ul>
        </div>
      )}
      <ol className="max-h-48 space-y-1 overflow-y-auto font-mono text-[10px]">
        {snap.trace.slice(-12).reverse().map((row) => (
          <li key={row.id} style={{ color: row.tone === 'bad' ? '#fda4af' : row.tone === 'ok' ? '#86efac' : '#e4e4e7' }}>
            <span className="text-zinc-500">{row.kind}</span> {row.text}
          </li>
        ))}
      </ol>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg bg-black/30 px-2 py-1">
      <dt className="text-zinc-500">{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

function Waterfall({ label, ms: value }: { label: string; ms: number | null }) {
  const width = value == null ? 0 : Math.min(100, Math.max(6, value / 12))
  return (
    <div className="mb-1 flex items-center gap-2 text-[11px]">
      <span className="w-24 shrink-0 text-zinc-400">{label}</span>
      <span className="h-1.5 rounded-full bg-cyan-300/80" style={{ width: `${width}%` }} />
      <span className="font-mono text-zinc-300">{ms(value)}</span>
    </div>
  )
}

function Bench({ snap, onRun }: { snap: Snapshot; onRun: () => void }) {
  const passed = snap.bench?.filter((row) => row.pass).length ?? 0
  return (
    <div className="space-y-3 px-1 pb-1 pt-2">
      <p className="text-xs leading-relaxed text-zinc-500">
        Eight tasks on this session: intent, slots, reply language, and a barge-in that must drop Bangalore and answer Mumbai.
      </p>
      <button
        type="button"
        onClick={onRun}
        disabled={snap.benchRunning}
        className="w-full rounded-2xl bg-cyan-300 px-3 py-2.5 text-sm font-semibold text-cyan-950 disabled:opacity-50"
      >
        {snap.benchRunning ? 'Running…' : 'Run Hinglish bench'}
      </button>
      {snap.bench && (
        <p className="font-mono text-xs text-zinc-300">
          {passed}/{snap.bench.length} passed
        </p>
      )}
      <ul className="space-y-2">
        {snap.bench?.map((row) => (
          <li key={row.id} className="rounded-lg border border-white/10 px-2 py-1.5">
            <p className="flex items-center justify-between text-xs">
              <span>{row.title}</span>
              <span className={row.pass ? 'text-emerald-300' : 'text-rose-300'}>{row.pass ? 'pass' : 'fail'}</span>
            </p>
            <p className="mt-1 font-mono text-[10px] leading-relaxed text-zinc-500">
              {row.checks.map((check) => `${check.pass ? 'ok' : 'no'} ${check.name}`).join(' · ')}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Design() {
  return (
    <div className="space-y-3 px-1 pb-1 pt-2 text-xs leading-relaxed text-zinc-400">
      <p>
        <span className="text-white">Epoch.</span> Each utterance takes a generation id. Barge-in aborts
        that id: the agent stream stops, queued TTS is cancelled, and a Twilio{' '}
        <span className="font-mono text-cyan-200">clear</span> drops buffered carrier audio.
      </p>
      <p>
        <span className="text-white">Early audio.</span> The router emits a one-line acknowledgement and
        flushes it to TTS on the first sentence, while the tool is still in flight. TTFA is not waiting
        on the tool or the full answer.
      </p>
      <p>
        <span className="text-white">Transports.</span> WebRTC is the live mic, with echo cancellation and
        an energy VAD that ignores the first 280ms of playback. Twilio is the same session clocked as
        20ms μ-law frames. Arm that leg and an interrupt writes the clear event a Media Streams socket
        would send.
      </p>
      <p>
        <span className="text-white">Slots, not a fake model.</span> STT is the browser recognizer (en-IN,
        so roman Hinglish works). The agent is a tool router with a schema for calendar, weather,
        reminders, and orders — deterministic so the bench can fail. TTS is speech synthesis, cancelled
        with the generation. Those three swap for streaming STT, a tool-calling model, and streaming TTS
        without touching the session.
      </p>
      <p className="text-zinc-500">
        Repair is a new turn, not a resume. “nahi, Mumbai” after a weather call plans get_weather again
        instead of talking over the old city.
      </p>
    </div>
  )
}
