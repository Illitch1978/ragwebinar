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

      {/* 5 Key Growth Tips */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
          <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">5 Key</span>
          Growth Tips
        </h2>

        {/* Tip 1 */}
        <div className="group bg-gradient-to-br from-card to-card/80 border border-border hover:border-primary/30 rounded-xl p-5 transition-all duration-300">
          <div className="flex items-start gap-3 mb-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold shrink-0">1</span>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Productize the "AI Readiness" Audit</h3>
              <p className="text-muted-foreground text-xs mt-1">Move MeridianAI from a broad consulting service to a specific, lower-cost "productized" entry point (e.g., a fixed-price "AI Readiness Scorecard" delivered in 2 weeks).</p>
            </div>
          </div>
          <div className="pl-10 space-y-2">
            <p className="text-xs text-muted-foreground"><span className="text-foreground font-medium">Strategy:</span> High-ticket consulting sales cycles are long. A productized audit acts as a wedge offer. It gets you through the door, proves competence quickly, and naturally segues into a larger retainer for implementation.</p>
            <div className="flex gap-4 text-[11px] pt-1">
              <span className="text-amber-500">Complexity: Medium</span>
              <span className="text-emerald-500">Impact: High</span>
            </div>
          </div>
        </div>

        {/* Tip 2 */}
        <div className="group bg-gradient-to-br from-card to-card/80 border border-border hover:border-primary/30 rounded-xl p-5 transition-all duration-300">
          <div className="flex items-start gap-3 mb-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold shrink-0">2</span>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Weaponize Your Benchmarking Data (PR Strategy)</h3>
              <p className="text-muted-foreground text-xs mt-1">Stop treating your proprietary data just as "research" for clients and start treating it as "news" for the industry.</p>
            </div>
          </div>
          <div className="pl-10 space-y-2">
            <p className="text-xs text-muted-foreground"><span className="text-foreground font-medium">Strategy:</span> Release a quarterly "Professional Services Trust Index" and pitch exclusive angles to industry press. Use your data to generate contrarian headlines (e.g., "60% of Law Firm Clients Feel Ignored"). This builds top-of-funnel brand awareness far beyond your current mailing list.</p>
            <div className="flex gap-4 text-[11px] pt-1">
              <span className="text-emerald-500">Complexity: Low</span>
              <span className="text-amber-500">Impact: Medium/High</span>
            </div>
          </div>
        </div>

        {/* Tip 3 */}
        <div className="group bg-gradient-to-br from-card to-card/80 border border-border hover:border-primary/30 rounded-xl p-5 transition-all duration-300">
          <div className="flex items-start gap-3 mb-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold shrink-0">3</span>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Build a "Tech + Touch" Partner Ecosystem</h3>
              <p className="text-muted-foreground text-xs mt-1">Form formal alliances with the vendors your clients are already buying (e.g., Intapp, Salesforce, Peppermint).</p>
            </div>
          </div>
          <div className="pl-10 space-y-2">
            <p className="text-xs text-muted-foreground"><span className="text-foreground font-medium">Strategy:</span> These vendors sell the tool, but clients often fail due to a lack of strategy. Position Meridian West as the official "Implementation Strategy Partner." They refer you to ensure their software sticks; you get access to their warm leads who are already spending money on modernization.</p>
            <div className="flex gap-4 text-[11px] pt-1">
              <span className="text-red-400">Complexity: High</span>
              <span className="text-emerald-500">Impact: High</span>
            </div>
          </div>
        </div>

        {/* Tip 4 */}
        <div className="group bg-gradient-to-br from-card to-card/80 border border-border hover:border-primary/30 rounded-xl p-5 transition-all duration-300">
          <div className="flex items-start gap-3 mb-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold shrink-0">4</span>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Launch a "Client Voice" Accreditation</h3>
              <p className="text-muted-foreground text-xs mt-1">Create an industry standard or "seal of approval" based on your listening audits.</p>
            </div>
          </div>
          <div className="pl-10 space-y-2">
            <p className="text-xs text-muted-foreground"><span className="text-foreground font-medium">Strategy:</span> Establish the "Meridian West Client Centricity Standard." Firms that meet certain benchmarks get a digital badge for their marketing. Professional services firms are status-obsessed; if you become the arbiter of "Client Excellence," they will pay you just to be measured against your standard.</p>
            <div className="flex gap-4 text-[11px] pt-1">
              <span className="text-red-400">Complexity: Very High</span>
              <span className="text-amber-500">Impact: High (Long-term)</span>
            </div>
          </div>
        </div>

        {/* Tip 5 */}
        <div className="group bg-gradient-to-br from-card to-card/80 border border-border hover:border-primary/30 rounded-xl p-5 transition-all duration-300">
          <div className="flex items-start gap-3 mb-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 text-primary text-sm font-bold shrink-0">5</span>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Account-Based Marketing (ABM) for "Whale" Prospects</h3>
              <p className="text-muted-foreground text-xs mt-1">Create bespoke "dossiers" for the Managing Partners of your top 50 dream clients.</p>
            </div>
          </div>
          <div className="pl-10 space-y-2">
            <p className="text-xs text-muted-foreground"><span className="text-foreground font-medium">Strategy:</span> Instead of generic marketing, send a physical, printed report titled "Strategic Opportunities for [Target Firm Name] in 2025," using your outside-in data to highlight 3 specific gaps in their positioning.</p>
            <div className="flex gap-4 text-[11px] pt-1">
              <span className="text-amber-500">Complexity: Medium/High</span>
              <span className="text-emerald-500">Impact: Very High</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PositioningSection;
