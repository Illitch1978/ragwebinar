import React, { useRef, useState, useEffect } from 'react';

interface Dimension {
  id: string;
  title: string;
  desc: string;
  tags: string[];
}

interface ProtocolCardProps {
  dim: Dimension;
  idx: number;
}

function ProtocolCard({ dim, idx }: ProtocolCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { 
        setIsVisible(true); 
        observer.unobserve(entry.target); 
      }
    }, { threshold: 0.15 });
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const number = String(idx + 1).padStart(2, '0');

  return (
    <div 
      ref={cardRef} 
      className={`protocol-glass-card ${isVisible ? 'is-visible' : ''}`}
    >
      <div className="dim-number-container">
        <span className="dim-number">{number}</span>
      </div>
      <div className="dim-text-container">
        <h3 className="dim-title">
          {dim.title.split('').map((char, i) => (
            <span 
              key={i} 
              className="title-char"
              style={{ animationDelay: `${i * 0.03}s` }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h3>
        <p>{dim.desc}</p>
        <div className="dim-tags">
          {dim.tags.map((tag: string, tagIdx: number) => (
            <span 
              key={tag} 
              className="tag"
              style={{ animationDelay: `${0.3 + tagIdx * 0.1}s` }}
            >
              <span className="tag-dot"></span>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProtocolCard;