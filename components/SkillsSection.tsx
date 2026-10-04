'use client'

import { motion } from 'framer-motion'
import { FaCode, FaBrain, FaGlobe, FaCubes } from 'react-icons/fa'

const skillGroups = [
  {
    category: 'Languages',
    icon: <FaCode />,
    color: '#0EA5E9',
    colorB: '#22D3EE',
    skills: ['Python', 'TypeScript', 'JavaScript', 'SQL', 'C++', 'Bash'],
  },
  {
    category: 'AI / ML',
    icon: <FaBrain />,
    color: '#14B8A6',
    colorB: '#0EA5E9',
    skills: ['LangChain', 'RAG', 'Voice agents', 'PyTorch', 'scikit-learn', 'OpenCV', 'SHAP', 'Embeddings'],
  },
  {
    category: 'Full Stack',
    icon: <FaGlobe />,
    color: '#10B981',
    colorB: '#22D3EE',
    skills: ['Next.js', 'React', 'Node.js', 'WebRTC', 'FastAPI', 'Prisma', 'Clerk', 'Streamlit'],
  },
  {
    category: 'Product / Data',
    icon: <FaCubes />,
    color: '#F97316',
    colorB: '#FBBF24',
    skills: ['Pandas', 'SQL', 'Power BI', 'Google Analytics', 'A/B Thinking', 'Git'],
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export default function SkillsSection() {
  return (
    <section id="skills" className="py-24 relative" style={{ background: 'var(--bg-section)' }}>
      <style>{`
        .skillv2-card {
          background: var(--bg-card);
          border: 1px solid var(--bg-card-border);
          border-radius: 1.25rem;
          padding: 1.5rem;
          box-shadow: 0 4px 24px var(--shadow);
          position: relative;
          overflow: hidden;
          height: 100%;
          display: flex;
          flex-direction: column;
          transition: border-color 0.35s ease, box-shadow 0.35s ease;
        }
        .skillv2-card::after {
          content: '';
          position: absolute;
          inset: auto 0 0 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--accent-a), var(--accent-b), transparent);
          opacity: 0.35;
          transition: opacity 0.35s ease;
        }
        .skillv2-card:hover {
          border-color: color-mix(in srgb, var(--accent-a) 40%, transparent);
          box-shadow: 0 12px 40px var(--shadow), 0 0 40px color-mix(in srgb, var(--accent-a) 12%, transparent);
        }
        .skillv2-card:hover::after { opacity: 1; }

        .skillv2-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: grid;
          place-content: center;
          font-size: 22px;
          color: var(--accent-a);
          background: color-mix(in srgb, var(--accent-a) 10%, transparent);
          border: 1px solid color-mix(in srgb, var(--accent-a) 25%, transparent);
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .skillv2-card:hover .skillv2-icon {
          transform: scale(1.08) rotate(-4deg);
        }

        .skillv2-chip {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.04em;
          padding: 5px 10px;
          border-radius: 8px;
          color: var(--accent-a);
          background: color-mix(in srgb, var(--accent-a) 9%, transparent);
          border: 1px solid color-mix(in srgb, var(--accent-a) 26%, transparent);
          transition: transform 0.25s ease, background 0.25s ease;
          cursor: default;
        }
        .skillv2-chip:hover {
          transform: translateY(-2px);
          background: color-mix(in srgb, var(--accent-a) 16%, transparent);
        }
      `}</style>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 80% 50%, rgba(14,165,233,0.05) 0%, transparent 70%)',
        }}
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
          <p
            className="text-xs font-display font-semibold tracking-[0.3em] uppercase mb-4"
            style={{ color: '#10B981' }}
          >
            Expertise
          </p>
          <h2
            className="font-display font-black"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--text-primary)' }}
          >
            Technical{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #10B981, #0EA5E9)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Skills
            </span>
          </h2>
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {skillGroups.map((group) => (
            <motion.div key={group.category} variants={item} whileHover={{ y: -6 }}>
              <div
                className="skillv2-card"
                style={{ '--accent-a': group.color, '--accent-b': group.colorB } as React.CSSProperties}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="skillv2-icon">{group.icon}</div>
                  <h3
                    className="font-display font-black text-lg"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {group.category}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span key={skill} className="skillv2-chip">{skill}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
