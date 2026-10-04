'use client'

import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'
import ProfileCard from '@/components/ProfileCard'

export default function ContactSection() {
  return (
    <section id="contact" className="py-24 relative" style={{ background: 'var(--bg-section)' }}>
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(20,184,166,0.07) 0%, transparent 70%)' }}
      />

      <div className="section-container relative z-10">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--paint-red)' }}>
            Let&apos;s Connect
          </p>
          <h2
            className="font-black mb-6"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--text-primary)' }}
          >
            Get in{' '}
            <span style={{
              background: 'linear-gradient(135deg, var(--paint-red), var(--paint-purple))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Touch
            </span>
          </h2>
          <p className="max-w-xl mx-auto text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            I&apos;m open to full-time roles, internships, and interesting projects.
            Feel free to reach out — I&apos;d love to chat!
          </p>
        </div>

        {/* Enlarged ProfileCard — full width, centered */}
        <div className="flex justify-center mb-12">
          <ProfileCard enlarged />
        </div>

        {/* Quick social links row */}
        <div className="flex flex-wrap justify-center gap-6 mb-16">
          {[
            { icon: FiMail, label: 'sakshamojha96@gmail.com', href: 'mailto:sakshamojha96@gmail.com', color: 'var(--paint-red)' },
            { icon: FiGithub, label: 'github.com/skx56', href: 'https://github.com/skx56', color: 'var(--paint-purple)' },
            { icon: FiLinkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/saksham-ojha-472706292/', color: 'var(--paint-blue)' },
          ].map(({ icon: Icon, label, href, color }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="flex items-center gap-3 px-5 py-3 rounded-full transition-all duration-300 hover:scale-105"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--bg-card-border)',
                color: 'var(--text-secondary)',
                boxShadow: '0 2px 12px var(--shadow)',
              }}
            >
              <Icon size={18} style={{ color }} />
              <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>{label}</span>
            </a>
          ))}
        </div>

        {/* Footer */}
        <div
          className="pt-10 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: 'var(--divider)' }}
        >
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            © 2026 Saksham Ojha · Built with Next.js + TypeScript
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Open to opportunities
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
