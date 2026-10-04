'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const education = {
  institution: 'Indian Institute of Technology Roorkee',
  location: 'Roorkee, India',
  degree: 'B.Tech',
  period: 'Aug 2023 – May 2027',
  coursework: ['Probability & Statistics', 'Linear Algebra', 'Calculus', 'Data Structures & Algorithms', 'Machine Learning', 'Data Science'],
}

const facts = [
  { emoji: '📍', label: 'Roorkee, India' },
  { emoji: '⚡', label: 'Python & TypeScript' },
  { emoji: '🤖', label: 'Applied AI / RAG' },
  { emoji: '📊', label: 'Product & Analytics' },
  { emoji: '☕', label: 'Coffee-powered' },
]

const stats = [
  { value: '10+', label: 'Projects shipped', color: '#14B8A6' },
  { value: '3', label: 'Internships', color: '#22D3EE' },
  { value: '3', label: 'Leadership roles', color: '#F97316' },
  { value: '20+', label: 'Technologies', color: '#10B981' },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export default function AboutSection() {
  return (
    <section id="about" className="py-24 relative" style={{ background: 'var(--bg-section)' }}>
      <style>{`
        .about-card {
          background: var(--bg-card);
          border: 1px solid var(--bg-card-border);
          border-radius: 1.25rem;
          padding: 2rem;
          box-shadow: 0 4px 20px var(--shadow);
          height: 100%;
          transition: border-color 0.35s ease, box-shadow 0.35s ease;
        }
        .about-card:hover {
          border-color: rgba(20, 184, 166, 0.3);
          box-shadow: 0 12px 40px var(--shadow), 0 0 40px rgba(20, 184, 166, 0.08);
        }
        .about-badge {
          background: var(--bg-badge);
          border: 1px solid var(--bg-card-border);
          color: var(--text-secondary);
          padding: 3px 10px;
          border-radius: 8px;
          font-size: 12px;
          font-family: var(--font-nunito), sans-serif;
        }
        .about-fact {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 12.5px;
          font-weight: 600;
          font-family: var(--font-nunito), sans-serif;
          color: var(--text-secondary);
          background: var(--bg-badge);
          border: 1px solid var(--bg-card-border);
          transition: border-color 0.3s ease, transform 0.3s ease, color 0.3s ease;
          cursor: default;
        }
        .about-fact:hover {
          border-color: rgba(20, 184, 166, 0.45);
          color: var(--text-primary);
          transform: translateY(-2px);
        }
        .about-highlight {
          font-weight: 600;
          background-size: 100% 2px;
          background-repeat: no-repeat;
          background-position: 0 100%;
          padding-bottom: 2px;
        }
      `}</style>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 30%, rgba(20,184,166,0.05) 0%, transparent 70%)' }}
      />

      <div className="section-container relative z-10">
        {/* Header */}
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--paint-orange)' }}>
            Background
          </p>
          <h2 className="font-black" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--text-primary)' }}>
            About{' '}
            <span style={{
              background: 'linear-gradient(135deg, var(--paint-orange), var(--paint-yellow))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Me
            </span>
          </h2>
        </motion.div>

        {/* Bio + Education */}
        <motion.div
          className="grid lg:grid-cols-5 gap-6 mb-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Bio */}
          <motion.div className="lg:col-span-3" variants={item}>
            <div className="about-card flex flex-col justify-center">
              <p
                className="font-black mb-5 leading-tight"
                style={{
                  fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                  fontFamily: "var(--font-space-grotesk), 'Inter', sans-serif",
                  color: 'var(--text-primary)',
                }}
              >
                I turn ideas into{' '}
                <span style={{
                  background: 'linear-gradient(120deg, #14B8A6, #0EA5E9, #22D3EE)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  working software
                </span>
                .
              </p>
              <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                3rd-year student at <strong style={{ color: 'var(--text-primary)' }}>IIT Roorkee</strong>.
                Most of my time goes into building software — I gravitate toward{' '}
                <span className="about-highlight" style={{ color: 'var(--paint-purple)', backgroundImage: 'linear-gradient(90deg, var(--paint-purple), transparent)' }}>
                  AI systems
                </span>,{' '}
                <span className="about-highlight" style={{ color: 'var(--paint-blue)', backgroundImage: 'linear-gradient(90deg, var(--paint-blue), transparent)' }}>
                  full-stack apps
                </span>, and anything that pushes what software can do.
              </p>
              <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
                Outside of code, I care about{' '}
                <span className="about-highlight" style={{ color: 'var(--paint-orange)', backgroundImage: 'linear-gradient(90deg, var(--paint-orange), transparent)' }}>
                  product thinking
                </span>{' '}
                — retention, metrics, and building things people come back to.
              </p>

              {/* Fact chips */}
              <div className="flex flex-wrap gap-2">
                {facts.map((fact) => (
                  <span key={fact.label} className="about-fact">
                    <span aria-hidden="true">{fact.emoji}</span>
                    {fact.label}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Education */}
          <motion.div className="lg:col-span-2" variants={item} whileHover={{ y: -4 }}>
            <div className="about-card" style={{ borderColor: 'rgba(20,184,166,0.2)' }}>
              <div
                className="w-14 h-14 rounded-xl overflow-hidden flex items-center justify-center mb-5"
                style={{ background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.2)' }}
              >
                <Image
                  src="/images/indian-institute-of-technology-roorkee-logo.png"
                  alt="IIT Roorkee"
                  width={56} height={56}
                  className="w-full h-full object-contain p-1"
                  unoptimized
                />
              </div>
              <p className="text-[11px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--paint-purple)' }}>
                Education
              </p>
              <h3 className="font-bold text-lg leading-snug" style={{ color: 'var(--text-primary)' }}>
                {education.institution}
              </h3>
              <p className="text-sm mt-1" style={{ color: 'var(--paint-purple)' }}>{education.degree}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                {education.period} · {education.location}
              </p>
              <div className="flex flex-wrap gap-2 mt-5">
                {education.coursework.map((course) => (
                  <span key={course} className="about-badge">{course}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Stat row */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={item}
              whileHover={{ y: -4 }}
              className="rounded-2xl px-6 py-5 text-center"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--bg-card-border)',
                boxShadow: '0 4px 20px var(--shadow)',
              }}
            >
              <p
                className="font-black"
                style={{
                  fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                  fontFamily: "var(--font-space-grotesk), 'Inter', sans-serif",
                  color: stat.color,
                }}
              >
                {stat.value}
              </p>
              <p className="text-xs font-semibold tracking-wide uppercase mt-1" style={{ color: 'var(--text-muted)' }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
