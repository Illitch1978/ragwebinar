import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Mail, StickyNote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PresenterNotesPanel } from "@/components/PresenterNotesPanel";
import ScreenshotExporter from "@/components/ScreenshotExporter";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

// Author portrait images
import owenJenkinsImg from "@/assets/owen-jenkins.png";
import illitchImg from "@/assets/illitch.png";
import zsoltImg from "@/assets/zsolt.png";
import tiborImg from "@/assets/tibor-buda.png";
import bettinaBudaiImg from "@/assets/bettina-budai.png";
interface Slide {
  id: number;
  type: 'title' | 'content' | 'section' | 'bullets' | 'quote' | 'closing' | 'cover' | 'section-divider' | 'text-stack' | 'bullet-list' | 'metrics' | 'two-column' | 'split-insight' | 'cta';
  kicker?: string;
  title?: string;
  subtitle?: string;
  body?: string;
  content?: string;
  bullets?: string[];
  items?: Array<{ label?: string; text?: string; value?: string }>;
  metrics?: Array<{ value: string; label: string; trend?: string }>;
  leftColumn?: string;
  rightColumn?: string;
  leftItems?: Array<{ label?: string; text?: string }>;
  rightItems?: Array<{ label?: string; text?: string }>;
  keyInsight?: string;
  quote?: string;
  author?: string;
  authorEmail?: string;
  meta?: string;
  dark?: boolean;
}

// Helper to safely render HTML content (for bold/blue key terms)
const RichText = ({ text, className = "" }: { text: string; className?: string }) => {
  return (
    <span 
      className={className}
      dangerouslySetInnerHTML={{ __html: text }} 
    />
  );
};

// Convert generated slides to our internal format
const convertGeneratedSlides = (generatedSlides: any[], clientName: string): Slide[] => {
  let dividerCount = 0; // Only count section-dividers, not cover
  let quoteCount = 0; // Track quote slides for portrait logic
  
  return generatedSlides.map((slide, index) => {
    // Only increment for section-dividers (NOT cover slides)
    if (slide.type === 'section-divider') {
      dividerCount++;
    }
    
    // Track quote slides
    if (slide.type === 'quote') {
      quoteCount++;
    }
    
    // Quote slides are now LIGHT for variety - don't start with two dark slides
    const isDarkSlide = slide.dark ?? (
      slide.type === 'cover' || 
      slide.type === 'section-divider' || 
      slide.type === 'closing' || 
      slide.type === 'cta'
      // Quote removed from dark list - now light themed
    );
    
    // For section-dividers: swap title and subtitle (subtitle becomes main display)
    const displayTitle = slide.type === 'section-divider' && slide.subtitle 
      ? slide.subtitle 
      : slide.title;
    const displaySubtitle = slide.type === 'section-divider' && slide.subtitle 
      ? slide.title 
      : slide.subtitle;
    
    return {
      id: index,
      type: slide.type as Slide['type'],
      title: displayTitle || '',
      subtitle: displaySubtitle,
      content: slide.content,
      body: slide.content,
      items: slide.items,
      bullets: slide.items?.map((item: any) => item.text || item.label) || [],
      metrics: slide.metrics,
      leftColumn: slide.leftColumn,
      rightColumn: slide.rightColumn,
      quote: slide.quote,
      author: slide.author,
      authorEmail: slide.authorEmail,
      dark: isDarkSlide,
      // Cover gets no number, section-dividers get sequential 1, 2, 3...
      kicker: slide.type === 'section-divider' 
        ? String(dividerCount).padStart(2, '0') 
        : (slide.type === 'cover' ? undefined : slide.kicker),
      // Track if this is the first quote (for portrait display)
      meta: slide.type === 'quote' ? String(quoteCount) : slide.meta,
    };
  });
};

