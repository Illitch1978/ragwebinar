import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const phrases = [
  "brings it back together",
  "shows how your site performs",
  "measures what visitors notice",
  "turns signals into a clear score",
  "exposes hidden friction",
  "checks how AI sees you",
  "benchmarks against competitors",
  "shows where you stand",
  "highlights what matters",
  "turns audits into decisions",
  "reveals gaps in seconds",
  "replaces guesswork",
];

// Fisher-Yates shuffle
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

interface CyclingTaglineProps {
  isVisible: boolean;
}

const CyclingTagline = ({ isVisible }: CyclingTaglineProps) => {
  const [shuffledPhrases] = useState(() => shuffleArray(phrases));
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
              {shuffledPhrases[currentIndex]}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default CyclingTagline;
