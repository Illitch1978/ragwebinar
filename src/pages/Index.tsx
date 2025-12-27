import React, { useState, useEffect, useRef } from 'react';
import DottedGlowBackground from '@/components/DottedGlowBackground';
import { ArrowRightIcon } from '@/components/Icons';
import ProtocolCard from '@/components/landing/ProtocolCard';
import PricingSection from '@/components/landing/PricingSection';
import Footer from '@/components/landing/Footer';
import { INITIAL_PLACEHOLDERS, DIMENSIONS } from '@/lib/constants';
import heroVideo from '@/assets/hero-video.mp4';

function Index() {
  const [inputValue, setInputValue] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const heroInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    heroInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setPlaceholderIndex(p => (p + 1) % INITIAL_PLACEHOLDERS.length), 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = () => {
    if (inputValue.trim()) {
      console.log('Auditing:', inputValue);
      // Future: Trigger AI audit
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="immersive-app">
      <DottedGlowBackground 
        gap={24} 
        radius={1.2} 
        color="rgba(255, 255, 255, 0.02)" 
        glowColor="rgba(167, 139, 250, 0.15)" 
        speedScale={0.3} 
      />

      <div className="landing-nav">
        <div className="logo">mondro<span className="dot"></span></div>
        <div className="nav-actions">
          <a href="#" className="signup-btn">Get Started</a>
        </div>
      </div>

      <div className="stage-container landing-scroll">
        <div className="landing-page">
          <section className="hero-section">
            {/* Hero Video Background */}
            <div className="hero-video-container">
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                className="hero-video"
              >
                <source src={heroVideo} type="video/mp4" />
              </video>
              <div className="hero-video-overlay"></div>
            </div>
            
            <h1>Websites succeed or<br/>fail in seconds.</h1>
            <p className="hero-subtext">Mondro analyzes your digital presence using multi-dimensional AI logic to surface conversion bottlenecks.</p>
            <div className="hero-input-container">
              <div className="input-wrapper">
                <input 
                  ref={heroInputRef} 
                  type="text" 
                  placeholder={INITIAL_PLACEHOLDERS[placeholderIndex]} 
                  value={inputValue} 
                  onChange={(e) => setInputValue(e.target.value)} 
                  onKeyDown={handleKeyDown} 
                />
                <button className="hero-send-btn" onClick={handleSubmit}>
                  <ArrowRightIcon />
                </button>
              </div>
            </div>
          </section>

          <section className="protocol-section">
            <div className="section-header">
              <h2>OUR PROTOCOL</h2>
              <p className="section-desc">
                People do not experience websites in parts. They experience them as a whole.
                In seconds, they sense credibility, relevance, speed, clarity, and ease.
                Most tools break this experience into fragments and miss the big picture.
                Mondro brings it back together, showing where confidence forms, where it fades,
                and why decisions never happen.
              </p>
            </div>
            <div className="protocol-list">
              {DIMENSIONS.map((dim, idx) => (
                <ProtocolCard key={dim.id} dim={dim} idx={idx} />
              ))}
            </div>
          </section>

          <PricingSection />
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Index;
