import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Download, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { 
  CursorGlow, 
  StaggeredContent, 
  AnimatedTitle, 
  AnimatedContent, 
  AnimatedInsight,
  CountingNumber
} from "./SlideAnimations";

// Slide component for consistent layout
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
  <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-primary mb-3 block font-bold">
    {children}
  </span>
);

// Action title component
const ActionTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h2 className={cn("font-serif font-normal text-4xl lg:text-5xl leading-[1.15] mb-10 text-foreground max-w-[1000px]", className)}>
    {children}
  </h2>
);

// Body text component
const BodyText = ({ children }: { children: React.ReactNode }) => (
  <p className="font-sans text-xl lg:text-2xl text-foreground leading-relaxed max-w-4xl">
    {children}
  </p>
);

// Card component for grid layouts
const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-muted/30 border border-border p-6 h-full flex flex-col">
    <h3 className="font-serif text-xl text-foreground mb-3">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed">{children}</p>
  </div>
);

// Line item component for stacked lists
const LineItem = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="border-b border-border py-4 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-2">
    <span className="font-serif text-lg text-foreground">{title}</span>
    <span className="text-sm text-muted-foreground lg:text-right lg:max-w-md">{subtitle}</span>
  </div>
);

// Dark cover slide for the report
const CoverSlide = ({ onNavigateHome }: { onNavigateHome: () => void }) => (
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
      <div className="font-mono text-[9px] text-primary uppercase tracking-widest">
        Inside Practice Presents
      </div>
    </div>

    {/* Main content */}
    <div className="relative z-10 flex-grow flex flex-col justify-center">
      <div className="border-l-4 border-primary pl-12 py-4">
        <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl text-white leading-[0.95] tracking-tight mb-6">
          from retrieval<br />
          <span className="italic text-primary">to reliability.</span>
        </h1>
        <p className="font-serif text-2xl lg:text-3xl text-gray-400 italic">
          making RAG work in law firms
        </p>
      </div>
      
      <div className="mt-12 pl-12 space-y-2">
        <p className="font-mono text-sm text-gray-500">Fri, Jan 23, 2026 · online</p>
        <p className="font-mono text-sm text-gray-400">Zsolt Apponyi and Illitch Real · Rubiklab</p>
        <p className="font-mono text-xs text-gray-600 mt-4">insidepractice.com/making-rag-work-in-law-firms</p>
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

// Section divider component
const SectionDivider = ({ 
  title, 
  subtitle
}: { 
  title: string; 
  subtitle: string;
}) => (
  <div data-divider="true" className="w-screen h-screen flex-shrink-0 bg-[#000000] text-white relative flex flex-col justify-center items-center overflow-hidden">
    {/* Grid background */}
    <div 
      className="absolute inset-0 pointer-events-none opacity-20"
      style={{
        backgroundImage: 'linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)',
        backgroundSize: '120px 120px'
      }}
    />
    
    <div className="relative z-10 text-center">
      <div className="w-[1px] h-16 bg-primary mb-10 mx-auto" />
      <h2 className="font-serif text-6xl lg:text-7xl text-white mb-6">
        {title}<span className="text-primary">.</span>
      </h2>
      <p className="font-sans text-xl text-gray-400 font-light leading-relaxed max-w-lg mx-auto">
        {subtitle}
      </p>
    </div>
    
    {/* Footer with logo */}
    <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
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
  
  const [totalSlides, setTotalSlides] = useState(0);
  
  useEffect(() => {
    if (containerRef.current) {
      const slides = containerRef.current.querySelectorAll('[data-slide="true"], [data-cover="true"], [data-divider="true"]');
      setTotalSlides(slides.length);
    }
  }, []);

  const navigateToSlide = useCallback((index: number) => {
    if (isAnimating.current) return;
    if (index < 0 || index >= totalSlides) return;
    
    isAnimating.current = true;
    setCurrentSlide(index);
    
    setTimeout(() => {
      isAnimating.current = false;
    }, 500);
  }, [totalSlides]);

  const nextSlide = useCallback(() => {
    navigateToSlide(Math.min(currentSlide + 1, totalSlides - 1));
  }, [currentSlide, totalSlides, navigateToSlide]);

  const prevSlide = useCallback(() => {
    navigateToSlide(Math.max(currentSlide - 1, 0));
  }, [currentSlide, navigateToSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Escape') {
        navigate('/');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, navigate]);

  // Wheel navigation
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
      
      const animatedElements = containerRef.current.querySelectorAll('[class*="opacity-0"], [style*="opacity: 0"]');
      const originalStyles: { el: Element; opacity: string; transform: string }[] = [];
      
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
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const captureSlide = async (slide: Element): Promise<string> => {
        const htmlSlide = slide as HTMLElement;
        const originalSlideOpacity = htmlSlide.style.opacity;
        htmlSlide.style.opacity = '1';
        
        const children = htmlSlide.querySelectorAll('*');
        children.forEach((child) => {
          const htmlChild = child as HTMLElement;
          if (htmlChild.style.opacity === '0' || getComputedStyle(htmlChild).opacity === '0') {
            htmlChild.style.opacity = '1';
          }
        });
        
        await new Promise(resolve => setTimeout(resolve, 50));
        
        const canvas = await html2canvas(htmlSlide, {
          scale: 1.5,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
          onclone: (clonedDoc) => {
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
      
      originalStyles.forEach(({ el, opacity, transform }) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.opacity = opacity;
        htmlEl.style.transform = transform;
      });
      
      const dateStr = new Date().toISOString().split("T")[0];
      pdf.save(`Rubiklab_RAG-Reliability_${dateStr}.pdf`);
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
      {/* Subtle cursor glow effect */}
      <CursorGlow />
      
      {/* Horizontal sliding container */}
      <div 
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}vw)` }}
      >
        {/* ============================================== */}
        {/* SLIDE 01: Cover                               */}
        {/* ============================================== */}
        <CoverSlide onNavigateHome={() => navigate('/')} />

        {/* ============================================== */}
        {/* SLIDE 02: Why This Session Exists             */}
        {/* ============================================== */}
        <Slide>
          <StaggeredContent className="max-w-5xl w-full h-full flex flex-col justify-center">
            <AnimatedTitle>
              <SlideEyebrow>Why This Session Exists</SlideEyebrow>
              <ActionTitle>why RAG fails law firms</ActionTitle>
            </AnimatedTitle>
            
            <AnimatedContent>
              <BodyText>
                Many firms find that RAG rarely delivers the consistency, confidence, or reliability they were promised.
                The problem is not RAG itself.
                The problem is the assumption that retrieval can compensate for deeper structural issues in how legal knowledge is created, stored, governed, and reused.
              </BodyText>
            </AnimatedContent>
          </StaggeredContent>
        </Slide>

        {/* ============================================== */}
        {/* SLIDE 03: Demo vs Production                  */}
        {/* ============================================== */}
        <Slide>
          <StaggeredContent className="max-w-5xl w-full h-full flex flex-col justify-center">
            <AnimatedTitle>
              <SlideEyebrow>Demo Versus Production</SlideEyebrow>
              <ActionTitle>it looked brilliant, then it fell apart</ActionTitle>
            </AnimatedTitle>
            
            <AnimatedContent>
              <BodyText>
                In demos, datasets are curated and questions are controlled.
                In production, documents are messy, edge cases appear, and there is no supervision.
                If lawyers still need to verify everything manually, adoption drops fast.
              </BodyText>
            </AnimatedContent>
          </StaggeredContent>
        </Slide>

        {/* ============================================== */}
        {/* SLIDE 04: Failure Pattern                     */}
        {/* ============================================== */}
        <Slide>
          <StaggeredContent className="max-w-5xl w-full h-full flex flex-col">
            <AnimatedTitle>
              <SlideEyebrow>Failure Pattern</SlideEyebrow>
              <ActionTitle>how RAG actually fails</ActionTitle>
            </AnimatedTitle>
            
            <AnimatedContent className="mt-8 space-y-0">
              <LineItem title="wrong jurisdiction" subtitle="precedent drifts across regimes and matter contexts" />
              <LineItem title="missing carve outs" subtitle="general rules without exceptions or recent amendments" />
              <LineItem title="outdated precedents" subtitle="overturned, distinguished, or superseded material resurfaces" />
              <LineItem title="indefensible sources" subtitle="confidence without clear attribution to authority" />
            </AnimatedContent>
          </StaggeredContent>
        </Slide>

        {/* ============================================== */}
        {/* SLIDE 05: Hallucination Moved                 */}
        {/* ============================================== */}
        <Slide>
          <StaggeredContent className="max-w-6xl w-full h-full flex flex-col">
            <AnimatedTitle>
              <SlideEyebrow>The Hidden Shift</SlideEyebrow>
              <ActionTitle>hallucination did not disappear, it moved</ActionTitle>
            </AnimatedTitle>
            
            <AnimatedInsight className="grid grid-cols-2 gap-6 mt-8">
              <Card title="noisy retrieval">
                too many tangential documents, sometimes conflicting, leaving the model to guess what matters.
              </Card>
              <Card title="bad documents">
                the system faithfully cites flawed, outdated, or incomplete sources, so the answer looks grounded but is wrong.
              </Card>
              <Card title="missing context">
                individual documents may be correct, yet the set lacks qualifications, boundaries, and the full scope required.
              </Card>
              <Card title="the result">
                answers that sound authoritative and still require expert review, which is exactly what RAG was meant to reduce.
              </Card>
            </AnimatedInsight>
          </StaggeredContent>
        </Slide>

        {/* ============================================== */}
        {/* SLIDE 06: Core Myth                           */}
        {/* ============================================== */}
        <Slide>
          <StaggeredContent className="max-w-5xl w-full h-full flex flex-col justify-center">
            <AnimatedTitle>
              <SlideEyebrow>Core Myth</SlideEyebrow>
              <ActionTitle>retrieval does not equal correctness</ActionTitle>
            </AnimatedTitle>
            
            <AnimatedContent>
              <BodyText>
                Retrieval is not authority, retrieval is not permission, and retrieval is not legal applicability.
                Similarity search is fundamentally not legal reasoning.
              </BodyText>
            </AnimatedContent>
          </StaggeredContent>
        </Slide>

        {/* ============================================== */}
        {/* SLIDE 07: Turning Point                       */}
        {/* ============================================== */}
        <Slide>
          <StaggeredContent className="max-w-5xl w-full h-full flex flex-col justify-center">
            <AnimatedTitle>
              <SlideEyebrow>Turning Point</SlideEyebrow>
              <ActionTitle>RAG is not broken</ActionTitle>
            </AnimatedTitle>
            
            <AnimatedContent>
              <BodyText>
                Knowledge foundations are.
                When the knowledge base is flawed, even the best model is forced to improvise around gaps.
                Reliability begins well before retrieval.
              </BodyText>
            </AnimatedContent>
          </StaggeredContent>
        </Slide>

        {/* ============================================== */}
        {/* DIVIDER: The Solution                         */}
        {/* ============================================== */}
        <SectionDivider 
          title="The Solution" 
          subtitle="What it takes to make RAG reliable in legal workflows"
        />

        {/* ============================================== */}
        {/* SLIDE 08: Legal Knowledge Reality             */}
        {/* ============================================== */}
        <Slide>
          <StaggeredContent className="max-w-6xl w-full h-full flex flex-col">
            <AnimatedTitle>
              <SlideEyebrow>Legal Knowledge Reality</SlideEyebrow>
              <ActionTitle>legal knowledge is fundamentally different</ActionTitle>
            </AnimatedTitle>
            
            <AnimatedInsight className="grid grid-cols-2 gap-6 mt-8">
              <Card title="fragmented">
                spread across precedents, statutes, practice notes, emails, and institutional memory.
              </Card>
              <Card title="purpose driven">
                applicability changes with intent, from research to litigation strategy to transactional drafting.
              </Card>
              <Card title="permission sensitive">
                ethical walls and matter level security are not optional features.
              </Card>
              <Card title="jurisdiction specific and evolving">
                boundaries alter meaning, and new rulings continuously invalidate prior understanding.
              </Card>
            </AnimatedInsight>
          </StaggeredContent>
        </Slide>

        {/* ============================================== */}
        {/* SLIDE 09: Legal Grade Stack                   */}
        {/* ============================================== */}
        <Slide>
          <StaggeredContent className="max-w-5xl w-full h-full flex flex-col">
            <AnimatedTitle>
              <SlideEyebrow>The Trust Chain</SlideEyebrow>
              <ActionTitle>the legal grade RAG stack</ActionTitle>
            </AnimatedTitle>
            
            <AnimatedContent className="mt-8 space-y-0">
              <LineItem title="curated knowledge base" subtitle="prepared, enriched, validated content with metadata" />
              <LineItem title="semantic indexing plus metadata" subtitle="hybrid search, not vectors alone" />
              <LineItem title="permission layer" subtitle="query time security validation before retrieval" />
              <LineItem title="context filter" subtitle="jurisdiction, practice area, and relevance scoping" />
              <LineItem title="generation with attribution" subtitle="citations with document metadata and confidence signals" />
            </AnimatedContent>
          </StaggeredContent>
        </Slide>

        {/* ============================================== */}
        {/* SLIDE 10: Preparation Layer                   */}
        {/* ============================================== */}
        <Slide>
          <StaggeredContent className="max-w-5xl w-full h-full flex flex-col">
            <AnimatedTitle>
              <SlideEyebrow>Core Insight</SlideEyebrow>
              <ActionTitle>the preparation layer is everything</ActionTitle>
            </AnimatedTitle>
            
            <AnimatedContent className="mt-8 space-y-0">
              <LineItem title="content normalisation" subtitle="standardise formats, extract clean text, remove artefacts" />
              <LineItem title="structural parsing" subtitle="sections, clauses, definitions, cross references" />
              <LineItem title="metadata enrichment" subtitle="practice area, jurisdiction, type, author, approval status" />
              <LineItem title="version control" subtitle="supersessions, current versus historical, change tracking" />
              <LineItem title="authority tagging" subtitle="firm approved guidance, precedential value, confidence levels" />
            </AnimatedContent>
          </StaggeredContent>
        </Slide>

        {/* ============================================== */}
        {/* SLIDE 11: Production Grade                    */}
        {/* ============================================== */}
        <Slide>
          <StaggeredContent className="max-w-6xl w-full h-full flex flex-col">
            <AnimatedTitle>
              <SlideEyebrow>Production Grade</SlideEyebrow>
              <ActionTitle>what turns concepts into a reliable system</ActionTitle>
            </AnimatedTitle>
            
            <AnimatedInsight className="grid grid-cols-2 gap-6 mt-8">
              <Card title="automated parsing pipelines">
                continuous ingestion, processing, updating, with quality validation.
              </Card>
              <Card title="structural segmentation engines">
                extract document hierarchy, relationships, and semantic units at clause level.
              </Card>
              <Card title="practice area taxonomies">
                classification aligned to the firm's structures and terminology.
              </Card>
              <Card title="cross document linking">
                maintain relationships between related legal content over time.
              </Card>
            </AnimatedInsight>
          </StaggeredContent>
        </Slide>

        {/* ============================================== */}
        {/* SLIDE 12: Authority and Freshness             */}
        {/* ============================================== */}
        <Slide>
          <StaggeredContent className="max-w-6xl w-full h-full flex flex-col">
            <AnimatedTitle>
              <SlideEyebrow>Authority and Freshness Control</SlideEyebrow>
              <ActionTitle>rank by authority, not by similarity</ActionTitle>
            </AnimatedTitle>
            
            <AnimatedInsight className="grid grid-cols-2 gap-6 mt-6">
              <Card title="author and reviewer identity">
                who drafted it, who approved it, and what expertise they hold.
              </Card>
              <Card title="temporal currency">
                when it was created, last substantively reviewed, and whether it is still current.
              </Card>
              <Card title="firm approval status">
                official guidance, working draft, or personal notes, treated differently by default.
              </Card>
              <Card title="supersession tracking">
                what newer documents, rulings, or guidance modify or replace it.
              </Card>
            </AnimatedInsight>
            
            <AnimatedContent className="mt-8">
              <p className="text-base text-muted-foreground italic border-l-2 border-primary pl-4">
                A highly relevant but outdated memorandum is worse than no answer.
              </p>
            </AnimatedContent>
          </StaggeredContent>
        </Slide>

        {/* ============================================== */}
        {/* SLIDE 13: Terminology Harmonisation           */}
        {/* ============================================== */}
        <Slide>
          <StaggeredContent className="max-w-6xl w-full h-full flex flex-col">
            <AnimatedTitle>
              <SlideEyebrow>Retrieval Quality</SlideEyebrow>
              <ActionTitle>aligning legal language across the firm</ActionTitle>
            </AnimatedTitle>
            
            <AnimatedContent>
              <BodyText>
                Law firms contain linguistic silos.
                These are not cosmetic differences, they create retrieval failures where relevant expertise exists but remains undiscoverable.
              </BodyText>
            </AnimatedContent>
            
            <AnimatedInsight className="grid grid-cols-2 gap-6 mt-10">
              <Card title="controlled vocabularies">
                canonical terms for key concepts across practice areas.
              </Card>
              <Card title="synonym mapping">
                mappings between alternative phrasings that mean the same thing.
              </Card>
              <Card title="terminology harmonisation">
                enrich documents with standardised tags while preserving original language.
              </Card>
              <Card title="practical effect">
                expertise becomes discoverable without changing how lawyers naturally write.
              </Card>
            </AnimatedInsight>
          </StaggeredContent>
        </Slide>

        {/* ============================================== */}
        {/* SLIDE 14: Governance Through Architecture     */}
        {/* ============================================== */}
        <Slide>
          <StaggeredContent className="max-w-6xl w-full h-full flex flex-col">
            <AnimatedTitle>
              <SlideEyebrow>Game Changer</SlideEyebrow>
              <ActionTitle>governance through architecture</ActionTitle>
            </AnimatedTitle>
            
            <AnimatedContent>
              <p className="font-sans text-lg text-muted-foreground leading-relaxed max-w-4xl mb-8">
                More context often yields worse answers.
                Aggressive context control and architectural governance improve both quality and security.
                This is not a compromise, it is what enables production trust.
              </p>
            </AnimatedContent>
            
            <AnimatedInsight className="grid grid-cols-3 gap-4">
              <Card title="jurisdiction filters">
                retrieve only content applicable to the relevant regime.
              </Card>
              <Card title="practice area scoping">
                constrain retrieval to domains where the query has legitimate application.
              </Card>
              <Card title="matter level permissions">
                respect engagement boundaries and work product privilege.
              </Card>
              <Card title="client isolation">
                absolute segregation that prevents cross client leakage.
              </Card>
              <Card title="permission aware retrieval">
                retrieve only what the user is authorised to view.
              </Card>
              <Card title="audit trails and ethical walls">
                immutable logs, architectural separation, and compliance by design.
              </Card>
            </AnimatedInsight>
          </StaggeredContent>
        </Slide>

        {/* ============================================== */}
        {/* SLIDE 15: Human in the Loop                   */}
        {/* ============================================== */}
        <Slide>
          <StaggeredContent className="max-w-5xl w-full h-full flex flex-col justify-center">
            <AnimatedTitle>
              <SlideEyebrow>Operating Model</SlideEyebrow>
              <ActionTitle>human in the loop is non negotiable</ActionTitle>
            </AnimatedTitle>
            
            <AnimatedContent>
              <BodyText>
                RAG does not replace lawyers.
                It augments judgement by accelerating research, drafting first passes from firm templates, and reducing mechanical tasks.
                Legal judgement remains central to applicability, risk, and strategy.
              </BodyText>
            </AnimatedContent>
          </StaggeredContent>
        </Slide>

        {/* ============================================== */}
        {/* SLIDE 16: Success Metrics                     */}
        {/* ============================================== */}
        <Slide>
          <StaggeredContent className="max-w-6xl w-full h-full flex flex-col">
            <AnimatedTitle>
              <SlideEyebrow>Measuring Success Properly</SlideEyebrow>
              <ActionTitle>move beyond impressive demos</ActionTitle>
            </AnimatedTitle>
            
            <AnimatedContent>
              <p className="font-sans text-lg text-muted-foreground leading-relaxed max-w-4xl mb-12">
                Evaluate value delivery and adoption, not benchmark theatre.
                Focus on time saved, error reduction, confidence, and integration into daily workflows.
              </p>
            </AnimatedContent>
            
            <AnimatedInsight className="grid grid-cols-3 gap-8">
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="font-serif text-6xl lg:text-7xl text-primary mb-4">
                  <CountingNumber value={40} suffix="%" className="" duration={1.5} />
                </div>
                <p className="text-sm text-muted-foreground">average research time reduction on routine tasks</p>
              </motion.div>
              
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="font-serif text-6xl lg:text-7xl text-primary mb-4">
                  <CountingNumber value={78} suffix="%" className="" duration={1.5} />
                </div>
                <p className="text-sm text-muted-foreground">weekly active users across a defined target group</p>
              </motion.div>
              
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="font-serif text-6xl lg:text-7xl text-primary mb-4">
                  <CountingNumber value={92} suffix="%" className="" duration={1.5} />
                </div>
                <p className="text-sm text-muted-foreground">lawyer confidence for client facing work, when trust signals are consistent</p>
              </motion.div>
            </AnimatedInsight>
          </StaggeredContent>
        </Slide>

        {/* ============================================== */}
        {/* SLIDE 17: Closing                             */}
        {/* ============================================== */}
        <Slide className="bg-[#050505]">
          <div className="max-w-5xl w-full h-full flex flex-col justify-center text-white">
            <SlideEyebrow>Closing</SlideEyebrow>
            
            <p className="font-serif text-3xl lg:text-4xl text-white leading-snug mb-12 italic">
              The problem is not RAG itself.<br />
              The problem is the assumption that retrieval can compensate for weak knowledge foundations.
            </p>
            
            <div className="bg-white/5 border border-white/10 p-8 max-w-3xl">
              <p className="font-sans text-lg text-gray-300 leading-relaxed">
                When foundations are disciplined and governance is architectural, RAG becomes legal intelligence infrastructure.
                It helps firms move faster, reduce risk, scale expertise, and win complex work without sacrificing defensibility.
              </p>
            </div>
            
            <div className="mt-16 flex items-center gap-1.5">
              <span className="font-serif font-bold text-4xl tracking-tight lowercase text-white">Rubiklab</span>
              <div className="relative flex items-center justify-center">
                <div className="absolute w-4 h-4 bg-primary rounded-full animate-ping opacity-20"></div>
                <div className="w-3 h-3 bg-primary rounded-full shadow-[0_0_12px_hsl(var(--primary)/0.3)]"></div>
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
              className="h-full bg-foreground transition-all duration-300"
              style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
            />
          </div>
          
          {/* Slide counter */}
          <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
            {String(currentSlide + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
          </span>
        </div>
      )}

      {/* Navigation arrows */}
      <div className="fixed bottom-6 left-6 z-50 flex gap-2 print-hide">
        <button 
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="w-10 h-10 flex items-center justify-center border border-border bg-background/80 backdrop-blur-sm hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button 
          onClick={nextSlide}
          disabled={currentSlide === totalSlides - 1}
          className="w-10 h-10 flex items-center justify-center border border-border bg-background/80 backdrop-blur-sm hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Download button */}
      <button
        onClick={handleDownload}
        disabled={isExporting}
        className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-card/80 backdrop-blur-sm border border-border hover:border-primary text-muted-foreground hover:text-foreground text-[10px] font-mono uppercase tracking-widest transition-all duration-300 print-hide disabled:opacity-50"
      >
        {isExporting ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>{progress}%</span>
          </>
        ) : (
          <>
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </>
        )}
      </button>
    </div>
  );
};

export default ReportSection;
