import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Download, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Sample data - would come from API in production
const reportData = {
  score: 59,
  healthStatus: "Moderate health",
  clientName: "Mavrix Data",
  clientUrl: "https://www.mavrixdata.com/",
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

// Slide component for consistent layout - now full viewport for horizontal sliding
const Slide = ({ 
  children, 
  className = ""
}: { 
  children: React.ReactNode; 
  className?: string;
}) => (
  <div 
    className={cn(
      "w-screen h-screen flex-shrink-0 pt-16 pb-8 px-4 lg:px-10 relative flex flex-col items-center bg-background overflow-hidden",
      className
    )}
    data-slide="true"
  >
    {children}
  </div>
);

// Eyebrow component
const SlideEyebrow = ({ children }: { children: React.ReactNode }) => (
  <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-muted-foreground/60 mb-3 block border-l-2 border-primary pl-3">
    {children}
  </span>
);

// Action title component
const ActionTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h2 className={cn("font-serif font-normal text-4xl lg:text-5xl leading-[1.15] mb-10 text-foreground max-w-[1000px]", className)}>
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
const MaturityBubble = ({ level }: { level: "full" | "half" | "quarter" }) => {
  if (level === "full") {
    return <div className="w-3.5 h-3.5 rounded-full bg-foreground border border-foreground inline-block" />;
  }
  
  const percentage = level === "half" ? 50 : 25;
  const angle = (percentage / 100) * 360;
  const radians = (angle - 90) * (Math.PI / 180);
  const x = 50 + 50 * Math.cos(radians);
  const y = 50 + 50 * Math.sin(radians);
  const largeArc = angle > 180 ? 1 : 0;
  
  return (
    <svg 
      width="14" 
      height="14" 
      viewBox="0 0 100 100" 
      className="inline-block"
      style={{ verticalAlign: 'middle' }}
    >
      <circle 
        cx="50" 
        cy="50" 
        r="46" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="8"
        className="text-foreground"
      />
      <path 
        d={`M 50 50 L 50 0 A 50 50 0 ${largeArc} 1 ${x} ${y} Z`}
        className="fill-foreground"
      />
    </svg>
  );
};

// Dark cover slide for the report
const CoverSlide = () => (
  <div data-cover="true" className="w-screen h-screen flex-shrink-0 bg-[#050505] text-white relative flex flex-col justify-between p-12 lg:p-16 overflow-hidden">
    {/* Grid background */}
    <div 
      className="absolute inset-0 pointer-events-none opacity-20"
      style={{
        backgroundImage: 'linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)',
        backgroundSize: '120px 120px'
      }}
    />
    
    {/* Top metadata */}
    <div className="relative z-10 flex justify-between items-start border-t border-gray-900 pt-6">
      <div className="grid grid-cols-4 gap-8 font-mono text-[9px] text-gray-500 uppercase tracking-widest">
        <div>Classified</div>
        <div>{reportData.clientName}</div>
        <div>Gap Analysis</div>
        <div className="text-[#0099E6]">v.Final</div>
      </div>
      <button 
        className="flex items-center gap-2.5 px-5 py-2.5 border border-gray-700 hover:border-[#0099E6] text-gray-400 hover:text-white text-[10px] font-mono uppercase tracking-widest transition-all duration-300 print-hide group"
        onClick={() => {
          const exportButton = document.querySelector('[data-export-trigger]') as HTMLButtonElement;
          if (exportButton) exportButton.click();
        }}
      >
        <Download className="w-3.5 h-3.5 group-hover:text-[#0099E6] transition-colors" />
        Download Report
      </button>
    </div>

    {/* Main content */}
    <div className="relative z-10 flex-grow flex flex-col justify-center">
      <div className="border-l-4 border-[#0099E6] pl-12 py-4">
        <h1 className="font-serif text-7xl md:text-8xl lg:text-9xl text-white leading-[0.9] tracking-tight mb-4">
          Defining the <br />
          <span className="italic text-[#0099E6]">Digital Standard.</span>
        </h1>
      </div>
    </div>

    {/* Footer */}
    <div className="relative z-10 flex justify-between items-end">
      <div className="flex items-center gap-2">
        <span className="font-serif font-bold text-3xl tracking-tight lowercase text-white">mondro</span>
        <span className="relative flex h-3 w-3 pt-1">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0099E6] opacity-30" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0099E6] shadow-[0_0_12px_rgba(0,153,230,0.5)]" />
        </span>
      </div>
      
      <div className="font-mono text-[10px] text-gray-600 uppercase tracking-widest">
        Mondro Intelligence Capital © 2026
      </div>
    </div>
  </div>
);

// Section divider component with three layout variants
const SectionDivider = ({ 
  title, 
  subtitle, 
  layout = 'bottom-left' 
}: { 
  title: React.ReactNode; 
  subtitle: React.ReactNode; 
  layout?: 'center' | 'bottom-left' | 'top-right'
}) => (
  <div data-divider="true" className="w-screen h-screen flex-shrink-0 bg-[#000000] text-white relative flex flex-col justify-between p-12 lg:p-16 overflow-hidden">
    {/* Grid background */}
    <div 
      className="absolute inset-0 pointer-events-none opacity-20"
      style={{
        backgroundImage: 'linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)',
        backgroundSize: '120px 120px'
      }}
    />
    
    {/* Spacer for top */}
    <div className="relative z-10" />
    
    {/* Main content - layout variants */}
    <div className={cn(
      "relative z-10 flex-grow flex flex-col",
      layout === 'center' ? "justify-center items-center text-center" : 
      layout === 'top-right' ? "justify-start items-end text-right pt-24" :
      "justify-end items-start pb-8"
    )}>
      {layout === 'center' && (
        <div className="flex flex-col items-center">
          <div className="w-[1px] h-16 bg-[#0099E6] mb-10" />
          <h2 className="font-serif text-7xl lg:text-8xl text-white mb-6 whitespace-nowrap">
            {title}<span className="text-[#0099E6]">.</span>
          </h2>
          <p className="font-sans text-xl text-gray-400 font-light leading-relaxed max-w-lg">
            {subtitle}
          </p>
        </div>
      )}
      
      {layout === 'top-right' && (
        <div className="text-right max-w-2xl">
          <div className="w-16 h-1 bg-[#0099E6] ml-auto mb-8" />
          <h2 className="font-serif text-7xl lg:text-8xl text-white mb-6 leading-[0.95]">
            {title}<span className="text-[#0099E6]">.</span>
          </h2>
          <p className="font-sans text-xl text-gray-400 font-light leading-relaxed">
            {subtitle}
          </p>
        </div>
      )}
      
      {layout === 'bottom-left' && (
        <div className="max-w-2xl">
          <div className="w-16 h-1 bg-[#0099E6] mb-8" />
          <h2 className="font-serif text-7xl lg:text-8xl text-white mb-6">
            {title}<span className="text-[#0099E6]">.</span>
          </h2>
          <p className="font-sans text-xl text-gray-400 font-light max-w-lg leading-relaxed">
            {subtitle}
          </p>
        </div>
      )}
    </div>
    
    {/* Footer with logo */}
    <div className="relative z-10 flex justify-between items-end">
      <div className="flex items-center gap-2">
        <span className="font-serif font-bold text-3xl tracking-tight lowercase text-white">mondro</span>
        <span className="relative flex h-3 w-3 pt-1">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0099E6] opacity-30" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0099E6] shadow-[0_0_12px_rgba(0,153,230,0.5)]" />
        </span>
      </div>
      
      <div className="font-mono text-[10px] text-gray-600 uppercase tracking-widest">
        Mondro Intelligence Capital © 2026
      </div>
    </div>
  </div>
);

interface ReportSectionProps {
  onExit?: () => void;
}

