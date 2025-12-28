const PositioningSection = () => {
  const Bullet = () => (
    <span className="relative flex h-2 w-2 mr-2 mt-1.5 shrink-0">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
    </span>
  );

  const QuadrantItem = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="space-y-1">
      <h3 className="text-xs font-semibold text-foreground tracking-wide flex items-center">
        <Bullet /> {title}
      </h3>
      <p className="text-muted-foreground text-xs leading-relaxed pl-4">{children}</p>
    </div>
  );

  const growthTips = [
    {
      title: 'Productize the "AI Readiness" Audit',
      summary: 'Move MeridianAI to a fixed-price "AI Readiness Scorecard" delivered in 2 weeks.',
      strategy: 'A productized audit acts as a wedge offer—proves competence quickly and segues into larger retainers.',
      complexity: 'Medium',
      complexityColor: 'text-amber-400',
      impact: 'High',
      impactColor: 'text-emerald-400',
    },
    {
      title: 'Weaponize Benchmarking Data (PR)',
      summary: 'Treat proprietary data as "news" for the industry, not just client research.',
      strategy: 'Release a quarterly "Trust Index" with contrarian headlines to build top-of-funnel awareness.',
      complexity: 'Low',
      complexityColor: 'text-emerald-400',
      impact: 'Medium/High',
      impactColor: 'text-amber-400',
    },
    {
      title: '"Tech + Touch" Partner Ecosystem',
      summary: 'Form alliances with vendors clients already buy (Intapp, Salesforce, Peppermint).',
      strategy: 'Position as the "Implementation Strategy Partner"—they refer you to ensure software sticks.',
      complexity: 'High',
      complexityColor: 'text-red-400',
      impact: 'High',
      impactColor: 'text-emerald-400',
    },
    {
      title: '"Client Voice" Accreditation',
      summary: 'Create an industry "seal of approval" based on your listening audits.',
      strategy: 'Firms meeting benchmarks get a digital badge—become the arbiter of "Client Excellence."',
      complexity: 'Very High',
      complexityColor: 'text-red-400',
      impact: 'High (Long-term)',
      impactColor: 'text-amber-400',
    },
    {
      title: 'ABM for "Whale" Prospects',
      summary: 'Create bespoke dossiers for Managing Partners of your top 50 dream clients.',
      strategy: 'Send physical reports titled "Strategic Opportunities for [Firm Name] in 2025."',
      complexity: 'Medium/High',
      complexityColor: 'text-amber-400',
      impact: 'Very High',
      impactColor: 'text-emerald-400',
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Website Link */}
      <a 
        href="https://meridianwest.co.uk/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-primary hover:text-primary/80 transition-colors font-medium text-sm w-fit"
      >
        meridianwest.co.uk
      </a>

      {/* Quadrant Grid */}
      <div className="grid grid-cols-2 gap-3 border border-border/50 rounded-lg p-4 bg-card/30">
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
      <div className="space-y-3">
        <h2 className="text-xs font-medium uppercase tracking-widest text-primary">
          5 Key Growth Tips
        </h2>

        <div className="grid gap-2">
          {growthTips.map((tip, index) => (
            <div 
              key={index}
              className="group flex items-start gap-3 p-3 rounded-lg border border-border/40 bg-card/20 hover:bg-card/40 hover:border-primary/20 transition-all duration-200"
            >
              <span className="flex items-center justify-center w-6 h-6 rounded-md bg-primary/10 text-primary text-xs font-bold shrink-0 mt-0.5">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-medium text-foreground leading-tight">{tip.title}</h3>
                    <p className="text-muted-foreground text-xs mt-0.5">{tip.summary}</p>
                  </div>
                  <div className="flex gap-3 text-[10px] shrink-0 pt-0.5">
                    <span className={tip.complexityColor}>{tip.complexity}</span>
                    <span className={tip.impactColor}>{tip.impact}</span>
                  </div>
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
