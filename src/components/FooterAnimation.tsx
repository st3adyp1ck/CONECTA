import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/lib/useMediaQuery";

interface FooterAnimationProps {
  children: React.ReactNode;
  className?: string;
}

export function FooterAnimation({ children, className }: FooterAnimationProps) {
  const footerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(footerRef, { once: true, amount: 0.1 });
  const isMobile = useMediaQuery("(max-width: 767px)");
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  
  // Get scroll progress for parallax effects
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"]
  });
  
  // Parallax effect for footer background
  const backgroundY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", "-10%"]
  );
  
  // Animated variants for footer content
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };
  
  return (
    <motion.footer
      ref={footerRef}
      className={cn(
        "relative border-t overflow-hidden",
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient background with parallax effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-background/50 to-background"
          style={{
            y: prefersReducedMotion ? 0 : backgroundY,
          }}
        />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(var(--primary), 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(var(--primary), 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
        
        {/* Animated particles */}
        <div className="absolute inset-0">
          {Array.from({ length: isMobile ? 5 : 10 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-primary/5"
              initial={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                scale: 0,
                opacity: 0,
              }}
              animate={isInView ? {
                scale: Math.random() * 0.5 + 0.5,
                opacity: Math.random() * 0.3 + 0.1,
              } : {}}
              transition={{
                duration: 1,
                delay: i * 0.1,
              }}
              style={{
                width: `${Math.random() * 2 + 0.5}rem`,
                height: `${Math.random() * 2 + 0.5}rem`,
                filter: `blur(${Math.random() * 2 + 1}px)`,
              }}
            />
          ))}
        </div>
        
        {/* Animated glow spots */}
        <motion.div 
          className="absolute top-0 left-1/4 w-[30vw] h-[20vh] bg-gradient-radial from-primary/[0.03] to-transparent blur-3xl"
          initial={{ opacity: 0 }}
          animate={isInView ? { 
            opacity: [0, 0.3, 0],
            scale: [0.8, 1.2, 0.8]
          } : {}}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            repeatType: "loop",
            delay: 0.5,
          }}
        />
        <motion.div 
          className="absolute bottom-0 right-1/4 w-[30vw] h-[20vh] bg-gradient-radial from-secondary/[0.03] to-transparent blur-3xl"
          initial={{ opacity: 0 }}
          animate={isInView ? { 
            opacity: [0, 0.3, 0],
            scale: [0.8, 1.2, 0.8]
          } : {}}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            repeatType: "loop",
            delay: 4.5,
          }}
        />
      </div>
      
      {/* Animated top border */}
      <div className="absolute top-0 left-0 w-full">
        <motion.div
          className="h-[1px] bg-gradient-to-r from-primary/10 via-secondary/20 to-primary/10"
          style={{
            boxShadow: "0 0 8px rgba(var(--primary), 0.2)",
          }}
        />
        <motion.div
          className="h-[2px] bg-gradient-to-r from-primary/40 via-secondary/40 to-primary/40"
          style={{
            width: "100%",
            backgroundSize: "200% 100%",
          }}
          animate={{
            backgroundPosition: ["0% center", "100% center", "0% center"],
          }}
          transition={{
            duration: 15,
            ease: "linear",
            repeat: Infinity,
          }}
        />
      </div>
      
      {/* Footer content with staggered animations */}
      <motion.div
        className="container mx-auto px-4 py-6 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return child;
          
          return (
            <motion.div
              key={index}
              variants={itemVariants}
              transition={{
                delay: index * 0.1,
              }}
            >
              {child}
            </motion.div>
          );
        })}
      </motion.div>
    </motion.footer>
  );
}
