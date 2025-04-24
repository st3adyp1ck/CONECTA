import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/lib/useMediaQuery";

interface HeaderAnimationProps {
  children: React.ReactNode;
  className?: string;
}

export function HeaderAnimation({ children, className }: HeaderAnimationProps) {
  const { scrollY } = useScroll();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  // Using solid background color instead of transparent/glass effect
  const headerOpacity = useTransform(
    scrollY,
    [0, 50, 100],
    [1, 1, 1] // Always fully opaque
  );

  // No blur needed for solid background
  const headerBlur = useTransform(
    scrollY,
    [0, 100],
    ["blur(0px)", "blur(0px)"]
  );

  // Header shadow based on scroll - enhanced for smoked glass effect
  const headerShadow = useTransform(
    scrollY,
    [0, 100],
    ["0 4px 12px rgba(0, 0, 0, 0.08)", "0 6px 24px rgba(0, 0, 0, 0.15)"]
  );

  // Header height based on scroll (compact on scroll)
  const headerPadding = useTransform(
    scrollY,
    [0, 100],
    isMobile ? ["0.75rem", "0.5rem"] : ["1rem", "0.75rem"]
  );

  // Header border opacity based on scroll
  const borderOpacity = useTransform(
    scrollY,
    [0, 100],
    [0.1, 0.2]
  );

  // Spring physics for smoother animations
  const springConfig = { stiffness: 400, damping: 30, mass: 0.5 };
  const springHeaderOpacity = useSpring(headerOpacity, springConfig); // Kept for potential future use
  const springHeaderShadow = useSpring(headerShadow, springConfig);
  const springHeaderPadding = useSpring(headerPadding, springConfig);
  const springBorderOpacity = useSpring(borderOpacity, springConfig);

  // Mouse position for subtle parallax effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Update mouse position for parallax effect
  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse position relative to the center of the screen
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      // Normalize values between -1 and 1
      const normalizedX = (e.clientX - centerX) / centerX;
      const normalizedY = (e.clientY - centerY) / centerY;

      // Update motion values with some damping
      mouseX.set(normalizedX * 0.05);
      mouseY.set(normalizedY * 0.05);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, prefersReducedMotion]);

  // Subtle parallax effect for header elements
  const headerX = useTransform(mouseX, (value) => value * 5);
  const headerY = useTransform(mouseY, (value) => value * 5);

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-10 border-b",
        className
      )}
      style={{
        backgroundColor: `rgb(250, 250, 255)`, // Lighter solid background color
        boxShadow: `${springHeaderShadow.get()}`,
        borderBottomColor: `rgba(var(--primary), 0.3)`,
        borderBottomWidth: '2px',
      }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 1,
      }}
    >
      {/* Removed noise texture overlay as we're using a solid background */}

      <motion.div
        className="container mx-auto px-4 relative"
        style={{
          paddingTop: springHeaderPadding,
          paddingBottom: springHeaderPadding,
          x: prefersReducedMotion ? 0 : headerX,
          y: prefersReducedMotion ? 0 : headerY,
        }}
      >
        {children}
      </motion.div>

      {/* Animated accent line at the bottom */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary/40 via-secondary/40 to-primary/40"
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

      {/* Enhanced glow effect */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-[1px] bg-primary/20"
        style={{
          boxShadow: "0 0 15px rgba(var(--primary), 0.4), 0 0 30px rgba(var(--primary), 0.2)",
          opacity: springBorderOpacity,
        }}
        animate={{
          opacity: [springBorderOpacity.get(), springBorderOpacity.get() * 1.5, springBorderOpacity.get()],
        }}
        transition={{
          duration: 4,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
    </motion.header>
  );
}
