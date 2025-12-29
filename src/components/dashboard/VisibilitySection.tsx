import { motion } from 'framer-motion';

const seoOptimization = [
  { label: 'Tier-One Wealth Strategy', highlighted: false },
  { label: 'Cross-Border Compliance', highlighted: false },
  { label: 'Sovereign Asset Management', highlighted: false },
  { label: 'Family Office Governance', highlighted: false },
  { label: 'Tax-Efficient Liquidity', highlighted: false },
  { label: 'Multilateral M&A Counsel', highlighted: false },
  { label: 'Institutional Risk Hedging', highlighted: false },
  { label: 'ESG Portfolio Alignment', highlighted: false },
  { label: 'Global Custody Services', highlighted: false },
  { label: 'Private Equity Diligence', highlighted: false },
  { label: 'Succession Contingency', highlighted: false },
  { label: 'Alternative Capital Access', highlighted: false },
  { label: 'Regulatory Horizon Scanning', highlighted: false },
  { label: 'Fixed-Income Optimization', highlighted: true },
  { label: 'Concierge Capital Planning', highlighted: false },
  { label: 'Discretionary Asset Flows', highlighted: false },
];

const geoRoadmap = [
  {
    title: 'Semantic Entity Optimization',
    description: 'Align core brand assets with high-value knowledge graph entities.',
    difficulty: 'Med',
    impact: 'Critical',
  },
  {
    title: 'Citation Bridge Building',
    description: 'Develop high-authority backlink architecture through tier-one press.',
    difficulty: 'High',
    impact: 'High',
  },
  {
    title: 'Contextual Authority Scaling',
    description: 'Deploy localized sub-directories for specific geographical markets.',
    difficulty: 'Low',
    impact: 'High',
  },
  {
    title: 'Schema Markup Overhaul',
    description: 'Hardcode JSON-LD snippets for predictive AI crawlers.',
    difficulty: 'Low',
    impact: 'Critical',
  },
  {
    title: 'Generative Answer Capture',
    description: 'Refactor FAQs to capture AI-driven conversational search results.',
    difficulty: 'Med',
    impact: 'High',
  },
  {
    title: 'Synthesized Content Hubs',
    description: 'Cluster thematic topics to increase topical depth scores.',
    difficulty: 'Med',
    impact: 'High',
  },
];

const VisibilitySection = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    }),
  };

  const getImpactStyle = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'critical':
        return 'bg-foreground text-background';
      case 'high':
        return 'bg-primary text-primary-foreground';
      default:
        return 'border border-border text-muted-foreground';
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 pb-6">
        <h1 className="text-3xl font-semibold text-foreground tracking-tight font-serif">Meridian West</h1>
        <a 
          href="https://meridianwest.co.uk/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors font-medium text-sm uppercase tracking-wide group"
        >
          Visit website 
          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
        </a>
      </div>

      {/* Visibility Metrics */}
      <div className="space-y-4">
        <h2 className="text-xs font-semibold text-primary uppercase tracking-widest">
          Visibility Metrics
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-8 md:p-10 rounded-xl border border-border/50 bg-white flex flex-col">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-4">
              SEO Performance
            </span>
            <span className="text-5xl md:text-6xl font-serif font-normal text-foreground tracking-tight mb-6">
              84
            </span>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This index measures your digital footprint's prestige across institutional networks. A score of 84 indicates dominant market presence, signaling to ultra-high-net-worth clients that your advisory remains the benchmark for sophisticated wealth architecture. In our SEO Optimization analysis below, we have identified key terms and phrases used by leading companies in your sector to achieve increased visibility and organic search dominance.
            </p>
          </div>
          
          <div className="p-8 md:p-10 rounded-xl border border-border/50 bg-white flex flex-col">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-4">
              Generative Engine Optimization
            </span>
            <span className="text-5xl md:text-6xl font-serif font-normal text-foreground tracking-tight mb-6">
              91
            </span>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Current AI-driven search models prioritize deep semantic relevance over legacy link structures. This score reflects your firm's superior ability to occupy the contextual foreground of high-intent queries regarding private equity and risk. In our Strategic GEO Roadmap below, we have provided targeted action points designed to raise your level of findability across next-generation AI search platforms and conversational discovery engines.
            </p>
          </div>
        </div>
      </div>

      {/* SEO Optimization */}
      <div className="space-y-4">
        <h2 className="text-xs font-semibold text-primary uppercase tracking-widest">
          SEO Optimization
        </h2>
        
        <div className="p-6 md:p-8 rounded-xl border border-border/50 bg-white">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {seoOptimization.map((item, index) => (
              <div 
                key={index}
                className={`px-4 py-3 rounded-lg border text-center text-sm font-medium transition-colors ${
                  item.highlighted 
                    ? 'border-primary/30 bg-primary/5 text-primary' 
                    : 'border-border bg-muted/20 text-foreground'
                }`}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strategic GEO Roadmap */}
      <div className="space-y-5">
        <h2 className="text-xs font-semibold text-primary uppercase tracking-widest">
          Strategic GEO Roadmap
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {geoRoadmap.map((item, index) => (
            <motion.div 
              key={index}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              className="group relative bg-white rounded-xl p-6 md:p-8 flex flex-col justify-between min-h-[200px] border border-border/50 transition-all duration-300 hover:border-primary/20"
            >
              <div className="relative z-10 space-y-3">
                <h3 className="text-lg md:text-xl font-semibold text-foreground leading-snug font-serif tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-[1.6]">
                  {item.description}
                </p>
              </div>

              {/* Difficulty & Impact Pills */}
              <div className="relative z-10 flex items-center gap-2 mt-6">
                <span className="px-2.5 py-1 text-[10px] font-mono font-medium tracking-wide uppercase rounded-md border border-border text-muted-foreground">
                  Difficulty: {item.difficulty}
                </span>
                <span className={`px-2.5 py-1 text-[10px] font-mono font-medium tracking-wide uppercase rounded-md ${getImpactStyle(item.impact)}`}>
                  Impact: {item.impact}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VisibilitySection;
