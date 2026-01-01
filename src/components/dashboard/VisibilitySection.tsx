import { useState } from "react";
import { toast } from "sonner";

// Harvey Ball Component
const HarveyBall = ({ type }: { type: 'full' | 'half' | 'empty' | 'none' }) => {
  const baseClasses = "w-3 h-3 rounded-full inline-block border";
  
  switch (type) {
    case 'full':
      return <div className={`${baseClasses} border-foreground bg-foreground`} />;
    case 'half':
      return <div className={`${baseClasses} border-foreground`} style={{ background: 'linear-gradient(90deg, hsl(var(--foreground)) 50%, transparent 50%)' }} />;
    case 'empty':
      return <div className={`${baseClasses} border-foreground bg-transparent`} />;
    case 'none':
      return <div className={`${baseClasses} border-muted-foreground/30 bg-muted`} />;
    default:
      return null;
  }
};

// Data Row Component
const DataRow = ({ label, status, type }: { label: string; status: string; type: 'full' | 'half' | 'empty' | 'none' }) => (
  <div className="flex justify-between items-center py-3 border-b border-muted/50 last:border-b-0 text-[13px]">
    <span>{label}</span>
    <div className="flex items-center gap-2">
      <span className={`text-xs ${type === 'none' ? 'text-muted-foreground/40' : type === 'half' ? 'text-muted-foreground/60' : 'text-muted-foreground'}`}>
        {status}
      </span>
      <HarveyBall type={type} />
    </div>
  </div>
);

// Keyword Pill Component
const KeywordPill = ({ keyword }: { keyword: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(keyword);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className={`
        border p-4 text-xs text-center transition-all cursor-copy relative overflow-hidden
        ${copied 
          ? 'bg-primary text-primary-foreground border-primary' 
          : 'bg-card border-border text-muted-foreground hover:border-primary hover:text-primary hover:shadow-md'
        }
      `}
    >
      {copied ? 'Copied' : keyword}
    </button>
  );
};

// SEO Keywords
const seoKeywords = [
  "Tier-One Wealth Strategy",
  "Cross-Border Compliance",
  "Sovereign Asset Management",
  "Family Office Governance",
  "Tax-Efficient Liquidity",
  "Multilateral M&A Counsel",
  "Institutional Risk Hedging",
  "ESG Portfolio Alignment",
  "Global Custody Services",
  "Private Equity Diligence",
  "Succession Contingency",
  "Alternative Capital Access",
];

// Strategic Roadmap Items
const roadmapItems = [
  {
    priority: true,
    title: "Semantic Entity Optimization",
    description: "Map brand assets to specific Knowledge Graph IDs to verify identity. Ensure 'About' pages and Crunchbase profiles explicitly define entity relationships (e.g., \"Subsidiary of,\" \"Founded by\") to validate authority for AI crawlers like Google SGE and Perplexity."
  },
  {
    priority: false,
    title: "Citation Bridge Building",
    description: "Prioritize co-occurrence in high-authority corpora (Tier 1 Press, Academic Journals, Government Directories). LLMs use these 'neighborhoods' to calculate trust scores. A mention in WSJ carries 50x the vector weight of a standard press release."
  },
  {
    priority: true,
    title: "Schema Markup Overhaul",
    description: "Deploy nested JSON-LD Organization and Person schemas. Explicitly link 'sameAs' properties to all social profiles and Wikidata entries. This disambiguates the brand entity from generic terms and secures rich snippets in generative results."
  },
  {
    priority: false,
    title: "Generative Answer Capture",
    description: "Restructure core service pages into 'Problem-Solution' tuplets. Use succinct, direct definitions (<40 words) immediately following headers (H2/H3) to capture 'Zero-Click' snippets. This formatting is optimized for conversational extraction by LLMs."
  },
];

