export type VadHandle = {
  stop: () => void
}

export function startVad(
  stream: MediaStream,
  handlers: {
    onLevel: (rms: number) => void
    onSpeechStart: (onset: number) => boolean
    agentIsLoud: () => boolean
  }
): VadHandle {
  const AudioCtx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioCtx) return { stop: () => undefined }

  const ctx = new AudioCtx()
  const source = ctx.createMediaStreamSource(stream)
  const analyser = ctx.createAnalyser()
  analyser.fftSize = 1024
  source.connect(analyser)
  const data = new Uint8Array(analyser.fftSize)

  let noise = 0.012
  let hotFrames = 0
  let armed = false
  let onset = 0
  let frame = 0

  const loop = () => {
    analyser.getByteTimeDomainData(data)
    let sum = 0
    for (let i = 0; i < data.length; i += 1) {
      const sample = (data[i] - 128) / 128
      sum += sample * sample
    }
    const rms = Math.sqrt(sum / data.length)
    handlers.onLevel(Math.min(1, rms * 5))

    if (rms < noise * 1.5) noise = noise * 0.96 + rms * 0.04
    const speaking = handlers.agentIsLoud()
    const threshold = Math.min(0.22, Math.max(0.04, noise * (speaking ? 4.8 : 3.2)))

    if (rms > threshold) {
      if (hotFrames === 0) onset = performance.now()
      hotFrames += 1
      // Don't latch during TTS grace — keep testing until the session accepts the barge.
      if (!armed && hotFrames >= 4 && handlers.onSpeechStart(onset)) armed = true
    } else {
      hotFrames = 0
      if (rms < threshold * 0.65) armed = false
    }

    frame = requestAnimationFrame(loop)
  }

  frame = requestAnimationFrame(loop)

  return {
    stop: () => {
      cancelAnimationFrame(frame)
      source.disconnect()
      void ctx.close()
      stream.getTracks().forEach((track) => track.stop())
    },
  }
}
