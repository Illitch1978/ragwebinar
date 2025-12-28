const PositioningSection = () => {
  const swotItems = [
    {
      title: "Strengths",
      subtitle: "VIEW COMPETITIVE ADVANTAGES",
      color: "from-emerald-500 to-emerald-400",
      borderColor: "border-emerald-500/30",
      glowColor: "shadow-emerald-500/10"
    },
    {
      title: "Weaknesses",
      subtitle: "IDENTIFY CRITICAL GAPS",
      color: "from-red-500 to-red-400",
      borderColor: "border-red-500/30",
      glowColor: "shadow-red-500/10"
    },
    {
      title: "Opportunities",
      subtitle: "UNLOCK GROWTH LEVERS",
      color: "from-blue-500 to-blue-400",
      borderColor: "border-blue-500/30",
      glowColor: "shadow-blue-500/10"
    },
    {
      title: "Threats",
      subtitle: "ANALYZE MARKET RISKS",
      color: "from-amber-500 to-amber-400",
      borderColor: "border-amber-500/30",
      glowColor: "shadow-amber-500/10"
    }
  ];

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Main Content Area - 60% */}
      <div className="flex-[6] bg-card/50 border border-border rounded-xl p-6 overflow-auto">
        <h2 className="text-lg font-semibold text-foreground mb-4">1/ Market Position</h2>
        <div className="text-muted-foreground leading-relaxed space-y-4 text-sm">
          <p>
            <span className="text-foreground font-medium">The Market Position</span> Meridian West effectively occupies the role of the definitive "critical friend" to the professional services elite. By transcending traditional market research, the firm has successfully repositioned "Client Listening" not just as a feedback mechanism, but as a primary engine for firm-wide revenue growth and brand differentiation.
          </p>
          <p>
            <span className="text-foreground font-medium">The Operational Edge</span> A key insight for the firm is the successful productization of its intellectual property. Proprietary frameworks like CLIMB (Client Listening) and ATLAS (Thought Leadership) have transformed intangible consulting advice into measurable, benchmarkable assets. This "structured insight" approach locks in high-value clients (e.g., Allen & Overy, Knight Frank) by offering peer comparison data that generalist agencies cannot replicate.
          </p>
          <p>
            <span className="text-foreground font-medium">The Future Vector</span> The launch of MeridianAI represents a crucial strategic pivot. By integrating generative AI into the research stack, Meridian West is preemptively addressing the threat of "insight commoditization." This allows the firm to scale its analytical capabilities efficiently, ensuring that senior human capital is reserved for high-value strategic interpretation rather than data processing.
          </p>
          <p>
            <span className="text-foreground font-medium">Summary</span> Ultimately, Meridian West's competitive advantage lies in this hybrid vigour: combining the proprietary data of a tech platform with the nuanced, sector-specific wisdom that comes from deep immersion in the partnership model.
          </p>
        </div>
      </div>

      {/* SWOT Grid - 40% */}
      <div className="flex-[4] grid grid-cols-2 gap-4">
        {swotItems.map((item) => (
          <div 
            key={item.title}
            className={`relative bg-card/50 border ${item.borderColor} rounded-xl p-5 cursor-pointer 
                       hover:bg-card/70 transition-all duration-300 group overflow-hidden`}
          >
            {/* Top gradient border */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color}`} />
            
            {/* Corner accents */}
            <div className={`absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 ${item.borderColor} rounded-tl-xl opacity-50`} />
            <div className={`absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 ${item.borderColor} rounded-tr-xl opacity-50`} />
            
            <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
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