// Parse markdown into slides with alternating dark themes
const parseContentToSlides = (content: string, clientName: string): Slide[] => {
  const slides: Slide[] = [];
  const lines = content.split('\n');
  
  // Title slide - always dark for impact
  slides.push({
    id: 0,
    type: 'title',
    kicker: clientName || 'Presentation',
    title: clientName || 'Presentation',
    subtitle: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    dark: true,
  });

  let currentSlide: Partial<Slide> | null = null;
  let slideId = 1;
  let sectionCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // H1 - Section title slide (dark for contrast)
    if (line.startsWith('# ')) {
      if (currentSlide?.title) {
        slides.push({ id: slideId++, type: currentSlide.type || 'content', ...currentSlide } as Slide);
      }
      sectionCount++;
      currentSlide = {
        type: 'section',
        title: line.replace(/^#\s+/, ''),
        kicker: `${String(sectionCount).padStart(2, '0')}`,
        dark: true,
      };
    }
    // H2 - Content slide
    else if (line.startsWith('## ')) {
      if (currentSlide?.title) {
        slides.push({ id: slideId++, type: currentSlide.type || 'content', ...currentSlide } as Slide);
      }
      currentSlide = {
        type: 'content',
        title: line.replace(/^##\s+/, ''),
        body: '',
        bullets: [],
        dark: false,
      };
    }
    // H3 - Subsection within slide
    else if (line.startsWith('### ')) {
      if (currentSlide) {
        currentSlide.subtitle = line.replace(/^###\s+/, '');
      }
    }
    // Bullet points
    else if (line.startsWith('- ') || line.startsWith('* ')) {
      if (currentSlide) {
        currentSlide.type = 'bullets';
        currentSlide.bullets = currentSlide.bullets || [];
        currentSlide.bullets.push(line.replace(/^[-*]\s+/, ''));
      }
    }
    // Blockquote - dark for emphasis
    else if (line.startsWith('> ')) {
      if (currentSlide?.title) {
        slides.push({ id: slideId++, type: currentSlide.type || 'content', ...currentSlide } as Slide);
      }
      currentSlide = {
        type: 'quote',
        title: line.replace(/^>\s+/, ''),
        dark: true,
      };
    }
    // Regular text
    else if (line && currentSlide) {
      if (currentSlide.body) {
        currentSlide.body += ' ' + line;
      } else {
        currentSlide.body = line;
      }
    }
  }

  // Push last slide
  if (currentSlide?.title) {
    slides.push({ id: slideId++, type: currentSlide.type || 'content', ...currentSlide } as Slide);
  }

  // Closing slide - dark
  slides.push({
    id: slideId,
    type: 'closing',
    kicker: 'Rubiklab',
    title: 'Thank You',
    subtitle: 'Questions & Discussion',
    dark: true,
  });

  return slides;
};

// Premium Rubiklab Logo
const RubiklabLogo = ({ inverted = false }: { inverted?: boolean }) => (
  <div className="flex items-center gap-1.5">
    <span className={cn(
      "font-serif font-bold tracking-tight text-xl",
      inverted ? "text-white" : "text-foreground"
    )}>
      Rubiklab
    </span>
    <div className="relative flex items-center justify-center">
      <div className="absolute w-2.5 h-2.5 bg-primary rounded-full animate-ping opacity-20" />
      <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_12px_hsl(var(--primary)/0.4)]" />
    </div>
  </div>
);

// Grid background for dark slides
const GridBackground = () => (
  <div className="absolute inset-0 opacity-[0.03]">
    <div 
      className="w-full h-full"
      style={{
        backgroundImage: `
          linear-gradient(to right, white 1px, transparent 1px),
          linear-gradient(to bottom, white 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px'
      }}
    />
  </div>
);

// Premium morphing gradient mesh background for divider slides
const MorphingGradientBackground = ({ reduced = false }: { reduced?: boolean }) => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Base gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-black via-[#050505] to-[#0a0a0a]" />
    
    {/* Morphing gradient blobs */}
    {!reduced ? (
      <>
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full opacity-[0.15]"
          style={{
            background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)',
            filter: 'blur(100px)',
            top: '-20%',
            right: '-10%',
          }}
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full opacity-[0.08]"
          style={{
            background: 'radial-gradient(circle, hsl(220, 90%, 50%) 0%, transparent 70%)',
            filter: 'blur(80px)',
            bottom: '-15%',
            left: '-5%',
          }}
          animate={{
            x: [0, -40, 60, 0],
            y: [0, 50, -30, 0],
            scale: [1, 0.9, 1.15, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full opacity-[0.06]"
          style={{
            background: 'radial-gradient(circle, hsl(280, 70%, 50%) 0%, transparent 70%)',
            filter: 'blur(90px)',
            top: '30%',
            left: '30%',
          }}
          animate={{
            x: [0, 80, -50, 0],
            y: [0, -60, 40, 0],
            scale: [1, 1.2, 0.85, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </>
    ) : (
      // Export mode: keep the mesh look but avoid continuous transforms/filters that can destabilize capture
      <>
        <div
          className="absolute w-[800px] h-[800px] rounded-full opacity-[0.15]"
          style={{
            background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)',
            filter: 'blur(100px)',
            top: '-20%',
            right: '-10%',
          }}
        />
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-[0.08]"
          style={{
            background: 'radial-gradient(circle, hsl(220, 90%, 50%) 0%, transparent 70%)',
            filter: 'blur(80px)',
            bottom: '-15%',
            left: '-5%',
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-[0.06]"
          style={{
            background: 'radial-gradient(circle, hsl(280, 70%, 50%) 0%, transparent 70%)',
            filter: 'blur(90px)',
            top: '30%',
            left: '30%',
          }}
        />
      </>
    )}
    
    {/* Noise overlay removed (html2canvas createPattern issues) */}
  </div>
);

// Premium geometric pattern for cover
const CoverPattern = ({ reduced = false }: { reduced?: boolean }) => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Radial gradient overlay */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--primary)/0.15)_0%,_transparent_50%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_hsl(var(--primary)/0.1)_0%,_transparent_40%)]" />
    
    {/* Swiss lines (CSS grid) - html2canvas safe */}
    {!reduced && (
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(var(--primary-foreground) / 0.18) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--primary-foreground) / 0.18) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
    )}
    
    {/* Floating geometric shapes (static in export mode) */}
    {!reduced ? (
      <>
        <motion.div 
          className="absolute top-[15%] right-[10%] w-64 h-64 border border-white/[0.03] rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute bottom-[20%] left-[5%] w-48 h-48 border border-primary/10 rotate-45"
          animate={{ rotate: 405 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute top-[40%] right-[25%] w-32 h-32 border border-white/[0.02]" />
      </>
    ) : (
      <>
        <div className="absolute top-[15%] right-[10%] w-64 h-64 border border-white/[0.03] rounded-full" />
        <div className="absolute bottom-[20%] left-[5%] w-48 h-48 border border-primary/10 rotate-45" />
        <div className="absolute top-[40%] right-[25%] w-32 h-32 border border-white/[0.02]" />
      </>
    )}
    
    {/* Accent lines */}
    <div className="absolute top-0 left-[20%] w-[1px] h-[30%] bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
    <div className="absolute bottom-0 right-[30%] w-[1px] h-[25%] bg-gradient-to-t from-transparent via-white/10 to-transparent" />
    <div className="absolute top-[60%] left-0 w-[15%] h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
  </div>
);

// Large decorative number for cover and section-divider slides
const LargeDecorativeNumber = ({ number = '01' }: { number?: string }) => (
  <div className="absolute bottom-0 right-0 overflow-hidden pointer-events-none">
    <span className="font-mono text-[400px] lg:text-[600px] font-bold text-white/[0.02] leading-none tracking-tighter select-none" style={{ transform: 'translate(20%, 30%)' }}>
      {number}
    </span>
  </div>
);

// Decorative corner accent with blue highlight option
const CornerAccent = ({ position, inverted, highlight }: { position: 'tl' | 'br'; inverted?: boolean; highlight?: boolean }) => (
  <div className={cn(
    "absolute",
    highlight ? "w-28 h-28" : "w-16 h-16",
    position === 'tl' ? "top-8 left-8" : "bottom-8 right-8"
  )}>
    <div className={cn(
      "absolute",
      highlight ? "h-[2px]" : "h-[1px]",
      position === 'tl' ? "top-0 left-0 w-full" : "bottom-0 right-0 w-full",
      highlight ? "bg-gradient-to-r from-primary via-primary/60 to-transparent" : 
        inverted ? "bg-white/20" : "bg-foreground/10"
    )} />
    <div className={cn(
      "absolute",
      highlight ? "w-[2px]" : "w-[1px]",
      position === 'tl' ? "top-0 left-0 h-full" : "bottom-0 right-0 h-full",
      highlight ? "bg-gradient-to-b from-primary via-primary/60 to-transparent" : 
        inverted ? "bg-white/20" : "bg-foreground/10"
    )} />
  </div>
);

// Premium corner frame for cover with blue accents
const CoverFrame = () => (
  <>
    {/* Top left corner - blue accent */}
    <div className="absolute top-8 left-8 w-32 h-32">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary via-primary/60 to-transparent" />
      <div className="absolute top-0 left-0 h-full w-[2px] bg-gradient-to-b from-primary via-primary/60 to-transparent" />
    </div>
    {/* Top right corner */}
    <div className="absolute top-8 right-8 w-24 h-24">
      <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-l from-white/30 to-transparent" />
      <div className="absolute top-0 right-0 h-full w-[1px] bg-gradient-to-b from-white/30 to-transparent" />
    </div>
    {/* Bottom left corner */}
    <div className="absolute bottom-8 left-8 w-24 h-24">
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-white/20 to-transparent" />
      <div className="absolute bottom-0 left-0 h-full w-[1px] bg-gradient-to-t from-white/20 to-transparent" />
    </div>
    {/* Bottom right corner - blue accent */}
    <div className="absolute bottom-8 right-8 w-32 h-32">
      <div className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-l from-primary via-primary/60 to-transparent" />
      <div className="absolute bottom-0 right-0 h-full w-[2px] bg-gradient-to-t from-primary via-primary/60 to-transparent" />
    </div>
  </>
);

const SlideContent = ({ slide, isActive, isExportMode }: { slide: Slide; isActive: boolean; isExportMode: boolean }) => {
  // Pure fade animation - no vertical movement for smooth, elegant reveals
  const fadeEase = [0.4, 0, 0.2, 1] as const; // Material design standard easing
  
  const variants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const staggerChildren = {
    center: {
      transition: { 
        staggerChildren: 0.08, 
        delayChildren: 0.05
      }
    }
  };

  const childVariant = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
  };
  
  // Smooth fade transition - 0.5s duration per brand guide
  const smoothTransition = { 
    duration: 0.5, 
    ease: fadeEase,
  };

  // Title/Cover slide - Premium cover treatment
  if (slide.type === 'title' || slide.type === 'cover') {
    return (
      <motion.div
        variants={staggerChildren}
        initial="enter"
        animate={isActive ? "center" : "exit"}
        className="relative flex h-full"
      >
        {/* Premium background elements - no number on cover */}
        <CoverPattern reduced={isExportMode} />
        <CoverFrame />
        
        {/* Main content - left aligned for editorial feel */}
        <div className="relative z-10 flex flex-col justify-center h-full px-12 lg:px-20 max-w-5xl">
          
          {/* Main title */}
          <motion.h1 
            variants={childVariant}
            transition={smoothTransition}
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-6"
          >
            {slide.title}
          </motion.h1>
          
          {/* Subtitle if present */}
          {slide.subtitle && (
            <motion.p 
              variants={childVariant}
              transition={smoothTransition}
              className="text-xl text-white/70 max-w-2xl"
            >
              {slide.subtitle}
            </motion.p>
          )}
          
          {/* Date/meta */}
          <motion.div 
            variants={childVariant}
            className="flex items-center gap-3 mt-6"
          >
            <div className="w-2 h-2 bg-primary rounded-full" />
            <span className="font-mono text-xs tracking-widest text-white/50 uppercase">
              {slide.meta || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </motion.div>
          
          {/* Presenter/attendee details */}
          {slide.items && slide.items.length > 0 && (
            <motion.div 
              variants={childVariant}
              transition={smoothTransition}
              className="mt-8 space-y-2"
            >
              {slide.items.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3 text-sm">
                  <span className="font-mono text-[10px] tracking-wider text-primary uppercase w-28">{item.label}</span>
                  <div className="w-4 h-[1px] bg-white/20" />
                  <span className="text-white/60">{item.text}</span>
                </div>
              ))}
            </motion.div>
          )}
          
          {/* Decorative bottom line */}
          <motion.div 
            variants={childVariant}
            transition={smoothTransition}
            className="absolute bottom-20 left-12 lg:left-20 flex items-center gap-4"
          >
            <div className="w-24 h-[2px] bg-gradient-to-r from-primary to-primary/0" />
            <div className="w-12 h-[2px] bg-white/10" />
          </motion.div>
        </div>
        
        {/* Right side accent */}
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
      </motion.div>
    );
  }

  // Section/Section-divider slide - Bold typographic treatment with morphing gradient
  if (slide.type === 'section' || slide.type === 'section-divider') {
    return (
      <motion.div
        variants={staggerChildren}
        initial="enter"
        animate={isActive ? "center" : "exit"}
        className="relative flex h-full"
      >
        <MorphingGradientBackground reduced={isExportMode} />
        
        {/* Vertical blue accent bar on left */}
        <div className="absolute left-0 top-[15%] bottom-[15%] w-1 bg-gradient-to-b from-primary/0 via-primary to-primary/0" />
        
        {/* Large background section number - matching cover style */}
        <LargeDecorativeNumber number={slide.kicker || '01'} />
        
        {/* Blue corner accents */}
        <CornerAccent position="tl" highlight />
        <CornerAccent position="br" inverted />
        
        <div className="flex flex-col justify-center px-12 lg:px-20 z-10">
          {slide.kicker && (
            <motion.p 
              variants={childVariant}
              transition={smoothTransition}
              className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary mb-6"
            >
              Section {slide.kicker}
            </motion.p>
          )}
          
          <motion.h2 
            variants={childVariant}
            transition={smoothTransition}
            className="font-serif text-5xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl"
          >
            <span className="text-primary">{slide.title?.split(' ')[0]}</span>{' '}
            {slide.title?.split(' ').slice(1).join(' ')}
          </motion.h2>
          
          {slide.subtitle && (
            <motion.p 
              variants={childVariant}
              transition={smoothTransition}
              className="text-xl text-white/60 mt-6 max-w-2xl"
            >
              {slide.subtitle}
            </motion.p>
          )}
          
          <motion.div 
            variants={childVariant}
            transition={smoothTransition}
            className="flex items-center gap-4 mt-10"
          >
            <div className="w-32 h-[3px] bg-primary" />
            <div className="w-12 h-[2px] bg-white/20" />
            <div className="w-2 h-2 bg-primary rounded-full" />
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Metrics slide - Data-focused with large numbers
  if (slide.type === 'metrics') {
    return (
      <motion.div
        variants={staggerChildren}
        initial="enter"
        animate={isActive ? "center" : "exit"}
        className="relative flex h-full"
      >
        <CornerAccent position="tl" />
        
        <div className="flex flex-col justify-center px-12 lg:px-20 py-20 w-full">
          <motion.div 
            variants={childVariant}
            transition={smoothTransition}
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-8 h-[2px] bg-primary" />
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
              Key Metrics
            </span>
          </motion.div>
          
          <motion.h2 
            variants={childVariant}
            transition={smoothTransition}
            className="font-serif text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-12 max-w-3xl"
          >
            {slide.title}
          </motion.h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {slide.metrics?.map((metric, idx) => (
              <motion.div
                key={idx}
                variants={childVariant}
                transition={{ ...smoothTransition, delay: idx * 0.06 }}
                className="border-l-2 border-primary/30 pl-6"
              >
                <span className="font-mono text-4xl lg:text-5xl font-bold text-primary">
                  {metric.value}
                </span>
                <p className="text-sm text-muted-foreground mt-2">{metric.label}</p>
                {metric.trend && (
                  <p className="text-xs text-primary mt-1">{metric.trend}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  // Two-column slide - Split layout
  if (slide.type === 'two-column') {
    return (
      <motion.div
        variants={staggerChildren}
        initial="enter"
        animate={isActive ? "center" : "exit"}
        className="relative flex h-full"
      >
        <CornerAccent position="tl" />
        
        <div className="flex flex-col justify-center px-12 lg:px-20 py-20 w-full">
          <motion.div 
            variants={childVariant}
            transition={smoothTransition}
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-8 h-[2px] bg-primary" />
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
              Analysis
            </span>
          </motion.div>
          
          <motion.h2 
            variants={childVariant}
            transition={smoothTransition}
            className="font-serif text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-10 max-w-4xl"
          >
            {slide.title}
          </motion.h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              variants={childVariant}
              transition={smoothTransition}
              className="prose prose-lg text-foreground [&_strong]:text-primary [&_strong]:font-semibold"
            >
              <RichText text={slide.leftColumn || ''} className="text-lg leading-relaxed block" />
            </motion.div>
            <motion.div
              variants={childVariant}
              transition={smoothTransition}
              className="prose prose-lg text-foreground [&_strong]:text-primary [&_strong]:font-semibold"
            >
              <RichText text={slide.rightColumn || ''} className="text-lg leading-relaxed block" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Split-insight slide - Premium layout with key insight callout
  if (slide.type === 'split-insight') {
    return (
      <motion.div
        variants={staggerChildren}
        initial="enter"
        animate={isActive ? "center" : "exit"}
        className="relative flex h-full"
      >
        <CornerAccent position="tl" />
        
        <div className="flex flex-col justify-center px-12 lg:px-20 py-16 w-full">
          <motion.div 
            variants={childVariant}
            transition={smoothTransition}
            className="flex items-center gap-4 mb-4"
          >
            <div className="w-8 h-[2px] bg-primary" />
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
              Analysis
            </span>
          </motion.div>
          
          <motion.h2 
            variants={childVariant}
            transition={smoothTransition}
            className="font-serif text-3xl lg:text-4xl font-bold tracking-tight text-foreground mb-3 max-w-4xl"
          >
            {slide.title}
          </motion.h2>
          
          {slide.subtitle && (
            <motion.p 
              variants={childVariant}
              transition={smoothTransition}
              className="text-base text-muted-foreground mb-6 max-w-3xl"
            >
              {slide.subtitle}
            </motion.p>
          )}
          
          {/* Key Insight Callout */}
          {slide.keyInsight && (
            <motion.div
              variants={childVariant}
              transition={smoothTransition}
              className="bg-primary/10 border-l-4 border-primary px-6 py-4 mb-8 max-w-2xl"
            >
              <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-primary block mb-1">Key Insight</span>
              <p className="text-lg font-medium text-foreground">{slide.keyInsight}</p>
            </motion.div>
          )}
          
          {/* Two-column items */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left column items */}
            <div className="space-y-4">
              {slide.leftItems?.map((item: any, idx: number) => (
                <motion.div
                  key={idx}
                  variants={childVariant}
                  transition={{ ...smoothTransition, delay: idx * 0.05 }}
                  className="border-l-2 border-primary/30 pl-4"
                >
                  {item.label && (
                    <span className="font-mono text-[10px] tracking-widest text-primary uppercase block mb-1">
                      {item.label}
                    </span>
                  )}
                  <RichText 
                    text={item.text || ''} 
                    className="text-sm lg:text-base leading-relaxed text-foreground/80 [&_strong]:text-primary [&_strong]:font-semibold" 
                  />
                </motion.div>
              ))}
            </div>
            
            {/* Right column items */}
            <div className="space-y-4">
              {slide.rightItems?.map((item: any, idx: number) => (
                <motion.div
                  key={idx}
                  variants={childVariant}
                  transition={{ ...smoothTransition, delay: (idx + 3) * 0.05 }}
                  className="border-l-2 border-primary/30 pl-4"
                >
                  {item.label && (
                    <span className="font-mono text-[10px] tracking-widest text-primary uppercase block mb-1">
                      {item.label}
                    </span>
                  )}
                  <RichText 
                    text={item.text || ''} 
                    className="text-sm lg:text-base leading-relaxed text-foreground/80 [&_strong]:text-primary [&_strong]:font-semibold" 
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Text-stack slide - Items with label/text structure
  if (slide.type === 'text-stack') {
    return (
      <motion.div
        variants={staggerChildren}
        initial="enter"
        animate={isActive ? "center" : "exit"}
        className="relative flex h-full"
      >
        <CornerAccent position="tl" />
        
        <div className="flex flex-col justify-center px-12 lg:px-20 py-20 max-w-5xl">
          <motion.div 
            variants={childVariant}
            transition={smoothTransition}
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-8 h-[2px] bg-primary" />
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
              {slide.kicker || 'Insight'}
            </span>
          </motion.div>
          
          <motion.h2 
            variants={childVariant}
            transition={smoothTransition}
            className="font-serif text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-10"
          >
            {slide.title}
          </motion.h2>
          
          {slide.items && slide.items.length > 0 ? (
            <div className="space-y-6">
              {slide.items.map((item: any, idx: number) => (
                <motion.div
                  key={idx}
                  variants={childVariant}
                  transition={{ ...smoothTransition, delay: idx * 0.06 }}
                  className="border-l-2 border-primary/30 pl-6"
                >
                  {item.label && (
                    <span className="font-mono text-xs tracking-widest text-primary uppercase block mb-2">
                      {item.label}
                    </span>
                  )}
                  <RichText 
                    text={item.text || item.value || ''} 
                    className="text-lg lg:text-xl leading-relaxed text-foreground/80 [&_strong]:text-primary [&_strong]:font-semibold" 
                  />
                </motion.div>
              ))}
            </div>
          ) : (slide.content || slide.body) && (
            <RichText 
              text={slide.content || slide.body || ''} 
              className="text-lg lg:text-xl leading-relaxed text-foreground/80 [&_strong]:text-primary [&_strong]:font-semibold"
            />
          )}
        </div>
      </motion.div>
    );
  }

  // CTA slide - Call to action
  if (slide.type === 'cta') {
    return (
      <motion.div
        variants={staggerChildren}
        initial="enter"
        animate={isActive ? "center" : "exit"}
        className="relative flex flex-col items-center justify-center h-full text-center px-8"
      >
        <GridBackground />
        <CornerAccent position="tl" inverted />
        <CornerAccent position="br" inverted />
        
        <motion.h1 
          variants={childVariant}
          transition={smoothTransition}
          className="font-serif text-5xl lg:text-7xl font-bold tracking-tight text-white mb-6"
        >
          {slide.title}
        </motion.h1>
        
        {slide.subtitle && (
          <motion.p 
            variants={childVariant}
            transition={smoothTransition}
            className="text-xl text-white/60 max-w-2xl"
          >
            {slide.subtitle}
          </motion.p>
        )}
        
        {(slide.content || slide.body) && (
          <motion.p 
            variants={childVariant}
            transition={smoothTransition}
            className="text-lg text-white/50 mt-4 max-w-xl"
          >
            {slide.content || slide.body}
          </motion.p>
        )}
        
        <motion.div 
          variants={childVariant}
          transition={smoothTransition}
          className="mt-10 flex items-center gap-4"
        >
          <div className="w-16 h-[2px] bg-primary" />
          <span className="font-mono text-xs tracking-widest text-white/40 uppercase">
            Get Started
          </span>
          <div className="w-16 h-[2px] bg-primary" />
        </motion.div>
      </motion.div>
    );
  }

  // Quote slide - Premium layout: first quote gets portrait, others are centered big text
  if (slide.type === 'quote') {
    const quoteText = slide.quote || slide.title || slide.content;
    const authorText = slide.author || slide.subtitle;
    const isFirstQuote = slide.meta === '1';
    
    // Dynamic author image mapping - only for first quote
    const getAuthorImage = (author: string | undefined) => {
      if (!author || !isFirstQuote) return null;
      const authorLower = author.toLowerCase();
      if (authorLower.includes('owen')) return owenJenkinsImg;
      if (authorLower.includes('illitch')) return illitchImg;
      if (authorLower.includes('zsolt')) return zsoltImg;
      if (authorLower.includes('tibor')) return tiborImg;
      if (authorLower.includes('bettina')) return bettinaBudaiImg;
      return null;
    };
    
    const authorImage = getAuthorImage(authorText);
    
    // Non-first quotes: centered big text layout
    if (!isFirstQuote) {
      return (
        <motion.div
          variants={staggerChildren}
          initial="enter"
          animate={isActive ? "center" : "exit"}
          className="relative flex flex-col items-center justify-center h-full text-center px-12 lg:px-20"
        >
          {/* Light premium background */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
          
          {/* Corner accents */}
          <div className="absolute top-12 left-12 w-24 h-24 border-l-2 border-t-2 border-primary/10" />
          <div className="absolute bottom-12 right-12 w-24 h-24 border-r-2 border-b-2 border-primary/10" />
          
          <div className="relative max-w-4xl">
            {/* Opening quote mark */}
            <motion.div
              variants={childVariant}
              transition={smoothTransition}
              className="mb-2"
            >
              <span className="font-serif text-8xl lg:text-9xl text-primary/20 leading-none">"</span>
            </motion.div>
            
            {/* Quote text - big and centered */}
            <motion.p 
              variants={childVariant}
              transition={smoothTransition}
              className="font-serif text-3xl lg:text-4xl xl:text-5xl text-foreground leading-relaxed"
            >
              {quoteText}
            </motion.p>
            
            {/* Author attribution - simple centered */}
            {authorText && (
              <motion.div 
                variants={childVariant}
                transition={smoothTransition}
                className="mt-12 flex flex-col items-center"
              >
                <div className="w-16 h-[2px] bg-primary mb-6" />
                <span className="text-lg font-medium text-foreground">{authorText}</span>
              </motion.div>
            )}
          </div>
        </motion.div>
      );
    }
    
    // First quote: split layout with portrait
    return (
      <motion.div
        variants={staggerChildren}
        initial="enter"
        animate={isActive ? "center" : "exit"}
        className="relative flex h-full"
      >
        {/* Left content section - 2/3 width */}
        <div className="relative flex-1 flex flex-col justify-center px-12 lg:px-20 py-20">
          {/* Light cream background */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
          
          {/* Subtle decorative corner */}
          <div className="absolute top-12 left-12 w-24 h-24 border-l-2 border-t-2 border-primary/10" />
          
          <div className="relative max-w-3xl">
            {/* Opening quote mark */}
            <motion.div
              variants={childVariant}
              transition={smoothTransition}
              className="mb-4"
            >
              <span className="font-serif text-7xl lg:text-8xl text-primary/30 leading-none">"</span>
            </motion.div>
            
            {/* Quote text */}
            <motion.p 
              variants={childVariant}
              transition={smoothTransition}
              className="font-serif text-2xl lg:text-3xl xl:text-4xl text-foreground leading-relaxed"
            >
              {quoteText}
            </motion.p>
            
            {/* Author attribution */}
            {authorText && (
              <motion.div 
                variants={childVariant}
                transition={smoothTransition}
                className="mt-10 pt-8 border-t border-primary/10"
              >
                {slide.authorEmail ? (
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <button className="text-left cursor-pointer group">
                        <span className="block text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                          {authorText.split(',')[0]}
                        </span>
                        {authorText.includes(',') && (
                          <span className="block text-sm text-muted-foreground mt-1">
                            {authorText.split(',').slice(1).join(',').trim()}
                          </span>
                        )}
                      </button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-auto bg-card border-border">
                      <a 
                        href={`mailto:${slide.authorEmail}`}
                        className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        <span>{slide.authorEmail}</span>
                      </a>
                    </HoverCardContent>
                  </HoverCard>
                ) : (
                  <div className="text-left">
                    <span className="block text-lg font-medium text-foreground">
                      {authorText.split(',')[0]}
                    </span>
                    {authorText.includes(',') && (
                      <span className="block text-sm text-muted-foreground mt-1">
                        {authorText.split(',').slice(1).join(',').trim()}
                      </span>
                    )}
                  </div>
                )}
              </motion.div>
            )}
            
            {/* Decorative line */}
            <motion.div 
              variants={childVariant}
              transition={smoothTransition}
              className="flex items-center gap-4 mt-10"
            >
              <div className="w-16 h-[1px] bg-primary" />
              <div className="w-8 h-[1px] bg-primary/30" />
            </motion.div>
          </div>
        </div>
        
        {/* Right portrait section - 1/3 width, full height */}
        {authorImage && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
            className="hidden lg:block w-[35%] relative overflow-hidden"
          >
            {/* Gradient overlay on image */}
            <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent z-10 w-24" />
            
            {/* Author portrait */}
            <img 
              src={authorImage} 
              alt={authorText || 'Author'} 
              className="absolute inset-0 w-full h-full object-cover object-top grayscale"
            />
            
            {/* Subtle top/bottom gradient for blend */}
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/20 to-transparent z-10" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/30 to-transparent z-10" />
          </motion.div>
        )}
        
        {/* Fallback decorative panel if no image */}
        {!authorImage && (
          <div className="hidden lg:block w-[35%] relative bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
            <div className="absolute bottom-12 right-12 w-24 h-24 border-r-2 border-b-2 border-primary/10" />
          </div>
        )}
      </motion.div>
    );
  }

  // Bullets/bullet-list slide - Clean list with hierarchy
  if (slide.type === 'bullets' || slide.type === 'bullet-list') {
    // Handle both bullets array and items array with value/text structure
    const bulletItems = slide.items?.length > 0 
      ? slide.items.map((item: any) => ({ value: item.value, label: item.label, text: item.text }))
      : slide.bullets?.map((b: string) => ({ value: null, label: null, text: b })) || [];
    
    return (
      <motion.div
        variants={staggerChildren}
        initial="enter"
        animate={isActive ? "center" : "exit"}
        className="relative flex h-full"
      >
        <CornerAccent position="tl" />
        
        <div className="flex flex-col justify-center px-12 lg:px-20 py-20 w-full">
          <motion.p 
            variants={childVariant}
            transition={smoothTransition}
            className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-4"
          >
            Key Points
          </motion.p>
          
          <motion.h2 
            variants={childVariant}
            transition={smoothTransition}
            className="font-serif text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-10 max-w-3xl"
          >
            {slide.title}
          </motion.h2>
          
          {slide.subtitle && (
            <motion.div 
              variants={childVariant}
              className="text-lg text-muted-foreground mb-8 max-w-2xl [&_strong]:text-primary [&_strong]:font-semibold"
            >
              <RichText text={slide.subtitle} />
            </motion.div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
            {bulletItems.map((item: { value: string | null; label: string | null; text: string }, idx: number) => (
              <motion.div
                key={idx}
                variants={childVariant}
                transition={{ ...smoothTransition, delay: idx * 0.06 }}
                className="border-l-2 border-primary/30 pl-6 py-2"
              >
                {item.label && (
                  <span className="font-mono text-xs tracking-widest text-primary uppercase block mb-1">
                    {item.label}
                  </span>
                )}
                {item.value && !item.label && (
                  <span className="font-mono text-lg lg:text-xl font-bold text-primary block mb-1">
                    {item.value}
                  </span>
                )}
                <RichText 
                  text={item.text} 
                  className="text-base lg:text-lg text-foreground/80 leading-relaxed [&_strong]:text-primary [&_strong]:font-semibold" 
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  // Closing slide
  if (slide.type === 'closing') {
    return (
      <motion.div
        variants={staggerChildren}
        initial="enter"
        animate={isActive ? "center" : "exit"}
        className="relative flex flex-col items-center justify-center h-full text-center px-8 overflow-hidden"
      >
        {/* Premium gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#050505] via-[#0a0a12] to-[#050510]" />
        
        {/* Animated glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/8 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        
        <GridBackground />
        
        {/* Large blue corner frames */}
        <div className="absolute top-8 left-8 w-40 h-40">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary via-primary/70 to-transparent" />
          <div className="absolute top-0 left-0 h-full w-[3px] bg-gradient-to-b from-primary via-primary/70 to-transparent" />
        </div>
        <div className="absolute bottom-8 right-8 w-40 h-40">
          <div className="absolute bottom-0 right-0 w-full h-[3px] bg-gradient-to-l from-primary via-primary/70 to-transparent" />
          <div className="absolute bottom-0 right-0 h-full w-[3px] bg-gradient-to-t from-primary via-primary/70 to-transparent" />
        </div>
        
        {/* Decorative vertical lines */}
        <div className="absolute left-[15%] top-[20%] bottom-[20%] w-[1px] bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
        <div className="absolute right-[15%] top-[20%] bottom-[20%] w-[1px] bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
        
        <motion.h1 
          variants={childVariant}
          transition={smoothTransition}
          className="relative z-10 font-serif text-5xl md:text-6xl lg:text-8xl font-bold tracking-tight text-white mb-6"
        >
          <span className="text-primary">{slide.title?.split(' ')[0]}</span>{' '}
          <span className="text-white">{slide.title?.split(' ').slice(1, -1).join(' ')}</span>{' '}
          <span className="text-primary">{slide.title?.split(' ').slice(-1)}</span>
        </motion.h1>
        
        {slide.subtitle && (
          <motion.p 
            variants={childVariant}
            transition={smoothTransition}
            className="relative z-10 text-lg md:text-xl text-white/50 mt-6 font-light max-w-3xl leading-relaxed"
          >
            {slide.subtitle}
          </motion.p>
        )}
        
        {/* Contact items if present */}
        {slide.items && slide.items.length > 0 && (
          <motion.div 
            variants={childVariant}
            transition={smoothTransition}
            className="relative z-10 mt-10 space-y-3"
          >
            {slide.items.map((item: any, idx: number) => (
              <div key={idx} className="text-white/50 text-sm">
                <span className="font-mono text-xs text-primary/60 uppercase tracking-wider">{item.label}:</span>{' '}
                <span className="text-white/60">{item.text}</span>
              </div>
            ))}
          </motion.div>
        )}
        
      </motion.div>
    );
  }

  // Default content slide - Editorial layout
  return (
    <motion.div
      variants={staggerChildren}
      initial="enter"
      animate={isActive ? "center" : "exit"}
      className="relative flex h-full"
    >
      <CornerAccent position="tl" />
      
      <div className="flex flex-col justify-center px-12 lg:px-20 py-20 max-w-5xl">
        <motion.div 
          variants={childVariant}
          transition={smoothTransition}
          className="flex items-center gap-4 mb-6"
        >
          <div className="w-8 h-[2px] bg-primary" />
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
            Insight
          </span>
        </motion.div>
        
        <motion.h2 
          variants={childVariant}
          transition={smoothTransition}
          className="font-serif text-4xl lg:text-6xl font-bold tracking-tight text-foreground mb-8"
        >
          {slide.title}
        </motion.h2>
        
        {slide.subtitle && (
          <motion.p 
            variants={childVariant}
            transition={smoothTransition}
            className="text-xl text-primary font-medium mb-6"
          >
            {slide.subtitle}
          </motion.p>
        )}
        
        {slide.body && (
          <motion.p 
            variants={childVariant}
            transition={smoothTransition}
            className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-3xl"
          >
            {slide.body}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};

// Progress bar component
const ProgressBar = ({ current, total }: { current: number; total: number }) => (
  <div className="flex items-center gap-3">
    <span className="font-mono text-[10px] tracking-wider text-muted-foreground">
      {String(current + 1).padStart(2, '0')}
    </span>
    <div className="w-24 h-[2px] bg-muted-foreground/20 rounded-full overflow-hidden">
      <motion.div 
        className="h-full bg-primary"
        initial={{ width: 0 }}
        animate={{ width: `${((current + 1) / total) * 100}%` }}
        transition={{ duration: 0.3 }}
      />
    </div>
    <span className="font-mono text-[10px] tracking-wider text-muted-foreground/50">
      {String(total).padStart(2, '0')}
    </span>
  </div>
);

const PresentationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [presentationId, setPresentationId] = useState<string | null>(null);
  const [presentationTitle, setPresentationTitle] = useState("Presentation");
  const slideContainerRef = useRef<HTMLDivElement>(null);
  
  // Presenter mode - simply check URL parameter (no auth required)
  const isPresenterMode = searchParams.get('mode') === 'presenter';
  // Export mode - auto-trigger screenshot capture
  const isExportMode = searchParams.get('export') === 'true';

  // Fetch fresh data from database or use sessionStorage
  useEffect(() => {
    const loadSlides = async () => {
      const urlPresentationId = new URLSearchParams(window.location.search).get('id');
      const sessionPresentationId = sessionStorage.getItem('rubiklab-presentation-id');
      const loadedPresentationId = urlPresentationId || sessionPresentationId;

      const clientName = sessionStorage.getItem('rubiklab-client') || 'Presentation';
      
      // If we have a presentation ID, fetch fresh data from the database
      if (loadedPresentationId) {
        try {
          const { data, error } = await supabase
            .from('presentations')
            .select('id, generated_slides, client_name')
            .eq('id', loadedPresentationId)
            .single();
          
          if (!error && data?.generated_slides && Array.isArray(data.generated_slides)) {
            console.log('Loaded fresh slides from database:', data.generated_slides.length);
            // Update sessionStorage with fresh data
            sessionStorage.setItem('rubiklab-presentation-id', data.id);
            sessionStorage.setItem('rubiklab-generated-slides', JSON.stringify(data.generated_slides));
            sessionStorage.setItem('rubiklab-client', data.client_name || clientName);
            setPresentationId(data.id);
            setSlides(convertGeneratedSlides(data.generated_slides, data.client_name || clientName));
            setIsLoading(false);
            return;
          }
        } catch (e) {
          console.error('Error fetching presentation:', e);
        }
      }

      // If /presentation is opened directly (no sessionStorage), fall back to latest saved deck
      try {
        const { data: latest, error: latestError } = await supabase
          .from('presentations')
          .select('id, generated_slides, client_name')
          .not('generated_slides', 'is', null)
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!latestError && latest?.generated_slides && Array.isArray(latest.generated_slides)) {
          console.log('Loaded latest saved presentation:', latest.id);
          sessionStorage.setItem('rubiklab-presentation-id', latest.id);
          sessionStorage.setItem('rubiklab-generated-slides', JSON.stringify(latest.generated_slides));
          sessionStorage.setItem('rubiklab-client', latest.client_name || clientName);
          setPresentationId(latest.id);
          setSlides(convertGeneratedSlides(latest.generated_slides, latest.client_name || clientName));
          setIsLoading(false);
          return;
        }
      } catch (e) {
        console.error('Error fetching latest presentation:', e);
      }
      
      // Fallback to sessionStorage
      const generatedSlidesJson = sessionStorage.getItem('rubiklab-generated-slides');
      
      console.log('Loading slides from sessionStorage, found:', generatedSlidesJson ? 'yes' : 'no');
      
      if (generatedSlidesJson) {
        try {
          const generatedSlides = JSON.parse(generatedSlidesJson);
          console.log('Parsed slides count:', generatedSlides.length);
          if (Array.isArray(generatedSlides) && generatedSlides.length > 0) {
            setSlides(convertGeneratedSlides(generatedSlides, clientName));
            setIsLoading(false);
            return;
          }
        } catch (e) {
          console.error('Error parsing generated slides:', e);
        }
      }
      
      // Fallback to parsing raw content
      const content = sessionStorage.getItem('rubiklab-content') || '';
      setSlides(parseContentToSlides(content, clientName));
      setIsLoading(false);
    };
    
    loadSlides();
  }, []);

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < slides.length) {
      setCurrentSlide(index);
    }
  }, [slides.length]);

  const nextSlide = useCallback(() => goToSlide(currentSlide + 1), [currentSlide, goToSlide]);
  const prevSlide = useCallback(() => goToSlide(currentSlide - 1), [currentSlide, goToSlide]);

  const currentSlideData = slides[currentSlide];
  const isDark = currentSlideData?.dark;

  // Keyboard navigation - disabled when typing in input/textarea
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle navigation when user is typing in an input or textarea
      const activeElement = document.activeElement;
      const isTyping = activeElement?.tagName === 'TEXTAREA' || 
                       activeElement?.tagName === 'INPUT' ||
                       (activeElement as HTMLElement)?.isContentEditable;
      
      if (isTyping) return;
      
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Escape') {
        navigate('/');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, navigate]);

  // Loading state
  if (isLoading || slides.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-sm text-muted-foreground">Loading presentation...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "h-screen flex flex-col overflow-hidden transition-colors duration-500 font-sans selection:bg-[#E1F5FE] selection:text-[#0D9BDD]",
      isDark ? "bg-[#0a0a0f]" : "bg-[#F9F8F4] text-[#1C1C1C]"
    )}>
      {/* Header - minimal, just progress */}
      <header className={cn(
        "absolute top-0 z-20 px-8 py-6 transition-colors duration-500",
        isPresenterMode ? "right-80" : "right-0",
        isDark ? "text-white" : "text-foreground"
      )}>
        <ProgressBar current={currentSlide} total={slides.length} />
      </header>

      {/* Slide content */}
      <main 
        ref={slideContainerRef}
        className={cn(
          "flex-1 relative transition-all duration-300",
          isPresenterMode && "mr-80"
        )}
      >
        <AnimatePresence mode="wait">
          <SlideContent
            key={currentSlide}
            slide={slides[currentSlide]}
            isActive={true}
            isExportMode={isExportMode}
          />
        </AnimatePresence>
      </main>

      {/* Footer - Logo and presenter toggle */}
      <footer className={cn(
        "absolute bottom-0 left-0 right-0 z-20 px-8 py-6 transition-colors duration-500 flex justify-between items-center",
        isDark ? "text-white" : "text-foreground",
        isPresenterMode && "right-80"
      )}>
        <button
          onClick={() => navigate('/')}
          className="group flex items-center gap-1.5 transition-opacity hover:opacity-80"
        >
          <span className={cn(
            "font-serif font-bold text-xl tracking-tight lowercase transition-colors",
            isDark ? "text-white/60 group-hover:text-primary" : "text-foreground/50 group-hover:text-primary"
          )}>
            rubiklab
          </span>
          <div className="relative flex items-center justify-center">
            <div className="absolute w-2.5 h-2.5 bg-primary rounded-full animate-ping opacity-20" />
            <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_12px_hsl(var(--primary)/0.4)]" />
          </div>
        </button>

        {/* Presenter mode toggle */}
        {isPresenterMode ? (
          <button
            onClick={() => {
              const newParams = new URLSearchParams(searchParams);
              newParams.delete('mode');
              navigate(`/presentation?${newParams.toString()}`, { replace: true });
            }}
            className={cn(
              "flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium transition-all opacity-60 hover:opacity-100",
              isDark 
                ? "bg-white/10 text-white/80 hover:bg-white/20" 
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
            title="Exit presenter mode"
          >
            <StickyNote className="w-3 h-3" />
            <span>Exit Notes</span>
          </button>
        ) : (
          <button
            onClick={() => {
              const newParams = new URLSearchParams(searchParams);
              newParams.set('mode', 'presenter');
              navigate(`/presentation?${newParams.toString()}`, { replace: true });
            }}
            className={cn(
              "p-2 rounded-lg transition-all opacity-40 hover:opacity-100",
              isDark 
                ? "text-white/60 hover:bg-white/10 hover:text-white" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            title="Enter presenter mode (N)"
          >
            <StickyNote className="w-4 h-4" />
          </button>
        )}
      </footer>

      {/* Screenshot-based PPT Export - auto-starts in export mode */}
      {isExportMode && slides.length > 0 && (
        <ScreenshotExporter
          slideContainerRef={slideContainerRef}
          totalSlides={slides.length}
          currentSlide={currentSlide}
          onSlideChange={goToSlide}
          presentationTitle={presentationTitle}
          isDark={isDark}
          autoStart={true}
          onComplete={() => {
            // Navigate back to home after export completes
            navigate('/');
          }}
        />
      )}

      {/* Presenter Notes Panel - only in presenter mode */}
      {isPresenterMode && (
        <PresenterNotesPanel
          presentationId={presentationId}
          currentSlide={currentSlide}
          totalSlides={slides.length}
          isDark={isDark}
          onPopout={() => {
            // Exit presenter mode for clean screen sharing
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('mode');
            navigate(`/presentation?${newParams.toString()}`, { replace: true });
          }}
        />
      )}

    </div>
  );
};

export default PresentationPage;