const ReportSection = ({ onExit }: ReportSectionProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  
  const [totalSlides, setTotalSlides] = useState(0);
  
  useEffect(() => {
    if (containerRef.current) {
      const slides = containerRef.current.querySelectorAll('[data-slide="true"], [data-cover="true"], [data-divider="true"]');
      setTotalSlides(slides.length);
    }
  }, []);
  
  const navigateToSlide = useCallback((index: number) => {
    if (isAnimating.current) return;
    const clampedIndex = Math.max(0, Math.min(index, totalSlides - 1));
    if (clampedIndex !== currentSlide) {
      isAnimating.current = true;
      setCurrentSlide(clampedIndex);
      setTimeout(() => {
        isAnimating.current = false;
      }, 500);
    }
  }, [currentSlide, totalSlides]);
  
  const nextSlide = useCallback(() => {
    navigateToSlide(currentSlide + 1);
  }, [currentSlide, navigateToSlide]);
  
  const prevSlide = useCallback(() => {
    navigateToSlide(currentSlide - 1);
  }, [currentSlide, navigateToSlide]);
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Escape' && onExit) {
        e.preventDefault();
        onExit();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, onExit]);
  
  // Mouse wheel navigation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    let wheelTimeout: ReturnType<typeof setTimeout>;
    
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          if (e.deltaY > 20) {
            nextSlide();
          } else if (e.deltaY < -20) {
            prevSlide();
          }
        } else {
          if (e.deltaX > 20) {
            nextSlide();
          } else if (e.deltaX < -20) {
            prevSlide();
          }
        }
      }, 50);
    };
    
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
      clearTimeout(wheelTimeout);
    };
  }, [nextSlide, prevSlide]);

  const handleDownload = async () => {
    setIsExporting(true);
    setProgress(0);
    
    try {
      if (!containerRef.current) return;
      
      const allSlides = containerRef.current.querySelectorAll('[data-slide="true"], [data-cover="true"], [data-divider="true"]');
      
      if (allSlides.length === 0) {
        console.error("No slides found for export");
        return;
      }
      
      const totalSlideCount = allSlides.length;
      let currentItem = 0;
      
      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [1920, 1080] });
      
      const captureSlide = async (slide: Element): Promise<string> => {
        const canvas = await html2canvas(slide as HTMLElement, {
          scale: 1.5,
          useCORS: true,
          backgroundColor: "#0a0a0a",
          logging: false,
        });
        return canvas.toDataURL("image/jpeg", 0.85);
      };
      
      for (let i = 0; i < allSlides.length; i++) {
        currentItem++;
        setProgress(Math.round((currentItem / totalSlideCount) * 100));
        const imgData = await captureSlide(allSlides[i]);
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, 0, 1920, 1080);
      }
      
      const clientSlug = reportData.clientName.replace(/[^a-zA-Z0-9]/g, "-").replace(/-+/g, "-");
      const dateStr = new Date().toISOString().split("T")[0];
      pdf.save(`Mondro_report_${clientSlug}_${dateStr}.pdf`);
    } catch (error) {
      console.error("PDF export failed:", error);
    } finally {
      setIsExporting(false);
      setProgress(0);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="h-screen w-screen overflow-hidden relative bg-background"
      tabIndex={0}
    >
      {/* Horizontal sliding container */}
      <div 
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}vw)` }}
      >
        {/* ============================================== */}
        {/* SECTION 0: EXECUTIVE SUMMARY (Slides 01-04)   */}
        {/* ============================================== */}
        
        {/* Slide 01: Cover */}
        <CoverSlide />
        
        {/* Slide 02: Methodology */}
        <Slide>
          <div className="max-w-7xl w-full h-full flex flex-col">
            <SlideEyebrow>Methodology</SlideEyebrow>
            <ActionTitle>Reading this assessment.</ActionTitle>
            
            <div className="grid md:grid-cols-12 gap-10 lg:gap-16">
              <div className="col-span-7 space-y-6">
                <p className="font-serif text-xl text-foreground leading-relaxed">
                  This document is a commissioned strategic assessment, distinct from automated performance reports. It combines large-scale quantitative analysis with structured expert judgement.
                </p>
                
                <p className="text-base text-muted-foreground leading-relaxed">
                  Findings are derived from a multi-stage review process covering technical integrity, narrative clarity, user behaviour signals, and market positioning. Each dimension is assessed independently before being synthesised into an overall view.
                </p>

                <p className="text-base text-muted-foreground leading-relaxed">
                  Where scores are provided (0–100), they represent a weighted index calibrated against top-quartile SaaS and professional services benchmarks. Scores are directional indicators designed to guide prioritisation, not absolute measures of success.
                </p>

                <div className="pt-6">
                  <div className="font-mono text-sm uppercase tracking-widest text-primary mb-5">How Judgement is Formed</div>
                  <ul className="grid grid-cols-2 gap-y-4 gap-x-8 text-base text-muted-foreground">
                    <li className="flex items-start gap-2 border-t border-border pt-4">
                      <span className="text-primary">•</span> Cross-checked across independent signals
                    </li>
                    <li className="flex items-start gap-2 border-t border-border pt-4">
                      <span className="text-primary">•</span> Benchmarked against 1,200+ sites
                    </li>
                    <li className="flex items-start gap-2 border-t border-border pt-4">
                      <span className="text-primary">•</span> Reviewed through sector lenses
                    </li>
                    <li className="flex items-start gap-2 border-t border-border pt-4">
                      <span className="text-primary">•</span> Weighted to reflect decision impact
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="col-span-5">
                <div className="bg-muted/30 p-8 border-l-2 border-foreground w-full">
                  <div className="font-serif text-2xl lg:text-3xl mb-5 italic text-foreground leading-snug">
                    "Data describes the past.<br/>Judgement informs the future."
                  </div>
                  <p className="text-base text-muted-foreground leading-relaxed font-light">
                    Please interpret findings as diagnostic signals rather than absolute grades. "Critical" flags identify vectors that materially constrain credibility, conversion, or growth.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Slide>

        {/* Slide 03: Executive Synthesis */}
        <Slide>
          <div className="max-w-6xl mx-auto w-full h-full flex flex-col justify-center">
            <SlideEyebrow>Executive Synthesis</SlideEyebrow>
            <ActionTitle>Operational maturity is currently invisible to the modern buyer.</ActionTitle>
            
            <p className="font-sans font-light text-lg text-muted-foreground max-w-4xl mb-16 leading-relaxed">
              Mavrix possesses a "Ferrari Engine" (22 years of Azure Knowledge infrastructure) inside a "Stealth Chassis." The 2025 rebrand has structurally reset digital authority, creating a disconnect between actual capability and perceived market relevance.
            </p>

            <div className="grid grid-cols-3 gap-12 h-[320px] border-t border-foreground pt-10">
              
              {/* Column 1: Primary Asset */}
              <div className="flex flex-col">
                <div className="font-mono text-xs uppercase tracking-widest text-primary mb-6">01. Primary Asset</div>
                <h3 className="font-serif text-2xl mb-4">The Global Engine</h3>
                <p className="text-sm text-muted-foreground mb-8 flex-grow leading-relaxed">
                  With 85+ countries, 40+ languages, and a 22-year legacy, the "Hard Stuff" (Infrastructure) is solved. This allows for complex, multi-market execution that pure-play tech disruptors cannot replicate.
                </p>
                <div>
                  <div className="font-serif text-5xl leading-none text-foreground mb-1">22 Yrs</div>
                  <div className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Operational Heritage</div>
                </div>
              </div>

              {/* Column 2: Primary Constraint */}
              <div className="border-l border-border pl-8 flex flex-col">
                <div className="font-mono text-xs uppercase tracking-widest text-destructive mb-6">02. Primary Constraint</div>
                <h3 className="font-serif text-2xl mb-4">The "Trust" Vacuum</h3>
                <p className="text-sm text-muted-foreground mb-8 flex-grow leading-relaxed">
                  The digital presence relies on "Self-Reported" trust signals (e.g., "95% Satisfaction") without third-party verification. The rebrand reset 20 years of SEO equity, leaving Mavrix invisible to organic search and AI discovery.
                </p>
                <div>
                  <div className="font-serif text-5xl leading-none text-destructive/60 mb-1">Low</div>
                  <div className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Domain Authority (Reset)</div>
                </div>
              </div>

              {/* Column 3: The Pivot */}
              <div className="border-l border-border pl-8 flex flex-col">
                <div className="font-mono text-xs uppercase tracking-widest text-primary mb-6">03. The Pivot</div>
                <h3 className="font-serif text-2xl mb-4">Integrity Assurance</h3>
                <p className="text-sm text-muted-foreground mb-8 flex-grow leading-relaxed">
                  Stop competing on "AI Speed" (a commodity war against Zappi/Lucid). Pivot to "Verified Human Truth." Own the complexity that AI cannot solve: hard-to-reach B2B and multi-country compliance.
                </p>
                <div>
                  <div className="font-serif text-5xl leading-none text-primary mb-1">Premium</div>
                  <div className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Target Positioning</div>
                </div>
              </div>

            </div>
          </div>
        </Slide>

        {/* Slide 04: Report Architecture */}
        <Slide className="bg-[#050505]">
          <div className="max-w-7xl w-full h-full flex flex-col justify-center">
            <div className="mb-16">
              <span className="font-mono text-[10px] text-primary uppercase tracking-[0.2em] mb-4 block">Navigation</span>
              <h2 className="font-serif text-5xl text-white">Report Architecture</h2>
            </div>

            <div className="grid grid-cols-3 gap-12 h-[500px]">
              {/* Section 01: Market Context */}
              <div className="border-l border-white/10 pl-8 h-full flex flex-col">
                <span className="font-mono text-xs text-primary uppercase tracking-widest mb-4">Section 01</span>
                <h3 className="font-serif text-3xl text-white mb-2">Market Context.</h3>
                <p className="text-xs text-gray-500 mb-8 italic">The External Reality</p>
                
                <ul className="mt-6 font-sans font-light text-[0.85rem] text-gray-400 leading-[2] space-y-2">
                  <li className="border-b border-white/5 pb-2">Competitive Reality</li>
                  <li className="border-b border-white/5 pb-2">Peer Positioning Snapshot</li>
                  <li className="border-b border-white/5 pb-2">Differentiation Signals</li>
                  <li className="border-b border-white/5 pb-2">Visibility & Discoverability</li>
                  <li className="border-b border-white/5 pb-2">Competitive Balance</li>
                  <li className="border-b border-white/5 pb-2">Strategic Implications</li>
                </ul>
              </div>

              {/* Section 02: Diagnosis */}
              <div className="border-l border-white/10 pl-8 h-full flex flex-col">
                <span className="font-mono text-xs text-primary uppercase tracking-widest mb-4">Section 02</span>
                <h3 className="font-serif text-3xl text-white mb-2">Diagnosis.</h3>
                <p className="text-xs text-gray-500 mb-8 italic">The Internal Reality</p>
                
                <ul className="mt-6 font-sans font-light text-[0.85rem] text-gray-400 leading-[2] space-y-2">
                  <li className="border-b border-white/5 pb-2">System-Level Diagnosis</li>
                  <li className="border-b border-white/5 pb-2">Perceived Authority</li>
                  <li className="border-b border-white/5 pb-2">Narrative Positioning</li>
                  <li className="border-b border-white/5 pb-2">Trust Architecture</li>
                  <li className="border-b border-white/5 pb-2">Revenue Leakage Analysis</li>
                  <li className="border-b border-white/5 pb-2">Diagnosis Synthesis</li>
                </ul>
              </div>

              {/* Section 03: The Pivot */}
              <div className="border-l border-white/10 pl-8 h-full flex flex-col">
                <span className="font-mono text-xs text-primary uppercase tracking-widest mb-4">Section 03</span>
                <h3 className="font-serif text-3xl text-white mb-2">The Pivot.</h3>
                <p className="text-xs text-gray-500 mb-8 italic">The Strategic Move</p>
                
                <ul className="mt-6 font-sans font-light text-[0.85rem] text-gray-400 leading-[2] space-y-2">
                  <li className="border-b border-white/5 pb-2">Strategic Inflection</li>
                  <li className="border-b border-white/5 pb-2">Focus Themes</li>
                  <li className="border-b border-white/5 pb-2">Leverage Matrix</li>
                  <li className="border-b border-white/5 pb-2">Structural Evolution</li>
                  <li className="border-b border-white/5 pb-2">Governance Signals</li>
                  <li className="border-b border-white/5 pb-2">Executive Closing</li>
                </ul>
              </div>
            </div>

            <div className="mt-auto border-t border-white/10 pt-6 flex justify-between text-xs text-gray-500 font-mono uppercase tracking-widest">
              <div>Appendix: Technical Constraints & Quick Wins</div>
              <div>Total Slides: 28</div>
            </div>
          </div>
        </Slide>

        {/* Slide 05: Overall Digital Standing */}
        <Slide>
          <div className="max-w-6xl mx-auto w-full h-full flex flex-col">
            <SlideEyebrow>Overall Digital Standing</SlideEyebrow>
            
            <div className="flex justify-between items-end mb-8">
              <ActionTitle className="max-w-3xl">A 60-point gap exists between operational potential and digital reality.</ActionTitle>
              
              <div className="bg-muted/30 border-l-2 border-primary p-6 max-w-sm mb-8">
                <span className="font-mono text-[10px] text-primary uppercase tracking-widest block mb-2">Primary Drag</span>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The "Trust Deficit" (unverified claims, missing social proof) is the single largest weight on performance, costing 30 points of conversion potential.
                </p>
              </div>
            </div>

            <div className="flex-grow border-b border-border pb-12">
              {/* Waterfall Chart */}
              <div className="h-full w-full flex items-end justify-between pt-16 gap-8">
                
                {/* Digital Potential */}
                <div className="flex-1 flex flex-col items-center">
                  <span className="font-mono text-2xl font-semibold text-muted-foreground mb-4">100</span>
                  <div className="w-full bg-muted h-[350px] rounded-sm"></div>
                  <span className="font-sans text-[11px] text-muted-foreground font-medium tracking-wider uppercase mt-4 text-center">Digital<br/>Potential</span>
                </div>

                {/* Trust Deficit -30 */}
                <div className="flex-1 flex flex-col items-center">
                  <span className="font-mono text-xl font-medium text-destructive mb-4">-30</span>
                  <div className="h-[350px] w-full flex flex-col justify-start">
                    <div className="w-full bg-destructive h-[105px] rounded-sm"></div>
                  </div>
                  <span className="font-sans text-[11px] text-destructive font-medium tracking-wider uppercase mt-4 text-center">Trust<br/>Deficit</span>
                </div>

                {/* Visibility Gap -20 */}
                <div className="flex-1 flex flex-col items-center">
                  <span className="font-mono text-xl font-medium text-destructive mb-4">-20</span>
                  <div className="h-[350px] w-full flex flex-col justify-start pt-[105px]">
                    <div className="w-full bg-destructive h-[70px] rounded-sm"></div>
                  </div>
                  <span className="font-sans text-[11px] text-destructive font-medium tracking-wider uppercase mt-4 text-center">Visibility<br/>Gap</span>
                </div>

                {/* Content Lag -10 */}
                <div className="flex-1 flex flex-col items-center">
                  <span className="font-mono text-xl font-medium text-destructive mb-4">-10</span>
                  <div className="h-[350px] w-full flex flex-col justify-start pt-[175px]">
                    <div className="w-full bg-destructive h-[35px] rounded-sm"></div>
                  </div>
                  <span className="font-sans text-[11px] text-destructive font-medium tracking-wider uppercase mt-4 text-center">Content<br/>Lag</span>
                </div>

                {/* Current Score */}
                <div className="flex-1 flex flex-col items-center">
                  <span className="font-mono text-4xl font-semibold text-primary mb-4">40</span>
                  <div className="h-[350px] w-full flex flex-col justify-end">
                    <div className="w-full bg-primary h-[140px] rounded-sm"></div>
                  </div>
                  <span className="font-sans text-[11px] text-foreground font-bold tracking-wider uppercase mt-4 text-center">Current<br/>Score</span>
                </div>

              </div>
            </div>

            {/* Footer Stats */}
            <div className="grid grid-cols-3 gap-12 pt-8">
              <div>
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-1">Score Interpretation</span>
                <div className="font-serif text-xl text-foreground">Critical Health</div>
                <div className="text-xs text-muted-foreground mt-1">Structural issues constraining growth.</div>
              </div>
              <div>
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-1">Recovery Potential</span>
                <div className="font-serif text-xl text-green-600">+45 Points</div>
                <div className="text-xs text-muted-foreground mt-1">Achievable within 90-day remediation.</div>
              </div>
              <div>
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-1">Impact Horizon</span>
                <div className="font-serif text-xl text-primary">Q2 2026</div>
                <div className="text-xs text-muted-foreground mt-1">If "Trust" fixes are deployed immediately.</div>
              </div>
            </div>

          </div>
        </Slide>

        {/* ============================================== */}
        {/* SECTION 1: MARKET CONTEXT (Slides 05-11)      */}
        {/* ============================================== */}

        {/* Slide 06: Divider (Market Context) - Center Focus */}
        <SectionDivider 
          title="Market Context" 
          subtitle="The External Reality"
          layout="center"
        />

        {/* Slide 07: The Competitive Reality */}
        <Slide>
          <div className="max-w-6xl mx-auto w-full h-full flex flex-col justify-center">
            <SlideEyebrow>The Competitive Reality</SlideEyebrow>
            <ActionTitle>The category has split into "Automated Velocity" and "Legacy Scale."</ActionTitle>
            <p className="font-sans font-light text-muted-foreground max-w-3xl mb-8">
              Mavrix is fighting a two-front war. On one side, AI platforms (Zappi) are driving the cost of simple data to zero. On the other, giants (Dynata) are winning on sheer volume.
            </p>

            {/* Spectrum Container */}
            <div className="flex justify-between items-stretch h-[380px] mt-8 relative">
              
              {/* Pole 01: The Commodity */}
              <div className="w-[30%] p-8 flex flex-col border border-border bg-muted/30 relative">
                <span className="font-mono text-xs uppercase tracking-[0.1em] text-destructive mb-4">Pole 01: The Commodity</span>
                <h3 className="font-serif text-3xl leading-none mb-4 text-foreground">Automated<br/>Velocity.</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-light">
                  Tech-first platforms selling "Insights in Minutes." They drive marginal cost to zero but introduce high risk (synthetic fraud, hallucinations).
                </p>
                <div className="mt-auto text-xs text-muted-foreground/60 border-t border-border pt-4">
                  <strong className="text-foreground">Adversaries:</strong><br/>Zappi, Suzy, Lucid, Pollfish
                </div>
              </div>

              {/* Middle Zone: Mavrix Position */}
              <div className="w-[40%] flex flex-col justify-center items-center text-center bg-background z-10 shadow-[0_0_40px_rgba(0,0,0,0.05)] border border-border px-8">
                <div className="w-4 h-4 bg-primary rounded-full shadow-[0_0_0_4px_hsl(var(--primary)/0.2)] mb-4" />
                <span className="font-mono text-[10px] text-primary uppercase tracking-widest mb-2">Current Position</span>
                <h3 className="font-serif text-2xl text-foreground mb-2">"Heavy Service"</h3>
                <p className="text-xs text-muted-foreground max-w-[240px] leading-relaxed">
                  Operationally deeper than the disruptors (Verified Fieldwork), but digitally invisible compared to the incumbents.
                </p>
                
                <div className="mt-6 border-t border-border pt-4 w-full">
                  <span className="block font-mono text-[9px] text-destructive uppercase tracking-widest mb-1">Strategic Friction</span>
                  <p className="text-xs font-medium text-foreground">
                    Trying to sell "Manual Rigor" in a market obsessed with "One-Click Speed."
                  </p>
                </div>
              </div>

              {/* Pole 02: The Safe Choice */}
              <div className="w-[30%] p-8 flex flex-col border border-border bg-muted/30 relative">
                <span className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground mb-4">Pole 02: The Safe Choice</span>
                <h3 className="font-serif text-3xl leading-none mb-4 text-foreground">Legacy<br/>Scale.</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-light">
                  Massive infrastructure players selling "Global Reach." They offer safety but suffer from bloat, opacity, and slow turnaround times.
                </p>
                <div className="mt-auto text-xs text-muted-foreground/60 border-t border-border pt-4">
                  <strong className="text-foreground">Adversaries:</strong><br/>Dynata, Kantar, Ipsos
                </div>
              </div>

            </div>
            
            {/* Footer Stats */}
            <div className="mt-8 flex justify-between border-t border-border pt-4">
              <div className="text-xs text-muted-foreground font-mono">
                <span className="text-foreground font-semibold">Buying Criteria:</span> Speed vs. Certainty
              </div>
              <div className="text-xs text-muted-foreground font-mono">
                <span className="text-foreground font-semibold">Threat Level:</span> High (Squeezed Middle)
              </div>
            </div>

          </div>
        </Slide>

        {/* Slide 08: Peer Positioning Snapshot */}
        <Slide>
          <div className="max-w-6xl mx-auto w-full h-full flex flex-col justify-center">
            <SlideEyebrow>Peer Positioning Snapshot</SlideEyebrow>
            <ActionTitle>High authority on "Fieldwork", invisible on "Innovation".</ActionTitle>
            <p className="font-sans font-light text-muted-foreground max-w-3xl mb-12">
              We benchmarked Mavrix against three market archetypes: The Legacy Incumbent (e.g., Dynata), The Tech Disruptor (e.g., Zappi), and The Specialist (e.g., Ronin).
            </p>

            <div className="grid grid-cols-12 gap-16">
              
              {/* Slider Section */}
              <div className="col-span-8 pt-4 space-y-10">
                
                {/* Service Intensity Slider */}
                <div className="relative">
                  <span className="font-mono text-xs text-muted-foreground uppercase tracking-[0.1em] mb-3 block border-l-2 border-primary pl-2.5">Service Intensity (Human Touch)</span>
                  <div className="flex justify-between text-[10px] text-muted-foreground/60 font-mono uppercase tracking-wider mb-2">
                    <span>Automated</span>
                    <span>White Glove</span>
                  </div>
                  <div className="w-full h-px bg-border relative mt-4">
                    <div className="absolute w-3 h-3 rounded-full bg-muted-foreground/40 top-1/2 -translate-y-1/2" style={{ left: "10%" }}>
                      <span className="absolute mt-5 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/60 whitespace-nowrap">Disruptor</span>
                    </div>
                    <div className="absolute w-3 h-3 rounded-full bg-muted-foreground/60 top-1/2 -translate-y-1/2" style={{ left: "60%" }}>
                      <span className="absolute mt-5 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/60 whitespace-nowrap">Incumbent</span>
                    </div>
                    <div className="absolute w-3 h-3 rounded-full bg-primary shadow-[0_0_0_4px_hsl(var(--primary)/0.15)] top-1/2 -translate-y-1/2 z-10" style={{ left: "85%" }}>
                      <span className="absolute mt-5 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-wider font-semibold text-primary whitespace-nowrap">Mavrix</span>
                    </div>
                  </div>
                </div>

                {/* Brand Visibility Slider */}
                <div className="relative">
                  <span className="font-mono text-xs text-muted-foreground uppercase tracking-[0.1em] mb-3 block border-l-2 border-primary pl-2.5">Brand Visibility (SEO & Voice)</span>
                  <div className="flex justify-between text-[10px] text-muted-foreground/60 font-mono uppercase tracking-wider mb-2">
                    <span>Invisible</span>
                    <span>Ubiquitous</span>
                  </div>
                  <div className="w-full h-px bg-border relative mt-4">
                    <div className="absolute w-3 h-3 rounded-full bg-primary shadow-[0_0_0_4px_hsl(var(--primary)/0.15)] top-1/2 -translate-y-1/2 z-10" style={{ left: "5%" }}>
                      <span className="absolute mt-5 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-wider font-semibold text-primary whitespace-nowrap">Mavrix</span>
                    </div>
                    <div className="absolute w-3 h-3 rounded-full bg-muted-foreground/40 top-1/2 -translate-y-1/2" style={{ left: "55%" }}>
                      <span className="absolute mt-5 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/60 whitespace-nowrap">Disruptor</span>
                    </div>
                    <div className="absolute w-3 h-3 rounded-full bg-muted-foreground/60 top-1/2 -translate-y-1/2" style={{ left: "95%" }}>
                      <span className="absolute mt-5 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/60 whitespace-nowrap">Incumbent</span>
                    </div>
                  </div>
                </div>

                {/* Perceived Velocity Slider */}
                <div className="relative">
                  <span className="font-mono text-xs text-muted-foreground uppercase tracking-[0.1em] mb-3 block border-l-2 border-primary pl-2.5">Perceived Velocity (Tech Speed)</span>
                  <div className="flex justify-between text-[10px] text-muted-foreground/60 font-mono uppercase tracking-wider mb-2">
                    <span>Labor-Heavy</span>
                    <span>Instant</span>
                  </div>
                  <div className="w-full h-px bg-border relative mt-4">
                    <div className="absolute w-3 h-3 rounded-full bg-primary shadow-[0_0_0_4px_hsl(var(--primary)/0.15)] top-1/2 -translate-y-1/2 z-10" style={{ left: "20%" }}>
                      <span className="absolute mt-5 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-wider font-semibold text-primary whitespace-nowrap">Mavrix</span>
                    </div>
                    <div className="absolute w-3 h-3 rounded-full bg-muted-foreground/60 top-1/2 -translate-y-1/2" style={{ left: "45%" }}>
                      <span className="absolute mt-5 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/60 whitespace-nowrap">Incumbent</span>
                    </div>
                    <div className="absolute w-3 h-3 rounded-full bg-muted-foreground/40 top-1/2 -translate-y-1/2" style={{ left: "90%" }}>
                      <span className="absolute mt-5 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/60 whitespace-nowrap">Disruptor</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Summary Box */}
              <div className="col-span-4 h-full">
                <div className="bg-muted/30 p-8 h-full relative">
                  <div className="absolute left-0 top-8 bottom-8 w-1 bg-primary" />
                  
                  <span className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-widest mb-4 block">Summary Reading</span>
                  <h3 className="font-serif text-2xl text-foreground mb-4">Asymmetric Position</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                    Mavrix is operationally heavier than the disruptors (Verified Fieldwork), but digitally quieter than the incumbents.
                  </p>
                  
                  <div className="bg-background p-4 shadow-sm border border-border">
                    <span className="font-mono text-[9px] text-primary uppercase tracking-widest block mb-1">Priority Gap</span>
                    <p className="text-xs text-muted-foreground font-medium">
                      The "Fieldwork" asset is currently priced as a liability (Slowness) rather than a premium (Rigor).
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </Slide>

        {/* Slide 09: Differentiation Signals */}
        <Slide>
          <div className="max-w-6xl mx-auto w-full h-full flex flex-col justify-center">
            <SlideEyebrow>Differentiation Signals</SlideEyebrow>
            <ActionTitle>Winners are selling "Certainty," not just "Speed."</ActionTitle>
            <p className="font-sans font-light text-muted-foreground max-w-3xl mb-12">
              The market is flooded with "AI Velocity" claims. Mavrix is currently echoing this noise instead of owning the "Integrity" counter-narrative.
            </p>

            <div className="grid grid-cols-3 gap-8 h-[380px]">
              
              {/* Card 1: Competitor Pattern */}
              <div className="border border-border p-8 h-full flex flex-col bg-muted/30">
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground mb-4">The Competitor Pattern</span>
                <h3 className="font-serif text-[1.75rem] leading-[1.2] text-muted-foreground italic mb-4">"Insights in Minutes."</h3>
                
                <div className="mt-auto space-y-4">
                  <div>
                    <span className="text-[10px] text-muted-foreground/60 font-mono uppercase tracking-wider block mb-1">Focus</span>
                    <p className="text-xs text-muted-foreground">Time-to-Value (Speed)</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground/60 font-mono uppercase tracking-wider block mb-1">Implicit Risk</span>
                    <p className="text-xs text-muted-foreground">"Is this data real or synthetic?"</p>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <span className="text-[10px] text-muted-foreground/60 font-mono uppercase tracking-wider">Signals</span>
                    <p className="text-xs text-muted-foreground/80 mt-1">Zappi, Suzy, Lucid</p>
                  </div>
                </div>
              </div>

              {/* Card 2: Current Mavrix Position */}
              <div className="border border-destructive border-l-4 p-8 h-full flex flex-col bg-background">
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-destructive mb-4">Current Positioning</span>
                <h3 className="font-serif text-[1.75rem] leading-[1.2] text-foreground mb-4">"Smart Technology Meets Human Insight."</h3>
                
                <div className="mt-auto space-y-4">
                  <div>
                    <span className="text-[10px] text-muted-foreground/60 font-mono uppercase tracking-wider block mb-1">Focus</span>
                    <p className="text-xs text-muted-foreground">Process (How it works)</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground/60 font-mono uppercase tracking-wider block mb-1">The Problem</span>
                    <p className="text-xs text-destructive">Generic. It tries to sound like a tech platform but lacks the proprietary IP to back it up.</p>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <span className="text-[10px] text-muted-foreground/60 font-mono uppercase tracking-wider">Result</span>
                    <p className="text-xs text-muted-foreground/80 mt-1">Comparability (Commodity)</p>
                  </div>
                </div>
              </div>

              {/* Card 3: The White Space */}
              <div className="border border-primary border-l-4 p-8 h-full flex flex-col bg-primary/5">
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-primary mb-4">The White Space</span>
                <h3 className="font-serif text-[1.75rem] leading-[1.2] text-primary mb-4">"Zero-Risk Execution."</h3>
                
                <div className="mt-auto space-y-4">
                  <div>
                    <span className="text-[10px] text-muted-foreground/60 font-mono uppercase tracking-wider block mb-1">Focus</span>
                    <p className="text-xs text-muted-foreground">Outcome Assurance (Safety)</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground/60 font-mono uppercase tracking-wider block mb-1">The Pivot</span>
                    <p className="text-xs text-primary">"AI finds the data. We ensure it's true."</p>
                  </div>
                  <div className="pt-4 border-t border-primary/20">
                    <span className="text-[10px] text-muted-foreground/60 font-mono uppercase tracking-wider">Target Emotion</span>
                    <p className="text-xs text-muted-foreground/80 mt-1">Relief & Confidence</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </Slide>

        {/* Slide 10: Visibility & Discoverability */}
        <Slide>
          <div className="max-w-7xl w-full h-full flex flex-col justify-center">
            <div className="mb-12">
              <SlideEyebrow>Visibility & Discoverability</SlideEyebrow>
              <ActionTitle>The "Platform Dissonance."</ActionTitle>
              <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
                Mavrix is living a digital double-life. On LinkedIn, you are a vibrant, human-led community leader. On your Website, you are a generic, faceless tech vendor. You are renting your best personality.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-8 h-[420px]">
              {/* Social Ecosystem Card - Highlighted Blue */}
              <div className="flex flex-col h-full border border-blue-200">
                <div className="border border-border p-8 flex flex-col justify-between h-full bg-blue-50/10">
                  <div>
                    <span className="inline-block font-mono text-[10px] uppercase tracking-wide px-2 py-1 rounded-sm mb-6 bg-blue-50 text-[#0A66C2] border border-blue-200 font-semibold">High Vitality</span>
                    <h3 className="font-serif text-2xl mb-3 text-foreground">Social Ecosystem</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                      A strategic asset. 26k+ followers and authentic CEO narratives (Rafal) prove "Proof of Life" and industry standing. This is where your brand actually lives.
                    </p>
                  </div>
                  <div className="border-t border-border pt-6 mt-auto">
                    <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-1">Legacy Audience</span>
                    <span className="font-serif text-4xl text-[#0A66C2]">26,000+</span>
                  </div>
                </div>
                <div className="bg-blue-50/30 px-6 py-4 border-t border-border">
                  <span className="font-mono text-[10px] text-blue-400 font-semibold uppercase tracking-widest block mb-1">Leverage Point</span>
                  <p className="text-xs text-blue-600 font-medium leading-relaxed">Export this "Humanity" to the Website immediately.</p>
                </div>
              </div>

              {/* Owned Domain Card */}
              <div className="flex flex-col h-full border border-border">
                <div className="border border-border p-8 flex flex-col justify-between h-full bg-background">
                  <div>
                    <span className="inline-block font-mono text-[10px] uppercase tracking-wide px-2 py-1 rounded-sm mb-6 bg-red-50 text-destructive border border-red-200 font-semibold">Sterile</span>
                    <h3 className="font-serif text-2xl mb-3 text-foreground">Owned Domain</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                      The website fails to capture the energy of the LinkedIn page. It relies on generic tech buzzwords instead of the "Mavrix Crew" reality.
                    </p>
                  </div>
                  <div className="border-t border-border pt-6 mt-auto">
                    <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-1">Brand Alignment</span>
                    <span className="font-serif text-4xl text-red-400">Disconnect</span>
                  </div>
                </div>
                <div className="bg-muted/50 px-6 py-4 border-t border-border">
                  <span className="font-mono text-[10px] text-muted-foreground font-semibold uppercase tracking-widest block mb-1">Priority Fix</span>
                  <p className="text-xs text-primary font-medium leading-relaxed">Embed the "CEO Narrative" and "Event Photos" directly onto the Homepage.</p>
                </div>
              </div>

              {/* Brand Protection Card */}
              <div className="flex flex-col h-full border border-border">
                <div className="border border-border p-8 flex flex-col justify-between h-full bg-background">
                  <div>
                    <span className="inline-block font-mono text-[10px] uppercase tracking-wide px-2 py-1 rounded-sm mb-6 bg-red-50 text-destructive border border-red-200 font-semibold">Identity Confusion</span>
                    <h3 className="font-serif text-2xl mb-3 text-foreground">Brand Protection</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                      A critical noise factor exists: "Mavrix AI" (Crypto Bot). Consumer complaints about the bot risk bleeding into your B2B reputation if not digitally fenced.
                    </p>
                  </div>
                  <div className="border-t border-border pt-6 mt-auto">
                    <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-1">Reputation Threat</span>
                    <span className="font-serif text-4xl text-muted-foreground">Moderate</span>
                  </div>
                </div>
                <div className="bg-muted/50 px-6 py-4 border-t border-border">
                  <span className="font-mono text-[10px] text-muted-foreground font-semibold uppercase tracking-widest block mb-1">Defensive Move</span>
                  <p className="text-xs text-primary font-medium leading-relaxed">Create a clear "Not Affiliated" disclaimer or FAQ entry regarding the Crypto entity.</p>
                </div>
              </div>
            </div>
          </div>
        </Slide>

        {/* Slide 11: Competitive Balance */}
        <Slide>
          <div className="max-w-6xl mx-auto w-full h-full flex flex-col">
            <div className="mb-4">
              <SlideEyebrow>Competitive Balance</SlideEyebrow>
              <ActionTitle className="mb-4">The "Unit Economics" Problem.</ActionTitle>
              <p className="font-sans font-light text-muted-foreground max-w-3xl leading-relaxed">
                Mavrix is carrying the heavy fixed costs of a Global Operation, but missing the high-margin leverage of a Digital Brand. You are paying "Analog Rates" for every win.
              </p>
            </div>

            {/* Balance Container - Two Column Grid */}
            <div className="grid grid-cols-[1fr_1px_1fr] gap-16 my-8 min-h-[380px]">
              
              {/* Left Column: Operational Assets */}
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-primary block mb-10 pb-2 border-b-2 border-primary">
                  Operational Assets (High Value)
                </span>
                
                <div className="flex justify-between items-baseline pb-4 mb-6 border-b border-dashed border-border">
                  <span className="text-base text-muted-foreground font-light">Market Position</span>
                  <span className="font-sans font-semibold text-base text-foreground">Mid-Market Tier</span>
                </div>
                <div className="flex justify-between items-baseline pb-4 mb-6 border-b border-dashed border-border">
                  <span className="text-base text-muted-foreground font-light">Global Infrastructure</span>
                  <span className="font-sans font-semibold text-base text-foreground">85+ Countries</span>
                </div>
                <div className="flex justify-between items-baseline pb-4 mb-6 border-b border-dashed border-border">
                  <span className="text-base text-muted-foreground font-light">Human Capital</span>
                  <span className="font-sans font-semibold text-base text-foreground">200-500 Bracket</span>
                </div>
                <div className="flex justify-between items-baseline pb-4 mb-6">
                  <span className="text-base text-muted-foreground font-light">Service Depth</span>
                  <span className="font-sans font-semibold text-base text-primary">High-Touch Fieldwork</span>
                </div>
              </div>

              {/* Divider */}
              <div className="h-full w-px bg-border"></div>

              {/* Right Column: Digital Leverage */}
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-destructive block mb-10 pb-2 border-b-2 border-destructive">
                  Digital Leverage (Zero Efficiency)
                </span>
                
                <div className="flex justify-between items-baseline pb-4 mb-6 border-b border-dashed border-border">
                  <span className="text-base text-muted-foreground font-light">Thought Leadership</span>
                  <span className="font-sans font-semibold text-base text-destructive">0 Published Assets</span>
                </div>
                <div className="flex justify-between items-baseline pb-4 mb-6 border-b border-dashed border-border">
                  <span className="text-base text-muted-foreground font-light">Inbound Engine</span>
                  <span className="font-sans font-semibold text-base text-destructive">Dormant</span>
                </div>
                <div className="flex justify-between items-baseline pb-4 mb-6 border-b border-dashed border-border">
                  <span className="text-base text-muted-foreground font-light">Trust Verification</span>
                  <span className="font-sans font-semibold text-base text-destructive">Self-Reported Only</span>
                </div>
                <div className="flex justify-between items-baseline pb-4 mb-6">
                  <span className="text-base text-muted-foreground font-light">Acquisition Mode</span>
                  <span className="font-sans font-semibold text-base text-destructive">100% Manual Outbound</span>
                </div>
              </div>

            </div>

            {/* Insight Footer */}
            <div className="bg-muted/50 p-8 border-l-4 border-destructive mt-auto mb-4">
              <div className="flex justify-between items-end">
                <div>
                  <span className="font-mono text-[10px] text-red-400 uppercase tracking-widest block mb-3">Structural Risk</span>
                  <p className="font-serif text-xl text-foreground leading-tight max-w-2xl">
                    Competitors acquire customers via <span className="italic text-muted-foreground">Content</span> (Scalable). <br />
                    Mavrix acquires customers via <span className="italic text-muted-foreground">People</span> (Linear).
                  </p>
                </div>
                <div className="text-right">
                  <span className="block font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Impact</span>
                  <span className="font-medium text-destructive">Margin Compression</span>
                </div>
              </div>
            </div>

          </div>
        </Slide>

        {/* ============================================== */}
        {/* SECTION 2: DIAGNOSIS (Slides 12-18)           */}
        {/* ============================================== */}

        {/* Slide 13: Divider (Diagnosis) - Center Focus */}
        <SectionDivider 
          title="Diagnosis" 
          subtitle="The Internal Reality"
          layout="center"
        />

        {/* Slide 13: System-Level Diagnosis */}
        <Slide>
          <div className="max-w-6xl mx-auto w-full h-full flex flex-col justify-center">
            <SlideEyebrow>System-Level Diagnosis</SlideEyebrow>
            
            <div className="flex items-center gap-16 mb-8">
              {/* Score Circle */}
              <div className="relative w-[180px] h-[180px] flex items-center justify-center shrink-0">
                <div className="absolute inset-0 rounded-full border-8 border-muted" style={{ borderTopColor: '#EF4444', borderRightColor: '#EF4444', transform: 'rotate(-45deg)' }} />
                <div className="text-center z-10">
                  <span className="font-serif text-6xl text-foreground leading-none">40</span>
                  <span className="font-mono text-sm text-muted-foreground mt-2 block">/ 100</span>
                </div>
              </div>

              <div>
                <ActionTitle className="mb-4">Critical Health. <br/>The digital engine is misfiring.</ActionTitle>
                <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                  A forensic audit of the Mavrix digital ecosystem reveals a structural disconnect between "What you sell" (High-Touch Fieldwork) and "How you sell it" (Low-Touch Tech Narrative).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-12 mt-8 pt-8 border-t border-border">
              {/* Pillar 01: Narrative Clarity */}
              <div className="pl-6 border-l border-border">
                <span className="inline-block px-2 py-0.5 rounded font-mono text-[10px] uppercase bg-amber-50 text-amber-500 mb-2">Moderate Risk</span>
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-3">Pillar 01: Narrative Clarity</span>
                <h3 className="font-serif text-2xl text-foreground mb-2">50/100</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The "Smart Technology" headline is generic. It hides your true differentiator (Fieldwork Expertise) behind buzzwords, making you comparable to commodity players.
                </p>
              </div>

              {/* Pillar 02: Trust Signals - Critical */}
              <div className="pl-6 border-l-2 border-destructive">
                <span className="inline-block px-2 py-0.5 rounded font-mono text-[10px] uppercase bg-red-50 text-destructive mb-2">Critical Risk</span>
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-3">Pillar 02: Trust Signals</span>
                <h3 className="font-serif text-2xl text-destructive mb-2">20/100</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Missing case studies, "0 Published" whitepapers, and self-reported stats create a "Trust Deficit." Buyers cannot verify your claims without speaking to sales.
                </p>
              </div>

              {/* Pillar 03: Commercial Flow */}
              <div className="pl-6 border-l border-border">
                <span className="inline-block px-2 py-0.5 rounded font-mono text-[10px] uppercase bg-red-50 text-destructive mb-2">High Friction</span>
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-3">Pillar 03: Commercial Flow</span>
                <h3 className="font-serif text-2xl text-foreground mb-2">30/100</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Opaque pricing and generic "Contact Us" forms create high friction. You are blocking qualified buyers who want to self-select or get a ballpark estimate.
                </p>
              </div>
            </div>

            <div className="mt-auto pt-8 border-t border-dashed border-border flex justify-between items-center text-xs text-muted-foreground font-mono">
              <span>Audit Date: January 03, 2026</span>
              <span className="text-foreground">Benchmark: vs. Tier-1 Incumbents (Dynata/Kantar)</span>
            </div>
          </div>
        </Slide>

        {/* Slide 14: Perceived Authority */}
        <Slide>
          <div className="max-w-7xl w-full h-full flex flex-col">
            <SlideEyebrow>Perceived Authority</SlideEyebrow>
            <ActionTitle>Authority exists, but it is stranded on a rented platform.</ActionTitle>
            <p className="text-base text-muted-foreground max-w-3xl mb-6">
              Mavrix has a vibrant human pulse on LinkedIn (Asset), but a sterile corporate mask on the Website (Liability). You are failing to transfer trust to your owned domain.
            </p>

            <div className="grid md:grid-cols-2 gap-16 border-t border-border pt-8 flex-1">
              {/* LinkedIn Column */}
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#0A66C2] flex items-center gap-2 mb-6">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  Social Reality (High Trust)
                </span>
                
                <div className="space-y-4">
                  <div className="p-5 border-l-[3px] border-[#0A66C2] bg-blue-50">
                    <span className="text-xs uppercase tracking-wider text-[#0A66C2] block mb-2">Human Leadership</span>
                    <h3 className="font-serif text-xl text-foreground mb-1">Authentic Narratives.</h3>
                    <p className="text-sm text-[#0A66C2]">CEO Rafal & Team photos create a "Face" for the brand.</p>
                  </div>
                  
                  <div className="p-5 border-l-[3px] border-[#0A66C2] bg-blue-50">
                    <span className="text-xs uppercase tracking-wider text-[#0A66C2] block mb-2">Audience Signal</span>
                    <h3 className="font-serif text-xl text-foreground mb-1">26,000+ Followers.</h3>
                    <p className="text-sm text-[#0A66C2]">Proof of legacy and industry relevance.</p>
                  </div>
                </div>
              </div>
              
              {/* Website Column */}
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-destructive flex items-center gap-2 mb-6">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
                  Website Reality (Zero Trust)
                </span>
                
                <div className="space-y-4">
                  <div className="p-5 border-l-[3px] border-destructive bg-red-50">
                    <span className="text-xs uppercase tracking-wider text-destructive block mb-2">Social Proof</span>
                    <h3 className="font-serif text-xl text-foreground mb-1">Zero Client Logos.</h3>
                    <p className="text-sm text-destructive">"Who else trusts you?" (Unanswered on Owned Media).</p>
                  </div>
                  
                  <div className="p-5 border-l-[3px] border-destructive bg-red-50">
                    <span className="text-xs uppercase tracking-wider text-destructive block mb-2">Content Vibe</span>
                    <h3 className="font-serif text-xl text-foreground mb-1">Generic "Tech" Speak.</h3>
                    <p className="text-sm text-destructive">"Smart Technology" replaces the human warmth you actually possess.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Insight Footer */}
            <div className="mt-auto bg-muted/50 p-6 border-l-4 border-amber-500">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-2">The Fix</span>
                  <p className="font-serif text-xl text-foreground">
                    Stop building two separate brands. <br/>Import the "LinkedIn Soul" into the "Website Body."
                  </p>
                </div>
                <div className="font-mono text-xs text-primary uppercase tracking-widest">
                  → High Leverage Move
                </div>
              </div>
            </div>
          </div>
        </Slide>

        {/* Slide 15: Narrative Positioning */}
        <Slide>
          <div className="max-w-7xl w-full h-full flex flex-col justify-center">
            <div className="mb-4">
              <SlideEyebrow>Narrative Positioning</SlideEyebrow>
              <ActionTitle>The "Hybrid" Trap.</ActionTitle>
              <p className="font-sans font-light text-muted-foreground max-w-3xl leading-relaxed">
                Attempting to claim "Best of Both Worlds" (Tech + Human) has resulted in a generic "Middle of the Road" identity. The visual and verbal language cheapens the premium reality.
              </p>
            </div>

            <div className="grid grid-cols-12 gap-20 mt-8">
              {/* Left Column: Headline Audit */}
              <div className="col-span-7 relative p-12 border border-dashed border-border bg-muted/30 flex flex-col justify-center">
                <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest absolute top-4 left-4">Home Page Headline Audit</span>
                
                <div className="font-serif text-5xl leading-tight text-foreground">
                  <span className="relative inline-block">
                    Smart Technology
                    <span className="absolute -top-7 left-0 font-mono text-[11px] text-destructive bg-white px-2 py-1 border border-destructive/20 rounded shadow-sm whitespace-nowrap">
                      <span className="font-bold mr-1">×</span> Generic. (Zappi owns this)
                    </span>
                  </span>
                  <br />
                  <span className="italic text-muted-foreground font-light">meets</span>
                  <br />
                  <span className="relative inline-block">
                    Human Insight.
                    <span className="absolute -bottom-7 right-0 font-mono text-[11px] text-destructive bg-white px-2 py-1 border border-destructive/20 rounded shadow-sm whitespace-nowrap">
                      <span className="font-bold mr-1">×</span> Vague. (Dynata owns this)
                    </span>
                  </span>
                </div>

                <div className="mt-16 flex items-center gap-4 border-t border-border pt-6">
                  <div className="w-8 h-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center font-bold text-xs">!</div>
                  <p className="text-xs text-muted-foreground font-medium">
                    The "Cover-Up" Test: If we hide the logo, this could be any of 500+ agencies.
                  </p>
                </div>
              </div>

              {/* Right Column: Critique Cards */}
              <div className="col-span-5 flex flex-col justify-center gap-6">
                <div className="bg-white p-6 border-l-4 border-border">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-semibold block mb-2">Error 01: Comparability</span>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    "Hybrid" positioning invites comparison to everyone. You compete on price against Tech (who are cheaper) and on scale against Legacy (who are bigger).
                  </p>
                </div>

                <div className="bg-destructive/5 p-6 border-l-4 border-destructive">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-destructive font-semibold block mb-2">Error 02: Visual Integrity</span>
                  <p className="text-sm text-foreground font-medium leading-relaxed">
                    The imagery is "AI Slop."
                    <span className="block font-normal text-muted-foreground mt-1">
                      Using generic, AI-generated "Happy Tech People" icons creates a subconscious signal of cheapness. It contradicts your claim of "Real Human Insight."
                    </span>
                  </p>
                </div>

                <div className="bg-white p-6 border-l-4 border-border">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-semibold block mb-2">Error 03: The "Ghost" Crew</span>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Your actual differentiator—the "Mavrix Crew" beloved on LinkedIn—is completely absent here. You are hiding your stars behind stock vectors.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Slide>

        {/* Slide 16: Trust Architecture */}
        <Slide>
          <div className="max-w-7xl w-full h-full flex flex-col justify-center">
            <div className="mb-4">
              <SlideEyebrow>Trust Architecture</SlideEyebrow>
              <ActionTitle>Three structural fractures are undermining buyer confidence.</ActionTitle>
              <p className="font-sans font-light text-muted-foreground max-w-3xl leading-relaxed">
                Trust is not just about what you say; it's about what the buyer finds when they check your homework. Our audit uncovered three specific "leaks" where credibility is evaporating.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-8 mt-8 flex-1">
              {/* Fracture 01 */}
              <div className="border border-border p-8 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[11px] text-destructive uppercase tracking-wider block mb-4">Fracture 01: The "Anonymity" Error</span>
                  <h3 className="font-serif text-2xl mb-4 text-foreground leading-tight">Nameless<br/>Testimonials.</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-light mb-6">
                    Your testimonials are attributed to generic titles (e.g., "Director"). In a high-stakes B2B market, anonymous praise is interpreted as fabricated praise.
                  </p>
                </div>
                <div className="bg-muted/50 p-4 border-l-2 border-muted-foreground/30 text-xs text-muted-foreground italic">
                  "Great service." <br/>— Director, Tech Firm
                  <span className="block mt-2 not-italic font-bold text-muted-foreground/60 text-[9px] uppercase tracking-wider">Buyer Reaction: "Fake."</span>
                </div>
              </div>

              {/* Fracture 02 */}
              <div className="border border-border p-8 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[11px] text-destructive uppercase tracking-wider block mb-4">Fracture 02: The "IP" Vacuum</span>
                  <h3 className="font-serif text-2xl mb-4 text-foreground leading-tight">Zero Published<br/>Thinking.</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-light mb-6">
                    We found "0 Published Whitepapers" or Reports. You claim to offer "Human Insight," but provide no evidence of that insight in written form.
                  </p>
                </div>
                <div className="bg-muted/50 p-4 border-l-2 border-muted-foreground/30 text-xs text-muted-foreground italic">
                  Result: You are selling "Hands" (Labor), not "Heads" (Expertise).
                </div>
              </div>

              {/* Fracture 03 - Alert Card */}
              <div className="border border-destructive/30 bg-destructive/5 p-8 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[11px] text-destructive uppercase tracking-wider flex items-center gap-2 mb-4">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"/></svg>
                    Fracture 03: Identity Clash
                  </span>
                  <h3 className="font-serif text-2xl mb-4 text-foreground leading-tight">The "Crypto Bot"<br/>Contamination.</h3>
                  <p className="text-sm text-foreground leading-relaxed font-medium mb-6">
                    Critical Issue: A search for "Mavrix Reviews" surfaces "Mavrix AI" (a crypto trading bot) with consumer complaints.
                  </p>
                </div>
                <div className="bg-white p-4 border-l-2 border-destructive text-xs text-destructive italic">
                  Risk: A qualified buyer searches for you, finds "Crypto Scam" warnings, and abandons the funnel immediately.
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center border-t border-border pt-4">
              <span className="text-xs text-muted-foreground font-medium">
                <span className="text-primary font-bold mr-2">REQUIRED FIX:</span>
                Build a "Digital Fence." (FAQ Disclaimer + Owned Content to push Crypto results down).
              </span>
            </div>
          </div>
        </Slide>

        {/* Slide 17: Revenue Leakage Analysis */}
        <Slide>
          <div className="max-w-7xl w-full flex flex-col pt-16">
            <SlideEyebrow>Revenue Leakage Analysis</SlideEyebrow>
            <ActionTitle>Three "Invisible Taxes" on growth.</ActionTitle>
            
            <p className="text-base leading-relaxed text-muted-foreground font-light max-w-3xl mb-10">
              We identified three specific friction points where existing assets (Data, Audience, Expertise) are failing to convert into revenue due to structural gaps.
            </p>

            <div className="grid grid-cols-3 gap-8 mt-4">
              
              {/* Leak 01: Top of Funnel */}
              <div className="border border-border p-8 flex flex-col justify-between min-h-[320px] border-l-4 border-l-foreground">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                    Leak 01: Top of Funnel
                  </span>
                  <h3 className="font-serif text-2xl mb-4 leading-tight">Identity Dilution.</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-light">
                    "Mavrix" is a crowded namespace (AI bots, Motorsports, etc.). Without strong content "fencing," qualified buyers get lost in the noise.
                  </p>
                </div>
                <div className="bg-muted/50 p-4 rounded mt-auto">
                  <span className="block font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-1">The Cost</span>
                  <span className="font-mono text-sm font-semibold">Discovery Friction.</span>
                </div>
              </div>

              {/* Leak 02: Mid Funnel */}
              <div className="border border-border p-8 flex flex-col justify-between min-h-[320px] border-l-4 border-l-primary">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                    Leak 02: Mid Funnel
                  </span>
                  <h3 className="font-serif text-2xl mb-4 leading-tight">Asset Stagnation.</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-light">
                    You own 22 years of proprietary global data, yet have <strong>0 published reports</strong>. You are sitting on a lead-generation engine that is currently switched off.
                  </p>
                </div>
                <div className="bg-muted/50 p-4 rounded mt-auto">
                  <span className="block font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-1">The Cost</span>
                  <span className="font-mono text-sm font-semibold">Zero Inbound from IP.</span>
                </div>
              </div>

              {/* Leak 03: Bottom Funnel */}
              <div className="border border-border p-8 flex flex-col justify-between min-h-[320px] border-l-4 border-l-destructive">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-destructive mb-4 flex items-center gap-2">
                    Leak 03: Bottom Funnel
                  </span>
                  <h3 className="font-serif text-2xl mb-4 leading-tight">The "Authority" Vacuum.</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-light">
                    Who is the "Technical Voice" of the business? Sales teams lack a recognized Industry Leader or Technical Visionary to cite in pitches, weakening the "Expertise" claim.
                  </p>
                </div>
                <div className="bg-muted/50 p-4 rounded mt-auto">
                  <span className="block font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-1">The Cost</span>
                  <span className="font-mono text-sm font-semibold">Weakened Sales Narrative.</span>
                </div>
              </div>

            </div>
          </div>
        </Slide>

        {/* Slide 18: Diagnosis Synthesis - The Value Inversion */}
        <Slide>
          <div className="max-w-7xl w-full h-full flex flex-col justify-center">
            <div className="mb-4">
              <SlideEyebrow>Diagnosis Synthesis</SlideEyebrow>
              <ActionTitle>The Value Inversion.</ActionTitle>
              <p className="font-light text-muted-foreground max-w-3xl leading-relaxed">
                The core error is not "Identity Confusion"—it is <strong className="text-foreground">Strategic De-Positioning</strong>. You are currently highlighting your commodity features while hiding your scarcity assets.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-16 flex-1 items-center">
              
              {/* Left: The Inversion Model */}
              <div className="flex flex-col gap-4">
                
                {/* Visible Layer - What you market */}
                <div className="bg-muted/50 border border-dashed border-border p-8 relative">
                  <span className="absolute -top-2.5 right-5 bg-background px-2 text-[10px] text-muted-foreground uppercase tracking-wider">Current Focus</span>
                  <h3 className="font-serif text-2xl mb-2 text-muted-foreground">"Smart Technology"</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-light">
                    <strong>The Trap:</strong> Competes with Zappi/AI. <br />
                    <strong>Market Perception:</strong> Cheap, Fast, Synthetic, Risky. <br />
                    <strong>Differentiation:</strong> Zero.
                  </p>
                </div>

                {/* Hidden Layer - What you are */}
                <div className="bg-foreground p-8 relative shadow-xl">
                  <span className="absolute -top-2.5 right-5 bg-primary px-2 py-0.5 text-[10px] text-primary-foreground uppercase tracking-wider">Actual Value</span>
                  <h3 className="font-serif text-2xl mb-2 text-background">"Global Human Fieldwork"</h3>
                  <p className="text-sm text-background/70 leading-relaxed font-light">
                    <strong className="text-background">The Reality:</strong> 85 Countries, Face-to-Face, verified humans. <br />
                    <strong className="text-background">Market Perception:</strong> Rare, Premium, Safe, Irreplicable. <br />
                    <strong className="text-background">Differentiation:</strong> High.
                  </p>
                </div>

              </div>

              {/* Right: The Synthesis */}
              <div className="flex flex-col justify-center border-l border-border pl-12">
                
                <div className="mb-10">
                  <span className="font-mono text-[10px] text-destructive uppercase tracking-widest block mb-2">The Antidote</span>
                  <p className="text-lg text-foreground leading-snug mb-2">
                    You are sitting on the antidote to the industry's biggest poison (Synthetic Data), but you are selling the poison.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    By leading with "Tech," you sound like the problem. You must lead with "Human Verification" to become the solution.
                  </p>
                </div>

                <div className="mb-10">
                  <span className="font-mono text-[10px] text-destructive uppercase tracking-widest block mb-2">The Leverage</span>
                  <p className="text-lg text-foreground leading-snug mb-2">
                    "Humanity" is no longer a soft skill. It is a compliance asset.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    In an AI world, proving a respondent is <strong className="text-foreground">real</strong> is a legal and quality necessity. That is your true moat.
                  </p>
                </div>

                <div className="flex items-center gap-4 font-mono text-xs text-primary font-medium">
                  <span>PIVOT REQUIRED:</span>
                  <span className="border-b border-primary">Stop selling "Speed." Start selling "Truth."</span>
                </div>

              </div>

            </div>
          </div>
        </Slide>

        {/* ============================================== */}
        {/* SECTION 3: STRATEGY (Slides 19-25)            */}
        {/* ============================================== */}

        {/* Slide 20: Divider (The Pivot) - Center Focus */}
        <SectionDivider 
          title="The Pivot" 
          subtitle="The Strategic Move"
          layout="center"
        />

        {/* Slide 20: Strategic Inflection - Transformation List */}
        <Slide>
          <div className="max-w-6xl mx-auto w-full h-full flex flex-col">
            <div className="mb-8">
              <SlideEyebrow>Strategic Inflection</SlideEyebrow>
              <ActionTitle>Stop fighting "Gravity." Start selling "Friction."</ActionTitle>
              <p className="font-light text-muted-foreground max-w-2xl leading-relaxed">
                You cannot win the "Speed" war against AI disruptors. You win the "Truth" war by becoming the necessary friction that verifies reality.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              
              {/* Row 1 */}
              <div className="grid grid-cols-[1fr_60px_1fr] items-center py-5 border-b border-muted hover:bg-muted/30 hover:px-4 rounded-lg transition-all">
                <div className="pr-8">
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-1">Current Physics</span>
                  <h3 className="text-lg text-muted-foreground font-light line-through decoration-destructive">Competing on Speed</h3>
                </div>
                <div className="flex justify-center text-primary/50 text-xl">→</div>
                <div className="pl-8">
                  <span className="font-mono text-[10px] text-primary uppercase tracking-widest block mb-1">New Physics</span>
                  <h3 className="font-serif text-2xl text-foreground font-semibold leading-tight">Competing on Verification</h3>
                  <span className="text-sm text-muted-foreground mt-1 block">The premium has shifted from "How fast?" to "Is it real?"</span>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-[1fr_60px_1fr] items-center py-5 border-b border-muted hover:bg-muted/30 hover:px-4 rounded-lg transition-all">
                <div className="pr-8">
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-1">Current Role</span>
                  <h3 className="text-lg text-muted-foreground font-light line-through decoration-destructive">Midstream Execution</h3>
                </div>
                <div className="flex justify-center text-primary/50 text-xl">→</div>
                <div className="pl-8">
                  <span className="font-mono text-[10px] text-primary uppercase tracking-widest block mb-1">New Role</span>
                  <h3 className="font-serif text-2xl text-foreground font-semibold leading-tight">Downstream Intelligence</h3>
                  <span className="text-sm text-muted-foreground mt-1 block">Moving from "Arms & Legs" (Fieldwork) to "Brains" (Standards).</span>
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-[1fr_60px_1fr] items-center py-5 border-b border-muted hover:bg-muted/30 hover:px-4 rounded-lg transition-all">
                <div className="pr-8">
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-1">Current Evidence</span>
                  <h3 className="text-lg text-muted-foreground font-light line-through decoration-destructive">"Adjective Addiction"</h3>
                </div>
                <div className="flex justify-center text-primary/50 text-xl">→</div>
                <div className="pl-8">
                  <span className="font-mono text-[10px] text-primary uppercase tracking-widest block mb-1">New Evidence</span>
                  <h3 className="font-serif text-2xl text-foreground font-semibold leading-tight">Whistleblower Authority</h3>
                  <span className="text-sm text-muted-foreground mt-1 block">Stop using fluff ("Seamless"). Start exposing fraud ("Synthetic Risk").</span>
                </div>
              </div>

              {/* Row 4 */}
              <div className="grid grid-cols-[1fr_60px_1fr] items-center py-5 border-b border-muted hover:bg-muted/30 hover:px-4 rounded-lg transition-all">
                <div className="pr-8">
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-1">Current Sales</span>
                  <h3 className="text-lg text-muted-foreground font-light line-through decoration-destructive">"Black Box" Quotes</h3>
                </div>
                <div className="flex justify-center text-primary/50 text-xl">→</div>
                <div className="pl-8">
                  <span className="font-mono text-[10px] text-primary uppercase tracking-widest block mb-1">New Sales</span>
                  <h3 className="font-serif text-2xl text-foreground font-semibold leading-tight">"Trojan Horse" Access</h3>
                  <span className="text-sm text-muted-foreground mt-1 block">Transparent entry-level pricing to capture clients before the RFP.</span>
                </div>
              </div>

              {/* Row 5 */}
              <div className="grid grid-cols-[1fr_60px_1fr] items-center py-5 hover:bg-muted/30 hover:px-4 rounded-lg transition-all">
                <div className="pr-8">
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-1">Current Value</span>
                  <h3 className="text-lg text-muted-foreground font-light line-through decoration-destructive">Data Collection</h3>
                </div>
                <div className="flex justify-center text-primary/50 text-xl">→</div>
                <div className="pl-8">
                  <span className="font-mono text-[10px] text-primary uppercase tracking-widest block mb-1">New Value</span>
                  <h3 className="font-serif text-2xl text-foreground font-semibold leading-tight">"CMO Insurance"</h3>
                  <span className="text-sm text-muted-foreground mt-1 block">You are not selling data. You are selling risk mitigation.</span>
                </div>
              </div>

            </div>

            <div className="mt-auto pt-6 border-t border-muted flex items-center justify-between">
              <div className="text-xs text-primary font-semibold uppercase tracking-widest">
                The Net Result
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                This pivot moves Mavrix from a "Price Taker" (Commodity) to a "Price Maker" (Specialist).
              </div>
            </div>

          </div>
        </Slide>

        {/* Slide 21: Focus Themes */}
        <Slide>
          <div className="max-w-7xl mx-auto w-full h-full flex flex-col">
            <SlideEyebrow>Focus Themes</SlideEyebrow>
            <ActionTitle>Three tactical inventions to break the inertia.</ActionTitle>

            <div className="grid grid-cols-3 gap-10 flex-1">
              
              {/* Theme 01: Integrity */}
              <div className="flex flex-col border-t border-border pt-8 group hover:border-primary transition-colors">
                <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest mb-4">Theme 01 // Integrity</span>
                <h3 className="font-serif text-2xl text-foreground mb-6 leading-tight">The "Total Quality" Warranty.</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-light mb-8 min-h-[100px]">
                  "Bad Data" is a spectrum: bots, imposters, inattentive humans, and professional survey-takers. Position Mavrix as the only partner who guarantees the <em className="italic">integrity</em> of the respondent, not just their existence. If there is doubt, we replace.
                </p>
                
                <div className="mt-auto bg-muted/50 p-6 border-l-[3px] border-muted-foreground/30 group-hover:bg-primary/5 group-hover:border-primary transition-colors">
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-2 block font-semibold">Strategic Mechanism</span>
                  <h4 className="text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">"The Zero-Argument Replacement"</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    We remove the friction of "proving" fraud. If you flag a respondent for any reason (profile mismatch, low attention, or bot), we replace them instantly. No debate. No extra cost.
                  </p>
                </div>
              </div>

              {/* Theme 02: Authority */}
              <div className="flex flex-col border-t border-border pt-8 group hover:border-primary transition-colors">
                <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest mb-4">Theme 02 // Authority</span>
                <h3 className="font-serif text-2xl text-foreground mb-6 leading-tight">The "Quality Index."</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-light mb-8 min-h-[100px]">
                  Turn the lack of white papers into a strategic asset. Use your 22 years of data to create the industry standard "Quality Index." This becomes a recurring publication that industry bodies will want to co-brand, instantly elevating Mavrix's profile.
                </p>
                
                <div className="mt-auto bg-muted/50 p-6 border-l-[3px] border-muted-foreground/30 group-hover:bg-primary/5 group-hover:border-primary transition-colors">
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-2 block font-semibold">Strategic Mechanism</span>
                  <h4 className="text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">"The Mavrix Blocklist Report"</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    A quarterly index on the "State of Data Reality." We publish exactly what we block (fraud vectors, bot trends), positioning us as the R&D Lab for the industry.
                  </p>
                </div>
              </div>

              {/* Theme 03: Commerce */}
              <div className="flex flex-col border-t border-border pt-8 group hover:border-primary transition-colors">
                <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest mb-4">Theme 03 // Commerce</span>
                <h3 className="font-serif text-2xl text-foreground mb-6 leading-tight">The "White-Glove" Rescue.</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-light mb-8 min-h-[100px]">
                  When low-cost vendors stall (e.g. stuck at N=300/500), it's a crisis. Unbundle your service to offer a premium "Fieldwork Recovery" tier. This isn't just panel access; it is a strategic takeover with a guaranteed completion plan.
                </p>
                
                <div className="mt-auto bg-muted/50 p-6 border-l-[3px] border-muted-foreground/30 group-hover:bg-primary/5 group-hover:border-primary transition-colors">
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-2 block font-semibold">Strategic Mechanism</span>
                  <h4 className="text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">"Mavrix 911"</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    "Stuck in field? Call us." A premium rapid-response service where senior methodologists assess the failure, build a recovery plan, and guarantee the close.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </Slide>

        {/* Slide 22: The Leverage Matrix - Mavrix */}
        <Slide>
          <div className="max-w-7xl w-full h-full flex flex-col">
            <SlideEyebrow>The Leverage Matrix</SlideEyebrow>
            <ActionTitle>Exploiting the "Silent Failures" of the giants.</ActionTitle>
            
            <div className="grid grid-cols-3 gap-8 flex-1">
              {/* Card 1: Tech Platforms */}
              <div className="flex flex-col border border-border">
                {/* Header */}
                <div className="bg-muted/50 p-5 border-b border-border">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1 block">Adversary: The Tech Platforms</span>
                  <span className="text-sm font-semibold text-muted-foreground">Qualtrics, Cint, Lucid</span>
                </div>
                
                {/* Silent Failure */}
                <div className="p-6 flex-1 bg-background">
                  <span className="text-[10px] text-destructive uppercase tracking-widest mb-2 block font-bold">Their Silent Failure</span>
                  <h3 className="font-serif text-2xl text-foreground mb-3 leading-tight">The "Feasibility Mirage."</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-light">
                    Their APIs promise infinite reach. But algorithms don't recruit. The failure happens when the project stalls at N=400 because the "estimated" respondents don't actually exist in the panel ecosystem.
                  </p>
                </div>

                {/* Mavrix Leverage */}
                <div className="bg-foreground text-background p-5 relative">
                  <div className="absolute -top-3 left-6 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[12px] border-l-transparent border-r-transparent border-b-foreground"></div>
                  <span className="font-mono text-[10px] text-primary uppercase tracking-widest mb-2 block">Mavrix Leverage</span>
                  <h4 className="text-lg font-semibold text-background mb-2">Operational Reality.</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    We don't sell "Estimates." We sell "Completes." We use the <strong className="text-background">Mavrix 911</strong> protocol to manually recruit the missing N=100 that the algorithm couldn't find.
                  </p>
                </div>
              </div>

              {/* Card 2: Legacy Giants */}
              <div className="flex flex-col border border-border">
                {/* Header */}
                <div className="bg-muted/50 p-5 border-b border-border">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1 block">Adversary: The Legacy Giants</span>
                  <span className="text-sm font-semibold text-muted-foreground">Dynata, Kantar, Ipsos</span>
                </div>
                
                {/* Silent Failure */}
                <div className="p-6 flex-1 bg-background">
                  <span className="text-[10px] text-destructive uppercase tracking-widest mb-2 block font-bold">Their Silent Failure</span>
                  <h3 className="font-serif text-2xl text-foreground mb-3 leading-tight">The "Blended Haze."</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-light">
                    They are too big to fill every quote with proprietary sample. They broker out ~40% of work to third parties without telling the client. You think you're buying "Premium," but you're getting "Aggregated Mystery Meat."
                  </p>
                </div>

                {/* Mavrix Leverage */}
                <div className="bg-foreground text-background p-5 relative">
                  <div className="absolute -top-3 left-6 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[12px] border-l-transparent border-r-transparent border-b-foreground"></div>
                  <span className="font-mono text-[10px] text-primary uppercase tracking-widest mb-2 block">Mavrix Leverage</span>
                  <h4 className="text-lg font-semibold text-background mb-2">Chain of Custody.</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Radical transparency. We tell you exactly where the respondent came from. If we broke it out, we name the partner. The <strong className="text-background">Quality Index</strong> proves the pedigree.
                  </p>
                </div>
              </div>

              {/* Card 3: Budget DIY */}
              <div className="flex flex-col border border-border">
                {/* Header */}
                <div className="bg-muted/50 p-5 border-b border-border">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1 block">Adversary: The Budget DIY</span>
                  <span className="text-sm font-semibold text-muted-foreground">Pollfish, SurveyMonkey</span>
                </div>
                
                {/* Silent Failure */}
                <div className="p-6 flex-1 bg-background">
                  <span className="text-[10px] text-destructive uppercase tracking-widest mb-2 block font-bold">Their Silent Failure</span>
                  <h3 className="font-serif text-2xl text-foreground mb-3 leading-tight">The "Clean-Up Tax."</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-light">
                    The CPI (Cost Per Interview) is $2.00. But the data is 40% bots/trash. The client saves money on the platform but loses 3 weeks of staff time manually scrubbing the Excel file.
                  </p>
                </div>

                {/* Mavrix Leverage */}
                <div className="bg-foreground text-background p-5 relative">
                  <div className="absolute -top-3 left-6 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[12px] border-l-transparent border-r-transparent border-b-foreground"></div>
                  <span className="font-mono text-[10px] text-primary uppercase tracking-widest mb-2 block">Mavrix Leverage</span>
                  <h4 className="text-lg font-semibold text-background mb-2">Total Cost of Validity.</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    We are expensive on CPI but cheaper on "TCO" (Total Cost of Ownership). With our <strong className="text-background">Total Quality Warranty</strong>, the data arrives clean. Zero staff time wasted on scrubbing.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </Slide>

        {/* Slide 23: Structural Evolution */}
        <Slide>
          <div className="max-w-7xl w-full h-full flex flex-col">
            <SlideEyebrow>Structural Evolution</SlideEyebrow>
            <ActionTitle>Building the machine that builds the product.</ActionTitle>
            
            <div className="grid grid-cols-3 gap-10 flex-1">
              {/* Card 1: Marketing */}
              <div className="flex flex-col border border-border bg-background transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary group">
                <div className="p-8 border-b border-border/50 bg-muted/30">
                  <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest block mb-2">Function 01 // Marketing</span>
                  <h3 className="font-serif text-2xl text-foreground">The "Intel" Engine</h3>
                </div>
                
                <div className="p-8 flex-1 flex flex-col justify-center">
                  <div>
                    <span className="text-[11px] uppercase tracking-widest text-muted-foreground block mb-2">From (Current)</span>
                    <p className="text-base text-muted-foreground font-light line-through decoration-destructive mb-6">Sales Support & Brochures</p>
                  </div>
                  <div className="text-primary/50 text-xl mb-6">↓</div>
                  <div>
                    <span className="text-[11px] uppercase tracking-widest text-primary block mb-2">To (Future)</span>
                    <h4 className="text-xl font-semibold text-foreground mb-2">Editorial Newsroom</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">Mining 22 years of internal data to publish the "Blocklist" and "Quality Index."</p>
                  </div>
                </div>

                <div className="mx-8 mb-8 p-4 bg-primary/5 border border-dashed border-primary/30 text-center">
                  <span className="text-[10px] uppercase tracking-widest text-primary block mb-1 font-semibold">Key Hire</span>
                  <span className="text-base font-semibold text-foreground">Data Journalist</span>
                </div>
              </div>

              {/* Card 2: Operations */}
              <div className="flex flex-col border border-border bg-background transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary group">
                <div className="p-8 border-b border-border/50 bg-muted/30">
                  <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest block mb-2">Function 02 // Operations</span>
                  <h3 className="font-serif text-2xl text-foreground">The "Rescue" Squad</h3>
                </div>
                
                <div className="p-8 flex-1 flex flex-col justify-center">
                  <div>
                    <span className="text-[11px] uppercase tracking-widest text-muted-foreground block mb-2">From (Current)</span>
                    <p className="text-base text-muted-foreground font-light line-through decoration-destructive mb-6">Generalist Project Pool</p>
                  </div>
                  <div className="text-primary/50 text-xl mb-6">↓</div>
                  <div>
                    <span className="text-[11px] uppercase tracking-widest text-primary block mb-2">To (Future)</span>
                    <h4 className="text-xl font-semibold text-foreground mb-2">"Tiger Team" Split</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">A dedicated rapid-response unit solely for <strong className="text-foreground">Mavrix 911</strong> interventions.</p>
                  </div>
                </div>

                <div className="mx-8 mb-8 p-4 bg-primary/5 border border-dashed border-primary/30 text-center">
                  <span className="text-[10px] uppercase tracking-widest text-primary block mb-1 font-semibold">Key Assignment</span>
                  <span className="text-base font-semibold text-foreground">Senior Methodologists</span>
                </div>
              </div>

              {/* Card 3: Quality */}
              <div className="flex flex-col border border-border bg-background transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary group">
                <div className="p-8 border-b border-border/50 bg-muted/30">
                  <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest block mb-2">Function 03 // Quality</span>
                  <h3 className="font-serif text-2xl text-foreground">The "Integrity" Office</h3>
                </div>
                
                <div className="p-8 flex-1 flex flex-col justify-center">
                  <div>
                    <span className="text-[11px] uppercase tracking-widest text-muted-foreground block mb-2">From (Current)</span>
                    <p className="text-base text-muted-foreground font-light line-through decoration-destructive mb-6">Back-End Checks</p>
                  </div>
                  <div className="text-primary/50 text-xl mb-6">↓</div>
                  <div>
                    <span className="text-[11px] uppercase tracking-widest text-primary block mb-2">To (Future)</span>
                    <h4 className="text-xl font-semibold text-foreground mb-2">Productized QA</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">Owning the <strong className="text-foreground">Identity Warranty</strong> and managing the replacement budget.</p>
                  </div>
                </div>

                <div className="mx-8 mb-8 p-4 bg-primary/5 border border-dashed border-primary/30 text-center">
                  <span className="text-[10px] uppercase tracking-widest text-primary block mb-1 font-semibold">Key Promotion</span>
                  <span className="text-base font-semibold text-foreground">Fraud Analysts → Product Owners</span>
                </div>
              </div>
            </div>
          </div>
        </Slide>

        {/* Slide 24: Governance Signals */}
        <Slide>
          <div className="max-w-7xl w-full h-full flex flex-col">
            <SlideEyebrow>Governance Signals</SlideEyebrow>
            <ActionTitle>Three commitments to operational integrity.</ActionTitle>
            
            <div className="grid grid-cols-3 gap-10 flex-1">
              {/* Signal 1: Accountability */}
              <div className="flex flex-col border border-border bg-background transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary group overflow-hidden">
                <div className="h-1 w-full bg-border group-hover:bg-primary transition-colors" />
                <div className="p-8 flex-1 flex flex-col">
                  <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest block mb-4">Signal 01 // Accountability</span>
                  <h3 className="font-serif text-2xl text-foreground mb-4 leading-tight">The "Battle Bond."</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    We fight the quality war so you don't have to. We provide radical transparency on what we blocked, and a simple promise for what we delivered: <strong className="text-foreground">If you doubt a respondent, we replace them. No questions asked.</strong>
                  </p>
                  <p className="text-xs text-muted-foreground/70 font-medium mt-auto">
                    Rationale: Eliminate the friction of "proving" fraud. Shift the burden of proof entirely onto Mavrix.
                  </p>
                </div>
                <div className="bg-muted/30 p-6 border-t border-border/50">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-2 mb-2">
                    <span className="w-3.5 h-3.5 bg-primary rounded-full flex items-center justify-center">
                      <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </span>
                    Required Artifact
                  </span>
                  <h4 className="text-base font-semibold text-foreground">"The Sanitation Log"</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    A report in every delivery showing the "Kill List" (blocked bots/IPs) to prove the rigorous filtering applied before delivery.
                  </p>
                </div>
              </div>

              {/* Signal 2: Methodology */}
              <div className="flex flex-col border border-border bg-background transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary group overflow-hidden">
                <div className="h-1 w-full bg-border group-hover:bg-primary transition-colors" />
                <div className="p-8 flex-1 flex flex-col">
                  <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest block mb-4">Signal 02 // Methodology</span>
                  <h3 className="font-serif text-2xl text-foreground mb-4 leading-tight">The "Anti-Slop" Doctrine.</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    Stop hiding behind "Tech." Embrace "Effort." When AI shortcuts fail (as they often do), we deploy the Crew. Buses, phone banks, renting halls—we do <strong className="text-foreground">Whatever It Takes</strong> to get real people, not lazy digital proxies.
                  </p>
                  <p className="text-xs text-muted-foreground/70 font-medium mt-auto">
                    Rationale: Reframe "Manual Fieldwork" from a "Legacy Liability" to a "Premium Asset." It is the only antidote to AI Slop.
                  </p>
                </div>
                <div className="bg-muted/30 p-6 border-t border-border/50">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-2 mb-2">
                    <span className="w-3.5 h-3.5 bg-primary rounded-full flex items-center justify-center">
                      <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </span>
                    Required Artifact
                  </span>
                  <h4 className="text-base font-semibold text-foreground">"The Fieldwork Reality Check"</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Marketing materials showing photos of <em>actual</em> field teams, call centers, and face-to-face ops. Prove the human effort.
                  </p>
                </div>
              </div>

              {/* Signal 3: Validation */}
              <div className="flex flex-col border border-border bg-background transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary group overflow-hidden">
                <div className="h-1 w-full bg-border group-hover:bg-primary transition-colors" />
                <div className="p-8 flex-1 flex flex-col">
                  <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest block mb-4">Signal 03 // Validation</span>
                  <h3 className="font-serif text-2xl text-foreground mb-4 leading-tight">The "Verified" Stack.</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    Anonymous testimonials ("Director, Tech Firm") undermine trust. We must move to <strong className="text-foreground">Named Validation</strong>. Real leaders, real badges (ISO), and real accreditations.
                  </p>
                  <p className="text-xs text-muted-foreground/70 font-medium mt-auto">
                    Rationale: In a low-trust world, "Self-Reported" claims are noise. Third-party verification is the only signal that cuts through.
                  </p>
                </div>
                <div className="bg-muted/30 p-6 border-t border-border/50">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-2 mb-2">
                    <span className="w-3.5 h-3.5 bg-primary rounded-full flex items-center justify-center">
                      <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </span>
                    Required Artifact
                  </span>
                  <h4 className="text-base font-semibold text-foreground">"The Accreditation Wall"</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Display ISO certifications and Partner Badges (e.g., Insights Association) prominently in the site footer and decks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Slide>

        {/* Slide 25: Executive Closing */}
        <Slide>
          <div className="max-w-7xl w-full h-full flex flex-col justify-center">
            <div className="grid grid-cols-3 gap-20 h-full items-end">
              
              {/* Left Column - Main Message */}
              <div className="col-span-2 flex flex-col justify-center h-full">
                <div className="w-24 h-1 bg-primary mb-8" />
                
                <h2 className="font-serif text-6xl lg:text-7xl text-foreground leading-[1] mb-2 tracking-tight">
                  Where generic service ends,
                </h2>
                <h2 className="font-serif text-6xl lg:text-7xl italic text-primary leading-[1] tracking-tight">
                  Authority begins.
                </h2>
                
                <p className="font-sans text-lg text-muted-foreground font-light leading-relaxed max-w-[650px] mt-8 mb-16">
                  This assessment is not an indictment of capability; it is a roadmap to recognition. The market is drowning in "AI Slop" and actively seeking a high-fidelity leader. Mavrix is operationally positioned to take that mantle, if it chooses to speak clearly.
                </p>

                {/* Three Pivot Steps */}
                <div className="grid grid-cols-3 gap-8 border-t border-border pt-8">
                  <div className="border-l-2 border-primary pl-5">
                    <span className="font-mono text-[10px] text-primary uppercase tracking-[0.15em] block mb-2">Pivot 01</span>
                    <h3 className="font-sans text-base font-semibold text-foreground mb-1">The Narrative</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Shift from "Smart Tech" to <strong className="text-foreground">"Zero-Risk."</strong> Own the "Anti-Slop" position.
                    </p>
                  </div>
                  <div className="border-l-2 border-primary pl-5">
                    <span className="font-mono text-[10px] text-primary uppercase tracking-[0.15em] block mb-2">Pivot 02</span>
                    <h3 className="font-sans text-base font-semibold text-foreground mb-1">The Proof</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Launch the <strong className="text-foreground">"Sanitation Log"</strong> and "Quality Index" to prove the work.
                    </p>
                  </div>
                  <div className="border-l-2 border-primary pl-5">
                    <span className="font-mono text-[10px] text-primary uppercase tracking-[0.15em] block mb-2">Pivot 03</span>
                    <h3 className="font-sans text-base font-semibold text-foreground mb-1">The Commerce</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Deploy <strong className="text-foreground">"Mavrix 911"</strong> and tiered transparency to reduce friction.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column - Impact Metrics */}
              <div className="flex flex-col gap-6 border-l border-border pl-12 h-full justify-end pb-8">
                
                <div className="bg-muted/30 p-6 rounded">
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-2">Financial Upside</span>
                  <div className="font-serif text-4xl text-primary mb-2">+$1.6M</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Projected incremental revenue from "Rescue" services and improved win-rates (195% ROI).
                  </p>
                </div>

                <div className="bg-background border border-border p-6 rounded">
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-2">Strategic Upside</span>
                  <div className="font-serif text-2xl text-foreground mb-2">Future-Proofing</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Structural immunity against AI commoditization by owning the "Human Verification" moat.
                  </p>
                </div>

                <div className="bg-primary/10 p-6 border-l-4 border-primary">
                  <span className="font-mono text-[10px] font-bold text-primary uppercase tracking-widest block mb-2">Next Step</span>
                  <p className="text-sm text-foreground leading-relaxed font-medium">
                    Approve the 90-Day Sprint to align engineering and marketing on Week 1 deliverables.
                  </p>
                </div>
                
                {/* Footer with Mondro branding */}
                <div className="flex justify-between items-center pt-6 border-t border-border mt-auto">
                  <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                    Prepared by Mondro Intelligence
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <span className="font-serif font-bold text-xl tracking-tight lowercase">mondro</span>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-20"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.3)]"></span>
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </Slide>

        {/* ============================================== */}
        {/* APPENDIX (Slides A, B, C)                      */}
        {/* ============================================== */}

        {/* Appendix Divider */}
        <div data-divider="true" className="w-screen h-screen flex-shrink-0 bg-background relative flex flex-col overflow-hidden">
          {/* Subtle grid background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full border-l border-r border-border/30 mx-auto max-w-6xl grid grid-cols-12">
              <div className="col-span-2 border-r border-border/30 h-full"></div>
              <div className="col-span-8 border-r border-border/30 h-full"></div>
              <div className="col-span-2 h-full"></div>
            </div>
            <div className="absolute top-24 w-full border-b border-border/30"></div>
            <div className="absolute bottom-32 w-full border-b border-border/30"></div>
          </div>

          <div className="relative z-10 h-full flex flex-col max-w-6xl mx-auto px-8 w-full">
            {/* Header */}
            <div className="h-24 flex items-end pb-6 justify-between">
              <div className="flex items-center gap-1.5 text-foreground">
                <span className="font-serif font-bold text-xl tracking-tight lowercase">mondro</span>
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              </div>
              <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
                Reference Material
              </div>
            </div>

            {/* Main content */}
            <div className="flex-grow flex flex-col justify-center">
              <div className="grid grid-cols-12 gap-8">
                <div className="col-span-2 text-right pt-4">
                  <span className="font-mono text-[10px] text-primary uppercase tracking-widest block transform -rotate-90 origin-top-right translate-x-4">
                    Supporting Data
                  </span>
                </div>
                
                <div className="col-span-10">
                  <h1 className="font-serif text-7xl lg:text-8xl text-foreground leading-[0.9] tracking-tighter mb-8">
                    Operational <br/>
                    <span className="text-primary italic pr-4">Detail.</span>
                  </h1>
                  <p className="font-sans text-lg font-light text-muted-foreground max-w-md leading-relaxed ml-2 border-l border-primary pl-6">
                    Granular analysis, technical constraints, and near-term value calculations.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer - Appendix sections */}
            <div className="h-32 grid grid-cols-12 gap-8 items-start pt-8">
              <div className="col-span-2"></div>
              <div className="col-span-3">
                <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-1">Appendix A</div>
                <div className="font-serif text-lg text-foreground leading-tight">Immediate Priorities</div>
                <div className="font-sans text-[10px] text-muted-foreground mt-1">Quick wins & granular fixes</div>
              </div>
              
              <div className="col-span-3">
                <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Appendix B</div>
                <div className="font-serif text-lg text-foreground leading-tight">Technical Constraints</div>
                <div className="font-sans text-[10px] text-muted-foreground mt-1">Latency, Code, & Core Web Vitals</div>
              </div>
              
              <div className="col-span-4">
                <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Appendix C</div>
                <div className="font-serif text-lg text-foreground leading-tight">Near-Term Value</div>
                <div className="font-sans text-[10px] text-muted-foreground mt-1">ROI Modeling</div>
              </div>
            </div>
          </div>
        </div>

        {/* Appendix A: Immediate Priorities */}
        <Slide>
          <div className="max-w-7xl w-full h-full flex flex-col">
            <SlideEyebrow>Appendix A: Immediate Priorities</SlideEyebrow>
            <ActionTitle className="mb-4">The "De-Artificial" Audit.</ActionTitle>
            <p className="text-lg text-muted-foreground font-light mb-10 max-w-3xl">
              You cannot sell "Human Truth" if your own brand looks like it was generated by a bot. The first step is scrubbing the "AI Slop" to build credibility.
            </p>
            
            <div className="grid md:grid-cols-12 gap-12">
              {/* Sprint 01: Quick Wins */}
              <div className="col-span-5">
                <div className="font-mono text-[10px] uppercase tracking-widest text-primary mb-6">Sprint 01: Quick Wins</div>
                
                <div className="space-y-0">
                  {/* Priority 1 */}
                  <div className="border-t border-border pt-5 pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-serif text-xl text-foreground font-semibold">1. The "Anti-Stock" Purge</h3>
                      <span className="font-mono text-[9px] text-primary bg-primary/10 border border-primary/30 px-2 py-0.5 uppercase">High Impact</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                      Remove all generic "business people pointing at screens" imagery. Replace with gritty, real photos of the Ops Center and leadership team.
                    </p>
                    <div className="flex items-center gap-4 font-mono text-[9px] text-muted-foreground/70 uppercase tracking-wide">
                      <span>Effort: Low</span>
                      <span>Type: Brand / Visuals</span>
                    </div>
                  </div>

                  {/* Priority 2 */}
                  <div className="border-t border-border pt-5 pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-serif text-xl text-foreground font-semibold">2. Scrub the "AI Fluff"</h3>
                      <span className="font-mono text-[9px] text-muted-foreground bg-muted border border-border px-2 py-0.5 uppercase">Med Impact</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                      Ctrl+F search for "Innovative," "Seamless," and "Robust." Replace with specific verbs: "We Verify," "We Block," "We Guarantee."
                    </p>
                    <div className="flex items-center gap-4 font-mono text-[9px] text-muted-foreground/70 uppercase tracking-wide">
                      <span>Effort: Low</span>
                      <span>Type: Copywriting</span>
                    </div>
                  </div>

                  {/* Priority 3 */}
                  <div className="border-t border-border pt-5 pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-serif text-xl text-foreground font-semibold">3. Give the Team a Voice</h3>
                      <span className="font-mono text-[9px] text-primary bg-primary/10 border border-primary/30 px-2 py-0.5 uppercase">High Impact</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                      Replace anonymous avatars with real LinkedIn profiles. Add "War Stories" or philosophy quotes for key methodologists.
                    </p>
                    <div className="flex items-center gap-4 font-mono text-[9px] text-muted-foreground/70 uppercase tracking-wide">
                      <span>Effort: Med</span>
                      <span>Type: Validation</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Capability Heatmap */}
              <div className="col-span-7">
                <div className="font-mono text-[10px] uppercase tracking-widest text-primary mb-4">Capability Heatmap</div>
                
                <table className="w-full border-collapse" style={{ borderSpacing: "0 0.5rem" }}>
                  <thead>
                    <tr>
                      <th className="font-mono text-[10px] font-normal uppercase tracking-wide text-muted-foreground text-left pb-3" style={{ width: "25%" }}>Vector</th>
                      <th className="font-mono text-[10px] font-normal uppercase tracking-wide text-muted-foreground text-center pb-3" style={{ width: "15%" }}>Status</th>
                      <th className="font-mono text-[10px] font-normal uppercase tracking-wide text-muted-foreground text-left pb-3" style={{ width: "30%" }}>Observation</th>
                      <th className="font-mono text-[10px] font-normal uppercase tracking-wide text-muted-foreground text-left pb-3" style={{ width: "30%" }}>Risk Implication</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-4 px-4 bg-muted/40 border-y border-l border-border/50 rounded-l font-semibold text-sm">Visual Authenticity</td>
                      <td className="py-4 px-4 bg-muted/40 border-y border-border/50 text-center"><span className="inline-block w-2.5 h-2.5 rounded-full border border-destructive bg-background"></span></td>
                      <td className="py-4 px-4 bg-muted/40 border-y border-border/50 text-xs text-muted-foreground">Heavy use of generic stock/AI imagery.</td>
                      <td className="py-4 px-4 bg-muted/40 border-y border-r border-border/50 rounded-r text-xs font-medium text-destructive">Erodes "Human Truth" claim instantly.</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 bg-muted/40 border-y border-l border-border/50 rounded-l font-semibold text-sm">Narrative Voice</td>
                      <td className="py-4 px-4 bg-muted/40 border-y border-border/50 text-center"><span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: "linear-gradient(90deg, #F59E0B 50%, hsl(var(--muted)) 50%)" }}></span></td>
                      <td className="py-4 px-4 bg-muted/40 border-y border-border/50 text-xs text-muted-foreground">High density of generic jargon ("Seamless").</td>
                      <td className="py-4 px-4 bg-muted/40 border-y border-r border-border/50 rounded-r text-xs font-medium text-amber-500">Indistinguishable from AI copy.</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 bg-muted/40 border-y border-l border-border/50 rounded-l font-semibold text-sm">Social Proof</td>
                      <td className="py-4 px-4 bg-muted/40 border-y border-border/50 text-center"><span className="inline-block w-2.5 h-2.5 rounded-full border border-destructive bg-background"></span></td>
                      <td className="py-4 px-4 bg-muted/40 border-y border-border/50 text-xs text-muted-foreground">Anonymous icons & unnamed testimonials.</td>
                      <td className="py-4 px-4 bg-muted/40 border-y border-r border-border/50 rounded-r text-xs font-medium text-destructive">Zero verification for skeptics.</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 bg-muted/40 border-y border-l border-border/50 rounded-l font-semibold text-sm">Tech Transparency</td>
                      <td className="py-4 px-4 bg-muted/40 border-y border-border/50 text-center"><span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: "linear-gradient(90deg, #F59E0B 50%, hsl(var(--muted)) 50%)" }}></span></td>
                      <td className="py-4 px-4 bg-muted/40 border-y border-border/50 text-xs text-muted-foreground">Vague mentions of "AI Tools."</td>
                      <td className="py-4 px-4 bg-muted/40 border-y border-r border-border/50 rounded-r text-xs font-medium text-amber-500">Perceived as "Black Box."</td>
                    </tr>
                  </tbody>
                </table>

                <div className="mt-6 flex gap-6 justify-end font-mono text-[9px] text-muted-foreground uppercase tracking-wide">
                  <div className="flex items-center gap-2"><span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Optimized</div>
                  <div className="flex items-center gap-2"><span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: "linear-gradient(90deg, #F59E0B 50%, hsl(var(--muted)) 50%)" }}></span> Developing</div>
                  <div className="flex items-center gap-2"><span className="inline-block w-2.5 h-2.5 rounded-full border border-destructive bg-background"></span> Critical</div>
                </div>
              </div>
            </div>
          </div>
        </Slide>

        {/* Appendix B: Technical Constraints */}
        <Slide>
          <div className="max-w-7xl w-full h-full flex flex-col">
            <SlideEyebrow>Appendix B: Technical Constraints</SlideEyebrow>
            <ActionTitle>Technical friction is degrading<br />the perception of authority.</ActionTitle>
            
            <div className="grid md:grid-cols-12 gap-6">
              <div className="col-span-9 grid md:grid-cols-3 gap-5">
                {/* Vector 01: Mobile Latency */}
                <div className="border border-border bg-background flex flex-col hover:border-primary transition-all duration-300">
                  <div className="p-5 border-b border-border/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-destructive">Vector 01</span>
                      <span className="text-[10px] font-semibold bg-destructive/10 text-destructive px-2 py-0.5 rounded">Critical</span>
                    </div>
                    <h3 className="font-serif text-xl">Mobile Latency</h3>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">The Diagnosis</span>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Mobile score is <strong className="text-foreground">60/100</strong> (vs 88 Desktop). High-res uncompressed assets (PNGs) and blocking scripts add 2.4s latency on 4G networks.
                      </p>
                    </div>
                    
                    <div className="mt-auto bg-muted/50 p-3 border-l-2 border-primary">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-1">The Prescription</span>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Convert all assets to WebP/AVIF. Implement "lazy loading" for below-fold content to cut Time-to-Interactive by ~1.5s.
                      </p>
                    </div>
                  </div>

                  <div className="bg-foreground text-background p-4">
                    <p className="text-xs font-medium italic opacity-90">"The platform feels heavy."</p>
                  </div>
                </div>

                {/* Vector 02: Conversion Logic */}
                <div className="border border-border bg-background flex flex-col hover:border-primary transition-all duration-300">
                  <div className="p-5 border-b border-border/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-destructive">Vector 02</span>
                      <span className="text-[10px] font-semibold bg-destructive/10 text-destructive px-2 py-0.5 rounded">High Impact</span>
                    </div>
                    <h3 className="font-serif text-xl">Conversion Logic</h3>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">The Diagnosis</span>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        The user journey dead-ends in the Hero section due to a missing primary CTA. Generic "Send Message" buttons reduce urgency for B2B buyers.
                      </p>
                    </div>
                    
                    <div className="mt-auto bg-muted/50 p-3 border-l-2 border-primary">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-1">The Prescription</span>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Hardcode a "Request Quote" button above the fold. Switch generic labels to benefit-driven text (e.g., "Start Project").
                      </p>
                    </div>
                  </div>

                  <div className="bg-foreground text-background p-4">
                    <p className="text-xs font-medium italic opacity-90">"Where do I start?"</p>
                  </div>
                </div>

                {/* Vector 03: Search Visibility */}
                <div className="border border-border bg-background flex flex-col hover:border-primary transition-all duration-300">
                  <div className="p-5 border-b border-border/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-destructive">Vector 03</span>
                      <span className="text-[10px] font-semibold bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded">Medium</span>
                    </div>
                    <h3 className="font-serif text-xl">Search Visibility</h3>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">The Diagnosis</span>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        SEO Score is <strong className="text-foreground">40/100</strong> (-20 vs Avg). Absence of meta-descriptions and structured data renders the site invisible to organic discovery engines.
                      </p>
                    </div>
                    
                    <div className="mt-auto bg-muted/50 p-3 border-l-2 border-primary">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-1">The Prescription</span>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Deploy XML sitemap immediately. Populate unique meta-tags for the top 10 service pages to trigger re-indexing.
                      </p>
                    </div>
                  </div>

                  <div className="bg-foreground text-background p-4">
                    <p className="text-xs font-medium italic opacity-90">"Is this company active?"</p>
                  </div>
                </div>
              </div>
              
              <div className="col-span-3 border-l border-border pl-6 flex flex-col">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground block mb-3">Composite Score</span>
                  <div className="font-serif text-5xl text-foreground leading-none mb-2">40<span className="text-xl text-muted-foreground">/100</span></div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Mondro Health Score. Passing threshold for Enterprise vendors is 75+.
                  </p>
                </div>

                <div className="mt-auto bg-primary/10 p-5 border-t-[3px] border-primary">
                  <span className="font-mono text-[10px] font-bold text-primary uppercase tracking-widest block mb-3">Sprint Focus (Week 1)</span>
                  <ul className="space-y-2.5">
                    <li className="text-xs font-medium text-foreground relative pl-3 before:content-['•'] before:text-primary before:font-bold before:absolute before:left-0">Hardcode Hero CTA</li>
                    <li className="text-xs font-medium text-foreground relative pl-3 before:content-['•'] before:text-primary before:font-bold before:absolute before:left-0">Mobile Asset Optimization</li>
                    <li className="text-xs font-medium text-foreground relative pl-3 before:content-['•'] before:text-primary before:font-bold before:absolute before:left-0">Meta-Tag Implementation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Slide>

        {/* Appendix C: Near-Term Value (moved from old Slide 25) */}
        <Slide>
          <div className="max-w-7xl w-full h-full flex flex-col">
            <SlideEyebrow>Appendix C: Near-Term Value</SlideEyebrow>
            <ActionTitle>Momentum: Operationalizing the 'Quick Wins'.</ActionTitle>
            
            <p className="text-base text-muted-foreground max-w-3xl mb-10">
              These tactical upgrades fix the "leaky bucket." They are designed to be deployed within 30 days to maximize the value of existing traffic before scaling.
            </p>

            <div className="grid md:grid-cols-12 gap-8 flex-1">
              {/* Three Action Cards */}
              <div className="col-span-9 grid md:grid-cols-3 gap-6">
                {/* Card 01: CTA Architecture */}
                <div className="border border-border bg-background flex flex-col">
                  <div className="p-5 flex-1 border-l-4 border-primary bg-muted/30 flex flex-col">
                    <span className="font-mono text-[10px] text-primary uppercase tracking-widest mb-2">01. Actionability</span>
                    <h3 className="font-serif text-xl text-foreground mb-3">CTA Architecture</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                      <strong className="text-foreground">Action:</strong> The Hero lacks a primary trigger. Hardcode a "Get Quote" button above the fold. Update generic "Send Message" form button to "Request Consultation."
                    </p>
                    <div className="space-y-1 text-[11px] text-muted-foreground mb-4">
                      <div className="relative pl-4 before:content-['→'] before:absolute before:left-0 before:text-muted-foreground/50">Add "24h Response" micro-copy</div>
                      <div className="relative pl-4 before:content-['→'] before:absolute before:left-0 before:text-muted-foreground/50">Make phone number clickable</div>
                    </div>
                    <div className="mt-auto pt-4 border-t border-border">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Impact</span>
                      <span className="text-base font-semibold text-primary">+40% Conversion</span>
                    </div>
                  </div>
                  <div className="p-4 border-t border-border">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Owner</span>
                    <span className="text-sm font-medium text-foreground">Engineering + UX</span>
                  </div>
                </div>

                {/* Card 02: Social Proof Injection */}
                <div className="border border-border bg-background flex flex-col">
                  <div className="p-5 flex-1 border-l-4 border-primary bg-muted/30 flex flex-col">
                    <span className="font-mono text-[10px] text-primary uppercase tracking-widest mb-2">02. Credibility</span>
                    <h3 className="font-serif text-xl text-foreground mb-3">Social Proof Injection</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                      <strong className="text-foreground">Action:</strong> The homepage lacks external validation. Deploy a "Trusted By" strip with 4-5 client logos immediately below the hero.
                    </p>
                    <div className="space-y-1 text-[11px] text-muted-foreground mb-4">
                      <div className="relative pl-4 before:content-['→'] before:absolute before:left-0 before:text-muted-foreground/50">Add 2 verified client testimonials</div>
                      <div className="relative pl-4 before:content-['→'] before:absolute before:left-0 before:text-muted-foreground/50">Display "22 Years" experience badge</div>
                    </div>
                    <div className="mt-auto pt-4 border-t border-border">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Impact</span>
                      <span className="text-base font-semibold text-primary">-15% Bounce Rate</span>
                    </div>
                  </div>
                  <div className="p-4 border-t border-border">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Owner</span>
                    <span className="text-sm font-medium text-foreground">Marketing + Design</span>
                  </div>
                </div>

                {/* Card 03: Value Articulation */}
                <div className="border border-border bg-background flex flex-col">
                  <div className="p-5 flex-1 border-l-4 border-primary bg-muted/30 flex flex-col">
                    <span className="font-mono text-[10px] text-primary uppercase tracking-widest mb-2">03. Clarity</span>
                    <h3 className="font-serif text-xl text-foreground mb-3">Value Articulation</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                      <strong className="text-foreground">Action:</strong> Replace vague "Smart Technology" headline with specific "Global Data Collection." Move Service summary above the fold.
                    </p>
                    <div className="space-y-1 text-[11px] text-muted-foreground mb-4">
                      <div className="relative pl-4 before:content-['→'] before:absolute before:left-0 before:text-muted-foreground/50">Test benefit-driven subheads</div>
                      <div className="relative pl-4 before:content-['→'] before:absolute before:left-0 before:text-muted-foreground/50">Clarify "Global" vs "Local" reach</div>
                    </div>
                    <div className="mt-auto pt-4 border-t border-border">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Impact</span>
                      <span className="text-base font-semibold text-muted-foreground">Relevance Signal</span>
                    </div>
                  </div>
                  <div className="p-4 border-t border-border">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Owner</span>
                    <span className="text-sm font-medium text-foreground">Content + Analytics</span>
                  </div>
                </div>
              </div>
              
              {/* Right Rail */}
              <div className="col-span-3 border-l border-border pl-6 flex flex-col gap-6">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground block mb-3">Total Timeline</span>
                  <div className="font-serif text-4xl text-foreground leading-none mb-2">30 Days</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    All three wins can be deployed in parallel sprints.
                  </p>
                </div>

                <div className="bg-primary/10 p-4 border-l-2 border-primary">
                  <span className="font-mono text-[10px] font-bold text-primary uppercase tracking-widest block mb-2">Combined ROI</span>
                  <p className="text-xs text-foreground leading-relaxed">
                    Estimated <strong>+55%</strong> funnel efficiency improvement by fixing basic trust and conversion leaks.
                  </p>
                </div>

                <div>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground block mb-3">Success Criteria</span>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs border-b border-border/50 pb-2">
                      <span className="text-muted-foreground">Form Starts</span>
                      <span className="text-primary font-semibold">+60%</span>
                    </div>
                    <div className="flex justify-between text-xs border-b border-border/50 pb-2">
                      <span className="text-muted-foreground">Form Completions</span>
                      <span className="text-primary font-semibold">+40%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Bounce Rate</span>
                      <span className="text-primary font-semibold">-15%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Slide>

      </div>
      {/* Hidden export button trigger */}
      <button data-export-trigger className="hidden" onClick={handleDownload} />
      
      {/* Subtle progress indicator - bottom right */}
      {totalSlides > 0 && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 print-hide">
          {/* Progress bar */}
          <div className="w-24 h-[2px] bg-muted overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
            />
          </div>
          {/* Slide counter */}
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
            {String(currentSlide + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
          </span>
        </div>
      )}
      
      {/* Back to Dashboard link - top left */}
      {onExit && (
        <button 
          onClick={onExit}
          className="fixed top-6 left-6 z-50 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group print-hide"
        >
          <span className="relative">
            ← Back to Dashboard
            <span className="absolute left-0 -bottom-0.5 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
          </span>
        </button>
      )}
    </div>
  );
};

export default ReportSection;
