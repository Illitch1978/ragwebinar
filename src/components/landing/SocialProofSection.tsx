import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface SocialProofSectionProps {
  onCtaClick: () => void;
}

const SocialProofSection = ({ onCtaClick }: SocialProofSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [subtextVisible, setSubtextVisible] = useState(false);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setSubtextVisible(true), 200);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.05,
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 8 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.35,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <section className="social-proof-section" ref={sectionRef}>
      <motion.div 
        className="social-proof-content"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <motion.h2 
          className="social-proof-headline"
          variants={itemVariants}
        >
          Get your score
        </motion.h2>
        
        <motion.p 
          className="social-proof-subtext"
          variants={itemVariants}
          style={{ opacity: subtextVisible ? undefined : 0.6 }}
        >
          Instant preview. No signup.
        </motion.p>

        <motion.button
          className="social-proof-cta"
          variants={itemVariants}
          onClick={onCtaClick}
        >
          <span>Try it now</span>
          <span className="cta-arrow">→</span>
        </motion.button>
      </motion.div>
    </section>
  );
};

export default SocialProofSection;
