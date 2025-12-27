import React from 'react';

interface GlowingButtonProps {
  text: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

const GlowingButton: React.FC<GlowingButtonProps> = ({ 
  text, 
  size = 'md', 
  onClick,
  className = ""
}) => {
  const sizeStyles = {
    sm: {
      padding: 'px-4 py-2',
      text: 'text-xs',
    },
    md: {
      padding: 'px-5 py-2.5',
      text: 'text-xs',
    },
    lg: {
      padding: 'px-7 py-3.5',
      text: 'text-sm',
    },
  };

  const styles = sizeStyles[size];

  return (
    <div className={`relative group ${className}`}>
      {/* Deep Ambient Glow (Behind) */}
      <div 
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
        style={{
          background: 'radial-gradient(circle, hsl(var(--primary) / 0.4) 0%, transparent 70%)',
          transform: 'scale(1.5)',
        }}
      />

      {/* Gradient Border Container */}
      <div 
        className="relative rounded-full p-[1px]"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--foreground) / 0.3) 0%, hsl(var(--foreground) / 0.1) 50%, hsl(var(--foreground) / 0.25) 100%)',
        }}
      >
        {/* The Button Content */}
        <button
          onClick={onClick}
          className={`
            relative ${styles.padding} rounded-full overflow-hidden
            flex items-center justify-center
            transition-all duration-300 ease-out cursor-pointer
            group-hover:shadow-[0_0_20px_hsl(var(--primary)/0.3)]
          `}
          style={{
            background: 'linear-gradient(180deg, hsl(240 10% 10%) 0%, hsl(240 10% 6%) 100%)',
          }}
        >
          {/* Top Glass Highlight */}
          <div 
            className="absolute inset-x-0 top-0 h-1/2 rounded-t-full pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, hsl(var(--foreground) / 0.08) 0%, transparent 100%)',
            }}
          />

          {/* Bottom Shadow for depth */}
          <div 
            className="absolute inset-x-0 bottom-0 h-1/3 rounded-b-full pointer-events-none"
            style={{
              background: 'linear-gradient(0deg, hsl(0 0% 0% / 0.3) 0%, transparent 100%)',
            }}
          />

          {/* Subtle Shine Effect */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: 'linear-gradient(105deg, transparent 40%, hsl(var(--foreground) / 0.06) 45%, hsl(var(--foreground) / 0.12) 50%, hsl(var(--foreground) / 0.06) 55%, transparent 60%)',
              animation: 'shimmer 2s infinite',
            }}
          />

          {/* Text */}
          <span className={`relative z-10 font-heading ${styles.text} font-semibold uppercase tracking-[0.15em] text-foreground/90 group-hover:text-foreground transition-colors duration-300`}>
            {text}
          </span>
        </button>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default GlowingButton;