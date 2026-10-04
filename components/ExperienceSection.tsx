'use client'

import { useEffect, useRef } from 'react'
import { FiExternalLink, FiMapPin, FiCalendar } from 'react-icons/fi'

const experiences = [
  {
    company: 'Edden Internet Pvt. Ltd.',
    url: 'https://www.linkedin.com/in/saksham-ojha-472706292/',
    role: 'AI/ML Engineering Intern',
    period: 'Dec 2024 – Jan 2025',
    location: 'Remote',
    color: '#22D3EE',
    colorB: '#38BDF8',
    current: false,
    points: [
      'Contributed to end-to-end automation of short-form video creation using GenAI — research, scripting, and synthesis workflows.',
      'Built and integrated ML pipelines to personalize content recommendations and boost engagement across platforms.',
      'Collaborated with cross-functional teams to streamline product workflows and accelerate AI feature rollouts.',
    ],
    tags: ['GenAI', 'ML Pipelines', 'Recommendations', 'Product'],
  },
  {
    company: 'SR Medicare Pvt. Ltd.',
    url: 'https://www.linkedin.com/in/saksham-ojha-472706292/',
    role: 'Data Analytics Intern',
    period: '2024',
    location: 'India',
    color: '#38BDF8',
    colorB: '#14B8A6',
    current: false,
    points: [
      'Optimized inventory and costing data to improve procurement decisions, lifting product margins by ~15%.',
      'Built automated MIS dashboards to track sales performance, reducing manual reporting effort by ~75%.',
      'Improved supply-chain efficiency by monitoring export timelines and raising inventory turnover by ~10%.',
    ],
    tags: ['Analytics', 'Dashboards', 'SQL', 'MIS'],
  },
  {
    company: 'Vary Gaming',
    url: 'https://www.linkedin.com/in/saksham-ojha-472706292/',
    role: 'Growth Intern',
    period: '2024',
    location: 'Remote',
    color: '#F97316',
    colorB: '#FBBF24',
    current: false,
    points: [
      'Boosted reach by 20% through digital campaigns in partnership with marketing and product teams.',
      'Improved campaign performance by analyzing 5+ KPIs with Google Analytics and Excel.',
      'Refined brand positioning via market and competitor research across 3 verticals.',
    ],
    tags: ['Growth', 'Google Analytics', 'Campaigns', 'KPIs'],
  },
]

