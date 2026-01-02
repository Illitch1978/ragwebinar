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

// Tabs removed - report shows as continuous scroll

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
      "w-screen h-screen flex-shrink-0 py-16 px-4 lg:px-10 relative flex flex-col justify-center items-center bg-background overflow-hidden",
      className
    )}
    data-slide="true"
  >
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

// Maturity bubble component - using SVG for PDF compatibility
const MaturityBubble = ({ level }: { level: "full" | "half" | "quarter" }) => {
  if (level === "full") {
    return <div className="w-3.5 h-3.5 rounded-full bg-foreground border border-foreground inline-block" />;
  }
  
  // Use SVG pie slices for half and quarter - works with html2canvas
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

      <div className="grid grid-cols-2 gap-32 pl-16 mt-24 max-w-4xl">
        <div>
          <span className="block font-mono text-[9px] text-gray-500 uppercase tracking-widest mb-3">Scope</span>
          <p className="font-sans text-sm text-gray-400 font-light leading-relaxed">
            {reportData.scope}
          </p>
        </div>
        <div>
          <span className="block font-mono text-[9px] text-gray-500 uppercase tracking-widest mb-3">Status</span>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: '#22c55e' }} />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: '#22c55e' }} />
            </span>
            <span className="font-sans text-sm text-gray-400 font-light">Analysis Complete</span>
          </div>
        </div>
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

