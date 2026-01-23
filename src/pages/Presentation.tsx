import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PresenterNotesPanel } from "@/components/PresenterNotesPanel";
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
interface Slide {
  id: number;
  type: 'title' | 'content' | 'section' | 'bullets' | 'quote' | 'closing' | 'cover' | 'section-divider' | 'text-stack' | 'bullet-list' | 'metrics' | 'two-column' | 'cta';
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
  quote?: string;
  author?: string;
  authorEmail?: string;
  meta?: string;
  dark?: boolean;
}

// Convert generated slides to our internal format
const convertGeneratedSlides = (generatedSlides: any[], clientName: string): Slide[] => {
  let sectionCount = 0;
  
  return generatedSlides.map((slide, index) => {
    // Increment section count for cover and section-divider slides
    if (slide.type === 'cover' || slide.type === 'section-divider') {
      sectionCount++;
    }
    
    // Quote slides are now LIGHT for variety - don't start with two dark slides
    const isDarkSlide = slide.dark ?? (
      slide.type === 'cover' || 
      slide.type === 'section-divider' || 
      slide.type === 'closing' || 
      slide.type === 'cta'
      // Quote removed from dark list - now light themed
    );
    
    return {
      id: index,
      type: slide.type as Slide['type'],
      title: slide.title || '',
      subtitle: slide.subtitle,
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
      kicker: (slide.type === 'cover' || slide.type === 'section-divider') 
        ? String(sectionCount).padStart(2, '0') 
        : slide.kicker,
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
const MorphingGradientBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Base gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-black via-[#050505] to-[#0a0a0a]" />
    
    {/* Morphing gradient blobs */}
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
    
    {/* Subtle noise overlay for texture */}
    <div 
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }}
    />
  </div>
);

// Premium geometric pattern for cover
const CoverPattern = () => (
  <div className="absolute inset-0 overflow-hidden">
    {/* Radial gradient overlay */}
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--primary)/0.15)_0%,_transparent_50%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_hsl(var(--primary)/0.1)_0%,_transparent_40%)]" />
    
    {/* Geometric lines */}
    <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="cover-grid" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M 100 0 L 0 100" stroke="white" strokeWidth="0.5" fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#cover-grid)" />
    </svg>
    
    {/* Floating geometric shapes */}
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

// Decorative corner accent
const CornerAccent = ({ position, inverted }: { position: 'tl' | 'br'; inverted?: boolean }) => (
  <div className={cn(
    "absolute w-16 h-16",
    position === 'tl' ? "top-8 left-8" : "bottom-8 right-8"
  )}>
    <div className={cn(
      "absolute w-full h-[1px]",
      position === 'tl' ? "top-0 left-0" : "bottom-0 right-0",
      inverted ? "bg-white/20" : "bg-foreground/10"
    )} />
    <div className={cn(
      "absolute h-full w-[1px]",
      position === 'tl' ? "top-0 left-0" : "bottom-0 right-0",
      inverted ? "bg-white/20" : "bg-foreground/10"
    )} />
  </div>
);

// Premium corner frame for cover
const CoverFrame = () => (
  <>
    {/* Top left corner */}
    <div className="absolute top-8 left-8 w-24 h-24">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-white/30 to-transparent" />
      <div className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-b from-white/30 to-transparent" />
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
    {/* Bottom right corner */}
    <div className="absolute bottom-8 right-8 w-24 h-24">
      <div className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-l from-primary/40 to-transparent" />
      <div className="absolute bottom-0 right-0 h-full w-[1px] bg-gradient-to-t from-primary/40 to-transparent" />
    </div>
  </>
);

