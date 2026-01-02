import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

const stats = [
  { top: "2.4k", bottom: "audits completed" },
  { top: "48M+", bottom: "signals synthesized" },
  { top: "<24h", bottom: "to strategic insight" },
  { top: "1,200+", bottom: "B2B sites benchmarked" },
];

const SocialProofStats = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.06,
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.3,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <section className="social-proof-stats-section" ref={sectionRef}>
      <motion.div 
        className="social-proof-stats-grid"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {stats.map((stat, index) => (
          <motion.div 
            key={index}
            className="social-proof-stat-card"
            variants={cardVariants}
          >
            <span className="stat-top">{stat.top}</span>
            <span className="stat-bottom">{stat.bottom}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default SocialProofStats;