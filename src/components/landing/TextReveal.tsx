import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

interface TextRevealProps {
  text: string;
  className?: string;
  onAnimationComplete?: () => void;
  onDissolveComplete?: () => void;
}

const TextReveal = ({ text, className = '', onAnimationComplete, onDissolveComplete }: TextRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [animationStarted, setAnimationStarted] = useState(false);
  const [dissolveTriggered, setDissolveTriggered] = useState(false);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  // Parallax transforms
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.98, 1, 0.99]);
  
  // Dissolve effect based on scroll - starts after 20% scroll progress
  const dissolveOpacity = useTransform(scrollYProgress, [0.15, 0.35], [1, 0]);
  const dissolveBlur = useTransform(scrollYProgress, [0.15, 0.35], [0, 12]);
  const dissolveY = useTransform(scrollYProgress, [0.15, 0.35], [0, -30]);

  // Filter out the mondro tagline from the main text
  const mainText = text.replace(/mondro brings it back together\.?/i, '').trim();
  const words = mainText.split(' ');

  useEffect(() => {
    if (isInView && !animationStarted) {
      setAnimationStarted(true);
    }
  }, [isInView, animationStarted]);

  // Watch for dissolve completion
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (value) => {
      if (value > 0.3 && !dissolveTriggered) {
        setDissolveTriggered(true);
        onDissolveComplete?.();
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, dissolveTriggered, onDissolveComplete]);

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
        style={{ 
          opacity: dissolveOpacity,
          filter: useTransform(dissolveBlur, (v) => `blur(${v}px)`),
          y: dissolveY
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
