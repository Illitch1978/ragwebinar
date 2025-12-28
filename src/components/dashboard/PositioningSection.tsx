const PositioningSection = () => {
  const Bullet = () => (
    <span className="relative flex h-2 w-2 mr-2 mt-1.5 shrink-0">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
    </span>
  );

  const QuadrantItem = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-foreground tracking-wide flex items-center">
        <Bullet /> {title}
      </h3>
      <p className="text-muted-foreground text-xs leading-relaxed pl-4">{children}</p>
    </div>
  );

  return (
    <div className="flex flex-col h-full gap-5 overflow-auto">
      {/* Website Link */}
      <a 
        href="https://meridianwest.co.uk/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-primary hover:text-primary/80 transition-colors font-medium text-sm w-fit"
      >
        https://meridianwest.co.uk/
      </a>

      {/* Quadrant Grid */}
      <div className="grid grid-cols-2 gap-4 bg-card/50 border border-border rounded-xl p-5">
        <QuadrantItem title="Market Position">
          Meridian West positions itself as a specialized "strategic insight partner" tailored specifically for the professional services and advisory sectors. Unlike generalist consultancies, they occupy a niche where deep vertical expertise in law, wealth management, real estate, and accountancy is the primary currency.
        </QuadrantItem>

        <QuadrantItem title="Target Market & Audience">
          Their positioning is B2B, targeting the C-suite and senior partners of high-value advisory firms (e.g., Allen & Overy, Knight Frank). These clients are risk-averse and relationship-driven, valuing "trusted advisors" over transactional service providers.
        </QuadrantItem>

        <QuadrantItem title="Value Proposition">
          Their core value proposition is the convergence of evidence and strategy. They sell "Insight" that minimizes risk in strategic decision-making. Their three pillars—Client Insight, Thought Leadership, and Growth Strategies—suggest a holistic approach that helps firms actively shape their market.
        </QuadrantItem>

        <QuadrantItem title="Brand Personality">
          The brand archetype is the "Sage." The language is sophisticated, restrained, and authoritative ("Premium insights," "Rigorous research methodology"). They avoid hyperbolic marketing speak, opting for quiet confidence that mirrors their clients' professional demeanor.
        </QuadrantItem>
      </div>

      {/* Competitive Advantage - Standout */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground flex items-center mb-2">
          <Bullet /> Competitive Advantage
        </h3>
        <p className="text-muted-foreground text-xs leading-relaxed pl-4">
          Their competitive moat is their proprietary benchmarking data (e.g., "Client Listening Benchmarks"). This positions them not just as consultants, but as the standard-bearers or arbiters of quality within the professional services industry, making it difficult for generalist marketing agencies to compete on the same level of authority.
        </p>
      </div>

      {/* Growth Tips - Prominent */}
      <div className="bg-gradient-to-br from-card via-card/80 to-primary/5 border-2 border-primary/30 rounded-xl p-6 shadow-lg shadow-primary/5">
        <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
          <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">Recommended</span>
          Growth Strategy
        </h2>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-foreground flex items-center mb-1">
              <Bullet /> Growth via "Open" Authority
            </h4>
            <p className="text-muted-foreground text-xs leading-relaxed pl-4">
              Pivot digital positioning from a "brochure" capability showcase to a dynamic Knowledge Hub. Valuable insights (like CLIMB research) currently feel gated behind existing relationships. Adopt a "Gated-Lite" Content Strategy focused on SEO and LinkedIn.
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="bg-background/50 rounded-lg p-4 border border-border/50">
              <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center">
                <Bullet /> Deconstruct Reports
              </h4>
              <p className="text-muted-foreground text-[11px] leading-relaxed pl-4">Break high-value Benchmark findings into shareable LinkedIn infographics, targeting "Head of BD" or "Managing Partner" roles.</p>
            </div>
            <div className="bg-background/50 rounded-lg p-4 border border-border/50">
              <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center">
                <Bullet /> MeridianAI as a Hook
              </h4>
              <p className="text-muted-foreground text-[11px] leading-relaxed pl-4">Create an interactive landing page with a demo tool to signal innovation and capture modernization-seeking leads.</p>
            </div>
            <div className="bg-background/50 rounded-lg p-4 border border-border/50">
              <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center">
                <Bullet /> Search Intent
              </h4>
              <p className="text-muted-foreground text-[11px] leading-relaxed pl-4">Optimise for "problem-aware" queries (e.g., "improving law firm client retention") to catch prospects earlier in their journey.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PositioningSection;
