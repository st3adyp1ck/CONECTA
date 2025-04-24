import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glowIntensity?: "none" | "subtle" | "medium" | "strong";
  glassOpacity?: "low" | "medium" | "high";
  hoverEffect?: boolean;
  animateOnHover?: boolean;
  noiseTexture?: boolean;
  colorTint?: "none" | "primary" | "secondary" | "accent" | "mixed" | "purple";
  borderGlow?: boolean;
  featured?: boolean;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({
    className,
    glowIntensity = "subtle",
    glassOpacity = "medium",
    hoverEffect = true,
    animateOnHover = true,
    noiseTexture = true,
    colorTint = "none",
    borderGlow = false,
    featured = false,
    children,
    ...props
  }, ref) => {
    // Determine glass opacity based on prop
    const opacityValues = {
      low: "bg-background/60 backdrop-blur-md",
      medium: "bg-background/75 backdrop-blur-lg",
      high: "bg-background/90 backdrop-blur-xl",
    };

    // Determine glow intensity based on prop
    const glowValues = {
      none: "",
      subtle: "shadow-md hover:shadow-lg",
      medium: "shadow-lg hover:shadow-xl",
      strong: "shadow-xl hover:shadow-2xl",
    };

    // Determine color tint based on prop
    const getTintStyle = () => {
      if (featured) {
        return "bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-blue-500/10";
      }

      switch (colorTint) {
        case "primary":
          return "bg-gradient-to-b from-primary/[0.03] to-transparent";
        case "secondary":
          return "bg-gradient-to-b from-secondary/[0.03] to-transparent";
        case "accent":
          return "bg-gradient-to-b from-accent/[0.03] to-transparent";
        case "mixed":
          return "bg-gradient-to-br from-primary/[0.02] via-secondary/[0.02] to-accent/[0.02]";
        case "purple":
          return "bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-blue-500/10";
        default:
          return "";
      }
    };

    // Hover animation variants
    const hoverVariants = {
      initial: {
        y: 0,
        scale: 1,
        boxShadow: borderGlow
          ? "0 0 0 1px rgba(var(--border), 0.2), 0 4px 20px rgba(0, 0, 0, 0.1)"
          : "0 4px 20px rgba(0, 0, 0, 0.1)"
      },
      hover: {
        y: -5,
        scale: 1.02,
        boxShadow: borderGlow
          ? "0 0 0 1px rgba(var(--primary), 0.3), 0 10px 30px rgba(0, 0, 0, 0.15), 0 0 20px rgba(var(--primary), 0.2)"
          : "0 10px 30px rgba(0, 0, 0, 0.15), 0 0 20px rgba(var(--primary), 0.1)"
      }
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative rounded-xl border overflow-hidden",
          opacityValues[glassOpacity],
          glowValues[glowIntensity],
          getTintStyle(),
          hoverEffect ? "transition-all duration-300" : "",
          className
        )}
        initial="initial"
        whileHover={animateOnHover ? "hover" : ""}
        variants={hoverVariants}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 20
        }}
        {...props}
      >
        {/* Noise texture overlay */}
        {noiseTexture && (
          <div
            className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
            }}
          />
        )}

        {/* Border glow effect */}
        {borderGlow && (
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none"
            initial={{ opacity: 0.2 }}
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{
              boxShadow: "inset 0 0 0 1px rgba(var(--primary), 0.2)",
            }}
          />
        )}

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";

const GlassCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
GlassCardHeader.displayName = "GlassCardHeader";

interface GlassCardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  featured?: boolean;
}

const GlassCardTitle = React.forwardRef<
  HTMLParagraphElement,
  GlassCardTitleProps
>(({ className, featured = false, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      featured
        ? "featured-title font-semibold leading-none tracking-tight"
        : "font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
GlassCardTitle.displayName = "GlassCardTitle";

const GlassCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
GlassCardDescription.displayName = "GlassCardDescription";

const GlassCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
GlassCardContent.displayName = "GlassCardContent";

const GlassCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
GlassCardFooter.displayName = "GlassCardFooter";

export {
  GlassCard,
  GlassCardHeader,
  GlassCardFooter,
  GlassCardTitle,
  GlassCardDescription,
  GlassCardContent,
  type GlassCardProps,
  type GlassCardTitleProps
};
