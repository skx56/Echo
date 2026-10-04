'use client'

import { useEffect, useState } from 'react'
import CoffeeButton from '@/components/CoffeeButton'
import { useTheme } from '@/context/ThemeContext'

export default function PaintHero() {
  const [showName, setShowName] = useState(false)
  const [showSubtitle, setShowSubtitle] = useState(false)
  const [showScroll, setShowScroll] = useState(false)
  const { theme } = useTheme()
  const isLight = theme === 'light'

  useEffect(() => {
    const t1 = setTimeout(() => setShowName(true), 300)
    const t2 = setTimeout(() => setShowSubtitle(true), 800)
    const t3 = setTimeout(() => setShowScroll(true), 1400)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [])

  return (
    <section className="relative w-full h-screen overflow-hidden" id="home">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(20,184,166,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 20%, rgba(14,165,233,0.08) 0%, transparent 50%), var(--bg)',
        }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(var(--divider) 1px, transparent 1px), linear-gradient(90deg, var(--divider) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Drifting aurora glow */}
      <div className="hero-aurora hero-aurora-1" />
      <div className="hero-aurora hero-aurora-2" />

      {/* Hero text overlay */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center z-10"
        style={{ paddingTop: '6vh' }}
      >
        {/* Name + Coffee Button */}
        <div
          className={`flex items-center justify-center gap-5 flex-wrap px-4 transition-all duration-1000 ${
            showName ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h1
            className="font-black text-center leading-none select-none"
            style={{
              fontSize: 'clamp(2.4rem, 9vw, 8.5rem)',
              letterSpacing: '-0.03em',
              fontFamily: "var(--font-space-grotesk), 'Inter', sans-serif",
              background:
                'linear-gradient(120deg, var(--text-primary) 0%, #14B8A6 45%, #0EA5E9 70%, #22D3EE 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 40px rgba(20,184,166,0.25))',
            }}
          >
            Saksham Ojha
          </h1>

          {/* Coffee button — hidden on phones */}
          <div className="hidden sm:block" style={{ transform: 'rotate(-6deg)', flexShrink: 0 }}>
            <CoffeeButton />
          </div>
        </div>

        {/* Minimal decorative line */}
        {showName && (
          <div className="flex items-center gap-3 mt-5 mb-5">
            <div
              className="h-[1px] w-16"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(20,184,166,0.5))',
              }}
            />
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#14B8A6' }}
            />
            <div
              className="h-[1px] w-16"
              style={{
                background:
                  'linear-gradient(90deg, rgba(20,184,166,0.5), transparent)',
              }}
            />
          </div>
        )}

        {/* Subtitle */}
        <div
          className={`transition-all duration-1000 delay-200 ${
            showSubtitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <p
            className="text-center font-medium tracking-[0.22em] uppercase"
            style={{
              fontFamily: "var(--font-space-grotesk), 'Inter', sans-serif",
              fontSize: 'clamp(0.8rem, 2.2vw, 1.25rem)',
              backgroundImage: isLight
                ? 'linear-gradient(90deg, #0f766e, #0284c7, #0f766e)'
                : 'linear-gradient(90deg, #a5f3fc, #38bdf8, #99f6e4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: isLight
                ? 'drop-shadow(0 1px 2px rgba(15,118,110,0.2))'
                : 'drop-shadow(0 0 18px rgba(129,140,248,0.5)) drop-shadow(0 0 40px rgba(165,243,252,0.2))',
              letterSpacing: '0.22em',
            }}
          >
            Full-Stack &amp; Applied AI Developer
          </p>
          <p
            className="text-center mt-2"
            style={{
              fontFamily: "var(--font-inter), 'Inter', sans-serif",
              fontSize: 'clamp(0.7rem, 1.5vw, 0.95rem)',
              color: 'var(--text-muted)',
              letterSpacing: '0.12em',
            }}
          >
            IIT Roorkee · B.Tech 2027
          </p>
        </div>

        {/* CTA Buttons */}
        {showSubtitle && (
          <div
            className="flex flex-col sm:flex-row gap-4 mt-8 justify-center items-center px-6"
            style={{ animation: 'fadeInUp 0.8s ease 0.2s both' }}
          >
            <a
              href="#projects"
              className="px-8 py-3 rounded-full font-semibold text-sm tracking-wide transition-all duration-300 hover:scale-105"
              style={{
                fontFamily: "var(--font-space-grotesk), 'Inter', sans-serif",
                background: 'linear-gradient(135deg, #14B8A6, #0EA5E9 70%, #22D3EE)',
                color: 'white',
                boxShadow: '0 0 30px rgba(20,184,166,0.4), 0 0 60px rgba(34,211,238,0.15)',
              }}
            >
              View Projects
            </a>
            <a
              href="mailto:sakshamojha96@gmail.com"
              className="px-8 py-3 rounded-full font-semibold text-sm tracking-wide transition-all duration-300 hover:scale-105"
              style={{
                fontFamily: "var(--font-space-grotesk), 'Inter', sans-serif",
                border: '2px solid rgba(15,118,110,0.35)',
                background: isLight ? 'rgba(15,118,110,0.06)' : 'rgba(255,255,255,0.06)',
                color: 'var(--text-primary)',
                backdropFilter: 'blur(10px)',
              }}
            >
              Get in Touch
            </a>
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      {showScroll && (
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
          style={{ animation: 'fadeIn 1s ease both' }}
        >
          <span
            className="text-xs tracking-widest uppercase"
            style={{ color: 'var(--text-label)' }}
          >
            Scroll
          </span>
          <div
            className="w-6 h-10 rounded-full border flex items-start justify-center pt-2"
            style={{ borderColor: 'var(--bg-card-border)' }}
          >
            <div
              className="w-1 h-3 rounded-full"
              style={{
                background: 'linear-gradient(180deg, #14B8A6, transparent)',
                animation: 'float 1.5s ease-in-out infinite',
              }}
            />
          </div>
        </div>
      )}
    </section>
  )
}
