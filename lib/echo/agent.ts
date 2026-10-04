import { isAbortError, sleep } from '@/lib/echo/metrics'
import { normalizeUtterance, type Language } from '@/lib/echo/text'
import {
  createWorld,
  executeTool,
  extractCity,
  extractDay,
  extractOrderId,
  extractReminderText,
  extractTitle,
  extractWhen,
  type ToolName,
  type World,
} from '@/lib/echo/world'

export type LastPlan = {
  name: ToolName
  args: Record<string, string>
}

export type PlannedTool = {
  name: ToolName
  args: Record<string, string>
  argsLabel: string
}

export type Plan =
  | { kind: 'speak'; language: Language; reply: string }
  | { kind: 'tool'; language: Language; ack: string; tool: PlannedTool }

export type AgentEvent =
  | { type: 'plan'; language: Language; plan: LastPlan | null }
  | { type: 'tool_call'; name: ToolName; argsLabel: string }
  | {
      type: 'tool_result'
      name: ToolName
      args: Record<string, string>
      argsLabel: string
      result: string
      ms: number
    }
  | { type: 'token'; text: string }

type AgentContext = {
  signal: AbortSignal
  world: World
  last: LastPlan | null
  onEvent: (event: AgentEvent) => void
}

export function planUtterance(raw: string, last: LastPlan | null): Plan {
  const { text, language } = normalizeUtterance(raw)
  const hi = language === 'hinglish'
  const correction = /\b(nahi|nahin|nope|wrong|actually|ruko|wait|stop|no)\b/.test(text)

  if (correction && last?.name === 'get_weather') {
    const city = extractCity(text)
    if (city) return toolPlan('get_weather', { city }, language, hi ? 'Theek hai, dobara dekh raha hoon.' : 'Got it, checking again.')
  }

  if (correction && (last?.name === 'book_appointment' || last?.name === 'set_reminder')) {
    const when = extractWhen(text)
    if (when) {
      const args = { ...last.args, when, day: extractDay(text) }
      const ack = hi ? 'Time badal raha hoon.' : 'Updating the time.'
      return toolPlan(last.name, args, language, ack)
    }
  }

  if (/\b(barge|interrupt|ttfa|pipeline|latency|epoch)\b/.test(text) || /how do you (handle|work|cancel)/.test(text)) {
    const reply = hi
      ? 'Barge-in pe main turn epoch badal deta hoon. Jo agent stream chal raha hota hai usko abort karta hoon. TTS queue clear hoti hai. Twilio leg pe clear event jata hai, taaki buffer wala audio ruk jaye. Agla utterance naya plan hota hai, isliye beech ka correction sahi tool pe land karta hai.'
      : 'Barge-in opens a new turn epoch. I abort the in-flight agent stream the moment speech energy crosses the noise floor. Queued TTS is cancelled in the same tick, and on the Twilio leg I send a clear event so buffered carrier audio stops. The next utterance is planned from scratch, which is how a correction lands on the right tool instead of waiting out the old answer.'
    return { kind: 'speak', language, reply }
  }

  if (/\border\b/.test(text) || (/\bstatus\b/.test(text) && extractOrderId(text))) {
    const id = extractOrderId(text)
    if (!id) {
      return {
        kind: 'speak',
        language,
        reply: hi ? 'Order id bolo, jaise 4821.' : 'Which order id? For example, 4821.',
      }
    }
    return toolPlan('lookup_order', { id }, language, hi ? 'Order dekh raha hoon.' : 'Looking up that order.')
  }

  if (/\b(weather|mausam|temperature|forecast)\b/.test(text)) {
    const city = extractCity(text)
    if (!city) {
      return {
        kind: 'speak',
        language,
        reply: hi ? 'Kaunsa sheher? Bangalore, Mumbai, Delhi, Pune.' : 'Which city? Bangalore, Mumbai, Delhi, or Pune.',
      }
    }
    return toolPlan('get_weather', { city }, language, hi ? `${city} ka mausam dekh raha hoon.` : `Checking ${city}.`)
  }

  if (/\b(remind|reminder|yaad)\b/.test(text)) {
    const when = extractWhen(text)
    if (!when) {
      return {
        kind: 'speak',
        language,
        reply: hi ? 'Kis time pe yaad dilau?' : 'What time should I remind you?',
      }
    }
    return toolPlan(
      'set_reminder',
      { text: extractReminderText(text), when, day: extractDay(text) },
      language,
      hi ? 'Reminder laga raha hoon.' : 'Setting that reminder.'
    )
  }

  if (isBook(text)) {
    const when = extractWhen(text)
    if (!when) {
      return {
        kind: 'speak',
        language,
        reply: hi ? 'Kis time pe book karun?' : 'What time should I book?',
      }
    }
    return toolPlan(
      'book_appointment',
      { title: extractTitle(text), when, day: extractDay(text) },
      language,
      hi ? 'Calendar khol raha hoon.' : 'Opening the calendar.'
    )
  }

  if (/\b(calendar|plans|schedule|din)\b/.test(text)) {
    return toolPlan(
      'check_calendar',
      { day: extractDay(text) },
      language,
      hi ? 'Calendar dekh raha hoon.' : 'Checking the calendar.'
    )
  }

  return {
    kind: 'speak',
    language,
    reply: hi
      ? 'Thoda clear karo — appointment, mausam, reminder, calendar, ya order?'
      : 'I can book something, check the weather, set a reminder, read the calendar, or look up an order. Which one?',
  }
}

