import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Sample data - would come from API in production
const reportData = {
  score: 59,
  healthStatus: "Moderate health",
  clientName: "Rubiklab.ai",
  clientUrl: "https://www.rubiklab.ai/",
  generatedDate: "December 30, 2025",
  scope: "Independent assessment of digital clarity, credibility, and competitive positioning",
  
  // Waterfall chart data
  waterfall: {
    potential: 100,
    losses: [
      { label: "Intake Friction", value: -15 },
      { label: "Mobile Latency", value: -10 },
      { label: "Narrative Gap", value: -16 },
    ],
    current: 59
  },

  // Signal grid data
  signals: [
    { label: "Visual Polish", level: "HIGH", score: 4, variant: "default", description: "Design conveys premium authority." },
    { label: "Value Clarity", level: "LOW", score: 2, variant: "critical", description: "Proposition is buried below fold." },
    { label: "Credibility", level: "MODERATE", score: 3, variant: "blue", description: "Lack of client logos hurts score." },
    { label: "Coherence", level: "MODERATE", score: 3, variant: "default", description: "Narrative flow is interrupted." },
  ],

  // Heatmap data
  heatmap: [
    { vector: "Infrastructure", maturity: "full", observation: "Server response in top 5%.", implication: "Strong foundation for scale." },
    { vector: "User Flow", maturity: "quarter", observation: "Intake requires 8 fields.", implication: "High abandonment (>60%)." },
    { vector: "Narrative", maturity: "half", observation: '"Process" vs "Outcome".', implication: "Low C-Suite resonance." },
    { vector: "Mobile UX", maturity: "half", observation: "Unoptimized image payloads.", implication: "SEO Penalty Risk." },
  ],

  // Matrix chart data
  matrixItems: [
    { x: 15, y: 85, label: "Form Reduction", highlight: true },
    { x: 25, y: 75, label: "Mobile Fixes", highlight: true },
    { x: 70, y: 80, label: "Rewrite Value Prop", highlight: false },
    { x: 80, y: 30, label: "Replatform", highlight: false },
    { x: 45, y: 45, label: "Meta Tags", highlight: false },
  ],

  auditSections: [
    {
      title: "Content analysis",
      score: 65,
      status: "Moderate",
      categories: [
        {
          title: "Clarity & positioning",
          items: [
            { label: "Value proposition", text: "It's clear you do market research and AI. However, 'Innovating' is a weak verb. It doesn't promise a tangible result or ROI for the user." },
            { label: "Audience alignment", text: "Strong usage of specialized terms ('unstructured data', 'semantic search'). This speaks directly to data analysts but may alienate executive decision-makers." }
          ]
        },
        {
          title: "Flow & tone",
          items: [
            { label: "Narrative coherence", text: "Logical flow: Innovation → Services → Methodology → Proof. The structure is sound, but the 'hook' is buried too deep." },
            { label: "Tone consistency", text: "Consistent throughout. Professional, tech-forward, and serious. Could benefit from a slightly more 'human' voice in the About section." }
          ]
        }
      ],
      strength: "The combination of 'Human-centered' and 'AI' effectively addresses the industry fear that automation will replace human nuance.",
      fix: "Lack of outcome-oriented messaging. The site sells the 'features' of the AI, not the 'business advantage' (speed & accuracy) of the insights.",
      fixLevel: "priority"
    },
    {
      title: "Visual analysis",
      score: 60,
      status: "Acceptable",
      categories: [
        {
          title: "Design assessment",
          items: [
            { label: "Overall impression", text: "Modern, sleek, and high-tech aesthetic that leans into a 'dark mode' B2B SaaS vibe. Clean but feels slightly cold and generic." },
            { label: "Color scheme", text: "Dark charcoal background with vibrant magenta accents. Excellent contrast ratios for readability." }
          ]
        },
        {
          title: "Layout & typography",
          items: [
            { label: "Typography", text: "Clean sans-serif font. Headings are bold and legible. Use of italics in H2s adds a nice stylistic touch." },
            { label: "Whitespace usage", text: "Excellent use of negative space. The layout breathes well, preventing the dense technical content from feeling overwhelming." }
          ]
        }
      ],
      strength: "High-resolution imagery and consistent design system create a professional, enterprise-grade first impression.",
      fix: "Hero section lacks a direct CTA button in the visual hierarchy. The 'Book a Demo' is tucked in the nav, reducing CTR.",
      fixLevel: "priority"
    },
    {
      title: "UX & flow",
      score: 45,
      status: "Critical",
      categories: [
        {
          title: "Interaction design",
          items: [
            { label: "Navigation logic", text: "Menu is simple but essential pages like 'Pricing' are hidden in sub-menus. This adds unnecessary clicks for high-intent users." },
            { label: "Mobile experience", text: "The hero image pushes content below the fold on mobile. Users see a dark screen with just text, losing the emotional connection." }
          ]
        },
        {
          title: "Conversion paths",
          items: [
            { label: "Form usability", text: "Critical failure point. 8 fields is too many for a top-of-funnel lead. Asking for 'Job Title' here adds friction with zero user value." },
            { label: "Call to action (CTA)", text: "Primary CTAs blend into the background. They lack a hover state that gives tactile feedback, reducing the impulse to click." }
          ]
        }
      ],
      strength: "Page load speed on desktop is excellent, creating a snappy feeling when navigating between service pages.",
      fix: "Simplify the 'Book Demo' form immediately. Reduce to 3 fields (Name, Email, Company) to potentially double conversion rate.",
      fixLevel: "critical"
    },
    {
      title: "Technical analysis",
      score: 50,
      status: "Warning",
      categories: [
        {
          title: "Performance",
          items: [
            { label: "Core web vitals", text: "LCP: 2.4s (Needs Improvement). CLS: 0.15 (Good Stability)." },
            { label: "Mobile speed", text: "Google PageSpeed score: 45/100. Heavy JavaScript bundles are delaying interactivity on low-end devices." }
          ]
        },
        {
          title: "SEO & structure",
          items: [
            { label: "Meta tags", text: "Meta descriptions are missing on 40% of indexed pages, reducing CTR from search engine results pages." },
            { label: "Sitemap", text: "XML sitemap not found in root directory. This hinders Google bot crawling efficiency for new content." }
          ]
        }
      ],
      strength: "Server Response Time (TTFB) is excellent (< 200ms), indicating a healthy backend infrastructure.",
      fix: "Image Optimization: Current images are full-size PNGs. Serve Next-Gen formats (WebP/AVIF) to reduce payload.",
      fixLevel: "priority"
    }
  ],
  roadmap: [
    {
      title: "Shorten 'Book demo' form",
      subtitle: "Reduce 8 fields to 3 fields.",
      effort: "Low",
      impact: "High",
      tasks: [
        { tag: "DEV", text: "Remove 'Job Title' and 'Phone Number' fields." },
        { tag: "DEV", text: "Enable browser auto-fill attributes." }
      ]
    },
    {
      title: "Update CTA visuals",
      subtitle: "Fix button contrast & visibility.",
      effort: "Low",
      impact: "Med",
      tasks: [
        { tag: "CSS", text: "Change primary buttons to high-contrast accent color." }
      ]
    },
    {
      title: "Rewrite hero messaging",
      subtitle: "Implement 'Problem/Solution' framework.",
      effort: "Med",
      impact: "High",
      tasks: [
        { tag: "COPY", text: "New H1: 'Automate Your Lab Reporting in Half the Time.'" }
      ]
    },
    {
      title: "Implement product visuals",
      subtitle: "Replace stock photos with UI screens.",
      effort: "High",
      impact: "Med",
      tasks: [
        { tag: "DESIGN", text: "Create 3 high-fidelity product screenshots." },
        { tag: "DEV", text: "Implement responsive image gallery component." }
      ]
    }
  ]
};

