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

  const growthTips = [
    {
      title: 'Productize the "AI Readiness" Audit',
      summary: 'Transform MeridianAI from a bespoke consulting engagement into a fixed-price "AI Readiness Scorecard" delivered within a 2-week sprint. Package includes diagnostic interviews, technology assessment, and prioritized implementation roadmap.',
      strategy: 'A productized audit serves as the perfect wedge offer—it demonstrates competence quickly at lower client risk, creates a standardized deliverable that can be replicated at scale, and naturally segues into larger retainer relationships once value is proven. Price at £15-25k to signal premium positioning while remaining accessible for budget approval.',
      complexity: 'Medium',
      impact: 'High',
    },
    {
      title: 'Weaponize Benchmarking Data for PR',
      summary: 'Reframe proprietary research data as "industry news" rather than internal client intelligence. Commission quarterly studies designed specifically for media pickup, with contrarian angles that challenge conventional wisdom in professional services.',
      strategy: 'Release a quarterly "Trust Index" or "Client Experience Barometer" with deliberately provocative headlines ("72% of AmLaw 100 clients would switch firms for better communication"). Data-driven thought leadership builds top-of-funnel awareness exponentially faster than traditional content marketing. Partner with legal/accounting trade publications for exclusive first access.',
      complexity: 'Low',
      impact: 'Medium',
    },
    {
      title: '"Tech + Touch" Partner Ecosystem',
      summary: 'Establish formal alliance partnerships with the technology vendors your clients already purchase—Intapp for CRM, Salesforce for business development, Peppermint for client feedback automation. Position Meridian as the strategic implementation layer.',
      strategy: 'Become the "Implementation Strategy Partner" that vendors refer when software purchases stall or fail. Technology companies are incentivized to ensure adoption success but lack consulting capabilities—fill this gap. Revenue share or referral fee arrangements create predictable pipeline. Start with 2-3 vendors where you have existing relationships.',
      complexity: 'High',
      impact: 'High',
    },
    {
      title: '"Client Voice" Accreditation Program',
      summary: 'Develop an industry-recognized certification or "seal of approval" based on your proprietary client listening methodology. Firms meeting defined benchmarks earn a digital badge and recognition in annual rankings.',
      strategy: 'This positions Meridian as the definitive arbiter of "Client Excellence" in professional services—a powerful authority play. Certified firms gain marketing differentiation; non-certified firms feel competitive pressure to engage. Annual recertification creates recurring revenue. Consider launching at a major industry conference with founding member firms.',
      complexity: 'Very High',
      impact: 'High',
    },
    {
      title: 'ABM Campaign for "Whale" Prospects',
      summary: 'Design an ultra-personalized Account-Based Marketing campaign targeting the Managing Partners of your top 50 dream clients. Create bespoke research dossiers analyzing each firm\'s specific competitive position and growth opportunities.',
      strategy: 'Send physical, premium-quality reports titled "Strategic Opportunities for [Firm Name] in 2025" directly to decision-makers. Include 3-5 actionable insights specific to their firm, demonstrating you\'ve done the work upfront. Follow up with a personalized video from a senior partner. This high-touch approach converts at 5-10x cold outreach rates for enterprise deals.',
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

      {/* Growth Strategies - Full Width */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">
          Growth Strategies
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {growthTips.map((tip, index) => (
            <div 
              key={index}
              className="p-5 rounded-xl bg-secondary/50 border border-border space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <h3 className="text-sm font-semibold text-foreground leading-tight">{tip.title}</h3>
                </div>
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">{tip.summary}</p>
              <p className="text-foreground/80 text-xs leading-relaxed">
                <span className="font-medium text-primary">Strategy: </span>
                {tip.strategy}
              </p>
              <div className="flex gap-2 text-xs font-medium pt-1">
                <span className={`px-2 py-0.5 rounded border ${getComplexityColor(tip.complexity)}`}>
                  Effort: {tip.complexity}
                </span>
                <span className={`px-2 py-0.5 rounded border ${getImpactColor(tip.impact)}`}>
                  Impact: {tip.impact}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PositioningSection;