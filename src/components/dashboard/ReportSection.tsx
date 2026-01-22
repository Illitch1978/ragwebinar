import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { CursorGlow, CountingNumber } from "./SlideAnimations";

// Premium slide component with light background
const Slide = ({ 
  children, 
  className = "",
  dark = false
}: { 
  children: React.ReactNode; 
  className?: string;
  dark?: boolean;
}) => (
  <div 
    className={cn(
      "w-screen h-screen flex-shrink-0 relative flex flex-col overflow-hidden",
      dark ? "bg-[#0a0a0a]" : "bg-[#fafaf8]",
      className
    )}
    data-slide="true"
  >
    {/* Grid pattern only on dark slides */}
    {dark && (
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)',
          backgroundSize: '120px 120px'
        }}
      />
    )}
    
    {/* Content container with proper margins */}
    <div className="relative z-10 flex-1 flex flex-col px-16 lg:px-24 py-16 lg:py-20">
      {children}
    </div>
    
    {/* Footer */}
    <div className={cn(
      "relative z-10 px-16 lg:px-24 pb-8 flex justify-between items-end",
      dark ? "text-white/40" : "text-foreground/30"
    )}>
      <div className="flex items-center gap-1.5">
        <span className={cn(
          "font-serif font-bold text-xl tracking-tight lowercase",
          dark ? "text-white/60" : "text-foreground/50"
        )}>Rubiklab</span>
        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
      </div>
      <span className="font-mono text-[10px] uppercase tracking-widest">
        © 2026
      </span>
    </div>
  </div>
);