const tabs = [
  { id: "summary", label: "Summary" },
  { id: "diagnosis", label: "Diagnosis" },
  { id: "competitive-context", label: "Competitive Context" },
  { id: "next-order-effects", label: "Next-Order Effects" }
];

// Slide component for consistent layout
const Slide = ({ 
  slideNumber, 
  children, 
  className = "" 
}: { 
  slideNumber: string; 
  children: React.ReactNode; 
  className?: string;
}) => (
  <div className={cn(
    "min-h-[90vh] py-16 px-8 lg:px-20 border-b border-border relative flex flex-col justify-center items-center",
    className
  )}>
    <div className="absolute top-12 right-8 lg:right-20 font-mono text-[11px] text-muted-foreground/50">
      {slideNumber}
    </div>
    {children}
  </div>
);

// Eyebrow component
const SlideEyebrow = ({ children }: { children: React.ReactNode }) => (
  <span className="font-sans text-[13px] uppercase tracking-[0.2em] text-muted-foreground/60 mb-8 block border-l-2 border-primary pl-4">
    {children}
  </span>
);

// Action title component
const ActionTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h2 className={cn("font-serif font-normal text-5xl lg:text-[4rem] leading-[1.1] mb-12 text-foreground max-w-[1100px]", className)}>
    {children}
  </h2>
);