export default function ExperienceSection() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )
    root.querySelectorAll('.reveal').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section id="experience" className="py-24 relative" style={{ background: 'var(--bg-section)' }}>
      <style>{`
        .exp-timeline {
          position: relative;
          max-width: 860px;
          margin: 0 auto;
        }
        .exp-timeline::before {
          content: '';
          position: absolute;
          left: 11px;
          top: 8px;
          bottom: 8px;
          width: 2px;
          background: linear-gradient(180deg, #22D3EE, #38BDF8, #14B8A6, transparent);
          opacity: 0.4;
          border-radius: 2px;
        }
        @media (min-width: 640px) {
          .exp-timeline::before { left: 15px; }
        }

        .exp-item {
          position: relative;
          padding-left: 44px;
          margin-bottom: 3rem;
        }
        @media (min-width: 640px) {
          .exp-item { padding-left: 60px; }
        }
        .exp-item:last-child { margin-bottom: 0; }

        .exp-dot {
          position: absolute;
          left: 0;
          top: 8px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: grid;
          place-content: center;
          background: var(--bg);
          border: 2px solid var(--dot-color);
          box-shadow: 0 0 16px color-mix(in srgb, var(--dot-color) 45%, transparent);
          z-index: 1;
        }
        @media (min-width: 640px) {
          .exp-dot { width: 32px; height: 32px; }
        }
        .exp-dot::after {
          content: '';
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--dot-color);
        }
        .exp-dot.exp-dot-current::after {
          animation: expPulse 2s ease-in-out infinite;
        }
        @keyframes expPulse {
          0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--dot-color) 55%, transparent); }
          50% { box-shadow: 0 0 0 7px transparent; }
        }

        .exp-card {
          background: var(--bg-card);
          border: 1px solid var(--bg-card-border);
          border-radius: 1.25rem;
          padding: 1.75rem;
          box-shadow: 0 4px 24px var(--shadow);
          transition: border-color 0.35s ease, box-shadow 0.35s ease, transform 0.35s ease;
          position: relative;
          overflow: hidden;
        }
        .exp-card::before {
          content: '';
          position: absolute;
          inset: 0 auto 0 0;
          width: 3px;
          background: linear-gradient(180deg, var(--accent-a), var(--accent-b));
          opacity: 0.7;
        }
        .exp-card:hover {
          transform: translateY(-4px);
          border-color: color-mix(in srgb, var(--accent-a) 40%, transparent);
          box-shadow: 0 12px 40px var(--shadow), 0 0 40px color-mix(in srgb, var(--accent-a) 12%, transparent);
        }

        .exp-company-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-weight: 800;
          font-size: 1.05rem;
          text-decoration: none;
          background: linear-gradient(90deg, var(--accent-a), var(--accent-b));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transition: filter 0.3s ease;
        }
        .exp-company-link:hover { filter: brightness(1.25); }
        .exp-company-link svg {
          color: var(--accent-a);
          -webkit-text-fill-color: initial;
          opacity: 0.75;
        }

        .exp-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 999px;
          color: var(--text-muted);
          border: 1px solid var(--bg-card-border);
          background: var(--bg-badge);
          font-family: var(--font-nunito), sans-serif;
          white-space: nowrap;
        }
        .exp-chip-current {
          color: #10B981;
          border-color: rgba(16, 185, 129, 0.35);
          background: rgba(16, 185, 129, 0.08);
        }
        .exp-chip-current .exp-live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10B981;
          animation: expPulse 2s ease-in-out infinite;
          --dot-color: #10B981;
        }

        .exp-tag {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 8px;
          color: var(--accent-a);
          background: color-mix(in srgb, var(--accent-a) 9%, transparent);
          border: 1px solid color-mix(in srgb, var(--accent-a) 28%, transparent);
        }

        .exp-point {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }
        .exp-point-dot {
          margin-top: 7px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
          background: linear-gradient(135deg, var(--accent-a), var(--accent-b));
        }
      `}</style>

      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 20% 40%, rgba(34,211,238,0.05) 0%, transparent 70%)' }}
      />

      <div className="section-container relative z-10" ref={rootRef}>
        {/* Header */}
        <div className="mb-16 text-center reveal">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-4" style={{ color: '#22D3EE' }}>
            Where I&apos;ve Worked
          </p>
          <h2 className="font-black" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--text-primary)' }}>
            Work{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #22D3EE, #38BDF8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Experience
            </span>
          </h2>
        </div>

        {/* Timeline */}
        <div className="exp-timeline">
          {experiences.map((exp, idx) => (
            <div
              key={exp.company}
              className="exp-item reveal"
              style={{ transitionDelay: `${idx * 0.12}s` } as React.CSSProperties}
            >
              <div
                className={`exp-dot ${exp.current ? 'exp-dot-current' : ''}`}
                style={{ '--dot-color': exp.color } as React.CSSProperties}
              />

              <div
                className="exp-card"
                style={{ '--accent-a': exp.color, '--accent-b': exp.colorB } as React.CSSProperties}
              >
                {/* Top row: role + company / period + location */}
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="font-black text-xl sm:text-2xl leading-tight" style={{ color: 'var(--text-primary)' }}>
                      {exp.role}
                    </h3>
                    <a
                      href={exp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="exp-company-link mt-1"
                    >
                      {exp.company}
                      <FiExternalLink size={13} />
                    </a>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {exp.current && (
                      <span className="exp-chip exp-chip-current">
                        <span className="exp-live-dot" />
                        Current
                      </span>
                    )}
                    <span className="exp-chip">
                      <FiCalendar size={11} />
                      {exp.period}
                    </span>
                    <span className="exp-chip">
                      <FiMapPin size={11} />
                      {exp.location}
                    </span>
                  </div>
                </div>

                {/* Bullet points */}
                <ul className="space-y-3 mb-5">
                  {exp.points.map((point, i) => (
                    <li key={i} className="exp-point">
                      <span className="exp-point-dot" />
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {point}
                      </p>
                    </li>
                  ))}
                </ul>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {exp.tags.map((tag) => (
                    <span key={tag} className="exp-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
