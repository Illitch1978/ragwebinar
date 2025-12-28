import ImpactChart from './ImpactChart';

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
      complexityColor: 'text-amber-500',
      impact: 'High',
      impactColor: 'text-emerald-500',
    },
    {
      title: 'Weaponize Benchmarking Data (PR)',
      summary: 'Treat proprietary data as "news" for the industry, not just client research.',
      strategy: 'Release a quarterly "Trust Index" with contrarian headlines to build top-of-funnel awareness.',
      complexity: 'Low',
      complexityColor: 'text-emerald-500',
      impact: 'Medium/High',
      impactColor: 'text-amber-500',
    },
    {
      title: '"Tech + Touch" Partner Ecosystem',
      summary: 'Form alliances with vendors clients already buy (Intapp, Salesforce, Peppermint).',
      strategy: 'Position as the "Implementation Strategy Partner"—they refer you to ensure software sticks.',
      complexity: 'High',
      complexityColor: 'text-red-500',
      impact: 'High',
      impactColor: 'text-emerald-500',
    },
    {
      title: '"Client Voice" Accreditation',
      summary: 'Create an industry "seal of approval" based on your listening audits.',
      strategy: 'Firms meeting benchmarks get a digital badge—become the arbiter of "Client Excellence."',
      complexity: 'Very High',
      complexityColor: 'text-red-500',
      impact: 'High (Long-term)',
      impactColor: 'text-amber-500',
    },
    {
      title: 'ABM for "Whale" Prospects',
      summary: 'Create bespoke dossiers for Managing Partners of your top 50 dream clients.',
      strategy: 'Send physical reports titled "Strategic Opportunities for [Firm Name] in 2025."',
      complexity: 'Medium/High',
      complexityColor: 'text-amber-500',
      impact: 'Very High',
      impactColor: 'text-emerald-500',
    },
  ];

  const NumberBadge = ({ num }: { num: number }) => (
    <div className="relative w-9 h-9 shrink-0">
      <div className="absolute inset-0 rounded-xl bg-primary/10" />
      <div className="absolute inset-[3px] rounded-lg bg-background border-2 border-primary flex items-center justify-center">
        <span className="text-primary font-bold text-sm">{num}</span>
      </div>
    </div>
  );

  return (
    <div className="flex gap-12 w-full">
      {/* Left Column - Content */}
      <div className="flex flex-col gap-8 flex-1 min-w-0">
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
            Specialized "strategic insight partner" for professional services. Deep vertical expertise in law, wealth management, real estate, and accountancy.
          </QuadrantItem>

          <QuadrantItem title="Target Market">
            B2B targeting C-suite and senior partners of high-value advisory firms (Allen & Overy, Knight Frank). Risk-averse and relationship-driven.
          </QuadrantItem>

          <QuadrantItem title="Value Proposition">
            Convergence of evidence and strategy. "Insight" that minimizes risk—Client Insight, Thought Leadership, and Growth Strategies.
          </QuadrantItem>

          <QuadrantItem title="Brand Personality">
            The "Sage" archetype. Sophisticated, restrained, and authoritative language. Quiet confidence mirroring clients' professional demeanor.
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
                  <NumberBadge num={index + 1} />
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-base font-semibold text-foreground">{tip.title}</h3>
                      <div className="flex gap-3 text-xs font-medium shrink-0">
                        <span className={`${tip.complexityColor} bg-secondary px-2.5 py-1 rounded-full`}>
                          {tip.complexity}
                        </span>
                        <span className={`${tip.impactColor} bg-secondary px-2.5 py-1 rounded-full`}>
                          {tip.impact}
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

      {/* Right Column - Chart */}
      <div className="w-80 shrink-0">
        <div className="sticky top-8 p-5 rounded-2xl bg-secondary/30 border border-border">
          <ImpactChart />
        </div>
      </div>
    </div>
  );
};

export default PositioningSection;
