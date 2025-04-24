import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { createRipple } from "@/lib/ripple"

const glowButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-glow-primary hover:shadow-glow-primary-lg",
        destructive:
          "bg-destructive text-destructive-foreground shadow-glow-destructive hover:shadow-glow-destructive-lg",
        outline:
          "border border-input bg-background/50 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground shadow-glow-soft hover:shadow-glow-soft-lg",
        secondary:
          "bg-secondary text-secondary-foreground shadow-glow-secondary hover:shadow-glow-secondary-lg",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        glass: "bg-background/40 backdrop-blur-md border border-primary/20 text-foreground shadow-glow-soft hover:shadow-glow-soft-lg hover:bg-background/60",
        "glass-primary": "bg-primary/90 backdrop-blur-md border border-primary/40 text-primary-foreground shadow-glow-primary hover:shadow-glow-primary-lg hover:bg-primary/100",
        "glass-secondary": "bg-secondary/90 backdrop-blur-md border border-secondary/40 text-secondary-foreground shadow-glow-secondary hover:shadow-glow-secondary-lg hover:bg-secondary/100",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
      glow: {
        none: "",
        subtle: "shadow-glow-soft hover:shadow-glow-soft-lg",
        medium: "shadow-glow hover:shadow-glow-lg",
        strong: "shadow-glow-lg hover:shadow-glow-xl",
        pulse: "animate-pulse-glow",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        bounce: "animate-bounce",
        shimmer: "animate-shimmer overflow-hidden relative",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      glow: "medium",
      animation: "none",
    },
  }
)

export interface GlowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glowButtonVariants> {
  asChild?: boolean;
  enableRipple?: boolean;
  disableAnimation?: boolean;
}

const GlowButton = React.forwardRef<HTMLButtonElement, GlowButtonProps>(
  ({
    className,
    variant,
    size,
    glow,
    animation,
    asChild = false,
    enableRipple = true,
    disableAnimation = false,
    onClick,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : motion.button;

    // Handle click with ripple effect
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (enableRipple) {
        createRipple(e);
      }

      if (onClick) {
        onClick(e);
      }
    };

    // Framer Motion variants
    const motionProps = !disableAnimation ? {
      whileHover: { scale: 1.03 },
      whileTap: { scale: 0.97 },
      transition: {
        duration: 0.2,
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    } : {};

    return (
      <Comp
        className={cn(
          glowButtonVariants({ variant, size, glow, animation, className }),
          enableRipple && "ripple-container"
        )}
        ref={ref}
        onClick={handleClick}
        {...motionProps}
        {...props}
      >
        {/* Shimmer effect overlay */}
        {animation === "shimmer" && (
          <span 
            className="absolute inset-0 w-[200%] translate-x-[-50%] bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-slide"
            style={{ 
              backgroundSize: '50% 100%',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: '0 0',
            }}
          />
        )}
        
        {children}
      </Comp>
    );
  }
);

GlowButton.displayName = "GlowButton";

export { GlowButton, glowButtonVariants };
