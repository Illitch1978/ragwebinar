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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
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
                y: 8,
                x: -3,
              }}
              animate={{ 
                opacity: [0, 1, 1, 1],
                y: [8, -2, 1, 0],
                x: [-3, 2, -1, 0],
              }}
              exit={{ 
                opacity: 0,
                y: -6,
                filter: 'blur(4px)',
              }}
              transition={{
                duration: 0.5,
                times: [0, 0.3, 0.6, 1],
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <motion.span
                className="phrase-text"
                animate={{
                  textShadow: [
                    '0 0 0 transparent',
                    '-2px 0 0 hsl(var(--primary) / 0.4), 2px 0 0 hsl(var(--accent) / 0.3)',
                    '1px 0 0 hsl(var(--primary) / 0.2), -1px 0 0 hsl(var(--accent) / 0.15)',
                    '0 0 0 transparent',
                  ],
                }}
                transition={{
                  duration: 0.4,
                  times: [0, 0.15, 0.3, 1],
                  ease: 'easeOut',
                }}
              >
                {phrases[currentIndex]}
              </motion.span>
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default CyclingTagline;
