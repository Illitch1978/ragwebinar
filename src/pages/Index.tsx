import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRightIcon } from '@/components/Icons';
import ProtocolCard from '@/components/landing/ProtocolCard';
import PricingSection from '@/components/landing/PricingSection';
import Footer from '@/components/landing/Footer';
import CyclingTagline from '@/components/landing/CyclingTagline';
import SocialProofSection from '@/components/landing/SocialProofSection';
import { DIMENSIONS } from '@/lib/constants';
import heroVideo from '@/assets/hero-video.mp4';
import protocolBgVideo from '@/assets/protocol-bg.mp4';

function Index() {
  const [inputValue, setInputValue] = useState('');
  const heroInputRef = useRef<HTMLInputElement>(null);
  const inputWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    heroInputRef.current?.focus();
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

  const handleCtaClick = useCallback(() => {
    heroInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    setTimeout(() => {
      heroInputRef.current?.focus();
      inputWrapperRef.current?.classList.add('input-glow');
      
      setTimeout(() => {
        inputWrapperRef.current?.classList.remove('input-glow');
      }, 1500);
    }, 600);
  }, []);

  return (
    <div className="immersive-app">
      <div className="stage-container landing-scroll">
        <div className="landing-page">
          <section className="hero-section">
            <div className="hero-top-bar">
              <div className="logo">mondro<span className="dot"></span></div>
              <div className="signup-btn-wrapper">
                <a href="#" className="signup-btn">Get Started</a>
              </div>
            </div>
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
            <p className="hero-subtext">Get a single score that reflects how your website really performs.</p>
            <div className="hero-input-container">
              <div className="input-wrapper-glow">
                <div className="input-wrapper" ref={inputWrapperRef}>
                  <div className="placeholder-with-cursor">
                    <span>yourwebsite.com</span>
                    <span className="blinking-cursor"></span>
                  </div>
                  <input 
                    ref={heroInputRef} 
                    type="text" 
                    value={inputValue} 
                    onChange={(e) => setInputValue(e.target.value)} 
                    onKeyDown={handleKeyDown} 
                  />
                  <button className="hero-send-btn" onClick={handleSubmit}>
                    <ArrowRightIcon />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Cycling Tagline - Main feature between hero and framework */}
          <section className="tagline-section">
            <CyclingTagline isVisible={true} />
          </section>

          {/* Framework section */}
          <section className="protocol-video-section">
            <div className="protocol-video-container">
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                className="protocol-video"
              >
                <source src={protocolBgVideo} type="video/mp4" />
              </video>
              <div className="protocol-video-overlay"></div>
            </div>
            
            <div className="protocol-content">
              <h2 className="protocol-framework-title">THE SCORING FRAMEWORK</h2>
              <div className="protocol-list">
                {DIMENSIONS.map((dim, idx) => (
                  <ProtocolCard key={dim.id} dim={dim} idx={idx} />
                ))}
              </div>
            </div>
          </section>

          <SocialProofSection onCtaClick={handleCtaClick} />
          <PricingSection />
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Index;
