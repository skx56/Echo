const DEVANAGARI: [RegExp, string][] = [
  [/मौसम/g, ' mausam '],
  [/दिल्ली/g, ' delhi '],
  [/मुंबई|मुम्बई/g, ' mumbai '],
  [/बेंगलुरु|बेंगळुरू|बैंगलोर/g, ' bangalore '],
  [/कल/g, ' kal '],
  [/आज/g, ' aaj '],
  [/परसों/g, ' parso '],
  [/सुबह/g, ' subah '],
  [/शाम/g, ' shaam '],
  [/बजे/g, ' baje '],
  [/याद/g, ' yaad '],
  [/बताओ|बता दो/g, ' batao '],
  [/कर दो|करो/g, ' karo '],
  [/अपॉइंटमेंट/g, ' appointment '],
  [/दंत/g, ' dentist '],
]

const HINGLISH =
  /\b(kal|aaj|parso|baje|subah|shaam|dopahar|karo|kar do|batao|mujhe|mera|meri|kya|hai|hain|yaar|nahi|nahin|abhi|yaad|mausam|milte|hoon|gaya|dena|raha|rahi)\b/i

export type Language = 'en' | 'hinglish'

export function normalizeUtterance(raw: string): { text: string; language: Language } {
  let text = raw.trim().toLowerCase()
  const devanagari = /[\u0900-\u097F]/.test(text)
  for (const [pattern, replacement] of DEVANAGARI) text = text.replace(pattern, replacement)
  text = text.replace(/[“”"']/g, '').replace(/\s+/g, ' ').trim()
  const language: Language = devanagari || HINGLISH.test(text) ? 'hinglish' : 'en'
  return { text, language }
}

export function replyIsHinglish(reply: string): boolean {
  return /\b(hai|hain|hoon|gaya|gayi|karo|kar diya|abhi|kal|aaj|baje|nahi|raha|rahi|diya|khol|ho gaya|sheher)\b/i.test(
    reply
  )
}

/** Pull one speakable sentence so TTS can start before the full reply exists. */
export function takeSentence(buffer: string): string | null {
  const match = buffer.match(/^[\s\S]*?[.!?।](?:\s|$)/)
  if (match) return match[0]
  if (buffer.length > 90) {
    const splitAt = buffer.lastIndexOf(' ', 80)
    if (splitAt > 24) return buffer.slice(0, splitAt + 1)
  }
  return null
}

/** Drop recognizer transcripts that are the agent's own voice leaking into the mic. */
export function overlapsAgent(heard: string, spoken: string): boolean {
  if (!spoken.trim()) return false
  const heardWords = heard
    .toLowerCase()
    .split(/\W+/)
    .filter((word) => word.length > 3)
  const spokenWords = new Set(
    spoken
      .toLowerCase()
      .split(/\W+/)
      .filter((word) => word.length > 3)
  )
  if (heardWords.length < 3) return false
  const hits = heardWords.filter((word) => spokenWords.has(word)).length
  return hits / heardWords.length > 0.6
}
