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
    }, 3000);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  const currentPhrase = phrases[currentIndex];
  const characters = currentPhrase.split('');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.01,
        staggerDirection: -1,
        when: "afterChildren",
      },
    },
  };

  const characterVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: 'blur(8px)',
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      scale: 1,
      transition: {
        type: 'spring' as const,
        damping: 20,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      y: -15,
      filter: 'blur(4px)',
      scale: 0.95,
      transition: {
        duration: 0.15,
        ease: 'easeIn' as const,
      },
    },
  };

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
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {characters.map((char, index) => (
                <motion.span
                  key={`${currentIndex}-${index}`}
                  variants={characterVariants}
                  className="inline-block"
                  style={{ 
                    display: char === ' ' ? 'inline' : 'inline-block',
                    width: char === ' ' ? '0.25em' : 'auto',
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
              <motion.span
                className="phrase-glow"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ 
                  opacity: [0, 0.6, 0],
                  scaleX: [0, 1, 1],
                }}
                transition={{
                  duration: 0.8,
                  delay: characters.length * 0.02 + 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default CyclingTagline;