function isBook(text: string): boolean {
  if (/\b(book|appointment|schedule a|set up)\b/.test(text)) return true
  if (/\b(dentist|standup|doctor)\b/.test(text) && extractWhen(text)) return true
  return false
}

function toolPlan(name: ToolName, args: Record<string, string>, language: Language, ack: string): Plan {
  const argsLabel = Object.entries(args)
    .map(([key, value]) => `${key}=${value}`)
    .join(' ')
  return { kind: 'tool', language, ack, tool: { name, args, argsLabel } }
}

export async function runAgent(raw: string, ctx: AgentContext): Promise<void> {
  const plan = planUtterance(raw, ctx.last)
  ctx.onEvent({
    type: 'plan',
    language: plan.language,
    plan: plan.kind === 'tool' ? { name: plan.tool.name, args: plan.tool.args } : null,
  })

  if (plan.kind === 'speak') {
    await streamText(plan.reply, ctx)
    return
  }

  // Acknowledgement audio starts before the tool returns, so TTFA is not stuck behind the tool.
  const toolStarted = performance.now()
  const toolPromise = (async () => {
    ctx.onEvent({ type: 'tool_call', name: plan.tool.name, argsLabel: plan.tool.argsLabel })
    await sleep(170, ctx.signal)
    return executeTool(plan.tool.name, plan.tool.args, plan.language, ctx.world)
  })()
  const toolResult = toolPromise.catch((error) => {
    if (isAbortError(error)) return null
    throw error
  })

  await streamText(`${plan.ack} `, ctx)
  const result = await toolResult
  if (!result) return
  ctx.onEvent({
    type: 'tool_result',
    name: plan.tool.name,
    args: plan.tool.args,
    argsLabel: plan.tool.argsLabel,
    result: result.summary,
    ms: Math.round(performance.now() - toolStarted),
  })
  await streamText(result.reply, ctx)
}

async function streamText(text: string, ctx: AgentContext): Promise<void> {
  if (ctx.signal.aborted) throw new DOMException('Aborted', 'AbortError')
  const parts = text.split(/(\s+)/)
  for (const part of parts) {
    if (!part) continue
    if (ctx.signal.aborted) throw new DOMException('Aborted', 'AbortError')
    ctx.onEvent({ type: 'token', text: part })
  }
  // One yield so TTS can start; per-word timers get clamped when the tab is in the background.
  await sleep(16, ctx.signal)
}

export { createWorld }
