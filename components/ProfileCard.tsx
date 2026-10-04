'use client'

import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'
import ResumeButton from './ResumeButton'

interface ProfileCardProps {
  enlarged?: boolean
}

export default function ProfileCard({ enlarged = false }: ProfileCardProps) {
  const size = enlarged
    ? { width: 'min(680px, 95vw)', height: 'min(320px, 50vw)', minHeight: '240px' }
    : { width: 'min(420px, 90vw)', height: 'min(380px, 55vw)', minHeight: '280px' }

  return (
    <>
      <style>{`
        .profile-parent {
          perspective: 1000px;
        }

        .profile-card {
          width: 100%;
          height: 100%;
          border-radius: clamp(24px, 4vw, 48px);
          background: linear-gradient(135deg, rgb(20, 184, 166) 0%, rgb(14, 165, 233) 100%);
          transition: all 0.5s ease-in-out;
          transform-style: preserve-3d;
          box-shadow: rgba(14, 165, 233, 0) 40px 50px 25px -40px, rgba(14, 165, 233, 0.2) 0px 25px 25px -5px;
          position: relative;
        }

        .profile-glass {
          transform-style: preserve-3d;
          position: absolute;
          inset: 8px;
          border-radius: clamp(20px, 3.5vw, 44px);
          border-top-right-radius: 100%;
          background: linear-gradient(0deg, rgba(10, 10, 20, 0.78) 0%, rgba(20, 15, 40, 0.9) 100%);
          transform: translate3d(0px, 0px, 25px);
          border-left: 1px solid rgba(255,255,255,0.12);
          border-bottom: 1px solid rgba(255,255,255,0.12);
          transition: all 0.5s ease-in-out;
        }

        .profile-content {
          padding: clamp(40px, 12%, 80px) clamp(20px, 5%, 32px) 0px clamp(30px, 10%, 60px);
          transform: translate3d(0, 0, 26px);
          position: relative;
          z-index: 2;
          text-align: right;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .profile-content .title {
          display: block;
          color: #e2e8f0;
          font-weight: 800;
          font-size: clamp(20px, 3.5vw, 30px);
          font-family: var(--font-nunito), 'Georgia', sans-serif;
          letter-spacing: -0.01em;
        }

        .profile-content .text {
          display: block;
          color: rgba(165, 243, 252, 0.85);
          font-size: clamp(12px, 2vw, 16px);
          margin-top: clamp(6px, 1.2vw, 12px);
          line-height: 1.55;
          font-family: var(--font-nunito), sans-serif;
        }

        .profile-bottom {
          padding: 10px 18px;
          transform-style: preserve-3d;
          position: absolute;
          bottom: clamp(14px, 4%, 24px);
          left: clamp(14px, 4%, 24px);
          right: clamp(14px, 4%, 24px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          transform: translate3d(0, 0, 26px);
          z-index: 2;
        }

        .profile-bottom .view-more {
          display: flex;
          align-items: center;
          gap: 4px;
          transition: all 0.2s ease-in-out;
        }

        .profile-bottom .view-more:hover {
          transform: translate3d(0, 0, 10px);
        }

        .profile-bottom .view-more .view-more-button {
          background: none;
          border: none;
          color: #5eead4;
          font-weight: 700;
          font-size: clamp(12px, 1.8vw, 14px);
          cursor: pointer;
          font-family: var(--font-nunito), sans-serif;
        }

        .profile-bottom .view-more .arrow-svg {
          fill: none;
          stroke: #5eead4;
          stroke-width: 3px;
          height: 14px;
          width: 14px;
        }

        .profile-bottom .social-buttons-container {
          display: flex;
          gap: clamp(8px, 2vw, 16px);
          transform-style: preserve-3d;
        }

        .profile-bottom .social-buttons-container .social-button {
          width: clamp(32px, 5vw, 44px);
          aspect-ratio: 1;
          padding: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.15);
          display: grid;
          place-content: center;
          box-shadow: rgba(14, 165, 233, 0.4) 0px 7px 5px -5px;
          cursor: pointer;
          text-decoration: none;
        }

        .profile-bottom .social-buttons-container .social-button:first-child {
          transition: transform 0.2s ease-in-out 0.4s, box-shadow 0.2s ease-in-out 0.4s, background 0.2s;
        }
        .profile-bottom .social-buttons-container .social-button:nth-child(2) {
          transition: transform 0.2s ease-in-out 0.6s, box-shadow 0.2s ease-in-out 0.6s, background 0.2s;
        }
        .profile-bottom .social-buttons-container .social-button:nth-child(3) {
          transition: transform 0.2s ease-in-out 0.8s, box-shadow 0.2s ease-in-out 0.8s, background 0.2s;
        }

        .profile-bottom .social-buttons-container .social-button .icon {
          width: clamp(14px, 2.5vw, 20px);
          height: clamp(14px, 2.5vw, 20px);
          color: #5eead4;
        }

        .profile-bottom .social-buttons-container .social-button:hover {
          background: rgba(20, 184, 166, 0.6);
          border-color: #14B8A6;
        }
        .profile-bottom .social-buttons-container .social-button:hover .icon { color: white; }
        .profile-bottom .social-buttons-container .social-button:active { background: #FBBF24; }
        .profile-bottom .social-buttons-container .social-button:active .icon { color: black; }

        /* Floating circles */
        .profile-logo {
          position: absolute;
          left: 0;
          top: 0;
          transform-style: preserve-3d;
        }

        .profile-logo .circle {
          display: block;
          position: absolute;
          aspect-ratio: 1;
          border-radius: 50%;
          top: 0;
          right: 0;
          box-shadow: rgba(100, 100, 111, 0.2) -10px 10px 20px 0px;
          -webkit-backdrop-filter: blur(5px);
          backdrop-filter: blur(5px);
          background: rgba(20, 184, 166, 0.18);
          transition: all 0.5s ease-in-out;
        }

        .profile-logo .circle1 { width: min(200px, 40%); transform: translate3d(0,0,20px); top: 8px; left: 8px; }
        .profile-logo .circle2 { width: min(165px, 33%); transform: translate3d(0,0,40px); top: 10px; left: 10px; backdrop-filter: blur(1px); transition-delay: 0.4s; }
        .profile-logo .circle3 { width: min(130px, 26%); transform: translate3d(0,0,60px); top: 17px; left: 17px; transition-delay: 0.8s; }
        .profile-logo .circle4 { width: min(95px, 19%); transform: translate3d(0,0,80px); top: 23px; left: 23px; transition-delay: 1.2s; }
        .profile-logo .circle5 {
          width: min(60px, 12%);
          transform: translate3d(0,0,100px);
          top: 30px; left: 30px;
          display: grid; place-content: center;
          transition-delay: 1.6s;
          background: rgba(20, 184, 166, 0.55);
        }

        .profile-logo .circle5 .initials {
          font-size: clamp(11px, 2vw, 18px);
          font-weight: 800;
          color: white;
          font-family: var(--font-nunito), Georgia, sans-serif;
          line-height: 1;
        }

        /* Hover */
        .profile-parent:hover .profile-card {
          transform: rotate3d(1, 1, 0, 30deg);
          box-shadow: rgba(14, 165, 233, 0.3) 30px 50px 25px -40px, rgba(20, 184, 166, 0.15) 0px 25px 30px 0px;
        }
        .profile-parent:hover .profile-card .profile-bottom .social-buttons-container .social-button {
          transform: translate3d(0, 0, 50px);
          box-shadow: rgba(14, 165, 233, 0.3) -5px 20px 10px 0px;
        }
        .profile-parent:hover .profile-card .profile-logo .circle2 { transform: translate3d(0,0,60px); }
        .profile-parent:hover .profile-card .profile-logo .circle3 { transform: translate3d(0,0,80px); }
        .profile-parent:hover .profile-card .profile-logo .circle4 { transform: translate3d(0,0,100px); }
        .profile-parent:hover .profile-card .profile-logo .circle5 { transform: translate3d(0,0,120px); }
      `}</style>

      <div
        className="profile-parent"
        style={{ width: size.width, height: size.height, minHeight: size.minHeight }}
      >
        <div className="profile-card">
          <div className="profile-glass" />

          {/* Floating circles */}
          <div className="profile-logo">
            <span className="circle circle1" />
            <span className="circle circle2" />
            <span className="circle circle3" />
            <span className="circle circle4" />
            <span className="circle circle5 overflow-hidden">
              <img 
                src="/avatar.jpg" 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            </span>
          </div>

          {/* Content */}
          <div className="profile-content">
            <span className="title">Saksham Ojha</span>
            <span className="text">
              Full-Stack &amp; Applied AI Developer<br />
              IIT Roorkee · B.Tech &apos;27
            </span>
          </div>

          {/* Bottom bar */}
          <div className="profile-bottom">
            <div className="social-buttons-container">
              <a href="https://github.com/skx56" target="_blank" rel="noopener noreferrer" className="social-button" aria-label="GitHub">
                <FiGithub className="icon" />
              </a>
              <a href="https://www.linkedin.com/in/saksham-ojha-472706292/" target="_blank" rel="noopener noreferrer" className="social-button" aria-label="LinkedIn">
                <FiLinkedin className="icon" />
              </a>
              <a href="mailto:sakshamojha96@gmail.com" className="social-button" aria-label="Email">
                <FiMail className="icon" />
              </a>
            </div>

            <ResumeButton />
          </div>
        </div>
      </div>
    </>
  )
}
