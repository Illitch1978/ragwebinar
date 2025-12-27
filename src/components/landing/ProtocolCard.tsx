import React, { useRef, useState, useEffect } from 'react';

interface Dimension {
  id: string;
  title: string;
  desc: string;
  Asset: React.ComponentType;
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

  return (
    <div 
      ref={cardRef} 
      className={`protocol-glass-card ${idx % 2 === 1 ? 'reverse' : ''} ${isVisible ? 'is-visible' : ''}`}
    >
      <div className="dim-visual-container">
        <dim.Asset />
      </div>
      <div className="dim-text-container">
        <h3>{dim.title}</h3>
        <p>{dim.desc}</p>
        <div className="dim-tags">
          {dim.tags.map((tag: string) => (
            <span key={tag} className="tag">
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
