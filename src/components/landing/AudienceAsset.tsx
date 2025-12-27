import React from 'react';

const AudienceAsset = () => (
  <div className="dimension-asset-premium">
    <div className="pedestal-glow" style={{ background: 'radial-gradient(ellipse, #10b981 0%, transparent 70%)' }}></div>
    <svg viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      {/* Sonar Ripples */}
      <circle cx="250" cy="200" r="10" stroke="#10b981" strokeWidth="2">
        <animate attributeName="r" from="10" to="180" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.8" to="0" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="250" cy="200" r="10" stroke="#10b981" strokeWidth="2">
        <animate attributeName="r" from="10" to="180" dur="4s" begin="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.8" to="0" dur="4s" begin="2s" repeatCount="indefinite" />
      </circle>

      {/* Reticle / Focus Brackets */}
      <g opacity="0.6" stroke="#10b981" strokeWidth="2">
        {/* Top-Left */}
        <path d="M180 150 V130 H200" style={{ animation: 'core-vibrate 2s infinite' }} />
        {/* Top-Right */}
        <path d="M320 150 V130 H300" style={{ animation: 'core-vibrate 2s infinite' }} />
        {/* Bottom-Left */}
        <path d="M180 250 V270 H200" style={{ animation: 'core-vibrate 2s infinite' }} />
        {/* Bottom-Right */}
        <path d="M320 250 V270 H300" style={{ animation: 'core-vibrate 2s infinite' }} />
      </g>

      {/* Central "Truth" Point */}
      <circle cx="250" cy="200" r="5" fill="#10b981" />
      <path d="M250 180 V220 M230 200 H270" stroke="#10b981" strokeWidth="1" opacity="0.4" />
    </svg>
  </div>
);

export default AudienceAsset;
