import { Variants } from "framer-motion";

// Page transition variants
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    filter: "blur(8px)",
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    filter: "blur(8px)",
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Staggered children variants
export const itemVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    filter: "blur(4px)",
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    filter: "blur(4px)",
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Card hover variants
export const cardHoverVariants: Variants = {
  initial: {
    scale: 1,
    y: 0,
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
  },
  hover: {
    scale: 1.03,
    y: -10,
    boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.1), 0px 0px 20px rgba(0, 128, 128, 0.2)",
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  tap: {
    scale: 0.98,
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
    transition: {
      duration: 0.15,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Button variants
export const buttonVariants: Variants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Fade in variants with different directions
export const fadeInUpVariants: Variants = {
  initial: { opacity: 0, y: 20, filter: "blur(4px)" },
  animate: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    }
  },
};

export const fadeInDownVariants: Variants = {
  initial: { opacity: 0, y: -20, filter: "blur(4px)" },
  animate: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    }
  },
};

export const fadeInLeftVariants: Variants = {
  initial: { opacity: 0, x: -20, filter: "blur(4px)" },
  animate: { 
    opacity: 1, 
    x: 0, 
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    }
  },
};

export const fadeInRightVariants: Variants = {
  initial: { opacity: 0, x: 20, filter: "blur(4px)" },
  animate: { 
    opacity: 1, 
    x: 0, 
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    }
  },
};

// Scale variants
export const scaleVariants: Variants = {
  initial: { opacity: 0, scale: 0.9, filter: "blur(4px)" },
  animate: { 
    opacity: 1, 
    scale: 1, 
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: [0.34, 1.56, 0.64, 1],
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9, 
    filter: "blur(4px)",
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
    }
  },
};

// 3D tilt effect
export const tilt3DVariants: Variants = {
  initial: {
    rotateX: 0,
    rotateY: 0,
    transformPerspective: 1000,
  },
  hover: (direction: { x: number; y: number }) => ({
    rotateX: direction.y * 10,
    rotateY: direction.x * -10,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

// Staggered list variants
export const listVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

export const listItemVariants: Variants = {
  initial: {
    opacity: 0,
    x: -20,
    filter: "blur(4px)",
  },
  animate: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Loading spinner variants
export const spinnerVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      repeat: Infinity,
      duration: 1,
      ease: "linear",
    },
  },
};

// Pulse effect variants
export const pulseVariants: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      repeat: Infinity,
      duration: 2,
      ease: "easeInOut",
    },
  },
};

// Blob animation variants
export const blobVariants: Variants = {
  animate: {
    borderRadius: [
      "60% 40% 30% 70% / 60% 30% 70% 40%",
      "30% 60% 70% 40% / 50% 60% 30% 60%",
      "50% 60% 30% 60% / 30% 60% 70% 40%",
      "60% 40% 60% 30% / 60% 40% 60% 40%",
      "60% 40% 30% 70% / 60% 30% 70% 40%",
    ],
    transition: {
      repeat: Infinity,
      duration: 25,
      ease: "easeInOut",
    },
  },
};

// Scroll-triggered animation variants
export const scrollRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Ripple effect variants
export const rippleVariants: Variants = {
  initial: {
    scale: 0,
    opacity: 0.5,
  },
  animate: {
    scale: 4,
    opacity: 0,
    transition: {
      duration: 0.8,
      ease: [0, 0, 0.2, 1],
    },
  },
};
