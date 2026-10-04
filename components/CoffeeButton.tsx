'use client'

export default function CoffeeButton() {
  return (
    <>
      <style>{`
        .coffee-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 3px solid #1a0a00;
          border-radius: 12px;
          padding: 0;
          text-decoration: none;
          color: #1a0a00;
          font-weight: bold;
          position: relative;
          box-shadow: 4px 4px 0px #1a0a00;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          height: 110px;
          width: 110px;
          cursor: pointer;
          background-color: #6f3a1f;
        }

        .coffee-btn::before {
          content: "";
          position: absolute;
          left: 50%;
          bottom: -150%;
          width: 300%;
          height: 300%;
          border-radius: 50%;
          background-color: #4a2010;
          transform: translateX(-50%) scale(0);
          transition: transform 0.6s cubic-bezier(0.19, 1, 0.22, 1);
          z-index: 1;
        }

        .coffee-btn:hover::before {
          transform: translateX(-50%) scale(1);
        }

        .coffee-btn:hover {
          transform: translate(-4px, -4px);
          box-shadow: 8px 8px 0px #1a0a00;
        }

        .coffee-btn:active {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0px #1a0a00;
        }

        .coffee-icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 2;
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background-color: #2c1206;
          box-shadow: 0 2px 10px rgba(0,0,0,0.4);
          transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        @keyframes coffee-spin {
          0%   { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }

        .coffee-btn:hover .coffee-icon-wrap {
          animation: coffee-spin 5s linear infinite;
          width: 44px;
          height: 44px;
          top: 28%;
        }

        .coffee-btn-text {
          display: flex;
          flex-direction: column;
          align-items: center;
          line-height: 1.3;
          transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          text-align: center;
          opacity: 0;
          transform: translateY(20px);
          z-index: 2;
          position: absolute;
          bottom: 14px;
          left: 0;
          right: 0;
        }

        .coffee-btn-text span:first-child {
          font-size: 11px;
          font-weight: 500;
          color: #c9a07a;
        }

        .coffee-btn-text span:last-child {
          font-size: 13px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: #f5deb3;
        }

        .coffee-btn:hover .coffee-btn-text {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      <button
        type="button"
        className="coffee-btn"
        title="Powered by Coffee ☕"
        onClick={(e) => e.preventDefault()}
      >
        {/* Coffee cup icon */}
        <div className="coffee-icon-wrap">
          <svg
            width="38"
            height="38"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Steam lines */}
            <path
              d="M20 10 Q22 6 20 2"
              stroke="#c9a07a"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M28 10 Q30 6 28 2"
              stroke="#c9a07a"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M36 10 Q38 6 36 2"
              stroke="#c9a07a"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Cup body */}
            <path
              d="M12 16 H52 L46 52 H18 Z"
              fill="#c9a07a"
            />
            {/* Cup handle */}
            <path
              d="M52 22 Q64 22 64 34 Q64 46 52 46"
              stroke="#c9a07a"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            {/* Coffee liquid */}
            <path
              d="M16 24 H48 L44 48 H20 Z"
              fill="#4a2010"
            />
            {/* Saucer */}
            <ellipse cx="32" cy="54" rx="22" ry="4" fill="#a0724a" />
          </svg>
        </div>

        <div className="coffee-btn-text">
          <span>powered by</span>
          <span>Coffee ☕</span>
        </div>
      </button>
    </>
  )
}
