import { replyIsHinglish } from '@/lib/echo/text'
import type { TurnView } from '@/lib/echo/types'

export type EvalTask = {
  id: string
  title: string
  utterance: string
  followup?: string
  expect: {
    tool: string | null
    args?: Record<string, string>
    language: 'en' | 'hinglish'
    bargeCancels?: boolean
  }
}

export const EVAL_TASKS: EvalTask[] = [
  {
    id: 'book',
    title: 'Hinglish booking',
    utterance: 'kal subah 10 baje dentist ka appointment book kar do',
    expect: {
      tool: 'book_appointment',
      args: { title: 'Dentist', day: 'tomorrow', when: '10:00' },
      language: 'hinglish',
    },
  },
  {
    id: 'weather',
    title: 'City weather',
    utterance: 'mujhe Bangalore ka mausam batao',
    expect: { tool: 'get_weather', args: { city: 'Bengaluru' }, language: 'hinglish' },
  },
  {
    id: 'remind',
    title: 'Evening reminder',
    utterance: 'yaar remind kar dena 6 baje gym',
    expect: {
      tool: 'set_reminder',
      args: { text: 'gym', when: '18:00', day: 'today' },
      language: 'hinglish',
    },
  },
  {
    id: 'calendar',
    title: 'Today’s calendar',
    utterance: 'aaj mera calendar kya hai',
    expect: { tool: 'check_calendar', args: { day: 'today' }, language: 'hinglish' },
  },
  {
    id: 'order',
    title: 'Order status',
    utterance: 'order 4821 ka status kya hai',
    expect: { tool: 'lookup_order', args: { id: '4821' }, language: 'hinglish' },
  },
  {
    id: 'english',
    title: 'English schedule',
    utterance: 'schedule a standup tomorrow at 9',
    expect: {
      tool: 'book_appointment',
      args: { title: 'Standup', day: 'tomorrow', when: '09:00' },
      language: 'en',
    },
  },
  {
    id: 'clarify',
    title: 'Ambiguous Hinglish',
    utterance: 'kal milte hain',
    expect: { tool: null, language: 'hinglish' },
  },
  {
    id: 'repair',
    title: 'Barge-in city repair',
    utterance: 'Bangalore ka mausam batao',
    followup: 'nahi mumbai ka batao',
    expect: { tool: 'get_weather', args: { city: 'Mumbai' }, language: 'hinglish', bargeCancels: true },
  },
]

export type Check = { name: string; pass: boolean; detail: string }

export type BenchRow = {
  id: string
  title: string
  pass: boolean
  checks: Check[]
}

export function scoreTask(task: EvalTask, turn: TurnView | undefined, first?: TurnView): BenchRow {
  const checks: Check[] = []
  const spoken = turn?.agent ?? ''
  const tool = turn?.tools[turn.tools.length - 1]

  if (task.expect.bargeCancels) {
    checks.push({
      name: 'cancel',
      pass: Boolean(first?.cancelled),
      detail: first?.cancelled ? 'first generation aborted' : 'first generation finished',
    })
  }

  if (task.expect.tool === null) {
    checks.push({
      name: 'no tool',
      pass: (turn?.tools.length ?? 0) === 0,
      detail: turn?.tools.length ? tool?.name ?? 'tool called' : 'asked instead of guessing',
    })
  } else {
    checks.push({
      name: 'tool',
      pass: tool?.name === task.expect.tool,
      detail: tool ? tool.name : 'no tool',
    })
    for (const [key, value] of Object.entries(task.expect.args ?? {})) {
      const needle = `${key}=${value}`
      checks.push({
        name: key,
        pass: Boolean(tool?.args.includes(needle)),
        detail: tool?.args ?? 'missing',
      })
    }
  }

  const hinglish = replyIsHinglish(spoken)
  checks.push({
    name: 'language',
    pass: task.expect.language === 'hinglish' ? hinglish : !hinglish,
    detail: hinglish ? 'hinglish reply' : 'english reply',
  })

  return {
    id: task.id,
    title: task.title,
    pass: checks.every((check) => check.pass),
    checks,
  }
}
