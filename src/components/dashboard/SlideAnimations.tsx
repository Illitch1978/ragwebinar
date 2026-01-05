import { motion, Variants, useInView } from "framer-motion";
import { useRef, useState, useEffect, ReactNode } from "react";

// Staggered reveal container - wraps slide content
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

// Individual item animations
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  },
};

// Staggered content wrapper component
interface StaggeredContentProps {
  children: ReactNode;
  className?: string;
}

export const StaggeredContent = ({ children, className = "" }: StaggeredContentProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  return (
    <motion.div
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Animated title (reveals first)
export const AnimatedTitle = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <motion.div variants={fadeInUp} className={className}>
    {children}
  </motion.div>
);

// Animated content (reveals second)
export const AnimatedContent = ({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) => (
  <motion.div 
    variants={{
      hidden: { opacity: 0, y: 12 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay }
      },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Animated insight box (reveals last with slight delay)
export const AnimatedInsight = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <motion.div 
    variants={{
      hidden: { opacity: 0, y: 8 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }
      },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Pulsing metric component for key data points
interface PulsingMetricProps {
  value: string | number;
  label?: string;
  className?: string;
  pulseColor?: string;
}

export const PulsingMetric = ({ value, label, className = "", pulseColor = "primary" }: PulsingMetricProps) => {
  const [shouldPulse, setShouldPulse] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  
  useEffect(() => {
    if (isInView) {
      // Start pulsing after a short delay when in view
      const timer = setTimeout(() => setShouldPulse(true), 800);
      // Stop pulsing after a few cycles
      const stopTimer = setTimeout(() => setShouldPulse(false), 3500);
      return () => {
        clearTimeout(timer);
        clearTimeout(stopTimer);
      };
    }
  }, [isInView]);
  
  return (
    <motion.div 
      ref={ref}
      className={`relative ${className}`}
      animate={shouldPulse ? {
        scale: [1, 1.02, 1],
      } : {}}
      transition={{
        duration: 1.5,
        repeat: shouldPulse ? 2 : 0,
        ease: "easeInOut",
      }}
    >
      <span className={`relative z-10 ${shouldPulse ? `text-${pulseColor}` : ''}`}>
        {value}
      </span>
      {shouldPulse && (
        <motion.div
          className={`absolute inset-0 bg-${pulseColor}/10 rounded-lg -m-2`}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{
            duration: 1.5,
            repeat: 2,
            ease: "easeInOut",
          }}
        />
      )}
      {label && <div className="font-mono text-xs text-muted-foreground uppercase tracking-wider mt-1">{label}</div>}
    </motion.div>
  );
};

// Cursor glow component
export const CursorGlow = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };
    
    const handleMouseLeave = () => {
      setIsVisible(false);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
  
  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30 print-hide"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsl(var(--primary) / 0.06) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 15,
          mass: 0.1,
        }}
      />
    </motion.div>
  );
};
