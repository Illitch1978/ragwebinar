const PositioningSection = () => {
  const swotItems = [
    {
      title: "Strengths",
      letter: "S",
      color: "from-emerald-500 to-emerald-400",
      borderColor: "border-emerald-500/20",
      bgGlow: "hover:shadow-emerald-500/20",
      letterBg: "bg-emerald-500/10",
      letterColor: "text-emerald-400"
    },
    {
      title: "Weaknesses",
      letter: "W",
      color: "from-red-500 to-red-400",
      borderColor: "border-red-500/20",
      bgGlow: "hover:shadow-red-500/20",
      letterBg: "bg-red-500/10",
      letterColor: "text-red-400"
    },
    {
      title: "Opportunities",
      letter: "O",
      color: "from-blue-500 to-blue-400",
      borderColor: "border-blue-500/20",
      bgGlow: "hover:shadow-blue-500/20",
      letterBg: "bg-blue-500/10",
      letterColor: "text-blue-400"
    },
    {
      title: "Threats",
      letter: "T",
      color: "from-amber-500 to-amber-400",
      borderColor: "border-amber-500/20",
      bgGlow: "hover:shadow-amber-500/20",
      letterBg: "bg-amber-500/10",
      letterColor: "text-amber-400"
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
      <div className="bg-card/50 border border-border rounded-xl p-4 space-y-3">
        <h2 className="text-sm font-semibold text-foreground border-b border-border/50 pb-2">Positioning Analysis</h2>
        <p className="text-muted-foreground text-xs leading-relaxed">
          Meridian West positions itself as a specialized "strategic insight partner" tailored specifically for the professional services and advisory sectors. Unlike generalist consultancies, they occupy a niche where deep vertical expertise in law, wealth management, real estate, and accountancy is the primary currency.
        </p>

        <h3 className="text-xs font-semibold text-foreground/90">Target Market & Audience</h3>
        <p className="text-muted-foreground text-xs leading-relaxed">
          Their positioning is B2B, targeting the C-suite and senior partners of high-value advisory firms (e.g., Allen & Overy, Knight Frank). These clients are risk-averse and relationship-driven, valuing "trusted advisors" over transactional service providers.
        </p>

        <h3 className="text-xs font-semibold text-foreground/90">Value Proposition</h3>
        <p className="text-muted-foreground text-xs leading-relaxed">
          Their core value proposition is the convergence of evidence and strategy. They sell "Insight" that minimizes risk in strategic decision-making. Their three pillars—Client Insight, Thought Leadership, and Growth Strategies—suggest a holistic approach.
        </p>

        <h3 className="text-xs font-semibold text-foreground/90">Brand Personality</h3>
        <p className="text-muted-foreground text-xs leading-relaxed">
          The brand archetype is the "Sage." The language is sophisticated, restrained, and authoritative. They avoid hyperbolic marketing speak, opting for quiet confidence that mirrors their clients' professional demeanor.
        </p>

        <h3 className="text-xs font-semibold text-foreground/90">Competitive Advantage</h3>
        <p className="text-muted-foreground text-xs leading-relaxed">
          Their competitive moat is proprietary benchmarking data (e.g., "Client Listening Benchmarks"), positioning them as standard-bearers within the professional services industry.
        </p>
      </div>

      {/* Growth Tips Box */}
      <div className="bg-card/50 border border-border rounded-xl p-4 space-y-2">
        <h2 className="text-sm font-semibold text-foreground border-b border-border/50 pb-2">Growth Tips</h2>
        <p className="text-muted-foreground text-xs leading-relaxed">
          <span className="text-foreground/90 font-medium">Growth via "Open" Authority:</span> Pivot digital positioning from a "brochure" capability showcase to a dynamic Knowledge Hub. Adopt a "Gated-Lite" Content Strategy focused on SEO and LinkedIn.
        </p>
        <ul className="text-muted-foreground text-xs leading-relaxed space-y-1.5 list-none">
          <li className="flex gap-2"><span className="text-primary">•</span><span><span className="text-foreground/90 font-medium">Deconstruct Reports:</span> Break high-value findings into shareable infographics for LinkedIn.</span></li>
          <li className="flex gap-2"><span className="text-primary">•</span><span><span className="text-foreground/90 font-medium">MeridianAI as a Hook:</span> Create an interactive landing page with a demo tool.</span></li>
          <li className="flex gap-2"><span className="text-primary">•</span><span><span className="text-foreground/90 font-medium">Search Intent:</span> Optimise for "problem-aware" queries over "solution-aware" terms.</span></li>
        </ul>
      </div>

      {/* Premium SWOT Grid */}
      <div className="flex gap-3 justify-start">
        {swotItems.map((item) => (
          <button 
            key={item.title}
            className={`relative w-20 h-20 bg-gradient-to-br from-card/80 to-card/40 border ${item.borderColor} rounded-xl 
                       cursor-pointer hover:scale-105 transition-all duration-300 group overflow-hidden
                       backdrop-blur-sm shadow-lg ${item.bgGlow} hover:shadow-xl`}
          >
            {/* Gradient line on top */}
            <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${item.color} opacity-80`} />
            
            {/* Content */}
            <div className="flex flex-col items-center justify-center h-full gap-1">
              <span className={`text-2xl font-bold ${item.letterColor} group-hover:scale-110 transition-transform`}>
                {item.letter}
              </span>
              <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-medium">
                {item.title}
              </span>
            </div>

            {/* Hover glow effect */}
            <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity rounded-xl`} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default PositioningSection;
