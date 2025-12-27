import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

const phrases = [
  "brings it back together",
  "shows how your website really performs",
  "measures what visitors actually notice",
  "turns signals into a clear score",
  "exposes hidden website friction",
  "checks how search and AI see you",
  "benchmarks you against real competitors",
  "shows where you stand and why",
  "highlights what helps or hurts conversion",
  "turns audits into decisions",
  "shows what matters in the first seconds",
  "replaces guesswork with structure",
];

interface CyclingTaglineProps {
  isVisible: boolean;
}

const CyclingTagline = ({ isVisible }: CyclingTaglineProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % phrases.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <motion.div 
      ref={containerRef}
      className="cycling-tagline-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      style={{ opacity }}
    >
      <div className="cycling-tagline">
        <span className="mondro-static">mondro<span className="mondro-dot"></span></span>
        <div className="phrase-container">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentIndex}
              className="cycling-phrase"
              initial={{ 
                opacity: 0, 
                y: 20,
                filter: 'blur(8px)',
                clipPath: 'inset(100% 0 0 0)'
              }}
              animate={{ 
                opacity: 1, 
                y: 0,
                filter: 'blur(0px)',
                clipPath: 'inset(0% 0 0 0)'
              }}
              exit={{ 
                opacity: 0, 
                y: -20,
                filter: 'blur(8px)',
                clipPath: 'inset(0 0 100% 0)'
              }}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              {phrases[currentIndex]}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default CyclingTagline;
