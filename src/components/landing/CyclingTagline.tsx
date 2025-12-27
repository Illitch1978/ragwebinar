import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const phrases = [
  "brings it back together",
  "shows how your site really performs",
  "measures what visitors notice",
  "turns signals into a clear score",
  "exposes hidden friction",
  "checks how search and AI see you",
  "benchmarks you against competitors",
  "shows where you stand and why",
  "highlights what helps or hurts",
  "turns audits into decisions",
  "reveals what matters in seconds",
  "replaces guesswork with structure",
];

interface CyclingTaglineProps {
  isVisible: boolean;
}

const CyclingTagline = ({ isVisible }: CyclingTaglineProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % phrases.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div 
      className="cycling-tagline-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="cycling-tagline">
        <span className="mondro-static">
          mondro<span className="mondro-dot"></span>
        </span>
        <div className="phrase-container">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentIndex}
              className="cycling-phrase"
              initial={{ 
                opacity: 0, 
                filter: "blur(12px)",
              }}
              animate={{ 
                opacity: 1, 
                filter: "blur(0px)",
              }}
              exit={{ 
                opacity: 0, 
                filter: "blur(8px)",
              }}
              transition={{ 
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1],
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
