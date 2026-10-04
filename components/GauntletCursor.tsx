'use client'

import { useEffect } from 'react'

const BUBBLE_COLORS = ['#ef4444', '#0ea5e9', '#22c55e', '#f97316']
const SIZE = 56

function removeWhiteBg(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const d = ctx.getImageData(0, 0, w, h)
  for (let i = 0; i < d.data.length; i += 4) {
    const r = d.data[i], g = d.data[i + 1], b = d.data[i + 2]
    if (r > 210 && g > 210 && b > 210) d.data[i + 3] = 0
  }
  ctx.putImageData(d, 0, 0)
}

export default function GauntletCursor() {
  useEffect(() => {
    // Skip on touch devices — mobile users don't need a custom cursor
    if (window.matchMedia('(pointer: coarse)').matches) return

    document.getElementById('gc-root')?.remove()
    document.getElementById('gc-style')?.remove()
    document.getElementById('gc-glow')?.remove()

    const style = document.createElement('style')
    style.id = 'gc-style'
    style.textContent = `
      *, *::before, *::after { cursor: none !important; }
      #gc-root {
        position: fixed; top: 0; left: 0;
        pointer-events: none; z-index: 99999;
        will-change: transform;
        margin-left: -8px; margin-top: -4px;
        transition: opacity 0.15s ease;
      }
      #gc-root canvas {
        display: block;
        filter: drop-shadow(0 2px 8px rgba(20,184,166,0.45));
      }
      #gc-glow {
        position: fixed; top: 0; left: 0;
        width: 28px; height: 28px;
        margin-left: -14px; margin-top: -14px;
        border-radius: 50%;
        pointer-events: none; z-index: 99997;
        background: radial-gradient(circle, rgba(20,184,166,0.5), rgba(34,211,238,0.18) 55%, transparent 72%);
        filter: blur(5px);
        will-change: transform;
        transition: opacity 0.15s ease;
      }
      .gc-bubble {
        position: fixed; pointer-events: none;
        z-index: 99998; border-radius: 50%; opacity: 0;
      }
      .gc-ring {
        position: fixed; pointer-events: none;
        z-index: 99998; border-radius: 50%;
        border: 2px solid rgba(20,184,166,0.85);
        width: 14px; height: 14px;
        opacity: 0;
      }
    `
    document.head.appendChild(style)

    const wrap = document.createElement('div')
    wrap.id = 'gc-root'

    const glow = document.createElement('div')
    glow.id = 'gc-glow'
    glow.style.opacity = '0'

    const canvas = document.createElement('canvas')
    canvas.width = SIZE
    canvas.height = SIZE
    wrap.appendChild(canvas)
    document.body.appendChild(glow)
    document.body.appendChild(wrap)

    const ctx = canvas.getContext('2d')!

    const gif = new Image()
    gif.src = '/gauntlet-2.gif'

    let mx = -400, my = -400, raf = 0
    let gx = -400, gy = -400
    let curScale = 1, targetScale = 1
    let snapping = false
    let snapEndTime = 0
    let gifReady = false
    let onScreen = false

    const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label, summary'

    const freezeFrame = () => {
      ctx.clearRect(0, 0, SIZE, SIZE)
      ctx.drawImage(gif, 0, 0, SIZE, SIZE)
      removeWhiteBg(ctx, SIZE, SIZE)
    }

    gif.onload = () => {
      gifReady = true
      freezeFrame()
    }

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      if (!onScreen) {
        onScreen = true
        gx = mx
        gy = my
        wrap.style.opacity = '1'
        glow.style.opacity = '1'
      }
    }

    const onLeave = () => {
      onScreen = false
      wrap.style.opacity = '0'
      glow.style.opacity = '0'
    }

    // Grow the gauntlet slightly over anything clickable
    const onOver = (e: MouseEvent) => {
      const el = e.target instanceof Element ? e.target : null
      targetScale = el?.closest(INTERACTIVE) ? 1.22 : 1
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    document.addEventListener('mouseleave', onLeave)

    const tick = () => {
      curScale += (targetScale - curScale) * 0.18
      wrap.style.transform = `translate(${mx}px, ${my}px) scale(${curScale.toFixed(3)})`

      // Glow trails behind the gauntlet with a soft lag
      gx += (mx - gx) * 0.16
      gy += (my - gy) * 0.16
      glow.style.transform = `translate(${gx.toFixed(1)}px, ${gy.toFixed(1)}px)`

      if (snapping && gifReady) {
        const now = performance.now()
        if (now < snapEndTime) {
          ctx.clearRect(0, 0, SIZE, SIZE)
          ctx.drawImage(gif, 0, 0, SIZE, SIZE)
          removeWhiteBg(ctx, SIZE, SIZE)
        } else {
          snapping = false
          gif.src = '/gauntlet-2.gif'
          setTimeout(freezeFrame, 60)
        }
      }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const onDown = () => {
      if (!gifReady) return

      // Press squash — the lerp in tick() eases it back to targetScale
      curScale = 0.8

      gif.src = ''
      requestAnimationFrame(() => {
        gif.src = '/gauntlet-2.gif'
        snapping = true
        snapEndTime = performance.now() + 900
      })

      // Snap shockwave ring
      const ring = document.createElement('div')
      ring.className = 'gc-ring'
      ring.style.left = `${mx}px`
      ring.style.top = `${my}px`
      document.body.appendChild(ring)
      ring.animate([
        { transform: 'translate(-50%,-50%) scale(0.6)', opacity: 0.9, borderColor: 'rgba(20,184,166,0.9)' },
        { transform: 'translate(-50%,-50%) scale(6)', opacity: 0, borderColor: 'rgba(34,211,238,0.4)' },
      ], { duration: 520, easing: 'cubic-bezier(0.22,1,0.36,1)', fill: 'forwards' })
        .onfinish = () => ring.remove()

      for (let i = 0; i < 8; i++) {
        const b = document.createElement('div')
        b.className = 'gc-bubble'
        const color = BUBBLE_COLORS[i % BUBBLE_COLORS.length]
        const sz = 6 + Math.random() * 6
        const angle = (i / 8) * Math.PI * 2 + Math.random() * 0.5
        const dist = 28 + Math.random() * 36
        const dx = Math.cos(angle) * dist
        const dy = Math.sin(angle) * dist
        b.style.cssText = `
          width:${sz}px; height:${sz}px;
          background:${color};
          left:${mx}px; top:${my}px;
          box-shadow:0 0 6px 2px ${color};
          transform:translate(-50%,-50%) scale(0)
        `
        document.body.appendChild(b)
        b.animate([
          { transform: 'translate(-50%,-50%) scale(0)', opacity: 1 },
          { transform: `translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(1)`, opacity: 1, offset: 0.4 },
          { transform: `translate(calc(-50% + ${dx * 1.4}px),calc(-50% + ${dy * 1.4}px)) scale(0.3)`, opacity: 0 },
        ], { duration: 550 + Math.random() * 200, easing: 'ease-out', fill: 'forwards' })
          .onfinish = () => b.remove()
      }
    }

    window.addEventListener('mousedown', onDown)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseleave', onLeave)
      wrap.remove()
      glow.remove()
      style.remove()
      document.querySelectorAll('.gc-bubble, .gc-ring').forEach(b => b.remove())
    }
  }, [])

  return null
}
