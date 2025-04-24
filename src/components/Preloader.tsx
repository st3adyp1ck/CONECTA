import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

interface PreloaderProps {
  onLoadingComplete?: () => void;
  minDisplayTime?: number; // Minimum time to display the preloader in ms
  className?: string;
}

export function Preloader({
  onLoadingComplete,
  minDisplayTime = 2500, // Default minimum display time
  className,
}: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  // Simulate loading progress
  useEffect(() => {
    const startTime = Date.now();
    let animationFrame: number;
    let timeoutId: NodeJS.Timeout;

    // Simulate progress with a non-linear curve for more natural feeling
    const simulateProgress = () => {
      setProgress((prevProgress) => {
        // Slow down as we approach 100%
        const increment = (100 - prevProgress) * 0.025;
        const newProgress = Math.min(prevProgress + increment, 99);
        return newProgress;
      });

      animationFrame = requestAnimationFrame(simulateProgress);
    };

    // Start progress animation
    animationFrame = requestAnimationFrame(simulateProgress);

    // Listen for window load event to complete the progress
    const handleLoad = () => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

      // Cancel the simulated progress
      cancelAnimationFrame(animationFrame);

      // Wait for minimum display time before completing
      timeoutId = setTimeout(() => {
        setProgress(100);

        // Add a small delay before hiding the preloader
        setTimeout(() => {
          setIsComplete(true);

          // Add a small delay before calling onLoadingComplete
          setTimeout(() => {
            setIsVisible(false);
            if (onLoadingComplete) onLoadingComplete();
          }, 800);
        }, 400);
      }, remainingTime);
    };

    // Trigger completion when window is fully loaded
    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrame);
      clearTimeout(timeoutId);
      window.removeEventListener("load", handleLoad);
    };
  }, [minDisplayTime, onLoadingComplete]);

  // Calculate the rotation based on progress
  const rotation = progress * 3.6; // 360 degrees / 100 = 3.6 degrees per percentage point

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={cn(
            "fixed inset-0 z-50 flex flex-col items-center justify-center bg-background",
            className
          )}
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: {
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1]
            }
          }}
        >
          {/* Background elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Animated gradient background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/90 animate-gradient-shift"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            />

            {/* Animated gradient overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/[0.03] via-secondary/[0.03] to-primary/[0.03] animate-shimmer opacity-70"
              style={{ backgroundSize: '200% 100%' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ duration: 1, delay: 0.2 }}
            />

            {/* Animated grid lines */}
            <motion.div
              className="absolute inset-0 opacity-[0.03]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.03 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(var(--primary), 0.1) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(var(--primary), 0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: '40px 40px',
                }}
              />
            </motion.div>

            {/* Animated particles with enhanced variety */}
            <div className="absolute inset-0">
              {/* Enhanced regular particles - increased count */}
              {Array.from({ length: 25 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-gradient-to-br from-primary/20 to-secondary/10"
                  initial={{
                    x: `${Math.random() * 100}%`,
                    y: `${Math.random() * 100}%`,
                    scale: 0,
                    opacity: 0,
                    rotate: Math.random() * 180,
                  }}
                  animate={{
                    scale: [0, Math.random() * 0.7 + 0.5, Math.random() * 0.4 + 0.3],
                    opacity: [0, Math.random() * 0.5 + 0.2, Math.random() * 0.3 + 0.1],
                    rotate: [0, Math.random() * 360],
                    y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                    x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                    filter: ["blur(0px)", `blur(${Math.random() * 2}px)`, "blur(0px)"],
                    boxShadow: [
                      "0 0 0 rgba(0, 128, 128, 0)",
                      "0 0 10px rgba(0, 128, 128, 0.2)",
                      "0 0 0 rgba(0, 128, 128, 0)"
                    ]
                  }}
                  transition={{
                    scale: {
                      duration: 3,
                      delay: i * 0.1,
                      repeat: Infinity,
                      repeatType: "reverse"
                    },
                    opacity: {
                      duration: 3,
                      delay: i * 0.1,
                      repeat: Infinity,
                      repeatType: "reverse"
                    },
                    rotate: {
                      duration: Math.random() * 20 + 20,
                      repeat: Infinity,
                      ease: "linear",
                    },
                    filter: {
                      duration: 4,
                      repeat: Infinity,
                      repeatType: "reverse"
                    },
                    boxShadow: {
                      duration: 4,
                      repeat: Infinity,
                      repeatType: "reverse"
                    },
                    y: {
                      duration: Math.random() * 12 + 8,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: i * 0.1
                    },
                    x: {
                      duration: Math.random() * 12 + 8,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: i * 0.1
                    },
                  }}
                  style={{
                    width: `${Math.random() * 2.5 + 0.5}rem`,
                    height: `${Math.random() * 2.5 + 0.5}rem`,
                  }}
                />
              ))}

              {/* Enhanced glowing particles - increased count and effects */}
              {Array.from({ length: 10 }).map((_, i) => {
                // Alternate between primary and secondary colors
                const colorBase = i % 2 === 0 ? "--primary" : "--secondary";
                return (
                  <motion.div
                    key={`glow-${i}`}
                    className="absolute rounded-full shadow-glow"
                    initial={{
                      x: `${Math.random() * 100}%`,
                      y: `${Math.random() * 100}%`,
                      scale: 0,
                      opacity: 0,
                      background: `rgba(var(${colorBase}), ${Math.random() * 0.15 + 0.05})`,
                    }}
                    animate={{
                      scale: [0, Math.random() * 1 + 0.8, Math.random() * 0.6 + 0.4],
                      opacity: [0, Math.random() * 0.5 + 0.3, Math.random() * 0.3 + 0.1],
                      y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                      x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                      filter: [
                        `blur(${Math.random() * 5 + 5}px)`,
                        `blur(${Math.random() * 15 + 10}px)`,
                        `blur(${Math.random() * 5 + 5}px)`
                      ],
                      boxShadow: [
                        `0 0 10px rgba(var(${colorBase}), 0.1)`,
                        `0 0 30px rgba(var(${colorBase}), 0.3)`,
                        `0 0 10px rgba(var(${colorBase}), 0.1)`
                      ]
                    }}
                    transition={{
                      scale: {
                        duration: 4,
                        delay: i * 0.2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      },
                      opacity: {
                        duration: 4,
                        delay: i * 0.2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      },
                      filter: {
                        duration: 5,
                        repeat: Infinity,
                        repeatType: "reverse"
                      },
                      boxShadow: {
                        duration: 5,
                        repeat: Infinity,
                        repeatType: "reverse"
                      },
                      y: {
                        duration: Math.random() * 18 + 12,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: i * 0.2
                      },
                      x: {
                        duration: Math.random() * 18 + 12,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: i * 0.2
                      },
                    }}
                    style={{
                      width: `${Math.random() * 5 + 3}rem`,
                      height: `${Math.random() * 5 + 3}rem`,
                    }}
                  />
                )
              })}

              {/* 3D Geometric shapes with enhanced effects - increased count and variety */}
              {Array.from({ length: 12 }).map((_, i) => {
                // Random shape selection with more variety
                const shapes = [
                  "polygon(50% 0%, 0% 100%, 100% 100%)", // triangle
                  "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)", // hexagon
                  "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)", // star
                  "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)", // diamond
                  "polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)", // octagon
                ];
                const shape = shapes[Math.floor(Math.random() * shapes.length)];

                // Alternate between primary, secondary, and accent colors
                const colorOptions = ["--primary", "--secondary", "--accent"];
                const colorBase = colorOptions[i % colorOptions.length];

                return (
                  <motion.div
                    key={`shape-${i}`}
                    className="absolute"
                    initial={{
                      x: `${Math.random() * 100}%`,
                      y: `${Math.random() * 100}%`,
                      scale: 0,
                      opacity: 0,
                      rotate: Math.random() * 180,
                      rotateX: Math.random() * 45,
                      rotateY: Math.random() * 45,
                      border: `1px solid rgba(var(${colorBase}), ${Math.random() * 0.3 + 0.1})`,
                      background: `rgba(var(${colorBase}), ${Math.random() * 0.05 + 0.02})`,
                    }}
                    animate={{
                      scale: [0, Math.random() * 0.7 + 0.4],
                      opacity: [0, Math.random() * 0.4 + 0.15],
                      rotate: [Math.random() * 180, Math.random() * 180 + 360],
                      rotateX: [0, Math.random() * 90],
                      rotateY: [0, Math.random() * 90],
                      y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                      x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                      boxShadow: [
                        `0 0 0 rgba(var(${colorBase}), 0)`,
                        `0 0 15px rgba(var(${colorBase}), 0.2)`,
                        `0 0 0 rgba(var(${colorBase}), 0)`
                      ]
                    }}
                    transition={{
                      scale: {
                        duration: 3,
                        delay: i * 0.15,
                        repeat: Infinity,
                        repeatType: "reverse"
                      },
                      opacity: {
                        duration: 3,
                        delay: i * 0.15,
                        repeat: Infinity,
                        repeatType: "reverse"
                      },
                      rotate: {
                        duration: Math.random() * 25 + 15,
                        repeat: Infinity,
                        ease: "linear",
                      },
                      rotateX: {
                        duration: Math.random() * 20 + 10,
                        repeat: Infinity,
                        repeatType: "reverse",
                      },
                      rotateY: {
                        duration: Math.random() * 20 + 10,
                        repeat: Infinity,
                        repeatType: "reverse",
                      },
                      boxShadow: {
                        duration: 4,
                        repeat: Infinity,
                        repeatType: "reverse"
                      },
                      y: {
                        duration: Math.random() * 18 + 12,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: i * 0.15
                      },
                      x: {
                        duration: Math.random() * 18 + 12,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: i * 0.15
                      },
                    }}
                    style={{
                      width: `${Math.random() * 4 + 1.5}rem`,
                      height: `${Math.random() * 4 + 1.5}rem`,
                      clipPath: shape,
                      perspective: "1000px",
                      transformStyle: "preserve-3d",
                    }}
                  />
                );
              })}

              {/* Digital network lines - new element */}
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={`line-${i}`}
                  className="absolute bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10"
                  initial={{
                    x: `${Math.random() * 100}%`,
                    y: `${Math.random() * 100}%`,
                    scaleX: 0,
                    opacity: 0,
                    rotate: Math.random() * 180,
                  }}
                  animate={{
                    scaleX: [0, Math.random() * 0.5 + 1.5, 0],
                    opacity: [0, Math.random() * 0.3 + 0.1, 0],
                    rotate: [Math.random() * 180, Math.random() * 180],
                  }}
                  transition={{
                    scaleX: {
                      duration: Math.random() * 4 + 3,
                      repeat: Infinity,
                      repeatDelay: Math.random() * 5 + 2,
                    },
                    opacity: {
                      duration: Math.random() * 4 + 3,
                      repeat: Infinity,
                      repeatDelay: Math.random() * 5 + 2,
                    },
                  }}
                  style={{
                    height: `${Math.random() * 0.5 + 0.1}rem`,
                    width: `${Math.random() * 10 + 5}rem`,
                    transformOrigin: Math.random() > 0.5 ? "left" : "right",
                  }}
                />
              ))}
            </div>

            {/* Enhanced animated glow spots with more variety */}
            <motion.div
              className="absolute top-1/4 left-1/4 w-[35vw] h-[35vh] bg-gradient-radial from-primary/[0.05] to-transparent blur-3xl"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.4, 0],
                scale: [0.8, 1.3, 0.8],
                filter: ["blur(30px)", "blur(50px)", "blur(30px)"]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "loop"
              }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-[35vw] h-[35vh] bg-gradient-radial from-secondary/[0.05] to-transparent blur-3xl"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.4, 0],
                scale: [0.8, 1.3, 0.8],
                filter: ["blur(30px)", "blur(50px)", "blur(30px)"]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "loop",
                delay: 5
              }}
            />
            <motion.div
              className="absolute top-1/3 right-1/3 w-[25vw] h-[25vh] bg-gradient-radial from-accent/[0.04] to-transparent blur-3xl"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.35, 0],
                scale: [0.7, 1.2, 0.7],
                filter: ["blur(25px)", "blur(40px)", "blur(25px)"]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "loop",
                delay: 2.5
              }}
            />
            <motion.div
              className="absolute bottom-1/3 left-1/3 w-[25vw] h-[25vh] bg-gradient-radial from-primary/[0.04] to-transparent blur-3xl"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.35, 0],
                scale: [0.7, 1.2, 0.7],
                filter: ["blur(25px)", "blur(40px)", "blur(25px)"]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "loop",
                delay: 7.5
              }}
            />

            {/* Digital pulse waves - new element */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full border border-primary/5"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 2.5],
                opacity: [0, 0.2, 0],
                borderWidth: ["1px", "0.5px", "0px"]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                repeatDelay: 1
              }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full border border-secondary/5"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 2.5],
                opacity: [0, 0.2, 0],
                borderWidth: ["1px", "0.5px", "0px"]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                repeatDelay: 1,
                delay: 2
              }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full border border-accent/5"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 2.5],
                opacity: [0, 0.2, 0],
                borderWidth: ["1px", "0.5px", "0px"]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                repeatDelay: 1,
                delay: 4
              }}
            />
          </div>

          {/* Main preloader content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Enhanced logo with advanced animations */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: [0.8, 1.1, 1],
                opacity: 1,
              }}
              transition={{
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1],
                times: [0, 0.7, 1]
              }}
              className="mb-8 relative"
            >
              {/* Main logo with enhanced glow */}
              <motion.div
                animate={{
                  filter: [
                    "drop-shadow(0 0 8px rgba(var(--primary), 0.3))",
                    "drop-shadow(0 0 20px rgba(var(--primary), 0.6))",
                    "drop-shadow(0 0 8px rgba(var(--primary), 0.3))"
                  ],
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="relative z-10"
              >
                <Logo size="xl" className="preloader-glow relative z-10" />
              </motion.div>

              {/* Enhanced decorative rotating rings with more variety */}
              <div className="absolute inset-0 -m-4 preloader-rotate opacity-30">
                <div className="w-full h-full rounded-full border-2 border-dashed border-primary/30"></div>
              </div>
              <div className="absolute inset-0 -m-8 preloader-rotate opacity-20" style={{ animationDirection: 'reverse', animationDuration: '15s' }}>
                <div className="w-full h-full rounded-full border-2 border-dotted border-secondary/30"></div>
              </div>
              <div className="absolute inset-0 -m-12 preloader-rotate opacity-15" style={{ animationDuration: '25s' }}>
                <div className="w-full h-full rounded-full border border-accent/20"></div>
              </div>

              {/* Orbiting particles */}
              {Array.from({ length: 4 }).map((_, i) => {
                const angle = (i * Math.PI) / 2; // Distribute evenly around the circle
                const delay = i * 0.5; // Stagger the animations
                const size = Math.random() * 0.5 + 0.5; // Random size between 0.5 and 1rem
                const colorOptions = ["primary", "secondary", "accent"];
                const color = colorOptions[i % colorOptions.length];

                return (
                  <motion.div
                    key={`orbit-${i}`}
                    className={`absolute rounded-full bg-${color}/40 shadow-glow`}
                    initial={{
                      x: Math.cos(angle) * 50,
                      y: Math.sin(angle) * 50,
                      opacity: 0,
                      scale: 0
                    }}
                    animate={{
                      opacity: [0, 0.8, 0.4, 0.8, 0],
                      scale: [0, 1, 0.8, 1, 0],
                      x: [
                        Math.cos(angle) * 50,
                        Math.cos(angle + Math.PI / 2) * 50,
                        Math.cos(angle + Math.PI) * 50,
                        Math.cos(angle + Math.PI * 1.5) * 50,
                        Math.cos(angle + Math.PI * 2) * 50
                      ],
                      y: [
                        Math.sin(angle) * 50,
                        Math.sin(angle + Math.PI / 2) * 50,
                        Math.sin(angle + Math.PI) * 50,
                        Math.sin(angle + Math.PI * 1.5) * 50,
                        Math.sin(angle + Math.PI * 2) * 50
                      ]
                    }}
                    transition={{
                      duration: 8,
                      delay,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    style={{
                      width: `${size}rem`,
                      height: `${size}rem`,
                      left: "50%",
                      top: "50%",
                      marginLeft: `-${size / 2}rem`,
                      marginTop: `-${size / 2}rem`,
                    }}
                  />
                );
              })}
            </motion.div>

            {/* Enhanced circular progress indicator with advanced effects */}
            <div className="relative w-48 h-48 mb-8">
              {/* Outer glow ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                initial={{ opacity: 0, scale: 0.8, boxShadow: "0 0 0 rgba(var(--primary), 0)" }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  boxShadow: [
                    "0 0 10px rgba(var(--primary), 0.1)",
                    "0 0 20px rgba(var(--primary), 0.2)",
                    "0 0 10px rgba(var(--primary), 0.1)"
                  ]
                }}
                transition={{
                  delay: 0.3,
                  duration: 0.8,
                  boxShadow: {
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }
                }}
              />

              {/* Background circle with enhanced styling */}
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-primary/20 backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              />

              {/* Secondary decorative circle */}
              <motion.div
                className="absolute inset-2 rounded-full border-2 border-dashed border-secondary/15"
                initial={{ opacity: 0, rotate: 0 }}
                animate={{ opacity: 1, rotate: 360 }}
                transition={{
                  opacity: { delay: 0.4, duration: 0.8 },
                  rotate: { duration: 30, repeat: Infinity, ease: "linear" }
                }}
              />

              {/* Progress circle with enhanced glow */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="50%" stopColor="hsl(var(--secondary))" />
                    <stop offset="100%" stopColor="hsl(var(--primary))" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                <motion.circle
                  cx="96"
                  cy="96"
                  r="86"
                  fill="none"
                  strokeWidth="6"
                  stroke="url(#progressGradient)"
                  strokeLinecap="round"
                  strokeDasharray="540"
                  initial={{ strokeDashoffset: 540 }}
                  animate={{
                    strokeDashoffset: 540 - (540 * progress) / 100,
                    filter: [
                      "drop-shadow(0 0 3px rgba(var(--primary), 0.3))",
                      "drop-shadow(0 0 6px rgba(var(--primary), 0.5))",
                      "drop-shadow(0 0 3px rgba(var(--primary), 0.3))"
                    ]
                  }}
                  transition={{
                    strokeDashoffset: { duration: 0.5, ease: "easeOut" },
                    filter: { duration: 2, repeat: Infinity, repeatType: "reverse" }
                  }}
                  filter="url(#glow)"
                />
              </svg>

              {/* Enhanced rotating element with trail effect */}
              <motion.div
                className="absolute top-0 left-1/2 -ml-3 -mt-3"
                style={{ rotate: rotation }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <motion.div
                  className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-secondary shadow-glow"
                  animate={{
                    scale: [1, 1.3, 1],
                    boxShadow: [
                      "0 0 5px rgba(var(--primary), 0.5)",
                      "0 0 15px rgba(var(--primary), 0.8)",
                      "0 0 5px rgba(var(--primary), 0.5)"
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />

                {/* Particle trail */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={`trail-${i}`}
                    className="absolute top-1/2 left-1/2 w-4 h-4 -ml-2 -mt-2 rounded-full bg-primary/40"
                    initial={{
                      scale: 0.8,
                      opacity: 0.7 - (i * 0.15)
                    }}
                    animate={{
                      scale: 0.8 - (i * 0.15),
                      opacity: [0.7 - (i * 0.15), 0.3 - (i * 0.05), 0.7 - (i * 0.15)]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    style={{
                      filter: `blur(${i + 1}px)`,
                      transform: `rotate(${-rotation + (i * -10)}deg) translateX(${-i * 5}px)`
                    }}
                  />
                ))}
              </motion.div>

              {/* Enhanced percentage text with gradient */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="text-3xl font-bold font-serif"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    filter: [
                      "drop-shadow(0 0 1px rgba(var(--primary), 0.5))",
                      "drop-shadow(0 0 2px rgba(var(--primary), 0.8))",
                      "drop-shadow(0 0 1px rgba(var(--primary), 0.5))"
                    ]
                  }}
                  transition={{
                    delay: 0.5,
                    filter: {
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }
                  }}
                >
                  <span className="preloader-gradient-text">{Math.round(progress)}%</span>
                </motion.div>
              </div>
            </div>

            {/* Loading text with super enhanced animations */}
            <motion.div
              className="relative h-10 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {!isComplete ? (
                <motion.div
                  className="flex items-center text-2xl"
                  initial={{ y: 0 }}
                  animate={{ y: isComplete ? -50 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Animated gradient text with enhanced effects */}
                  <motion.span
                    className="mr-2 font-bold font-serif preloader-gradient-text"
                    initial={{ filter: "blur(8px)", scale: 0.9 }}
                    animate={{
                      filter: ["blur(0px)", "blur(1px)", "blur(0px)"],
                      scale: [1, 1.05, 1],
                      textShadow: [
                        "0 0 5px rgba(var(--primary), 0.3)",
                        "0 0 15px rgba(var(--primary), 0.6)",
                        "0 0 5px rgba(var(--primary), 0.3)"
                      ]
                    }}
                    transition={{
                      filter: { duration: 3, repeat: Infinity, repeatType: "reverse" },
                      scale: { duration: 3, repeat: Infinity, repeatType: "reverse" },
                      textShadow: { duration: 3, repeat: Infinity, repeatType: "reverse" }
                    }}
                  >
                    CONECTA
                  </motion.span>

                  {/* Super enhanced animated dots with particle effects */}
                  <span className="flex space-x-2 h-8 items-end">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="relative"
                      >
                        <motion.span
                          animate={{
                            y: [0, -12, 0],
                            opacity: [0.7, 1, 0.7],
                            scale: [1, 1.3, 1],
                            backgroundColor: [
                              "hsl(var(--primary))",
                              "hsl(var(--secondary))",
                              "hsl(var(--primary))"
                            ],
                            boxShadow: [
                              "0 0 5px rgba(var(--primary), 0.3)",
                              "0 0 15px rgba(var(--primary), 0.6)",
                              "0 0 5px rgba(var(--primary), 0.3)"
                            ]
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatDelay: 0,
                            delay: i * 0.2,
                            ease: "easeInOut"
                          }}
                          className="inline-block w-3 h-3 rounded-full bg-primary"
                        />

                        {/* Particle trail effect */}
                        {[0, 1, 2].map((j) => (
                          <motion.span
                            key={`trail-${i}-${j}`}
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary/30"
                            initial={{ opacity: 0, y: 0, scale: 0.8 }}
                            animate={{
                              opacity: [0, 0.5, 0],
                              y: [-2 * (j + 1), -6 * (j + 1)],
                              scale: [0.8, 0.4],
                              filter: `blur(${j + 1}px)`
                            }}
                            transition={{
                              duration: 0.8,
                              repeat: Infinity,
                              repeatDelay: 0.7,
                              delay: i * 0.2 + 0.1 * j,
                              ease: "easeOut"
                            }}
                          />
                        ))}
                      </motion.div>
                    ))}
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  className="flex items-center text-2xl"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.7,
                    type: "spring",
                    stiffness: 400,
                    damping: 15
                  }}
                >
                  {/* Success message with enhanced animated gradient */}
                  <motion.span
                    className="mr-3 font-bold font-serif preloader-gradient-text"
                    animate={{
                      scale: [1, 1.05, 1],
                      filter: [
                        "drop-shadow(0 0 5px rgba(var(--primary), 0.3))",
                        "drop-shadow(0 0 15px rgba(var(--primary), 0.6))",
                        "drop-shadow(0 0 5px rgba(var(--primary), 0.3))"
                      ]
                    }}
                    transition={{
                      scale: { duration: 3, repeat: Infinity, repeatType: "reverse" },
                      filter: { duration: 3, repeat: Infinity, repeatType: "reverse" }
                    }}
                  >
                    Welcome to CONECTA
                  </motion.span>

                  {/* Enhanced animated checkmark with glow effect and particles */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0, rotate: -45 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{
                      delay: 0.2,
                      type: "spring",
                      stiffness: 400,
                      damping: 10
                    }}
                    className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-glow"
                  >
                    <motion.span
                      animate={{
                        scale: [1, 1.2, 1],
                        filter: [
                          "drop-shadow(0 0 2px rgba(255, 255, 255, 0.5))",
                          "drop-shadow(0 0 5px rgba(255, 255, 255, 0.8))",
                          "drop-shadow(0 0 2px rgba(255, 255, 255, 0.5))"
                        ]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    >
                      ✓
                    </motion.span>

                    {/* Success particles */}
                    {Array.from({ length: 8 }).map((_, i) => {
                      const angle = (i * Math.PI) / 4;
                      return (
                        <motion.div
                          key={`success-particle-${i}`}
                          className="absolute w-1.5 h-1.5 rounded-full bg-primary/60"
                          initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                          animate={{
                            scale: [0, 1, 0],
                            x: [0, Math.cos(angle) * 20],
                            y: [0, Math.sin(angle) * 20],
                            opacity: [0, 0.8, 0]
                          }}
                          transition={{
                            duration: 0.8,
                            delay: 0.3,
                            ease: "easeOut"
                          }}
                        />
                      );
                    })}
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Enhanced animated bottom bar with glow effect */}
          <div className="absolute bottom-0 left-0 right-0 h-2">
            {/* Glow layer */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30 blur-md"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{
                scaleX: progress / 100,
                opacity: [0.5, 0.8, 0.5],
                backgroundPosition: ["0% center", "100% center"]
              }}
              transition={{
                scaleX: { duration: 0.5, ease: "easeOut" },
                opacity: { duration: 2, repeat: Infinity, repeatType: "reverse" },
                backgroundPosition: { duration: 3, repeat: Infinity, ease: "linear" }
              }}
              style={{ transformOrigin: "left" }}
            />

            {/* Main progress bar */}
            <motion.div
              className="absolute inset-0 h-1 mt-0.5 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%]"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{
                scaleX: progress / 100,
                opacity: 1,
                backgroundPosition: ["0% center", "100% center"],
                boxShadow: [
                  "0 0 5px rgba(var(--primary), 0.3)",
                  "0 0 10px rgba(var(--primary), 0.6)",
                  "0 0 5px rgba(var(--primary), 0.3)"
                ]
              }}
              transition={{
                scaleX: { duration: 0.5, ease: "easeOut" },
                backgroundPosition: { duration: 3, repeat: Infinity, ease: "linear" },
                boxShadow: { duration: 2, repeat: Infinity, repeatType: "reverse" }
              }}
              style={{ transformOrigin: "left" }}
            />

            {/* Animated particles along the progress bar */}
            {Array.from({ length: 5 }).map((_, i) => {
              const position = (i + 1) * 20; // Distribute particles at 20%, 40%, 60%, 80%, 100% of progress
              const isVisible = progress >= position;

              return (
                <motion.div
                  key={`progress-particle-${i}`}
                  className="absolute bottom-0.5 w-1.5 h-1.5 rounded-full bg-white"
                  initial={{ scale: 0, opacity: 0, x: `${position}%` }}
                  animate={{
                    scale: isVisible ? [0, 1.5, 1] : 0,
                    opacity: isVisible ? [0, 1, 0.7] : 0,
                    y: isVisible ? [0, -10, 0] : 0,
                    boxShadow: isVisible ? [
                      "0 0 0px rgba(255, 255, 255, 0)",
                      "0 0 10px rgba(255, 255, 255, 0.8)",
                      "0 0 0px rgba(255, 255, 255, 0)"
                    ] : "none"
                  }}
                  transition={{
                    scale: { duration: 1, ease: "easeOut" },
                    opacity: { duration: 1, ease: "easeOut" },
                    y: { duration: 1, ease: "easeOut" },
                    boxShadow: { duration: 1, ease: "easeOut" }
                  }}
                />
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
