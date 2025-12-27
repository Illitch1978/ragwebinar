import React, { useState } from 'react';

interface GlowingButtonProps {
  text: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
  icon?: string;
  className?: string;
}

const GlowingButton: React.FC<GlowingButtonProps> = ({ 
  text, 
  size = 'lg', 
  onClick,
  icon,
  className = ""
}) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 800);
    if (onClick) onClick();
  };

  const sizeClasses = {
    sm: "px-4 py-1.5 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3.5 text-lg font-semibold",
    xl: "px-12 py-5 text-2xl font-black"
  };

  return (
    <button 
      onClick={handleClick}
      className={`
        group relative transition-all duration-300 ease-out
        rounded-full border border-white/10 backdrop-blur-xl
        flex items-center justify-center gap-3
        bg-slate-900/40 text-white
        hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {/* 1. PERIMETER TRACE LAYER (The Ghost Line) */}
      <div className="absolute inset-[-1.5px] rounded-full overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div 
          className={`absolute inset-[-200%] ${isClicked ? 'animate-[rotate_0.8s_linear_infinite]' : 'animate-[rotate_3s_linear_infinite]'}`}
          style={{ 
            background: `conic-gradient(from 0deg, transparent 0deg, transparent 280deg, rgba(255,255,255,0.5) 320deg, #fff 340deg, rgba(255,255,255,0.5) 360deg)` 
          }} 
        />
      </div>

      {/* 2. SOLID INNER BACKGROUND (Ensures content clarity) */}
      <div className="absolute inset-[0.5px] rounded-full z-0 bg-slate-900" />

      {/* 3. CLICK FEEDBACK WAVE */}
      <span className={`
        absolute inset-0 rounded-full pointer-events-none bg-white opacity-0
        ${isClicked ? 'animate-[ping_0.6s_ease-out_forwards] !opacity-10' : ''}
      `} />

      {/* 4. BUTTON CONTENT */}
      <span className="relative z-10 flex items-center gap-3">
        {icon && <i className={`${icon} text-white/70 group-hover:text-white transition-colors`} />}
        <span className="font-heading font-semibold tracking-wide">
          {text}
        </span>
      </span>
    </button>
  );
};

export default GlowingButton;
