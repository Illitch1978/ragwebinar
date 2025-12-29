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
      <p className="text-muted-foreground text-sm leading-relaxed pl-4">{children}</p>
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

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header with Website Link */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Meridian West</h1>
        <a 
          href="https://meridianwest.co.uk/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:text-primary/80 transition-colors font-medium text-sm"
        >
          Visit website →
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

      {/* Growth Strategies - Premium Card Design */}
      <div className="space-y-5">
        <h2 className="text-lg font-semibold text-foreground">
          Growth Strategies
        </h2>

        {/* Light gray container with white cards */}
        <div className="bg-muted/40 rounded-2xl p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {growthStrategies.map((strategy, index) => (
              <div 
                key={index}
                className="relative bg-background rounded-xl p-6 md:p-8 flex flex-col justify-between min-h-[240px] shadow-sm"
              >
                {/* Large Background Number - positioned top right */}
                <span className="absolute top-6 right-6 text-[72px] md:text-[90px] font-bold text-muted-foreground/10 leading-none select-none pointer-events-none tracking-tight">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="relative z-10 space-y-4">
                  {/* Badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1 text-[10px] font-semibold tracking-wider uppercase rounded-full border border-border/60 text-muted-foreground">
                      Effort: {strategy.effort}
                    </span>
                    <span className="px-3 py-1 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-foreground text-background">
                      Impact: {strategy.impact}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-foreground leading-tight pr-16">
                    {strategy.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed pr-12">
                    {strategy.description}
                  </p>
                </div>

                {/* CTA Link */}
                <button className="relative z-10 mt-6 text-xs font-bold text-foreground uppercase tracking-wider underline underline-offset-4 decoration-1 hover:text-primary transition-colors text-left">
                  {strategy.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PositioningSection;