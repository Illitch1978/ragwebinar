import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface TextRevealProps {
  text: string;
  className?: string;
  onAnimationComplete?: () => void;
  shouldDissolve?: boolean;
  onDissolveComplete?: () => void;
}

const TextReveal = ({ text, className = '', onAnimationComplete, shouldDissolve = false, onDissolveComplete }: TextRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [animationStarted, setAnimationStarted] = useState(false);
  const [dissolveTriggered, setDissolveTriggered] = useState(false);

  const mainText = text.replace(/mondro brings it back together\.?/i, '').trim();
  const words = mainText.split(' ');

  useEffect(() => {
    if (isInView && !animationStarted) {
      setAnimationStarted(true);
    }
  }, [isInView, animationStarted]);

  // Trigger dissolve when shouldDissolve prop becomes true
  useEffect(() => {
    if (shouldDissolve && !dissolveTriggered) {
      setDissolveTriggered(true);
      setTimeout(() => {
        onDissolveComplete?.();
      }, 800);
    }
  }, [shouldDissolve, dissolveTriggered, onDissolveComplete]);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.3,
      },
    },
  };

  const wordAnimation = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: 'blur(8px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  // Calculate total animation duration and trigger callback when complete
  useEffect(() => {
    if (animationStarted && onAnimationComplete) {
      // Total time = delayChildren + (staggerChildren * wordCount) + last word duration
      const totalDuration = 0.3 + (0.08 * words.length) + 0.6;
      const timer = setTimeout(() => {
        onAnimationComplete();
      }, totalDuration * 1000 + 200); // Add small buffer
      return () => clearTimeout(timer);
    }
  }, [animationStarted, onAnimationComplete, words.length]);

  return (
    <motion.div
      ref={containerRef}
      variants={container}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
    >
      <motion.div
        animate={dissolveTriggered ? {
          opacity: 0,
          filter: 'blur(12px)',
          y: -30,
        } : {
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
        }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {words.map((word, index) => (
          <motion.span
            key={index}
            variants={wordAnimation}
            className="inline-block mr-[0.25em]"
          >
            {word}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default TextReveal;
