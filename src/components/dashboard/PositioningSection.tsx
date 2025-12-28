const PositioningSection = () => {
  const swotItems = [
    { title: "Strengths", letter: "S", color: "bg-emerald-500", borderColor: "border-emerald-500/30", textColor: "text-emerald-400" },
    { title: "Weaknesses", letter: "W", color: "bg-red-500", borderColor: "border-red-500/30", textColor: "text-red-400" },
    { title: "Opportunities", letter: "O", color: "bg-blue-500", borderColor: "border-blue-500/30", textColor: "text-blue-400" },
    { title: "Threats", letter: "T", color: "bg-amber-500", borderColor: "border-amber-500/30", textColor: "text-amber-400" }
  ];

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="space-y-1">
      <h3 className="text-xs font-semibold text-foreground tracking-wide">{title}</h3>
      <p className="text-muted-foreground text-xs leading-relaxed">{children}</p>
    </div>
  );

  return (
    <div className="flex flex-col h-full gap-4 overflow-auto">
      {/* Website Link */}
      <a 
        href="https://meridianwest.co.uk/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-primary hover:text-primary/80 transition-colors font-medium text-sm w-fit"
      >
        https://meridianwest.co.uk/
      </a>

      {/* Main Analysis Box */}
      <div className="bg-card/50 border border-border rounded-xl p-5">
        <h2 className="text-sm font-semibold text-foreground mb-4">Positioning Analysis</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <Section title="Market Position">
            Meridian West positions itself as a specialized "strategic insight partner" tailored specifically for the professional services and advisory sectors. Unlike generalist consultancies, they occupy a niche where deep vertical expertise in law, wealth management, real estate, and accountancy is the primary currency.
          </Section>

          <Section title="Target Market & Audience">
            Their positioning is B2B, targeting the C-suite and senior partners of high-value advisory firms (e.g., Allen & Overy, Knight Frank). These clients are risk-averse and relationship-driven, valuing "trusted advisors" over transactional service providers. Meridian West addresses this by showcasing long-term partnerships and testimonials that emphasize reliability and deep cultural understanding of partnership structures.
          </Section>

          <Section title="Value Proposition">
            Their core value proposition is the convergence of evidence and strategy. They do not sell mere data; they sell "Insight" that minimizes risk in strategic decision-making. Their three pillars—Client Insight, Thought Leadership, and Growth Strategies—suggest a holistic approach that helps firms not just understand their market but actively shape it. By adding "MeridianAI," they also position themselves as forward-thinking, preventing the perception of being a "legacy" research firm.
          </Section>

          <Section title="Brand Personality">
            The brand archetype is the "Sage." The language is sophisticated, restrained, and authoritative ("Premium insights," "Rigorous research methodology"). They avoid hyperbolic marketing speak, opting instead for a tone of quiet confidence that mirrors the professional demeanor of the clients they serve.
          </Section>

          <div className="md:col-span-2">
            <Section title="Competitive Advantage">
              Their competitive moat is their proprietary benchmarking data (e.g., "Client Listening Benchmarks"). This positions them not just as consultants, but as the standard-bearers or arbiters of quality within the professional services industry, making it difficult for generalist marketing agencies to compete on the same level of authority.
            </Section>
          </div>
        </div>
      </div>

      {/* Growth Tips Box */}
      <div className="bg-card/50 border border-border rounded-xl p-5">
        <h2 className="text-sm font-semibold text-foreground mb-3">Growth Tips</h2>
        
        <div className="space-y-3">
          <p className="text-muted-foreground text-xs leading-relaxed">
            <span className="text-foreground font-medium">Growth via "Open" Authority:</span> To boost growth, Meridian West should pivot its digital positioning from a "brochure" capability showcase to a dynamic Knowledge Hub. Currently, valuable insights (like the CLIMB research) feel gated behind the premise of existing relationships.
          </p>
          
          <p className="text-muted-foreground text-xs leading-relaxed">
            <span className="text-foreground font-medium">Recommendation:</span> Adopt a "Gated-Lite" Content Strategy focused on SEO and LinkedIn.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div className="bg-background/30 rounded-lg p-3 border border-border/50">
              <h4 className="text-xs font-medium text-foreground mb-1">Deconstruct Reports</h4>
              <p className="text-muted-foreground text-[11px] leading-relaxed">Break high-value findings from Benchmarks into shareable infographics for LinkedIn, targeting "Head of BD" or "Managing Partner" roles.</p>
            </div>
            <div className="bg-background/30 rounded-lg p-3 border border-border/50">
              <h4 className="text-xs font-medium text-foreground mb-1">MeridianAI as a Hook</h4>
              <p className="text-muted-foreground text-[11px] leading-relaxed">Create an interactive landing page for MeridianAI with a demo tool to signal innovation and capture modernization-seeking leads.</p>
            </div>
            <div className="bg-background/30 rounded-lg p-3 border border-border/50">
              <h4 className="text-xs font-medium text-foreground mb-1">Search Intent</h4>
              <p className="text-muted-foreground text-[11px] leading-relaxed">Optimise blog content for "problem-aware" queries (e.g., "improving law firm client retention") to catch prospects earlier.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Premium SWOT Grid */}
      <div className="flex gap-3">
        {swotItems.map((item) => (
          <button 
            key={item.title}
            className={`relative w-16 h-16 bg-card/60 border ${item.borderColor} rounded-lg cursor-pointer 
                       transition-all duration-200 group overflow-hidden
                       hover:bg-card/80 hover:border-opacity-60`}
          >
            <div className={`absolute top-0 left-0 right-0 h-0.5 ${item.color}`} />
            <div className="flex flex-col items-center justify-center h-full">
              <span className={`text-lg font-semibold ${item.textColor}`}>{item.letter}</span>
              <span className="text-[8px] text-muted-foreground uppercase tracking-wide">{item.title}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PositioningSection;
