import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface SocialProofSectionProps {
  onCtaClick: () => void;
}

const socialProofStats = [
  { text: "Benchmarked against ", highlight: "1,200+", suffix: " B2B and SaaS sites." },
  { text: "Built from ", highlight: "10,000+", suffix: " real world audits." },
  { text: "", highlight: "50+", suffix: " signals combined into a single confidence score." },
  { text: "Designed for investor and board level review.", highlight: "", suffix: "" },
  { text: "Trusted by founders and growth teams to prioritise decisions.", highlight: "", suffix: "" },
];

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
        className="social-proof-card"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Frosted glass layers */}
        <div className="card-frost-layer" />
        <div className="card-gradient-border" />
        <div className="card-inner-glow" />
        
        {/* Decorative elements */}
        <div className="card-corner card-corner-tl" />
        <div className="card-corner card-corner-br" />
        <div className="card-accent-line" />
        
        <div className="social-proof-content">
          <motion.h2 
            className="social-proof-headline"
            variants={itemVariants}
          >
            Get your score
          </motion.h2>

          <motion.ul className="social-proof-stats" variants={containerVariants}>
            {socialProofStats.map((stat, index) => (
              <motion.li 
                key={index} 
                className="social-proof-stat"
                variants={itemVariants}
              >
                {stat.text}
                {stat.highlight && <span className="stat-highlight">{stat.highlight}</span>}
                {stat.suffix}
              </motion.li>
            ))}
          </motion.ul>

          <motion.button
            className="social-proof-cta"
            variants={itemVariants}
            onClick={onCtaClick}
          >
            <span>Run a free scan</span>
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
};

export default SocialProofSection;
