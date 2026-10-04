export type Phase = 'idle' | 'listening' | 'thinking' | 'speaking'

export type Transport = 'webrtc' | 'twilio'

export type Source = 'mic' | 'text' | 'pstn' | 'bench'

export type StageName = 'transport' | 'vad' | 'stt' | 'agent' | 'tools' | 'tts'

export type StageStatus = 'idle' | 'live' | 'done' | 'cancelled' | 'skipped'

export type ToolView = {
  name: string
  args: string
  result: string
  ms: number
}

export type TurnView = {
  id: number
  source: Source
  user: string
  agent: string
  language: 'en' | 'hinglish'
  tools: ToolView[]
  cancelled: boolean
  ttfaMs: number | null
  planMs: number | null
}

export type TraceRow = {
  id: number
  kind: string
  text: string
  tone: 'info' | 'ok' | 'warn' | 'bad'
}

export type Snapshot = {
  phase: Phase
  transport: Transport
  micOn: boolean
  liveUser: string
  turns: TurnView[]
  trace: TraceRow[]
  stages: Record<StageName, StageStatus>
  voiceTtfa: number[]
  textTtfa: number[]
  benchTtfa: number[]
  bargeMs: number[]
  generation: number
  twilio: string[]
  benchBargeMs: number[]
  bench: {
    id: string
    title: string
    pass: boolean
    checks: { name: string; pass: boolean; detail: string }[]
  }[] | null
  benchRunning: boolean
  lastError: string | null
}

export const EMPTY_STAGES: Record<StageName, StageStatus> = {
  transport: 'idle',
  vad: 'idle',
  stt: 'idle',
  agent: 'idle',
  tools: 'idle',
  tts: 'idle',
}
