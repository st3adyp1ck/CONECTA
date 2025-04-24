import React, { ReactNode } from "react";
import { motion, Variants, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type AnimationType = 
  | "fade-in"
  | "fade-in-up"
  | "fade-in-down"
  | "fade-in-left"
  | "fade-in-right"
  | "scale"
  | "slide-in-left"
  | "slide-in-right"
  | "slide-in-top"
  | "slide-in-bottom"
  | "none";

interface AnimatedContainerProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  threshold?: number;
  viewport?: { once?: boolean; amount?: number | "some" | "all" };
}

const variants: Record<AnimationType, Variants> = {
  "none": {},
  "fade-in": {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  "fade-in-up": {
    hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
  "fade-in-down": {
    hidden: { opacity: 0, y: -20, filter: "blur(4px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
  "fade-in-left": {
    hidden: { opacity: 0, x: -20, filter: "blur(4px)" },
    visible: { opacity: 1, x: 0, filter: "blur(0px)" },
  },
  "fade-in-right": {
    hidden: { opacity: 0, x: 20, filter: "blur(4px)" },
    visible: { opacity: 1, x: 0, filter: "blur(0px)" },
  },
  "scale": {
    hidden: { opacity: 0, scale: 0.9, filter: "blur(4px)" },
    visible: { opacity: 1, scale: 1, filter: "blur(0px)" },
  },
  "slide-in-left": {
    hidden: { x: "-100%", opacity: 0 },
    visible: { x: 0, opacity: 1 },
  },
  "slide-in-right": {
    hidden: { x: "100%", opacity: 0 },
    visible: { x: 0, opacity: 1 },
  },
  "slide-in-top": {
    hidden: { y: "-100%", opacity: 0 },
    visible: { y: 0, opacity: 1 },
  },
  "slide-in-bottom": {
    hidden: { y: "100%", opacity: 0 },
    visible: { y: 0, opacity: 1 },
  },
};

export function AnimatedContainer({
  children,
  animation = "fade-in-up",
  delay = 0,
  duration = 0.5,
  className,
  once = true,
  threshold = 0.1,
  viewport,
  ...props
}: AnimatedContainerProps) {
  const viewportOptions = viewport || { once, amount: threshold };
  
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOptions}
      variants={variants[animation]}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Animated list component with staggered children
interface AnimatedListProps extends AnimatedContainerProps {
  staggerDelay?: number;
}

export function AnimatedList({
  children,
  animation = "fade-in-up",
  delay = 0,
  duration = 0.5,
  className,
  once = true,
  threshold = 0.1,
  staggerDelay = 0.1,
  viewport,
  ...props
}: AnimatedListProps) {
  const viewportOptions = viewport || { once, amount: threshold };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };
  
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOptions}
      variants={containerVariants}
      className={cn(className)}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        
        return (
          <motion.div
            variants={variants[animation]}
            transition={{
              duration,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {child}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

// Animated text component with character staggering
interface AnimatedTextProps extends AnimatedContainerProps {
  text: string;
  staggerDelay?: number;
  wordLevel?: boolean;
}

export function AnimatedText({
  text,
  animation = "fade-in-up",
  delay = 0,
  duration = 0.5,
  className,
  once = true,
  threshold = 0.1,
  staggerDelay = 0.02,
  wordLevel = false,
  viewport,
  ...props
}: AnimatedTextProps) {
  const viewportOptions = viewport || { once, amount: threshold };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };
  
  const items = wordLevel ? text.split(" ") : text.split("");
  
  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={viewportOptions}
      variants={containerVariants}
      className={cn(className)}
      {...props}
    >
      {items.map((item, i) => (
        <motion.span
          key={i}
          variants={variants[animation]}
          transition={{
            duration,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ display: wordLevel ? "inline-block" : "inline" }}
        >
          {item}
          {wordLevel && i !== items.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Animated image component with loading state
interface AnimatedImageProps extends AnimatedContainerProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export function AnimatedImage({
  src,
  alt,
  width,
  height,
  animation = "fade-in",
  delay = 0,
  duration = 0.5,
  className,
  once = true,
  threshold = 0.1,
  viewport,
  ...props
}: AnimatedImageProps) {
  const viewportOptions = viewport || { once, amount: threshold };
  
  return (
    <motion.img
      src={src}
      alt={alt}
      width={width}
      height={height}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOptions}
      variants={variants[animation]}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(className)}
      {...props}
    />
  );
}
