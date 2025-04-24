import React from "react";
import { motion } from "framer-motion";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AnimatedNavLinkProps extends ButtonProps {
  icon?: React.ReactNode;
  isActive?: boolean;
  label: string;
  className?: string;
}

export function AnimatedNavLink({
  icon,
  isActive = false,
  label,
  className,
  ...props
}: AnimatedNavLinkProps) {
  // Animation variants
  const containerVariants = {
    initial: {
      x: 0,
    },
    hover: {
      x: 5,
      transition: {
        duration: 0.3,
        ease: [0.34, 1.56, 0.64, 1],
      },
    },
  };

  // Icon animation variants
  const iconVariants = {
    initial: {
      scale: 1,
      rotate: 0,
    },
    hover: {
      scale: 1.2,
      rotate: isActive ? 0 : [-5, 5, 0],
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
  };

  // Text animation variants
  const textVariants = {
    initial: {
      x: 0,
    },
    hover: {
      x: 3,
      transition: {
        duration: 0.3,
        ease: [0.34, 1.56, 0.64, 1],
      },
    },
  };

  // Active indicator animation variants
  const activeIndicatorVariants = {
    initial: {
      width: 0,
      opacity: 0,
    },
    animate: {
      width: "100%",
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: [0.34, 1.56, 0.64, 1],
      },
    },
  };

  return (
    <motion.div
      className="relative"
      variants={containerVariants}
      initial="initial"
      whileHover="hover"
    >
      <Button
        variant={isActive ? "default" : "ghost"}
        className={cn(
          "justify-start w-full group transition-all duration-300",
          isActive ? "bg-primary/90 shadow-md" : "text-foreground font-medium hover:text-primary",
          className
        )}
        {...props}
      >
        {icon && (
          <motion.div
            className="mr-2 text-primary"
            variants={iconVariants}
          >
            {icon}
          </motion.div>
        )}
        <motion.span
          variants={textVariants}
        >
          {label}
        </motion.span>
      </Button>

      {/* Active indicator line */}
      {!isActive && (
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] bg-primary/40"
          initial="initial"
          whileHover="animate"
          variants={activeIndicatorVariants}
        />
      )}

      {/* Active glow effect */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-md bg-primary/5 blur-md"
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      )}
    </motion.div>
  );
}
