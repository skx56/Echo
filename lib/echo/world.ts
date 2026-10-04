export type DaySlot = 'today' | 'tomorrow' | 'day-after'

export type World = {
  calendar: { day: DaySlot; when: string; title: string }[]
  reminders: { day: DaySlot; when: string; text: string }[]
}

export function createWorld(): World {
  return {
    calendar: [
      { day: 'today', when: '09:30', title: 'Standup' },
      { day: 'today', when: '16:00', title: 'Design review' },
    ],
    reminders: [],
  }
}

export type ToolName =
  | 'book_appointment'
  | 'check_calendar'
  | 'set_reminder'
  | 'get_weather'
  | 'lookup_order'

const CITIES: [string, string][] = [
  ['new delhi', 'Delhi'],
  ['bengaluru', 'Bengaluru'],
  ['bangalore', 'Bengaluru'],
  ['bombay', 'Mumbai'],
  ['mumbai', 'Mumbai'],
  ['delhi', 'Delhi'],
  ['hyderabad', 'Hyderabad'],
  ['gurugram', 'Gurugram'],
  ['gurgaon', 'Gurugram'],
  ['chennai', 'Chennai'],
  ['kolkata', 'Kolkata'],
  ['jaipur', 'Jaipur'],
  ['noida', 'Noida'],
  ['pune', 'Pune'],
  ['london', 'London'],
]

const WEATHER: Record<string, { temp: number; cond: [string, string]; out: [string, string] }> = {
  Bengaluru: {
    temp: 24,
    cond: ['partly cloudy', 'halka cloudy'],
    out: ['Light rain is possible by evening.', 'Shaam ko halki baarish ho sakti hai.'],
  },
  Mumbai: {
    temp: 31,
    cond: ['humid and hazy', 'humid aur hazy'],
    out: ['No storm in the next few hours.', 'Agle kuch ghanton mein toofan nahi.'],
  },
  Delhi: {
    temp: 29,
    cond: ['dry and clear', 'sookha aur clear'],
    out: ['It stays warm through the afternoon.', 'Dopahar tak garmi rahegi.'],
  },
  Pune: {
    temp: 27,
    cond: ['pleasant', 'sukhda'],
    out: ['A breeze picks up after 5.', '5 ke baad hawa chalegi.'],
  },
  Hyderabad: {
    temp: 30,
    cond: ['sunny', 'dhoop'],
    out: ['Clear until night.', 'Raat tak clear rahega.'],
  },
  Chennai: {
    temp: 32,
    cond: ['hot and humid', 'garam aur humid'],
    out: ['Coastal haze this evening.', 'Shaam ko haze rahegi.'],
  },
  Gurugram: {
    temp: 28,
    cond: ['hazy', 'hazy'],
    out: ['Warm until sunset.', 'Sunset tak garam rahega.'],
  },
  Noida: {
    temp: 28,
    cond: ['hazy', 'hazy'],
    out: ['Warm until sunset.', 'Sunset tak garam rahega.'],
  },
  Jaipur: {
    temp: 33,
    cond: ['hot and dry', 'garam aur sookha'],
    out: ['No rain expected.', 'Baarish nahi lagegi.'],
  },
  Kolkata: {
    temp: 30,
    cond: ['sticky', 'chipchipa'],
    out: ['Clouds build late.', 'Shaam ko badal aayenge.'],
  },
  London: {
    temp: 16,
    cond: ['grey and damp', 'dhundhla'],
    out: ['Drizzle on and off.', 'Halki baarish chalti rahegi.'],
  },
}

const ORDERS: Record<string, { status: [string, string]; eta: [string, string] }> = {
  '4821': {
    status: ['shipped', 'ship ho chuka'],
    eta: ['Delivery is tomorrow.', 'Delivery kal hai.'],
  },
  '1099': {
    status: ['delivered', 'deliver ho chuka'],
    eta: ['It was handed over this morning.', 'Aaj subah mil gaya.'],
  },
  '2204': {
    status: ['processing', 'process ho raha'],
    eta: ['It has not shipped yet.', 'Abhi ship nahi hua.'],
  },
}

export function extractCity(text: string): string | null {
  const ordered = [...CITIES].sort((a, b) => b[0].length - a[0].length)
  for (const [needle, canonical] of ordered) {
    if (text.includes(needle)) return canonical
  }
  return null
}

export function extractDay(text: string): DaySlot {
  if (/\b(parso|day after tomorrow)\b/.test(text)) return 'day-after'
  if (/\b(kal|tomorrow)\b/.test(text)) return 'tomorrow'
  return 'today'
}

export function extractWhen(text: string): string | null {
  const match = text.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm|baje)?\b/)
  if (!match) return null
  let hour = Number(match[1])
  const minute = match[2] ? Number(match[2]) : 0
  if (hour > 23 || minute > 59) return null
  const marker = match[3]
  const morning = /\b(subah|morning)\b/.test(text) || marker === 'am'
  const evening = /\b(shaam|evening|night|raat)\b/.test(text) || marker === 'pm'
  if (evening && hour < 12) hour += 12
  else if (morning && hour === 12) hour = 0
  else if (!morning && !evening && marker !== 'am' && hour <= 7) hour += 12
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

