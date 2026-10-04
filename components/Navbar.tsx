'use client'

import { useState, useEffect } from 'react'
import { FiGithub, FiLinkedin, FiMenu, FiX } from 'react-icons/fi'
import ThemeToggle from '@/components/ThemeToggle'

const navLinks = [
  { label: 'About', href: '/#about' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Leadership', href: '/#positions' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Echo', href: '/echo' },
  { label: 'Grain', href: '/grain' },
  { label: 'Skills', href: '/#skills' },
  { label: 'Contact', href: '/#contact' },
]

const HIRE_ME_HREF =
  'https://mail.google.com/mail/?view=cm' +
  '&to=sakshamojha96@gmail.com' +
  '&su=Hiring%20Inquiry%20%E2%80%94%20Let%27s%20Work%20Together' +
  '&body=Hi%20Saksham%2C%0A%0AI%20came%20across%20your%20portfolio%20and%20I%27m%20impressed%20by%20your%20work.' +
  '%20I%27d%20love%20to%20discuss%20a%20potential%20opportunity%20with%20you.%0A%0A' +
  'Role%3A%20%5BRole%20Name%5D%0ACompany%3A%20%5BCompany%20Name%5D%0ADetails%3A%20%5BAdd%20details%20here%5D' +
  '%0A%0ALooking%20forward%20to%20hearing%20from%20you!%0A%0ABest%2C%0A%5BYour%20Name%5D'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? 'var(--nav-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--nav-border)' : 'none',
      }}
    >
      <style>{`
        .hire-me-wrapper {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          position: relative;
          width: 120px;
          height: 42px;
          z-index: 2;
          -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 726 252.17'%3E%3Cpath d='M483.92 0S481.38 24.71 466 40.11c-11.74 11.74-24.09 12.66-40.26 15.07-9.42 1.41-29.7 3.77-34.81-.79-2.37-2.11-3-21-3.22-27.62-.21-6.92-1.36-16.52-2.82-18-.75 3.06-2.49 11.53-3.09 13.61S378.49 34.3 378 36a85.13 85.13 0 0 0-30.09 0c-.46-1.67-3.17-11.48-3.77-13.56s-2.34-10.55-3.09-13.61c-1.45 1.45-2.61 11.05-2.82 18-.21 6.67-.84 25.51-3.22 27.62-5.11 4.56-25.38 2.2-34.8.79-16.16-2.47-28.51-3.39-40.21-15.13C244.57 24.71 242 0 242 0H0s69.52 22.74 97.52 68.59c16.56 27.11 14.14 58.49 9.92 74.73C170 140 221.46 140 273 158.57c69.23 24.93 83.2 76.19 90 93.6 6.77-17.41 20.75-68.67 90-93.6 51.54-18.56 103-18.59 165.56-15.25-4.21-16.24-6.63-47.62 9.93-74.73C656.43 22.74 726 0 726 0z'/%3E%3C/svg%3E") no-repeat 50% 50%;
          mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 726 252.17'%3E%3Cpath d='M483.92 0S481.38 24.71 466 40.11c-11.74 11.74-24.09 12.66-40.26 15.07-9.42 1.41-29.7 3.77-34.81-.79-2.37-2.11-3-21-3.22-27.62-.21-6.92-1.36-16.52-2.82-18-.75 3.06-2.49 11.53-3.09 13.61S378.49 34.3 378 36a85.13 85.13 0 0 0-30.09 0c-.46-1.67-3.17-11.48-3.77-13.56s-2.34-10.55-3.09-13.61c-1.45 1.45-2.61 11.05-2.82 18-.21 6.67-.84 25.51-3.22 27.62-5.11 4.56-25.38 2.2-34.8.79-16.16-2.47-28.51-3.39-40.21-15.13C244.57 24.71 242 0 242 0H0s69.52 22.74 97.52 68.59c16.56 27.11 14.14 58.49 9.92 74.73C170 140 221.46 140 273 158.57c69.23 24.93 83.2 76.19 90 93.6 6.77-17.41 20.75-68.67 90-93.6 51.54-18.56 103-18.59 165.56-15.25-4.21-16.24-6.63-47.62 9.93-74.73C656.43 22.74 726 0 726 0z'/%3E%3C/svg%3E") no-repeat 50% 50%;
          -webkit-mask-size: 100% 100%;
          mask-size: 100% 100%;
          cursor: pointer;
          background-color: var(--text-primary);
          text-decoration: none;
          overflow: hidden;
        }
        .hire-me-wrapper::before {
          content: '';
          position: absolute;
          width: 0;
          height: 100%;
          background-color: var(--bg);
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          transition: all 1s ease;
          z-index: 1;
        }
        .hire-me-wrapper:hover::before { width: 100%; }
        .hire-me-wrapper::after {
          content: '';
          position: absolute;
          left: 0; right: 0; bottom: 0;
          box-shadow: 0px 0 0 0 transparent;
          transition: all 2s ease;
          z-index: 0;
        }
        .hire-me-wrapper:hover::after {
          box-shadow: 0px -13px 56px 12px rgba(20,184,166,0.4);
        }
        .hire-me-label {
          position: relative;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 1px;
          text-align: center;
          color: var(--bg);
          transition: color 2s ease;
          z-index: 2;
          font-family: var(--font-nunito), sans-serif;
          text-transform: uppercase;
          pointer-events: none;
          line-height: 1;
        }
        .hire-me-wrapper:hover .hire-me-label { color: var(--text-primary); }
      `}</style>

      <div className="section-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center justify-center overflow-hidden rounded-full border-2 border-transparent hover:border-[#14B8A6] transition-all duration-300"
            style={{ width: '40px', height: '40px', background: 'var(--bg-card)' }}
            title="Home"
          >
            <img 
              src="/avatar.jpg" 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium tracking-wide transition-all duration-300"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Social icons + CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="https://github.com/skx56"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-all duration-300 hover:scale-110"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              <FiGithub size={18} />
            </a>
            <a
              href="https://www.linkedin.com/in/saksham-ojha-472706292/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-all duration-300 hover:scale-110"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              <FiLinkedin size={18} />
            </a>

            <ThemeToggle />

          </div>

          {/* Mobile: ThemeToggle + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{
          background: 'var(--nav-bg)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid var(--nav-border)',
        }}
      >
        <div className="section-container py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium py-2 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="flex gap-4 pt-2 border-t" style={{ borderColor: 'var(--divider)' }}>
            <a
              href="https://github.com/skx56"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--text-muted)' }}
            >
              <FiGithub size={18} />
            </a>
            <a
              href="https://www.linkedin.com/in/saksham-ojha-472706292/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--text-muted)' }}
            >
              <FiLinkedin size={18} />
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}
