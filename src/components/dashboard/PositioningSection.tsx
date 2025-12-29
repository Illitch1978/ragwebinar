import { motion } from 'framer-motion';

const PositioningSection = () => {
  const Bullet = () => (
    <span className="relative flex h-2 w-2 mr-2 mt-1.5 shrink-0">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
    </span>
  );

  const QuadrantItem = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground tracking-tight flex items-center">
        <Bullet /> {title}
      </h3>
      <p className="text-muted-foreground text-sm leading-[1.6] pl-4">{children}</p>
    </div>
  );

  const growthStrategies = [
    {
      title: 'Vertical Integration of AI Governance',
      description: 'Reposition as the primary authority on ethical AI implementation within legal and financial sectors to capture early-adopter sentiment.',
      effort: 'Med',
      impact: 'High',
      cta: 'Explore Strategy',
    },
    {
      title: 'Narrative Arbitrage Optimization',
      description: 'Identifying communication gaps in competitor messaging to claim white-space keywords and thought leadership territories.',
      effort: 'Low',
      impact: 'Med',
      cta: 'View Roadmap',
    },
    {
      title: 'Hyper-Personalized Client Lifecycle',
      description: 'Development of a proprietary concierge interface for high-net-worth institutional partners to ensure 98% retention rates.',
      effort: 'High',
      impact: 'High',
      cta: 'Launch Phase',
    },
    {
      title: 'Cross-Channel Semantic Sync',
      description: 'Unifying the linguistic brand profile across all digital touchpoints to reinforce premium positioning and trust signals.',
      effort: 'Low',
      impact: 'High',
      cta: 'Analyze Sync',
    },
  ];

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
      {/* Header with Website Link */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-foreground tracking-tight font-serif">Meridian West</h1>
        <a 
          href="https://meridianwest.co.uk/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors font-medium text-sm group"
        >
          Visit website 
          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
        </a>
      </div>

      {/* Quadrant Grid - Full Width */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-6 rounded-2xl bg-secondary/50 border border-border">
        <QuadrantItem title="Market Position">
          Specialized "strategic insight partner" exclusively serving professional services firms. Deep vertical expertise spanning elite law firms, wealth management practices, real estate advisory, and accountancy firms. Positioned as trusted advisors who intimately understand sector-specific dynamics, competitive pressures, and the unique challenges of partnership structures. Not a generalist consultancy—a specialist that speaks the language of professional services.
        </QuadrantItem>

        <QuadrantItem title="Target Market">
          B2B targeting C-suite executives and senior partners at high-value advisory firms including Allen & Overy, Knight Frank, Savills, and similar tier-one organizations. Primary decision-makers are Managing Partners, CMOs, and Client Service Directors. These buyers are inherently risk-averse, relationship-driven, and value discretion above all. Sales cycles are long (6-12 months) requiring patient, consultative engagement built on demonstrated credibility.
        </QuadrantItem>

        <QuadrantItem title="Value Proposition">
          The convergence of rigorous evidence and strategic insight—not just data, but judgment. Three core pillars: "Client Insight" through systematic listening programs that surface unspoken client needs; "Thought Leadership" via proprietary research that shapes industry conversation; and "Growth Strategies" that translate findings into actionable recommendations with measurable outcomes. Every engagement minimizes decision risk through evidence-based guidance.
        </QuadrantItem>

        <QuadrantItem title="Brand Personality">
          The "Sage" archetype—sophisticated, restrained, and quietly authoritative. Language mirrors clients' own professional demeanor: measured confidence rather than aggressive claims, precision over hyperbole. Visual identity emphasizes understated elegance befitting advisory relationships built on trust and discretion. Avoids consultant clichés; projects the gravitas expected by senior partners at elite firms.
        </QuadrantItem>
      </div>

      {/* Growth Strategies - Premium Editorial Design */}
      <div className="space-y-5">
        <h2 className="text-xl font-semibold text-foreground font-serif tracking-tight">
          Growth Strategies
        </h2>

        {/* Slate background container */}
        <div className="bg-muted/30 rounded-2xl p-5 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {growthStrategies.map((strategy, index) => (
              <motion.div 
                key={index}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                className="group relative bg-background rounded-xl p-6 md:p-8 flex flex-col justify-between min-h-[260px] border border-border/40 transition-all duration-300 hover:border-primary/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04),0_4px_10px_rgba(0,0,0,0.02)]"
                style={{
                  backdropFilter: 'blur(8px)',
                }}
              >
                {/* Ghost Numeral */}
                <span 
                  className="absolute top-4 right-5 text-[80px] md:text-[100px] font-serif font-bold leading-none select-none pointer-events-none tracking-tighter"
                  style={{ 
                    color: 'hsl(var(--muted-foreground) / 0.06)',
                  }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="relative z-10 space-y-4">
                  {/* Minimalist Pill Tags */}
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 text-[10px] font-mono font-medium tracking-wide uppercase rounded-md border border-border/80 text-muted-foreground bg-muted/30">
                      Effort: {strategy.effort}
                    </span>
                    <span className="px-2.5 py-1 text-[10px] font-mono font-medium tracking-wide uppercase rounded-md bg-foreground text-background">
                      Impact: {strategy.impact}
                    </span>
                  </div>

                  {/* Title - Serif elegance */}
                  <h3 className="text-xl md:text-[22px] font-semibold text-foreground leading-snug pr-14 font-serif tracking-tight">
                    {strategy.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-[1.65] pr-10">
                    {strategy.description}
                  </p>
                </div>

                {/* CTA Link */}
                <button className="relative z-10 mt-6 text-[11px] font-semibold text-foreground uppercase tracking-widest underline underline-offset-4 decoration-muted-foreground/40 hover:decoration-primary hover:text-primary transition-all duration-200 text-left w-fit">
                  {strategy.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PositioningSection;