// Signal bar component
const SignalBar = ({ score, variant = "default" }: { score: number; variant?: "default" | "critical" | "blue" }) => (
  <div className="flex gap-1 h-1 w-full mt-4">
    {[1, 2, 3, 4, 5].map((i) => (
      <div 
        key={i} 
        className={cn(
          "flex-1",
          i <= score 
            ? variant === "critical" 
              ? "bg-destructive" 
              : variant === "blue" 
                ? "bg-primary" 
                : "bg-foreground"
            : "bg-muted"
        )} 
      />
    ))}
  </div>
);

// Maturity bubble component
const MaturityBubble = ({ level }: { level: "full" | "half" | "quarter" }) => (
  <div 
    className={cn(
      "w-3.5 h-3.5 rounded-full border border-foreground inline-block",
      level === "full" && "bg-foreground",
      level === "half" && "bg-[conic-gradient(hsl(var(--foreground))_180deg,transparent_0)]",
      level === "quarter" && "bg-[conic-gradient(hsl(var(--foreground))_90deg,transparent_0)]"
    )} 
  />
);

const ReportSection = () => {
  const [activeTab, setActiveTab] = useState("summary");

  return (
    <div className="space-y-0">
      {/* Tab Navigation - Landing page style */}
      <div className="flex justify-center py-6 border-b border-border bg-background sticky top-0 z-10">
        <div className="flex items-center gap-8 lg:gap-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative font-mono text-[11px] lg:text-[13px] font-bold tracking-[0.3em] uppercase transition-colors group",
                activeTab === tab.id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              {tab.label}
              <span className={cn(
                "absolute bottom-[-4px] left-0 h-px bg-primary transition-all duration-400",
                activeTab === tab.id ? "w-full" : "w-0 group-hover:w-full"
              )} />
            </button>
          ))}
        </div>
      </div>

      {/* Summary Tab - Slide-based layout */}
      {activeTab === "summary" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-background"
        >
          {/* Slide 01: Cover */}
          <Slide slideNumber="01 / 06">
            <div className="max-w-6xl w-full">
              <div className="mb-16 mt-4">
                <div className="font-serif text-7xl lg:text-9xl mb-12 tracking-tight text-foreground leading-none">
                  Defining the <br/>
                  <span className="text-primary font-normal italic">Digital Standard.</span>
                </div>
              </div>
              
              <div className="space-y-12 border-t border-foreground pt-14">
                <div className="grid grid-cols-12 gap-8">
                  <div className="col-span-2 font-mono text-base text-muted-foreground uppercase tracking-widest pt-2">Client</div>
                  <div className="col-span-10 font-serif text-4xl lg:text-5xl">{reportData.clientName}</div>
                </div>
                <div className="grid grid-cols-12 gap-8">
                  <div className="col-span-2 font-mono text-base text-muted-foreground uppercase tracking-widest pt-2">Scope</div>
                  <div className="col-span-10 font-serif text-4xl lg:text-5xl">{reportData.scope}</div>
                </div>
                <div className="grid grid-cols-12 gap-8">
                  <div className="col-span-2 font-mono text-base text-muted-foreground uppercase tracking-widest pt-2">Date</div>
                  <div className="col-span-10 font-serif text-4xl lg:text-5xl">{reportData.generatedDate}</div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-12 left-8 lg:left-20 text-base text-muted-foreground/50 font-mono">
              CONFIDENTIAL • MONDRO INTELLIGENCE CAPITAL
            </div>
          </Slide>

          {/* Slide 02: Methodology */}
          <Slide slideNumber="02 / 06">
            <div className="max-w-6xl w-full">
              <SlideEyebrow>Methodology</SlideEyebrow>
              <ActionTitle>Reading this assessment.</ActionTitle>
              
              <div className="grid md:grid-cols-12 gap-14 lg:gap-24 mt-14">
                <div className="col-span-7 space-y-10">
                  <p className="text-2xl font-light text-foreground leading-relaxed">
                    This document is a commissioned strategic assessment, distinct from automated performance reports. It combines large-scale quantitative analysis with structured expert judgement.
                  </p>
                  
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Findings are derived from a multi-stage review process covering technical integrity, narrative clarity, user behaviour signals, and market positioning. Each dimension is assessed independently before being synthesised into an overall view.
                  </p>

                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Where scores are provided (0–100), they represent a weighted index calibrated against top-quartile SaaS and professional services benchmarks. Scores are directional indicators designed to guide prioritisation, not absolute measures of success.
                  </p>

                  <div className="pt-8 mt-4">
                    <div className="font-mono text-base uppercase tracking-widest text-primary mb-6">How Judgement is Formed</div>
                    <ul className="grid grid-cols-2 gap-y-5 gap-x-12 text-lg text-muted-foreground">
                      <li className="flex items-start gap-3 border-t border-border pt-5">
                        <span className="text-primary">•</span> Cross-checked across independent signals
                      </li>
                      <li className="flex items-start gap-3 border-t border-border pt-5">
                        <span className="text-primary">•</span> Benchmarked against 1,200+ sites
                      </li>
                      <li className="flex items-start gap-3 border-t border-border pt-5">
                        <span className="text-primary">•</span> Reviewed through sector lenses
                      </li>
                      <li className="flex items-start gap-3 border-t border-border pt-5">
                        <span className="text-primary">•</span> Weighted to reflect decision impact
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="col-span-5 flex items-center">
                  <div className="bg-muted/30 p-14 border-l-2 border-foreground w-full">
                    <div className="font-serif text-3xl lg:text-4xl mb-8 italic text-foreground leading-snug">
                      "Data describes the past.<br/>Judgement informs the future."
                    </div>
                    <p className="text-lg text-muted-foreground leading-relaxed font-light">
                      Please interpret findings as diagnostic signals rather than absolute grades. "Critical" flags identify vectors that materially constrain credibility, conversion, or growth.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Slide>

          {/* Slide 03: Executive Synthesis */}
          <Slide slideNumber="03 / 06">
            <div className="max-w-6xl w-full">
              <SlideEyebrow>Executive Synthesis</SlideEyebrow>
              <ActionTitle>Technical solidity is currently undermined by conversion friction.</ActionTitle>
              
              <div className="grid md:grid-cols-12 gap-20 mt-12">
                <div className="col-span-8 text-2xl leading-relaxed space-y-10 text-muted-foreground">
                  <p>
                    Rubiklab.ai possesses a robust technical foundation. Server response times and uptime stability are within the top 5% of the peer group. The "hard" engineering of the site is sound.
                  </p>
                  <p>
                    However, the "soft" architecture—specifically narrative flow and user intake—is creating significant drag. We observed a disconnect between the complexity of the solution and the clarity of the value proposition. High-intent traffic is being lost at the intake stage due to excessive form friction.
                  </p>
                  
                  <div className="p-10 border border-primary bg-background shadow-sm">
                    <div className="font-mono text-base uppercase tracking-widest text-primary mb-4">The Strategic Opportunity</div>
                    <p className="text-xl text-foreground">
                      By simplifying the intake mechanism and shifting messaging from "process" to "outcome," Rubiklab can unlock an estimated <strong>40% efficiency gain</strong> in the existing funnel without increasing ad spend.
                    </p>
                  </div>
                </div>
                <div className="col-span-4 flex flex-col justify-between py-2 border-l border-border pl-12 gap-12">
                  <div>
                    <div className="font-mono text-base uppercase tracking-widest text-muted-foreground mb-3">Primary Strength</div>
                    <div className="font-serif text-4xl">Infrastructure</div>
                    <div className="text-lg text-muted-foreground mt-3">99.9% Uptime / Clean Code</div>
                  </div>
                  <div>
                    <div className="font-mono text-base uppercase tracking-widest text-muted-foreground mb-3">Primary Constraint</div>
                    <div className="font-serif text-4xl text-destructive">Intake Friction</div>
                    <div className="text-lg text-muted-foreground mt-3">8-Field Forms (Avg: 3)</div>
                  </div>
                  <div>
                    <div className="font-mono text-base uppercase tracking-widest text-muted-foreground mb-3">Action Priority</div>
                    <div className="font-serif text-4xl text-primary">Reduce Drag</div>
                    <div className="text-lg text-muted-foreground mt-3">Immediate Roadmap</div>
                  </div>
                </div>
              </div>
            </div>
          </Slide>

          {/* Slide 04: Overall Digital Standing - Waterfall Chart */}
          <Slide slideNumber="04 / 06">
            <div className="max-w-6xl w-full">
              <SlideEyebrow>Overall Digital Standing</SlideEyebrow>
              <ActionTitle>A 41-point gap exists between potential and reality.</ActionTitle>
              
              <p className="text-xl text-muted-foreground max-w-4xl mb-8">
                The chart below bridges the gap from your theoretical potential to your current standing, isolating specific vectors of loss.
              </p>

              {/* Waterfall Chart */}
              <div className="flex items-end h-[480px] gap-8 lg:gap-12 pt-20 pb-0 border-b border-border mt-10">
                {/* Digital Potential */}
                <div className="flex-1 flex flex-col justify-end relative h-full">
                  <div className="w-full bg-muted" style={{ height: "100%" }}></div>
                  <div className="absolute w-full text-center -top-12 font-mono text-lg font-semibold text-foreground">100</div>
                  <div className="text-center mt-6 border-t border-border pt-5">
                    <span className="font-sans text-sm text-muted-foreground font-medium tracking-wider uppercase">Digital<br/>Potential</span>
                  </div>
                </div>

                {/* Loss bars */}
                {reportData.waterfall.losses.map((loss, index) => {
                  const prevHeight = 100 + reportData.waterfall.losses.slice(0, index).reduce((acc, l) => acc + l.value, 0);
                  const barHeight = Math.abs(loss.value);
                  const spacerHeight = prevHeight - barHeight;
                  
                  return (
                    <div key={loss.label} className="flex-1 flex flex-col justify-end relative h-full">
                      <div className="w-full bg-transparent" style={{ height: `${spacerHeight}%` }}></div>
                      <div className="w-full bg-destructive relative" style={{ height: `${barHeight}%` }}>
                        <div className="absolute inset-0 flex items-center justify-center font-mono text-base font-semibold text-destructive-foreground">
                          {loss.value}
                        </div>
                      </div>
                      <div className="text-center mt-6 border-t border-border pt-5">
                        <span className="font-sans text-sm text-muted-foreground font-medium tracking-wider uppercase">
                          {loss.label.split(" ").map((word, i) => (
                            <span key={i}>{word}<br/></span>
                          ))}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Current Score */}
                <div className="flex-1 flex flex-col justify-end relative h-full">
                  <div className="w-full bg-primary" style={{ height: `${reportData.waterfall.current}%` }}></div>
                  <div className="absolute w-full text-center -top-14 font-serif text-4xl font-semibold text-primary">
                    {reportData.waterfall.current}
                  </div>
                  <div className="text-center mt-6 border-t border-border pt-5">
                    <span className="font-sans text-sm text-primary font-semibold tracking-wider uppercase">Current<br/>Score</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center mt-6">
                <div className="text-sm text-muted-foreground/50 font-mono tracking-wide italic">
                  * Each reduction represents a structural constraint, not a cosmetic issue.
                </div>
              </div>
            </div>
          </Slide>

          {/* Slide 05: Perceived Authority */}
          <Slide slideNumber="05 / 06">
            <div className="max-w-6xl w-full">
              <SlideEyebrow>Perceived Authority</SlideEyebrow>
              <ActionTitle>Visuals are premium; clarity is secondary.</ActionTitle>
              
              <div className="grid md:grid-cols-12 gap-20 mt-12">
                <div className="col-span-5 space-y-12">
                  <div>
                    <h3 className="font-serif text-3xl mb-5">The "Blink Test"</h3>
                    <p className="text-lg leading-relaxed text-muted-foreground">
                      <strong className="text-foreground">Failed.</strong> In the first 3 seconds, a user understands <em>that</em> you are a tech company, but not <em>what</em> specific problem you solve. The headline "Innovating the Future" is a null-statement.
                    </p>
                  </div>
                  <div className="border-t border-border pt-12">
                    <h3 className="font-serif text-3xl mb-5">Aesthetic Strength</h3>
                    <p className="text-lg leading-relaxed text-muted-foreground">
                      <strong className="text-foreground">High.</strong> The minimalist typography successfully conveys "Enterprise SaaS." The site looks expensive, which is a critical trust signal for high-ticket sales.
                    </p>
                  </div>
                </div>

                <div className="col-span-7">
                  <div className="grid grid-cols-2 gap-8">
                    {reportData.signals.map((signal) => (
                      <div 
                        key={signal.label} 
                        className={cn(
                          "border p-10 bg-background",
                          signal.variant === "critical" 
                            ? "bg-destructive/5 border-destructive/20" 
                            : "border-border"
                        )}
                      >
                        <div className="flex justify-between items-end mb-4">
                          <span className={cn(
                            "font-serif text-2xl",
                            signal.variant === "critical" && "text-destructive"
                          )}>
                            {signal.label}
                          </span>
                          <span className={cn(
                            "font-mono text-sm",
                            signal.variant === "critical" 
                              ? "text-destructive/70" 
                              : signal.variant === "blue" 
                                ? "text-primary" 
                                : "text-muted-foreground"
                          )}>
                            {signal.level}
                          </span>
                        </div>
                        <SignalBar score={signal.score} variant={signal.variant as "default" | "critical" | "blue"} />
                        <div className={cn(
                          "mt-6 text-base",
                          signal.variant === "critical" ? "text-destructive/70" : "text-muted-foreground"
                        )}>
                          {signal.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Slide>

          {/* Slide 06: Strategic Snapshot */}
          <Slide slideNumber="06 / 17">
            <div className="max-w-6xl w-full h-full flex flex-col">
              <SlideEyebrow>Strategic Snapshot</SlideEyebrow>
              <ActionTitle className="mb-12">Granular analysis and immediate prioritization.</ActionTitle>
              
              <div className="grid md:grid-cols-12 gap-20 h-full">
                {/* Immediate Priorities */}
                <div className="col-span-5 flex flex-col">
                  <div className="font-mono text-sm uppercase tracking-widest text-primary mb-8">Immediate Priorities (Quick Wins)</div>
                  
                  <div className="space-y-8">
                    <div className="p-8 border border-border bg-muted/30">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-serif text-xl text-foreground">1. Intake Form Reduction</h3>
                        <span className="font-mono text-xs text-primary bg-background border border-border px-3 py-1.5">HIGH IMPACT</span>
                      </div>
                      <p className="text-base text-muted-foreground leading-relaxed mb-5">
                        Reduce fields from 8 to 3 (Name, Work Email, Company). Enable browser autofill attributes.
                      </p>
                      <div className="flex items-center gap-6 border-t border-border pt-4">
                        <div className="font-mono text-xs text-muted-foreground/70 uppercase tracking-widest">Effort: <span className="text-foreground">Low</span></div>
                        <div className="font-mono text-xs text-muted-foreground/70 uppercase tracking-widest">Type: <span className="text-foreground">UX/Dev</span></div>
                      </div>
                    </div>
                    <div className="p-8 border border-border bg-muted/30">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-serif text-xl text-foreground">2. Mobile Payload Fix</h3>
                        <span className="font-mono text-xs text-muted-foreground bg-background border border-border px-3 py-1.5">MED IMPACT</span>
                      </div>
                      <p className="text-base text-muted-foreground leading-relaxed mb-5">
                        Convert PNG assets to WebP/AVIF. Implement lazy loading for below-fold content to cut LCP by 1.2s.
                      </p>
                      <div className="flex items-center gap-6 border-t border-border pt-4">
                        <div className="font-mono text-xs text-muted-foreground/70 uppercase tracking-widest">Effort: <span className="text-foreground">Low</span></div>
                        <div className="font-mono text-xs text-muted-foreground/70 uppercase tracking-widest">Type: <span className="text-foreground">Tech</span></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-auto text-sm text-muted-foreground/60 font-mono italic pt-8">
                    * Strategic Strategy: Prioritizing low-effort technical debt removal creates immediate momentum for the broader roadmap.
                  </div>
                </div>

                {/* Capability Heatmap */}
                <div className="col-span-7 flex flex-col">
                  <div className="font-mono text-sm uppercase tracking-widest text-primary mb-8">Capability Heatmap</div>
                  <div className="flex-grow">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="font-mono text-sm uppercase tracking-[0.1em] text-muted-foreground text-left pb-6 border-b-2 border-foreground" style={{ width: "20%" }}>Vector</th>
                          <th className="font-mono text-sm uppercase tracking-[0.1em] text-muted-foreground text-left pb-6 border-b-2 border-foreground" style={{ width: "15%" }}>Maturity</th>
                          <th className="font-mono text-sm uppercase tracking-[0.1em] text-muted-foreground text-left pb-6 border-b-2 border-foreground" style={{ width: "35%" }}>Observation</th>
                          <th className="font-mono text-sm uppercase tracking-[0.1em] text-muted-foreground text-left pb-6 border-b-2 border-foreground" style={{ width: "30%" }}>Implication</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.heatmap.map((row) => (
                          <tr key={row.vector}>
                            <td className="py-6 border-b border-border text-base text-foreground font-bold align-top">{row.vector}</td>
                            <td className="py-6 border-b border-border align-top"><MaturityBubble level={row.maturity as "full" | "half" | "quarter"} /></td>
                            <td className="py-6 border-b border-border text-base text-muted-foreground align-top">{row.observation}</td>
                            <td className="py-6 border-b border-border text-base text-muted-foreground align-top">{row.implication}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-8 flex gap-8 justify-start text-xs text-muted-foreground uppercase tracking-widest">
                    <div className="flex items-center gap-2"><div className="scale-75"><MaturityBubble level="full" /></div> Optimized</div>
                    <div className="flex items-center gap-2"><div className="scale-75"><MaturityBubble level="half" /></div> Developing</div>
                    <div className="flex items-center gap-2"><div className="scale-75"><MaturityBubble level="quarter" /></div> Critical</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-8 left-8 lg:left-16 text-sm text-muted-foreground/50 font-mono">
              CONFIDENTIAL • MONDRO INTELLIGENCE CAPITAL
            </div>
          </Slide>
        </motion.div>
      )}

      {/* Audit Tab */}
      {activeTab === "audit" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 p-8"
        >
          <div className="mb-4">
            <h2 className="text-2xl font-serif font-bold text-foreground">Audit</h2>
            <p className="text-muted-foreground mt-1">Comprehensive breakdown of performance vectors.</p>
          </div>

          {reportData.auditSections.map((section) => (
            <div key={section.title} className="bg-card rounded-xl border border-border overflow-hidden">
              {/* Header */}
              <div className="px-8 py-6 flex justify-between items-center border-b border-border bg-muted/30">
                <h3 className="text-xl font-serif font-bold text-foreground">{section.title}</h3>
                <div className="text-right flex items-center gap-3">
                  <span className="text-4xl font-serif font-bold text-foreground">{section.score}</span>
                  <span className="text-xs font-mono font-bold uppercase tracking-wide text-muted-foreground">
                    {section.status}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-10 mb-8">
                  {section.categories.map((category) => (
                    <div key={category.title}>
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground mb-5 pb-2 border-b border-border">
                        {category.title}
                      </h4>
                      <div className="space-y-5">
                        {category.items.map((item) => (
                          <div key={item.label}>
                            <span className="font-medium text-foreground text-sm block mb-1">{item.label}</span>
                            <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Strength & Fix */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-muted/30 p-5 rounded-xl border border-border">
                    <h5 className="text-foreground font-bold text-sm mb-2">
                      Key strength
                    </h5>
                    <p className="text-xs text-muted-foreground leading-relaxed">{section.strength}</p>
                  </div>
                  <div className="bg-muted/30 p-5 rounded-xl border border-border">
                    <h5 className="text-foreground font-bold text-sm mb-2">
                      {section.fixLevel === "critical" ? "Critical fix" : "Priority fix"}
                    </h5>
                    <p className="text-xs text-muted-foreground leading-relaxed">{section.fix}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Roadmap Tab */}
      {activeTab === "roadmap" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 p-8"
        >
          <div className="mb-4">
            <h2 className="text-2xl font-serif font-bold text-foreground">Strategic roadmap</h2>
            <p className="text-muted-foreground mt-1">Prioritized sprint plan for immediate execution.</p>
          </div>

          <div className="space-y-0">
            {reportData.roadmap.map((item, index) => (
              <div key={item.title} className="flex gap-6 relative group">
                {/* Timeline */}
                <div className="flex flex-col items-center shrink-0 w-16">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center font-serif font-bold text-xl z-10",
                    index === 0 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-card border-2 border-border text-foreground"
                  )}>
                    {index + 1}
                  </div>
                  {index < reportData.roadmap.length - 1 && (
                    <div className="w-px h-full bg-border absolute top-12 left-8" />
                  )}
                </div>

                {/* Card */}
                <div className="bg-card rounded-xl border border-border p-6 w-full mb-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                    <div>
                      <h3 className="font-serif font-bold text-foreground text-lg">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                    </div>
                    <div className="flex gap-2 mt-2 sm:mt-0">
                      <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-mono font-bold uppercase tracking-wide">
                        Effort: {item.effort}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-mono font-bold uppercase tracking-wide">
                        Impact: {item.impact}
                      </span>
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <ul className="space-y-3">
                      {item.tasks.map((task, taskIndex) => (
                        <li key={taskIndex} className="flex items-start gap-3 text-sm text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                          <span>
                            <strong className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground mr-2">
                              {task.tag}
                            </strong>
                            {task.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ReportSection;
