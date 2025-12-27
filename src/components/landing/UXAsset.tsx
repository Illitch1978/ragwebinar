import React from 'react';

const UXAsset = () => (
  <div className="dimension-asset-premium">
    <div className="pedestal-glow" style={{ background: 'radial-gradient(ellipse, #f472b6 0%, transparent 70%)' }}></div>
    <svg viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      {/* Dynamic Circuit Paths */}
      <path d="M100 200 C 150 100, 350 300, 400 200" stroke="rgba(244, 114, 182, 0.2)" strokeWidth="2" fill="none" />
      <path d="M100 200 C 150 100, 350 300, 400 200" stroke="#f472b6" strokeWidth="4" strokeLinecap="round" strokeDasharray="1 20" fill="none" style={{ animation: 'dash-scroll 4s infinite linear' }} />

      <path d="M100 250 C 180 350, 320 50, 400 150" stroke="rgba(167, 139, 250, 0.1)" strokeWidth="1" fill="none" />
      <path d="M100 250 C 180 350, 320 50, 400 150" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 30" fill="none" style={{ animation: 'dash-scroll 6s infinite linear reverse' }} />

      {/* Interactive Nodes */}
      <g>
        <circle cx="100" cy="200" r="6" fill="#f472b6">
          <animate attributeName="r" values="5;8;5" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="250" cy="200" r="6" fill="#ffffff" opacity="0.8" />
        <circle cx="400" cy="200" r="6" fill="#4fd1ed" />
      </g>

      {/* Floating User Particles */}
      <circle r="3" fill="white">
        <animateMotion path="M100 200 C 150 100, 350 300, 400 200" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle r="2" fill="white" opacity="0.5">
        <animateMotion path="M100 250 C 180 350, 320 50, 400 150" dur="3.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  </div>
);

export default UXAsset;