const SlideContent = ({ slide, isActive }: { slide: Slide; isActive: boolean }) => {
  // Slide-down animation - new slide enters from top, current exits to bottom
  const fadeEase = [0.4, 0, 0.2, 1] as const; // Material design standard easing
  
  const variants = {
    enter: { opacity: 0, y: '-8%' },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: '8%' },
  };

  const staggerChildren = {
    center: {
      transition: { 
        staggerChildren: 0.1, 
        delayChildren: 0.05
      }
    }
  };

  const childVariant = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
  };
  
  // Smooth fade transition
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
        {/* Premium background elements */}
        <CoverPattern />
        <LargeDecorativeNumber number={slide.kicker || '01'} />
        <CoverFrame />
        
        {/* Main content - left aligned for editorial feel */}
        <div className="relative z-10 flex flex-col justify-center h-full px-12 lg:px-20 max-w-5xl">
          
          {/* Kicker/Event info */}
          {slide.kicker && (
            <motion.div 
              variants={childVariant}
              transition={smoothTransition}
              className="flex items-center gap-4 mb-6"
            >
              <div className="w-12 h-[1px] bg-primary" />
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-primary">
                {slide.kicker}
              </span>
            </motion.div>
          )}
          
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
          
          {/* Decorative bottom line - no text to avoid logo duplication */}
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
        <MorphingGradientBackground />
        
        {/* Large background section number - matching cover style */}
        <LargeDecorativeNumber number={slide.kicker || '01'} />
        
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
            {slide.title}
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
            <div className="w-24 h-[2px] bg-primary" />
            <div className="w-8 h-[2px] bg-white/20" />
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
              className="prose prose-lg text-foreground"
            >
              <p className="text-lg leading-relaxed">{slide.leftColumn}</p>
            </motion.div>
            <motion.div
              variants={childVariant}
              transition={smoothTransition}
              className="prose prose-lg text-foreground"
            >
              <p className="text-lg leading-relaxed">{slide.rightColumn}</p>
            </motion.div>
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
                  <p className="text-lg lg:text-xl leading-relaxed text-foreground/80">
                    {item.text || item.value}
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (slide.content || slide.body) && (
            <motion.p 
              variants={childVariant}
              className="text-lg lg:text-xl leading-relaxed text-foreground/80"
            >
              {slide.content || slide.body}
            </motion.p>
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

  // Quote slide - Premium split layout with author portrait
  if (slide.type === 'quote') {
    const quoteText = slide.quote || slide.title || slide.content;
    const authorText = slide.author || slide.subtitle;
    
    // Dynamic author image mapping
    const getAuthorImage = (author: string | undefined) => {
      if (!author) return null;
      const authorLower = author.toLowerCase();
      if (authorLower.includes('owen')) return owenJenkinsImg;
      if (authorLower.includes('illitch')) return illitchImg;
      if (authorLower.includes('zsolt')) return zsoltImg;
      if (authorLower.includes('tibor')) return tiborImg;
      return null;
    };
    
    const authorImage = getAuthorImage(authorText);
    
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
      ? slide.items.map((item: any) => ({ value: item.value, text: item.text }))
      : slide.bullets?.map((b: string) => ({ value: null, text: b })) || [];
    
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
            <motion.p 
              variants={childVariant}
              className="text-lg text-muted-foreground mb-8 max-w-2xl"
            >
              {slide.subtitle}
            </motion.p>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
            {bulletItems.map((item: { value: string | null; text: string }, idx: number) => (
              <motion.div
                key={idx}
                variants={childVariant}
                transition={{ ...smoothTransition, delay: idx * 0.06 }}
                className="border-l-2 border-primary/30 pl-6 py-2"
              >
                {item.value && (
                  <span className="font-mono text-lg lg:text-xl font-bold text-primary block mb-1">
                    {item.value}
                  </span>
                )}
                <span className="text-base lg:text-lg text-foreground/80 leading-relaxed">
                  {item.text}
                </span>
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
        className="relative flex flex-col items-center justify-center h-full text-center px-8"
      >
        <GridBackground />
        <CornerAccent position="tl" inverted />
        <CornerAccent position="br" inverted />
        
        <motion.h1 
          variants={childVariant}
          transition={smoothTransition}
          className="font-serif text-6xl lg:text-8xl font-bold tracking-tight text-white mb-4"
        >
          {slide.title}
        </motion.h1>
        
        {slide.subtitle && (
          <motion.p 
            variants={childVariant}
            transition={smoothTransition}
            className="text-xl text-white/60 mt-4 font-light"
          >
            {slide.subtitle}
          </motion.p>
        )}
        
        {/* Contact items if present */}
        {slide.items && slide.items.length > 0 && (
          <motion.div 
            variants={childVariant}
            transition={smoothTransition}
            className="mt-10 space-y-3"
          >
            {slide.items.map((item: any, idx: number) => (
              <div key={idx} className="text-white/50 text-sm">
                <span className="font-mono text-xs text-white/30 uppercase tracking-wider">{item.label}:</span>{' '}
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
  
  // Presenter mode detection from URL
  const isPresenterMode = searchParams.get('mode') === 'presenter';

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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
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
      "h-screen flex flex-col overflow-hidden transition-colors duration-500",
      isDark ? "bg-[#0a0a0f]" : "bg-background"
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
      <main className={cn(
        "flex-1 relative transition-all duration-300",
        isPresenterMode && "mr-80"
      )}>
        <AnimatePresence mode="wait">
          <SlideContent
            key={currentSlide}
            slide={slides[currentSlide]}
            isActive={true}
          />
        </AnimatePresence>
      </main>

      {/* Footer - Logo only (click to exit) */}
      <footer className={cn(
        "absolute bottom-0 left-0 z-20 px-8 py-6 transition-colors duration-500",
        isDark ? "text-white" : "text-foreground"
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
      </footer>

      {/* Presenter Notes Panel - only in presenter mode */}
      {isPresenterMode && (
        <PresenterNotesPanel
          presentationId={presentationId}
          currentSlide={currentSlide}
          totalSlides={slides.length}
          isDark={isDark}
        />
      )}
    </div>
  );
};

export default PresentationPage;
