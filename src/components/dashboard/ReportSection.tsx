import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Download, Loader2, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { getReportDataFromSession, ParsedReportData } from "@/lib/contentParser";
import { 
  CursorGlow, 
  StaggeredContent, 
  AnimatedTitle, 
  AnimatedContent, 
  AnimatedInsight,
  CountingNumber
} from "./SlideAnimations";

// Default sample data - RAG in Law Firms webinar content
const defaultReportData = {
  score: 78,
  healthStatus: "Strong foundation",
  clientName: "Inside Practice",
  clientUrl: "https://insidepractice.com",
  generatedDate: "January 23, 2026",
  scope: "From Retrieval to Reliability: Making RAG Work in Law Firms",
  executiveSummary: "AI is transforming legal research, but most RAG implementations fail to meet the reliability standards law firms require. This session explores practical strategies to build trustworthy AI-powered research systems.",
  keyFindings: [] as { title: string; content: string; level?: string }[],
  recommendations: [] as { title: string; content: string; score?: number }[],
  
  // Waterfall chart data - RAG maturity journey
  waterfall: {
    potential: 100,
    losses: [
      { label: "Hallucination Risk", value: -12 },
      { label: "Citation Gaps", value: -8 },
      { label: "Context Window", value: -7 },
    ],
    current: 73
  },

  // Signal grid data - RAG capabilities
  signals: [
    { label: "Retrieval Quality", level: "HIGH", score: 4, variant: "default", description: "Strong document chunking and semantic search." },
    { label: "Citation Accuracy", level: "MODERATE", score: 3, variant: "blue", description: "Room for improvement in source attribution." },
    { label: "Hallucination Control", level: "LOW", score: 2, variant: "critical", description: "Requires guardrails and verification layers." },
    { label: "Context Relevance", level: "HIGH", score: 4, variant: "default", description: "Effective filtering of non-relevant content." },
  ],

  // Heatmap data - RAG implementation vectors
  heatmap: [
    { vector: "Data Quality", maturity: "full", observation: "Clean, structured legal corpus.", implication: "Foundation for accurate retrieval." },
    { vector: "Chunking Strategy", maturity: "half", observation: "Fixed-size chunks used.", implication: "Semantic boundaries ignored." },
    { vector: "Embedding Model", maturity: "full", observation: "Legal-tuned embeddings.", implication: "Domain-specific accuracy." },
    { vector: "Verification Layer", maturity: "quarter", observation: "No citation checking.", implication: "Hallucination risk unmitigated." },
  ],

  // Matrix chart data - RAG improvement priorities
  matrixItems: [
    { x: 15, y: 90, label: "Citation Verification", highlight: true },
    { x: 20, y: 80, label: "Semantic Chunking", highlight: true },
    { x: 65, y: 75, label: "Fine-tuned Embeddings", highlight: false },
    { x: 75, y: 25, label: "Full Retraining", highlight: false },
    { x: 40, y: 50, label: "Prompt Engineering", highlight: false },
  ],

  auditSections: [
    {
      title: "The Promise of RAG",
      score: 85,
      status: "Strong",
      categories: [
        {
          title: "Why RAG for Legal",
          items: [
            { label: "Research acceleration", text: "RAG can reduce legal research time by 60-70% by surfacing relevant precedents and statutes instantly from your firm's knowledge base." },
            { label: "Knowledge democratization", text: "Junior associates gain access to senior-level insights. Institutional knowledge becomes searchable and actionable." }
          ]
        },
        {
          title: "Current capabilities",
          items: [
            { label: "Document analysis", text: "Modern RAG systems can process contracts, briefs, and case law with high accuracy when properly configured." },
            { label: "Contextual retrieval", text: "Semantic search understands legal concepts, not just keywords. 'Breach of fiduciary duty' finds related cases even without exact phrase matches." }
          ]
        }
      ],
      strength: "RAG bridges the gap between powerful LLMs and your firm's proprietary knowledge base.",
      fix: "Without proper guardrails, even sophisticated RAG can produce confident-sounding hallucinations that put client matters at risk.",
      fixLevel: "priority"
    },
    {
      title: "The Reliability Problem",
      score: 45,
      status: "Critical",
      categories: [
        {
          title: "Core challenges",
          items: [
            { label: "Hallucination risk", text: "LLMs can fabricate case citations, misstate holdings, or invent precedents. In legal work, this isn't just wrong—it's malpractice risk." },
            { label: "Context limitations", text: "Even with large context windows, RAG systems can miss crucial nuances when documents exceed retrieval limits." }
          ]
        },
        {
          title: "Trust barriers",
          items: [
            { label: "Verification burden", text: "Lawyers must still check every AI-generated citation. If verification takes as long as research, where's the value?" },
            { label: "Inconsistent results", text: "Same query, different day, different answer. Non-deterministic outputs undermine confidence." }
          ]
        }
      ],
      strength: "Acknowledging these limitations is the first step toward building systems lawyers can actually trust.",
      fix: "Implement citation verification layers and confidence scoring before any RAG output reaches client-facing work.",
      fixLevel: "critical"
    },
    {
      title: "Building Reliable RAG",
      score: 75,
      status: "Actionable",
      categories: [
        {
          title: "Architecture principles",
          items: [
            { label: "Semantic chunking", text: "Break documents at natural boundaries (paragraphs, sections, arguments) rather than arbitrary character limits." },
            { label: "Hybrid retrieval", text: "Combine vector search with keyword matching. Legal documents have specific terminology that benefits from both approaches." }
          ]
        },
        {
          title: "Quality controls",
          items: [
            { label: "Citation verification", text: "Every case reference should be validated against authoritative sources before presentation. No exceptions." },
            { label: "Confidence scoring", text: "Show users when the system is uncertain. A 'low confidence' flag is more valuable than a confidently wrong answer." }
          ]
        }
      ],
      strength: "The firms winning with RAG are those investing in verification layers, not just bigger models.",
      fix: "Start with high-stakes use cases where reliability matters most. Build trust through demonstrated accuracy.",
      fixLevel: "priority"
    },
    {
      title: "Implementation Roadmap",
      score: 70,
      status: "Strategic",
      categories: [
        {
          title: "Phase 1: Foundation",
          items: [
            { label: "Data preparation", text: "Audit and clean your document corpus. Garbage in, garbage out applies doubly to RAG systems." },
            { label: "Pilot scope", text: "Start with a single practice area. Legal research for M&A due diligence or contract review are strong candidates." }
          ]
        },
        {
          title: "Phase 2: Scale",
          items: [
            { label: "Feedback loops", text: "Lawyers must be able to flag bad outputs easily. Use this data to continuously improve retrieval quality." },
            { label: "Integration points", text: "RAG works best embedded in existing workflows. Document management, research platforms, matter intake." }
          ]
        }
      ],
      strength: "Incremental rollout allows learning and adjustment before firm-wide deployment.",
      fix: "Don't try to boil the ocean. Pick one use case, prove value, then expand.",
      fixLevel: "priority"
    }
  ],
  roadmap: [
    {
      title: "Implement citation verification",
      subtitle: "Validate all case references automatically.",
      effort: "Med",
      impact: "High",
      tasks: [
        { tag: "DEV", text: "Integrate with Westlaw/Lexis citation APIs." },
        { tag: "QA", text: "Build automated testing for citation accuracy." }
      ]
    },
    {
      title: "Adopt semantic chunking",
      subtitle: "Break documents at natural boundaries.",
      effort: "Low",
      impact: "High",
      tasks: [
        { tag: "ML", text: "Implement paragraph-aware document splitting." }
      ]
    },
    {
      title: "Add confidence scoring",
      subtitle: "Surface uncertainty to end users.",
      effort: "Med",
      impact: "Med",
      tasks: [
        { tag: "UX", text: "Design confidence indicator UI components." },
        { tag: "ML", text: "Implement retrieval confidence metrics." }
      ]
    },
    {
      title: "Build feedback pipeline",
      subtitle: "Capture lawyer corrections for retraining.",
      effort: "High",
      impact: "High",
      tasks: [
        { tag: "DEV", text: "Create thumbs up/down feedback mechanism." },
        { tag: "DATA", text: "Design feedback aggregation and analysis." }
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
      "w-screen h-screen flex-shrink-0 pt-16 pb-20 px-4 lg:px-10 relative flex flex-col items-center bg-background overflow-hidden",
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
const CoverSlide = ({ clientName, onNavigateHome }: { clientName: string; onNavigateHome: () => void }) => (
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
      <div className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">
        {clientName}
      </div>
    </div>

    {/* Main content */}
    <div className="relative z-10 flex-grow flex flex-col justify-center">
      <div className="border-l-4 border-primary pl-12 py-4">
        <h1 className="font-serif text-7xl md:text-8xl lg:text-9xl text-white leading-[0.9] tracking-tight mb-4">
          Making RAG Work <br />
          <span className="italic text-primary">in Law Firms.</span>
        </h1>
      </div>
    </div>

    {/* Footer */}
    <div className="relative z-10 flex justify-between items-end">
      <button 
        onClick={onNavigateHome}
        className="flex items-center gap-1.5 group cursor-pointer transition-opacity hover:opacity-80"
      >
        <span className="font-serif font-bold text-3xl tracking-tight lowercase text-white group-hover:text-primary transition-colors">Rubiklab</span>
        <div className="relative flex items-center justify-center">
          <div className="absolute w-3 h-3 bg-primary rounded-full animate-ping opacity-20"></div>
          <div className="w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_12px_hsl(var(--primary)/0.3)]"></div>
        </div>
      </button>
      
      <div className="font-mono text-[10px] text-gray-600 uppercase tracking-widest">
        Rubiklab Intelligence Capital © 2026
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
          <div className="w-[1px] h-16 bg-primary mb-10" />
          <h2 className="font-serif text-7xl lg:text-8xl text-white mb-6 whitespace-nowrap">
            {title}<span className="text-primary">.</span>
          </h2>
          <p className="font-sans text-xl text-gray-400 font-light leading-relaxed max-w-lg">
            {subtitle}
          </p>
        </div>
      )}
      
      {layout === 'top-right' && (
        <div className="text-right max-w-2xl">
          <div className="w-16 h-1 bg-primary ml-auto mb-8" />
          <h2 className="font-serif text-7xl lg:text-8xl text-white mb-6 leading-[0.95]">
            {title}<span className="text-primary">.</span>
          </h2>
          <p className="font-sans text-xl text-gray-400 font-light leading-relaxed">
            {subtitle}
          </p>
        </div>
      )}
      
      {layout === 'bottom-left' && (
        <div className="max-w-2xl">
          <div className="w-16 h-1 bg-primary mb-8" />
          <h2 className="font-serif text-7xl lg:text-8xl text-white mb-6">
            {title}<span className="text-primary">.</span>
          </h2>
          <p className="font-sans text-xl text-gray-400 font-light max-w-lg leading-relaxed">
            {subtitle}
          </p>
        </div>
      )}
    </div>
    
    {/* Footer with logo */}
    <div className="relative z-10 flex justify-between items-end">
      <div className="flex items-center gap-1.5">
        <span className="font-serif font-bold text-3xl tracking-tight lowercase text-white">Rubiklab</span>
        <div className="relative flex items-center justify-center">
          <div className="absolute w-3 h-3 bg-primary rounded-full animate-ping opacity-20"></div>
          <div className="w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_12px_hsl(var(--primary)/0.3)]"></div>
        </div>
      </div>
      
      <div className="font-mono text-[10px] text-gray-600 uppercase tracking-widest">
        Rubiklab Intelligence Capital © 2026
      </div>
    </div>
  </div>
);

interface ReportSectionProps {
  onExit?: () => void;
}

const ReportSection = ({ onExit }: ReportSectionProps) => {
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  
  // Get dynamic report data from session storage or use defaults
  // For the RAG webinar, we always use the curated default content
  const reportData = useMemo(() => {
    const sessionData = getReportDataFromSession();
    if (sessionData) {
      // Use client name from session but keep curated RAG content
      return {
        ...defaultReportData,
        clientName: sessionData.clientName || defaultReportData.clientName,
        generatedDate: sessionData.generatedDate || defaultReportData.generatedDate,
      };
    }
    return defaultReportData;
  }, []);
  
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
      
      // Force all animations to their final state by adding a class
      const animatedElements = containerRef.current.querySelectorAll('[class*="opacity-0"], [style*="opacity: 0"]');
      const originalStyles: { el: Element; opacity: string; transform: string }[] = [];
      
      // Store original styles and force visibility
      animatedElements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        originalStyles.push({
          el,
          opacity: htmlEl.style.opacity,
          transform: htmlEl.style.transform
        });
        htmlEl.style.opacity = '1';
        htmlEl.style.transform = 'none';
      });
      
      // Also handle framer-motion elements that might be hidden
      const motionElements = containerRef.current.querySelectorAll('[data-framer-component-type]');
      motionElements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        originalStyles.push({
          el,
          opacity: htmlEl.style.opacity,
          transform: htmlEl.style.transform
        });
        htmlEl.style.opacity = '1';
        htmlEl.style.transform = 'none';
      });
      
      // Wait a moment for styles to apply
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const captureSlide = async (slide: Element): Promise<string> => {
        // Ensure slide itself is visible
        const htmlSlide = slide as HTMLElement;
        const originalSlideOpacity = htmlSlide.style.opacity;
        htmlSlide.style.opacity = '1';
        
        // Force all children to be visible for capture
        const children = htmlSlide.querySelectorAll('*');
        children.forEach((child) => {
          const htmlChild = child as HTMLElement;
          if (htmlChild.style.opacity === '0' || getComputedStyle(htmlChild).opacity === '0') {
            htmlChild.style.opacity = '1';
          }
        });
        
        // Small delay to ensure DOM updates
        await new Promise(resolve => setTimeout(resolve, 50));
        
        const canvas = await html2canvas(htmlSlide, {
          scale: 1.5,
          useCORS: true,
          backgroundColor: "#0a0a0a",
          logging: false,
          onclone: (clonedDoc) => {
            // Force visibility on ALL elements in cloned document
            const allElements = clonedDoc.querySelectorAll('*');
            allElements.forEach((el) => {
              const htmlEl = el as HTMLElement;
              if (htmlEl.style) {
                htmlEl.style.opacity = '1';
                htmlEl.style.visibility = 'visible';
              }
            });
          }
        });
        
        htmlSlide.style.opacity = originalSlideOpacity;
        return canvas.toDataURL("image/jpeg", 0.85);
      };
      
      for (let i = 0; i < allSlides.length; i++) {
        currentItem++;
        setProgress(Math.round((currentItem / totalSlideCount) * 100));
        const imgData = await captureSlide(allSlides[i]);
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, 0, 1920, 1080);
      }
      
      // Restore original styles
      originalStyles.forEach(({ el, opacity, transform }) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.opacity = opacity;
        htmlEl.style.transform = transform;
      });
      
      const clientSlug = reportData.clientName.replace(/[^a-zA-Z0-9]/g, "-").replace(/-+/g, "-");
      const dateStr = new Date().toISOString().split("T")[0];
      pdf.save(`Rubiklab_report_${clientSlug}_${dateStr}.pdf`);
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
      {/* Back to Upload Button */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-card/80 backdrop-blur-sm border border-border hover:border-primary text-muted-foreground hover:text-foreground text-[10px] font-mono uppercase tracking-widest transition-all duration-300 print-hide group"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:text-primary transition-colors" />
        New Report
      </button>
      
      {/* Subtle cursor glow effect */}
      <CursorGlow />
      
      {/* Horizontal sliding container */}
      <div 
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}vw)` }}
      >
        {/* ============================================== */}
        {/* SECTION 0: EXECUTIVE SUMMARY (Slides 01-04)   */}
        {/* ============================================== */}
        
        {/* Slide 01: Cover */}
        <CoverSlide clientName={reportData.clientName} onNavigateHome={() => navigate('/')} />
        
        {/* Slide 02: Methodology */}
        <Slide>
          <StaggeredContent className="max-w-7xl w-full h-full flex flex-col">
            <AnimatedTitle>
              <SlideEyebrow>Methodology</SlideEyebrow>
              <ActionTitle>Reading this assessment.</ActionTitle>
            </AnimatedTitle>
            
            <AnimatedContent className="grid md:grid-cols-12 gap-10 lg:gap-16">
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
              
              <AnimatedInsight className="col-span-5">
                <div className="bg-muted/30 p-8 border-l-2 border-foreground w-full">
                  <div className="font-serif text-2xl lg:text-3xl mb-5 italic text-foreground leading-snug">
                    "Data describes the past.<br/>Judgement informs the future."
                  </div>
                  <p className="text-base text-muted-foreground leading-relaxed font-light">
                    Please interpret findings as diagnostic signals rather than absolute grades. "Critical" flags identify vectors that materially constrain credibility, conversion, or growth.
                  </p>
                </div>
              </AnimatedInsight>
            </AnimatedContent>
          </StaggeredContent>
        </Slide>

        <Slide>
          <StaggeredContent className="max-w-6xl mx-auto w-full h-full flex flex-col pt-4">
            <AnimatedTitle>
              <SlideEyebrow>Executive Synthesis</SlideEyebrow>
              <ActionTitle>
                {reportData.executiveSummary 
                  ? `Strategic analysis for ${reportData.clientName}.`
                  : "Operational maturity is currently invisible to the modern buyer."}
              </ActionTitle>
            </AnimatedTitle>
            
            <AnimatedContent>
              <p className="font-sans font-light text-lg text-muted-foreground max-w-4xl mb-16 leading-relaxed">
                {reportData.executiveSummary 
                  ? reportData.executiveSummary.substring(0, 500) + (reportData.executiveSummary.length > 500 ? "..." : "")
                  : `${reportData.clientName} possesses strong foundational capabilities. This assessment identifies key opportunities to enhance digital presence and market positioning.`}
              </p>
            </AnimatedContent>

            <AnimatedInsight className="grid grid-cols-3 gap-12 h-[320px] border-t border-foreground pt-10">
              
              {/* Column 1: Primary Asset */}
              <motion.div 
                className="flex flex-col"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="font-mono text-xs uppercase tracking-widest text-primary mb-6">01. Primary Asset</div>
                <h3 className="font-serif text-2xl mb-4">The Global Engine</h3>
                <p className="text-sm text-muted-foreground mb-8 flex-grow leading-relaxed">
                  With 85+ countries, 40+ languages, and a 22-year legacy, the "Hard Stuff" (Infrastructure) is solved. This allows for complex, multi-market execution that pure-play tech disruptors cannot replicate.
                </p>
                <div>
                  <motion.div 
                    className="font-serif text-5xl leading-none text-foreground mb-1"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    viewport={{ once: true }}
                  >
                    22 Yrs
                  </motion.div>
                  <div className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Operational Heritage</div>
                </div>
              </motion.div>

              {/* Column 2: Primary Constraint */}
              <motion.div 
                className="border-l border-border pl-8 flex flex-col"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="font-mono text-xs uppercase tracking-widest text-destructive mb-6">02. Primary Constraint</div>
                <h3 className="font-serif text-2xl mb-4">The "Trust" Vacuum</h3>
                <p className="text-sm text-muted-foreground mb-8 flex-grow leading-relaxed">
                  The digital presence relies on "Self-Reported" trust signals (e.g., "95% Satisfaction") without third-party verification. The rebrand reset 20 years of SEO equity, leaving Mavrix invisible to organic search and AI discovery.
                </p>
                <div>
                  <motion.div 
                    className="font-serif text-5xl leading-none text-destructive/60 mb-1"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    viewport={{ once: true }}
                  >
                    Low
                  </motion.div>
                  <div className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Domain Authority (Reset)</div>
                </div>
              </motion.div>

              {/* Column 3: The Pivot */}
              <motion.div 
                className="border-l border-border pl-8 flex flex-col"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="font-mono text-xs uppercase tracking-widest text-primary mb-6">03. The Pivot</div>
                <h3 className="font-serif text-2xl mb-4">Integrity Assurance</h3>
                <p className="text-sm text-muted-foreground mb-8 flex-grow leading-relaxed">
                  Stop competing on "AI Speed" (a commodity war against Zappi/Lucid). Pivot to "Verified Human Truth." Own the complexity that AI cannot solve: hard-to-reach B2B and multi-country compliance.
                </p>
                <div>
                  <motion.div 
                    className="font-serif text-5xl leading-none text-primary mb-1"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    viewport={{ once: true }}
                  >
                    Premium
                  </motion.div>
                  <div className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Target Positioning</div>
                </div>
              </motion.div>

            </AnimatedInsight>
          </StaggeredContent>
        </Slide>

        {/* Slide 04: Report Architecture */}
        <Slide className="bg-[#050505]">
          <div className="max-w-7xl w-full h-full flex flex-col pt-4">
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
          <StaggeredContent className="max-w-6xl mx-auto w-full h-full flex flex-col">
            <AnimatedTitle>
              <SlideEyebrow>Overall Digital Standing</SlideEyebrow>
            </AnimatedTitle>
            
            <AnimatedContent className="flex justify-between items-end mb-8">
              <ActionTitle className="max-w-3xl">A 60-point gap exists between operational potential and digital reality.</ActionTitle>
              
              <div className="bg-muted/30 border-l-2 border-primary p-6 max-w-sm mb-8">
                <span className="font-mono text-[10px] text-primary uppercase tracking-widest block mb-2">Primary Drag</span>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The "Trust Deficit" (unverified claims, missing social proof) is the single largest weight on performance, costing 30 points of conversion potential.
                </p>
              </div>
            </AnimatedContent>

            <AnimatedContent delay={0.1} className="border-b border-border pb-8">
              {/* Waterfall Chart */}
              <div className="w-full flex items-end justify-between pt-8 gap-8">
                
                {/* Digital Potential */}
                <div className="flex-1 flex flex-col items-center">
                  <span className="font-mono text-2xl font-semibold text-muted-foreground mb-4">100</span>
                  <div className="w-full bg-muted h-[240px] rounded-sm"></div>
                  <span className="font-sans text-[11px] text-muted-foreground font-medium tracking-wider uppercase mt-4 text-center">Digital<br/>Potential</span>
                </div>

                {/* Trust Deficit -30 */}
                <div className="flex-1 flex flex-col items-center">
                  <span className="font-mono text-xl font-medium text-destructive mb-4">-30</span>
                  <div className="h-[240px] w-full flex flex-col justify-start">
                    <div className="w-full bg-destructive h-[72px] rounded-sm"></div>
                  </div>
                  <span className="font-sans text-[11px] text-destructive font-medium tracking-wider uppercase mt-4 text-center">Trust<br/>Deficit</span>
                </div>

                {/* Visibility Gap -20 */}
                <div className="flex-1 flex flex-col items-center">
                  <span className="font-mono text-xl font-medium text-destructive mb-4">-20</span>
                  <div className="h-[240px] w-full flex flex-col justify-start pt-[72px]">
                    <div className="w-full bg-destructive h-[48px] rounded-sm"></div>
                  </div>
                  <span className="font-sans text-[11px] text-destructive font-medium tracking-wider uppercase mt-4 text-center">Visibility<br/>Gap</span>
                </div>

                {/* Content Lag -10 */}
                <div className="flex-1 flex flex-col items-center">
                  <span className="font-mono text-xl font-medium text-destructive mb-4">-10</span>
                  <div className="h-[240px] w-full flex flex-col justify-start pt-[120px]">
                    <div className="w-full bg-destructive h-[24px] rounded-sm"></div>
                  </div>
                  <span className="font-sans text-[11px] text-destructive font-medium tracking-wider uppercase mt-4 text-center">Content<br/>Lag</span>
                </div>

                {/* Current Score */}
                <div className="flex-1 flex flex-col items-center">
                  <motion.span 
                    className="font-mono text-4xl font-semibold text-primary mb-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    viewport={{ once: true }}
                  >
                    40
                  </motion.span>
                  <div className="h-[240px] w-full flex flex-col justify-end">
                    <div className="w-full bg-primary h-[96px] rounded-sm"></div>
                  </div>
                  <span className="font-sans text-[11px] text-foreground font-bold tracking-wider uppercase mt-4 text-center">Current<br/>Score</span>
                </div>

              </div>
            </AnimatedContent>

            {/* Footer Stats */}
            <AnimatedInsight className="grid grid-cols-3 gap-12 pt-8">
              <div>
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-1">Score Interpretation</span>
                <div className="font-serif text-xl text-foreground">Critical Health</div>
                <div className="text-xs text-muted-foreground mt-1">Structural issues constraining growth.</div>
              </div>
              <div>
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-1">Recovery Potential</span>
                <div className="font-serif text-xl text-green-600">
                  +<CountingNumber value={45} suffix=" Points" className="" duration={1.5} />
                </div>
                <div className="text-xs text-muted-foreground mt-1">Achievable within 90-day remediation.</div>
              </div>
              <div>
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-1">Impact Horizon</span>
                <div className="font-serif text-xl text-primary">Q2 2026</div>
                <div className="text-xs text-muted-foreground mt-1">If "Trust" fixes are deployed immediately.</div>
              </div>
            </AnimatedInsight>

          </StaggeredContent>
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
          <StaggeredContent className="max-w-6xl mx-auto w-full h-full flex flex-col pt-4">
            <AnimatedTitle>
              <SlideEyebrow>The Competitive Reality</SlideEyebrow>
              <ActionTitle>The category has split into "Automated Velocity" and "Legacy Scale."</ActionTitle>
            </AnimatedTitle>
            <AnimatedContent>
              <p className="font-sans font-light text-muted-foreground max-w-3xl mb-8">
                Mavrix is fighting a two-front war. On one side, AI platforms (Zappi) are driving the cost of simple data to zero. On the other, giants (Dynata) are winning on sheer volume.
              </p>
            </AnimatedContent>

            {/* Spectrum Container */}
            <AnimatedInsight className="flex justify-between items-stretch h-[380px] mt-8 relative">
              
              {/* Pole 01: The Commodity */}
              <motion.div 
                className="w-[30%] p-8 flex flex-col border border-border bg-muted/30 relative"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <span className="font-mono text-xs uppercase tracking-[0.1em] text-destructive mb-4">Pole 01: The Commodity</span>
                <h3 className="font-serif text-3xl leading-none mb-4 text-foreground">Automated<br/>Velocity.</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-light">
                  Tech-first platforms selling "Insights in Minutes." They drive marginal cost to zero but introduce high risk (synthetic fraud, hallucinations).
                </p>
                <div className="mt-auto text-xs text-muted-foreground/60 border-t border-border pt-4">
                  <strong className="text-foreground">Adversaries:</strong><br/>Zappi, Suzy, Lucid, Pollfish
                </div>
              </motion.div>

              {/* Middle Zone: Mavrix Position */}
              <motion.div 
                className="w-[40%] flex flex-col justify-center items-center text-center bg-background z-10 shadow-[0_0_40px_rgba(0,0,0,0.05)] border border-border px-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="relative w-4 h-4 mb-4">
                  <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75" />
                  <div className="relative w-4 h-4 bg-primary rounded-full shadow-[0_0_0_4px_hsl(var(--primary)/0.2)]" />
                </div>
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
              </motion.div>

              {/* Pole 02: The Safe Choice */}
              <motion.div 
                className="w-[30%] p-8 flex flex-col border border-border bg-muted/30 relative"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <span className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground mb-4">Pole 02: The Safe Choice</span>
                <h3 className="font-serif text-3xl leading-none mb-4 text-foreground">Legacy<br/>Scale.</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-light">
                  Massive infrastructure players selling "Global Reach." They offer safety but suffer from bloat, opacity, and slow turnaround times.
                </p>
                <div className="mt-auto text-xs text-muted-foreground/60 border-t border-border pt-4">
                  <strong className="text-foreground">Adversaries:</strong><br/>Dynata, Kantar, Ipsos
                </div>
              </motion.div>

            </AnimatedInsight>
            
            {/* Footer Stats - Boxed Layout */}
            <div className="mt-8 grid grid-cols-2 gap-6 border-t border-border pt-6">
              <div className="bg-muted/30 border border-border p-5">
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-2">Buying Criteria</span>
                <h4 className="font-serif text-xl text-foreground mb-1">Speed vs. Certainty</h4>
                <p className="text-xs text-muted-foreground">The market forces buyers to choose between rapid automation (risky) and trusted validation (slow). Mavrix must own "Certainty" to escape the squeeze.</p>
              </div>
              <div className="bg-destructive/5 border border-destructive/20 p-5">
                <span className="font-mono text-[10px] text-destructive uppercase tracking-widest block mb-2">Threat Assessment</span>
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-block px-2 py-0.5 font-mono text-[10px] uppercase bg-destructive/10 text-destructive animate-pulse">High Risk</span>
                  <span className="font-serif text-xl text-foreground">Squeezed Middle</span>
                </div>
                <p className="text-xs text-muted-foreground">Caught between commodity pricing (bottom) and legacy scale (top). Without differentiation, margin compression is inevitable.</p>
              </div>
            </div>

          </StaggeredContent>
        </Slide>

        {/* Slide 08: Peer Positioning Snapshot */}
        <Slide>
          <div className="max-w-6xl mx-auto w-full h-full flex flex-col pt-4">
            <SlideEyebrow>Peer Positioning Snapshot</SlideEyebrow>
            <ActionTitle>High authority on "Fieldwork", invisible on "Innovation".</ActionTitle>
            <p className="font-sans font-light text-muted-foreground max-w-3xl mb-12">
              We benchmarked Mavrix against three market archetypes: The Legacy Incumbent (e.g., Dynata), The Tech Disruptor (e.g., Zappi), and The Specialist (e.g., Ronin).
            </p>

            <div className="grid grid-cols-12 gap-16">
              
              {/* Slider Section */}
              <div className="col-span-8 pt-4 space-y-14">
                
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
                    <div className="absolute top-1/2 -translate-y-1/2 z-10" style={{ left: "85%" }}>
                      <div className="relative">
                        <div className="absolute inset-0 w-4 h-4 rounded-full bg-primary animate-ping opacity-30 -translate-x-0.5 -translate-y-0.5" />
                        <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.5)]" />
                      </div>
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
                    <div className="absolute top-1/2 -translate-y-1/2 z-10" style={{ left: "5%" }}>
                      <div className="relative">
                        <div className="absolute inset-0 w-4 h-4 rounded-full bg-primary animate-ping opacity-30 -translate-x-0.5 -translate-y-0.5" />
                        <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.5)]" />
                      </div>
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
                    <div className="absolute top-1/2 -translate-y-1/2 z-10" style={{ left: "20%" }}>
                      <div className="relative">
                        <div className="absolute inset-0 w-4 h-4 rounded-full bg-primary animate-ping opacity-30 -translate-x-0.5 -translate-y-0.5" />
                        <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.5)]" />
                      </div>
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
          <StaggeredContent className="max-w-6xl mx-auto w-full h-full flex flex-col pt-4">
            <AnimatedTitle>
              <SlideEyebrow>Differentiation Signals</SlideEyebrow>
              <ActionTitle>Winners are selling "Certainty," not just "Speed."</ActionTitle>
            </AnimatedTitle>
            <AnimatedContent>
              <p className="font-sans font-light text-muted-foreground max-w-3xl mb-12">
                The market is flooded with "AI Velocity" claims. Mavrix is currently echoing this noise instead of owning the "Integrity" counter-narrative.
              </p>
            </AnimatedContent>

            <AnimatedInsight className="grid grid-cols-3 gap-8 h-[380px]">
              
              {/* Card 1: Competitor Pattern */}
              <motion.div 
                className="border border-border p-8 h-full flex flex-col bg-muted/30"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
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
              </motion.div>

              {/* Card 2: Current Mavrix Position */}
              <motion.div 
                className="border border-destructive border-l-4 p-8 h-full flex flex-col bg-background"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
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
              </motion.div>

              {/* Card 3: The White Space */}
              <motion.div 
                className="border border-primary border-l-4 p-8 h-full flex flex-col bg-primary/5"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-primary mb-4">The White Space</span>
                <h3 className="font-serif text-[1.75rem] leading-[1.2] text-primary mb-4">"Zero-Risk Execution."</h3>
                
                <div className="mt-auto space-y-4">
                  <div>
                    <span className="text-[10px] text-muted-foreground/60 font-mono uppercase tracking-wider block mb-1">Focus</span>
                    <p className="text-xs text-muted-foreground">Outcome Assurance (Safety)</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground/60 font-mono uppercase tracking-wider block mb-1">The Pivot</span>
                    <p className="text-xs text-primary">"We don't just find the data. We ensure it's true."</p>
                  </div>
                  <div className="pt-4 border-t border-primary/20">
                    <span className="text-[10px] text-muted-foreground/60 font-mono uppercase tracking-wider">Target Emotion</span>
                    <p className="text-xs text-muted-foreground/80 mt-1">Relief & Confidence</p>
                  </div>
                </div>
              </motion.div>

            </AnimatedInsight>
          </StaggeredContent>
        </Slide>

        {/* Slide 10: Visibility & Discoverability - Platform Dissonance */}
        <Slide>
          <div className="max-w-7xl w-full h-full flex flex-col pt-4">
            <div className="mb-8">
              <SlideEyebrow>Visibility & Discoverability</SlideEyebrow>
              <ActionTitle>The "Platform Dissonance."</ActionTitle>
              <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
                Mavrix is living a digital double-life. On LinkedIn, you are a vibrant, human-led community leader. On your Website, you are a generic, faceless tech vendor. You are renting your best personality.
              </p>
            </div>

            {/* Main comparison layout */}
            <div className="grid grid-cols-12 gap-6 flex-1">
              
              {/* Left: LinkedIn - Strong */}
              <div className="col-span-5 relative">
                <div className="absolute -top-2 -left-2 w-16 h-16 bg-[#0A66C2]/10 rounded-full blur-2xl" />
                <div className="h-full bg-gradient-to-br from-[#0A66C2]/5 to-transparent border border-[#0A66C2]/20 p-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0A66C2] to-[#0A66C2]/30" />
                  
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded bg-[#0A66C2] flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-[#0A66C2] uppercase tracking-widest block">High Vitality</span>
                      <h3 className="font-serif text-xl text-foreground">Social Ecosystem</h3>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                    A strategic asset. 26k+ followers and authentic CEO narratives prove "Proof of Life" and industry standing. <strong className="text-foreground">This is where your brand actually lives.</strong>
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/50 dark:bg-background/50 p-4 rounded border border-[#0A66C2]/10">
                      <span className="font-serif text-3xl text-[#0A66C2]"><CountingNumber value={26} suffix="k+" className="" duration={1.2} /></span>
                      <span className="text-[10px] text-muted-foreground block uppercase tracking-wider">Followers</span>
                    </div>
                    <div className="bg-white/50 dark:bg-background/50 p-4 rounded border border-[#0A66C2]/10">
                      <span className="font-serif text-3xl text-[#0A66C2]">Active</span>
                      <span className="text-[10px] text-muted-foreground block uppercase tracking-wider">CEO Voice</span>
                    </div>
                  </div>
                  
                  <div className="bg-[#0A66C2]/10 p-4 rounded-sm border-l-2 border-[#0A66C2]">
                    <span className="text-[10px] text-[#0A66C2] uppercase tracking-widest font-bold block mb-1">Leverage Point</span>
                    <p className="text-xs text-foreground font-medium">Export this "Humanity" to the Website immediately.</p>
                  </div>
                </div>
              </div>
              
              {/* Center: The Gap Indicator */}
              <div className="col-span-2 flex flex-col items-center justify-center">
                <div className="w-px h-16 bg-gradient-to-b from-transparent via-border to-transparent" />
                <div className="py-6 text-center">
                  <div className="w-12 h-12 rounded-full border-2 border-destructive/30 flex items-center justify-center mx-auto mb-3 bg-destructive/5 animate-pulse">
                    <svg className="w-5 h-5 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  </div>
                  <span className="font-mono text-[10px] text-destructive uppercase tracking-widest block">The Gap</span>
                  <span className="font-serif text-lg text-foreground">Dissonance</span>
                </div>
                <div className="w-px h-16 bg-gradient-to-b from-transparent via-border to-transparent" />
              </div>
              
              {/* Right: Website - Weak */}
              <div className="col-span-5 relative">
                <div className="h-full bg-gradient-to-br from-destructive/5 to-transparent border border-destructive/20 p-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-destructive to-destructive/30" />
                  
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded bg-muted flex items-center justify-center border border-border">
                      <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-destructive uppercase tracking-widest block">Sterile</span>
                      <h3 className="font-serif text-xl text-foreground">Owned Domain</h3>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                    The website fails to capture the energy of the LinkedIn page. It relies on <strong className="text-destructive">generic tech buzzwords</strong> instead of the "Mavrix Crew" reality.
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm">
                      <span className="w-5 h-5 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </span>
                      <span className="text-muted-foreground">No CEO presence or voice</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="w-5 h-5 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </span>
                      <span className="text-muted-foreground">Zero event or team imagery</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="w-5 h-5 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </span>
                      <span className="text-muted-foreground">Generic "AI-forward" messaging</span>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-sm border-l-2 border-muted-foreground/30">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold block mb-1">Priority Fix</span>
                    <p className="text-xs text-foreground font-medium">Embed CEO Narrative and Event Photos directly onto the Homepage.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom: Brand Protection Alert */}
            <div className="mt-6 bg-destructive/5 border border-destructive/20 p-5 flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-destructive" fill="currentColor" viewBox="0 0 20 20"><path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"/></svg>
                </div>
                <div>
                  <span className="font-mono text-[10px] text-destructive uppercase tracking-widest block">Identity Confusion Risk</span>
                  <span className="font-serif text-base text-foreground">Brand Protection: "Mavrix AI" (Crypto Bot)</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground flex-1">
                Consumer complaints about the crypto bot risk bleeding into your B2B reputation if not digitally fenced.
              </p>
              <div className="text-right">
                <span className="text-[10px] text-primary uppercase tracking-widest font-bold block">Defensive Move</span>
                <span className="text-xs text-muted-foreground">Create "Not Affiliated" disclaimer</span>
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
                  <span className="font-sans font-semibold text-base text-destructive">Nearly 100% Manual Outbound</span>
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
          <StaggeredContent className="max-w-6xl mx-auto w-full h-full flex flex-col pt-4">
            <AnimatedTitle>
              <SlideEyebrow>System-Level Diagnosis</SlideEyebrow>
            </AnimatedTitle>
            
            <AnimatedContent className="flex items-center gap-16 mb-8">
              {/* Score Circle with animated gauge */}
              <div className="relative w-[180px] h-[180px] flex items-center justify-center shrink-0">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle 
                    cx="50" cy="50" r="42" 
                    fill="none" 
                    stroke="hsl(var(--muted))" 
                    strokeWidth="8"
                  />
                  {/* Animated fill circle - 40% = 0.4 * circumference */}
                  <motion.circle 
                    cx="50" cy="50" r="42" 
                    fill="none" 
                    stroke="#EF4444" 
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${0.4 * 2 * Math.PI * 42} ${2 * Math.PI * 42}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                    whileInView={{ strokeDashoffset: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                  />
                </svg>
                <div className="text-center z-10">
                  <motion.span 
                    className="font-serif text-6xl text-foreground leading-none"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                    viewport={{ once: true }}
                  >
                    40
                  </motion.span>
                  <span className="font-mono text-sm text-muted-foreground mt-2 block">/ 100</span>
                </div>
              </div>

              <div>
                <ActionTitle className="mb-4">Critical Health. <br/>The digital engine is misfiring.</ActionTitle>
                <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                  A forensic audit of the Mavrix digital ecosystem reveals a structural disconnect between "What you sell" (High-Touch Fieldwork) and "How you sell it" (Low-Touch Tech Narrative).
                </p>
              </div>
            </AnimatedContent>

            <AnimatedInsight className="grid grid-cols-3 gap-12 mt-8 pt-8 border-t border-border">
              {/* Pillar 01: Narrative Clarity */}
              <motion.div 
                className="pl-6 border-l border-border"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <span className="inline-block px-2 py-0.5 rounded font-mono text-[10px] uppercase bg-amber-50 text-amber-500 mb-2 animate-pulse">Moderate Risk</span>
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-3">Pillar 01: Narrative Clarity</span>
                <h3 className="font-serif text-2xl text-foreground mb-2">50/100</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The "Smart Technology" headline is generic. It hides your true differentiator (Fieldwork Expertise) behind buzzwords, making you comparable to commodity players.
                </p>
              </motion.div>

              {/* Pillar 02: Trust Signals - Critical */}
              <motion.div 
                className="pl-6 border-l-2 border-destructive"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <span className="inline-block px-2 py-0.5 rounded font-mono text-[10px] uppercase bg-red-50 text-destructive mb-2 animate-pulse">Critical Risk</span>
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-3">Pillar 02: Trust Signals</span>
                <h3 className="font-serif text-2xl text-destructive mb-2">20/100</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Missing case studies, "0 Published" whitepapers, and self-reported stats create a "Trust Deficit." Buyers cannot verify your claims without speaking to sales.
                </p>
              </motion.div>

              {/* Pillar 03: Commercial Flow */}
              <motion.div 
                className="pl-6 border-l border-border"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <span className="inline-block px-2 py-0.5 rounded font-mono text-[10px] uppercase bg-red-50 text-destructive mb-2 animate-pulse">High Friction</span>
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-3">Pillar 03: Commercial Flow</span>
                <h3 className="font-serif text-2xl text-foreground mb-2">30/100</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Opaque pricing and generic "Contact Us" forms create high friction. You are blocking qualified buyers who want to self-select or get a ballpark estimate.
                </p>
              </motion.div>
            </AnimatedInsight>

          </StaggeredContent>
        </Slide>

        {/* Slide 14: Perceived Authority */}
        <Slide>
          <div className="max-w-7xl w-full h-full flex flex-col">
            <SlideEyebrow>Perceived Authority</SlideEyebrow>
            <ActionTitle>Authority exists, but it is stranded on a rented platform.</ActionTitle>
            <p className="text-base text-muted-foreground max-w-3xl mb-6">
              Mavrix has a vibrant human pulse on LinkedIn (Asset), but a sterile corporate mask on the Website (Liability). You are failing to transfer trust to your owned domain.
            </p>

            <div className="grid md:grid-cols-2 gap-16 border-t border-border pt-8">
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
          <div className="max-w-7xl w-full h-full flex flex-col pt-4">
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
                  <div className="w-8 h-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center font-bold text-xs animate-pulse">!</div>
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
                    Your actual differentiator (the "Mavrix Crew" beloved on LinkedIn) is completely absent here. You are hiding your stars behind stock vectors.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Slide>

        {/* Slide 16: Trust Architecture */}
        <Slide>
          <div className="max-w-7xl w-full h-full flex flex-col pt-4">
            <div className="mb-4">
              <SlideEyebrow>Trust Architecture</SlideEyebrow>
              <ActionTitle>Three structural fractures are undermining buyer confidence.</ActionTitle>
              <p className="font-sans font-light text-muted-foreground max-w-3xl leading-relaxed">
                Trust is not just about what you say; it's about what the buyer finds when they check your homework. Our audit uncovered three specific "leaks" where credibility is evaporating.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-8 mt-8">
              {/* Fracture 01 */}
              <div className="border border-border p-8 flex flex-col">
                <div>
                  <span className="font-mono text-[11px] text-destructive uppercase tracking-wider block mb-4">Fracture 01: The "Anonymity" Error</span>
                  <h3 className="font-serif text-2xl mb-4 text-foreground leading-tight">Nameless<br/>Testimonials.</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-light mb-6">
                    Your testimonials are attributed to generic titles (e.g., "Director"). In a high-stakes B2B market, anonymous praise is interpreted as fabricated praise.
                  </p>
                </div>
                <div className="bg-muted/50 p-4 border-l-2 border-muted-foreground/30 text-xs text-muted-foreground italic">
                  "Great service." (Director, Tech Firm)
                  <span className="block mt-2 not-italic font-bold text-muted-foreground/60 text-[9px] uppercase tracking-wider">Buyer Reaction: "Fake."</span>
                </div>
              </div>

              {/* Fracture 02 */}
              <div className="border border-border p-8 flex flex-col">
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
              <div className="border border-destructive/30 bg-destructive/5 p-8 flex flex-col">
                <div>
                  <span className="font-mono text-[11px] text-destructive uppercase tracking-wider flex items-center gap-2 mb-4">
                    <svg className="w-3 h-3 animate-pulse" fill="currentColor" viewBox="0 0 20 20"><path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"/></svg>
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

        {/* Slide 17: Diagnosis Synthesis - The Value Inversion */}
        <Slide>
          <div className="max-w-7xl w-full h-full flex flex-col pt-4">
            <div className="mb-4">
              <SlideEyebrow>Diagnosis Synthesis</SlideEyebrow>
              <ActionTitle>The Value Inversion.</ActionTitle>
              <p className="font-light text-muted-foreground max-w-3xl leading-relaxed">
                The core error is not "Identity Confusion": it is <strong className="text-foreground">Strategic De-Positioning</strong>. You are currently highlighting your commodity features while hiding your scarcity assets.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-16 items-center">
              
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

        {/* Slide 20: Strategic Inflection - Compact Transformation List */}
        <Slide>
          <StaggeredContent className="max-w-7xl mx-auto w-full h-full flex flex-col">
            <AnimatedTitle>
              <div className="mb-6">
                <SlideEyebrow>Strategic Inflection</SlideEyebrow>
                <ActionTitle>Stop fighting "Gravity." Start selling "Friction."</ActionTitle>
                <p className="font-light text-muted-foreground max-w-2xl leading-relaxed text-sm">
                  You cannot win the "Speed" war against AI disruptors. You win the "Truth" war by becoming the necessary friction that verifies reality.
                </p>
              </div>
            </AnimatedTitle>

            {/* Compact 5-column grid */}
            <AnimatedContent className="grid grid-cols-5 gap-4">
              
              {/* Card 1: Physics */}
              <motion.div 
                className="group relative bg-gradient-to-b from-muted/40 to-muted/10 border border-border/50 p-5 flex flex-col hover:border-primary/30 transition-colors"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/60 to-transparent" />
                <span className="font-mono text-[9px] text-primary uppercase tracking-widest mb-2">01 Physics</span>
                <div className="mb-3">
                  <span className="text-xs text-muted-foreground/60 line-through">Competing on Speed</span>
                </div>
                <div className="mt-auto">
                  <h3 className="font-serif text-base text-foreground leading-tight mb-1">Competing on Verification</h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">From "How fast?" to "Is it real?"</p>
                </div>
              </motion.div>

              {/* Card 2: Role */}
              <motion.div 
                className="group relative bg-gradient-to-b from-muted/40 to-muted/10 border border-border/50 p-5 flex flex-col hover:border-primary/30 transition-colors"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                viewport={{ once: true }}
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/60 to-transparent" />
                <span className="font-mono text-[9px] text-primary uppercase tracking-widest mb-2">02 Role</span>
                <div className="mb-3">
                  <span className="text-xs text-muted-foreground/60 line-through">Midstream Execution</span>
                </div>
                <div className="mt-auto">
                  <h3 className="font-serif text-base text-foreground leading-tight mb-1">Downstream Intelligence</h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">From "Arms & Legs" to "Brains."</p>
                </div>
              </motion.div>

              {/* Card 3: Evidence */}
              <motion.div 
                className="group relative bg-gradient-to-b from-muted/40 to-muted/10 border border-border/50 p-5 flex flex-col hover:border-primary/30 transition-colors"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/60 to-transparent" />
                <span className="font-mono text-[9px] text-primary uppercase tracking-widest mb-2">03 Evidence</span>
                <div className="mb-3">
                  <span className="text-xs text-muted-foreground/60 line-through">"Adjective Addiction"</span>
                </div>
                <div className="mt-auto">
                  <h3 className="font-serif text-base text-foreground leading-tight mb-1">Whistleblower Authority</h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">Expose fraud, not fluff.</p>
                </div>
              </motion.div>

              {/* Card 4: Sales */}
              <motion.div 
                className="group relative bg-gradient-to-b from-muted/40 to-muted/10 border border-border/50 p-5 flex flex-col hover:border-primary/30 transition-colors"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                viewport={{ once: true }}
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/60 to-transparent" />
                <span className="font-mono text-[9px] text-primary uppercase tracking-widest mb-2">04 Sales</span>
                <div className="mb-3">
                  <span className="text-xs text-muted-foreground/60 line-through">"Black Box" Quotes</span>
                </div>
                <div className="mt-auto">
                  <h3 className="font-serif text-base text-foreground leading-tight mb-1">"Trojan Horse" Access</h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">Capture before the RFP.</p>
                </div>
              </motion.div>

              {/* Card 5: Value */}
              <motion.div 
                className="group relative bg-gradient-to-b from-muted/40 to-muted/10 border border-border/50 p-5 flex flex-col hover:border-primary/30 transition-colors"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/60 to-transparent" />
                <span className="font-mono text-[9px] text-primary uppercase tracking-widest mb-2">05 Value</span>
                <div className="mb-3">
                  <span className="text-xs text-muted-foreground/60 line-through">Data Collection</span>
                </div>
                <div className="mt-auto">
                  <h3 className="font-serif text-base text-foreground leading-tight mb-1">"CMO Insurance"</h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">Selling risk mitigation.</p>
                </div>
              </motion.div>

            </AnimatedContent>

            {/* Footer */}
            <AnimatedInsight className="mt-6 pt-5 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                </div>
                <span className="text-xs text-primary font-semibold uppercase tracking-widest">The Net Result</span>
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                This pivot moves Mavrix from a <strong className="text-foreground">"Price Taker"</strong> (Commodity) to a <strong className="text-foreground">"Price Maker"</strong> (Specialist).
              </div>
            </AnimatedInsight>

          </StaggeredContent>
        </Slide>

        {/* Slide 21: Focus Themes */}
        <Slide>
          <StaggeredContent className="max-w-7xl mx-auto w-full h-full flex flex-col">
            <AnimatedTitle>
              <SlideEyebrow>Focus Themes</SlideEyebrow>
              <ActionTitle>Three tactical inventions to break the inertia.</ActionTitle>
            </AnimatedTitle>

            {/* Horizontal layout with staggered heights */}
            <AnimatedContent className="flex gap-6 items-start">
              
              {/* Theme 01: Integrity */}
              <motion.div 
                className="flex-1 bg-gradient-to-b from-muted/30 to-transparent border border-border/60 p-6 relative group"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary/80 to-primary/20" />
                <span className="font-mono text-[10px] text-primary uppercase tracking-[0.2em] mb-3 block font-semibold">01 // Integrity</span>
                <h3 className="font-serif text-xl text-foreground mb-3 leading-tight">The "Total Quality" Warranty.</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Position Mavrix as the only partner who guarantees the <em>integrity</em> of the respondent, not just their existence. If there is doubt, we replace.
                </p>
                <div className="bg-primary/10 border border-primary/20 p-4 mt-auto">
                  <span className="text-[9px] uppercase tracking-widest text-primary block mb-1 font-bold">Mechanism</span>
                  <h4 className="text-sm font-semibold text-foreground">"The Zero-Argument Replacement"</h4>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">Flag a respondent for any reason—we replace them instantly. No debate.</p>
                </div>
              </motion.div>

              {/* Theme 02: Authority - slightly taller */}
              <motion.div 
                className="flex-1 bg-gradient-to-b from-primary/5 to-transparent border border-primary/30 p-6 relative group -mt-2"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="absolute top-0 left-0 w-full h-[3px] bg-primary" />
                <span className="font-mono text-[10px] text-primary uppercase tracking-[0.2em] mb-3 block font-semibold">02 // Authority</span>
                <h3 className="font-serif text-xl text-foreground mb-3 leading-tight">The "Quality Index."</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Use your 22 years of data to create the industry standard "Quality Index." A recurring publication that industry bodies will co-brand, instantly elevating Mavrix's profile.
                </p>
                <div className="bg-primary/10 border border-primary/20 p-4 mt-auto">
                  <span className="text-[9px] uppercase tracking-widest text-primary block mb-1 font-bold">Mechanism</span>
                  <h4 className="text-sm font-semibold text-foreground">"The Mavrix Blocklist Report"</h4>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">A quarterly index on what we block—positioning us as the industry's R&D lab.</p>
                </div>
              </motion.div>

              {/* Theme 03: Commerce */}
              <motion.div 
                className="flex-1 bg-gradient-to-b from-muted/30 to-transparent border border-border/60 p-6 relative group"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary/20 to-primary/80" />
                <span className="font-mono text-[10px] text-primary uppercase tracking-[0.2em] mb-3 block font-semibold">03 // Commerce</span>
                <h3 className="font-serif text-xl text-foreground mb-3 leading-tight">The "White-Glove" Rescue.</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  When low-cost vendors stall, it's a crisis. Offer a premium "Fieldwork Recovery" tier: a strategic takeover with a guaranteed completion plan.
                </p>
                <div className="bg-primary/10 border border-primary/20 p-4 mt-auto">
                  <span className="text-[9px] uppercase tracking-widest text-primary block mb-1 font-bold">Mechanism</span>
                  <h4 className="text-sm font-semibold text-foreground">"Mavrix 911"</h4>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">"Stuck in field? Call us." Senior methodologists guarantee the close.</p>
                </div>
              </motion.div>

            </AnimatedContent>

          </StaggeredContent>
        </Slide>

        {/* Slide 22: The Leverage Matrix - Mavrix */}
        <Slide>
          <div className="max-w-7xl w-full h-full flex flex-col">
            <SlideEyebrow>The Leverage Matrix</SlideEyebrow>
            <ActionTitle>Exploiting the "Silent Failures" of the giants.</ActionTitle>
            
            {/* Quadrant-style matrix layout */}
            <div className="flex-1 grid grid-cols-[1fr_2px_1fr] gap-0 border border-border bg-background overflow-hidden" style={{ maxHeight: '420px' }}>
              
              {/* Left Column - Their Failures */}
              <div className="flex flex-col">
                <div className="bg-muted/50 px-6 py-3 border-b border-border">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-destructive font-bold">Their Silent Failures</span>
                </div>
                
                {/* Row 1 */}
                <div className="flex-1 px-6 py-4 border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <div className="flex items-start gap-3 mb-2">
                    <span className="font-mono text-[9px] text-muted-foreground bg-muted px-2 py-0.5 rounded">Tech Platforms</span>
                    <span className="text-[10px] text-muted-foreground">Qualtrics, Cint, Lucid</span>
                  </div>
                  <h4 className="font-serif text-lg text-foreground mb-1">The "Feasibility Mirage."</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">APIs promise infinite reach. But algorithms don't recruit. Projects stall at N=400 because the "estimated" respondents don't exist.</p>
                </div>
                
                {/* Row 2 */}
                <div className="flex-1 px-6 py-4 border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <div className="flex items-start gap-3 mb-2">
                    <span className="font-mono text-[9px] text-muted-foreground bg-muted px-2 py-0.5 rounded">Legacy Giants</span>
                    <span className="text-[10px] text-muted-foreground">Dynata, Kantar, Ipsos</span>
                  </div>
                  <h4 className="font-serif text-lg text-foreground mb-1">The "Blended Haze."</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">Too big to fill every quote with proprietary sample. ~40% is brokered out to third parties. "Premium" is actually "Mystery Meat."</p>
                </div>
                
                {/* Row 3 */}
                <div className="flex-1 px-6 py-4 hover:bg-muted/20 transition-colors">
                  <div className="flex items-start gap-3 mb-2">
                    <span className="font-mono text-[9px] text-muted-foreground bg-muted px-2 py-0.5 rounded">Budget DIY</span>
                    <span className="text-[10px] text-muted-foreground">Pollfish, SurveyMonkey</span>
                  </div>
                  <h4 className="font-serif text-lg text-foreground mb-1">The "Clean-Up Tax."</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">CPI is $2.00 but data is 40% bots. Clients save on platform but lose 3 weeks scrubbing Excel files.</p>
                </div>
              </div>
              
              {/* Divider */}
              <div className="bg-primary relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-background px-2 py-1 -rotate-90 whitespace-nowrap">
                  <span className="font-mono text-[9px] uppercase tracking-widest font-bold">vs.</span>
                </div>
              </div>
              
              {/* Right Column - Mavrix Leverage */}
              <div className="flex flex-col bg-primary/5">
                <div className="px-6 py-3 border-b border-primary/20">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">Mavrix Leverage</span>
                </div>
                
                {/* Row 1 */}
                <div className="flex-1 px-6 py-4 border-b border-primary/10 hover:bg-primary/10 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="font-mono text-[9px] text-primary uppercase tracking-widest font-semibold">Operational Reality</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">We don't sell "Estimates." We sell "Completes." The <strong className="text-foreground">Mavrix 911</strong> protocol manually recruits the missing N=100.</p>
                </div>
                
                {/* Row 2 */}
                <div className="flex-1 px-6 py-4 border-b border-primary/10 hover:bg-primary/10 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="font-mono text-[9px] text-primary uppercase tracking-widest font-semibold">Chain of Custody</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">Radical transparency. We name every partner. The <strong className="text-foreground">Quality Index</strong> proves the pedigree.</p>
                </div>
                
                {/* Row 3 */}
                <div className="flex-1 px-6 py-4 hover:bg-primary/10 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="font-mono text-[9px] text-primary uppercase tracking-widest font-semibold">Total Cost of Validity</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">Expensive on CPI, cheaper on TCO. With our <strong className="text-foreground">Total Quality Warranty</strong>, data arrives clean.</p>
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
            
            {/* Timeline-style horizontal layout */}
            <div className="flex-1 flex flex-col">
              {/* Timeline header */}
              <div className="flex items-center mb-6">
                <div className="flex-1 h-px bg-border"></div>
                <span className="px-4 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Functional Transformation</span>
                <div className="flex-1 h-px bg-border"></div>
              </div>
              
              {/* Three columns with connecting line */}
              <div className="relative">
                {/* Connecting line */}
                <div className="absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-border via-primary to-border"></div>
                
                <div className="grid grid-cols-3 gap-8">
                  {/* Function 01: Marketing */}
                  <div className="relative">
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-background border-2 border-primary z-10"></div>
                    <div className="pt-14 text-center">
                      <span className="inline-block font-mono text-[10px] text-muted-foreground bg-muted px-3 py-1 mb-4">Function 01</span>
                      <h3 className="font-serif text-xl text-foreground mb-2">Marketing</h3>
                      <p className="text-xs text-muted-foreground mb-4">→ The "Intel" Engine</p>
                    </div>
                    <div className="bg-muted/30 p-5 border-l-2 border-border">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-destructive text-sm">✗</span>
                        <span className="text-sm text-muted-foreground line-through">Sales Support & Brochures</span>
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-primary text-sm">✓</span>
                        <span className="text-sm text-foreground font-medium">Editorial Newsroom</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">Mining 22 years of internal data to publish the "Blocklist" and "Quality Index."</p>
                      <div className="bg-primary/10 px-3 py-2 border-l-2 border-primary">
                        <span className="text-[9px] uppercase tracking-widest text-primary font-bold block">Key Hire</span>
                        <span className="text-sm font-semibold text-foreground">Data Journalist</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Function 02: Operations */}
                  <div className="relative">
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary z-10 shadow-[0_0_12px_hsl(var(--primary)/0.4)]"></div>
                    <div className="pt-14 text-center">
                      <span className="inline-block font-mono text-[10px] text-background bg-primary px-3 py-1 mb-4 font-semibold">Function 02</span>
                      <h3 className="font-serif text-xl text-foreground mb-2">Operations</h3>
                      <p className="text-xs text-muted-foreground mb-4">→ The "Rescue" Squad</p>
                    </div>
                    <div className="bg-foreground text-background p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-destructive text-sm">✗</span>
                        <span className="text-sm text-muted-foreground line-through">Generalist Project Pool</span>
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-primary text-sm">✓</span>
                        <span className="text-sm text-background font-medium">"Tiger Team" Split</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">A dedicated rapid-response unit solely for <strong className="text-background">Mavrix 911</strong> interventions.</p>
                      <div className="bg-primary/20 px-3 py-2 border-l-2 border-primary">
                        <span className="text-[9px] uppercase tracking-widest text-primary font-bold block">Key Assignment</span>
                        <span className="text-sm font-semibold text-background">Senior Methodologists</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Function 03: Quality */}
                  <div className="relative">
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-background border-2 border-primary z-10"></div>
                    <div className="pt-14 text-center">
                      <span className="inline-block font-mono text-[10px] text-muted-foreground bg-muted px-3 py-1 mb-4">Function 03</span>
                      <h3 className="font-serif text-xl text-foreground mb-2">Quality</h3>
                      <p className="text-xs text-muted-foreground mb-4">→ The "Integrity" Office</p>
                    </div>
                    <div className="bg-muted/30 p-5 border-r-2 border-border">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-destructive text-sm">✗</span>
                        <span className="text-sm text-muted-foreground line-through">Back-End Checks</span>
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-primary text-sm">✓</span>
                        <span className="text-sm text-foreground font-medium">Productized QA</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">Owning the <strong className="text-foreground">Identity Warranty</strong> and managing the replacement budget.</p>
                      <div className="bg-primary/10 px-3 py-2 border-l-2 border-primary">
                        <span className="text-[9px] uppercase tracking-widest text-primary font-bold block">Key Promotion</span>
                        <span className="text-sm font-semibold text-foreground">Fraud Analysts → Product Owners</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Slide>

        {/* Slide 24: Governance Signals */}
        <Slide>
          <StaggeredContent className="max-w-7xl w-full h-full flex flex-col">
            <AnimatedTitle>
              <SlideEyebrow>Governance Signals</SlideEyebrow>
              <ActionTitle>Three commitments to operational integrity.</ActionTitle>
            </AnimatedTitle>
            
            <AnimatedContent className="grid grid-cols-3 gap-10">
              {/* Signal 1: Accountability */}
              <motion.div 
                className="flex flex-col border border-border bg-background overflow-hidden"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="h-1 w-full bg-border" />
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
              </motion.div>

              {/* Signal 2: Methodology */}
              <motion.div 
                className="flex flex-col border border-border bg-background overflow-hidden"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="h-1 w-full bg-border" />
                <div className="p-8 flex-1 flex flex-col">
                  <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest block mb-4">Signal 02 // Methodology</span>
                  <h3 className="font-serif text-2xl text-foreground mb-4 leading-tight">The "Anti-Slop" Doctrine.</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    Stop hiding behind "Tech." Embrace "Effort." When AI shortcuts fail (as they often do), we deploy the Crew. Buses, phone banks, renting halls: we do <strong className="text-foreground">Whatever It Takes</strong> to get real people, not lazy digital proxies.
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
              </motion.div>

              {/* Signal 3: Validation */}
              <motion.div 
                className="flex flex-col border border-border bg-background overflow-hidden"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="h-1 w-full bg-border" />
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
              </motion.div>
            </AnimatedContent>
          </StaggeredContent>
        </Slide>

        {/* Slide 25: Executive Closing */}
        <Slide>
          <StaggeredContent className="max-w-7xl w-full h-full flex flex-col pt-4">
            <div className="grid grid-cols-3 gap-20 h-full items-end">
              
              {/* Left Column - Main Message */}
              <AnimatedTitle className="col-span-2 flex flex-col justify-center h-full">
                <motion.div 
                  className="w-24 h-1 bg-primary mb-8"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  style={{ transformOrigin: 'left' }}
                />
                
                <motion.h2 
                  className="font-serif text-6xl lg:text-7xl text-foreground leading-[1] mb-2 tracking-tight"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  Where generic service ends,
                </motion.h2>
                <motion.h2 
                  className="font-serif text-6xl lg:text-7xl italic text-primary leading-[1] tracking-tight"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  Authority begins.
                </motion.h2>
                
                <AnimatedContent>
                  <p className="font-sans text-lg text-muted-foreground font-light leading-relaxed max-w-[650px] mt-8 mb-16">
                    This assessment is not an indictment of capability; it is a roadmap to recognition. The market is drowning in "AI Slop" and actively seeking a high-fidelity leader. Mavrix is operationally positioned to take that mantle, if it chooses to speak clearly.
                  </p>
                </AnimatedContent>

                {/* Three Pivot Steps */}
                <AnimatedInsight className="grid grid-cols-3 gap-8 border-t border-border pt-8">
                  <motion.div 
                    className="border-l-2 border-primary pl-5"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <span className="font-mono text-[10px] text-primary uppercase tracking-[0.15em] block mb-2">Pivot 01</span>
                    <h3 className="font-sans text-base font-semibold text-foreground mb-1">The Narrative</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Shift from "Smart Tech" to <strong className="text-foreground">"Zero-Risk."</strong> Own the "Anti-Slop" position.
                    </p>
                  </motion.div>
                  <motion.div 
                    className="border-l-2 border-primary pl-5"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    viewport={{ once: true }}
                  >
                    <span className="font-mono text-[10px] text-primary uppercase tracking-[0.15em] block mb-2">Pivot 02</span>
                    <h3 className="font-sans text-base font-semibold text-foreground mb-1">The Proof</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Launch the <strong className="text-foreground">"Sanitation Log"</strong> and "Quality Index" to prove the work.
                    </p>
                  </motion.div>
                  <motion.div 
                    className="border-l-2 border-primary pl-5"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    viewport={{ once: true }}
                  >
                    <span className="font-mono text-[10px] text-primary uppercase tracking-[0.15em] block mb-2">Pivot 03</span>
                    <h3 className="font-sans text-base font-semibold text-foreground mb-1">The Commerce</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Deploy <strong className="text-foreground">"Mavrix 911"</strong> and tiered transparency to reduce friction.
                    </p>
                  </motion.div>
                </AnimatedInsight>
              </AnimatedTitle>

              {/* Right Column - Impact Metrics */}
              <AnimatedInsight className="flex flex-col gap-6 border-l border-border pl-12 h-full justify-end pb-8">
                
                <motion.div 
                  className="bg-muted/30 p-6 rounded"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-2">Financial Upside</span>
                  <div className="font-serif text-4xl text-primary mb-2">
                    +$<CountingNumber value={1600000} suffix="" className="" duration={2} />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Projected incremental revenue from "Rescue" services and improved win-rates (195% ROI).
                  </p>
                </motion.div>

                <motion.div 
                  className="bg-background border border-border p-6 rounded"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block mb-2">Strategic Upside</span>
                  <div className="font-serif text-2xl text-foreground mb-2">Future-Proofing</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Structural immunity against AI commoditization by owning the "Human Verification" moat.
                  </p>
                </motion.div>

                <motion.div 
                  className="bg-primary/10 p-6 border-l-4 border-primary"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  viewport={{ once: true }}
                >
                  <span className="font-mono text-[10px] font-bold text-primary uppercase tracking-widest block mb-2">Next Step</span>
                  <p className="text-sm text-foreground leading-relaxed font-medium">
                    Approve the 90-Day Sprint to align engineering and marketing on Week 1 deliverables.
                  </p>
                </motion.div>
                
                {/* Footer with Rubiklab branding */}
                <div className="flex justify-end items-center pt-6 border-t border-border mt-auto">
                  <div className="flex items-center gap-1.5 text-foreground">
                    <span className="font-serif font-bold text-xl tracking-tight lowercase">Rubiklab</span>
                    <div className="relative flex items-center justify-center">
                      <div className="absolute w-2.5 h-2.5 bg-primary rounded-full animate-ping opacity-20"></div>
                      <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_12px_hsl(var(--primary)/0.3)]"></div>
                    </div>
                  </div>
                </div>
              </AnimatedInsight>

            </div>
          </StaggeredContent>
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
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-2.5 h-2.5 bg-primary rounded-full animate-ping opacity-20"></div>
                  <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_12px_hsl(var(--primary)/0.3)]"></div>
                </div>
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
                      <span className="font-mono text-[9px] text-primary bg-primary/10 border border-primary/30 px-2 py-0.5 uppercase animate-pulse">High Impact</span>
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
                      <span className="font-mono text-[9px] text-primary bg-primary/10 border border-primary/30 px-2 py-0.5 uppercase animate-pulse">High Impact</span>
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
                    Rubiklab Health Score. Passing threshold for Enterprise vendors is 75+.
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

        {/* Appendix C: UX Friction Analysis */}
        <Slide>
          <div className="max-w-7xl w-full h-full flex flex-col">
            <SlideEyebrow>Appendix C: UX Friction Analysis</SlideEyebrow>
            <ActionTitle>Cosmetic choices are creating operational drag.</ActionTitle>
            
            <p className="text-base text-muted-foreground max-w-3xl mb-10">
              Beyond technical performance, specific design choices are actively confusing users and diluting the value proposition. These are "Low Effort, High Impact" fixes.
            </p>

            <div className="grid md:grid-cols-12 gap-8">
              {/* Three Action Cards */}
              <div className="col-span-9 grid md:grid-cols-3 gap-6">
                {/* Card 01: Visual Noise */}
                <div className="border border-border bg-background flex flex-col">
                  <div className="p-5 flex-1 border-l-4 border-primary bg-muted/30 flex flex-col">
                    <span className="font-mono text-[10px] text-primary uppercase tracking-widest mb-2">01. Visual Noise</span>
                    <h3 className="font-serif text-xl text-foreground mb-3">The "Marquee" Distraction</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                      <strong className="text-foreground">Issue:</strong> The repetitive "Azure is now Mavrix" scrolling banner consumes prime visual real estate for administrative news, distracting from the value prop.
                    </p>
                    <div className="space-y-1 text-[11px] text-muted-foreground mb-4">
                      <div className="relative pl-4 before:content-['→'] before:absolute before:left-0 before:text-muted-foreground/50">Remove scrolling banner completely</div>
                      <div className="relative pl-4 before:content-['→'] before:absolute before:left-0 before:text-muted-foreground/50">Move rebrand notice to "About"</div>
                    </div>
                    <div className="mt-auto pt-4 border-t border-border">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Impact</span>
                      <span className="text-base font-semibold text-primary">Focus Restoration</span>
                    </div>
                  </div>
                  <div className="p-4 border-t border-border">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Owner</span>
                    <span className="text-sm font-medium text-foreground">Frontend Dev</span>
                  </div>
                </div>

                {/* Card 02: Layout Logic */}
                <div className="border border-border bg-background flex flex-col">
                  <div className="p-5 flex-1 border-l-4 border-primary bg-muted/30 flex flex-col">
                    <span className="font-mono text-[10px] text-primary uppercase tracking-widest mb-2">02. Layout Logic</span>
                    <h3 className="font-serif text-xl text-foreground mb-3">Buried Services</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                      <strong className="text-foreground">Issue:</strong> Core offerings (Surveys, Focus Groups) are pushed below the fold. Users must scroll past stats and "Why Us" just to learn what you actually do.
                    </p>
                    <div className="space-y-1 text-[11px] text-muted-foreground mb-4">
                      <div className="relative pl-4 before:content-['→'] before:absolute before:left-0 before:text-muted-foreground/50">Move "Service Summary" below Hero</div>
                      <div className="relative pl-4 before:content-['→'] before:absolute before:left-0 before:text-muted-foreground/50">Add direct links to service pages</div>
                    </div>
                    <div className="mt-auto pt-4 border-t border-border">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Impact</span>
                      <span className="text-base font-semibold text-primary">Instant Relevance</span>
                    </div>
                  </div>
                  <div className="p-4 border-t border-border">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Owner</span>
                    <span className="text-sm font-medium text-foreground">UX Design</span>
                  </div>
                </div>

                {/* Card 03: Asset Weight */}
                <div className="border border-border bg-background flex flex-col">
                  <div className="p-5 flex-1 border-l-4 border-primary bg-muted/30 flex flex-col">
                    <span className="font-mono text-[10px] text-primary uppercase tracking-widest mb-2">03. Asset Weight</span>
                    <h3 className="font-serif text-xl text-foreground mb-3">The "AI Image" Tax</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                      <strong className="text-foreground">Issue:</strong> High-res, unoptimized AI stock imagery forces mobile users to "scroll through heavy slop." It degrades performance and feels inauthentic.
                    </p>
                    <div className="space-y-1 text-[11px] text-muted-foreground mb-4">
                      <div className="relative pl-4 before:content-['→'] before:absolute before:left-0 before:text-muted-foreground/50">Replace heavy PNGs with WebP</div>
                      <div className="relative pl-4 before:content-['→'] before:absolute before:left-0 before:text-muted-foreground/50">Swap AI visuals for real team photos</div>
                    </div>
                    <div className="mt-auto pt-4 border-t border-border">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Impact</span>
                      <span className="text-base font-semibold text-primary">Mobile Agility</span>
                    </div>
                  </div>
                  <div className="p-4 border-t border-border">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">Owner</span>
                    <span className="text-sm font-medium text-foreground">Design + Engineering</span>
                  </div>
                </div>
              </div>
              
              {/* Right Rail */}
              <div className="col-span-3 border-l border-border pl-6 flex flex-col gap-6">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground block mb-3">Implementation</span>
                  <div className="font-serif text-4xl text-foreground leading-none mb-2">Week 1</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    These UX patches require no backend logic changes.
                  </p>
                </div>

                <div className="bg-primary/10 p-4 border-l-2 border-primary">
                  <span className="font-mono text-[10px] font-bold text-primary uppercase tracking-widest block mb-2">Why It Matters</span>
                  <p className="text-xs text-foreground leading-relaxed">
                    Reducing visual friction keeps the C-Suite on the page long enough to see the "911 Rescue" offer.
                  </p>
                </div>

                <div>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground block mb-3">Rubiklab Score Lift</span>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs border-b border-border/50 pb-2">
                      <span className="text-muted-foreground">Remove Marquee</span>
                      <span className="text-primary font-semibold">+3 Points</span>
                    </div>
                    <div className="flex justify-between text-xs border-b border-border/50 pb-2">
                      <span className="text-muted-foreground">Move Services Up</span>
                      <span className="text-primary font-semibold">+5 Points</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Optimize Images</span>
                      <span className="text-primary font-semibold">+10 Points</span>
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
