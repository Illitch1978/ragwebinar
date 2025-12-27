import { useState, useEffect, useCallback } from 'react';
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

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

interface CyclingTaglineProps {
  isVisible: boolean;
}

const ScrambleText = ({ text, isActive }: { text: string; isActive: boolean }) => {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);

  const scramble = useCallback(() => {
    if (!isActive) return;
    
    setIsScrambling(true);
    let iteration = 0;
    const maxIterations = text.length;
    
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );
      
      iteration += 1 / 2;
      
      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
        setIsScrambling(false);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [text, isActive]);

  useEffect(() => {
    if (isActive) {
      scramble();
    }
  }, [isActive, scramble]);

  return (
    <span className={`phrase-text ${isScrambling ? 'scrambling' : ''}`}>
      {displayText}
    </span>
  );
};

const CyclingTagline = ({ isVisible }: CyclingTaglineProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [triggerKey, setTriggerKey] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % phrases.length);
      setTriggerKey((prev) => prev + 1);
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ScrambleText 
                text={phrases[currentIndex]} 
                isActive={true}
                key={triggerKey}
              />
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default CyclingTagline;
