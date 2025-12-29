import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

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
    priority: 'Priority action',
    description: 'Align brand assets with high-value knowledge graph entities to ensure AI crawlers recognize your firm as authoritative.',
  },
  {
    title: 'Citation Bridge Building',
    priority: 'Recommended next step',
    description: 'Secure placements in tier-one financial press and institutional publications to build trust signals.',
  },
  {
    title: 'Contextual Authority Scaling',
    priority: 'High impact',
    description: 'Deploy region-specific landing pages addressing jurisdiction-specific regulations and tax frameworks.',
  },
  {
    title: 'Schema Markup Overhaul',
    priority: 'Priority action',
    description: 'Implement JSON-LD structured data across service pages and profiles for rich snippet visibility.',
  },
  {
    title: 'Generative Answer Capture',
    priority: 'Recommended next step',
    description: 'Refactor FAQ content using question-answer formatting optimized for conversational search.',
  },
  {
    title: 'Synthesized Content Hubs',
    priority: 'Strategic initiative',
    description: 'Create interconnected content clusters to establish authority pillars AI models recognize as definitive.',
  },
];

const executiveSummary = [
  { label: 'Visibility Strength', value: 'High' },
  { label: 'Search Dominance', value: 'Strong' },
  { label: 'AI Discoverability', value: 'Emerging' },
];

const VisibilitySection = () => {
  const [showFullRoadmap, setShowFullRoadmap] = useState(false);
  const [showSeoDetail, setShowSeoDetail] = useState(false);
  const [showGeoDetail, setShowGeoDetail] = useState(false);
  
  const visibleRoadmapItems = showFullRoadmap ? geoRoadmap : geoRoadmap.slice(0, 3);

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

      {/* Executive Summary */}
      <div className="space-y-4">
        <h2 className="text-xs font-semibold text-primary uppercase tracking-widest">
          Executive Summary
        </h2>
        
        <div className="grid grid-cols-3 gap-4">
          {executiveSummary.map((item, index) => (
            <div 
              key={index}
              className="p-6 rounded-xl border border-border/50 bg-white text-center"
            >
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest block mb-2">
                {item.label}
              </span>
              <span className="text-2xl font-serif font-medium text-foreground">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Current State Divider */}
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-border/50" />
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
          Current State
        </span>
        <div className="h-px flex-1 bg-border/50" />
      </div>

      {/* Visibility Metrics - Verdict First */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* SEO Performance Card */}
        <div className="p-8 md:p-10 rounded-xl border border-border/50 bg-white flex flex-col">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-4">
            SEO Performance
          </span>
          <span className="text-5xl md:text-6xl font-serif font-normal text-foreground tracking-tight mb-3">
            84
          </span>
          <p className="text-base font-medium text-foreground mb-4">
            Dominant visibility in priority queries
          </p>
          
          <button 
            onClick={() => setShowSeoDetail(!showSeoDetail)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 mt-auto"
          >
            {showSeoDetail ? 'Hide detail' : 'View detail'}
            <ChevronDown className={`w-3 h-3 transition-transform ${showSeoDetail ? 'rotate-180' : ''}`} />
          </button>
          
          {showSeoDetail && (
            <p className="text-sm text-muted-foreground leading-relaxed mt-4 pt-4 border-t border-border/30">
              Your digital footprint commands institutional presence. Key terms used by leading companies in your sector are identified below.
            </p>
          )}
        </div>
        
        {/* GEO Performance Card */}
        <div className="p-8 md:p-10 rounded-xl border border-border/50 bg-white flex flex-col">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-4">
            Generative Engine Optimization
          </span>
          <span className="text-5xl md:text-6xl font-serif font-normal text-foreground tracking-tight mb-3">
            91
          </span>
          <p className="text-base font-medium text-foreground mb-4">
            Strong AI-driven search positioning
          </p>
          
          <button 
            onClick={() => setShowGeoDetail(!showGeoDetail)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 mt-auto"
          >
            {showGeoDetail ? 'Hide detail' : 'View detail'}
            <ChevronDown className={`w-3 h-3 transition-transform ${showGeoDetail ? 'rotate-180' : ''}`} />
          </button>
          
          {showGeoDetail && (
            <p className="text-sm text-muted-foreground leading-relaxed mt-4 pt-4 border-t border-border/30">
              Your firm occupies the contextual foreground of high-intent queries. Recommended actions to increase findability are detailed below.
            </p>
          )}
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

      {/* Recommended Actions Divider */}
      <div className="flex items-center gap-4 mt-4">
        <div className="h-px flex-1 bg-border/50" />
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
          Recommended Actions
        </span>
        <div className="h-px flex-1 bg-border/50" />
      </div>

      {/* Strategic GEO Roadmap */}
      <div className="space-y-5">
        <h2 className="text-xs font-semibold text-primary uppercase tracking-widest">
          Strategic GEO Roadmap
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {visibleRoadmapItems.map((item, index) => (
            <motion.div 
              key={index}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              className="group relative bg-white rounded-xl p-6 md:p-8 flex flex-col justify-between min-h-[180px] border border-border/50 transition-all duration-300 hover:border-primary/20"
            >
              <div className="relative z-10 space-y-3">
                <span className="text-[10px] font-semibold text-primary uppercase tracking-widest">
                  {item.priority}
                </span>
                <h3 className="text-lg md:text-xl font-semibold text-foreground leading-snug font-serif tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-[1.6]">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View Full Roadmap Toggle */}
        {!showFullRoadmap && (
          <button
            onClick={() => setShowFullRoadmap(true)}
            className="w-full py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2 border border-border/50 rounded-xl bg-white hover:border-primary/20"
          >
            View full roadmap
            <ChevronDown className="w-4 h-4" />
          </button>
        )}
        
        {showFullRoadmap && (
          <button
            onClick={() => setShowFullRoadmap(false)}
            className="w-full py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2"
          >
            Show less
            <ChevronDown className="w-4 h-4 rotate-180" />
          </button>
        )}
      </div>
    </div>
  );
};

export default VisibilitySection;
