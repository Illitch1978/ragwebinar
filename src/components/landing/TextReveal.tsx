import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

interface TextRevealProps {
  text: string;
  className?: string;
  onAnimationComplete?: () => void;
}

const TextReveal = ({ text, className = '', onAnimationComplete }: TextRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [animationStarted, setAnimationStarted] = useState(false);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  // Parallax transforms - gentler effect
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.98, 1, 0.99]);

  const words = text.split(' ');

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
      // Small delay after last word animates
      setTimeout(onAnimationComplete, 400);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className="text-reveal-card"
      style={{ y, scale }}
    >
      <motion.div
        ref={containerRef}
        variants={container}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        onAnimationComplete={handleAnimationComplete}
        className={className}
      >
        {words.map((word, index) => {
          // Special styling for "Mondro" - render as logo with line break before
          const isMondro = word.replace(/[.,]/g, '').toLowerCase() === 'mondro';
          const punctuation = word.match(/[.,]$/)?.[0] || '';
          
          if (isMondro) {
            return (
              <motion.span
                key={index}
                variants={wordAnimation}
                className="inline-block mr-[0.25em]"
              >
                <br />
                <span className="mondro-inline">mondro<span className="mondro-dot"></span></span>
                {punctuation}
              </motion.span>
            );
          }
          
          return (
            <motion.span
              key={index}
              variants={wordAnimation}
              className="inline-block mr-[0.25em]"
            >
              {word}
            </motion.span>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export default TextReveal;
