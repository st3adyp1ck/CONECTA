import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface BackgroundAnimationProps {
  className?: string;
  density?: "low" | "medium" | "high";
  speed?: "slow" | "medium" | "fast";
  interactive?: boolean;
  intensityLevel?: "subtle" | "moderate" | "intense";
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  color: string;
  shape: "circle" | "square" | "triangle" | "star" | "hexagon" | "blob";
  animation: string;
  delay: number;
  depth: number;
}

export function BackgroundAnimation({
  className,
  density = "medium",
  speed = "medium",
  interactive = true,
  intensityLevel = "moderate"
}: BackgroundAnimationProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  // Determine particle count based on density
  const getParticleCount = (width: number, height: number) => {
    const area = width * height;
    const densityFactors = {
      low: 40000,
      medium: 25000,
      high: 15000,
    };

    const count = Math.floor(area / densityFactors[density]);
    const limits = {
      low: { min: 15, max: 30 },
      medium: { min: 30, max: 50 },
      high: { min: 50, max: 80 },
    };

    return Math.min(Math.max(count, limits[density].min), limits[density].max);
  };

  // Get speed range based on speed setting
  const getSpeedRange = () => {
    const speedRanges = {
      slow: { min: 60, max: 120 },
      medium: { min: 40, max: 80 },
      fast: { min: 20, max: 50 },
    };

    return speedRanges[speed];
  };

  // Generate particles on component mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const generateParticles = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const particleCount = getParticleCount(windowWidth, windowHeight);
      const speedRange = getSpeedRange();

      const shapes = ["circle", "square", "triangle", "star", "hexagon", "blob"];
      const animations = [
        "animate-float",
        "animate-float-slow",
        "animate-sway",
        "animate-particle-pulse",
        "animate-particle-drift",
        "animate-tilt-3d",
        "animate-bounce-subtle",
        "animate-morph-blob"
      ];

      // Light mode colors with enhanced variety
      const colors = [
        "bg-primary/5", "bg-primary/10", "bg-primary/3",
        "bg-secondary/5", "bg-secondary/10", "bg-secondary/3",
        "bg-accent/5", "bg-accent/10", "bg-accent/3",
        "bg-foreground/5", "bg-foreground/3", "bg-foreground/2"
      ];

      const newParticles: Particle[] = [];

      for (let i = 0; i < particleCount; i++) {
        // Create depth layers for parallax effect
        const depth = Math.random();
        const depthFactor = 0.5 + depth * 0.5; // 0.5 to 1.0

        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: (Math.random() * 1.5 + 0.5) * depthFactor, // 0.5 to 2rem, scaled by depth
          speed: Math.random() * (speedRange.max - speedRange.min) + speedRange.min, // Based on speed setting
          opacity: (Math.random() * 0.5 + 0.1) * depthFactor, // 0.1 to 0.6, scaled by depth
          color: colors[Math.floor(Math.random() * colors.length)],
          shape: shapes[Math.floor(Math.random() * shapes.length)] as any,
          animation: animations[Math.floor(Math.random() * animations.length)],
          delay: Math.random() * 5, // Random delay for staggered animation start
          depth: depth, // Store depth for parallax effect
        });
      }

      setParticles(newParticles);
    };

    generateParticles();
    setMounted(true);

    // Regenerate particles on window resize with debounce
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        generateParticles();
      }, 300);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, [density, speed]);

  // No theme changes to observe in light-only mode

  // Handle mouse movement for interactive particles
  useEffect(() => {
    if (!interactive || !mounted) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };

    // Use requestAnimationFrame for smoother performance
    const updateParticlePositions = () => {
      setParticles(prevParticles =>
        prevParticles.map(particle => {
          // Only apply interactive effect if mouse has moved and based on particle depth
          if (mousePosition.x !== 0 && mousePosition.y !== 0) {
            const interactionStrength = 0.05 * particle.depth; // Deeper particles move more
            const dx = (mousePosition.x - particle.x) * interactionStrength;
            const dy = (mousePosition.y - particle.y) * interactionStrength;

            return {
              ...particle,
              x: particle.x + dx,
              y: particle.y + dy,
            };
          }
          return particle;
        })
      );

      rafRef.current = requestAnimationFrame(updateParticlePositions);
    };

    window.addEventListener('mousemove', handleMouseMove);
    rafRef.current = requestAnimationFrame(updateParticlePositions);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [interactive, mounted, mousePosition]);

  // Render particle based on shape with enhanced effects
  const renderParticle = (particle: Particle) => {
    const baseClasses = cn(
      "absolute backdrop-blur-sm",
      particle.color,
      particle.animation
    );

    const style = {
      left: `${particle.x}%`,
      top: `${particle.y}%`,
      width: `${particle.size}rem`,
      height: `${particle.size}rem`,
      opacity: particle.opacity,
      animationDuration: `${particle.speed}s`,
      animationDelay: `${particle.delay}s`,
      zIndex: Math.floor(particle.depth * 10),
    };

    // Motion variants for enhanced animations
    const motionVariants = {
      initial: {
        scale: 0,
        opacity: 0,
        filter: "blur(10px)"
      },
      animate: {
        scale: 1,
        opacity: particle.opacity,
        filter: "blur(0px)",
        transition: {
          duration: 1.5,
          delay: particle.delay * 0.2,
          ease: [0.16, 1, 0.3, 1]
        }
      },
    };

    switch (particle.shape) {
      case "circle":
        return (
          <motion.div
            className={cn(baseClasses, "rounded-full")}
            style={style}
            initial="initial"
            animate="animate"
            variants={motionVariants}
          />
        );
      case "square":
        return (
          <motion.div
            className={cn(baseClasses, "rounded-md")}
            style={style}
            initial="initial"
            animate="animate"
            variants={motionVariants}
          />
        );
      case "triangle":
        return (
          <motion.div
            className={cn(baseClasses, "rounded-none bg-transparent")}
            style={{
              ...style,
              clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            }}
            initial="initial"
            animate="animate"
            variants={motionVariants}
          />
        );
      case "star":
        return (
          <motion.div
            className={cn(baseClasses, "rounded-none bg-transparent")}
            style={{
              ...style,
              clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
            }}
            initial="initial"
            animate="animate"
            variants={motionVariants}
          />
        );
      case "hexagon":
        return (
          <motion.div
            className={cn(baseClasses, "rounded-none bg-transparent")}
            style={{
              ...style,
              clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
            }}
            initial="initial"
            animate="animate"
            variants={motionVariants}
          />
        );
      case "blob":
        return (
          <motion.div
            className={cn(baseClasses, "rounded-none bg-transparent blob")}
            style={style}
            initial="initial"
            animate="animate"
            variants={motionVariants}
          />
        );
      default:
        return (
          <motion.div
            className={baseClasses}
            style={style}
            initial="initial"
            animate="animate"
            variants={motionVariants}
          />
        );
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed inset-0 overflow-hidden pointer-events-none z-[-1]",
        className
      )}
    >
      {/* Enhanced gradient background with animation */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/90 animate-gradient-shift" />

      {/* Animated gradient overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-primary/[0.02] via-secondary/[0.02] to-primary/[0.02] animate-shimmer opacity-70"
        style={{ backgroundSize: '200% 100%' }}
      />

      {/* Subtle noise texture */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Particles with AnimatePresence for smooth transitions */}
      <AnimatePresence>
        {particles.map((particle) => (
          <React.Fragment key={particle.id}>
            {renderParticle(particle)}
          </React.Fragment>
        ))}
      </AnimatePresence>

      {/* Optional glow effects in corners */}
      <div className="absolute top-0 left-0 w-[30vw] h-[30vh] bg-gradient-radial from-primary/[0.03] to-transparent opacity-70 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[30vw] h-[30vh] bg-gradient-radial from-secondary/[0.03] to-transparent opacity-70 blur-3xl" />
    </div>
  );
}
