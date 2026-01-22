import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Slide {
  id: number;
  type: 'title' | 'content' | 'section' | 'bullets' | 'quote';
  kicker?: string;
  title: string;
  subtitle?: string;
  body?: string;
  bullets?: string[];
  meta?: string;
}

// Parse markdown into slides
const parseContentToSlides = (content: string, clientName: string): Slide[] => {
  const slides: Slide[] = [];
  const lines = content.split('\n');
  
  // Title slide
  slides.push({
    id: 0,
    type: 'title',
    kicker: 'Rubiklab Presents',
    title: clientName || 'Presentation',
    subtitle: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
  });

  let currentSlide: Partial<Slide> | null = null;
  let slideId = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // H1 - Section title slide
    if (line.startsWith('# ')) {
      if (currentSlide?.title) {
        slides.push({ id: slideId++, type: currentSlide.type || 'content', ...currentSlide } as Slide);
      }
      currentSlide = {
        type: 'section',
        title: line.replace(/^#\s+/, ''),
        kicker: `Section ${slides.length}`,
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
    // Blockquote
    else if (line.startsWith('> ')) {
      if (currentSlide?.title) {
        slides.push({ id: slideId++, type: currentSlide.type || 'content', ...currentSlide } as Slide);
      }
      currentSlide = {
        type: 'quote',
        title: line.replace(/^>\s+/, ''),
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

  // Closing slide
  slides.push({
    id: slideId,
    type: 'title',
    kicker: 'Thank You',
    title: 'Questions?',
    subtitle: 'rubiklab.com',
  });

  return slides;
};

// Rubiklab Logo component
const RubiklabLogo = () => (
  <div className="flex items-center gap-1.5">
    <span className="font-serif font-bold tracking-tight text-foreground text-xl">
      Rubiklab
    </span>
    <div className="relative flex items-center justify-center">
      <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_hsl(var(--primary)/0.3)]" />
    </div>
  </div>
);

const SlideContent = ({ slide, isActive }: { slide: Slide; isActive: boolean }) => {
  const variants = {
    enter: { opacity: 0, y: 20 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  if (slide.type === 'title') {
    return (
      <motion.div
        variants={variants}
        initial="enter"
        animate={isActive ? "center" : "exit"}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center justify-center h-full text-center px-8"
      >
        {slide.kicker && (
          <p className="font-mono text-[12px] tracking-[0.2em] uppercase text-muted-foreground mb-6">
            {slide.kicker}
          </p>
        )}
        <h1 className="font-serif text-5xl lg:text-7xl font-bold tracking-tight text-foreground mb-4">
          {slide.title}
        </h1>
        {slide.subtitle && (
          <p className="text-xl text-muted-foreground mt-4">{slide.subtitle}</p>
        )}
      </motion.div>
    );
  }

  if (slide.type === 'section') {
    return (
      <motion.div
        variants={variants}
        initial="enter"
        animate={isActive ? "center" : "exit"}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col justify-center h-full px-12 lg:px-20"
      >
        {slide.kicker && (
          <p className="font-mono text-[11px] tracking-[0.15em] uppercase text-primary mb-4">
            {slide.kicker}
          </p>
        )}
        <h2 className="font-serif text-4xl lg:text-6xl font-bold tracking-tight text-foreground">
          {slide.title}
        </h2>
        <div className="w-24 h-1 bg-primary mt-8" />
      </motion.div>
    );
  }

  if (slide.type === 'quote') {
    return (
      <motion.div
        variants={variants}
        initial="enter"
        animate={isActive ? "center" : "exit"}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col justify-center h-full px-12 lg:px-20"
      >
        <div className="border-l-4 border-primary pl-8">
          <p className="font-serif text-3xl lg:text-4xl italic text-foreground leading-relaxed">
            "{slide.title}"
          </p>
        </div>
      </motion.div>
    );
  }

  if (slide.type === 'bullets') {
    return (
      <motion.div
        variants={variants}
        initial="enter"
        animate={isActive ? "center" : "exit"}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col justify-center h-full px-12 lg:px-20"
      >
        <h2 className="font-serif text-3xl lg:text-5xl font-bold tracking-tight text-foreground mb-8">
          {slide.title}
        </h2>
        {slide.subtitle && (
          <p className="text-lg text-muted-foreground mb-6">{slide.subtitle}</p>
        )}
        <ul className="space-y-4 mt-4">
          {slide.bullets?.map((bullet, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ delay: 0.2 + idx * 0.1, duration: 0.4 }}
              className="flex items-start gap-4 text-xl text-foreground"
            >
              <span className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0" />
              <span>{bullet}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    );
  }

  // Default content slide
  return (
    <motion.div
      variants={variants}
      initial="enter"
      animate={isActive ? "center" : "exit"}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col justify-center h-full px-12 lg:px-20"
    >
      <h2 className="font-serif text-3xl lg:text-5xl font-bold tracking-tight text-foreground mb-6">
        {slide.title}
      </h2>
      {slide.subtitle && (
        <p className="text-xl text-primary font-medium mb-4">{slide.subtitle}</p>
      )}
      {slide.body && (
        <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-4xl">
          {slide.body}
        </p>
      )}
    </motion.div>
  );
};

const PresentationPage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = useMemo(() => {
    const content = sessionStorage.getItem('rubiklab-content') || '';
    const clientName = sessionStorage.getItem('rubiklab-client') || 'Presentation';
    return parseContentToSlides(content, clientName);
  }, []);

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < slides.length) {
      setCurrentSlide(index);
    }
  }, [slides.length]);

  const nextSlide = useCallback(() => goToSlide(currentSlide + 1), [currentSlide, goToSlide]);
  const prevSlide = useCallback(() => goToSlide(currentSlide - 1), [currentSlide, goToSlide]);

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
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 px-8 py-6 flex justify-between items-center">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-mono text-[11px] uppercase tracking-widest">Back</span>
        </button>
        <RubiklabLogo />
        <span className="font-mono text-[11px] text-muted-foreground">
          {currentSlide + 1} / {slides.length}
        </span>
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

      {/* Navigation */}
      <footer className="absolute bottom-0 left-0 right-0 z-20 px-8 py-6 flex justify-between items-center">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className={cn(
            "p-3 rounded-full border border-border transition-all",
            currentSlide === 0
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-muted hover:border-primary"
          )}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Progress dots */}
        <div className="flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                idx === currentSlide
                  ? "bg-primary scale-125"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className={cn(
            "p-3 rounded-full border border-border transition-all",
            currentSlide === slides.length - 1
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-muted hover:border-primary"
          )}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </footer>
    </div>
  );
};

export default PresentationPage;
