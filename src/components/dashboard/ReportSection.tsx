import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CursorGlow, CountingNumber } from "./SlideAnimations";
import { StickyNote } from "lucide-react";
import { PresenterNotesPanel } from "@/components/PresenterNotesPanel";

// Premium slide component with light background
const Slide = ({ 
  children, 
  className = "",
  dark = false,
  hasCards = false
}: { 
  children: React.ReactNode; 
  className?: string;
  dark?: boolean;
  hasCards?: boolean;
}) => (
  <div 
    className={cn(
      "w-screen h-screen flex-shrink-0 relative flex flex-col overflow-hidden",
      dark ? "bg-[#0a0a0a]" : "bg-[#fafaf8]",
      className
    )}
    data-slide="true"
  >
    {/* Grid pattern on dark slides OR light slides without cards */}
    {(dark || !hasCards) && (
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: dark 
            ? 'linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)'
            : 'linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)',
          backgroundSize: '120px 120px',
          opacity: dark ? 0.2 : 1
        }}
      />
    )}
    
    {/* Content container with proper margins */}
    <div className="relative z-10 flex-1 flex flex-col px-16 lg:px-24 py-16 lg:py-20">
      {children}
    </div>
    
    {/* Footer - just logo */}
    <div className={cn(
      "relative z-10 px-16 lg:px-24 pb-8 flex items-end",
      dark ? "text-white/40" : "text-foreground/30"
    )}>
      <div className="flex items-center gap-1.5">
        <span className={cn(
          "font-serif font-bold text-xl tracking-tight lowercase",
          dark ? "text-white/60" : "text-foreground/50"
        )}>Rubiklab</span>
        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
      </div>
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

// Card component with hover effect and accent
const Card = ({ title, children, dark = false, accent = false }: { title: string; children: React.ReactNode; dark?: boolean; accent?: boolean }) => (
  <div className={cn(
    "p-6 lg:p-8 h-full flex flex-col transition-all duration-300 group",
    dark 
      ? "bg-white/[0.03] border border-white/10 hover:border-white/20 hover:bg-white/[0.05]" 
      : accent
        ? "bg-primary/5 border border-primary/20 hover:border-primary/40"
        : "bg-white/80 border border-foreground/5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
  )}>
    <h3 className={cn(
      "font-serif text-lg lg:text-xl mb-3 transition-colors",
      dark ? "text-white" : "text-foreground group-hover:text-primary"
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

    {/* Footer - just logo */}
    <div className="relative z-10 flex items-end">
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
  <div data-divider="true" className="w-screen h-screen flex-shrink-0 bg-[#050505] text-white relative flex flex-col justify-center items-center overflow-hidden">
    {/* Grid background */}
    <div 
      className="absolute inset-0 pointer-events-none opacity-15"
      style={{
        backgroundImage: 'linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)',
        backgroundSize: '120px 120px'
      }}
    />
    
    {/* Large blue accent bar on the left */}
    <motion.div 
      initial={{ scaleY: 0 }}
      whileInView={{ scaleY: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-[40vh] bg-primary origin-center shadow-[0_0_60px_hsl(var(--primary)/0.4)]"
    />
    
    {/* Secondary accent - horizontal line extending from bar */}
    <motion.div 
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      className="absolute left-2 top-1/2 w-32 h-[1px] bg-gradient-to-r from-primary to-transparent origin-left"
    />
    
    <div className="relative z-10 text-center px-8">
      {/* Title with dramatic entrance */}
      <motion.h2 
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true }}
        className="font-serif text-6xl lg:text-8xl text-white mb-6 tracking-tight"
      >
        {title}<span className="text-primary">.</span>
      </motion.h2>
      
      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true }}
        className="font-sans text-xl lg:text-2xl text-white/50 font-light leading-relaxed max-w-xl mx-auto"
      >
        {subtitle}
      </motion.p>
    </div>
    
    {/* Footer - just logo */}
    <div className="absolute bottom-12 left-12 right-12 flex items-end">
      <div className="flex items-center gap-1.5">
        <span className="font-serif font-bold text-3xl tracking-tight lowercase text-white">Rubiklab</span>
        <div className="relative flex items-center justify-center">
          <div className="absolute w-3 h-3 bg-primary rounded-full animate-ping opacity-20"></div>
          <div className="w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_12px_hsl(var(--primary)/0.3)]"></div>
        </div>
      </div>
    </div>
  </div>
);

interface ReportSectionProps {
  onExit?: () => void;
}

