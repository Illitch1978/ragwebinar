import React from 'react';

const VisualAsset = () => (
  <div className="dimension-asset-premium">
    <div className="pedestal-glow" style={{ background: 'radial-gradient(ellipse, #a78bfa 0%, transparent 70%)' }}></div>
    <svg viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <filter id="prismatic-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="15" />
        </filter>
        <linearGradient id="prism-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="50%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
      </defs>

      {/* Layered Prismatic Rings */}
      <circle cx="250" cy="200" r="120" stroke="url(#prism-grad)" strokeWidth="1" opacity="0.1" />

      <g style={{ transformOrigin: '250px 200px', animation: 'orbit-rotate 25s infinite linear' }}>
        <rect x="175" y="125" width="150" height="150" rx="40" stroke="url(#prism-grad)" strokeWidth="2" opacity="0.5">
          <animate attributeName="stroke-dasharray" values="10,20;40,10;10,20" dur="8s" repeatCount="indefinite" />
        </rect>
      </g>

      <g style={{ transformOrigin: '250px 200px', animation: 'orbit-rotate 15s infinite linear reverse' }}>
        <circle cx="250" cy="200" r="80" stroke="#f472b6" strokeWidth="1" strokeDasharray="5 15" opacity="0.4" />
        <path d="M250 120 L270 140 M230 140 L250 120" stroke="white" strokeWidth="2" opacity="0.8" />
      </g>

      {/* Center Glow */}
      <circle cx="250" cy="200" r="40" fill="url(#prism-grad)" opacity="0.2" style={{ filter: 'url(#prismatic-blur)' }} />
      <circle cx="250" cy="200" r="10" fill="white" style={{ animation: 'core-vibrate 2s infinite' }} />
    </svg>
  </div>
);

export default VisualAsset;
