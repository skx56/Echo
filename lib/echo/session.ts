import { runAgent, type LastPlan } from '@/lib/echo/agent'
import { EVAL_TASKS, scoreTask } from '@/lib/echo/eval'
import { isAbortError, sleep } from '@/lib/echo/metrics'
import { encodeSpeechFrames } from '@/lib/echo/mulaw'
import { takeSentence } from '@/lib/echo/text'
import { browserSpeak, virtualSpeak, type Speaker } from '@/lib/echo/tts'
import {
  EMPTY_STAGES,
  type Phase,
  type Snapshot,
  type Source,
  type StageName,
  type StageStatus,
  type TraceRow,
  type Transport,
  type TurnView,
} from '@/lib/echo/types'
import { createWorld, type World } from '@/lib/echo/world'

const STREAM_SID = 'MZ_echo_demo'

export type SubmitOpts = {
  source: Source
  tts: 'speech' | 'virtual'
  speechEndedAt?: number
}

export class EchoSession {
  micLevel = 0
  agentLevel = 0
  lastAgentText = ''

  private phase: Phase = 'idle'
  private transport: Transport = 'webrtc'
  private micOn = false
  private liveUser = ''
  private turns: TurnView[] = []
  private trace: TraceRow[] = []
  private stages: Record<StageName, StageStatus> = { ...EMPTY_STAGES }
  private voiceTtfa: number[] = []
  private textTtfa: number[] = []
  private benchTtfa: number[] = []
  private bargeMs: number[] = []
  private benchBargeMs: number[] = []
  private twilio: string[] = []
  private bench: Snapshot['bench'] = null
  private benchRunning = false
  private lastError: string | null = null
  private generation = 0
  private epoch = 0
  private turnSeq = 0
  private traceSeq = 0
  private abort: AbortController | null = null
  private world: World = createWorld()
  private lastPlan: LastPlan | null = null
  private ttsStartedAt = 0
  private listeners = new Set<() => void>()
  private snap: Snapshot = this.capture()