const ReportSection = ({ onExit }: ReportSectionProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  
  const isPresenterMode = searchParams.get('mode') === 'presenter';
  const presentationId = '09c46523-f385-4efd-afc6-c1684929c68c'; // RAG presentation ID
  
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
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <SlideEyebrow>Demo Versus Production</SlideEyebrow>
            
            {/* Dramatic quote-style title */}
            <div className="relative max-w-4xl">
              {/* Large opening quote mark */}
              <span className="absolute -left-16 -top-8 font-serif text-[8rem] text-primary/20 leading-none select-none">"</span>
              
              <h2 className="font-serif text-[3.5rem] lg:text-[5rem] leading-[1.0] tracking-tight text-foreground italic">
                it looked brilliant,
              </h2>
              <h2 className="font-serif text-[3.5rem] lg:text-[5rem] leading-[1.0] tracking-tight text-primary mt-2">
                then it fell apart.
              </h2>
              
              {/* Large closing quote mark */}
              <span className="absolute -right-12 bottom-0 font-serif text-[8rem] text-primary/20 leading-none select-none">"</span>
            </div>
            
            {/* Body text with more visual separation */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              viewport={{ once: true }}
              className="mt-16 max-w-2xl"
            >
              <div className="w-16 h-[1px] bg-primary mx-auto mb-8" />
              <p className="font-sans text-lg lg:text-xl text-foreground/60 leading-relaxed">
                In demos, datasets are curated and questions are controlled. In production, documents are messy, edge cases appear, and there is no supervision.
              </p>
            </motion.div>
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
          <div className="flex-1 flex flex-col justify-center">
            <SlideEyebrow>The Hidden Shift</SlideEyebrow>
            
            {/* Large statement */}
            <h2 className="font-serif text-[3rem] lg:text-[4.5rem] leading-[1.05] tracking-tight text-foreground max-w-5xl mb-16">
              hallucination did not disappear,<br />
              <span className="text-primary italic">it moved.</span>
            </h2>
            
            {/* Horizontal flow of issues */}
            <div className="flex items-start gap-0 border-t border-foreground/10">
              {[
                { label: "noisy retrieval", desc: "too many tangential documents, leaving the model to guess" },
                { label: "bad documents", desc: "faithfully citing flawed or outdated sources" },
                { label: "missing context", desc: "correct fragments lacking qualifications and scope" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  viewport={{ once: true }}
                  className={cn(
                    "flex-1 py-8 pr-8",
                    i > 0 && "pl-8 border-l border-foreground/10"
                  )}
                >
                  <span className="font-serif text-xl text-foreground">{item.label}</span>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
            
            {/* Result callout */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              viewport={{ once: true }}
              className="mt-8 flex items-center gap-6"
            >
              <div className="w-12 h-[2px] bg-primary" />
              <p className="font-serif text-lg text-foreground/60 italic">
                Answers that sound authoritative yet still require expert review.
              </p>
            </motion.div>
          </div>
        </Slide>

        {/* ============================================== */}
        {/* DIVIDER: The Problem                          */}
        {/* ============================================== */}
        <SectionDivider 
          title="The problem is not the model" 
          subtitle="It is the knowledge"
        />

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
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            {/* Accent line */}
            <motion.div 
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
              className="w-[2px] h-20 bg-primary mb-10 origin-top"
            />
            
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-primary mb-8">
              Turning Point
            </span>
            
            {/* Dramatic two-part statement */}
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              viewport={{ once: true }}
              className="font-serif text-[4rem] lg:text-[6rem] leading-[0.95] tracking-tight text-foreground mb-6"
            >
              RAG is not broken.
            </motion.h2>
            
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              viewport={{ once: true }}
              className="font-serif text-[2.5rem] lg:text-[3.5rem] leading-[1.1] tracking-tight text-primary italic"
            >
              Knowledge foundations are.
            </motion.h3>
            
            {/* Supporting text */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              viewport={{ once: true }}
              className="font-sans text-lg text-foreground/50 mt-12 max-w-xl leading-relaxed"
            >
              Reliability begins well before retrieval.
            </motion.p>
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
          <div className="flex-1 flex flex-col justify-center">
            <SlideEyebrow>Legal Knowledge Reality</SlideEyebrow>
            
            {/* Large statement */}
            <h2 className="font-serif text-[3rem] lg:text-[4.5rem] leading-[1.05] tracking-tight text-foreground max-w-5xl mb-16">
              legal knowledge is<br />
              <span className="text-primary italic">fundamentally different.</span>
            </h2>
            
            {/* Horizontal attributes */}
            <div className="flex items-start gap-0 border-t border-foreground/10">
              {[
                { label: "fragmented", desc: "spread across precedents, statutes, practice notes, and institutional memory" },
                { label: "purpose driven", desc: "applicability changes with intent—research, litigation, drafting" },
                { label: "permission sensitive", desc: "ethical walls and matter-level security are non-negotiable" },
                { label: "jurisdictionally bound", desc: "boundaries alter meaning; rulings continuously invalidate understanding" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  viewport={{ once: true }}
                  className={cn(
                    "flex-1 py-6 pr-6",
                    i > 0 && "pl-6 border-l border-foreground/10"
                  )}
                >
                  <span className="font-serif text-lg text-foreground">{item.label}</span>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
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
          <div className="flex-1 flex justify-between gap-16">
            {/* Left column - Statement */}
            <div className="flex flex-col justify-center max-w-lg">
              <SlideEyebrow>Core Insight</SlideEyebrow>
              <h2 className="font-serif text-[2.5rem] lg:text-[3.5rem] leading-[1.1] tracking-tight text-foreground mb-8">
                the preparation layer is <span className="text-primary italic">everything</span>.
              </h2>
              <p className="font-serif text-xl text-foreground/50 leading-relaxed">
                Before retrieval happens, content must be normalised, structured, enriched, and validated.
              </p>
            </div>
            
            {/* Right column - Stacked process steps */}
            <div className="flex-1 max-w-xl flex flex-col justify-center">
              {[
                { num: "01", title: "content normalisation", desc: "standardise formats, extract clean text, remove artefacts" },
                { num: "02", title: "structural parsing", desc: "sections, clauses, definitions, cross references" },
                { num: "03", title: "metadata enrichment", desc: "practice area, jurisdiction, type, author, approval status" },
                { num: "04", title: "version control", desc: "supersessions, current versus historical, change tracking" },
                { num: "05", title: "authority tagging", desc: "firm approved guidance, precedential value, confidence" },
              ].map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  viewport={{ once: true }}
                  className={cn(
                    "group flex items-start gap-6 py-4",
                    i < 4 && "border-b border-foreground/10"
                  )}
                >
                  {/* Number with vertical line */}
                  <div className="flex flex-col items-center">
                    <span className="font-mono text-xs text-primary font-medium">{step.num}</span>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <h4 className="font-serif text-lg text-foreground leading-tight group-hover:text-primary transition-colors duration-300">
                      {step.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Slide>

        {/* ============================================== */}
        {/* SLIDE 11: Production Grade                    */}
        {/* ============================================== */}
        <Slide>
          <div className="flex-1 flex justify-between gap-20">
            {/* Left column - Statement */}
            <div className="flex flex-col justify-center max-w-md">
              <SlideEyebrow>Production Grade</SlideEyebrow>
              <h2 className="font-serif text-[2.5rem] lg:text-[3.25rem] leading-[1.1] tracking-tight text-foreground mb-6">
                what turns concepts into a <span className="text-primary italic">reliable system</span>.
              </h2>
              <p className="font-serif text-lg text-foreground/50 leading-relaxed">
                Moving from prototype to production requires infrastructure that scales.
              </p>
            </div>
            
            {/* Right column - Stacked capabilities */}
            <div className="flex-1 max-w-lg flex flex-col justify-center">
              {[
                { num: "01", title: "automated parsing pipelines", desc: "continuous ingestion, processing, updating with quality validation" },
                { num: "02", title: "structural segmentation", desc: "extract hierarchy, relationships, and semantic units at clause level" },
                { num: "03", title: "practice area taxonomies", desc: "classification aligned to the firm's structures and terminology" },
                { num: "04", title: "cross-document linking", desc: "maintain relationships between related legal content over time" },
              ].map((item, i) => (
                <motion.div
                  key={item.num}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  viewport={{ once: true }}
                  className={cn(
                    "group flex items-start gap-6 py-5",
                    i < 3 && "border-b border-foreground/10"
                  )}
                >
                  <span className="font-mono text-xs text-primary font-medium mt-1">{item.num}</span>
                  <div className="flex-1">
                    <h4 className="font-serif text-lg text-foreground leading-tight group-hover:text-primary transition-colors">{item.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Slide>

        {/* ============================================== */}
        {/* SLIDE 12: Authority and Freshness             */}
        {/* ============================================== */}
        <Slide>
          <div className="flex-1 flex flex-col justify-center">
            <SlideEyebrow>Authority and Freshness Control</SlideEyebrow>
            
            {/* Dramatic title */}
            <h2 className="font-serif text-[3rem] lg:text-[4.5rem] leading-[1.05] tracking-tight text-foreground max-w-5xl mb-12">
              rank by <span className="text-primary italic">authority</span>,<br />
              not by similarity.
            </h2>
            
            {/* Two-column layout */}
            <div className="grid grid-cols-2 gap-16 max-w-4xl">
              {/* Left - first two items */}
              <div className="space-y-8">
                {[
                  { title: "author identity", desc: "who drafted it, who approved it, and what expertise they hold" },
                  { title: "approval status", desc: "official guidance, working draft, or personal notes" },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    <h4 className="font-serif text-xl text-foreground group-hover:text-primary transition-colors">{item.title}</h4>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
              
              {/* Right - second two items */}
              <div className="space-y-8">
                {[
                  { title: "temporal currency", desc: "when it was created, last reviewed, and whether it is still current" },
                  { title: "supersession tracking", desc: "what newer documents or rulings modify or replace it" },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: (i + 2) * 0.1, duration: 0.4 }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    <h4 className="font-serif text-xl text-foreground group-hover:text-primary transition-colors">{item.title}</h4>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </Slide>

        {/* ============================================== */}
        {/* SLIDE 13: Terminology Harmonisation           */}
        {/* ============================================== */}
        <Slide>
          <div className="flex-1 flex flex-col justify-center">
            <SlideEyebrow>Retrieval Quality</SlideEyebrow>
            
            {/* Large impactful statement */}
            <h2 className="font-serif text-[2.5rem] lg:text-[3.5rem] leading-[1.1] tracking-tight text-foreground max-w-4xl mb-6">
              law firms contain <span className="text-primary italic">linguistic silos</span>.
            </h2>
            
            <p className="font-serif text-xl lg:text-2xl text-foreground/50 leading-relaxed max-w-3xl mb-16">
              These are not cosmetic differences—they create retrieval failures where relevant expertise exists but remains undiscoverable.
            </p>
            
            {/* Three key terms displayed prominently inline */}
            <div className="flex items-center gap-4 flex-wrap">
              {[
                "controlled vocabularies",
                "synonym mapping", 
                "terminology harmonisation",
              ].map((term, i) => (
                <motion.div
                  key={term}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <span className={cn(
                    "inline-block font-serif text-lg lg:text-xl px-6 py-3 border transition-all duration-300",
                    i === 0 
                      ? "border-primary bg-primary/5 text-primary" 
                      : "border-foreground/20 text-foreground hover:border-primary hover:text-primary"
                  )}>
                    {term}
                  </span>
                  {i < 2 && <span className="text-foreground/30 mx-2">→</span>}
                </motion.div>
              ))}
            </div>
            
            {/* Subtle descriptor */}
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              viewport={{ once: true }}
              className="text-sm text-muted-foreground mt-8 max-w-2xl"
            >
              Enrich documents with standardised tags while preserving original language—making expertise discoverable across practice areas.
            </motion.p>
          </div>
        </Slide>

        {/* ============================================== */}
        {/* SLIDE 14: Governance Through Architecture     */}
        {/* ============================================== */}
        <Slide>
          <div className="flex-1 flex flex-col max-w-5xl pt-8">
            <SlideEyebrow>Game Changer</SlideEyebrow>
            <ActionTitle>governance through architecture</ActionTitle>
            
            <p className="font-serif text-xl text-foreground/60 leading-relaxed max-w-3xl mt-4 mb-12">
              More context often yields worse answers. Aggressive context control and architectural governance improve both quality and security.
            </p>
            
            {/* Two-column layout matching slide 15 style */}
            <div className="grid grid-cols-2 gap-12 flex-1">
              {/* Left column - Security */}
              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-[1px] bg-primary" />
                  <span className="font-mono text-[11px] text-primary uppercase tracking-widest">Security</span>
                </div>
                <div className="space-y-6">
                  {[
                    { title: "client isolation", desc: "absolute segregation that prevents cross-client leakage" },
                    { title: "matter level permissions", desc: "respect engagement boundaries and work product privilege" },
                    { title: "permission aware retrieval", desc: "retrieve only what the user is authorised to view" },
                  ].map((item, i) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.4 }}
                      viewport={{ once: true }}
                      className="group"
                    >
                      <h4 className="font-serif text-lg text-foreground mb-1 group-hover:text-primary transition-colors">{item.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Right column - Precision */}
              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-[1px] bg-foreground/30" />
                  <span className="font-mono text-[11px] text-foreground/50 uppercase tracking-widest">Precision</span>
                </div>
                <div className="space-y-6">
                  {[
                    { title: "jurisdiction filters", desc: "retrieve only content applicable to the relevant regime" },
                    { title: "practice area scoping", desc: "constrain retrieval to domains where the query has legitimate application" },
                    { title: "audit trails", desc: "immutable logs and compliance by design" },
                  ].map((item, i) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 + 0.15, duration: 0.4 }}
                      viewport={{ once: true }}
                      className="group"
                    >
                      <h4 className="font-serif text-lg text-foreground mb-1 group-hover:text-primary transition-colors">{item.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Slide>

        {/* ============================================== */}
        {/* DIVIDER: From Architecture to Advantage       */}
        {/* ============================================== */}
        <SectionDivider 
          title="From architecture to advantage" 
          subtitle="What good looks like in practice"
        />

        {/* ============================================== */}
        {/* SLIDE 15: Human in the Loop                   */}
        {/* ============================================== */}
        <Slide>
          <div className="flex-1 flex flex-col max-w-5xl pt-8">
            <SlideEyebrow>Operating Model</SlideEyebrow>
            <ActionTitle>human in the loop is non negotiable</ActionTitle>
            
            <p className="font-serif text-xl lg:text-2xl text-foreground/70 leading-relaxed max-w-3xl mt-4 mb-12">
              RAG does not replace lawyers. It augments judgement by accelerating research, drafting first passes from firm templates, and reducing mechanical tasks.
            </p>
            
            {/* Premium 3-column breakdown */}
            <div className="grid grid-cols-3 gap-0 flex-1">
              {[
                { title: "Accelerate", desc: "Research and discovery at machine speed", icon: "→", featured: true },
                { title: "Draft", desc: "First passes from firm approved templates", icon: "◇", featured: false },
                { title: "Judge", desc: "Legal judgement remains central to strategy", icon: "◈", featured: false },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  viewport={{ once: true }}
                  className={cn(
                    "group relative flex flex-col p-8",
                    i === 0 && "bg-primary/5",
                    i > 0 && "border-l border-border"
                  )}
                >
                  {/* Top accent */}
                  <div className={cn(
                    "absolute top-0 left-0 right-0 h-1",
                    i === 0 ? "bg-primary" : "bg-transparent"
                  )} />
                  
                  {/* Number */}
                  <span className="font-mono text-xs text-primary/50 mb-4">0{i + 1}</span>
                  
                  {/* Title */}
                  <h4 className={cn(
                    "font-serif text-2xl mb-3 transition-colors",
                    i === 0 ? "text-primary" : "text-foreground group-hover:text-primary"
                  )}>
                    {item.title}
                  </h4>
                  
                  {/* Description */}
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                  
                  {/* Bottom accent on hover */}
                  <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </div>
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
            
            <p className="font-serif text-3xl lg:text-4xl text-white leading-snug italic">
              The problem is not RAG itself.<br />
              The problem is the assumption that retrieval can compensate for weak knowledge foundations.
            </p>
          </div>
        </Slide>

        {/* ============================================== */}
        {/* SLIDE 18: Questions                           */}
        {/* ============================================== */}
        <Slide dark>
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <div className="w-[1px] h-16 bg-primary mb-10" />
            <h2 className="font-serif text-6xl lg:text-7xl text-white mb-6">
              Questions<span className="text-primary">?</span>
            </h2>
            <p className="font-sans text-xl text-gray-400 font-light leading-relaxed max-w-lg">
              Let's discuss how these principles apply to your firm
            </p>
          </div>
        </Slide>

      </div>
      
      {/* Subtle progress indicator - bottom right */}
      {totalSlides > 0 && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          {/* Progress bar */}
          <div className="w-24 h-[2px] bg-white/20 overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
            />
          </div>
          
          {/* Slide counter */}
          <span className="font-mono text-[11px] text-white/50 tabular-nums">
            {String(currentSlide + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
          </span>
          
          {/* Presenter mode toggle */}
          {isPresenterMode ? (
            <button
              onClick={() => {
                navigate('/report', { replace: true });
              }}
              className="p-2 rounded-lg transition-all text-white/60 hover:bg-white/10 hover:text-white flex items-center gap-1.5"
              title="Exit presenter mode"
            >
              <StickyNote className="w-3 h-3" />
              <span className="text-xs">Exit Notes</span>
            </button>
          ) : (
            <button
              onClick={() => {
                navigate('/report?mode=presenter', { replace: true });
              }}
              className="p-2 rounded-lg transition-all opacity-40 hover:opacity-100 text-white/60 hover:bg-white/10 hover:text-white"
              title="Enter presenter mode (N)"
            >
              <StickyNote className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
      
      {/* Presenter Notes Panel */}
      {isPresenterMode && (
        <PresenterNotesPanel
          presentationId={presentationId}
          currentSlide={currentSlide}
          totalSlides={totalSlides}
        />
      )}
    </div>
  );
};

export default ReportSection;
