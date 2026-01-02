import { motion } from 'framer-motion';

const positioningData = [
  {
    title: 'Market Position',
    summary: 'Tier-1 Boutique Consultancy',
    fullText: 'Specialized "strategic insight partner" exclusively serving professional services firms. Deep vertical expertise spanning elite law firms, wealth management practices, real estate advisory, and accountancy firms. Positioned as trusted advisors who intimately understand sector-specific dynamics, competitive pressures, and the unique challenges of partnership structures. Not a generalist consultancy: a specialist that speaks the language of professional services.',
  },
  {
    title: 'Target Market',
    summary: 'Ultra-High Net Worth / Enterprise',
    fullText: 'B2B targeting C-suite executives and senior partners at high-value advisory firms including Allen & Overy, Knight Frank, Savills, and similar tier-one organizations. Primary decision-makers are Managing Partners, CMOs, and Client Service Directors. These buyers are inherently risk-averse, relationship-driven, and value discretion above all. Sales cycles are long (6-12 months) requiring patient, consultative engagement built on demonstrated credibility.',
  },
  {
    title: 'Value Prop',
    summary: 'Unrivaled Analytical Precision',
    fullText: 'The convergence of rigorous evidence and strategic insight (not just data, but judgment). Three core pillars: "Client Insight" through systematic listening programs that surface unspoken client needs; "Thought Leadership" via proprietary research that shapes industry conversation; and "Growth Strategies" that translate findings into actionable recommendations with measurable outcomes. Every engagement minimizes decision risk through evidence-based guidance.',
  },
  {
    title: 'Brand Personality',
    summary: 'Quietly Authoritative & Refined',
    fullText: 'The "Sage" archetype: sophisticated, restrained, and quietly authoritative. Language mirrors clients\' own professional demeanor: measured confidence rather than aggressive claims, precision over hyperbole. Visual identity emphasizes understated elegance befitting advisory relationships built on trust and discretion. Avoids consultant clichés; projects the gravitas expected by senior partners at elite firms.',
  },
];

const growthStrategies = [
  {
    title: 'Institutional Integration',
    description: 'Embed proprietary analytics dashboards directly into partner management systems, creating dependency through seamless workflow integration and making Meridian West indispensable to daily operations.',
    effort: 'Med',
    impact: 'V.High',
  },
  {
    title: 'Authority Content',
    description: 'Publish bi-annual white papers examining emerging market vulnerabilities and regulatory shifts, positioning the firm as the definitive voice on sector-specific strategic challenges.',
    effort: 'High',
    impact: 'High',
  },
  {
    title: 'Visual Identity Refresh',
    description: 'Execute a subtle refinement of all digital touchpoints (website, reports, presentations) to reinforce premium positioning and align visual language with tier-one client expectations.',
    effort: 'Low',
    impact: 'High',
  },
  {
    title: 'Concierge Experience',
    description: 'Transform standard client portals into bespoke executive dashboards with personalized insights, real-time data visualization, and white-glove support tailored to each partnership.',
    effort: 'Med',
    impact: 'V.High',
  },
  {
    title: 'Strategic Hiring',
    description: 'Recruit senior analysts and strategists from competing global consultancies to accelerate capability building, expand sector expertise, and signal market leadership to prospective clients.',
    effort: 'High',
    impact: 'V.High',
  },
  {
    title: 'Regional Expansion',
    description: 'Establish satellite presence in emerging financial hubs (Dubai, Singapore, or Zurich) to capture growing demand from internationally-minded professional services firms.',
    effort: 'High',
    impact: 'Med',
  },
];

const PositioningSection = () => {

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    }),
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Executive Metrics Section */}
      <div className="space-y-4">
        <h2 className="text-xs font-semibold text-primary uppercase tracking-widest">
          Executive Metrics
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-border p-8 hover:border-muted-foreground/30 transition-colors h-full flex flex-col">
            <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground mb-4">Authority Score</div>
            <div className="font-serif text-6xl text-foreground mb-2">88</div>
            <div className="text-sm font-medium mb-6">Established credibility</div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Strong trust signals across digital touchpoints. Value clarity and tone seniority align with tier-one expectations.
            </p>
          </div>
          
          <div className="bg-card border border-border p-8 hover:border-muted-foreground/30 transition-colors h-full flex flex-col">
            <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground mb-4">Strategic Depth</div>
            <div className="font-serif text-6xl text-foreground mb-2">94</div>
            <div className="text-sm font-medium mb-6">Exceptional insight</div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Content demonstrates sophisticated understanding of sector dynamics and client challenges at the partnership level.
            </p>
          </div>
          
          <div className="bg-primary/5 border border-primary/20 p-8 hover:border-primary/30 transition-colors h-full flex flex-col">
            <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-primary mb-4">Market Presence</div>
            <div className="font-serif text-4xl text-primary mb-4 mt-2">High</div>
            <div className="text-sm font-medium mb-6 text-primary">Category leader</div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Recognized positioning within professional services advisory. Sustained visibility across key decision-maker channels.
            </p>
          </div>
        </div>
      </div>

      {/* Core Positioning Section */}
      <div className="space-y-4">
        <h2 className="text-xs font-semibold text-primary uppercase tracking-widest">
          Core Positioning
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {positioningData.map((item, index) => (
            <div 
              key={index}
              className="p-5 md:p-6 rounded-xl border border-border/50 bg-white flex flex-col gap-3"
            >
              <h3 className="text-base md:text-lg font-semibold text-foreground font-serif tracking-tight">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.summary}
              </p>
              <p className="text-sm text-muted-foreground leading-[1.7]">
                {item.fullText}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Growth Strategies - Premium Editorial Design */}
      <div className="space-y-5">
        <h2 className="text-xs font-semibold text-primary uppercase tracking-widest">
          Growth Strategies
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {growthStrategies.map((strategy, index) => (
            <motion.div 
              key={index}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              className="group relative bg-white rounded-xl p-6 md:p-8 flex flex-col justify-between min-h-[220px] border border-border/50 transition-all duration-300 hover:border-primary/20"
            >
              {/* Ghost Numeral */}
              <span 
                className="absolute top-4 right-5 text-[72px] md:text-[90px] font-serif font-bold leading-none select-none pointer-events-none tracking-tighter"
                style={{ 
                  color: 'hsl(var(--muted-foreground) / 0.08)',
                }}
              >
                {String(index + 1).padStart(2, '0')}
              </span>

              <div className="relative z-10 space-y-3">
                {/* Title - Serif elegance */}
                <h3 className="text-lg md:text-xl font-semibold text-foreground leading-snug pr-10 font-serif tracking-tight">
                  {strategy.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-[1.6] pr-8">
                  {strategy.description}
                </p>
              </div>

              {/* Minimalist Pill Tags at bottom */}
              <div className="relative z-10 flex items-center gap-2 mt-6">
                <span className="px-2.5 py-1 text-[10px] font-mono font-medium tracking-wide uppercase rounded-md border border-border text-muted-foreground">
                  Effort: {strategy.effort}
                </span>
                <span className="px-2.5 py-1 text-[10px] font-mono font-medium tracking-wide uppercase rounded-md border border-foreground bg-foreground text-background">
                  Impact: {strategy.impact}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PositioningSection;