  subscribe = (listener: () => void) => {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  getSnapshot = () => this.snap

  canBarge(now: number): boolean {
    if (this.phase !== 'thinking' && this.phase !== 'speaking') return false
    if (this.phase === 'speaking' && now - this.ttsStartedAt < 280) return false
    return true
  }

  agentIsLoud(): boolean {
    return this.phase === 'speaking' && this.agentLevel > 0.05
  }

  setTransport(transport: Transport) {
    if (this.transport === transport) return
    this.transport = transport
    this.noteTwilio(
      transport === 'twilio'
        ? `leg armed · streamSid ${STREAM_SID}`
        : 'browser mic transport'
    )
    this.log('transport', this.twilio[0] ?? transport, 'info')
    this.publish()
  }

  setMic(on: boolean) {
    this.micOn = on
    if (!on) this.micLevel = 0
    if (!on && this.phase === 'listening') this.phase = 'idle'
    if (on && this.phase === 'idle') this.phase = 'listening'
    this.stages.transport = on || this.transport === 'twilio' ? 'live' : 'idle'
    this.stages.vad = on ? 'live' : 'idle'
    this.publish()
  }

  setLiveUser(text: string) {
    this.liveUser = text
    if (text) this.stages.stt = 'live'
    this.publish()
  }

  interruptFrom(onset: number, reason: 'barge-in' | 'superseded', bucket: 'live' | 'bench' = 'live'): boolean {
    if (this.phase !== 'thinking' && this.phase !== 'speaking') return false
    const ms = Math.max(0, Math.round(performance.now() - onset))
    if (reason === 'barge-in') {
      if (bucket === 'bench') this.benchBargeMs.push(ms)
      else this.bargeMs.push(ms)
    }
    this.epoch += 1
    this.abort?.abort()
    this.abort = null
    this.agentLevel = 0
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    this.stages.agent = 'cancelled'
    this.stages.tts = 'cancelled'
    if (this.stages.tools === 'live') this.stages.tools = 'cancelled'
    if (this.transport === 'twilio') {
      this.noteTwilio(`→ {"event":"clear","streamSid":"${STREAM_SID}"}`)
      this.log('twilio', 'clear · drop outbound buffer', 'warn')
    }
    this.log('cancel', `${reason} · stopped in ${ms}ms`, 'bad')
    this.phase = this.micOn ? 'listening' : 'idle'
    this.publish()
    return true
  }

  async playInbound(): Promise<void> {
    const burst = encodeSpeechFrames(640)
    this.noteTwilio(`← media ×${burst.frames} · ${burst.bytes}B μ-law · ${burst.samplePayload}`)
    this.log('twilio', `inbound media ×${burst.frames} (20ms frames)`, 'info')
    this.stages.transport = 'live'
    this.stages.vad = 'done'
    this.publish()
    await sleep(240)
  }

  async submit(text: string, opts: SubmitOpts): Promise<TurnView | null> {
    const trimmed = text.trim()
    if (!trimmed || (this.benchRunning && opts.source !== 'bench')) return null

    if (this.phase === 'thinking' || this.phase === 'speaking') {
      this.interruptFrom(performance.now(), 'superseded', opts.source === 'bench' ? 'bench' : 'live')
    }

    const epoch = ++this.epoch
    const id = ++this.turnSeq
    this.generation = id
    const ac = new AbortController()
    this.abort = ac
    const speechEndedAt = opts.speechEndedAt ?? performance.now()
    const started = performance.now()
    const turn: TurnView = {
      id,
      source: opts.source,
      user: trimmed,
      agent: '',
      language: 'en',
      tools: [],
      cancelled: false,
      ttfaMs: null,
      planMs: null,
    }
    this.turns = [...this.turns, turn].slice(-16)
    this.liveUser = ''
    this.phase = 'thinking'
    this.stages.stt = 'done'
    this.stages.agent = 'live'
    this.stages.tools = 'idle'
    this.stages.tts = 'idle'
    this.lastError = null
    this.log('stt', `${opts.source} · ${trimmed}`, 'ok')
    this.publish()

    let buffer = ''
    let speakChain = Promise.resolve()
    const speaker: Speaker = opts.tts === 'virtual' ? virtualSpeak : browserSpeak

    const enqueue = (sentence: string) => {
      const line = sentence.trim()
      if (!line) return
      speakChain = speakChain
        .then(async () => {
          if (ac.signal.aborted || epoch !== this.epoch) return
          this.phase = 'speaking'
          this.stages.tts = 'live'
          this.publish()
          await speaker(
            line,
            ac.signal,
            () => {
              if (turn.ttfaMs != null) return
              turn.ttfaMs = Math.round(performance.now() - speechEndedAt)
              this.ttsStartedAt = performance.now()
              const bucket =
                opts.source === 'bench' ? this.benchTtfa : opts.source === 'text' ? this.textTtfa : this.voiceTtfa
              bucket.push(turn.ttfaMs)
              this.log('metric', `TTFA ${turn.ttfaMs}ms`, 'ok')
              if (this.transport === 'twilio') {
                const burst = encodeSpeechFrames(Math.min(800, 200 + line.length * 18))
                this.noteTwilio(`→ media ×${burst.frames} · first audio`)
                this.log('twilio', `outbound media ×${burst.frames}`, 'ok')
              }
              this.publish()
            },
            (level) => {
              this.agentLevel = level
            }
          )
        })
        .catch((error) => {
          if (!isAbortError(error)) throw error
        })
    }

    try {
      await runAgent(trimmed, {
        signal: ac.signal,
        world: this.world,
        last: this.lastPlan,
        onEvent: (event) => {
          if (epoch !== this.epoch) return
          if (event.type === 'plan') {
            turn.language = event.language
            turn.planMs = Math.round(performance.now() - started)
            if (event.plan) this.lastPlan = event.plan
            this.log('agent', event.plan ? `plan · ${event.plan.name}` : 'plan · reply', 'info')
          }
          if (event.type === 'tool_call') {
            this.stages.tools = 'live'
            this.log('tool', `${event.name} ${event.argsLabel}`, 'info')
            this.publish()
          }
          if (event.type === 'tool_result') {
            this.stages.tools = 'done'
            this.lastPlan = { name: event.name, args: event.args }
            turn.tools.push({
              name: event.name,
              args: event.argsLabel,
              result: event.result,
              ms: event.ms,
            })
            this.log('tool', `${event.result} · ${event.ms}ms`, 'ok')
            this.publish()
          }
          if (event.type === 'token') {
            buffer += event.text
            turn.agent += event.text
            this.lastAgentText = turn.agent
            let sentence = takeSentence(buffer)
            while (sentence) {
              buffer = buffer.slice(sentence.length)
              enqueue(sentence)
              sentence = takeSentence(buffer)
            }
            this.publish()
          }
        },
      })
      if (epoch === this.epoch && buffer.trim()) enqueue(buffer)
      await speakChain
    } catch (error) {
      await speakChain.catch(() => undefined)
      if (!isAbortError(error) && epoch === this.epoch) {
        this.lastError = error instanceof Error ? error.message : 'Turn failed'
        this.log('agent', this.lastError, 'bad')
      }
    } finally {
      this.agentLevel = 0
      if (epoch !== this.epoch) {
        turn.cancelled = true
        this.publish()
      } else {
        this.stages.agent = 'done'
        this.stages.tts = turn.ttfaMs == null ? 'skipped' : 'done'
        if (this.stages.tools === 'idle') this.stages.tools = 'skipped'
        this.phase = this.micOn ? 'listening' : 'idle'
        this.lastAgentText = turn.agent
        this.publish()
      }
    }

    return turn
  }

  async runBench(): Promise<void> {
    if (this.benchRunning) return
    this.benchRunning = true
    this.bench = []
    this.world = createWorld()
    this.lastPlan = null
    this.publish()

    for (const task of EVAL_TASKS) {
      if (task.followup) {
        const firstPromise = this.submit(task.utterance, { source: 'bench', tts: 'virtual' })
        await this.waitUntilSpeaking()
        await sleep(130)
        this.interruptFrom(performance.now(), 'barge-in', 'bench')
        const first = await firstPromise
        const second = await this.submit(task.followup, { source: 'bench', tts: 'virtual' })
        this.bench = [...(this.bench ?? []), scoreTask(task, second ?? undefined, first ?? undefined)]
      } else {
        const turn = await this.submit(task.utterance, { source: 'bench', tts: 'virtual' })
        this.bench = [...(this.bench ?? []), scoreTask(task, turn ?? undefined)]
      }
      this.publish()
    }

    this.benchRunning = false
    this.phase = this.micOn ? 'listening' : 'idle'
    this.publish()
  }

  private waitUntilSpeaking(timeout = 2500): Promise<void> {
    return new Promise((resolve) => {
      const start = performance.now()
      const tick = () => {
        if (this.phase === 'speaking' || performance.now() - start > timeout) resolve()
        else setTimeout(tick, 20)
      }
      tick()
    })
  }

  private noteTwilio(line: string) {
    this.twilio = [line, ...this.twilio].slice(0, 5)
  }

  private log(kind: string, text: string, tone: TraceRow['tone']) {
    this.traceSeq += 1
    this.trace = [...this.trace, { id: this.traceSeq, kind, text, tone }].slice(-48)
  }

  private capture(): Snapshot {
    return {
      phase: this.phase,
      transport: this.transport,
      micOn: this.micOn,
      liveUser: this.liveUser,
      turns: this.turns.map((turn) => ({ ...turn, tools: turn.tools.map((tool) => ({ ...tool })) })),
      trace: this.trace.map((row) => ({ ...row })),
      stages: { ...this.stages },
      voiceTtfa: [...this.voiceTtfa],
      textTtfa: [...this.textTtfa],
      benchTtfa: [...this.benchTtfa],
      bargeMs: [...this.bargeMs],
      benchBargeMs: [...this.benchBargeMs],
      generation: this.generation,
      twilio: [...this.twilio],
      bench: this.bench
        ? this.bench.map((row) => ({ ...row, checks: row.checks.map((check) => ({ ...check })) }))
        : null,
      benchRunning: this.benchRunning,
      lastError: this.lastError,
    }
  }

  private publish() {
    this.snap = this.capture()
    this.listeners.forEach((listener) => listener())
  }
}
