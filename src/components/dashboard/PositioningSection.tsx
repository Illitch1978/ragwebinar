const PositioningSection = () => {
  const swotItems = [
    {
      title: "Strengths",
      subtitle: "VIEW COMPETITIVE ADVANTAGES",
      color: "from-emerald-500 to-emerald-400",
      borderColor: "border-emerald-500/30",
    },
    {
      title: "Weaknesses",
      subtitle: "IDENTIFY CRITICAL GAPS",
      color: "from-red-500 to-red-400",
      borderColor: "border-red-500/30",
    },
    {
      title: "Opportunities",
      subtitle: "UNLOCK GROWTH LEVERS",
      color: "from-blue-500 to-blue-400",
      borderColor: "border-blue-500/30",
    },
    {
      title: "Threats",
      subtitle: "ANALYZE MARKET RISKS",
      color: "from-amber-500 to-amber-400",
      borderColor: "border-amber-500/30",
    }
  ];

  return (
    <div className="flex flex-col h-full gap-4 overflow-auto">
      {/* Website Link */}
      <a 
        href="https://meridianwest.co.uk/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-primary hover:text-primary/80 transition-colors font-medium text-sm"
      >
        https://meridianwest.co.uk/
      </a>

      {/* Main Analysis Box */}
      <div className="bg-card/50 border border-border rounded-xl p-5 space-y-4">
        <h2 className="text-base font-semibold text-foreground">Positioning Analysis</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Meridian West positions itself as a specialized "strategic insight partner" tailored specifically for the professional services and advisory sectors. Unlike generalist consultancies, they occupy a niche where deep vertical expertise in law, wealth management, real estate, and accountancy is the primary currency.
        </p>

        <h3 className="text-sm font-semibold text-foreground pt-2">Target Market & Audience</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Their positioning is B2B, targeting the C-suite and senior partners of high-value advisory firms (e.g., Allen & Overy, Knight Frank). These clients are risk-averse and relationship-driven, valuing "trusted advisors" over transactional service providers. Meridian West addresses this by showcasing long-term partnerships and testimonials that emphasize reliability and deep cultural understanding of partnership structures.
        </p>

        <h3 className="text-sm font-semibold text-foreground pt-2">Value Proposition</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Their core value proposition is the convergence of evidence and strategy. They do not sell mere data; they sell "Insight" that minimizes risk in strategic decision-making. Their three pillars—Client Insight, Thought Leadership, and Growth Strategies—suggest a holistic approach that helps firms not just understand their market but actively shape it. By adding "MeridianAI," they also position themselves as forward-thinking, preventing the perception of being a "legacy" research firm.
        </p>

        <h3 className="text-sm font-semibold text-foreground pt-2">Brand Personality</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          The brand archetype is the "Sage." The language is sophisticated, restrained, and authoritative ("Premium insights," "Rigorous research methodology"). They avoid hyperbolic marketing speak, opting instead for a tone of quiet confidence that mirrors the professional demeanor of the clients they serve.
        </p>

        <h3 className="text-sm font-semibold text-foreground pt-2">Competitive Advantage</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Their competitive moat is their proprietary benchmarking data (e.g., "Client Listening Benchmarks"). This positions them not just as consultants, but as the standard-bearers or arbiters of quality within the professional services industry, making it difficult for generalist marketing agencies to compete on the same level of authority.
        </p>
      </div>

      {/* Growth Tips Box */}
      <div className="bg-card/50 border border-border rounded-xl p-5 space-y-3">
        <h2 className="text-base font-semibold text-foreground">Growth Tips</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          <span className="text-foreground font-medium">Growth via "Open" Authority:</span> To boost growth, Meridian West should pivot its digital positioning from a "brochure" capability showcase to a dynamic Knowledge Hub. Currently, valuable insights (like the CLIMB research) feel gated behind the premise of existing relationships.
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed">
          <span className="text-foreground font-medium">Recommendation:</span> Adopt a "Gated-Lite" Content Strategy focused on SEO and LinkedIn.
        </p>
        <ul className="text-muted-foreground text-sm leading-relaxed space-y-2 list-disc list-inside">
          <li><span className="text-foreground font-medium">Deconstruct Reports:</span> Break distinct high-value findings from their Benchmarks into bite-sized, shareable infographics for LinkedIn to drive top-of-funnel traffic, specifically targeting "Head of BD" or "Managing Partner" roles.</li>
          <li><span className="text-foreground font-medium">MeridianAI as a Hook:</span> Create a dedicated, interactive landing page for MeridianAI that allows users to test a small tool or view a demo. This signals innovation more effectively than a static service page and captures leads looking for modernization.</li>
          <li><span className="text-foreground font-medium">Search Intent:</span> Optimise blog content for "problem-aware" queries (e.g., "improving law firm client retention") rather than "solution-aware" terms, catching prospects earlier in their buying journey.</li>
        </ul>
      </div>

      {/* SWOT Grid */}
      <div className="grid grid-cols-2 gap-3">
        {swotItems.map((item) => (
          <div 
            key={item.title}
            className={`relative bg-card/50 border ${item.borderColor} rounded-xl p-4 cursor-pointer 
                       hover:bg-card/70 transition-all duration-300 group overflow-hidden`}
          >
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color}`} />
            <div className={`absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 ${item.borderColor} rounded-tl-xl opacity-50`} />
            <div className={`absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 ${item.borderColor} rounded-tr-xl opacity-50`} />
            
            <h3 className="text-base font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            <p className="text-xs text-muted-foreground tracking-wider uppercase">
              {item.subtitle}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PositioningSection;
