import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface TextRevealProps {
  text: string;
  className?: string;
  onAnimationComplete?: () => void;
  onDissolveComplete?: () => void;
}

const TextReveal = ({ text, className = '', onAnimationComplete, onDissolveComplete }: TextRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [animationStarted, setAnimationStarted] = useState(false);
  const [dissolveStarted, setDissolveStarted] = useState(false);

  const mainText = text.replace(/mondro brings it back together\.?/i, '').trim();
  const words = mainText.split(' ');

  useEffect(() => {
    if (isInView && !animationStarted) {
      setAnimationStarted(true);
    }
  }, [isInView, animationStarted]);

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

  const handleAnimationComplete = () => {
    if (onAnimationComplete) {
      setTimeout(onAnimationComplete, 400);
    }
    // Start dissolve after text reveal completes + small delay
    setTimeout(() => {
      setDissolveStarted(true);
      // Notify parent when dissolve is complete
      setTimeout(() => {
        onDissolveComplete?.();
      }, 800);
    }, 1500);
  };

  return (
    <motion.div
      ref={containerRef}
      variants={container}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      onAnimationComplete={handleAnimationComplete}
      className={className}
    >
      <motion.div
        animate={dissolveStarted ? {
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
