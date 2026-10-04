'use client'

import { useState } from 'react'

type Status = 'idle' | 'loading' | 'done' | 'cancelled'

export default function ResumeButton() {
  const [status, setStatus] = useState<Status>('idle')

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (status !== 'idle') {
      e.preventDefault()
      return
    }

    setStatus('loading')

    // Detect if touch device — on mobile, downloads happen silently, no dialog
    const isTouchDevice = navigator.maxTouchPoints > 0

    if (isTouchDevice) {
      // Mobile: no save dialog, download starts immediately — just show done after short delay
      setTimeout(() => {
        setStatus('done')
        setTimeout(() => setStatus('idle'), 2500)
      }, 1500)
      return
    }

    // Desktop: detect if user cancelled the save-as dialog via blur/focus timing
    let blurTime: number | null = null

    const cleanup = () => {
      window.removeEventListener('blur', onBlur)
      window.removeEventListener('focus', onFocus)
    }

    const onBlur = () => {
      blurTime = Date.now()
    }

    const onFocus = () => {
      cleanup()
      const elapsed = blurTime ? Date.now() - blurTime : 9999
      const wasCancelled = blurTime !== null && elapsed <= 2000
      setStatus(wasCancelled ? 'cancelled' : 'done')
      setTimeout(() => setStatus('idle'), 2500)
    }

    window.addEventListener('blur', onBlur)
    window.addEventListener('focus', onFocus)

    // Fallback: if browser downloads without showing a dialog (silent download)
    setTimeout(() => {
      if (blurTime === null) {
        cleanup()
        setStatus('done')
        setTimeout(() => setStatus('idle'), 2500)
      }
    }, 1200)
  }

  return (
    <>
      <style>{`
        .resume-container {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .resume-label {
          background-color: transparent;
          border: 2px solid rgb(91, 91, 240);
          display: flex;
          align-items: center;
          border-radius: 50px;
          width: 160px;
          cursor: pointer;
          transition: all 0.4s ease;
          padding: 5px;
          position: relative;
          user-select: none;
          text-decoration: none;
        }

        .resume-label .resume-title {
          font-size: 15px;
          font-weight: 800;
          color: #fff;
          transition: all 0.4s ease;
          position: absolute;
          left: 0;
          right: 18px;
          top: 50%;
          transform: translateY(-50%);
          text-align: center;
          letter-spacing: 0.08em;
          font-family: inherit;
          padding-left: 55px;
          white-space: nowrap;
        }

        .resume-label .resume-title.secondary {
          opacity: 0;
          visibility: hidden;
          padding-left: 0;
        }

        .resume-label .resume-circle {
          height: 45px;
          width: 45px;
          border-radius: 50%;
          background-color: rgb(91, 91, 240);
          display: flex;
          justify-content: center;
          align-items: center;
          transition: all 0.4s ease;
          position: relative;
          box-shadow: 0 0 0 0 rgb(255,255,255);
          overflow: hidden;
          flex-shrink: 0;
        }

        .resume-label .resume-circle .resume-icon {
          color: #fff;
          width: 22px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          transition: all 0.4s ease;
        }

        .resume-label .resume-circle .resume-square {
          aspect-ratio: 1;
          width: 15px;
          border-radius: 2px;
          background-color: #fff;
          opacity: 0;
          visibility: hidden;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          transition: all 0.4s ease;
        }

        .resume-label .resume-circle::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          background-color: #3333a8;
          width: 100%;
          height: 0;
          transition: all 0.4s ease;
        }

        .resume-label.loading {
          width: 57px;
        }

        .resume-label.loading .resume-circle {
          animation: resume-pulse 1s infinite;
          rotate: 180deg;
        }

        .resume-label.loading .resume-circle::before {
          animation: resume-installing 1.5s ease-in-out infinite;
        }

        .resume-label.loading .resume-circle .resume-icon {
          opacity: 0;
          visibility: hidden;
        }

        .resume-label.loading .resume-circle .resume-square {
          opacity: 1;
          visibility: visible;
        }

        .resume-label.loading .resume-title {
          opacity: 0;
          visibility: hidden;
        }

        .resume-label.done {
          width: 150px;
          border-color: rgb(35, 174, 35);
        }

        .resume-label.done .resume-circle {
          background-color: rgb(35, 174, 35);
          animation: none;
          rotate: 0deg;
        }

        .resume-label.done .resume-circle::before { height: 0; animation: none; }
        .resume-label.done .resume-circle .resume-square { opacity: 0; visibility: hidden; }
        .resume-label.done .resume-circle .resume-icon { opacity: 1; visibility: visible; }
        .resume-label.done .resume-title.primary { opacity: 0; visibility: hidden; }
        .resume-label.done .resume-title.secondary { opacity: 1; visibility: visible; color: rgb(35, 174, 35); }

        .resume-label.cancelled {
          width: 150px;
          border-color: rgb(239, 68, 68);
        }

        .resume-label.cancelled .resume-circle {
          background-color: rgb(239, 68, 68);
          animation: none;
          rotate: 0deg;
        }

        .resume-label.cancelled .resume-circle::before { height: 0; animation: none; }
        .resume-label.cancelled .resume-circle .resume-square { opacity: 0; visibility: hidden; }
        .resume-label.cancelled .resume-circle .resume-icon { opacity: 1; visibility: visible; }
        .resume-label.cancelled .resume-title.primary { opacity: 0; visibility: hidden; }
        .resume-label.cancelled .resume-title.secondary { opacity: 1; visibility: visible; color: rgb(239, 68, 68); }

        @keyframes resume-pulse {
          0% { scale: 0.95; box-shadow: 0 0 0 0 rgba(255,255,255,0.7); }
          70% { scale: 1; box-shadow: 0 0 0 10px rgba(255,255,255,0); }
          100% { scale: 0.95; box-shadow: 0 0 0 0 rgba(255,255,255,0); }
        }
        @keyframes resume-installing {
          0% { height: 0; }
          50% { height: 100%; }
          100% { height: 0; }
        }
      `}</style>

      <div className="resume-container">
        <a
          href="/SakshamAdoni_Resume_main.pdf"
          download="SakshamAdoni_Resume.pdf"
          className={`resume-label ${status}`}
          onClick={handleClick}
          aria-label="Download Resume"
        >
          <div className="resume-circle">
            {status === 'cancelled' ? (
              <svg className="resume-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg className="resume-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            )}
            <div className="resume-square" />
          </div>

          <span className="resume-title primary">Resume</span>
          <span className="resume-title secondary">
            {status === 'cancelled' ? 'Cancelled' : 'Done ✓'}
          </span>
        </a>
      </div>
    </>
  )
}
