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

        {/* Slide 22: Leverage Matrix (REWORKED: renamed dots) */}
        <Slide>
          <div className="max-w-7xl w-full h-full flex flex-col">
            <SlideEyebrow>Leverage & Allocation</SlideEyebrow>
            <ActionTitle>Where effort produces disproportionate return.</ActionTitle>
            
            <div className="grid md:grid-cols-12 gap-6 -mt-4">
              <div className="col-span-8">
                {/* Matrix Chart */}
                <div className="flex items-start gap-3">
                  {/* Y-Axis Label */}
                  <div className="flex items-center justify-center h-[320px] -ml-2">
                    <div className="-rotate-90 text-[10px] font-mono text-primary font-bold tracking-widest whitespace-nowrap">
                      LOW ← IMPACT → HIGH
                    </div>
                  </div>
                  
                  <div className="flex flex-col flex-1">
                    {/* Matrix Chart */}
                    <div className="relative w-full h-[320px] border border-border bg-background">
                    
                    {/* Quadrant Lines */}
                    <div className="absolute left-1/2 top-0 h-full w-px bg-border"></div>
                    <div className="absolute top-1/2 left-0 w-full h-px bg-border"></div>
                    
                    {/* Quadrant Labels */}
                    <div className="absolute top-3 left-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">Quick Wins</div>
                    <div className="absolute top-3 right-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60 text-right">Strategic Bets</div>
                    <div className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">Fill-ins</div>
                    <div className="absolute bottom-3 right-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60 text-right">Distractions</div>
                    
                    {/* Data Points - Quick Wins (top-left) - REWORKED: "Intake Fix" → "Conversion Unlock" */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="absolute left-[8%] top-[18%] flex items-center gap-1.5 cursor-pointer group">
                          <div className="w-3 h-3 rounded-full bg-primary transition-all group-hover:ring-4 group-hover:ring-primary/30"></div>
                          <span className="text-[11px] font-medium text-foreground">Conversion Unlock</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p className="text-sm">Simplify demo request flow. Highest ROI action.</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="absolute left-[8%] top-[30%] flex items-center gap-1.5 cursor-pointer group">
                          <div className="w-3 h-3 rounded-full bg-primary transition-all group-hover:ring-4 group-hover:ring-primary/30"></div>
                          <span className="text-[11px] font-medium text-foreground">Trust Injection</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p className="text-sm">Add client logos and testimonials.</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    {/* Strategic Bets (top-right) */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="absolute left-[54%] top-[18%] flex items-center gap-1.5 cursor-pointer group">
                          <div className="w-3 h-3 rounded-full bg-muted-foreground transition-all group-hover:ring-4 group-hover:ring-muted-foreground/30"></div>
                          <span className="text-[11px] font-medium text-foreground">Product Sandbox</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p className="text-sm">Interactive demo environment.</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="absolute left-[54%] top-[30%] flex items-center gap-1.5 cursor-pointer group">
                          <div className="w-3 h-3 rounded-full bg-muted-foreground transition-all group-hover:ring-4 group-hover:ring-muted-foreground/30"></div>
                          <span className="text-[11px] font-medium text-foreground">Outcome Narrative</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p className="text-sm">Reframe messaging to outcomes.</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="absolute left-[54%] top-[42%] flex items-center gap-1.5 cursor-pointer group">
                          <div className="w-3 h-3 rounded-full bg-muted-foreground transition-all group-hover:ring-4 group-hover:ring-muted-foreground/30"></div>
                          <span className="text-[11px] font-medium text-foreground">Verticalization</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p className="text-sm">Industry-specific landing pages.</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    {/* Fill-ins (bottom-left) - REWORKED: "Footer Cleanup" → "Brand Hygiene" */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="absolute left-[8%] top-[60%] flex items-center gap-1.5 cursor-pointer group">
                          <div className="w-3 h-3 rounded-full bg-muted-foreground/50 transition-all group-hover:ring-4 group-hover:ring-muted-foreground/20"></div>
                          <span className="text-[11px] font-medium text-muted-foreground">Brand Hygiene</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p className="text-sm">Minor polish. Low priority.</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    {/* Distractions (bottom-right) */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="absolute left-[54%] top-[60%] flex items-center gap-1.5 cursor-pointer group">
                          <div className="w-3 h-3 rounded-full bg-destructive transition-all group-hover:ring-4 group-hover:ring-destructive/30"></div>
                          <span className="text-[11px] font-medium text-foreground">Custom CMS</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p className="text-sm">Engineering distraction. Avoid.</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="absolute left-[54%] top-[70%] flex items-center gap-1.5 cursor-pointer group">
                          <div className="w-3 h-3 rounded-full bg-destructive transition-all group-hover:ring-4 group-hover:ring-destructive/30"></div>
                          <span className="text-[11px] font-medium text-foreground">Full Rebranding</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p className="text-sm">High cost, low immediate impact.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                    
                    {/* X-Axis Label */}
                    <div className="text-center mt-3 text-[10px] font-mono text-primary font-bold tracking-widest">
                      LOW ← EFFORT → HIGH
                    </div>
                  </div>
                </div>
              </div>

              {/* Strategic Avoidance - Right side */}
              <div className="col-span-4 space-y-4">
                <div className="bg-muted/30 p-4 border-l-2 border-foreground">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Reading the Chart</div>
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-primary">Blue dots</strong> = prioritized actions. <strong className="text-foreground">Gray dots</strong> = strategic bets. <strong className="text-destructive">Red dots</strong> = distractions.
                  </p>
                </div>
                
                <div className="bg-muted/50 p-4 border-l-4 border-destructive">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-destructive mb-2">Strategic Avoidance</div>
                  <ul className="space-y-2 text-xs">
                    <li className="flex items-start gap-2">
                      <span className="text-destructive font-bold">×</span>
                      <span><strong className="text-foreground">Full Rebranding</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-destructive font-bold">×</span>
                      <span><strong className="text-foreground">Custom CMS Build</strong></span>
                    </li>
                  </ul>
                  <p className="text-[10px] text-muted-foreground mt-2">High effort, low yield. Protect capacity for leverage plays.</p>
                </div>
                
                <div className="p-4 bg-primary/5 border-l-2 border-primary">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-primary mb-1">Priority Sequence</div>
                  <p className="text-xs text-foreground">
                    Blue (immediate) → Gray (Q2) → Avoid Red entirely.
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
            <ActionTitle>Sustain: Changing the capability baseline.</ActionTitle>
            
            <div className="grid md:grid-cols-12 gap-6">
              <div className="col-span-9 grid md:grid-cols-3 gap-5">
                <div className="border border-border p-5 bg-muted/30">
                  <div className="font-mono text-xs text-primary mb-3">01. Product-Led Growth</div>
                  <div className="font-serif text-lg mb-2 text-foreground">From "Gatekeeper" to "Try First"</div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                    <strong className="text-foreground">The Move:</strong> Transition the primary CTA from a sales form to an interactive "Data Sandbox." Allow users to taste the speed of the AI before asking for marriage.
                  </p>
                  <div className="space-y-2 text-xs text-muted-foreground mb-3">
                    <div className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Build interactive demo environment</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Gate advanced features, not access</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Capture intent data from usage</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <div className="flex justify-between items-center">
                      <div className="font-mono text-[10px] text-primary uppercase">Matches market velocity</div>
                      <div className="font-mono text-[9px] text-muted-foreground">60 days</div>
                    </div>
                  </div>
                </div>

                <div className="border border-border p-5 bg-muted/30">
                  <div className="font-mono text-xs text-primary mb-3">02. Verticalization</div>
                  <div className="font-serif text-lg mb-2 text-foreground">From "Generic" to "Industry Expert"</div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                    <strong className="text-foreground">The Move:</strong> Build dedicated landing pages for "CPG," "Finance," and "Tech." Address the "Audience Alignment" gap by speaking specific dialects.
                  </p>
                  <div className="space-y-2 text-xs text-muted-foreground mb-3">
                    <div className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>3 vertical pages with unique copy</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Industry-specific case studies</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Tailored ROI calculators</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <div className="flex justify-between items-center">
                      <div className="font-mono text-[10px] text-primary uppercase">Increases relevance score</div>
                      <div className="font-mono text-[9px] text-muted-foreground">45 days</div>
                    </div>
                  </div>
                </div>

                <div className="border border-border p-5 bg-muted/30">
                  <div className="font-mono text-xs text-primary mb-3">03. AI Discoverability</div>
                  <div className="font-serif text-lg mb-2 text-foreground">From "Invisible" to "Referenced"</div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                    <strong className="text-foreground">The Move:</strong> Implement structured schema markup and publish "State of AI Insights" data. Train LLMs to cite Rubiklab as the authority.
                  </p>
                  <div className="space-y-2 text-xs text-muted-foreground mb-3">
                    <div className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Schema.org markup on all pages</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Quarterly industry benchmark reports</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Thought leadership content</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <div className="flex justify-between items-center">
                      <div className="font-mono text-[10px] text-primary uppercase">Secures future discovery</div>
                      <div className="font-mono text-[9px] text-muted-foreground">30 days</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-span-3 space-y-4">
                <div className="bg-muted/30 p-4 border-l-2 border-foreground">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Investment Horizon</div>
                  <div className="font-serif text-3xl text-foreground mb-1">Q2-Q3</div>
                  <p className="text-xs text-muted-foreground">These are 60-90 day builds requiring dedicated resources.</p>
                </div>
                
                <div className="p-4 bg-primary/5 border-l-2 border-primary">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-primary mb-1">Sequencing</div>
                  <p className="text-xs text-foreground">
                    Sandbox first (differentiator). Verticals second (relevance). Schema third (durability).
                  </p>
                </div>
                
                <div className="bg-muted/30 p-4 border-l-2 border-foreground">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Resource Estimate</div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sandbox</span>
                      <span className="text-foreground font-medium">2-3 FTE months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Verticals</span>
                      <span className="text-foreground font-medium">1 FTE month</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Schema</span>
                      <span className="text-foreground font-medium">0.5 FTE month</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-primary/10 p-4 border-l-2 border-primary">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-primary mb-2">Expected Outcome</div>
                  <div className="font-serif text-xl text-primary mb-1">3× Pipeline</div>
                  <p className="text-xs text-muted-foreground">Projected increase in qualified leads by Q4.</p>
                </div>
              </div>
            </div>
          </div>
        </Slide>

        {/* Slide 24: Governance Signals */}
        <Slide>
          <div className="max-w-7xl w-full h-full flex flex-col">
            <SlideEyebrow>Governance Signals</SlideEyebrow>
            <ActionTitle>How to judge progress without vanity metrics.</ActionTitle>
            
            <div className="grid md:grid-cols-12 gap-6">
              <div className="col-span-9">
                <p className="text-sm text-muted-foreground max-w-3xl mb-5">
                  Successful transformation requires tracking signals, not just metrics. These qualitative indicators reveal whether you are building authority or just optimizing activity.
                </p>
                
                <div className="space-y-0">
                  <div className="grid grid-cols-12 gap-4 py-4 border-t-2 border-foreground">
                    <div className="col-span-3">
                      <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-1">01. Clarity Signal</div>
                      <div className="font-serif text-lg text-foreground">The Sales Conversation</div>
                    </div>
                    <div className="col-span-4 bg-muted/30 p-3">
                      <div className="font-mono text-[9px] text-primary uppercase mb-1">Success State</div>
                      <p className="text-xs text-muted-foreground">Prospects ask "How does implementation work?" (They already understand 'What' it is).</p>
                    </div>
                    <div className="col-span-4 bg-destructive/5 p-3">
                      <div className="font-mono text-[9px] text-destructive uppercase mb-1">Red Flag</div>
                      <p className="text-xs text-muted-foreground">Sales team spends first 15 mins explaining the product definition.</p>
                    </div>
                    <div className="col-span-1 flex items-center justify-center">
                      <div className="font-mono text-[9px] text-muted-foreground">Weekly</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-4 py-4 border-t border-border">
                    <div className="col-span-3">
                      <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-1">02. Efficiency Signal</div>
                      <div className="font-serif text-lg text-foreground">Velocity Ratio</div>
                    </div>
                    <div className="col-span-4 bg-muted/30 p-3">
                      <div className="font-mono text-[9px] text-primary uppercase mb-1">Success State</div>
                      <p className="text-xs text-muted-foreground">The gap between 'Landing' and 'Inquiry' compresses to under 60 seconds.</p>
                    </div>
                    <div className="col-span-4 bg-destructive/5 p-3">
                      <div className="font-mono text-[9px] text-destructive uppercase mb-1">Red Flag</div>
                      <p className="text-xs text-muted-foreground">High time-on-site but low conversion (Analysis Paralysis).</p>
                    </div>
                    <div className="col-span-1 flex items-center justify-center">
                      <div className="font-mono text-[9px] text-muted-foreground">Daily</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-4 py-4 border-t border-b border-border">
                    <div className="col-span-3">
                      <div className="font-mono text-[10px] text-primary uppercase tracking-widest mb-1">03. Authority Signal</div>
                      <div className="font-serif text-lg text-foreground">Comparison Set</div>
                    </div>
                    <div className="col-span-4 bg-muted/30 p-3">
                      <div className="font-mono text-[9px] text-primary uppercase mb-1">Success State</div>
                      <p className="text-xs text-muted-foreground">Buyers compare you to premium consultants or enterprise suites.</p>
                    </div>
                    <div className="col-span-4 bg-destructive/5 p-3">
                      <div className="font-mono text-[9px] text-destructive uppercase mb-1">Red Flag</div>
                      <p className="text-xs text-muted-foreground">Buyers compare you to $50/mo self-serve tools.</p>
                    </div>
                    <div className="col-span-1 flex items-center justify-center">
                      <div className="font-mono text-[9px] text-muted-foreground">Monthly</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-span-3 space-y-4">
                <div className="bg-muted/30 p-4 border-l-2 border-foreground">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Review Cadence</div>
                  <div className="font-serif text-3xl text-foreground mb-1">Bi-Weekly</div>
                  <p className="text-xs text-muted-foreground">Qualitative signals should be reviewed in sales standups.</p>
                </div>
                
                <div className="p-4 bg-primary/5 border-l-2 border-primary">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-primary mb-1">Key Principle</div>
                  <p className="text-xs text-foreground">
                    If conversion rises but comparison set degrades, you are winning the wrong race.
                  </p>
                </div>
                
                <div className="bg-muted/30 p-4 border-l-2 border-foreground">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Tracking Method</div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quantitative</span>
                      <span className="text-foreground">GA4 / HubSpot</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Qualitative</span>
                      <span className="text-foreground">Sales Feedback</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Perception</span>
                      <span className="text-foreground">Win/Loss Analysis</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-primary/10 p-4 border-l-2 border-primary">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-primary mb-1">Dashboard</div>
                  <p className="text-xs text-foreground">
                    Create a shared Signal Board for cross-functional visibility.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Slide>

        {/* Slide 25: Closing Statement */}
        <Slide>
          <div className="max-w-7xl w-full h-full flex flex-col">
            <div className="grid md:grid-cols-12 gap-8 h-full">
              {/* Left side - main message */}
              <div className="col-span-8 flex flex-col justify-center">
                <div className="w-16 h-[2px] bg-primary mb-8" />
                
                <h2 className="font-serif text-5xl lg:text-6xl text-foreground mb-6 leading-tight">
                  Where complexity ends,<br/> <span className="italic text-primary">authority begins.</span>
                </h2>
                
                <p className="font-sans text-muted-foreground text-base font-light leading-relaxed max-w-xl mb-8">
                  This assessment is not an indictment of capability; it is a roadmap to recognition. The market is waiting for a high-fidelity leader. Rubiklab is positioned to take that mantle, if it chooses to speak clearly.
                </p>
                
                {/* Next Steps Timeline */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                  <div className="p-4 bg-primary/5 border-l-4 border-primary">
                    <div className="font-mono text-[9px] uppercase tracking-widest text-primary mb-1">Week 1</div>
                    <div className="text-sm text-foreground font-medium">Intake Reduction</div>
                    <div className="text-xs text-muted-foreground mt-1">8 → 3 fields</div>
                  </div>
                  <div className="p-4 bg-muted/30 border-l-4 border-foreground">
                    <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mb-1">Week 2</div>
                    <div className="text-sm text-foreground font-medium">Trust Strip</div>
                    <div className="text-xs text-muted-foreground mt-1">Logos + ratings</div>
                  </div>
                  <div className="p-4 bg-muted/30 border-l-4 border-foreground">
                    <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mb-1">Week 3</div>
                    <div className="text-sm text-foreground font-medium">CTA Contrast</div>
                    <div className="text-xs text-muted-foreground mt-1">Visual hierarchy</div>
                  </div>
                  <div className="p-4 bg-muted/30 border-l-4 border-foreground">
                    <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mb-1">Week 4</div>
                    <div className="text-sm text-foreground font-medium">A/B Testing</div>
                    <div className="text-xs text-muted-foreground mt-1">Headline variants</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-sm text-muted-foreground border-t border-border pt-6">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-1">Prepared By</div>
                    <div className="font-serif text-lg text-foreground">Mondro Intelligence</div>
                  </div>
                  <div className="w-px h-10 bg-border" />
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-1">Engagement</div>
                    <div className="font-serif text-lg text-foreground">Strategic Assessment</div>
                  </div>
                </div>
              </div>
              
              {/* Right side - summary card */}
              <div className="col-span-4 flex flex-col justify-center space-y-4">
                <div className="bg-muted/30 p-5 border-l-2 border-foreground">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">30-Day Impact</div>
                  <div className="font-serif text-3xl text-primary mb-2">+55%</div>
                  <p className="text-xs text-muted-foreground">Expected funnel efficiency improvement from quick wins alone.</p>
                </div>
                
                <div className="bg-muted/30 p-5 border-l-2 border-foreground">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">90-Day Target</div>
                  <div className="font-serif text-3xl text-foreground mb-2">Authority</div>
                  <p className="text-xs text-muted-foreground">Complete deployment of all three mandates: Friction, Narrative, Trust.</p>
                </div>
                
                <div className="p-5 bg-primary/5 border-l-2 border-primary">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-primary mb-2">Next Step</div>
                  <p className="text-sm text-foreground leading-relaxed">
                    Schedule implementation kickoff to align engineering and marketing on Week 1 deliverables.
                  </p>
                </div>
                
                <div className="flex items-center gap-2 text-foreground pt-4">
                  <span className="font-serif font-bold text-2xl tracking-tight lowercase">mondro</span>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-20"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.3)]"></span>
                  </span>
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

        {/* Appendix A: Immediate Priorities (moved from old Slide 06) */}
        <Slide>
          <div className="max-w-7xl w-full h-full flex flex-col">
            <SlideEyebrow>Appendix A: Immediate Priorities</SlideEyebrow>
            <ActionTitle>Granular analysis and immediate prioritization.</ActionTitle>
            
            <div className="grid md:grid-cols-12 gap-8">
              {/* Immediate Priorities */}
              <div className="col-span-5">
                <div className="font-mono text-xs uppercase tracking-widest text-primary mb-3">Immediate Priorities (Quick Wins)</div>
                
                <div className="space-y-3">
                  <div className="p-4 border border-border bg-muted/30">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-serif text-base text-foreground">1. Intake Form Reduction</h3>
                      <span className="font-mono text-[9px] text-primary bg-background border border-border px-1.5 py-0.5">HIGH IMPACT</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                      Reduce fields from 8 to 3 (Name, Work Email, Company). Enable browser autofill attributes.
                    </p>
                    <div className="flex items-center gap-3 border-t border-border pt-2">
                      <div className="font-mono text-[9px] text-muted-foreground/70 uppercase tracking-widest">Effort: <span className="text-foreground">Low</span></div>
                      <div className="font-mono text-[9px] text-muted-foreground/70 uppercase tracking-widest">Type: <span className="text-foreground">UX/Dev</span></div>
                    </div>
                  </div>
                  <div className="p-4 border border-border bg-muted/30">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-serif text-base text-foreground">2. Mobile Payload Fix</h3>
                      <span className="font-mono text-[9px] text-muted-foreground bg-background border border-border px-1.5 py-0.5">MED IMPACT</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                      Convert PNG assets to WebP/AVIF. Implement lazy loading for below-fold content to cut LCP by 1.2s.
                    </p>
                    <div className="flex items-center gap-3 border-t border-border pt-2">
                      <div className="font-mono text-[9px] text-muted-foreground/70 uppercase tracking-widest">Effort: <span className="text-foreground">Low</span></div>
                      <div className="font-mono text-[9px] text-muted-foreground/70 uppercase tracking-widest">Type: <span className="text-foreground">Tech</span></div>
                    </div>
                  </div>
                  <div className="p-4 border border-border bg-muted/30">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-serif text-base text-foreground">3. CTA Visibility</h3>
                      <span className="font-mono text-[9px] text-muted-foreground bg-background border border-border px-1.5 py-0.5">MED IMPACT</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                      Increase button contrast ratio. Add hover states with tactile feedback to drive click impulse.
                    </p>
                    <div className="flex items-center gap-3 border-t border-border pt-2">
                      <div className="font-mono text-[9px] text-muted-foreground/70 uppercase tracking-widest">Effort: <span className="text-foreground">Low</span></div>
                      <div className="font-mono text-[9px] text-muted-foreground/70 uppercase tracking-widest">Type: <span className="text-foreground">CSS</span></div>
                    </div>
                  </div>
                </div>
                <div className="text-[10px] text-muted-foreground/60 font-mono italic pt-3">
                  * Prioritizing low-effort technical debt removal creates immediate momentum.
                </div>
              </div>

              {/* Capability Heatmap */}
              <div className="col-span-7">
                <div className="font-mono text-xs uppercase tracking-widest text-primary mb-3">Capability Heatmap</div>
                <div>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground text-left pb-2 border-b-2 border-foreground" style={{ width: "18%" }}>Vector</th>
                        <th className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground text-left pb-2 border-b-2 border-foreground" style={{ width: "12%" }}>Maturity</th>
                        <th className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground text-left pb-2 border-b-2 border-foreground" style={{ width: "35%" }}>Observation</th>
                        <th className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground text-left pb-2 border-b-2 border-foreground" style={{ width: "35%" }}>Implication</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.heatmap.map((row) => (
                        <tr key={row.vector}>
                          <td className="py-3 border-b border-border text-xs text-foreground font-bold align-top">{row.vector}</td>
                          <td className="py-3 border-b border-border align-top"><MaturityBubble level={row.maturity as "full" | "half" | "quarter"} /></td>
                          <td className="py-3 border-b border-border text-xs text-muted-foreground align-top">{row.observation}</td>
                          <td className="py-3 border-b border-border text-xs text-muted-foreground align-top">{row.implication}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-3 flex gap-5 justify-start text-[9px] text-muted-foreground uppercase tracking-widest">
                  <div className="flex items-center gap-1.5"><div className="scale-75"><MaturityBubble level="full" /></div> Optimized</div>
                  <div className="flex items-center gap-1.5"><div className="scale-75"><MaturityBubble level="half" /></div> Developing</div>
                  <div className="flex items-center gap-1.5"><div className="scale-75"><MaturityBubble level="quarter" /></div> Critical</div>
                </div>
              </div>
            </div>
          </div>
        </Slide>

        {/* Appendix B: Technical Constraints (moved from old Slide 12) */}
        <Slide>
          <div className="max-w-7xl w-full h-full flex flex-col">
            <SlideEyebrow>Appendix B: Technical Constraints</SlideEyebrow>
            <ActionTitle>Cosmetic issues are degrading the perception of stability.</ActionTitle>
            
            <div className="grid md:grid-cols-12 gap-6">
              <div className="col-span-9 grid md:grid-cols-3 gap-5">
                {/* Vector 01 */}
                <div className="border border-border p-5 bg-muted/30">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-destructive mb-2">Vector 01</div>
                  <h3 className="font-serif text-xl mb-2">Mobile Latency</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                    High-resolution PNGs are unoptimized for 4G networks. This causes a 2.4s load delay on mobile devices.
                  </p>
                  <div className="pt-3 border-t border-border">
                    <span className="font-mono text-[10px] text-muted-foreground uppercase">Perception Impact</span>
                    <div className="text-sm font-medium mt-1">"The platform feels heavy."</div>
                  </div>
                </div>

                {/* Vector 02 */}
                <div className="border border-border p-5 bg-muted/30">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Vector 02</div>
                  <h3 className="font-serif text-xl mb-2">Cumulative Shift</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                    Font loading behaviors cause the navigation bar to "jump" 20px after initial paint.
                  </p>
                  <div className="pt-3 border-t border-border">
                    <span className="font-mono text-[10px] text-muted-foreground uppercase">Perception Impact</span>
                    <div className="text-sm font-medium mt-1">"The engineering is unpolished."</div>
                  </div>
                </div>

                {/* Vector 03 */}
                <div className="border border-border p-5 bg-muted/30">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Vector 03</div>
                  <h3 className="font-serif text-xl mb-2">Dead Ends</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                    Three sub-service pages resolve to 404 errors or empty templates.
                  </p>
                  <div className="pt-3 border-t border-border">
                    <span className="font-mono text-[10px] text-muted-foreground uppercase">Perception Impact</span>
                    <div className="text-sm font-medium mt-1">"Is this company active?"</div>
                  </div>
                </div>
              </div>
              
              <div className="col-span-3 space-y-4">
                <div className="bg-muted/30 p-5 border-l-2 border-foreground">
                  <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3">Composite Score</div>
                  <div className="font-serif text-4xl mb-2 text-foreground">45<span className="text-lg text-muted-foreground">/100</span></div>
                  <p className="text-xs text-muted-foreground">PageSpeed Mobile. Passing threshold is 90+.</p>
                </div>
                
                <div className="p-5 bg-primary/5 border-l-2 border-primary">
                  <div className="font-mono text-xs uppercase tracking-widest text-primary mb-2">Sprint Focus</div>
                  <ul className="text-xs text-foreground space-y-1.5">
                    <li>• Resolve 404 errors (Day 1)</li>
                    <li>• WebP conversion + lazy load (Day 2-3)</li>
                    <li>• Font-display swap (Day 4)</li>
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
            
            <div className="grid md:grid-cols-12 gap-6">
              <div className="col-span-9">
                <p className="text-sm text-muted-foreground max-w-3xl mb-5">
                  These actions correspond directly to the top-left quadrant of the leverage matrix. They are designed to be deployed within 30 days to create immediate lift.
                </p>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-primary/5 p-4 border-l-4 border-primary">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-primary mb-2">01. Friction</div>
                    <div className="font-serif text-lg mb-2 text-foreground">Intake Simplification</div>
                    <p className="text-xs text-muted-foreground mb-3">
                      <strong className="text-foreground">Action:</strong> Remove "Job Title" and "Phone" fields. Move qualification to the second step (post-click).
                    </p>
                    <div className="space-y-1 text-[10px] text-muted-foreground mb-3">
                      <div>→ Enable browser autofill</div>
                      <div>→ Add progress indicator</div>
                    </div>
                    <div className="pt-2 border-t border-primary/20">
                      <div className="font-mono text-[9px] text-muted-foreground uppercase">Impact</div>
                      <div className="text-sm font-bold text-primary">+40% Conversion</div>
                    </div>
                  </div>

                  <div className="bg-primary/5 p-4 border-l-4 border-primary">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-primary mb-2">02. Credibility</div>
                    <div className="font-serif text-lg mb-2 text-foreground">Trust Injection</div>
                    <p className="text-xs text-muted-foreground mb-3">
                      <strong className="text-foreground">Action:</strong> Aggregate G2/Capterra reviews and place a "Trust Strip" below the hero CTA.
                    </p>
                    <div className="space-y-1 text-[10px] text-muted-foreground mb-3">
                      <div>→ Add 3-4 client logos</div>
                      <div>→ Display star rating badge</div>
                    </div>
                    <div className="pt-2 border-t border-primary/20">
                      <div className="font-mono text-[9px] text-muted-foreground uppercase">Impact</div>
                      <div className="text-sm font-bold text-primary">-15% Bounce Rate</div>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 border-l-4 border-muted">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">03. Perception</div>
                    <div className="font-serif text-lg mb-2 text-foreground">Headline Refinement</div>
                    <p className="text-xs text-muted-foreground mb-3">
                      <strong className="text-foreground">Action:</strong> A/B test "Outcomes" (Speed/Accuracy) against current "Innovation" messaging.
                    </p>
                    <div className="space-y-1 text-[10px] text-muted-foreground mb-3">
                      <div>→ Test 3 headline variants</div>
                      <div>→ Measure time-to-scroll</div>
                    </div>
                    <div className="pt-2 border-t border-border">
                      <div className="font-mono text-[9px] text-muted-foreground uppercase">Impact</div>
                      <div className="text-sm font-bold text-muted-foreground">Relevance Signal</div>
                    </div>
                  </div>
                </div>
                
                {/* Additional context row */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-muted/30 p-3 border border-border">
                    <div className="font-mono text-[9px] text-muted-foreground uppercase mb-1">Owner</div>
                    <div className="text-sm text-foreground">Engineering + UX</div>
                  </div>
                  <div className="bg-muted/30 p-3 border border-border">
                    <div className="font-mono text-[9px] text-muted-foreground uppercase mb-1">Owner</div>
                    <div className="text-sm text-foreground">Marketing + Design</div>
                  </div>
                  <div className="bg-muted/30 p-3 border border-border">
                    <div className="font-mono text-[9px] text-muted-foreground uppercase mb-1">Owner</div>
                    <div className="text-sm text-foreground">Content + Analytics</div>
                  </div>
                </div>
              </div>
              
              <div className="col-span-3 space-y-4">
                <div className="bg-muted/30 p-4 border-l-2 border-foreground">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Total Timeline</div>
                  <div className="font-serif text-3xl text-foreground mb-1">30 Days</div>
                  <p className="text-xs text-muted-foreground">All three wins can be deployed in parallel.</p>
                </div>
                
                <div className="p-4 bg-primary/5 border-l-2 border-primary">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-primary mb-1">Combined ROI</div>
                  <p className="text-xs text-foreground">
                    Estimated +55% funnel efficiency before any strategic bets are deployed.
                  </p>
                </div>
                
                <div className="bg-muted/30 p-4 border-l-2 border-foreground">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Success Criteria</div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Form starts</span>
                      <span className="text-primary font-medium">+60%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Form completions</span>
                      <span className="text-primary font-medium">+40%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bounce rate</span>
                      <span className="text-primary font-medium">-15%</span>
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
