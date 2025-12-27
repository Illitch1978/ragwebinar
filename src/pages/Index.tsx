import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@/components/Icons';
import ProtocolCard from '@/components/landing/ProtocolCard';
import PricingSection from '@/components/landing/PricingSection';
import Footer from '@/components/landing/Footer';
import TextReveal from '@/components/landing/TextReveal';
import SocialProofSection from '@/components/landing/SocialProofSection';
import { DIMENSIONS } from '@/lib/constants';
import heroVideo from '@/assets/hero-video.mp4';
import protocolBgVideo from '@/assets/protocol-bg.mp4';

function Index() {
  const [inputValue, setInputValue] = useState('');
  const [textRevealComplete, setTextRevealComplete] = useState(false);
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
              <a href="#" className="signup-btn">Get Started</a>
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
            <p className="hero-subtext">Mondro combines over fifty signals into one clear score that shows how your website really performs.</p>
            <div className="hero-input-container">
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
          </section>

          <section className="protocol-section protocol-section--light">
            <div className="section-header">
              <TextReveal 
                text="People do not experience websites in parts. They experience them as a whole. In seconds, they sense credibility, relevance, speed, clarity, and ease. Most tools break this experience into fragments and miss the big picture. Mondro puts the experience back together."
                className="section-desc section-desc--dark"
                onAnimationComplete={() => setTextRevealComplete(true)}
              />
            </div>
          </section>

          {/* Full viewport video background section - gated until text reveal completes */}
          <motion.section 
            className="protocol-video-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: textRevealComplete ? 1 : 0 }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ pointerEvents: textRevealComplete ? 'auto' : 'none' }}
          >
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
            
            <div className="protocol-list">
              {DIMENSIONS.map((dim, idx) => (
                <ProtocolCard key={dim.id} dim={dim} idx={idx} />
              ))}
            </div>
          </motion.section>

          <SocialProofSection onCtaClick={handleCtaClick} />
          <PricingSection />
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Index;
