import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Globe } from 'lucide-react';
import { ArrowRightIcon } from '@/components/Icons';
import ProtocolCard from '@/components/landing/ProtocolCard';
import PricingSection from '@/components/landing/PricingSection';
import Footer from '@/components/landing/Footer';
import CyclingTagline from '@/components/landing/CyclingTagline';
import SocialProofSection from '@/components/landing/SocialProofSection';
import GlowingButton from '@/components/GlowingButton';
import { DIMENSIONS } from '@/lib/constants';
import heroVideo from '@/assets/hero-video.mp4';
import protocolBgVideo from '@/assets/protocol-bg.mp4';

function Index() {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const heroInputRef = useRef<HTMLInputElement>(null);
  const inputWrapperRef = useRef<HTMLDivElement>(null);

  const isActive = isFocused || inputValue.length > 0;

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
              <GlowingButton text="Get Started" size="md" />
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
            
            {/* Premium URL Input Bar */}
            <div className="hero-input-container">
              <div className="w-full relative group" ref={inputWrapperRef}>
                {/* Ambient Glow */}
                <div 
                  className={`absolute -inset-1 rounded-xl blur transition-opacity duration-500 
                  ${isActive ? 'opacity-40' : 'opacity-10 group-hover:opacity-20'}`}
                  style={{ background: 'linear-gradient(to right, hsl(var(--primary)), hsl(220 91% 54%))' }}
                />

                {/* Gradient Border Container */}
                <div 
                  className={`relative p-[1px] rounded-xl overflow-hidden transition-all duration-500
                  ${isActive 
                    ? 'url-bar-border-active' 
                    : 'url-bar-border-inactive'
                  }`}
                >
                  {/* Input Inner Container */}
                  <div className="relative rounded-xl flex items-center px-5 py-4" style={{ background: 'hsl(240 12% 4%)' }}>
                    {/* Top Glass Highlight */}
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                    {/* Icon */}
                    <div className={`mr-4 transition-all duration-300 ${isActive ? 'text-primary drop-shadow-[0_0_8px_hsl(var(--primary)/0.5)]' : 'text-muted-foreground/50'}`}>
                      <Globe className="w-5 h-5" />
                    </div>

                    {/* The Input Field */}
                    <input
                      ref={heroInputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      onKeyDown={handleKeyDown}
                      placeholder="Enter your website URL..."
                      className="w-full bg-transparent border-none outline-none text-foreground placeholder-muted-foreground/40 tracking-wide text-base z-10"
                      style={{ fontFamily: 'var(--font-sans)' }}
                    />

                    {/* Submit Button */}
                    <button 
                      onClick={handleSubmit}
                      className="ml-4 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer bg-foreground text-background hover:scale-105"
                    >
                      <ArrowRightIcon />
                    </button>
                  </div>
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
