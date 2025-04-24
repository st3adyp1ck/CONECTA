import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createRipple } from "@/lib/ripple";

interface AnimatedSocialIconProps {
  icon: React.ReactNode;
  href?: string;
  label?: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function AnimatedSocialIcon({
  icon,
  href,
  label,
  className,
  onClick,
}: AnimatedSocialIconProps) {
  // Animation variants
  const containerVariants = {
    initial: {
      scale: 1,
      rotate: 0,
    },
    hover: {
      scale: 1.15,
      rotate: [0, -5, 5, 0],
      transition: {
        rotate: {
          duration: 0.5,
          ease: "easeInOut",
        },
        scale: {
          duration: 0.2,
          ease: [0.34, 1.56, 0.64, 1],
        },
      },
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1,
      },
    },
  };

  // Glow animation variants
  const glowVariants = {
    initial: {
      opacity: 0,
      scale: 0.5,
    },
    hover: {
      opacity: 0.8,
      scale: 1.2,
      transition: {
        duration: 0.3,
      },
    },
  };

  // Handle click with ripple effect
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(e);
    if (onClick) onClick(e);
  };

  // Render button or link
  const renderButton = () => (
    <motion.div
      className="relative"
      variants={containerVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-primary/20 blur-md"
        variants={glowVariants}
      />

      {/* Button */}
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "relative rounded-full h-10 w-10 hover:bg-primary/10 hover:text-primary border-primary/20 ripple-container overflow-hidden",
          className
        )}
        onClick={handleClick}
        aria-label={label}
      >
        {/* Icon with subtle floating animation */}
        <motion.div
          animate={{
            y: [0, -2, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          {icon}
        </motion.div>
      </Button>
    </motion.div>
  );

  // If href is provided, wrap in an anchor tag
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
        {renderButton()}
      </a>
    );
  }

  return renderButton();
}
