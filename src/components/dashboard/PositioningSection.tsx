const PositioningSection = () => {
  const Bullet = () => (
    <span className="relative flex h-2 w-2 mr-2 mt-1.5 shrink-0">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
    </span>
  );

  const QuadrantItem = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-foreground tracking-tight flex items-center">
        <Bullet /> {title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed pl-4">{children}</p>
    </div>
  );

  const growthTips = [
    {
      title: 'Productize the "AI Readiness" Audit',
      summary: 'Move MeridianAI to a fixed-price "AI Readiness Scorecard" delivered in 2 weeks.',
      strategy: 'A productized audit acts as a wedge offer—proves competence quickly and segues into larger retainers.',
      complexity: 'Medium',
      impact: 'High',
    },
    {
      title: 'Weaponize Benchmarking Data (PR)',
      summary: 'Treat proprietary data as "news" for the industry, not just client research.',
      strategy: 'Release a quarterly "Trust Index" with contrarian headlines to build top-of-funnel awareness.',
      complexity: 'Low',
      impact: 'Medium',
    },
    {
      title: '"Tech + Touch" Partner Ecosystem',
      summary: 'Form alliances with vendors clients already buy (Intapp, Salesforce, Peppermint).',
      strategy: 'Position as the "Implementation Strategy Partner"—they refer you to ensure software sticks.',
      complexity: 'High',
      impact: 'High',
    },
    {
      title: '"Client Voice" Accreditation',
      summary: 'Create an industry "seal of approval" based on your listening audits.',
      strategy: 'Firms meeting benchmarks get a digital badge—become the arbiter of "Client Excellence."',
      complexity: 'Very High',
      impact: 'High',
    },
    {
      title: 'ABM for "Whale" Prospects',
      summary: 'Create bespoke dossiers for Managing Partners of your top 50 dream clients.',
      strategy: 'Send physical reports titled "Strategic Opportunities for [Firm Name] in 2025."',
      complexity: 'Medium',
      impact: 'Very High',
    },
  ];

  const getComplexityColor = (level: string) => {
    if (level === 'Low') return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (level === 'Medium') return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getImpactColor = (level: string) => {
    if (level.includes('Very High')) return 'text-primary bg-primary/10 border-primary/30';
    if (level.includes('High')) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    return 'text-amber-600 bg-amber-50 border-amber-200';
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
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

      {/* Quadrant Grid */}
      <div className="grid grid-cols-2 gap-6 p-6 rounded-2xl bg-secondary/50 border border-border">
        <QuadrantItem title="Market Position">
          Specialized "strategic insight partner" exclusively serving professional services firms. Deep vertical expertise across law firms, wealth management, real estate advisory, and accountancy practices. Positioned as trusted advisors who understand sector-specific dynamics and competitive pressures.
        </QuadrantItem>

        <QuadrantItem title="Target Market">
          B2B targeting C-suite executives and senior partners at high-value advisory firms including Allen & Overy, Knight Frank, and similar tier-one organizations. Decision-makers are risk-averse, relationship-driven, and value discretion. Long sales cycles requiring consultative engagement.
        </QuadrantItem>

        <QuadrantItem title="Value Proposition">
          Convergence of rigorous evidence and strategic insight. Delivers "Client Insight" through listening programs, "Thought Leadership" via proprietary research, and "Growth Strategies" that translate data into actionable recommendations. Minimizes decision risk through evidence-based guidance.
        </QuadrantItem>

        <QuadrantItem title="Brand Personality">
          The "Sage" archetype—sophisticated, restrained, and quietly authoritative. Language mirrors clients' professional demeanor with measured confidence rather than aggressive claims. Visual identity emphasizes understated elegance befitting advisory relationships built on trust.
        </QuadrantItem>
      </div>

      {/* 5 Key Growth Tips */}
      <div className="space-y-5">
        <h2 className="text-lg font-semibold text-foreground">
          5 Key Growth Strategies
        </h2>

        <div className="space-y-6">
          {growthTips.map((tip, index) => (
            <div 
              key={index}
              className="group"
            >
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full border-2 border-primary/30 bg-primary/5 flex items-center justify-center shrink-0">
                  <span className="text-primary font-semibold text-sm">{index + 1}</span>
                </div>
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-base font-semibold text-foreground">{tip.title}</h3>
                    <div className="flex gap-2 text-xs font-medium shrink-0">
                      <span className={`px-2 py-1 rounded border ${getComplexityColor(tip.complexity)}`}>
                        Effort: {tip.complexity}
                      </span>
                      <span className={`px-2 py-1 rounded border ${getImpactColor(tip.impact)}`}>
                        Impact: {tip.impact}
                      </span>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{tip.summary}</p>
                  <p className="text-foreground/80 text-sm leading-relaxed">
                    <span className="font-medium text-primary">Strategy: </span>
                    {tip.strategy}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PositioningSection;