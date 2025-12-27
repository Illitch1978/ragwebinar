import React from 'react';

const TechnicalAsset = () => (
  <div className="dimension-asset-premium technical-perspective-asset">
    <div className="pedestal-glow tech-glow-primary"></div>
    <svg viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <filter id="hyper-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="15" result="blur" />
          <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>
        <filter id="frosted-glass" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feSpecularLighting surfaceScale="8" specularConstant="1" specularExponent="40" lightingColor="#ffffff" in="blur" result="spec">
            <fePointLight x="250" y="150" z="150" />
          </feSpecularLighting>
          <feComposite in="SourceGraphic" in2="spec" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
        </filter>
        <linearGradient id="fiber-bundle-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="10%" stopColor="rgba(79, 209, 237, 0.4)" />
          <stop offset="50%" stopColor="white" />
          <stop offset="90%" stopColor="rgba(167, 139, 250, 0.4)" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
        <clipPath id="core-clip">
          <rect x="-45" y="-45" width="90" height="90" rx="15" transform="rotate(45)" />
        </clipPath>
      </defs>

      {/* Deep Circuit Grid Layer */}
      <g opacity="0.1" stroke="#4fd1ed" strokeWidth="0.5">
        {[...Array(12)].map((_, i) => (
          <path key={`grid-h-${i}`} d={`M 0 ${i * 40} H 500`} strokeDasharray="2 20" />
        ))}
        {[...Array(12)].map((_, i) => (
          <path key={`grid-v-${i}`} d={`M ${i * 40} 0 V 400`} strokeDasharray="2 20" />
        ))}
      </g>

      {/* Bundled Energy Paths - Fiber Optic Style */}
      <g className="fiber-paths">
        {/* Main Primary Bundle */}
        <g opacity="0.6">
          <path d="M 480 120 C 350 120, 320 180, 250 200 S 150 280, 20 280" stroke="#4fd1ed" strokeWidth="20" opacity="0.05" fill="none" />
          <path d="M 480 120 C 350 120, 320 180, 250 200 S 150 280, 20 280" stroke="url(#fiber-bundle-grad)" strokeWidth="6" strokeLinecap="round" fill="none" className="energy-streak streak-1" />
          <path d="M 480 120 C 350 120, 320 180, 250 200 S 150 280, 20 280" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" strokeDasharray="4 60" className="data-bit-flow" />
        </g>

        {/* Sub Bundle 1 */}
        <g opacity="0.4">
          <path d="M 480 140 C 360 140, 330 190, 250 200 S 140 260, 20 260" stroke="#a78bfa" strokeWidth="4" strokeLinecap="round" fill="none" className="energy-streak streak-2" />
          <path d="M 480 140 C 360 140, 330 190, 250 200 S 140 260, 20 260" stroke="white" strokeWidth="1" strokeLinecap="round" fill="none" strokeDasharray="2 40" className="data-bit-flow-fast" />
        </g>

        {/* Symmetry Bundle */}
        <g opacity="0.5">
          <path d="M 20 120 C 150 120, 180 180, 250 200 S 350 280, 480 280" stroke="url(#fiber-bundle-grad)" strokeWidth="6" strokeLinecap="round" fill="none" className="energy-streak streak-rev" />
          <path d="M 20 120 C 150 120, 180 180, 250 200 S 350 280, 480 280" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" strokeDasharray="4 80" className="data-bit-flow-rev" />
        </g>
      </g>

      {/* High-Fidelity 3D Glass Stack */}
      <g transform="translate(250, 200)">
        {/* Bottom Support Panel */}
        <rect x="-100" y="-100" width="200" height="200" rx="36" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.05)" transform="rotate(45)" className="stack-l1" />

        {/* Middle Logic Refraction Layer */}
        <g className="stack-l2">
          <rect x="-80" y="-80" width="160" height="160" rx="28" fill="rgba(79, 209, 237, 0.04)" stroke="rgba(79, 209, 237, 0.2)" transform="rotate(45)" style={{ filter: 'url(#frosted-glass)' }} />
          {/* Circuit Traces on Middle Layer */}
          <g stroke="#4fd1ed" strokeWidth="0.75" opacity="0.4" transform="rotate(45)">
            <path d="M -60 -60 L -30 -30 M 60 60 L 30 30 M -60 60 L -30 30 M 60 -60 L 30 -30" className="trace-blink" />
            <circle cx="-60" cy="-60" r="1.5" fill="#4fd1ed" />
            <circle cx="60" cy="60" r="1.5" fill="#4fd1ed" />
          </g>
        </g>

        {/* Core Processor Housing */}
        <g className="stack-l3">
          <rect x="-50" y="-50" width="100" height="100" rx="18" fill="rgba(10, 10, 15, 0.98)" stroke="#4fd1ed" strokeWidth="2" transform="rotate(45)" style={{ filter: 'url(#hyper-glow)' }} />

          {/* Internal Quantum Activity */}
          <g clipPath="url(#core-clip)">
            {/* Activity Matrix Cells */}
            {[...Array(4)].map((_, i) => (
              [...Array(4)].map((__, j) => (
                <rect
                  key={`cell-${i}-${j}`}
                  x={-32 + i * 18} y={-32 + j * 18}
                  width="12" height="12" rx="3"
                  fill={i === j ? "#ffffff" : (i + j) % 2 === 0 ? "#4fd1ed" : "#a78bfa"}
                  className="activity-cell"
                  style={{ animationDelay: `${(i + j) * 0.15}s` }}
                />
              ))
            ))}
          </g>

          {/* Sweeping Refractive Sheen */}
          <rect x="-120" y="-40" width="240" height="15" fill="rgba(255,255,255,0.2)" transform="rotate(-45)" className="glass-sheen" />
        </g>
      </g>
    </svg>
  </div>
);

export default TechnicalAsset;
