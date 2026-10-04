/**
 * G.711 μ-law. Twilio Media Streams sends 8 kHz audio in 20 ms frames (160 bytes).
 * Silence encodes to 0xFF.
 */
const BIAS = 0x84
const CLIP = 32635

export function linearToMulaw(sample: number): number {
  let sign = 0
  let magnitude = sample
  if (magnitude < 0) {
    magnitude = -magnitude
    sign = 0x80
  }
  if (magnitude > CLIP) magnitude = CLIP
  magnitude += BIAS
  let exponent = 7
  for (let mask = 0x4000; (magnitude & mask) === 0 && exponent > 0; exponent -= 1, mask >>= 1) {
    /* walk the exponent */
  }
  const mantissa = (magnitude >> (exponent + 3)) & 0x0f
  return (~(sign | (exponent << 4) | mantissa)) & 0xff
}

export type MulawBurst = {
  frames: number
  bytes: number
  samplePayload: string
}

/** Encode a short voiced burst into 20 ms μ-law frames and return the first payload. */
export function encodeSpeechFrames(durationMs: number): MulawBurst {
  const sampleRate = 8000
  const frameSamples = 160
  const total = Math.max(frameSamples, Math.round((durationMs / 1000) * sampleRate))
  const frames = Math.ceil(total / frameSamples)
  let samplePayload = ''

  for (let frame = 0; frame < frames; frame += 1) {
    const payload = new Uint8Array(frameSamples)
    for (let i = 0; i < frameSamples; i += 1) {
      const t = (frame * frameSamples + i) / sampleRate
      const env = Math.sin(Math.PI * Math.min(1, t / (durationMs / 1000)))
      const pcm = Math.round(
        env * (Math.sin(2 * Math.PI * 140 * t) * 9000 + Math.sin(2 * Math.PI * 280 * t) * 3500)
      )
      payload[i] = linearToMulaw(pcm)
    }
    if (frame === 0) {
      samplePayload = bytesToBase64(payload.subarray(0, 24)) + '…'
    }
  }

  return { frames, bytes: frames * frameSamples, samplePayload }
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i])
  if (typeof btoa === 'function') return btoa(binary)
  return Buffer.from(bytes).toString('base64')
}