const VisibilitySection = () => {
  const handleCopyAll = () => {
    const allKeywords = seoKeywords.join("\n");
    navigator.clipboard.writeText(allKeywords);
    toast.success("All keywords copied to clipboard");
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Current State Section */}
      <div className="space-y-4">
        <h2 className="text-xs font-semibold text-primary uppercase tracking-widest">
          Current State
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* SEO Performance Card */}
          <div className="bg-card border border-border p-8 hover:border-muted-foreground/30 transition-colors h-full flex flex-col">
            <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground mb-4">SEO Performance</div>
            <div className="font-serif text-6xl text-foreground mb-2">84</div>
            <div className="text-sm font-medium mb-6">Dominant visibility</div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your digital footprint commands institutional presence across high-value search queries. Strong alignment with market leader terminology.
            </p>
          </div>

          {/* Generative Optimization Card */}
          <div className="bg-card border border-border p-8 hover:border-muted-foreground/30 transition-colors h-full flex flex-col">
            <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground mb-4">Generative Optimization</div>
            <div className="font-serif text-6xl text-foreground mb-2">91</div>
            <div className="text-sm font-medium mb-6">AI-driven positioning</div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your firm occupies the contextual foreground of high-intent queries within LLMs. Semantic alignment is optimal.
            </p>
          </div>

          {/* Social Resonance Card - Highlighted */}
          <div className="bg-primary/5 border border-primary/20 p-8 hover:border-primary/30 transition-colors h-full flex flex-col">
            <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-primary mb-4">Social Resonance</div>
            <div className="font-serif text-4xl text-primary mb-4 mt-2">Fragmented</div>
            <div className="text-sm font-medium mb-6 text-primary">Emerging Authority</div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              High brand polish but low executive participation creates an authority vacuum. The market sees the logo, not the leaders.
            </p>
          </div>
        </div>
      </div>

      {/* Social Resonance Diagnostic Section */}
      <div className="space-y-4 mt-8">
        <h2 className="text-xs font-semibold text-primary uppercase tracking-widest">
          Social Resonance Diagnostic
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 01. Resonance Status */}
          <div className="bg-card border border-primary/30 p-8 h-full flex flex-col">
            <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-primary mb-4">01. Resonance Status</div>
            <h3 className="font-serif text-2xl mb-4">Fragmented</h3>
            <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
              <strong className="text-foreground">System Judgement:</strong> Your resonance is technically visible but socially quiet. While the brand channel is active, the lack of human amplification limits reach to "Paid" rather than "Earned."
            </p>
            <div className="mt-4 pt-4 border-t border-primary/10 text-[10px] uppercase tracking-widest text-muted-foreground">
              Question: Is the market hearing us? <span className="text-foreground">Partially.</span>
            </div>
          </div>

          {/* 02. Strategic Gaps */}
          <div className="bg-muted/50 border border-border p-8 h-full flex flex-col">
            <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground mb-4">02. Strategic Gaps</div>
            <div className="space-y-4 flex-grow">
              <div>
                <div className="text-xs font-bold text-foreground uppercase tracking-wide mb-1">Gap: Authority Silo</div>
                <p className="text-xs text-muted-foreground">Credibility is locked in the brand page. It is not being carried by individual leaders.</p>
              </div>
              <div>
                <div className="text-xs font-bold text-foreground uppercase tracking-wide mb-1">Gap: Narrative Fracture</div>
                <p className="text-xs text-muted-foreground">LinkedIn content (technical) does not match Website content (commercial).</p>
              </div>
            </div>
            <div className="mt-auto pt-4 border-t border-border">
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-destructive">Implication: Trust Deficit</span>
            </div>
          </div>

          {/* 03. Platform Presence */}
          <div className="bg-card border border-border p-8 h-full flex flex-col">
            <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground mb-4">03. Platform Presence</div>
            <div className="flex-grow">
              <DataRow label="LinkedIn (Company)" status="Mature" type="full" />
              <DataRow label="LinkedIn (Execs)" status="Silent" type="half" />
              <DataRow label="X / Twitter" status="No Signal" type="none" />
              <DataRow label="Review Sites" status="Emerging" type="half" />
            </div>
          </div>

          {/* 04. Leadership Voice */}
          <div className="bg-card border border-border p-8 h-full flex flex-col">
            <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground mb-4">04. Leadership Voice</div>
            <div className="flex-grow flex flex-col justify-center">
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Brand Channel Activity</span>
                  <span>High Volume</span>
                </div>
                <div className="w-full bg-muted h-1">
                  <div className="bg-foreground h-1" style={{ width: '85%' }} />
                </div>
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Executive Activity</span>
                  <span className="text-muted-foreground">Low Volume</span>
                </div>
                <div className="w-full bg-muted h-1">
                  <div className="bg-muted-foreground h-1" style={{ width: '15%' }} />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4 italic">
                "Authority is currently institutional, not personal. In premium B2B, this limits trust transfer."
              </p>
            </div>
          </div>

          {/* 05. Content Assessment */}
          <div className="bg-card border border-border p-8 h-full flex flex-col">
            <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground mb-4">05. Content Assessment</div>
            <div className="space-y-3">
              <div className="border-l-2 border-border pl-3">
                <span className="text-[10px] uppercase text-muted-foreground">Clarity</span>
                <p className="text-xs font-medium">Strong. Technical concepts are explained well.</p>
              </div>
              <div className="border-l-2 border-border pl-3">
                <span className="text-[10px] uppercase text-muted-foreground">Point of View</span>
                <p className="text-xs font-medium text-muted-foreground">Weak. Content feels safe. Lacks a distinct "Way".</p>
              </div>
              <div className="border-l-2 border-border pl-3">
                <span className="text-[10px] uppercase text-muted-foreground">Confidence</span>
                <p className="text-xs font-medium">Moderate. Too much hedging language.</p>
              </div>
            </div>
          </div>

          {/* 06. External Validation */}
          <div className="bg-card border border-border p-8 h-full flex flex-col">
            <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground mb-4">06. External Validation</div>
            <div className="flex-grow flex flex-col justify-center text-center">
              <div className="font-serif text-4xl text-muted-foreground/30 mb-2">Insufficient Data</div>
              <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">
                Review volume (n&lt;10) is too low to infer market sentiment.
              </p>
              <div className="mt-6 inline-block bg-muted px-3 py-1 text-[10px] uppercase tracking-widest text-muted-foreground rounded mx-auto">
                Finding: Neutral Risk
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Optimization Targets Section */}
      <div className="space-y-4 mt-8">
        <div className="flex justify-between items-center">
          <h2 className="text-xs font-semibold text-primary uppercase tracking-widest">
            SEO Optimization Targets
          </h2>
          <button 
            onClick={handleCopyAll}
            className="text-[10px] border border-border px-3 py-1 hover:border-primary hover:text-primary transition-colors"
          >
            Copy List
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {seoKeywords.map((keyword, index) => (
            <KeywordPill key={index} keyword={keyword} />
          ))}
        </div>
      </div>

      {/* Strategic GEO Roadmap Section */}
      <div className="space-y-4 mt-8">
        <h2 className="text-xs font-semibold text-primary uppercase tracking-widest">
          Strategic GEO Roadmap
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roadmapItems.map((item, index) => (
            <div 
              key={index} 
              className="bg-card border border-border p-8 hover:border-primary transition-colors group h-full flex flex-col"
            >
              <div className={`font-mono text-[10px] uppercase tracking-[0.1em] mb-2 ${item.priority ? 'text-primary' : 'text-muted-foreground'}`}>
                {item.priority ? 'Priority Action' : 'Next Step'}
              </div>
              <h3 className="font-serif text-xl mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VisibilitySection;