export function extractOrderId(text: string): string | null {
  const match = text.match(/\b(\d{3,6})\b/)
  return match ? match[1] : null
}

export function extractTitle(text: string): string {
  const withPerson = text.match(/\bwith ([a-z][a-z]+)/)
  if (withPerson && /\b(call|meeting)\b/.test(text)) {
    return `Call with ${capitalize(withPerson[1])}`
  }
  const known = ['dentist', 'standup', 'doctor', 'interview', 'lunch', 'call', 'meeting']
  for (const title of known) {
    if (text.includes(title)) return capitalize(title)
  }
  return 'Meeting'
}

export function extractReminderText(text: string): string {
  const known = text.match(/\b(gym|medicine|dawai|mom|water|class|lunch|standup)\b/)
  return known ? known[1] : 'reminder'
}

export function dayWord(day: DaySlot, language: 'en' | 'hinglish'): string {
  if (language === 'hinglish') {
    if (day === 'today') return 'aaj'
    if (day === 'tomorrow') return 'kal'
    return 'parso'
  }
  if (day === 'today') return 'today'
  if (day === 'tomorrow') return 'tomorrow'
  return 'the day after tomorrow'
}

export function speakTime(hhmm: string, language: 'en' | 'hinglish'): string {
  const [hourStr, minuteStr] = hhmm.split(':')
  const hour = Number(hourStr)
  const minute = Number(minuteStr)
  const hour12 = hour % 12 === 0 ? 12 : hour % 12
  const minuteLabel = minute === 0 ? '' : `:${String(minute).padStart(2, '0')}`
  if (language === 'hinglish') {
    const part = hour < 12 ? 'subah' : hour < 16 ? 'dopahar' : 'shaam'
    return `${part} ${hour12}${minuteLabel} baje`
  }
  const meridiem = hour < 12 ? 'AM' : 'PM'
  return `${hour12}${minuteLabel} ${meridiem}`
}

export function executeTool(
  name: ToolName,
  args: Record<string, string>,
  language: 'en' | 'hinglish',
  world: World
): { summary: string; reply: string } {
  const hi = language === 'hinglish'

  if (name === 'get_weather') {
    const city = args.city || 'there'
    const known = WEATHER[city]
    if (!known) {
      const temp = 18 + (city.charCodeAt(0) % 12)
      const summary = `${city} ~${temp}°C`
      const reply = hi
        ? `${city} abhi lagbhag ${temp}°C hai. Exact forecast mere paas nahi hai.`
        : `${city} is around ${temp}°C. I don't have a tighter forecast than that.`
      return { summary, reply }
    }
    const cond = known.cond[hi ? 1 : 0]
    const outlook = known.out[hi ? 1 : 0]
    const summary = `${city} ${known.temp}°C, ${known.cond[0]}`
    const reply = hi
      ? `${city} abhi ${known.temp}°C hai, ${cond}. ${outlook}`
      : `${city} is ${known.temp}°C and ${cond}. ${outlook}`
    return { summary, reply }
  }

  if (name === 'check_calendar') {
    const day = (args.day || 'today') as DaySlot
    const items = world.calendar.filter((event) => event.day === day)
    const label = dayWord(day, language)
    if (items.length === 0) {
      const reply = hi ? `${capitalize(label)} calendar khali hai.` : `Nothing on the calendar ${label}.`
      return { summary: `${day}: empty`, reply }
    }
    const list = items.map((event) => `${speakTime(event.when, language)} ${event.title}`).join(', ')
    const reply = hi ? `${capitalize(label)}: ${list}.` : `${capitalize(label)}: ${list}.`
    return { summary: `${day}: ${items.length} event${items.length === 1 ? '' : 's'}`, reply }
  }

  if (name === 'book_appointment') {
    const day = (args.day || 'today') as DaySlot
    const when = args.when || '09:00'
    const title = args.title || 'Meeting'
    world.calendar.push({ day, when, title })
    world.calendar.sort((a, b) => a.when.localeCompare(b.when))
    const reply = hi
      ? `Book ho gaya — ${title}, ${dayWord(day, language)} ${speakTime(when, language)}.`
      : `Booked ${title} ${dayWord(day, language)} at ${speakTime(when, language)}.`
    return { summary: `${title} ${day} ${when}`, reply }
  }

  if (name === 'set_reminder') {
    const day = (args.day || 'today') as DaySlot
    const when = args.when || '18:00'
    const text = args.text || 'reminder'
    world.reminders.push({ day, when, text })
    const reply = hi
      ? `Set kar diya — ${text}, ${dayWord(day, language)} ${speakTime(when, language)}.`
      : `Reminder set — ${text}, ${dayWord(day, language)} at ${speakTime(when, language)}.`
    return { summary: `${text} ${day} ${when}`, reply }
  }

  const id = args.id || ''
  const order = ORDERS[id]
  if (!order) {
    const reply = hi ? `Order ${id || 'ye'} nahi mila.` : `I can't find order ${id || 'that'}.`
    return { summary: `order ${id} missing`, reply }
  }
  const reply = hi
    ? `Order ${id} ${order.status[1]} hai. ${order.eta[1]}`
    : `Order ${id} is ${order.status[0]}. ${order.eta[0]}`
  return { summary: `order ${id} ${order.status[0]}`, reply }
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
