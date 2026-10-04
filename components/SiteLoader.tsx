'use client'

import { useEffect, useState } from 'react'

export default function SiteLoader() {
  const [visible, setVisible] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 2200)
    const hideTimer = setTimeout(() => setVisible(false), 2800)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0f',
        transition: 'opacity 0.6s ease',
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? 'none' : 'all',
      }}
    >
      <style>{`
        .loader {
          scale: 0.75;
          position: relative;
          width: 200px;
          height: 200px;
          translate: 10px -20px;
        }
        .loader svg {
          position: absolute;
          top: 0;
          left: 0;
        }
        .head {
          translate: 27px -30px;
          z-index: 3;
          animation: bob 1s infinite ease-in;
        }
        .bod {
          translate: 0px 30px;
          z-index: 3;
          animation: bob 1s infinite ease-in-out;
        }
        .legr {
          translate: 75px 135px;
          z-index: 0;
          animation: rstep 1s infinite ease-in;
          animation-delay: 0.45s;
        }
        .legl {
          translate: 30px 155px;
          z-index: 3;
          animation: lstep 1s infinite ease-in;
        }
        @keyframes bob {
          0%   { transform: translateY(0) rotate(3deg); }
          5%   { transform: translateY(0) rotate(3deg); }
          25%  { transform: translateY(5px) rotate(0deg); }
          50%  { transform: translateY(0px) rotate(-3deg); }
          70%  { transform: translateY(5px) rotate(0deg); }
          100% { transform: translateY(0) rotate(3deg); }
        }
        @keyframes lstep {
          0%   { transform: translateY(0) rotate(-5deg); }
          33%  { transform: translateY(-15px) translate(32px) rotate(35deg); }
          66%  { transform: translateY(0) translate(25px) rotate(-25deg); }
          100% { transform: translateY(0) rotate(-5deg); }
        }
        @keyframes rstep {
          0%   { transform: translateY(0) translate(0px) rotate(-5deg); }
          33%  { transform: translateY(-10px) translate(30px) rotate(35deg); }
          66%  { transform: translateY(0) translate(20px) rotate(-25deg); }
          100% { transform: translateY(0) translate(0px) rotate(-5deg); }
        }
        #gnd {
          translate: -140px 0;
          rotate: 10deg;
          z-index: -1;
          filter: blur(0.5px) drop-shadow(1px 3px 5px #000000);
          opacity: 0.25;
          animation: scroll 5s infinite linear;
        }
        @keyframes scroll {
          0%  { transform: translateY(25px) translate(50px); opacity: 0; }
          33% { opacity: 0.25; }
          66% { opacity: 0.25; }
          to  { transform: translateY(-50px) translate(-100px); opacity: 0; }
        }
        .loader-text {
          margin-top: 48px;
          font-family: var(--font-fredoka), sans-serif;
          font-size: 14px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          animation: pulse-text 1s infinite ease-in-out;
        }
        @keyframes pulse-text {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.9; }
        }
      `}</style>

      <div className="loader">
        {/* Head */}
        <svg className="head" width="60" height="60" viewBox="0 0 60 60">
          <circle cx="30" cy="30" r="28" fill="#14B8A6" />
          <circle cx="22" cy="26" r="4" fill="white" />
          <circle cx="38" cy="26" r="4" fill="white" />
          <circle cx="22" cy="27" r="2" fill="#1a1a2e" />
          <circle cx="38" cy="27" r="2" fill="#1a1a2e" />
          <path d="M22 40 Q30 46 38 40" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>

        {/* Body */}
        <svg className="bod" width="80" height="70" viewBox="0 0 80 70">
          <rect x="15" y="5" width="50" height="55" rx="18" fill="#6D28D9" />
          {/* Arms */}
          <rect x="-5" y="10" width="22" height="10" rx="5" fill="#0F766E" transform="rotate(-20 -5 10)" />
          <rect x="63" y="10" width="22" height="10" rx="5" fill="#0F766E" transform="rotate(20 63 10)" />
        </svg>

        {/* Left leg */}
        <svg className="legl" width="20" height="50" viewBox="0 0 20 50">
          <rect x="2" y="0" width="16" height="40" rx="8" fill="#5B21B6" />
          <rect x="0" y="34" width="20" height="14" rx="6" fill="#4C1D95" />
        </svg>

        {/* Right leg */}
        <svg className="legr" width="20" height="50" viewBox="0 0 20 50">
          <rect x="2" y="0" width="16" height="40" rx="8" fill="#5B21B6" />
          <rect x="0" y="34" width="20" height="14" rx="6" fill="#4C1D95" />
        </svg>

        {/* Ground shadow */}
        <svg id="gnd" width="300" height="30" viewBox="0 0 300 30">
          <ellipse cx="150" cy="15" rx="140" ry="10" fill="#14B8A6" />
        </svg>
      </div>

      <p className="loader-text">Loading...</p>
    </div>
  )
}
