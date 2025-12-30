import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

function Index() {
  const [scrolled, setScrolled] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const heroInputRef = useRef<HTMLInputElement>(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
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

  const EvolvedLogo = () => (
    <div className="flex items-center gap-1.5 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <span className="font-serif font-bold text-4xl md:text-5xl tracking-tight text-mondro-ink transition-colors duration-700 group-hover:text-primary">mondro</span>
      <div className="relative flex items-center justify-center">
        <div className="absolute w-4 h-4 bg-primary rounded-full animate-ping opacity-20"></div>
        <div className="w-3.5 h-3.5 bg-primary rounded-full shadow-[0_0_15px_hsl(var(--primary)/0.3)]"></div>
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
    <div className={`p-12 md:p-24 rounded-[2px] border ${isPrimary ? 'border-primary bg-card shadow-[0_60px_100px_-30px_rgba(0,0,0,0.12)] scale-100 md:scale-[1.03] z-10' : 'border-border bg-card/40'} flex flex-col h-full transition-all duration-1000 group`}>
      <div className="font-mono text-[13px] font-bold tracking-[0.4em] text-mondro-stone uppercase mb-8">{type}</div>
      <div className="flex items-baseline gap-4 mb-4">
        <span className="font-serif text-5xl md:text-[5.5rem] text-mondro-ink font-normal tracking-tighter">{price}</span>
        <span className="text-mondro-stone text-lg font-light italic">{subtitle}</span>
      </div>
      <div className={`w-24 h-px ${isPrimary ? 'bg-primary' : 'bg-border'} my-10 md:my-14 transition-all duration-1000 group-hover:w-full`}></div>
      <ul className="space-y-6 md:space-y-8 mb-16 md:mb-24 flex-grow">
        {features.map(f => (
          <li key={f} className="flex items-start gap-4 md:gap-6 text-lg md:text-xl text-mondro-ink font-light border-b border-border/20 pb-6 md:pb-8 last:border-0">
            <span className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-primary/30 mt-2 md:mt-2.5"></span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <button className={`w-full py-5 md:py-7 px-10 rounded-[2px] font-mono text-[12px] md:text-[14px] font-bold tracking-[0.4em] uppercase transition-all duration-700 ${isPrimary ? 'bg-primary text-primary-foreground hover:bg-mondro-ink' : 'border border-mondro-ink text-mondro-ink hover:bg-mondro-ink hover:text-card'}`}>
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
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ${scrolled ? 'bg-card/95 backdrop-blur-2xl border-b border-border py-4 md:py-6' : 'bg-transparent py-8 md:py-14'}`}>
        <div className="container mx-auto px-6 md:px-16 flex justify-between items-center">
          <EvolvedLogo />
          
          <div className="hidden md:flex items-center gap-12 lg:gap-24 text-[15px] font-mono font-bold tracking-[0.4em] text-mondro-stone">
            <a href="#framework" className="relative hover:text-primary transition-colors uppercase group">
              Synthesis
              <span className="absolute bottom-[-4px] left-0 w-0 h-px bg-primary transition-all duration-400 group-hover:w-full"></span>
            </a>
            <a href="#pricing" className="relative hover:text-primary transition-colors uppercase group">
              Engagements
              <span className="absolute bottom-[-4px] left-0 w-0 h-px bg-primary transition-all duration-400 group-hover:w-full"></span>
            </a>
            <a href="/dashboard" className="px-8 lg:px-14 py-4 bg-mondro-ink text-card rounded-[2px] hover:bg-primary transition-all duration-1000 shadow-xl uppercase tracking-[0.6em] text-[11px]">Initiate Audit</a>
          </div>

          {/* Mobile menu button */}
          <a href="/dashboard" className="md:hidden px-6 py-3 bg-mondro-ink text-card rounded-[2px] text-[10px] font-mono font-bold tracking-[0.3em] uppercase">
            Audit
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center justify-center pt-32 md:pt-48 pb-32 md:pb-64 overflow-hidden">
        <motion.div style={{ opacity: heroOpacity }} className="container mx-auto px-6 md:px-16 relative z-10 flex flex-col items-center">
          <div className="max-w-6xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...revealTransition, delay: 0.1 }}
              className="font-serif text-5xl md:text-7xl lg:text-[10rem] font-normal leading-[1] mb-10 md:mb-16 text-mondro-ink tracking-tight"
            >
              Defining the <br/><span className="italic text-mondro-stone/25 font-light">Digital Standard.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...revealTransition, delay: 0.2 }}
              className="max-w-3xl mx-auto text-xl md:text-3xl text-mondro-stone font-light leading-relaxed mb-16 md:mb-24 px-4 opacity-80"
            >
              Judgment is the final luxury.<br className="hidden md:block" /> 
              We distill digital noise into definitive strategic signal.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...revealTransition, delay: 0.3 }}
              className="max-w-3xl mx-auto relative"
            >
              <div className="relative flex flex-col md:flex-row items-center p-3 md:p-4 bg-card border border-border shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] rounded-[2px]">
                <input 
                  ref={heroInputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="domain-to-evaluate.com" 
                  className="w-full bg-transparent px-4 md:px-8 py-4 md:py-6 outline-none font-mono text-lg md:text-xl tracking-[0.1em] text-mondro-ink placeholder:text-mondro-stone/30"
                />
                <button 
                  onClick={handleSubmit}
                  className="w-full md:w-auto flex items-center justify-center gap-4 md:gap-6 bg-mondro-ink text-card px-10 md:px-16 py-4 md:py-6 rounded-[2px] font-mono text-[12px] md:text-[14px] font-bold tracking-[0.5em] uppercase hover:bg-primary transition-all duration-1000 mt-3 md:mt-0"
                >
                  Assess
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </header>

      {/* Synthesis Framework Section */}
      <section className="py-32 md:py-96 bg-card border-y border-border relative shadow-[0_-80px_150px_rgba(0,0,0,0.03)]">
        <div className="container mx-auto px-6 md:px-16 lg:px-32">
          <div className="flex flex-col items-center text-center mb-32 md:mb-64">
            <div className="font-mono text-[12px] md:text-[14px] font-bold tracking-[0.6em] text-mondro-stone uppercase mb-12 md:mb-20 opacity-30">SYNTHESIS FRAMEWORK</div>
            <h2 className="font-serif text-4xl md:text-6xl lg:text-[7.5rem] text-mondro-ink leading-tight italic max-w-[80rem] tracking-tight">
              "Where complexity ends, <br className="hidden md:block"/>authority begins."
            </h2>
            <div className="w-px h-32 md:h-64 bg-primary/30 mt-16 md:mt-24"></div>
          </div>

          <div id="framework" className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-24">
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
      <section id="pricing" className="py-32 md:py-96 bg-background relative">
        <div className="container mx-auto px-6 md:px-16 lg:px-32">
          <div className="flex flex-col items-center text-center mb-32 md:mb-64">
            <div className="font-mono text-[12px] md:text-[14px] font-bold tracking-[0.4em] text-primary uppercase mb-6 md:mb-8 flex items-center gap-6">
              <span className="w-8 md:w-12 h-px bg-primary/30"></span>
              EXECUTIVE ENGAGEMENT
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-[5.5rem] text-mondro-ink leading-[1.05] mb-8 md:mb-10 tracking-tight">
              Intelligence Tiers
            </h2>
            <p className="text-xl md:text-2xl text-mondro-stone font-light leading-relaxed max-w-3xl border-l border-border pl-6 md:pl-10">
              Select the magnitude of analysis required to sustain institutional authority in high-stakes environments.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-24 max-w-[100rem] mx-auto items-stretch">
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
      <section className="bg-card border-y border-border overflow-hidden">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4">
             {[
               { val: "2.4k", label: "Managed Portfolios" },
               { val: "48M", label: "Signals Synthesized" },
               { val: "0.4s", label: "Synthesis Latency" },
               { val: "99%", label: "Verdict Accuracy" }
             ].map((s, i) => (
               <div key={i} className="text-center py-16 md:py-28 px-6 md:px-16 border-r border-border last:border-0 group hover:bg-secondary transition-all duration-700">
                  <div className="font-serif text-4xl md:text-7xl text-mondro-ink mb-4 md:mb-6 transition-transform duration-1000 group-hover:scale-110 tracking-tighter">{s.val}</div>
                  <div className="font-mono text-[10px] md:text-[13px] text-mondro-stone tracking-[0.3em] md:tracking-[0.5em] uppercase font-bold opacity-40">{s.label}</div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Institutional Briefing CTA */}
      <section className="py-48 md:py-80 bg-mondro-ink text-card relative">
        <div className="absolute inset-0 opacity-[0.1] pointer-events-none" style={{
          backgroundImage: 'radial-gradient(hsl(var(--primary)) 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }}></div>
        <div className="container mx-auto px-6 md:px-16 relative z-10 text-center">
          <div className="max-w-5xl mx-auto">
            <div className="font-mono text-[12px] md:text-[14px] font-bold tracking-[0.8em] text-primary uppercase mb-10 md:mb-16">PRIVATE BRIEFING</div>
            <h2 className="font-serif text-5xl md:text-7xl lg:text-[10rem] mb-12 md:mb-20 leading-[0.9] tracking-tighter">The future of trust <br/><span className="italic text-primary">is synthesized.</span></h2>
            <p className="text-muted-foreground text-xl md:text-3xl font-light mb-16 md:mb-24 leading-relaxed max-w-2xl mx-auto opacity-60 italic">
              Subscribe to the private memorandum. Intelligence for the global elite.
            </p>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 max-w-3xl mx-auto">
              <input 
                type="email" 
                placeholder="Institutional email address" 
                className="flex-grow bg-card/5 border border-card/10 px-6 md:px-10 py-5 md:py-8 outline-none font-mono text-base md:text-xl tracking-widest focus:border-primary transition-all rounded-[2px]"
              />
              <button className="bg-card text-mondro-ink px-10 md:px-16 py-5 md:py-8 font-mono text-[12px] md:text-[14px] font-bold tracking-[0.5em] uppercase hover:bg-primary hover:text-primary-foreground transition-all duration-1000 rounded-[2px]">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background py-32 md:py-64 border-t border-border">
        <div className="container mx-auto px-6 md:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-40 mb-24 md:mb-48">
            <div className="lg:col-span-5">
              <EvolvedLogo />
              <p className="text-xl md:text-2xl text-mondro-stone font-light leading-relaxed max-w-lg mt-10 md:mt-16 mb-10 md:mb-16 italic">
                The Luxury of Clarity. <br/>Strategic synthesis for the global standard.
              </p>
              <div className="font-mono text-[12px] text-mondro-stone font-bold tracking-[0.3em] uppercase flex gap-10 md:gap-16">
                <a href="#" className="hover:text-mondro-ink border-b border-border pb-3 transition-all">TWITTER</a>
                <a href="#" className="hover:text-mondro-ink border-b border-border pb-3 transition-all">LINKEDIN</a>
              </div>
            </div>
            <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-24">
              <div>
                <div className="font-mono text-[13px] font-bold tracking-[0.4em] text-mondro-ink mb-8 md:mb-12 uppercase">INTELLIGENCE</div>
                <ul className="space-y-4 md:space-y-6 text-[15px] md:text-[17px] text-mondro-stone font-light">
                  <li><a href="#" className="hover:text-primary transition-colors">The Synthesis</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Trust Markers</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Audit Ledger</a></li>
                </ul>
              </div>
              <div>
                <div className="font-mono text-[13px] font-bold tracking-[0.4em] text-mondro-ink mb-8 md:mb-12 uppercase">ENGAGEMENT</div>
                <ul className="space-y-4 md:space-y-6 text-[15px] md:text-[17px] text-mondro-stone font-light">
                  <li><a href="#" className="hover:text-primary transition-colors">Strategic Briefs</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Partner Access</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Privacy Protocol</a></li>
                </ul>
              </div>
              <div className="hidden md:block">
                <div className="font-mono text-[13px] font-bold tracking-[0.4em] text-mondro-ink mb-12 uppercase">CORPORATE</div>
                <ul className="space-y-6 text-[17px] text-mondro-stone font-light">
                  <li><a href="#" className="hover:text-primary transition-colors">Our Legacy</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Global Hubs</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Governance</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-10 md:pt-16 border-t border-border flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12 text-[10px] md:text-[12px] font-mono tracking-[0.5em] text-mondro-stone uppercase font-bold">
            <span>© 2026 MONDRO INTELLECTUAL CAPITAL</span>
            <div className="flex gap-10 md:gap-20">
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
