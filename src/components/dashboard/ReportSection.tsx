import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Sample data - would come from API in production
const reportData = {
  score: 60,
  healthStatus: "Moderate health",
  clientUrl: "https://www.rubiklab.ai/",
  generatedDate: "08/12/2025",
  pillars: [
    { name: "Clarity", score: 65, tooltip: "Can visitors quickly understand what you do?" },
    { name: "Relevance", score: 70, tooltip: "Does your offer match your audience?" },
    { name: "Trust", score: 60, tooltip: "Do you look credible and professional?" },
    { name: "Friction", score: 55, tooltip: "How easy is it to take action?" },
    { name: "Actionability", score: 45, tooltip: "Are your CTAs compelling?" },
  ],
  mobilePerformance: { desktop: 85, mobile: 45 },
  searchVisibility: { seo: 60, geo: 75 },
  benchmarks: [
    { label: "Content", score: 68, diff: "+3 vs Avg", positive: true },
    { label: "Visual", score: 65, diff: "On Par", positive: null },
    { label: "UX", score: 45, diff: "-10 vs Avg", positive: false },
    { label: "Technical", score: 50, diff: "-10 vs Avg", positive: false },
  ],
  executiveSummary: [
    "Your visual design is polished and credible, giving visitors immediate confidence that they are dealing with a serious AI partner. The clean layout works well and establishes trust from the first seconds. Your current conversion score of 60 out of 100 reflects a strong foundation with clear room for growth.",
    "The gap between current performance and potential comes down to three points that are quietly costing you qualified leads. Your value proposition is too broad, making it difficult for visitors to understand what problem you solve and how you differ from other AI consultants. Clarity within seconds is essential, and it is not fully achieved yet.",
    "Your contact path creates friction, as the form is not immediately visible and forces interested prospects to search for a way to engage. Many will abandon the visit at this point. The feature descriptions rely on generic AI language rather than concrete outcomes that potential clients can imagine and relate to their needs.",
    "These issues do not require a rebuild. They are targeted optimisations that can be introduced over the coming days. A short action plan will help you prioritise quick wins and reinforce your market position with minimal effort."
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
  { id: "audit", label: "Audit" },
  { id: "roadmap", label: "Roadmap" }
];

const ReportSection = () => {
  const [activeTab, setActiveTab] = useState("summary");

  return (
    <div className="space-y-8">
      {/* Hero Score Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-foreground p-8 md:p-12"
      >
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Score */}
          <div className="flex items-baseline gap-2">
            <span className="text-7xl md:text-8xl font-serif font-bold text-background tracking-tight">
              {reportData.score}
            </span>
            <span className="text-2xl font-medium text-background/50">/ 100</span>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-24 bg-gradient-to-b from-transparent via-background/20 to-transparent" />

          {/* Context */}
          <div className="text-center md:text-left">
            <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-background/50 mb-2 block">
              Mondro Score
            </span>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_hsl(var(--primary)/0.5)]" />
              <span className="text-2xl md:text-3xl font-serif font-bold text-background">
                {reportData.healthStatus}
              </span>
            </div>
            <p className="text-sm text-background/60 max-w-xs">
              Score weighted across 32 dimensions covering all key components of a successful website.
            </p>
          </div>

          {/* Client Info */}
          <div className="hidden lg:block text-right">
            <p className="text-[10px] font-mono font-bold text-background/50 uppercase tracking-wider">Audit for</p>
            <p className="text-sm font-medium text-background mt-1">{reportData.clientUrl}</p>
            <p className="text-xs text-background/50 mt-1">Generated {reportData.generatedDate}</p>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation - Landing page style */}
      <div className="flex justify-center">
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

      {/* Summary Tab */}
      {activeTab === "summary" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Executive Analysis & Pillars */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Executive Analysis */}
            <div className="bg-card rounded-xl border border-border p-8">
              <h3 className="font-serif font-bold text-lg text-foreground mb-6">Executive analysis</h3>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                {reportData.executiveSummary.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            {/* 5 Pillars */}
            <div className="bg-card rounded-xl border border-border p-8">
              <div className="flex justify-between items-end mb-8">
                <h3 className="font-serif font-bold text-lg text-foreground">The 5 conversion pillars</h3>
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  Weighted scoring
                </span>
              </div>

              <div className="space-y-5">
                {reportData.pillars.map((pillar) => (
                  <div key={pillar.name} className="group">
                    <div className="flex justify-between text-sm font-medium text-foreground mb-2">
                      <span>{pillar.name}</span>
                      <span className="font-mono">{pillar.score}/100</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pillar.score}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full rounded-full bg-primary"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Metrics Row */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Mobile Performance */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-serif font-bold text-foreground mb-1">Mobile performance</h3>
              <p className="text-xs text-muted-foreground mb-4">Lighthouse speed (0-100)</p>
              <div className="flex items-center justify-between gap-4 py-4">
                <div className="text-center flex-1">
                  <span className="text-4xl font-serif font-bold text-foreground">{reportData.mobilePerformance.desktop}</span>
                  <span className="text-xs font-mono font-bold uppercase text-muted-foreground block mt-2">Desktop</span>
                </div>
                <div className="h-12 w-px bg-border" />
                <div className="text-center flex-1">
                  <span className="text-4xl font-serif font-bold text-foreground">{reportData.mobilePerformance.mobile}</span>
                  <span className="text-xs font-mono font-bold uppercase text-muted-foreground block mt-2">Mobile</span>
                </div>
              </div>
            </div>

            {/* Search & AI Visibility */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-serif font-bold text-foreground mb-1">Search & AI visibility</h3>
              <p className="text-xs text-muted-foreground mb-4">Discovery potential (0-100)</p>
              <div className="flex items-center justify-between gap-4 py-4">
                <div className="text-center flex-1">
                  <span className="text-4xl font-serif font-bold text-foreground">{reportData.searchVisibility.seo}</span>
                  <span className="text-xs font-mono font-bold uppercase text-muted-foreground block mt-2">SEO Score</span>
                </div>
                <div className="h-12 w-px bg-border" />
                <div className="text-center flex-1">
                  <span className="text-4xl font-serif font-bold text-foreground">{reportData.searchVisibility.geo}</span>
                  <span className="text-xs font-mono font-bold uppercase text-muted-foreground block mt-2">GEO Score</span>
                </div>
              </div>
            </div>

            {/* Industry Benchmarking */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-serif font-bold text-foreground mb-1">Industry benchmarking</h3>
              <p className="text-xs text-muted-foreground mb-4">Comparing against sector averages</p>
              <div className="grid grid-cols-2 gap-4">
                {reportData.benchmarks.map((item) => (
                  <div key={item.label} className="text-center">
                    <span className="text-2xl font-serif font-bold text-foreground">{item.score}</span>
                    <span className="text-xs font-mono font-bold uppercase text-muted-foreground block mt-1">{item.label}</span>
                    <span className={cn(
                      "text-[10px] font-mono mt-1 inline-block",
                      item.positive === true ? "text-primary" :
                      item.positive === false ? "text-muted-foreground" : "text-muted-foreground"
                    )}>{item.diff}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Audit Tab */}
      {activeTab === "audit" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
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
                  <span className="text-3xl font-serif font-bold text-foreground">{section.score}</span>
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
          className="space-y-6"
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