// Section divider component
const SectionDivider = ({ 
  title, 
  subtitle, 
  align = 'left' 
}: { 
  title: React.ReactNode; 
  subtitle: React.ReactNode; 
  align?: 'left' | 'center' | 'right' | 'top'
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
    
    {/* Main content */}
    <div className={cn(
      "relative z-10 flex-grow flex flex-col",
      align === 'center' ? "justify-center items-center text-center -mt-20" : 
      align === 'right' ? "justify-start items-end text-right pt-16" : 
      align === 'top' ? "justify-start items-start pt-24" :
      "justify-end items-start"
    )}>
      {align === 'center' ? (
        <div className="flex flex-col items-center">
          {/* Vertical line for center */}
          <div className="w-[1px] h-12 bg-white mb-8" />
          <h2 className="font-serif text-7xl lg:text-8xl text-white mb-6 whitespace-nowrap">
            {title}<span className="text-[#0099E6]">.</span>
          </h2>
          <p className="font-sans text-xl text-gray-400 font-light leading-relaxed max-w-lg">
            {subtitle}
          </p>
        </div>
      ) : align === 'right' ? (
        <div className="text-right">
          {/* Horizontal line for right */}
          <div className="w-16 h-1 bg-[#0099E6] ml-auto mb-8" />
          <h2 className="font-serif text-7xl lg:text-8xl text-white mb-6 leading-[0.95]">
            {title}<span className="text-[#0099E6]">.</span>
          </h2>
          <p className="font-sans text-xl text-gray-400 font-light leading-relaxed">
            {subtitle}
          </p>
        </div>
      ) : align === 'top' ? (
        <div className="max-w-2xl">
          <div className="w-12 h-1 bg-white mb-8" />
          <h2 className="font-serif text-7xl lg:text-8xl text-white mb-6">
            {title}<span className="text-[#0099E6]">.</span>
          </h2>
          <p className="font-sans text-xl text-gray-400 font-light max-w-lg leading-relaxed">
            {subtitle}
          </p>
        </div>
      ) : (
        <div className="max-w-2xl">
          <div className="w-12 h-1 bg-white mb-8" />
          <h2 className="font-serif text-7xl lg:text-8xl text-white mb-6">
            {title}<span className="text-[#0099E6]">.</span>
          </h2>
          <p className="font-sans text-xl text-gray-400 font-light max-w-lg leading-relaxed">
            {subtitle}
          </p>
        </div>
      )}
    </div>
    
    {/* Footer with logo - same as cover page */}
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
  
  // Count total slides (will be calculated after render)
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

  // Create a divider canvas for PDF export - dark theme matching landing page
  const createDividerCanvas = async (title: string, subtitle: string): Promise<HTMLCanvasElement> => {
    const div = document.createElement('div');
    div.style.cssText = 'width:1920px;height:1080px;display:flex;flex-direction:column;justify-content:center;align-items:center;background:#1a1a1a;position:absolute;left:-9999px;';
    div.innerHTML = `
      <div style="text-align:center;position:relative;">
        <!-- Decorative line -->
        <div style="width:60px;height:1px;background:#0ea5e9;margin:0 auto 56px;"></div>
        
        <!-- Subtitle -->
        <div style="font-family:ui-monospace,monospace;font-size:14px;text-transform:uppercase;letter-spacing:0.4em;color:#0ea5e9;margin-bottom:32px;font-weight:500;">${subtitle}</div>
        
        <!-- Title -->
        <h2 style="font-family:Playfair Display,serif;font-size:140px;color:#ffffff;margin:0;font-weight:400;letter-spacing:-0.02em;font-style:italic;">${title}</h2>
        
        <!-- Decorative line -->
        <div style="width:60px;height:1px;background:#0ea5e9;margin:56px auto 0;"></div>
      </div>
    `;
    document.body.appendChild(div);
    const canvas = await html2canvas(div, { scale: 1.5, backgroundColor: "#1a1a1a", logging: false, width: 1920, height: 1080 });
    document.body.removeChild(div);
    return canvas;
  };

  const handleDownload = async () => {
    setIsExporting(true);
    setProgress(0);
    
    try {
      // Get all section containers
      const summarySection = document.querySelector('[data-section="summary"]');
      const diagnosisSection = document.querySelector('[data-section="diagnosis"]');
      const competitiveSection = document.querySelector('[data-section="competitive-context"]');
      const nextOrderSection = document.querySelector('[data-section="next-order-effects"]');
      
      // Temporarily show all sections
      const sections = [summarySection, diagnosisSection, competitiveSection, nextOrderSection];
      const originalDisplay: string[] = [];
      sections.forEach((section, i) => {
        if (section) {
          originalDisplay[i] = (section as HTMLElement).style.display;
          (section as HTMLElement).classList.remove('hidden');
          (section as HTMLElement).style.display = 'block';
        }
      });
      
      // Wait for DOM update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Collect slides by section
      const summarySlides = summarySection?.querySelectorAll('[data-slide]') || [];
      const diagnosisSlides = diagnosisSection?.querySelectorAll('[data-slide]') || [];
      const competitiveSlides = competitiveSection?.querySelectorAll('[data-slide]') || [];
      const nextOrderSlides = nextOrderSection?.querySelectorAll('[data-slide]') || [];
      
      const totalItems = summarySlides.length + diagnosisSlides.length + competitiveSlides.length + nextOrderSlides.length + 3; // +3 for dividers
      let currentItem = 0;
      
      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [1920, 1080] });
      
      // Helper to add slides - using JPEG at lower scale to reduce file size
      const captureSlide = async (slide: Element): Promise<string> => {
        const canvas = await html2canvas(slide as HTMLElement, {
          scale: 1.5, // Reduced from 2 for smaller file size
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
        });
        return canvas.toDataURL("image/jpeg", 0.85); // JPEG with 85% quality instead of PNG
      };
      
      const addSlides = async (slides: NodeListOf<Element> | Element[]) => {
        for (const slide of Array.from(slides)) {
          currentItem++;
          setProgress(Math.round((currentItem / totalItems) * 100));
          const imgData = await captureSlide(slide);
          pdf.addPage();
          pdf.addImage(imgData, "JPEG", 0, 0, 1920, 1080);
        }
      };
      
      // Summary slides (first page doesn't need addPage)
      for (let i = 0; i < summarySlides.length; i++) {
        currentItem++;
        setProgress(Math.round((currentItem / totalItems) * 100));
        const imgData = await captureSlide(summarySlides[i]);
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, 0, 1920, 1080);
      }
      
      // Diagnosis divider + slides
      if (diagnosisSlides.length > 0) {
        currentItem++;
        setProgress(Math.round((currentItem / totalItems) * 100));
        const dividerCanvas = await createDividerCanvas("Diagnosis", "Part Two");
        pdf.addPage();
        pdf.addImage(dividerCanvas.toDataURL("image/jpeg", 0.85), "JPEG", 0, 0, 1920, 1080);
        await addSlides(diagnosisSlides);
      }
      
      // Competitive Context divider + slides
      if (competitiveSlides.length > 0) {
        currentItem++;
        setProgress(Math.round((currentItem / totalItems) * 100));
        const dividerCanvas = await createDividerCanvas("Competitive Context", "Part Three");
        pdf.addPage();
        pdf.addImage(dividerCanvas.toDataURL("image/jpeg", 0.85), "JPEG", 0, 0, 1920, 1080);
        await addSlides(competitiveSlides);
      }
      
      // Next-Order Effects divider + slides
      if (nextOrderSlides.length > 0) {
        currentItem++;
        setProgress(Math.round((currentItem / totalItems) * 100));
        const dividerCanvas = await createDividerCanvas("Next-Order Effects", "Part Four");
        pdf.addPage();
        pdf.addImage(dividerCanvas.toDataURL("image/jpeg", 0.85), "JPEG", 0, 0, 1920, 1080);
        await addSlides(nextOrderSlides);
      }
      
      // Restore original visibility
      sections.forEach((section, i) => {
        if (section) {
          if (originalDisplay[i]) {
            (section as HTMLElement).style.display = originalDisplay[i];
          } else {
            (section as HTMLElement).style.display = '';
          }
        }
      });
      
      // Format filename: Mondro_report_ClientName_YYYY-MM-DD
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
        {/* Cover Page - Dark Theme */}
        <CoverSlide />
        
        {/* All slides in a horizontal row */}

          {/* Slide 02: Methodology */}
          <Slide>
            <div className="max-w-7xl w-full">
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
          <Slide>
            <div className="max-w-7xl w-full">
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
          <Slide>
            <div className="max-w-7xl w-full">
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
          <Slide>
            <div className="max-w-7xl w-full">
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
          <Slide>
            <div className="max-w-7xl w-full h-full flex flex-col">
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
          </Slide>

      {/* Diagnosis Section Divider */}
      <SectionDivider 
        title="Diagnosis" 
        subtitle="A systemic breakdown of friction, gaps, and lost revenue opportunities."
        align="top"
      />

      {/* Diagnosis Section */}
          {/* Slide 07: System-Level Diagnosis */}
          <Slide>
            <div className="max-w-7xl w-full h-full flex flex-col justify-center">
              <SlideEyebrow>System-Level Diagnosis</SlideEyebrow>
              <ActionTitle>The site functions as pages, but fails as a decision system.</ActionTitle>
              
              <div className="grid md:grid-cols-12 gap-16 mt-12">
                <div className="col-span-5 text-2xl leading-relaxed text-muted-foreground space-y-10">
                  <p>
                    A high-performing digital asset operates as an integrated system where clarity, logic, and flow compound to drive decisions.
                  </p>
                  <p>
                    Currently, Rubiklab.ai suffers from <strong className="text-foreground">Systemic Decay</strong>. While individual pages are visually polished, the connective tissue—the logic that moves a user from "Interest" to "Action"—is fractured.
                  </p>
                  <div className="pt-10 border-t border-border">
                    <div className="font-mono text-base uppercase tracking-widest text-muted-foreground mb-4">Composite Diagnostic</div>
                    <div className="font-serif text-5xl text-foreground">Fragmented</div>
                  </div>
                </div>

                <div className="col-span-7">
                  <div className="bg-muted/30 p-12 h-full flex flex-col justify-center">
                    <div className="font-mono text-base uppercase tracking-widest text-muted-foreground mb-10">Decision System Health Stack</div>
                    
                    <div className="space-y-6">
                      {/* Critical */}
                      <div className="border border-border p-8 flex justify-between items-center bg-background border-l-4 border-l-destructive">
                        <div>
                          <div className="font-serif text-2xl text-foreground">Conversion Logic</div>
                          <div className="text-base text-muted-foreground mt-2">Does the site ask for the right thing at the right time?</div>
                        </div>
                        <div className="font-mono text-sm text-destructive uppercase tracking-widest bg-destructive/10 px-4 py-2">Failing</div>
                      </div>

                      {/* Stable */}
                      <div className="border border-border p-8 flex justify-between items-center bg-background border-l-4 border-l-muted-foreground/30">
                        <div>
                          <div className="font-serif text-2xl text-foreground">Information Hierarchy</div>
                          <div className="text-base text-muted-foreground mt-2">Is the most important information most visible?</div>
                        </div>
                        <div className="font-mono text-sm text-muted-foreground uppercase tracking-widest bg-muted px-4 py-2">Stable</div>
                      </div>

                      {/* Optimal */}
                      <div className="border border-border p-8 flex justify-between items-center bg-background border-l-4 border-l-primary">
                        <div>
                          <div className="font-serif text-2xl text-foreground">Visual Clarity</div>
                          <div className="text-base text-muted-foreground mt-2">Is the interface legible and professional?</div>
                        </div>
                        <div className="font-mono text-sm text-primary uppercase tracking-widest bg-primary/10 px-4 py-2">Optimized</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Slide>

          {/* Slide 08: Intake & Conversion */}
          <Slide>
            <div className="max-w-7xl w-full h-full flex flex-col justify-center">
              <SlideEyebrow>Intake & Conversion</SlideEyebrow>
              <ActionTitle>Motivated users are stalling at the point of highest intent.</ActionTitle>
              
              <p className="text-2xl text-muted-foreground max-w-5xl mb-16">
                We mapped the high-intent user journey from "Solution Discovery" to "Inquiry." The data reveals a specific rupture in the intake sequence where effort exceeds motivation.
              </p>

              <div className="grid grid-cols-4 gap-6 w-full mt-10">
                {/* Step 1 */}
                <div className="border-t-2 border-border pt-8 relative">
                  <div className="absolute -top-[7px] left-0 w-3 h-3 rounded-full bg-border" />
                  <div className="font-mono text-base uppercase tracking-widest text-muted-foreground mb-4">01. Discovery</div>
                  <div className="font-serif text-3xl mb-4">Landing</div>
                  <p className="text-lg text-muted-foreground">User arrives via direct search. Intent is high.</p>
                </div>

                {/* Step 2 */}
                <div className="border-t-2 border-border pt-8 relative">
                  <div className="absolute -top-[7px] left-0 w-3 h-3 rounded-full bg-border" />
                  <div className="font-mono text-base uppercase tracking-widest text-muted-foreground mb-4">02. Consideration</div>
                  <div className="font-serif text-3xl mb-4">Solutions</div>
                  <p className="text-lg text-muted-foreground">Content consumption is healthy (2m 30s avg).</p>
                </div>

                {/* Step 3 - Friction */}
                <div className="border-t-2 border-destructive pt-8 relative">
                  <div className="absolute -top-[7px] left-0 w-3 h-3 rounded-full bg-destructive" />
                  <div className="font-mono text-base uppercase tracking-widest text-destructive mb-4">03. The Stall</div>
                  <div className="font-serif text-3xl mb-4 text-destructive">The Form</div>
                  <p className="text-lg text-muted-foreground mb-5">User is confronted with 8 mandatory fields including "Phone" and "Job Title".</p>
                  <div className="bg-destructive/10 text-destructive text-sm uppercase tracking-widest px-4 py-2 inline-block font-mono">65% Drop-off</div>
                </div>

                {/* Step 4 */}
                <div className="border-t-2 border-border pt-8 relative">
                  <div className="absolute -top-[7px] left-0 w-3 h-3 rounded-full bg-border" />
                  <div className="font-mono text-base uppercase tracking-widest text-muted-foreground mb-4">04. Goal</div>
                  <div className="font-serif text-3xl mb-4 text-muted-foreground/60">Confirmation</div>
                  <p className="text-lg text-muted-foreground">Only 5% of click-throughs complete the sequence.</p>
                </div>
              </div>

              <div className="mt-20 border-t border-border pt-10 flex gap-12">
                <div className="font-mono text-base uppercase tracking-widest text-primary">Diagnosis</div>
                <div className="text-xl text-muted-foreground max-w-3xl">
                  The friction is artificial. By demanding data enrichment fields (Job Title, Phone) before establishing value, you are actively repelling qualified leads.
                </div>
              </div>
            </div>
          </Slide>

          {/* Slide 09: Narrative Positioning */}
          <Slide>
            <div className="max-w-7xl w-full h-full flex flex-col justify-center">
              <SlideEyebrow>Narrative Positioning</SlideEyebrow>
              <ActionTitle>The "Process vs. Outcome" disconnect.</ActionTitle>
              
              <div className="grid md:grid-cols-2 gap-16 mt-16">
                <div className="text-2xl leading-relaxed text-muted-foreground space-y-10">
                  <p>
                    Your internal teams understand the nuance of your technology ("Human-in-the-loop AI"). However, this nuance is lost in translation.
                  </p>
                  <p>
                    The website currently explains <em>how</em> the sausage is made, rather than <em>why</em> it tastes good. This alienates the executive buyer who is purchasing velocity and accuracy, not algorithms.
                  </p>
                  <div className="pt-10 border-t border-border">
                    <div className="font-mono text-base uppercase tracking-widest text-primary mb-4">Prescription</div>
                    <p className="text-xl text-foreground leading-relaxed">
                      Reframe the narrative from capability description to outcome articulation. Lead with the business impact—faster decisions, reduced risk, measurable ROI—and relegate technical methodology to a secondary "How it Works" section for those who seek validation.
                    </p>
                  </div>
                </div>

                <div className="border border-border">
                  <div className="grid grid-cols-2">
                    <div className="p-6 border-b border-r border-border bg-muted/30">
                      <span className="font-mono text-base uppercase tracking-widest text-muted-foreground">Intended Message</span>
                    </div>
                    <div className="p-6 border-b border-border bg-muted/30">
                      <span className="font-mono text-base uppercase tracking-widest text-primary">Received Reality</span>
                    </div>

                    <div className="p-10 border-b border-r border-border">
                      <div className="font-serif text-2xl">"We Innovate"</div>
                      <div className="text-base text-muted-foreground/70 mt-3">Generic Aspiration</div>
                    </div>
                    <div className="p-10 border-b border-border">
                      <div className="font-serif text-2xl text-muted-foreground">"What do you actually do?"</div>
                      <div className="text-base text-destructive mt-3">Confusion</div>
                    </div>

                    <div className="p-10 border-b border-r border-border">
                      <div className="font-serif text-2xl">"Semantic Search"</div>
                      <div className="text-base text-muted-foreground/70 mt-3">Technical Feature</div>
                    </div>
                    <div className="p-10 border-b border-border">
                      <div className="font-serif text-2xl text-muted-foreground">"Is this for developers?"</div>
                      <div className="text-base text-destructive mt-3">Misalignment</div>
                    </div>

                    <div className="p-10 border-r border-border">
                      <div className="font-serif text-2xl">"Hybrid AI Model"</div>
                      <div className="text-base text-muted-foreground/70 mt-3">Differentiation</div>
                    </div>
                    <div className="p-10">
                      <div className="font-serif text-2xl text-muted-foreground">"Sounds expensive/slow."</div>
                      <div className="text-base text-destructive mt-3">Friction</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Slide>

          {/* Slide 10: Trust Architecture */}
          <Slide>
            <div className="max-w-7xl w-full h-full flex flex-col justify-center">
              <SlideEyebrow>Trust Architecture</SlideEyebrow>
              <ActionTitle>Credibility is currently implicit, rather than explicit.</ActionTitle>
              
              <p className="text-2xl text-muted-foreground max-w-5xl mb-16">
                In high-value B2B transactions, trust must be established before logic can be applied. Your current architecture asks the user to "trust the code" without providing the necessary social and institutional signals.
              </p>

              <div className="w-full">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="font-mono text-base uppercase tracking-widest text-muted-foreground pb-6 border-b-2 border-foreground" style={{ width: "25%" }}>Signal Category</th>
                      <th className="font-mono text-base uppercase tracking-widest text-muted-foreground pb-6 border-b-2 border-foreground" style={{ width: "20%" }}>Status</th>
                      <th className="font-mono text-base uppercase tracking-widest text-muted-foreground pb-6 border-b-2 border-foreground" style={{ width: "55%" }}>Audit Finding</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-8 border-b border-border font-serif text-2xl">Social Proof</td>
                      <td className="py-8 border-b border-border">
                        <span className="font-mono text-sm text-destructive bg-destructive/10 px-4 py-2 uppercase tracking-widest">Absent</span>
                      </td>
                      <td className="py-8 border-b border-border text-lg text-muted-foreground">
                        Zero client logos, case study snapshots, or testimonials on the homepage. The site feels "empty" of customers.
                      </td>
                    </tr>
                    <tr>
                      <td className="py-8 border-b border-border font-serif text-2xl">Authority Cues</td>
                      <td className="py-8 border-b border-border">
                        <span className="font-mono text-sm text-muted-foreground bg-muted px-4 py-2 uppercase tracking-widest">Implicit</span>
                      </td>
                      <td className="py-8 border-b border-border text-lg text-muted-foreground">
                        Deep technical content implies expertise, but there are no "Badges of Honor" (Awards, Certifications, Partnerships).
                      </td>
                    </tr>
                    <tr>
                      <td className="py-8 border-b border-border font-serif text-2xl">Humanity</td>
                      <td className="py-8 border-b border-border">
                        <span className="font-mono text-sm text-destructive bg-destructive/10 px-4 py-2 uppercase tracking-widest">Critical Gap</span>
                      </td>
                      <td className="py-8 border-b border-border text-lg text-muted-foreground">
                        No "Team" page. No faces. In a "Human-in-the-loop" service, the absence of humans is a paradox.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Slide>

          {/* Slide 11: Technical Constraints */}
          <Slide>
            <div className="max-w-7xl w-full h-full flex flex-col justify-center">
              <SlideEyebrow>Technical Constraints</SlideEyebrow>
              <ActionTitle>Cosmetic issues are degrading the perception of stability.</ActionTitle>
              
              <div className="grid md:grid-cols-3 gap-10 mt-16">
                {/* Vector 01 */}
                <div className="border border-border p-12 bg-muted/30 flex flex-col justify-between h-full">
                  <div>
                    <div className="font-mono text-base uppercase tracking-widest text-destructive mb-6">Vector 01</div>
                    <h3 className="font-serif text-4xl mb-6">Mobile Latency</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      High-resolution PNGs are unoptimized for 4G networks. This causes a 2.4s load delay on mobile devices.
                    </p>
                  </div>
                  <div className="mt-12 pt-6 border-t border-border">
                    <span className="font-mono text-sm text-muted-foreground uppercase">Perception Impact</span>
                    <div className="text-lg font-medium mt-3">"The platform feels heavy."</div>
                  </div>
                </div>

                {/* Vector 02 */}
                <div className="border border-border p-12 bg-muted/30 flex flex-col justify-between h-full">
                  <div>
                    <div className="font-mono text-base uppercase tracking-widest text-muted-foreground mb-6">Vector 02</div>
                    <h3 className="font-serif text-4xl mb-6">Cumulative Shift</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Font loading behaviors cause the navigation bar to "jump" 20px after initial paint.
                    </p>
                  </div>
                  <div className="mt-12 pt-6 border-t border-border">
                    <span className="font-mono text-sm text-muted-foreground uppercase">Perception Impact</span>
                    <div className="text-lg font-medium mt-3">"The engineering is unpolished."</div>
                  </div>
                </div>

                {/* Vector 03 */}
                <div className="border border-border p-12 bg-muted/30 flex flex-col justify-between h-full">
                  <div>
                    <div className="font-mono text-base uppercase tracking-widest text-muted-foreground mb-6">Vector 03</div>
                    <h3 className="font-serif text-4xl mb-6">Dead Ends</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Three sub-service pages resolve to 404 errors or empty templates.
                    </p>
                  </div>
                  <div className="mt-12 pt-6 border-t border-border">
                    <span className="font-mono text-sm text-muted-foreground uppercase">Perception Impact</span>
                    <div className="text-lg font-medium mt-3">"Is this company active?"</div>
                  </div>
                </div>
              </div>

              <div className="mt-16 border-t border-border pt-10 flex gap-12">
                <div className="font-mono text-base uppercase tracking-widest text-primary">Recommended Action</div>
                <div className="text-xl text-muted-foreground max-w-4xl">
                  Prioritize a focused technical sprint addressing these three vectors. Resolve 404 errors immediately, implement WebP image conversion with lazy loading, and apply font-display swap to eliminate layout shift—achievable within a single development cycle.
                </div>
              </div>
            </div>
          </Slide>

          {/* Slide 12: Diagnosis Summary */}
          <Slide>
            <div className="max-w-7xl w-full h-full flex flex-col justify-center">
              <SlideEyebrow>Diagnosis Summary</SlideEyebrow>
              <ActionTitle className="mb-16">Three dominant forces are actively suppressing revenue.</ActionTitle>
              
              <div className="space-y-0">
                {/* Item 01 */}
                <div className="grid grid-cols-12 py-12 border-t-2 border-foreground items-center group hover:bg-muted/30 transition-colors">
                  <div className="col-span-1 font-mono text-lg text-muted-foreground">01</div>
                  <div className="col-span-8">
                    <div className="font-serif text-5xl mb-4 text-foreground">Artificial Friction</div>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                      The intake form structure prioritizes data enrichment over user acquisition, causing a 65% drop-off at the moment of highest intent.
                    </p>
                  </div>
                  <div className="col-span-3 text-right">
                    <span className="font-mono text-sm uppercase tracking-widest text-destructive border border-destructive/30 px-5 py-2.5">Critical Impact</span>
                  </div>
                </div>

                {/* Item 02 */}
                <div className="grid grid-cols-12 py-12 border-t border-border items-center group hover:bg-muted/30 transition-colors">
                  <div className="col-span-1 font-mono text-lg text-muted-foreground">02</div>
                  <div className="col-span-8">
                    <div className="font-serif text-5xl mb-4 text-foreground">Narrative Obscurity</div>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                      Messaging focuses on technical processes rather than business outcomes, reducing resonance with C-Suite decision makers.
                    </p>
                  </div>
                  <div className="col-span-3 text-right">
                    <span className="font-mono text-sm uppercase tracking-widest text-muted-foreground border border-border px-5 py-2.5">High Impact</span>
                  </div>
                </div>

                {/* Item 03 */}
                <div className="grid grid-cols-12 py-12 border-t border-b border-border items-center group hover:bg-muted/30 transition-colors">
                  <div className="col-span-1 font-mono text-lg text-muted-foreground">03</div>
                  <div className="col-span-8">
                    <div className="font-serif text-5xl mb-4 text-foreground">Trust Deficit</div>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                      The absence of explicit social proof and human elements forces users to "guess" at credibility, lengthening the sales cycle.
                    </p>
                  </div>
                  <div className="col-span-3 text-right">
                    <span className="font-mono text-sm uppercase tracking-widest text-muted-foreground border border-border px-5 py-2.5">High Impact</span>
                  </div>
                </div>
              </div>
            </div>
          </Slide>

      {/* Market Context Section Divider */}
      <SectionDivider 
        title="Market Context" 
        subtitle="Contextualizing internal performance against external competitive reality."
        align="center"
      />

      {/* Competitive Context Section */}
          {/* Slide 13: The Competitive Reality */}
          <Slide>
            <div className="max-w-7xl w-full h-full flex flex-col justify-center">
              <SlideEyebrow>The Competitive Reality</SlideEyebrow>
              <ActionTitle>The category has split into "Legacy Trust" and "AI Velocity".</ActionTitle>
              
              <div className="grid md:grid-cols-12 gap-16 mt-8">
                <div className="col-span-6 text-xl leading-relaxed text-muted-foreground space-y-8">
                  <p className="text-2xl text-foreground">
                    You are not just competing against other research tools. You are competing against the "Good Enough" economy of generalist AI (ChatGPT) and the entrenched inertia of legacy agencies.
                  </p>
                  <p className="text-lg">
                    Attention in the sector has concentrated around two poles:
                    <br/>1. <strong className="text-foreground">Reliability:</strong> Old-guard players adding AI wrappers to protect their moat.
                    <br/>2. <strong className="text-foreground">Speed:</strong> Product-led disruptors selling "insights in minutes."
                  </p>
                  <div className="pt-8 mt-4 border-t border-border">
                    <div className="font-mono text-base uppercase tracking-widest text-muted-foreground mb-4">The Rubiklab Position</div>
                    <div className="font-serif text-2xl italic text-muted-foreground">
                      "Stuck in the middle." Technically superior to the disruptors, but narratively quieter than the legacy players.
                    </div>
                  </div>
                </div>

                <div className="col-span-6">
                  <div className="bg-muted/30 p-12 h-full flex flex-col justify-center border-l-2 border-foreground">
                    <div className="font-mono text-base uppercase tracking-widest text-muted-foreground mb-8">Buyer Decision Criteria</div>
                    
                    <ul className="space-y-8">
                      <li className="flex justify-between items-center pb-6 border-b border-border">
                        <span className="font-serif text-2xl">Speed to Insight</span>
                        <span className="font-mono text-sm text-primary uppercase tracking-widest">Dominant Factor</span>
                      </li>
                      <li className="flex justify-between items-center pb-6 border-b border-border">
                        <span className="font-serif text-2xl">Methodology Trust</span>
                        <span className="font-mono text-sm text-muted-foreground uppercase tracking-widest">Hygiene Factor</span>
                      </li>
                      <li className="flex justify-between items-center pb-6 border-b border-border">
                        <span className="font-serif text-2xl">Platform vs Service</span>
                        <span className="font-mono text-sm text-muted-foreground uppercase tracking-widest">Platform Preferred</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Slide>

          {/* Slide 14: Peer Positioning Snapshot */}
          <Slide>
            <div className="max-w-7xl w-full h-full flex flex-col justify-center">
              <SlideEyebrow>Peer Positioning Snapshot</SlideEyebrow>
              <ActionTitle>High authority on "Tech", invisible on "Trust".</ActionTitle>
              
              <p className="text-xl text-muted-foreground max-w-4xl mb-12">
                We benchmarked Rubiklab against three market archetypes: The Legacy Incumbent (e.g., Qualtrics), The Speed Disruptor (e.g., Yabble), and The Low-End Synthetic.
              </p>

              <div className="w-full max-w-5xl mt-8 space-y-6">
                
                {/* Proposition Clarity */}
                <div className="bg-card border border-border p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-amber-500 rounded-full" />
                    <span className="font-mono text-sm text-foreground uppercase tracking-widest">Proposition Clarity</span>
                  </div>
                  <div className="flex justify-between font-mono text-xs text-muted-foreground mb-4 uppercase tracking-wider px-1">
                    <span>Obscure</span>
                    <span>Crystal Clear</span>
                  </div>
                  <div className="relative h-12 flex items-center px-1">
                    <div className="w-full h-1 bg-muted rounded-full relative">
                      <div className="absolute w-3 h-3 rounded-full bg-muted-foreground/40 top-1/2 -translate-y-1/2" style={{ left: "80%" }}>
                        <span className="absolute top-5 left-1/2 -translate-x-1/2 font-mono text-xs text-muted-foreground uppercase whitespace-nowrap">Disruptor</span>
                      </div>
                      <div className="absolute w-3 h-3 rounded-full bg-muted-foreground/40 top-1/2 -translate-y-1/2" style={{ left: "60%" }}>
                        <span className="absolute top-5 left-1/2 -translate-x-1/2 font-mono text-xs text-muted-foreground uppercase whitespace-nowrap">Incumbent</span>
                      </div>
                      <div className="absolute w-4 h-4 rounded-full bg-amber-500 border-2 border-background shadow-[0_0_0_2px_rgb(245,158,11)] top-1/2 -translate-y-1/2" style={{ left: "30%" }}>
                        <span className="absolute top-6 left-1/2 -translate-x-1/2 font-mono text-xs text-amber-600 font-bold uppercase whitespace-nowrap">Rubiklab</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technical Authority */}
                <div className="bg-card border border-border p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-emerald-500 rounded-full" />
                    <span className="font-mono text-sm text-foreground uppercase tracking-widest">Technical Authority</span>
                  </div>
                  <div className="flex justify-between font-mono text-xs text-muted-foreground mb-4 uppercase tracking-wider px-1">
                    <span>Superficial</span>
                    <span>Deep Expertise</span>
                  </div>
                  <div className="relative h-12 flex items-center px-1">
                    <div className="w-full h-1 bg-muted rounded-full relative">
                      <div className="absolute w-4 h-4 rounded-full bg-emerald-500 border-2 border-background shadow-[0_0_0_2px_rgb(16,185,129)] top-1/2 -translate-y-1/2" style={{ left: "85%" }}>
                        <span className="absolute top-6 left-1/2 -translate-x-1/2 font-mono text-xs text-emerald-600 font-bold uppercase whitespace-nowrap">Rubiklab</span>
                      </div>
                      <div className="absolute w-3 h-3 rounded-full bg-muted-foreground/40 top-1/2 -translate-y-1/2" style={{ left: "70%" }}>
                        <span className="absolute top-5 left-1/2 -translate-x-1/2 font-mono text-xs text-muted-foreground uppercase whitespace-nowrap">Incumbent</span>
                      </div>
                      <div className="absolute w-3 h-3 rounded-full bg-muted-foreground/40 top-1/2 -translate-y-1/2" style={{ left: "40%" }}>
                        <span className="absolute top-5 left-1/2 -translate-x-1/2 font-mono text-xs text-muted-foreground uppercase whitespace-nowrap">Disruptor</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Market Presence */}
                <div className="bg-card border border-border p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-8 bg-rose-500 rounded-full" />
                    <span className="font-mono text-sm text-foreground uppercase tracking-widest">Market Presence</span>
                  </div>
                  <div className="flex justify-between font-mono text-xs text-muted-foreground mb-4 uppercase tracking-wider px-1">
                    <span>Invisible</span>
                    <span>Ubiquitous</span>
                  </div>
                  <div className="relative h-12 flex items-center px-1">
                    <div className="w-full h-1 bg-muted rounded-full relative">
                      <div className="absolute w-3 h-3 rounded-full bg-muted-foreground/40 top-1/2 -translate-y-1/2" style={{ left: "90%" }}>
                        <span className="absolute top-5 left-1/2 -translate-x-1/2 font-mono text-xs text-muted-foreground uppercase whitespace-nowrap">Incumbent</span>
                      </div>
                      <div className="absolute w-3 h-3 rounded-full bg-muted-foreground/40 top-1/2 -translate-y-1/2" style={{ left: "65%" }}>
                        <span className="absolute top-5 left-1/2 -translate-x-1/2 font-mono text-xs text-muted-foreground uppercase whitespace-nowrap">Disruptor</span>
                      </div>
                      <div className="absolute w-4 h-4 rounded-full bg-rose-500 border-2 border-background shadow-[0_0_0_2px_rgb(244,63,94)] top-1/2 -translate-y-1/2" style={{ left: "15%" }}>
                        <span className="absolute top-6 left-1/2 -translate-x-1/2 font-mono text-xs text-rose-600 font-bold uppercase whitespace-nowrap">Rubiklab</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </Slide>

          {/* Slide 15: Differentiation Signals */}
          <Slide>
            <div className="max-w-7xl w-full h-full flex flex-col justify-center">
              <SlideEyebrow>Differentiation Signals</SlideEyebrow>
              <ActionTitle>Winners are selling "Outcomes", not "Models".</ActionTitle>
              
              <div className="grid md:grid-cols-12 gap-16 mt-8">
                <div className="col-span-4 text-lg text-muted-foreground">
                  <p className="mb-8">
                    A clear pattern has emerged among high-growth peers. They have systematically scrubbed "AI Process" language from their headlines, replacing it with "Business Impact" language.
                  </p>
                  <div className="font-mono text-base text-muted-foreground uppercase tracking-widest mt-10">The Shift</div>
                  <div className="font-serif text-3xl mt-3 text-foreground">From "How" to "Why".</div>
                </div>

                <div className="col-span-8">
                  <div className="border-t border-border">
                    
                    {/* Signal Row 1 */}
                    <div className="grid grid-cols-2 border-b border-border py-8">
                      <div className="pr-10">
                        <div className="font-mono text-sm text-muted-foreground uppercase tracking-widest mb-3">Competitor Pattern</div>
                        <div className="font-serif text-2xl text-foreground">"Answers in Minutes"</div>
                        <div className="text-sm text-muted-foreground mt-2">Focus on time-to-value.</div>
                      </div>
                      <div className="pl-10 border-l border-border">
                        <div className="font-mono text-sm text-primary uppercase tracking-widest mb-3">Rubiklab Approach</div>
                        <div className="font-serif text-2xl text-muted-foreground">"Semantic Processing"</div>
                        <div className="text-sm text-destructive mt-2">Focus on technical method.</div>
                      </div>
                    </div>

                    {/* Signal Row 2 */}
                    <div className="grid grid-cols-2 border-b border-border py-8">
                      <div className="pr-10">
                        <div className="font-mono text-sm text-muted-foreground uppercase tracking-widest mb-3">Competitor Pattern</div>
                        <div className="font-serif text-2xl text-foreground">"Synthetic + Human"</div>
                        <div className="text-sm text-muted-foreground mt-2">Validating accuracy.</div>
                      </div>
                      <div className="pl-10 border-l border-border">
                        <div className="font-mono text-sm text-primary uppercase tracking-widest mb-3">Rubiklab Approach</div>
                        <div className="font-serif text-2xl text-muted-foreground">"AI Innovation"</div>
                        <div className="text-sm text-destructive mt-2">Generic buzzwords.</div>
                      </div>
                    </div>

                    {/* Signal Row 3 */}
                    <div className="grid grid-cols-2 border-b border-border py-8">
                      <div className="pr-10">
                        <div className="font-mono text-sm text-muted-foreground uppercase tracking-widest mb-3">Competitor Pattern</div>
                        <div className="font-serif text-2xl text-foreground">"Product Sandbox"</div>
                        <div className="text-sm text-muted-foreground mt-2">Show, don't tell.</div>
                      </div>
                      <div className="pl-10 border-l border-border">
                        <div className="font-mono text-sm text-primary uppercase tracking-widest mb-3">Rubiklab Approach</div>
                        <div className="font-serif text-2xl text-muted-foreground">"Book a Demo"</div>
                        <div className="text-sm text-destructive mt-2">Gatekeeping the value.</div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </Slide>

          {/* Slide 16: Visibility & Discoverability */}
          <Slide>
            <div className="max-w-7xl w-full h-full flex flex-col justify-center">
              <SlideEyebrow>Visibility & Discoverability</SlideEyebrow>
              <ActionTitle>Invisible to the new arbiters of trust.</ActionTitle>
              
              <p className="text-xl text-muted-foreground max-w-4xl mb-12">
                In 2025, visibility is not just about Google Rankings; it is about <strong className="text-foreground">Generative Presence</strong>. Does ChatGPT cite you as a leader? Currently, the answer is no.
              </p>

              <div className="grid md:grid-cols-2 gap-12 mt-8">
                
                <div className="border border-border p-10 bg-muted/30">
                  <div className="font-mono text-base uppercase tracking-widest text-muted-foreground mb-6">Search Engine Presence</div>
                  <div className="font-serif text-5xl mb-6 text-muted-foreground">Low-Tier</div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    You rank for your own brand name, but have near-zero visibility for high-intent non-branded terms like "AI Consumer Insights." You are relying entirely on outbound sales or paid acquisition.
                  </p>
                </div>

                <div className="border border-border p-10 bg-background border-l-4 border-l-destructive shadow-sm">
                  <div className="font-mono text-base uppercase tracking-widest text-primary mb-6">Generative AI Index</div>
                  <div className="font-serif text-5xl mb-6 text-foreground">Absent</div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    When LLMs (ChatGPT, Perplexity, Claude) are asked to "List top AI research tools," Rubiklab is consistently omitted. This is due to a lack of schema markup and authoritative backlinks.
                  </p>
                  <div className="mt-6 text-sm font-mono text-destructive uppercase tracking-widest">Critical Exposure</div>
                </div>

              </div>
            </div>
          </Slide>

          {/* Slide 17: Competitive Balance */}
          <Slide>
            <div className="max-w-7xl w-full h-full flex flex-col justify-center">
              <SlideEyebrow>Competitive Balance</SlideEyebrow>
              <ActionTitle>A defensible engine inside an indefensible fortress.</ActionTitle>
              
              <div className="grid md:grid-cols-2 h-[500px] border border-border mt-12">
                
                {/* Moat - Strength */}
                <div className="bg-muted/30 border-r border-border p-12 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <span className="font-mono text-sm uppercase tracking-widest text-primary">Relative Strength</span>
                    </div>
                    <h3 className="font-serif text-4xl mb-6 text-foreground">Technical Depth</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Unlike the "thin wrapper" competitors who rely solely on OpenAI APIs, Rubiklab possesses proprietary processing layers. This "Human-in-the-Loop" architecture is a genuine differentiator that delivers higher accuracy data.
                    </p>
                  </div>
                  <div className="mt-auto pt-8 border-t border-border">
                    <span className="font-mono text-xs uppercase text-muted-foreground tracking-widest">Verdict</span>
                    <div className="text-lg font-medium mt-2 text-foreground">The product is ready to win.</div>
                  </div>
                </div>

                {/* Flank - Exposure */}
                <div className="bg-background p-12 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-3 h-3 bg-destructive rounded-full"></div>
                      <span className="font-mono text-sm uppercase tracking-widest text-destructive">Market Exposure</span>
                    </div>
                    <h3 className="font-serif text-4xl mb-6 text-foreground">Commercial Silence</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Competitors are out-shouting you 10:1. Their websites promise specific ROI, feature client logos, and offer instant demos. Rubiklab's "Black Box" approach makes the superior technology feel riskier to buy.
                    </p>
                  </div>
                  <div className="mt-auto pt-8 border-t border-border">
                    <span className="font-mono text-xs uppercase text-muted-foreground tracking-widest">Verdict</span>
                    <div className="text-lg font-medium mt-2 text-destructive">The story is losing.</div>
                  </div>
                </div>

              </div>
            </div>
          </Slide>

          {/* Slide 18: Strategic Implications */}
          <Slide>
            <div className="max-w-7xl w-full h-full flex flex-col justify-center">
              <SlideEyebrow>Strategic Implications</SlideEyebrow>
              <ActionTitle>Inaction leads to commoditisation.</ActionTitle>
              
              <div className="grid md:grid-cols-3 gap-12 mt-16">
                
                <div>
                  <div className="text-6xl font-serif text-muted/50 mb-6">01</div>
                  <div className="border-t-2 border-foreground pt-6 mb-6"></div>
                  <h3 className="font-serif text-2xl mb-4 text-foreground">Erosion of Premium</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    If the "High Fidelity" advantage is not articulated clearly, buyers will default to price comparison. You risk being bucketed with cheap synthetic data tools.
                  </p>
                </div>

                <div>
                  <div className="text-6xl font-serif text-muted/50 mb-6">02</div>
                  <div className="border-t-2 border-foreground pt-6 mb-6"></div>
                  <h3 className="font-serif text-2xl mb-4 text-foreground">Compounding Invisibility</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Every month that passes without schema optimization and authoritative content publishing widens the gap in AI discoverability. Catching up becomes exponentially harder.
                  </p>
                </div>

                <div>
                  <div className="text-6xl font-serif text-muted/50 mb-6">03</div>
                  <div className="border-t-2 border-foreground pt-6 mb-6"></div>
                  <h3 className="font-serif text-2xl mb-4 text-foreground">The "Best Kept Secret" Trap</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Continuing to rely on product superiority without narrative support will result in lower-quality competitors capturing your rightful market share.
                  </p>
                </div>

              </div>
            </div>
          </Slide>

      {/* Next-Order Effects Section Divider */}
      <SectionDivider 
        title={<>Next-Order<br />Effects</>} 
        subtitle={<>The critical pivots required<br />to align digital reality with business ambition.</>}
        align="right"
      />

      {/* Next-Order Effects Section */}
          {/* Slide 19: Strategic Inflection */}
          <Slide>
            <div className="max-w-7xl w-full h-full flex flex-col justify-center">
              <SlideEyebrow>Strategic Inflection</SlideEyebrow>
              <ActionTitle>Inaction is an active decision to optimize for obscurity.</ActionTitle>
              
              <div className="grid md:grid-cols-2 gap-20 mt-12">
                <div className="text-lg text-muted-foreground space-y-8">
                  <p className="text-2xl font-light text-foreground">
                    The current digital state is not stable. It is <strong>diverging</strong> relative to market velocity.
                  </p>
                  <p>
                    Continuing with the current "feature-first" roadmap optimizes Rubiklab for technical validation, but fails to capture market share. In a category moving toward instant gratification and AI-discovery, silence is expensive.
                  </p>
                  
                  <div className="bg-primary/5 border-l-2 border-primary p-8 mt-4">
                    <p className="text-base text-foreground leading-relaxed">
                      <strong>The Pivot Window:</strong> The technology is ready, but market positioning is lagging. Closing this gap now requires a fundamental shift from 'building features' to 'building authority'. The cost of this shift doubles every quarter it is delayed.
                    </p>
                  </div>
                </div>

                <div className="border-l-2 border-foreground pl-12 flex flex-col justify-center">
                  <div className="mb-12">
                    <div className="font-mono text-sm uppercase tracking-widest text-muted-foreground mb-3">Path A: Status Quo</div>
                    <div className="font-serif text-3xl text-muted-foreground">Incremental Feature Release</div>
                    <p className="text-base text-muted-foreground mt-3">Result: Commoditisation by lower-cost synthetics.</p>
                  </div>
                  <div>
                    <div className="font-mono text-sm uppercase tracking-widest text-primary mb-3">Path B: Correction</div>
                    <div className="font-serif text-3xl text-primary">Authority & Flow Pivot</div>
                    <p className="text-base text-muted-foreground mt-3">Result: Pricing power and pipeline velocity.</p>
                  </div>
                </div>
              </div>
            </div>
          </Slide>

          {/* Slide 20: Focus Themes */}
          <Slide>
            <div className="max-w-7xl w-full h-full flex flex-col justify-center">
              <SlideEyebrow>Focus Themes</SlideEyebrow>
              <ActionTitle>Collapsing complexity into three mandates.</ActionTitle>
              
              <div className="grid md:grid-cols-3 gap-12 mt-16">
                <div className="border-t-2 border-foreground pt-8 h-full flex flex-col">
                  <div className="font-mono text-sm text-primary mb-5">01</div>
                  <h3 className="font-serif text-3xl mb-5 text-foreground">Friction Removal</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Systematically dismantling every barrier between user intent and value realization. This means radical simplification of intake.
                  </p>
                </div>
                <div className="border-t-2 border-foreground pt-8 h-full flex flex-col">
                  <div className="font-mono text-sm text-primary mb-5">02</div>
                  <h3 className="font-serif text-3xl mb-5 text-foreground">Narrative Authority</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Shifting the language layer from "Technical Process" (How it works) to "Executive Outcome" (Why it wins).
                  </p>
                </div>
                <div className="border-t-2 border-foreground pt-8 h-full flex flex-col">
                  <div className="font-mono text-sm text-primary mb-5">03</div>
                  <h3 className="font-serif text-3xl mb-5 text-foreground">Trust Visibility</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Moving credibility from "Implicit" (trust the code) to "Explicit" (trust the evidence, the team, and the partners).
                  </p>
                </div>
              </div>
            </div>
          </Slide>

          {/* Slide 21: Leverage & Allocation */}
          <Slide>
            <div className="max-w-[90rem] w-full h-full flex flex-col justify-center px-8">
              <SlideEyebrow>Leverage & Allocation</SlideEyebrow>
              <ActionTitle>Where effort produces disproportionate return.</ActionTitle>
              
              <div className="flex gap-16 mt-10 items-start">
                
                {/* Chart Area with Y-axis label */}
                <div className="flex items-center gap-3">
                  {/* Y-Axis Label - Outside, closer to chart */}
                  <div className="-rotate-90 text-[11px] font-mono text-primary font-bold tracking-widest whitespace-nowrap">
                    LOW ←— BUSINESS IMPACT —→ HIGH
                  </div>
                  
                  <div className="flex flex-col -ml-[90px]">
                    {/* Matrix Chart - Square */}
                    <div className="relative w-[560px] h-[560px] border border-border">
                      
                      {/* Quadrant Lines */}
                      <div className="absolute left-1/2 top-0 h-full w-px bg-border"></div>
                      <div className="absolute top-1/2 left-0 w-full h-px bg-border"></div>
                      
                      {/* Quadrant Labels */}
                      <div className="absolute top-4 left-4 font-mono text-[11px] uppercase tracking-widest text-muted-foreground font-bold">Quick Wins</div>
                      <div className="absolute top-4 right-4 font-mono text-[11px] uppercase tracking-widest text-muted-foreground font-bold text-right">Strategic Bets</div>
                      <div className="absolute bottom-4 left-4 font-mono text-[11px] uppercase tracking-widest text-muted-foreground font-bold">Fill-ins</div>
                      <div className="absolute bottom-4 right-4 font-mono text-[11px] uppercase tracking-widest text-muted-foreground font-bold text-right">Distractions</div>
                      
                      {/* Data Points with Tooltips - Spaced to avoid overlap */}
                      {/* Quick Wins Quadrant (top-left) */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="absolute left-[12%] top-[12%] flex items-center gap-3 cursor-pointer group">
                            <div className="w-5 h-5 rounded-full bg-primary transition-all group-hover:ring-4 group-hover:ring-primary/30"></div>
                            <span className="text-sm font-bold text-foreground">Intake Fix</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          <p className="text-sm">Simplify demo request flow from 5 clicks to 1. Highest ROI immediate action.</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="absolute left-[18%] top-[26%] flex items-center gap-3 cursor-pointer group">
                            <div className="w-5 h-5 rounded-full bg-primary transition-all group-hover:ring-4 group-hover:ring-primary/30"></div>
                            <span className="text-sm font-bold text-foreground">Trust Injection</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          <p className="text-sm">Add client logos, testimonials, and security badges to key conversion points.</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      {/* Strategic Bets Quadrant (top-right) */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="absolute left-[58%] top-[12%] flex items-center gap-3 cursor-pointer group">
                            <div className="w-5 h-5 rounded-full bg-muted-foreground transition-all group-hover:ring-4 group-hover:ring-muted-foreground/30"></div>
                            <span className="text-sm font-bold text-foreground">Product Sandbox</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          <p className="text-sm">Interactive demo environment showing real output quality. High effort, high reward.</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="absolute left-[55%] top-[26%] flex items-center gap-3 cursor-pointer group">
                            <div className="w-5 h-5 rounded-full bg-muted-foreground transition-all group-hover:ring-4 group-hover:ring-muted-foreground/30"></div>
                            <span className="text-sm font-bold text-foreground">Outcome Narrative</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          <p className="text-sm">Reframe messaging from "how it works" to "what you achieve."</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="absolute left-[60%] top-[40%] flex items-center gap-3 cursor-pointer group">
                            <div className="w-5 h-5 rounded-full bg-muted-foreground transition-all group-hover:ring-4 group-hover:ring-muted-foreground/30"></div>
                            <span className="text-sm font-bold text-foreground">Verticalization</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          <p className="text-sm">Industry-specific landing pages and case studies for top 3 verticals.</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      {/* Fill-ins Quadrant (bottom-left) */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="absolute left-[22%] top-[62%] flex items-center gap-3 cursor-pointer group">
                            <div className="w-5 h-5 rounded-full bg-muted-foreground/50 transition-all group-hover:ring-4 group-hover:ring-muted-foreground/20"></div>
                            <span className="text-sm font-bold text-muted-foreground">Footer Cleanup</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          <p className="text-sm">Minor cosmetic improvements. Low priority fill-in work.</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      {/* Distractions Quadrant (bottom-right) */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="absolute left-[58%] top-[62%] flex items-center gap-3 cursor-pointer group">
                            <div className="w-5 h-5 rounded-full bg-destructive transition-all group-hover:ring-4 group-hover:ring-destructive/30"></div>
                            <span className="text-sm font-bold text-foreground">Custom CMS</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          <p className="text-sm">Building bespoke content management. Engineering distraction from core product.</p>
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="absolute left-[62%] top-[76%] flex items-center gap-3 cursor-pointer group">
                            <div className="w-5 h-5 rounded-full bg-destructive transition-all group-hover:ring-4 group-hover:ring-destructive/30"></div>
                            <span className="text-sm font-bold text-foreground">Full Rebranding</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          <p className="text-sm">Complete visual identity overhaul. High cost, low immediate impact. Avoid.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    
                    {/* X-Axis Label - Outside */}
                    <div className="text-center mt-6 text-[11px] font-mono text-primary font-bold tracking-widest">
                      LOW ←— EFFORT / COMPLEXITY —→ HIGH
                    </div>
                  </div>
                </div>

                {/* Strategic Avoidance - Right side */}
                <div className="flex-shrink-0 w-[360px] flex flex-col justify-center">
                  <div className="bg-muted/50 p-10 border-l-4 border-destructive">
                    <div className="font-mono text-sm uppercase tracking-widest text-destructive mb-5">Strategic Avoidance</div>
                    <p className="text-base text-muted-foreground mb-8">
                      To protect capacity for high-leverage moves, we explicitly recommend <strong className="text-foreground">pausing</strong> these high-effort, low-yield initiatives:
                    </p>
                    <ul className="space-y-5 text-base">
                      <li className="flex items-start gap-4">
                        <span className="text-destructive font-bold text-xl">×</span>
                        <span><strong className="text-foreground">Full Rebranding:</strong> <span className="text-muted-foreground">Cosmetic changes without structural fixes will not improve conversion.</span></span>
                      </li>
                      <li className="flex items-start gap-4">
                        <span className="text-destructive font-bold text-xl">×</span>
                        <span><strong className="text-foreground">Custom CMS Build:</strong> <span className="text-muted-foreground">Migration consumes dev cycles better spent on the Product Sandbox.</span></span>
                      </li>
                    </ul>
                  </div>
                </div>

              </div>
            </div>
          </Slide>

          {/* Slide 22: Near-Term Value */}
          <Slide>
            <div className="max-w-7xl w-full h-full flex flex-col justify-center">
              <SlideEyebrow>Near-Term Value</SlideEyebrow>
              <ActionTitle>Momentum: Operationalizing the 'Quick Wins'.</ActionTitle>
              
              <p className="text-xl text-muted-foreground max-w-4xl mb-12">
                These actions correspond directly to the top-left quadrant of the leverage matrix. They are designed to be deployed within 30 days to create immediate lift.
              </p>

              <div className="grid md:grid-cols-3 gap-10">
                
                <div className="bg-primary/5 p-10 border-l-4 border-primary h-full flex flex-col">
                  <div className="font-mono text-sm uppercase tracking-widest text-primary mb-5">01. Friction</div>
                  <div className="font-serif text-2xl mb-5 text-foreground">Intake Simplification</div>
                  <p className="text-base text-muted-foreground mb-5 flex-grow">
                    <strong className="text-foreground">Action:</strong> Remove "Job Title" and "Phone" fields. Move qualification to the second step (post-click).
                  </p>
                  <div className="pt-5 border-t border-primary/20">
                    <div className="font-mono text-[11px] text-muted-foreground uppercase">Impact</div>
                    <div className="text-lg font-bold text-primary">+40% Conversion Vol.</div>
                  </div>
                </div>

                <div className="bg-primary/5 p-10 border-l-4 border-primary h-full flex flex-col">
                  <div className="font-mono text-sm uppercase tracking-widest text-primary mb-5">02. Credibility</div>
                  <div className="font-serif text-2xl mb-5 text-foreground">Trust Injection</div>
                  <p className="text-base text-muted-foreground mb-5 flex-grow">
                    <strong className="text-foreground">Action:</strong> Aggregate existing G2/Capterra reviews and place a "Trust Strip" immediately below the hero CTA. Do not hide proof in the footer.
                  </p>
                  <div className="pt-5 border-t border-primary/20">
                    <div className="font-mono text-[11px] text-muted-foreground uppercase">Impact</div>
                    <div className="text-lg font-bold text-primary">Reduced Bounce Rate</div>
                  </div>
                </div>

                <div className="bg-muted/30 p-10 border-l-4 border-muted h-full flex flex-col">
                  <div className="font-mono text-sm uppercase tracking-widest text-muted-foreground mb-5">03. Perception</div>
                  <div className="font-serif text-2xl mb-5 text-foreground">Headline Refinement</div>
                  <p className="text-base text-muted-foreground mb-5 flex-grow">
                    <strong className="text-foreground">Action:</strong> A/B test "Outcomes" (Speed/Accuracy) against the current "Innovation" messaging.
                  </p>
                  <div className="pt-5 border-t border-border">
                    <div className="font-mono text-[11px] text-muted-foreground uppercase">Impact</div>
                    <div className="text-lg font-bold text-muted-foreground">Relevance Signal</div>
                  </div>
                </div>

              </div>
            </div>
          </Slide>

          {/* Slide 23: Structural Evolution */}
          <Slide>
            <div className="max-w-7xl w-full h-full flex flex-col justify-center">
              <SlideEyebrow>Structural Evolution</SlideEyebrow>
              <ActionTitle>Sustain: Changing the capability baseline.</ActionTitle>
              
              <div className="grid md:grid-cols-3 gap-12 mt-12">
                
                <div className="border-t-2 border-foreground pt-8">
                  <div className="font-serif text-2xl mb-5 text-foreground">From "Gatekeeper" to "Product-Led"</div>
                  <p className="text-base text-muted-foreground leading-relaxed mb-8">
                    <strong className="text-foreground">The Move:</strong> Transition the primary CTA from a sales form to an interactive "Data Sandbox." Allow users to taste the speed of the AI before asking for marriage.
                  </p>
                  <div className="font-mono text-sm text-primary uppercase">Why: Matches market velocity.</div>
                </div>

                <div className="border-t-2 border-foreground pt-8">
                  <div className="font-serif text-2xl mb-5 text-foreground">From "Generic" to "Verticalized"</div>
                  <p className="text-base text-muted-foreground leading-relaxed mb-8">
                    <strong className="text-foreground">The Move:</strong> Build dedicated landing pages for "CPG," "Finance," and "Tech." Address the "Audience Alignment" gap by speaking specific dialects to specific buyers.
                  </p>
                  <div className="font-mono text-sm text-primary uppercase">Why: Increases relevance score.</div>
                </div>

                <div className="border-t-2 border-foreground pt-8">
                  <div className="font-serif text-2xl mb-5 text-foreground">From "Invisible" to "Referenced"</div>
                  <p className="text-base text-muted-foreground leading-relaxed mb-8">
                    <strong className="text-foreground">The Move:</strong> Implement structured schema markup and publish definitive "State of AI Insights" data. Train the LLMs (ChatGPT/Perplexity) to cite Rubiklab as the authority.
                  </p>
                  <div className="font-mono text-sm text-primary uppercase">Why: Secures future discovery.</div>
                </div>

              </div>
            </div>
          </Slide>

          {/* Slide 24: Governance Signals */}
          <Slide>
            <div className="max-w-7xl w-full h-full flex flex-col justify-center">
              <SlideEyebrow>Governance Signals</SlideEyebrow>
              <ActionTitle>How to judge progress without vanity metrics.</ActionTitle>
              
              <div className="mt-12 space-y-0">
                
                <div className="flex items-start gap-12 py-10 border-t border-border">
                  <div className="w-1/4">
                    <div className="font-mono text-sm text-primary uppercase tracking-widest mb-2">01. Clarity Signal</div>
                    <div className="font-serif text-2xl text-foreground">The Sales Conversation</div>
                  </div>
                  <div className="w-3/4 grid grid-cols-2 gap-12">
                    <div>
                      <div className="font-mono text-[11px] text-muted-foreground uppercase mb-2">Success State</div>
                      <p className="text-base text-muted-foreground">Prospects ask "How does implementation work?" (They already understand 'What' it is).</p>
                    </div>
                    <div>
                      <div className="font-mono text-[11px] text-destructive uppercase mb-2">Red Flag</div>
                      <p className="text-base text-muted-foreground">Sales team spends first 15 mins explaining the product definition.</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-12 py-10 border-t border-border">
                  <div className="w-1/4">
                    <div className="font-mono text-sm text-primary uppercase tracking-widest mb-2">02. Efficiency Signal</div>
                    <div className="font-serif text-2xl text-foreground">Velocity Ratio</div>
                  </div>
                  <div className="w-3/4 grid grid-cols-2 gap-12">
                    <div>
                      <div className="font-mono text-[11px] text-muted-foreground uppercase mb-2">Success State</div>
                      <p className="text-base text-muted-foreground">The gap between 'Landing' and 'Inquiry' compresses to under 60 seconds.</p>
                    </div>
                    <div>
                      <div className="font-mono text-[11px] text-destructive uppercase mb-2">Red Flag</div>
                      <p className="text-base text-muted-foreground">High time-on-site but low conversion (Analysis Paralysis).</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-12 py-10 border-t border-border">
                  <div className="w-1/4">
                    <div className="font-mono text-sm text-primary uppercase tracking-widest mb-2">03. Authority Signal</div>
                    <div className="font-serif text-2xl text-foreground">Comparison Set</div>
                  </div>
                  <div className="w-3/4 grid grid-cols-2 gap-12">
                    <div>
                      <div className="font-mono text-[11px] text-muted-foreground uppercase mb-2">Success State</div>
                      <p className="text-base text-muted-foreground">Buyers compare you to premium consultants or enterprise suites.</p>
                    </div>
                    <div>
                      <div className="font-mono text-[11px] text-destructive uppercase mb-2">Red Flag</div>
                      <p className="text-base text-muted-foreground">Buyers compare you to $50/mo self-serve tools.</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </Slide>

          {/* Slide 25: Closing */}
          <Slide>
            <div className="max-w-4xl w-full text-center">
              
              <div className="mb-16">
                <h2 className="font-serif text-6xl lg:text-7xl text-foreground mb-10 leading-tight">
                  Where complexity ends,<br/> <span className="italic text-primary">authority begins.</span>
                </h2>
                <p className="font-sans text-muted-foreground text-xl font-light leading-relaxed max-w-2xl mx-auto">
                  This assessment is not an indictment of capability; it is a roadmap to recognition. The market is waiting for a high-fidelity leader. Rubiklab is positioned to take that mantle, if it chooses to speak clearly.
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-foreground mt-16">
                <span className="font-serif font-bold text-4xl tracking-tight lowercase">mondro</span>
                <span className="relative flex h-3 w-3 pt-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-20"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.3)]"></span>
                </span>
              </div>

            </div>
          </Slide>
      </div>
      
      {/* Keyboard hints */}
      <div className="fixed bottom-8 right-8 z-50 font-mono text-[10px] text-muted-foreground uppercase tracking-widest print-hide opacity-50 text-right">
        <div>← → to navigate</div>
        <div className="mt-1">esc to exit</div>
      </div>
      
      {/* Hidden export button trigger */}
      <button data-export-trigger className="hidden" onClick={handleDownload} />
    </div>
  );
};

export default ReportSection;
