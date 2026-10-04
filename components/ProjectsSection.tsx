'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FiGithub, FiGlobe } from 'react-icons/fi'
import { FaUsers, FaShareAlt, FaRobot, FaSlack, FaFileAlt, FaVideo, FaLink, FaDatabase, FaMicrophone } from 'react-icons/fa'

interface Project {
  id: string
  title: string
  shortTitle: string
  icon: React.ReactNode
  tagline: string
  description: string[]
  tech: string[]
  color: string
  github?: string
  live?: string
  accentColor: string
  emoji?: string
  headerPattern?: string
  headerPatternSize?: string
  headerGlow?: string
}

const projects: Project[] = [
  {
    id: 'echo',
    title: 'Echo — Real-Time Voice Agent',
    shortTitle: 'Echo',
    icon: <FaMicrophone />,
    tagline: 'Barge-in aborts in-flight tools and TTS',
    description: [
      'Built a duplex voice session where a new utterance cancels the current generation — the agent stream, the TTS queue, and a Twilio clear so buffered carrier audio stops.',
      'Flushes an acknowledgement to speech on the first sentence while tools are still running, and records caller TTFA plus barge-in stop latency as p50/p95 on the session itself.',
      'One runtime serves a WebRTC mic and a 20ms μ-law Media Streams leg, with a Hinglish bench for intent, slots, reply language, and repair after interruption.',
    ],
    tech: ['TypeScript', 'WebRTC', 'Twilio', 'VAD', 'Tool calling', 'TTS'],
    color: 'from-cyan-400 via-sky-500 to-indigo-500',
    accentColor: '#22D3EE',
    live: '/echo',
    emoji: '🎙️',
    headerPattern:
      'repeating-linear-gradient(90deg, rgba(255,255,255,0.18) 0 2px, transparent 2px 14px), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.35) 0 1px, transparent 1.5px)',
    headerPatternSize: '100% 100%, 22px 22px',
    headerGlow:
      'radial-gradient(circle at 15% 20%, rgba(255,255,255,0.35), transparent 42%), radial-gradient(circle at 90% 80%, rgba(99,102,241,0.45), transparent 46%)',
  },
  {
    id: 'grain',
    title: 'Grain — SQL Agent That Shows Its Work',
    shortTitle: 'Grain',
    icon: <FaDatabase />,
    tagline: 'Lock the metric, the join, and the grain — then run the query',
    description: [
      'Built an in-browser SQL agent that will not return a number until it locks a metric definition, the join path, and the grain of the result.',
      'Seeded Harbor & Co. with split payments, soft deletes, tag fan-out, and a UTC versus IST quarter boundary so the rejected query and the defended query disagree on purpose.',
      'Ran both queries in SQLite compiled to WebAssembly, with natural language mapped to defended queries rather than concatenated into SQL.',
    ],
    tech: ['TypeScript', 'SQLite WASM', 'Next.js', 'SQL'],
    color: 'from-indigo-500 via-violet-500 to-cyan-500',
    accentColor: '#818CF8',
    github: 'https://github.com/skx56/Grain',
    live: 'https://skx56.github.io/Grain/',
    emoji: '◆',
    headerPattern:
      'linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)',
    headerPatternSize: '22px 22px, 22px 22px',
    headerGlow:
      'radial-gradient(circle at 12% 18%, rgba(255,255,255,0.3), transparent 42%), radial-gradient(circle at 88% 82%, rgba(129,140,248,0.38), transparent 46%)',
  },
  {
    id: 'together',
    title: 'Together — Shared Spaces',
    shortTitle: 'Together',
    icon: <FaUsers />,
    tagline: 'Tasks, events, notes & chat — organized by space',
    description: [
      'Built a full-stack coordination app that turns messy group chat into clear ownership — isolated spaces for family, friends, and work crews with tasks, calendar, notes, and threaded chat.',
      'Shipped natural-language “Tell Together” intent parsing for events and tasks, plus Clerk auth, Neon Postgres, Prisma, invites, and optional Resend assignment emails.',
      'Designed day/night themes and a PWA-ready Next.js shell deployed on Vercel for the OpenAI Hackathon.',
    ],
    tech: ['Next.js', 'TypeScript', 'Clerk', 'Prisma', 'Neon', 'Resend', 'Vercel'],
    color: 'from-emerald-500 via-teal-500 to-cyan-500',
    accentColor: '#14B8A6',
    github: 'https://github.com/skx56/Together',
    live: 'https://together-app-blue.vercel.app/',
    emoji: '🤝',
    headerPattern:
      'radial-gradient(circle at 25% 35%, rgba(255,255,255,0.18) 0 2px, transparent 2.5px), radial-gradient(circle at 70% 15%, rgba(255,255,255,0.14) 0 2px, transparent 2.5px), linear-gradient(60deg, rgba(255,255,255,0.06) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.06) 75%, transparent 75%, transparent)',
    headerPatternSize: '30px 30px, 48px 48px, 90px 90px',
    headerGlow:
      'radial-gradient(circle at 10% 15%, rgba(255,255,255,0.32), transparent 40%), radial-gradient(circle at 90% 80%, rgba(20,184,166,0.3), transparent 45%)',
  },
  {
    id: 'wshare',
    title: 'wShare — P2P File Sharing',
    shortTitle: 'wShare',
    icon: <FaShareAlt />,
    tagline: 'Encrypted browser-to-browser transfers, no server payload',
    description: [
      'Built a direct peer-to-peer file sharing app that transfers encrypted files between browsers without routing payloads through a central server.',
      'Designed a lightweight WebRTC-based flow for discovery, connection, and secure transfer with a clean Vite + JavaScript frontend.',
      'Deployed a production demo on Vercel for instant share links and fast room setup.',
    ],
    tech: ['JavaScript', 'WebRTC', 'Vite', 'Encryption', 'Vercel'],
    color: 'from-sky-600 to-cyan-500',
    accentColor: '#0EA5E9',
    github: 'https://github.com/skx56/wShare',
    live: 'https://w-share.vercel.app',
    emoji: '🔗',
  },
  {
    id: 'docuquery',
    title: 'Docuquery — Semantic RAG Q&A',
    shortTitle: 'Docuquery',
    icon: <FaFileAlt />,
    tagline: 'Ask documents — embeddings, retrieval, grounded answers',
    description: [
      'Built a semantic document search system with OCR/PDF extraction, chunking, and embeddings for efficient information retrieval over large corpora.',
      'Implemented FAISS-backed retrieval with embeddings and a transformer pipeline for context-aware answers.',
      'Developed under Tinkering Lab, IIT Roorkee as a practical RAG stack for unstructured files.',
    ],
    tech: ['Python', 'RAG', 'FAISS', 'Embeddings', 'OCR'],
    color: 'from-teal-600 to-emerald-500',
    accentColor: '#14B8A6',
    github: 'https://github.com/skx56/Docuquery',
    emoji: '📄',
  },
  {
    id: 'relay',
    title: 'Relay — Slack Incident Commander',
    shortTitle: 'Relay AI',
    icon: <FaSlack />,
    tagline: 'Severity message → structured incident response',
    description: [
      'Built a Slack-native incident coordination system that turns a severity message into structured response, ownership, status updates, and postmortem output.',
      'Modeled ownership, severity workflows, and status tracking so on-call teams can run incidents without leaving Slack.',
      'Shipped a TypeScript stack designed for real-time ops and clear handoffs.',
    ],
    tech: ['TypeScript', 'Slack API', 'Incident Ops', 'Agents'],
    color: 'from-orange-500 via-amber-500 to-yellow-400',
    accentColor: '#F97316',
    github: 'https://github.com/skx56/Relay-AI-Incident-Commander-for-Slack',
    emoji: '🚨',
  },
  {
    id: 'sevcap',
    title: 'sev-cap — Verified Video Captions',
    shortTitle: 'sev-cap',
    icon: <FaVideo />,
    tagline: 'Semantic-entropy verified multi-style captioning',
    description: [
      'Built a semantic-entropy verified video captioning pipeline that produces multi-style captions with confidence-aware validation.',
      'Combined generation and verification so captions can be filtered by reliability before downstream use.',
      'Packaged as a Python pipeline with demo hosting for evaluation runs.',
    ],
    tech: ['Python', 'Video ML', 'Captioning', 'Confidence Scoring'],
    color: 'from-rose-500 to-pink-500',
    accentColor: '#FB7185',
    github: 'https://github.com/skx56/sev-cap',
    emoji: '🎬',
  },
  {
    id: 'nexus',
    title: 'NexusAI — Video Learning Assistant',
    shortTitle: 'NexusAI',
    icon: <FaRobot />,
    tagline: 'YouTube → searchable conversational study surface',
    description: [
      'Built a video learning assistant that extracts YouTube transcripts and turns long-form content into a searchable, conversational study surface.',
      'Designed chat-over-video workflows so learners can ask questions grounded in the source transcript.',
      'Deployed a live demo for quick experimentation with study sessions.',
    ],
    tech: ['JavaScript', 'LLMs', 'Transcripts', 'RAG', 'Vercel'],
    color: 'from-sky-500 to-indigo-500',
    accentColor: '#38BDF8',
    github: 'https://github.com/skx56/NexusAI',
    live: 'https://nexus-ai-sable-zeta.vercel.app/',
    emoji: '🎓',
  },
  {
    id: 'confer',
    title: 'Confer — Multi-Agent Conference Planner',
    shortTitle: 'Confer',
    icon: <FaLink />,
    tagline: 'Venue, speakers, sponsors, pricing & GTM — coordinated by agents',
    description: [
      'Built a multi-agent conference planning platform that coordinates venue, speaker, sponsor, pricing, ticketing, operations, and GTM workflows.',
      'Orchestrated specialized agents into a single planning surface with TypeScript front-to-back flows.',
      'Focused on turning vague event briefs into structured, actionable conference plans.',
    ],
    tech: ['TypeScript', 'Multi-Agent', 'Planning', 'LLMs'],
    color: 'from-amber-500 via-orange-500 to-rose-500',
    accentColor: '#F59E0B',
    github: 'https://github.com/skx56/Confer',
    emoji: '🗓️',
  },
]

