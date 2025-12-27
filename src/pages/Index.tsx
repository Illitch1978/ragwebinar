import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@/components/Icons';
import ProtocolCard from '@/components/landing/ProtocolCard';
import PricingSection from '@/components/landing/PricingSection';
import Footer from '@/components/landing/Footer';
import TextReveal from '@/components/landing/TextReveal';
import CyclingTagline from '@/components/landing/CyclingTagline';
import SocialProofSection from '@/components/landing/SocialProofSection';
import { DIMENSIONS } from '@/lib/constants';
import heroVideo from '@/assets/hero-video.mp4';
import protocolBgVideo from '@/assets/protocol-bg.mp4';

function Index() {
  const [inputValue, setInputValue] = useState('');
  const [textRevealComplete, setTextRevealComplete] = useState(false);
  const [shouldDissolve, setShouldDissolve] = useState(false);
  const [showCyclingTagline, setShowCyclingTagline] = useState(false);
  const [showFramework, setShowFramework] = useState(false);
  const heroInputRef = useRef<HTMLInputElement>(null);
  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    heroInputRef.current?.focus();
  }, []);

  // Scroll gating: prevent scrolling past text-reveal until it completes
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScrollGate = () => {
      if (textRevealComplete) return;
      const maxBeforeReveal = window.innerHeight;
      if (scrollContainer.scrollTop > maxBeforeReveal) {
        scrollContainer.scrollTop = maxBeforeReveal;
      }
    };

    scrollContainer.addEventListener('scroll', handleScrollGate, { passive: true });
    return () => scrollContainer.removeEventListener('scroll', handleScrollGate);
  }, [textRevealComplete]);

  // Auto-trigger dissolve after text reveal completes (no scroll needed)
  useEffect(() => {
    if (textRevealComplete && !shouldDissolve) {
      const timer = setTimeout(() => {
        setShouldDissolve(true);
      }, 800); // Brief pause after reveal before dissolving
      return () => clearTimeout(timer);
    }
  }, [textRevealComplete, shouldDissolve]);

  // Show framework section after tagline has been visible
  useEffect(() => {
    if (showCyclingTagline && !showFramework) {
      const timer = setTimeout(() => {
        setShowFramework(true);
      }, 2000); // Let tagline breathe for 2 seconds
      return () => clearTimeout(timer);
    }
  }, [showCyclingTagline, showFramework]);

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
      <div className="stage-container landing-scroll" ref={scrollContainerRef}>
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

          {/* Text reveal section - minimal padding */}
          <section className="protocol-section protocol-section--light">
            <div className="section-header" style={{ position: 'relative' }}>
              <TextReveal 
                text="People do not experience websites in parts. They judge them as a whole. In seconds, they register credibility, relevance, speed, and clarity. Most tools break this into fragments and miss the bigger picture."
                className="section-desc section-desc--dark"
                onAnimationComplete={() => setTextRevealComplete(true)}
                shouldDissolve={shouldDissolve}
                onDissolveComplete={() => setShowCyclingTagline(true)}
              />
            </div>
          </section>

          {/* Tagline transition - appears after text dissolves */}
          <motion.section 
            className="tagline-transition-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: showCyclingTagline ? 1 : 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ 
              pointerEvents: showCyclingTagline ? 'auto' : 'none',
              height: showCyclingTagline ? 'auto' : 0,
              overflow: 'hidden'
            }}
          >
            <CyclingTagline isVisible={showCyclingTagline} />
          </motion.section>

          {/* Framework section - fades in after tagline has been visible */}
          <motion.section 
            className="protocol-video-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: showFramework ? 1 : 0 }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ pointerEvents: showFramework ? 'auto' : 'none' }}
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
            
            <div className="protocol-content">
              <h2 className="protocol-framework-title">THE SCORING FRAMEWORK</h2>
              <div className="protocol-list">
                {DIMENSIONS.map((dim, idx) => (
                  <ProtocolCard key={dim.id} dim={dim} idx={idx} />
                ))}
              </div>
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