// Eyebrow component - clean uppercase label
const SlideEyebrow = ({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) => (
  <span className={cn(
    "font-mono text-[11px] uppercase tracking-[0.25em] mb-6 block",
    dark ? "text-primary" : "text-primary"
  )}>
    {children}
  </span>
);

// Main title component
const ActionTitle = ({ children, className, dark = false }: { children: React.ReactNode; className?: string; dark?: boolean }) => (
  <h2 className={cn(
    "font-serif text-[2.75rem] lg:text-[3.5rem] leading-[1.1] mb-8 tracking-tight max-w-4xl",
    dark ? "text-white" : "text-foreground",
    className
  )}>
    {children}
  </h2>
);

// Body text component
const BodyText = ({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) => (
  <p className={cn(
    "font-sans text-lg lg:text-xl leading-[1.7] max-w-3xl",
    dark ? "text-white/70" : "text-foreground/70"
  )}>
    {children}
  </p>
);

// Premium card component
const Card = ({ title, children, dark = false }: { title: string; children: React.ReactNode; dark?: boolean }) => (
  <div className={cn(
    "p-6 lg:p-8 h-full flex flex-col border-l-2",
    dark 
      ? "bg-white/[0.03] border-l-primary/40" 
      : "bg-white border-l-primary"
  )}>
    <h3 className={cn(
      "font-serif text-lg lg:text-xl mb-3",
      dark ? "text-white" : "text-foreground"
    )}>{title}</h3>
    <p className={cn(
      "text-sm lg:text-base leading-relaxed",
      dark ? "text-white/60" : "text-foreground/60"
    )}>{children}</p>
  </div>
);

// Line item for stacked lists
const LineItem = ({ title, subtitle, index, dark = false }: { title: string; subtitle: string; index?: number; dark?: boolean }) => (
  <div className={cn(
    "py-5 flex items-start gap-6 border-b",
    dark ? "border-white/10" : "border-foreground/10"
  )}>
    {index !== undefined && (
      <span className={cn(
        "font-mono text-xs tabular-nums mt-1",
        dark ? "text-primary" : "text-primary"
      )}>{String(index + 1).padStart(2, '0')}</span>
    )}
    <div className="flex-1 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-1 lg:gap-8">
      <span className={cn(
        "font-serif text-lg lg:text-xl",
        dark ? "text-white" : "text-foreground"
      )}>{title}</span>
      <span className={cn(
        "text-sm lg:text-base lg:text-right lg:max-w-md",
        dark ? "text-white/50" : "text-foreground/50"
      )}>{subtitle}</span>
    </div>
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
          <div className="flex-1 flex flex-col justify-center max-w-4xl">
            <SlideEyebrow>Why This Session Exists</SlideEyebrow>
            <ActionTitle>why RAG fails law firms</ActionTitle>
            <BodyText>
              Many firms find that RAG rarely delivers the consistency, confidence, or reliability they were promised. The problem is not RAG itself. The problem is the assumption that retrieval can compensate for deeper structural issues in how legal knowledge is created, stored, governed, and reused.
            </BodyText>
          </div>
        </Slide>

        {/* ============================================== */}
        {/* SLIDE 03: Demo vs Production                  */}
        {/* ============================================== */}
        <Slide>
          <div className="flex-1 flex flex-col justify-center max-w-4xl">
            <SlideEyebrow>Demo Versus Production</SlideEyebrow>
            <ActionTitle>it looked brilliant, then it fell apart</ActionTitle>
            <BodyText>
              In demos, datasets are curated and questions are controlled. In production, documents are messy, edge cases appear, and there is no supervision. If lawyers still need to verify everything manually, adoption drops fast.
            </BodyText>
          </div>
        </Slide>

        {/* ============================================== */}
        {/* SLIDE 04: Failure Pattern                     */}
        {/* ============================================== */}
        <Slide>
          <div className="flex-1 flex flex-col max-w-4xl pt-8">
            <SlideEyebrow>Failure Pattern</SlideEyebrow>
            <ActionTitle>how RAG actually fails</ActionTitle>
            <div className="mt-4">
              <LineItem index={0} title="wrong jurisdiction" subtitle="precedent drifts across regimes and matter contexts" />
              <LineItem index={1} title="missing carve outs" subtitle="general rules without exceptions or recent amendments" />
              <LineItem index={2} title="outdated precedents" subtitle="overturned, distinguished, or superseded material resurfaces" />
              <LineItem index={3} title="indefensible sources" subtitle="confidence without clear attribution to authority" />
            </div>
          </div>
        </Slide>

        {/* ============================================== */}
        {/* SLIDE 05: Hallucination Moved                 */}
        {/* ============================================== */}
        <Slide>
          <div className="flex-1 flex flex-col max-w-5xl pt-8">
            <SlideEyebrow>The Hidden Shift</SlideEyebrow>
            <ActionTitle>hallucination did not disappear, it moved</ActionTitle>
            <div className="grid grid-cols-2 gap-5 mt-6 flex-1">
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
            </div>
          </div>
        </Slide>

        {/* ============================================== */}
        {/* SLIDE 06: Core Myth                           */}
        {/* ============================================== */}
        <Slide>
          <div className="flex-1 flex flex-col justify-center max-w-4xl">
            <SlideEyebrow>Core Myth</SlideEyebrow>
            <ActionTitle>retrieval does not equal correctness</ActionTitle>
            <BodyText>
              Retrieval is not authority, retrieval is not permission, and retrieval is not legal applicability. Similarity search is fundamentally not legal reasoning.
            </BodyText>
          </div>
        </Slide>

        {/* ============================================== */}
        {/* SLIDE 07: Turning Point                       */}
        {/* ============================================== */}
        <Slide>
          <div className="flex-1 flex flex-col justify-center max-w-4xl">
            <SlideEyebrow>Turning Point</SlideEyebrow>
            <ActionTitle>RAG is not broken</ActionTitle>
            <BodyText>
              Knowledge foundations are. When the knowledge base is flawed, even the best model is forced to improvise around gaps. Reliability begins well before retrieval.
            </BodyText>
          </div>
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
          <div className="flex-1 flex flex-col max-w-5xl pt-8">
            <SlideEyebrow>Legal Knowledge Reality</SlideEyebrow>
            <ActionTitle>legal knowledge is fundamentally different</ActionTitle>
            <div className="grid grid-cols-2 gap-5 mt-6 flex-1">
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
            </div>
          </div>
        </Slide>

        {/* ============================================== */}
        {/* SLIDE 09: Legal Grade Stack                   */}
        {/* ============================================== */}
        <Slide>
          <div className="flex-1 flex flex-col max-w-4xl pt-8">
            <SlideEyebrow>The Trust Chain</SlideEyebrow>
            <ActionTitle>the legal grade RAG stack</ActionTitle>
            <div className="mt-4">
              <LineItem index={0} title="curated knowledge base" subtitle="prepared, enriched, validated content with metadata" />
              <LineItem index={1} title="semantic indexing plus metadata" subtitle="hybrid search, not vectors alone" />
              <LineItem index={2} title="permission layer" subtitle="query time security validation before retrieval" />
              <LineItem index={3} title="context filter" subtitle="jurisdiction, practice area, and relevance scoping" />
              <LineItem index={4} title="generation with attribution" subtitle="citations with document metadata and confidence signals" />
            </div>
          </div>
        </Slide>

        {/* ============================================== */}
        {/* SLIDE 10: Preparation Layer                   */}
        {/* ============================================== */}
        <Slide>
          <div className="flex-1 flex flex-col max-w-4xl pt-8">
            <SlideEyebrow>Core Insight</SlideEyebrow>
            <ActionTitle>the preparation layer is everything</ActionTitle>
            <div className="mt-4">
              <LineItem index={0} title="content normalisation" subtitle="standardise formats, extract clean text, remove artefacts" />
              <LineItem index={1} title="structural parsing" subtitle="sections, clauses, definitions, cross references" />
              <LineItem index={2} title="metadata enrichment" subtitle="practice area, jurisdiction, type, author, approval status" />
              <LineItem index={3} title="version control" subtitle="supersessions, current versus historical, change tracking" />
              <LineItem index={4} title="authority tagging" subtitle="firm approved guidance, precedential value, confidence levels" />
            </div>
          </div>
        </Slide>

        {/* ============================================== */}
        {/* SLIDE 11: Production Grade                    */}
        {/* ============================================== */}
        <Slide>
          <div className="flex-1 flex flex-col max-w-5xl pt-8">
            <SlideEyebrow>Production Grade</SlideEyebrow>
            <ActionTitle>what turns concepts into a reliable system</ActionTitle>
            <div className="grid grid-cols-2 gap-5 mt-6 flex-1">
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
            </div>
          </div>
        </Slide>

        {/* ============================================== */}
        {/* SLIDE 12: Authority and Freshness             */}
        {/* ============================================== */}
        <Slide>
          <div className="flex-1 flex flex-col max-w-5xl pt-8">
            <SlideEyebrow>Authority and Freshness Control</SlideEyebrow>
            <ActionTitle>rank by authority, not by similarity</ActionTitle>
            <div className="grid grid-cols-2 gap-5 mt-6">
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
            </div>
            <p className="text-base text-foreground/50 italic border-l-2 border-primary pl-4 mt-8">
              A highly relevant but outdated memorandum is worse than no answer.
            </p>
          </div>
        </Slide>

        {/* ============================================== */}
        {/* SLIDE 13: Terminology Harmonisation           */}
        {/* ============================================== */}
        <Slide>
          <div className="flex-1 flex flex-col max-w-5xl pt-8">
            <SlideEyebrow>Retrieval Quality</SlideEyebrow>
            <ActionTitle>aligning legal language across the firm</ActionTitle>
            <BodyText>
              Law firms contain linguistic silos. These are not cosmetic differences, they create retrieval failures where relevant expertise exists but remains undiscoverable.
            </BodyText>
            <div className="grid grid-cols-2 gap-5 mt-8">
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
            </div>
          </div>
        </Slide>

        {/* ============================================== */}
        {/* SLIDE 14: Governance Through Architecture     */}
        {/* ============================================== */}
        <Slide>
          <div className="flex-1 flex flex-col max-w-6xl pt-8">
            <SlideEyebrow>Game Changer</SlideEyebrow>
            <ActionTitle>governance through architecture</ActionTitle>
            <p className="font-sans text-base lg:text-lg text-foreground/60 leading-relaxed max-w-4xl mb-8">
              More context often yields worse answers. Aggressive context control and architectural governance improve both quality and security.
            </p>
            <div className="grid grid-cols-3 gap-4 flex-1">
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
            </div>
          </div>
        </Slide>

        {/* ============================================== */}
        {/* SLIDE 15: Human in the Loop                   */}
        {/* ============================================== */}
        <Slide>
          <div className="flex-1 flex flex-col justify-center max-w-4xl">
            <SlideEyebrow>Operating Model</SlideEyebrow>
            <ActionTitle>human in the loop is non negotiable</ActionTitle>
            <BodyText>
              RAG does not replace lawyers. It augments judgement by accelerating research, drafting first passes from firm templates, and reducing mechanical tasks. Legal judgement remains central to applicability, risk, and strategy.
            </BodyText>
          </div>
        </Slide>

        {/* ============================================== */}
        {/* SLIDE 16: Success Metrics                     */}
        {/* ============================================== */}
        <Slide>
          <div className="flex-1 flex flex-col max-w-5xl pt-8">
            <SlideEyebrow>Measuring Success Properly</SlideEyebrow>
            <ActionTitle>move beyond impressive demos</ActionTitle>
            <p className="font-sans text-base lg:text-lg text-foreground/60 leading-relaxed max-w-4xl mb-12">
              Evaluate value delivery and adoption, not benchmark theatre. Focus on time saved, error reduction, confidence, and integration into daily workflows.
            </p>
            <div className="grid grid-cols-3 gap-12 mt-auto mb-12">
              <div className="text-center">
                <div className="font-serif text-6xl lg:text-7xl text-primary mb-4">
                  <CountingNumber value={40} suffix="%" className="" duration={1.5} />
                </div>
                <p className="text-sm text-foreground/50">average research time reduction on routine tasks</p>
              </div>
              <div className="text-center">
                <div className="font-serif text-6xl lg:text-7xl text-primary mb-4">
                  <CountingNumber value={78} suffix="%" className="" duration={1.5} />
                </div>
                <p className="text-sm text-foreground/50">weekly active users across a defined target group</p>
              </div>
              <div className="text-center">
                <div className="font-serif text-6xl lg:text-7xl text-primary mb-4">
                  <CountingNumber value={92} suffix="%" className="" duration={1.5} />
                </div>
                <p className="text-sm text-foreground/50">lawyer confidence for client facing work</p>
              </div>
            </div>
          </div>
        </Slide>

        {/* ============================================== */}
        {/* SLIDE 17: Closing                             */}
        {/* ============================================== */}
        <Slide dark>
          <div className="flex-1 flex flex-col justify-center max-w-4xl">
            <SlideEyebrow dark>Closing</SlideEyebrow>
            
            <p className="font-serif text-3xl lg:text-4xl text-white leading-snug mb-12 italic">
              The problem is not RAG itself.<br />
              The problem is the assumption that retrieval can compensate for weak knowledge foundations.
            </p>
            
            <div className="bg-white/5 border border-white/10 p-8 max-w-3xl">
              <p className="font-sans text-lg text-white/70 leading-relaxed">
                When foundations are disciplined and governance is architectural, RAG becomes legal intelligence infrastructure. It helps firms move faster, reduce risk, scale expertise, and win complex work without sacrificing defensibility.
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
      
      {/* Subtle progress indicator - bottom right */}
      {totalSlides > 0 && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
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
    </div>
  );
};

export default ReportSection;