export default function ProjectsSection() {
  const [activeTab, setActiveTab] = useState(projects[0].id)

  const active = projects.find((p) => p.id === activeTab)!
  const headerPattern =
    active.headerPattern ??
    'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.9) 1px, transparent 1px), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.85) 1px, transparent 1px)'
  const headerPatternSize = active.headerPatternSize ?? '40px 40px'
  const headerGlow =
    active.headerGlow ??
    'linear-gradient(135deg, rgba(255,255,255,0.12), transparent 60%)'

  return (
    <section id="projects" className="py-24 relative" style={{ background: 'var(--bg-section)' }}>
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(20,184,166,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="section-container relative z-10">
        {/* Section header */}
        <div className="mb-16 text-center">
          <p
            className="text-xs font-display font-semibold tracking-[0.3em] uppercase mb-4"
            style={{ color: '#14B8A6' }}
          >
            Selected Work
          </p>
          <h2
            className="font-display font-black"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--text-primary)' }}
          >
            Featured{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #14B8A6, #0EA5E9)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Projects
            </span>
          </h2>
        </div>

        {/* Tab navigation */}
        <div className="flex flex-nowrap overflow-x-auto w-full gap-2 py-4 mb-6 justify-start sm:justify-center px-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => setActiveTab(project.id)}
              className="ui-btn"
              style={{
                '--hover-btn-color': project.accentColor,
                '--btn-default-bg': activeTab === project.id ? `${project.accentColor}1A` : 'var(--bg-card)',
                borderColor: activeTab === project.id ? `${project.accentColor}66` : 'var(--bg-card-border)',
                color: activeTab === project.id ? project.accentColor : 'var(--text-secondary)',
                boxShadow: activeTab === project.id ? `0 0 20px ${project.accentColor}33` : '0 4px 15px 0 rgba(0, 0, 0, 0.2)',
              } as React.CSSProperties}
            >
              <span>{project.shortTitle}</span>
            </button>
          ))}
        </div>

        {/* Project card */}
        <div
          key={active.id}
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'var(--bg-card)',
            border: `1px solid ${active.accentColor}33`,
            boxShadow: `0 0 60px ${active.accentColor}15, 0 4px 24px var(--shadow)`,
            animation: 'fadeInUp 0.4s ease both',
          }}
        >
          {/* Card header with gradient */}
          <div
            className={`bg-gradient-to-r ${active.color} p-5 sm:p-8 md:p-12 relative overflow-hidden`}
          >
            <div
              className="absolute inset-0 opacity-80"
              style={{ backgroundImage: headerGlow }}
            />
            {/* Background pattern */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: headerPattern,
                backgroundSize: headerPatternSize,
              }}
            />
            {/* Giant Watermark Icon */}
            <div className="absolute -right-8 -bottom-8 text-[300px] opacity-[0.2] mix-blend-overlay rotate-12 select-none pointer-events-none transition-all duration-700">
              {active.icon}
            </div>
            
            <div className="relative z-10 flex flex-col justify-start gap-2">
              {active.emoji && (
                <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-semibold text-white/95 backdrop-blur-md shadow-lg">
                  <span aria-hidden="true">{active.emoji}</span>
                  <span>Featured Build</span>
                </div>
              )}
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-3xl shadow-lg border border-white/20 mb-4 drop-shadow-md">
                {active.icon}
              </div>
              <h3 className="font-display font-black text-white mb-2 tracking-tight drop-shadow-md" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                {active.title}
              </h3>
              <p className="text-white/90 font-medium text-xl border-l-4 border-white/30 pl-4 py-1">{active.tagline}</p>
            </div>
          </div>

          {/* Card body */}
          <div className="p-5 sm:p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {/* Description */}
            <div>
              <h4 className="font-display font-bold text-sm tracking-widest uppercase mb-5" style={{ color: active.accentColor }}>
                What I Built
              </h4>
              <ul className="space-y-4">
                {active.description.map((point, i) => (
                  <li key={i} className="flex gap-3">
                    <span
                      className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: active.accentColor }}
                    />
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {point}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech stack */}
            <div>
              <h4 className="font-display font-bold text-sm tracking-widest uppercase mb-5" style={{ color: active.accentColor }}>
                Tech Stack
              </h4>
              <div className="flex flex-wrap gap-2 mb-10">
                {active.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-300 backdrop-blur-sm"
                    style={{
                      background: `${active.accentColor}1A`,
                      color: active.accentColor,
                      border: `1px solid ${active.accentColor}33`,
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
              
              {/* Repository Links */}
              <div>
                <h4 className="font-display font-bold text-sm tracking-widest uppercase mb-6 opacity-80" style={{ color: active.accentColor }}>
                  {active.github ? 'Repository' : 'Demo'}
                </h4>
                {active.github && (
                <a
                  href={active.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gh-button-icon block w-fit"
                >
                    <div className="gh-icon">
                      <FiGithub />
                    </div>
                    <div className="gh-cube">
                      <span className="gh-side gh-front bg-gray-900 border border-gray-700">Code</span>
                      <span
                        className="gh-side gh-top"
                        style={{ backgroundColor: active.accentColor, color: '#fff' }}
                      >
                        GitHub
                      </span>
                    </div>
                  </a>
                )}

                {active.live && (
                  active.live.startsWith('/') ? (
                    <Link
                      href={active.live}
                      className="flex items-center gap-2 text-sm font-semibold transition-all duration-300 hover:scale-105 w-fit px-4 py-2 rounded-lg"
                      style={{
                        background: `${active.accentColor}1A`,
                        color: active.accentColor,
                        border: `1px solid ${active.accentColor}44`,
                        marginTop: active.github ? '1rem' : 0,
                      }}
                    >
                      <FiGlobe size={15} />
                      Live Demo
                    </Link>
                  ) : (
                    <a
                      href={active.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 mt-4 text-sm font-semibold transition-all duration-300 hover:scale-105 w-fit px-4 py-2 rounded-lg"
                      style={{
                        background: `${active.accentColor}1A`,
                        color: active.accentColor,
                        border: `1px solid ${active.accentColor}44`,
                      }}
                    >
                      <FiGlobe size={15} />
                      Live Demo
                    </a>
                  )
                )}
              </div>

              {/* Project number indicator */}
              <div className="mt-8 pt-8 border-t" style={{ borderColor: 'var(--divider)' }}>
                <p className="text-xs" style={{ color: 'var(--text-label)' }}>
                  Project {projects.findIndex((p) => p.id === active.id) + 1} of {projects.length}
                </p>
                <div className="flex gap-1.5 mt-2">
                  {projects.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setActiveTab(p.id)}
                      className="h-1 rounded-full transition-all duration-300"
                      style={{
                        width: p.id === active.id ? '24px' : '8px',
                        background: p.id === active.id ? active.accentColor : 'var(--bg-card-border)',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
