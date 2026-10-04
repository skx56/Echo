import { isAbortError, sleep } from '@/lib/echo/metrics'

export type Speaker = (
  text: string,
  signal: AbortSignal,
  onStart: () => void,
  onLevel: (level: number) => void
) => Promise<void>

let lastCancelAt = 0

export const virtualSpeak: Speaker = async (text, signal, onStart, onLevel) => {
  await sleep(28, signal)
  onStart()
  // Long enough to interrupt, short enough that the bench finishes in a few seconds.
  const duration = Math.min(420, 180 + text.length * 3)
  const steps = 5
  for (let step = 0; step < steps; step += 1) {
    onLevel(0.28 + ((step * 37) % 50) / 100)
    await sleep(duration / steps, signal)
  }
  onLevel(0)
}

export const browserSpeak: Speaker = async (text, signal, onStart, onLevel) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    await virtualSpeak(text, signal, onStart, onLevel)
    return
  }

  const sinceCancel = performance.now() - lastCancelAt
  if (sinceCancel < 80) await sleep(80 - sinceCancel, signal)

  await new Promise<void>((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1.05
    const hinglish = /\b(hai|hoon|gaya|baje|kal|abhi|raha|rahi|diya)\b/i.test(text)
    utterance.lang = hinglish ? 'hi-IN' : 'en-IN'
    const voices = window.speechSynthesis.getVoices()
    const voice =
      voices.find((item) => item.lang === utterance.lang) ||
      voices.find((item) => item.lang?.toLowerCase().startsWith(hinglish ? 'hi' : 'en'))
    if (voice) utterance.voice = voice

    let settled = false
    let levelTimer = 0
    const finish = () => {
      if (settled) return
      settled = true
      clearInterval(levelTimer)
      clearTimeout(guard)
      signal.removeEventListener('abort', onAbort)
      onLevel(0)
      resolve()
    }
    const onAbort = () => {
      lastCancelAt = performance.now()
      window.speechSynthesis.cancel()
      finish()
    }
    const guard = setTimeout(finish, 12000)

    signal.addEventListener('abort', onAbort, { once: true })
    utterance.onstart = () => {
      onStart()
      levelTimer = window.setInterval(() => onLevel(0.3 + Math.random() * 0.5), 80)
    }
    utterance.onend = finish
    utterance.onerror = () => finish()
    window.speechSynthesis.resume()
    window.speechSynthesis.speak(utterance)
  }).catch((error) => {
    if (isAbortError(error)) throw error
  })
}
