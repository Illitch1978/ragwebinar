import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
// No arrow icons needed - navigation is via logo click and keyboard
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

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
  meta?: string;
  dark?: boolean;
}

// Convert generated slides to our internal format
const convertGeneratedSlides = (generatedSlides: any[], clientName: string): Slide[] => {
  return generatedSlides.map((slide, index) => ({
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
    dark: slide.dark ?? (slide.type === 'cover' || slide.type === 'section-divider' || slide.type === 'closing'),
    kicker: slide.type === 'cover' ? 'Strategic Intelligence' : undefined,
  }));
};

// Parse markdown into slides with alternating dark themes
const parseContentToSlides = (content: string, clientName: string): Slide[] => {
  const slides: Slide[] = [];
  const lines = content.split('\n');
  
  // Title slide - always dark for impact
  slides.push({
    id: 0,
    type: 'title',
    kicker: 'Strategic Intelligence',
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

// Large decorative number for cover
const CoverDecorativeNumber = () => (
  <div className="absolute bottom-0 right-0 overflow-hidden pointer-events-none">
    <span className="font-mono text-[400px] lg:text-[600px] font-bold text-white/[0.02] leading-none tracking-tighter select-none" style={{ transform: 'translate(20%, 30%)' }}>
      01
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
  const variants = {
    enter: { opacity: 0, y: 20 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const staggerChildren = {
    center: {
      transition: { staggerChildren: 0.12, delayChildren: 0.15 }
    }
  };

  const childVariant = {
    enter: { opacity: 0, y: 12 },
    center: { opacity: 1, y: 0 },
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
        <CoverDecorativeNumber />
        <CoverFrame />
        
        {/* Main content - left aligned for editorial feel */}
        <div className="relative z-10 flex flex-col justify-center h-full px-12 lg:px-20 max-w-5xl">
          
          {/* Kicker/Event info */}
          {slide.kicker && (
            <motion.div 
              variants={childVariant}
              transition={{ duration: 0.5 }}
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
            transition={{ duration: 0.6 }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-6"
          >
            {slide.title}
          </motion.h1>
          
          {/* Subtitle if present */}
          {slide.subtitle && (
            <motion.p 
              variants={childVariant}
              transition={{ duration: 0.5 }}
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
          
          {/* Decorative bottom line */}
          <motion.div 
            variants={childVariant}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="absolute bottom-20 left-12 lg:left-20 flex items-center gap-4"
          >
            <div className="w-24 h-[2px] bg-gradient-to-r from-primary to-primary/0" />
            <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/30">
              Strategic Intelligence Report
            </span>
          </motion.div>
        </div>
        
        {/* Right side accent */}
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
      </motion.div>
    );
  }

  // Section/Section-divider slide - Bold typographic treatment
  if (slide.type === 'section' || slide.type === 'section-divider') {
    return (
      <motion.div
        variants={staggerChildren}
        initial="enter"
        animate={isActive ? "center" : "exit"}
        className="relative flex h-full"
      >
        <GridBackground />
        
        {/* Large section number */}
        <div className="absolute top-8 left-12 lg:left-20">
          <motion.span 
            variants={childVariant}
            transition={{ duration: 0.5 }}
            className="font-mono text-[120px] lg:text-[180px] font-bold text-white/[0.03] leading-none"
          >
            {slide.kicker || ''}
          </motion.span>
        </div>
        
        <div className="flex flex-col justify-center px-12 lg:px-20 z-10">
          {slide.kicker && (
            <motion.p 
              variants={childVariant}
              transition={{ duration: 0.5 }}
              className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary mb-6"
            >
              Section {slide.kicker}
            </motion.p>
          )}
          
          <motion.h2 
            variants={childVariant}
            transition={{ duration: 0.6 }}
            className="font-serif text-5xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl"
          >
            {slide.title}
          </motion.h2>
          
          {slide.subtitle && (
            <motion.p 
              variants={childVariant}
              transition={{ duration: 0.5 }}
              className="text-xl text-white/60 mt-6 max-w-2xl"
            >
              {slide.subtitle}
            </motion.p>
          )}
          
          <motion.div 
            variants={childVariant}
            transition={{ duration: 0.5, delay: 0.2 }}
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
            transition={{ duration: 0.4 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-8 h-[2px] bg-primary" />
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
              Key Metrics
            </span>
          </motion.div>
          
          <motion.h2 
            variants={childVariant}
            transition={{ duration: 0.5 }}
            className="font-serif text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-12 max-w-3xl"
          >
            {slide.title}
          </motion.h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {slide.metrics?.map((metric, idx) => (
              <motion.div
                key={idx}
                variants={childVariant}
                transition={{ duration: 0.4, delay: 0.1 + idx * 0.1 }}
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
            transition={{ duration: 0.4 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-8 h-[2px] bg-primary" />
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
              Analysis
            </span>
          </motion.div>
          
          <motion.h2 
            variants={childVariant}
            transition={{ duration: 0.5 }}
            className="font-serif text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-10 max-w-4xl"
          >
            {slide.title}
          </motion.h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              variants={childVariant}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="prose prose-lg text-foreground"
            >
              <p className="text-lg leading-relaxed">{slide.leftColumn}</p>
            </motion.div>
            <motion.div
              variants={childVariant}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="prose prose-lg text-foreground"
            >
              <p className="text-lg leading-relaxed">{slide.rightColumn}</p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Text-stack slide - Simple text content
  if (slide.type === 'text-stack') {
    return (
      <motion.div
        variants={staggerChildren}
        initial="enter"
        animate={isActive ? "center" : "exit"}
        className="relative flex h-full"
      >
        <CornerAccent position="tl" />
        
        <div className="flex flex-col justify-center px-12 lg:px-20 py-20 max-w-4xl">
          <motion.div 
            variants={childVariant}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-8 h-[2px] bg-primary" />
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
              {slide.kicker || 'Insight'}
            </span>
          </motion.div>
          
          <motion.h2 
            variants={childVariant}
            transition={{ duration: 0.5 }}
            className="font-serif text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-8"
          >
            {slide.title}
          </motion.h2>
          
          {slide.subtitle && (
            <motion.p 
              variants={childVariant}
              className="text-xl text-muted-foreground mb-6"
            >
              {slide.subtitle}
            </motion.p>
          )}
          
          {(slide.content || slide.body) && (
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
          transition={{ duration: 0.6 }}
          className="font-serif text-5xl lg:text-7xl font-bold tracking-tight text-white mb-6"
        >
          {slide.title}
        </motion.h1>
        
        {slide.subtitle && (
          <motion.p 
            variants={childVariant}
            transition={{ duration: 0.6 }}
            className="text-xl text-white/60 max-w-2xl"
          >
            {slide.subtitle}
          </motion.p>
        )}
        
        {(slide.content || slide.body) && (
          <motion.p 
            variants={childVariant}
            transition={{ duration: 0.5 }}
            className="text-lg text-white/50 mt-4 max-w-xl"
          >
            {slide.content || slide.body}
          </motion.p>
        )}
        
        <motion.div 
          variants={childVariant}
          transition={{ duration: 0.5, delay: 0.3 }}
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

  // Quote slide - Elegant emphasis
  if (slide.type === 'quote') {
    return (
      <motion.div
        variants={staggerChildren}
        initial="enter"
        animate={isActive ? "center" : "exit"}
        className="relative flex items-center justify-center h-full px-12 lg:px-20"
      >
        <GridBackground />
        
        <div className="max-w-5xl text-center">
          <motion.div
            variants={childVariant}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <span className="font-serif text-8xl text-primary/30">"</span>
          </motion.div>
          
          <motion.p 
            variants={childVariant}
            transition={{ duration: 0.7 }}
            className="font-serif text-3xl lg:text-5xl text-white leading-relaxed"
          >
            {slide.title}
          </motion.p>
          
          <motion.div 
            variants={childVariant}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center mt-10"
          >
            <div className="w-16 h-[1px] bg-primary" />
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Bullets/bullet-list slide - Clean list with hierarchy
  if (slide.type === 'bullets' || slide.type === 'bullet-list') {
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
            transition={{ duration: 0.4 }}
            className="font-mono text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-4"
          >
            Key Points
          </motion.p>
          
          <motion.h2 
            variants={childVariant}
            transition={{ duration: 0.5 }}
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
          
          <ul className="space-y-5 mt-2 max-w-3xl">
            {slide.bullets?.map((bullet, idx) => (
              <motion.li
                key={idx}
                variants={childVariant}
                transition={{ duration: 0.4, delay: 0.1 + idx * 0.08 }}
                className="flex items-start gap-5 group"
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                  <span className="font-mono text-xs text-primary font-medium">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </span>
                <span className="text-lg lg:text-xl text-foreground leading-relaxed pt-1">
                  {bullet}
                </span>
              </motion.li>
            ))}
          </ul>
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
        
        <motion.div
          variants={childVariant}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <RubiklabLogo inverted />
        </motion.div>
        
        <motion.h1 
          variants={childVariant}
          transition={{ duration: 0.6 }}
          className="font-serif text-6xl lg:text-8xl font-bold tracking-tight text-white mb-4"
        >
          {slide.title}
        </motion.h1>
        
        {slide.subtitle && (
          <motion.p 
            variants={childVariant}
            transition={{ duration: 0.6 }}
            className="text-xl text-white/60 mt-4 font-light"
          >
            {slide.subtitle}
          </motion.p>
        )}
        
        <motion.div 
          variants={childVariant}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="absolute bottom-12 flex items-center gap-3"
        >
          <span className="font-mono text-[10px] tracking-widest text-white/40 uppercase">
            rubiklab.ai
          </span>
        </motion.div>
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
          transition={{ duration: 0.4 }}
          className="flex items-center gap-4 mb-6"
        >
          <div className="w-8 h-[2px] bg-primary" />
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
            Insight
          </span>
        </motion.div>
        
        <motion.h2 
          variants={childVariant}
          transition={{ duration: 0.5 }}
          className="font-serif text-4xl lg:text-6xl font-bold tracking-tight text-foreground mb-8"
        >
          {slide.title}
        </motion.h2>
        
        {slide.subtitle && (
          <motion.p 
            variants={childVariant}
            transition={{ duration: 0.5 }}
            className="text-xl text-primary font-medium mb-6"
          >
            {slide.subtitle}
          </motion.p>
        )}
        
        {slide.body && (
          <motion.p 
            variants={childVariant}
            transition={{ duration: 0.6 }}
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
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = useMemo(() => {
    // Check for AI-generated slides first
    const generatedSlidesJson = sessionStorage.getItem('rubiklab-generated-slides');
    const clientName = sessionStorage.getItem('rubiklab-client') || 'Presentation';
    
    if (generatedSlidesJson) {
      try {
        const generatedSlides = JSON.parse(generatedSlidesJson);
        if (Array.isArray(generatedSlides) && generatedSlides.length > 0) {
          return convertGeneratedSlides(generatedSlides, clientName);
        }
      } catch (e) {
        console.error('Error parsing generated slides:', e);
      }
    }
    
    // Fallback to parsing raw content
    const content = sessionStorage.getItem('rubiklab-content') || '';
    return parseContentToSlides(content, clientName);
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

  return (
    <div className={cn(
      "h-screen flex flex-col overflow-hidden transition-colors duration-500",
      isDark ? "bg-[#0a0a0f]" : "bg-background"
    )}>
      {/* Header - minimal, just progress */}
      <header className={cn(
        "absolute top-0 right-0 z-20 px-8 py-6 transition-colors duration-500",
        isDark ? "text-white" : "text-foreground"
      )}>
        <ProgressBar current={currentSlide} total={slides.length} />
      </header>

      {/* Slide content */}
      <main className="flex-1 relative">
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
    </div>
  );
};

export default PresentationPage;
