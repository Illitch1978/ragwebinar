import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const positioningData = [
  {
    title: 'Market Position',
    summary: 'Tier-1 Boutique Consultancy',
    fullText: 'Specialized "strategic insight partner" exclusively serving professional services firms. Deep vertical expertise spanning elite law firms, wealth management practices, real estate advisory, and accountancy firms. Positioned as trusted advisors who intimately understand sector-specific dynamics, competitive pressures, and the unique challenges of partnership structures. Not a generalist consultancy—a specialist that speaks the language of professional services.',
  },
  {
    title: 'Target Market',
    summary: 'Ultra-High Net Worth / Enterprise',
    fullText: 'B2B targeting C-suite executives and senior partners at high-value advisory firms including Allen & Overy, Knight Frank, Savills, and similar tier-one organizations. Primary decision-makers are Managing Partners, CMOs, and Client Service Directors. These buyers are inherently risk-averse, relationship-driven, and value discretion above all. Sales cycles are long (6-12 months) requiring patient, consultative engagement built on demonstrated credibility.',
  },
  {
    title: 'Value Prop',
    summary: 'Unrivaled Analytical Precision',
    fullText: 'The convergence of rigorous evidence and strategic insight—not just data, but judgment. Three core pillars: "Client Insight" through systematic listening programs that surface unspoken client needs; "Thought Leadership" via proprietary research that shapes industry conversation; and "Growth Strategies" that translate findings into actionable recommendations with measurable outcomes. Every engagement minimizes decision risk through evidence-based guidance.',
  },
  {
    title: 'Brand Personality',
    summary: 'Quietly Authoritative & Refined',
    fullText: 'The "Sage" archetype—sophisticated, restrained, and quietly authoritative. Language mirrors clients\' own professional demeanor: measured confidence rather than aggressive claims, precision over hyperbole. Visual identity emphasizes understated elegance befitting advisory relationships built on trust and discretion. Avoids consultant clichés; projects the gravitas expected by senior partners at elite firms.',
  },
];

const growthStrategies = [
  {
    title: 'Institutional Integration',
    description: 'Embedding proprietary reporting tools into legacy partner frameworks.',
    effort: 'Med',
    impact: 'V.High',
  },
  {
    title: 'Authority Content',
    description: 'Bi-annual white papers focused on emerging market vulnerabilities.',
    effort: 'High',
    impact: 'High',
  },
  {
    title: 'Visual Identity Refresh',
    description: 'Subtle refinement of digital touchpoints to reinforce premium status.',
    effort: 'Low',
    impact: 'High',
  },
  {
    title: 'Concierge Experience',
    description: 'Transitioning standard client portals into bespoke executive dashboards.',
    effort: 'Med',
    impact: 'V.High',
  },
  {
    title: 'Strategic Hiring',
    description: 'Acquiring top-tier analysts from competing global firms.',
    effort: 'High',
    impact: 'V.High',
  },
  {
    title: 'Regional Expansion',
    description: 'Establishing a satellite presence in emerging financial hubs.',
    effort: 'High',
    impact: 'Med',
  },
];

const PositioningSection = () => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

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
      {/* Header with Website Link */}
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

      {/* Executive Metrics Section */}
      <div className="space-y-4">
        <h2 className="text-xs font-semibold text-primary uppercase tracking-widest">
          Executive Metrics
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-8 md:p-10 rounded-xl border border-border/50 bg-white text-center flex flex-col items-center justify-center min-h-[140px]">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
              Authority Score
            </span>
            <span className="text-5xl md:text-6xl font-serif font-normal text-foreground tracking-tight">
              88
            </span>
          </div>
          
          <div className="p-8 md:p-10 rounded-xl border border-border/50 bg-white text-center flex flex-col items-center justify-center min-h-[140px]">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
              Strategic Depth
            </span>
            <span className="text-5xl md:text-6xl font-serif font-normal text-foreground tracking-tight">
              94
            </span>
          </div>
          
          <div className="p-8 md:p-10 rounded-xl border border-border/50 bg-white text-center flex flex-col items-center justify-center min-h-[140px]">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
              Market Presence
            </span>
            <span className="text-5xl md:text-6xl font-serif font-normal text-foreground tracking-tight">
              High
            </span>
          </div>
        </div>
      </div>

      {/* Core Positioning Section */}
      <div className="space-y-4">
        <h2 className="text-xs font-semibold text-primary uppercase tracking-widest">
          Core Positioning
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {positioningData.map((item, index) => (
            <button 
              key={index}
              onClick={() => setSelectedCard(index)}
              className="group text-left p-5 md:p-6 rounded-xl border border-border/50 bg-white hover:border-primary/30 transition-all duration-300 flex flex-col gap-3"
            >
              <h3 className="text-base md:text-lg font-semibold text-foreground font-serif tracking-tight group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.summary}
              </p>
              <span className="text-[11px] font-semibold text-primary uppercase tracking-widest mt-auto flex items-center gap-1">
                Explore Details <span className="text-xs">↓</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Dialog for positioning details */}
      <Dialog open={selectedCard !== null} onOpenChange={() => setSelectedCard(null)}>
        <DialogContent className="max-w-lg bg-background border-border/60">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl tracking-tight">
              {selectedCard !== null && positioningData[selectedCard].title}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-muted-foreground leading-[1.7] text-sm">
            {selectedCard !== null && positioningData[selectedCard].fullText}
          </DialogDescription>
        </DialogContent>
      </Dialog>

      {/* Growth Strategies - Premium Editorial Design */}
      <div className="space-y-5">
        <h2 className="text-xs font-semibold text-primary uppercase tracking-widest">
          Growth Strategies
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {growthStrategies.map((strategy, index) => (
            <motion.div 
              key={index}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              className="group relative bg-white rounded-xl p-6 md:p-8 flex flex-col justify-between min-h-[220px] border border-border/50 transition-all duration-300 hover:border-primary/20"
            >
              {/* Ghost Numeral */}
              <span 
                className="absolute top-4 right-5 text-[72px] md:text-[90px] font-serif font-bold leading-none select-none pointer-events-none tracking-tighter"
                style={{ 
                  color: 'hsl(var(--muted-foreground) / 0.08)',
                }}
              >
                {String(index + 1).padStart(2, '0')}
              </span>

              <div className="relative z-10 space-y-3">
                {/* Title - Serif elegance */}
                <h3 className="text-lg md:text-xl font-semibold text-foreground leading-snug pr-10 font-serif tracking-tight">
                  {strategy.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-[1.6] pr-8">
                  {strategy.description}
                </p>
              </div>

              {/* Minimalist Pill Tags at bottom */}
              <div className="relative z-10 flex items-center gap-2 mt-6">
                <span className="px-2.5 py-1 text-[10px] font-mono font-medium tracking-wide uppercase rounded-md border border-border text-muted-foreground">
                  Effort: {strategy.effort}
                </span>
                <span className="px-2.5 py-1 text-[10px] font-mono font-medium tracking-wide uppercase rounded-md border border-foreground bg-foreground text-background">
                  Impact: {strategy.impact}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PositioningSection;
