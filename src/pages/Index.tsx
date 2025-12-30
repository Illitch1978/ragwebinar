import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

function Index() {
  const [scrolled, setScrolled] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const heroInputRef = useRef<HTMLInputElement>(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    heroInputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (inputValue.trim()) {
      console.log('Assessing:', inputValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const revealTransition = { duration: 1.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] };

  const EvolvedLogo = ({ size = 'default' }: { size?: 'default' | 'small' }) => (
    <div className="flex items-center gap-1.5 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <span className={`font-serif font-bold tracking-tight text-mondro-ink transition-colors duration-700 group-hover:text-primary ${size === 'small' ? 'text-2xl md:text-3xl' : 'text-3xl md:text-4xl'}`}>mondro</span>
      <div className="relative flex items-center justify-center">
        <div className={`absolute bg-primary rounded-full animate-ping opacity-20 ${size === 'small' ? 'w-2.5 h-2.5' : 'w-3 h-3'}`}></div>
        <div className={`bg-primary rounded-full shadow-[0_0_12px_hsl(var(--primary)/0.3)] ${size === 'small' ? 'w-2 h-2' : 'w-2.5 h-2.5'}`}></div>
      </div>
    </div>
  );

  const CapabilityBlock = ({ label, title, description, tags }: { 
    label: string, 
    title: string, 
    description: string,
    tags: string[]
  }) => (
    <div className="group p-10 md:p-16 border border-border hover:border-primary transition-all duration-700 bg-card/70 backdrop-blur-2xl rounded-[2px] relative overflow-hidden flex flex-col h-full shadow-[0_10px_40px_-15px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)]">
      <div className="font-mono text-[13px] font-bold tracking-[0.3em] text-mondro-stone uppercase mb-8 md:mb-12 opacity-50 flex items-center gap-3">
        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
        {label}
      </div>
      <h3 className="font-serif text-3xl md:text-[2.75rem] text-mondro-ink mb-6 md:mb-8 leading-tight">
        {title}
      </h3>
      <p className="text-mondro-stone text-lg md:text-xl leading-relaxed mb-12 md:mb-16 font-light flex-grow">
        {description}
      </p>
      <div className="flex flex-wrap gap-3 md:gap-4">
        {tags.map(tag => (
          <span key={tag} className="px-4 md:px-6 py-2 md:py-2.5 bg-secondary text-mondro-ink text-[10px] md:text-[11px] font-mono font-bold tracking-[0.2em] rounded-[2px] border border-border uppercase group-hover:border-primary/30 transition-colors">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );

  const PricingCard = ({ type, price, subtitle, features, cta, isPrimary }: {
    type: string,
    price: string,
    subtitle: string,
    features: string[],
    cta: string,
    isPrimary?: boolean
  }) => (
    <div className={`p-8 md:p-12 lg:p-16 rounded-[2px] border ${isPrimary ? 'border-primary bg-card shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] z-10' : 'border-border bg-card/40'} flex flex-col h-full transition-all duration-1000 group`}>
      <div className="font-mono text-[11px] md:text-[12px] font-bold tracking-[0.3em] text-mondro-stone uppercase mb-6">{type}</div>
      <div className="flex items-baseline gap-3 mb-3">
        <span className="font-serif text-4xl md:text-5xl lg:text-6xl text-mondro-ink font-normal tracking-tighter">{price}</span>
        <span className="text-mondro-stone text-sm md:text-base font-light italic">{subtitle}</span>
      </div>
      <div className={`w-16 h-px ${isPrimary ? 'bg-primary' : 'bg-border'} my-6 md:my-8 transition-all duration-1000 group-hover:w-full`}></div>
      <ul className="space-y-4 md:space-y-5 mb-8 md:mb-12 flex-grow">
        {features.map(f => (
          <li key={f} className="flex items-start gap-3 md:gap-4 text-base md:text-lg text-mondro-ink font-light border-b border-border/20 pb-4 md:pb-5 last:border-0">
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary/30 mt-2"></span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <button className={`w-full py-4 md:py-5 px-8 rounded-[2px] font-mono text-[10px] md:text-[11px] font-bold tracking-[0.3em] uppercase transition-all duration-700 ${isPrimary ? 'bg-primary text-primary-foreground hover:bg-mondro-ink' : 'border border-mondro-ink text-mondro-ink hover:bg-mondro-ink hover:text-card'}`}>
        {cta}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-sans overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.04]" style={{
        backgroundImage: 'radial-gradient(hsl(var(--primary)) 1px, transparent 1px)',
        backgroundSize: '80px 80px'
      }}></div>

      {/* Navigation */}
      <nav className={`sticky top-0 z-50 transition-all duration-1000 ${scrolled ? 'bg-white/95 backdrop-blur-2xl border-b border-mondro-ink/10 py-4 md:py-6 shadow-sm' : 'bg-transparent py-8 md:py-14'}`}>
        <div className="container mx-auto px-6 md:px-16 flex justify-between items-center">
          <EvolvedLogo />
          
          <div className="hidden md:flex items-center gap-10 lg:gap-20 text-[13px] lg:text-[15px] font-mono font-bold tracking-[0.4em] text-mondro-stone">
            <button
              type="button"
              onClick={() => document.getElementById('framework')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="relative hover:text-primary transition-colors uppercase group"
            >
              Synthesis
              <span className="absolute bottom-[-4px] left-0 w-0 h-px bg-primary transition-all duration-400 group-hover:w-full"></span>
            </button>
            <button
              type="button"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="relative hover:text-primary transition-colors uppercase group"
            >
              Engagements
              <span className="absolute bottom-[-4px] left-0 w-0 h-px bg-primary transition-all duration-400 group-hover:w-full"></span>
            </button>
            <Link
              to="/dashboard"
              className="px-8 lg:px-14 py-3 lg:py-4 bg-mondro-ink text-white rounded-[2px] hover:bg-primary transition-all duration-1000 shadow-xl uppercase tracking-[0.5em] lg:tracking-[0.6em] text-[10px] lg:text-[11px]"
            >
              Initiate Audit
            </Link>
          </div>

          {/* Mobile menu button */}
          <Link to="/dashboard" className="md:hidden px-6 py-3 bg-mondro-ink text-white rounded-[2px] text-[10px] font-mono font-bold tracking-[0.3em] uppercase">
            Audit
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center justify-center -mt-20 md:-mt-28 pb-16 md:pb-32 overflow-hidden">
        <div className="container mx-auto px-6 md:px-16 relative z-10 flex flex-col items-center">
          <div className="max-w-6xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...revealTransition, delay: 0.1 }}
              className="font-serif text-5xl md:text-7xl lg:text-[10rem] font-normal leading-[1] mb-12 md:mb-16 text-mondro-ink tracking-tight"
            >
              Defining the <br/><span className="italic text-mondro-stone/25 font-light">Digital Standard.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...revealTransition, delay: 0.2 }}
              className="max-w-3xl mx-auto text-xl md:text-2xl lg:text-3xl text-mondro-stone font-light leading-relaxed mb-16 md:mb-24 px-4 opacity-80"
            >
              Judgment is the final luxury.<br className="hidden md:block" /> 
              We distill digital noise into definitive strategic signal.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...revealTransition, delay: 0.3 }}
              className="max-w-2xl mx-auto relative"
            >
              <div className="relative flex flex-col md:flex-row items-center p-2 md:p-3 bg-card border border-border shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] rounded-[2px]">
                <input 
                  ref={heroInputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="domain-to-evaluate.com" 
                  className="w-full bg-transparent px-4 md:px-6 py-4 md:py-5 outline-none font-mono text-base md:text-lg tracking-[0.1em] text-mondro-ink placeholder:text-mondro-stone/30"
                />
                <button 
                  onClick={handleSubmit}
                  className="w-full md:w-auto flex items-center justify-center gap-4 bg-mondro-ink text-card px-8 md:px-12 py-4 md:py-5 rounded-[2px] font-mono text-[11px] md:text-[13px] font-bold tracking-[0.4em] uppercase hover:bg-primary transition-all duration-500 mt-2 md:mt-0"
                >
                  Assess
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Synthesis Framework Section */}
      <section className="pt-24 pb-24 md:pt-40 md:pb-48 bg-card border-y border-border relative shadow-[0_-40px_80px_rgba(0,0,0,0.02)]">
        <div className="container mx-auto px-6 md:px-16 lg:px-24">
          <div className="flex flex-col items-center text-center mb-16 md:mb-32">
            <div className="font-mono text-[11px] md:text-[12px] font-bold tracking-[0.5em] text-mondro-stone uppercase mb-8 md:mb-12 opacity-30">SYNTHESIS FRAMEWORK</div>
            <h2 className="font-serif text-4xl md:text-6xl lg:text-[5rem] text-mondro-ink leading-[1.1] italic max-w-5xl tracking-tight">
              "Where complexity ends, <br className="hidden md:block"/>authority begins."
            </h2>
            <div className="w-px h-16 md:h-32 bg-primary/30 mt-10 md:mt-16"></div>
          </div>

          <div id="framework" className="scroll-mt-40 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
            <CapabilityBlock 
              label="VERDICT 01"
              title="Technical Integrity."
              description="The physical infrastructure of your digital presence is your primary trust signal. We measure velocity and resilience at the atomic level."
              tags={['LATENCY', 'STRUCTURE', 'COMPLIANCE']}
            />
            <CapabilityBlock 
              label="VERDICT 02"
              title="Cognitive Perception."
              description="Authority is felt before it is read. We analyze the visual grammar and hierarchy to optimize for senior stakeholder reception."
              tags={['HIERARCHY', 'BALANCE', 'TONE']}
            />
            <CapabilityBlock 
              label="VERDICT 03"
              title="Logical Flow."
              description="Assess the friction between high-intent inquiry and definitive conclusion. Your digital experience must facilitate instantaneous synthesis."
              tags={['CONVERSION', 'USABILITY', 'RETENTION']}
            />
            <CapabilityBlock 
              label="VERDICT 04"
              title="Market Arbitrage."
              description="Identify the delta between market noise and your unique position. Our synthesis provides the leverage for definitive dominance."
              tags={['POSITION', 'VALUE', 'DIFFERENCE']}
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="scroll-mt-40 pt-24 pb-24 md:pt-40 md:pb-48 bg-background relative">
        <div className="container mx-auto px-6 md:px-16 lg:px-24">
          <div className="flex flex-col items-center text-center mb-16 md:mb-32">
            <div className="font-mono text-[11px] md:text-[12px] font-bold tracking-[0.3em] text-primary uppercase mb-4 md:mb-6 flex items-center gap-4">
              <span className="w-6 md:w-10 h-px bg-primary/30"></span>
              EXECUTIVE ENGAGEMENT
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-mondro-ink leading-[1.1] mb-6 md:mb-8 tracking-tight">
              Intelligence Tiers
            </h2>
            <p className="text-base md:text-lg text-mondro-stone font-light leading-relaxed max-w-2xl border-l border-border pl-4 md:pl-6">
              Select the magnitude of analysis required to sustain institutional authority in high-stakes environments.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 max-w-5xl mx-auto items-stretch">
            <PricingCard 
              type="STRATEGIC AUDIT"
              price="$3,500"
              subtitle="per synthesis"
              cta="Acquire Verdict"
              features={[
                "Full-spectrum technical diagnostic",
                "Perception and authority review",
                "Competitor trust-signal mapping",
                "Senior partner presentation deck"
              ]}
            />
            <PricingCard 
              isPrimary
              type="MANAGED OVERSIGHT"
              price="$950"
              subtitle="/per month"
              cta="Initiate Engagement"
              features={[
                "24/7 Authority monitoring",
                "Real-time competitive arbitrage",
                "Quarterly strategic reassessment",
                "Direct partner advisory channel",
                "Predictive market modeling"
              ]}
            />
          </div>
        </div>
      </section>

      {/* Performance Ledger (Metrics) */}
      <section className="scroll-mt-40 bg-card border-y border-border overflow-hidden">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4">
             {[
               { val: "2.4k", label: "Managed Portfolios" },
               { val: "48M", label: "Signals Synthesized" },
               { val: "0.4s", label: "Synthesis Latency" },
               { val: "99%", label: "Verdict Accuracy" }
             ].map((s, i) => (
               <div key={i} className="text-center py-12 md:py-20 px-4 md:px-12 border-r border-border last:border-0 group hover:bg-secondary transition-all duration-700">
                  <div className="font-serif text-3xl md:text-5xl text-mondro-ink mb-3 md:mb-4 tracking-tighter">{s.val}</div>
                  <div className="font-mono text-[9px] md:text-[11px] text-mondro-stone tracking-[0.2em] md:tracking-[0.4em] uppercase font-bold opacity-40">{s.label}</div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Institutional Briefing CTA */}
      <section className="py-32 md:py-48 lg:py-64 bg-mondro-ink text-card relative">
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{
          backgroundImage: 'radial-gradient(hsl(var(--primary)) 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }}></div>
        <div className="container mx-auto px-6 md:px-16 relative z-10 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="font-mono text-[11px] md:text-[13px] font-bold tracking-[0.6em] text-primary uppercase mb-10 md:mb-14">PRIVATE BRIEFING</div>
            <h2 className="font-serif text-6xl md:text-8xl lg:text-[9rem] mb-0 leading-[1] tracking-tight text-card">
              The future of trust
            </h2>
            <h2 className="font-serif text-6xl md:text-8xl lg:text-[9rem] mb-10 md:mb-14 leading-[1] tracking-tight italic text-primary">
              is synthesized.
            </h2>
            <p className="text-card/50 text-lg md:text-xl font-light mb-12 md:mb-16 leading-relaxed max-w-lg mx-auto italic">
              Subscribe to the private memorandum.<br/>
              Intelligence for the global elite.
            </p>
            <div className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto items-stretch">
              <input 
                type="email" 
                placeholder="Institutional email" 
                className="flex-grow bg-card/5 border border-card/15 px-6 md:px-8 py-5 md:py-6 outline-none font-mono text-sm md:text-base tracking-wide text-card placeholder:text-card/40 focus:border-primary transition-all rounded-[2px] min-w-0"
              />
              <button className="bg-card text-mondro-ink px-10 md:px-14 py-5 md:py-6 font-mono text-[11px] md:text-[12px] font-bold tracking-[0.5em] uppercase hover:bg-primary hover:text-primary-foreground transition-all duration-500 rounded-[2px] whitespace-nowrap flex-shrink-0">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background py-16 md:py-32 border-t border-border">
        <div className="container mx-auto px-6 md:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-24 mb-12 md:mb-24">
            <div className="lg:col-span-5">
              <EvolvedLogo size="small" />
              <p className="text-base md:text-lg text-mondro-stone font-light leading-relaxed max-w-md mt-6 md:mt-10 mb-6 md:mb-10 italic">
                The Luxury of Clarity. <br/>Strategic synthesis for the global standard.
              </p>
              <div className="font-mono text-[10px] md:text-[11px] text-mondro-stone font-bold tracking-[0.2em] uppercase flex gap-6 md:gap-10">
                <a href="#" className="hover:text-mondro-ink border-b border-border pb-2 transition-all">TWITTER</a>
                <a href="#" className="hover:text-mondro-ink border-b border-border pb-2 transition-all">LINKEDIN</a>
              </div>
            </div>
            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16">
              <div>
                <div className="font-mono text-[11px] font-bold tracking-[0.3em] text-mondro-ink mb-4 md:mb-6 uppercase">INTELLIGENCE</div>
                <ul className="space-y-2 md:space-y-3 text-[14px] md:text-[15px] text-mondro-stone font-light">
                  <li><a href="#" className="hover:text-primary transition-colors">The Synthesis</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Trust Markers</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Audit Ledger</a></li>
                </ul>
              </div>
              <div>
                <div className="font-mono text-[11px] font-bold tracking-[0.3em] text-mondro-ink mb-4 md:mb-6 uppercase">ENGAGEMENT</div>
                <ul className="space-y-2 md:space-y-3 text-[14px] md:text-[15px] text-mondro-stone font-light">
                  <li><a href="#" className="hover:text-primary transition-colors">Strategic Briefs</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Partner Access</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Privacy Protocol</a></li>
                </ul>
              </div>
              <div className="hidden md:block">
                <div className="font-mono text-[11px] font-bold tracking-[0.3em] text-mondro-ink mb-6 uppercase">CORPORATE</div>
                <ul className="space-y-3 text-[15px] text-mondro-stone font-light">
                  <li><a href="#" className="hover:text-primary transition-colors">Our Legacy</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Global Hubs</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Governance</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-6 md:pt-10 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8 text-[9px] md:text-[10px] font-mono tracking-[0.4em] text-mondro-stone uppercase font-bold">
            <span>© 2026 MONDRO INTELLECTUAL CAPITAL</span>
            <div className="flex gap-8 md:gap-12">
              <span className="opacity-40">LONDON</span>
              <span className="opacity-40">DUBAI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Index;
