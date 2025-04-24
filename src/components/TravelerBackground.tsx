import React from "react";
import { motion } from "framer-motion";

export const TravelerBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Gradient overlay - reduced opacity */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background/80 backdrop-blur-[1px] z-10"></div>

      {/* Background pattern with traveler theme */}
      <div className="absolute inset-0 opacity-30">
        {/* Main backpack pattern - more visible */}
        <div
          className="absolute inset-0 bg-repeat bg-center"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 24 24' fill='%239C92AC' fill-opacity='0.15'%3E%3Cpath d='M7,22 L17,22 C18.6568542,22 20,20.6568542 20,19 L20,9 C20,7.34314575 18.6568542,6 17,6 L16,6 L16,5 C16,3.34314575 14.6568542,2 13,2 L11,2 C9.34314575,2 8,3.34314575 8,5 L8,6 L7,6 C5.34314575,6 4,7.34314575 4,9 L4,19 C4,20.6568542 5.34314575,22 7,22 Z M10,5 C10,4.44771525 10.4477153,4 11,4 L13,4 C13.5522847,4 14,4.44771525 14,5 L14,6 L10,6 L10,5 Z M7,8 L17,8 C17.5522847,8 18,8.44771525 18,9 L18,19 C18,19.5522847 17.5522847,20 17,20 L7,20 C6.44771525,20 6,19.5522847 6,19 L6,9 C6,8.44771525 6.44771525,8 7,8 Z'/%3E%3C/svg%3E")`,
            backgroundSize: '120px 120px'
          }}
        ></div>

        {/* Compass pattern */}
        <div
          className="absolute inset-0 bg-repeat bg-center"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 24 24' fill='%239C92AC' fill-opacity='0.12'%3E%3Cpath d='M12,22 C17.5228475,22 22,17.5228475 22,12 C22,6.4771525 17.5228475,2 12,2 C6.4771525,2 2,6.4771525 2,12 C2,17.5228475 6.4771525,22 12,22 Z M12,20 C7.581722,20 4,16.418278 4,12 C4,7.581722 7.581722,4 12,4 C16.418278,4 20,7.581722 20,12 C20,16.418278 16.418278,20 12,20 Z M8.5,14.5 L15.5,9.5 L10.5,16.5 L8.5,14.5 Z M10.5,7.5 L13.5,10.5 L15.5,9.5 L10.5,7.5 Z'/%3E%3C/svg%3E")`,
            backgroundSize: '160px 160px'
          }}
        ></div>

        {/* Map pattern */}
        <div
          className="absolute inset-0 bg-repeat bg-center"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 24 24' fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M8,3 L8,19 L2,21 L2,5 L8,3 Z M16,7 L22,5 L22,21 L16,19 L16,7 Z M15,7.25 L9,5.25 L9,18.75 L15,16.75 L15,7.25 Z'/%3E%3C/svg%3E")`,
            backgroundSize: '140px 140px'
          }}
        ></div>

        {/* Mountain pattern */}
        <div
          className="absolute inset-0 bg-repeat bg-center mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 24 24' fill='%239C92AC' fill-opacity='0.15'%3E%3Cpath d='M18,22 L6,22 L12,5 L18,22 Z M8.24,20 L15.76,20 L12,8.64 L8.24,20 Z M2,22 L9,8 L11,12.5 L13,8 L20,22 L2,22 Z'/%3E%3C/svg%3E")`,
            backgroundSize: '180px 180px'
          }}
        ></div>
      </div>

      {/* Animated elements */}
      <div className="absolute inset-0 z-0">
        {/* Compass element */}
        <motion.div
          className="absolute top-[15%] right-[10%] w-64 h-64 opacity-15"
          animate={{
            rotate: 360,
            scale: [1, 1.05, 1],
          }}
          transition={{
            rotate: { duration: 120, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="#9C92AC" xmlns="http://www.w3.org/2000/svg">
            <path d="M12,22 C17.5228475,22 22,17.5228475 22,12 C22,6.4771525 17.5228475,2 12,2 C6.4771525,2 2,6.4771525 2,12 C2,17.5228475 6.4771525,22 12,22 Z M12,20 C7.581722,20 4,16.418278 4,12 C4,7.581722 7.581722,4 12,4 C16.418278,4 20,7.581722 20,12 C20,16.418278 16.418278,20 12,20 Z M8.5,14.5 L15.5,9.5 L10.5,16.5 L8.5,14.5 Z M10.5,7.5 L13.5,10.5 L15.5,9.5 L10.5,7.5 Z" />
          </svg>
        </motion.div>

        {/* Map element */}
        <motion.div
          className="absolute bottom-[10%] left-[5%] w-96 h-96 opacity-15"
          animate={{
            y: [0, -10, 0],
            opacity: [0.15, 0.2, 0.15],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="#9C92AC" xmlns="http://www.w3.org/2000/svg">
            <path d="M8,3 L8,19 L2,21 L2,5 L8,3 Z M16,7 L22,5 L22,21 L16,19 L16,7 Z M15,7.25 L9,5.25 L9,18.75 L15,16.75 L15,7.25 Z" />
          </svg>
        </motion.div>

        {/* Backpack element - larger and more visible */}
        <motion.div
          className="absolute top-[40%] left-[15%] w-64 h-64 opacity-20"
          animate={{
            rotate: [-5, 5, -5],
            scale: [1, 1.03, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="#9C92AC" xmlns="http://www.w3.org/2000/svg">
            <path d="M7,22 L17,22 C18.6568542,22 20,20.6568542 20,19 L20,9 C20,7.34314575 18.6568542,6 17,6 L16,6 L16,5 C16,3.34314575 14.6568542,2 13,2 L11,2 C9.34314575,2 8,3.34314575 8,5 L8,6 L7,6 C5.34314575,6 4,7.34314575 4,9 L4,19 C4,20.6568542 5.34314575,22 7,22 Z M10,5 C10,4.44771525 10.4477153,4 11,4 L13,4 C13.5522847,4 14,4.44771525 14,5 L14,6 L10,6 L10,5 Z M7,8 L17,8 C17.5522847,8 18,8.44771525 18,9 L18,19 C18,19.5522847 17.5522847,20 17,20 L7,20 C6.44771525,20 6,19.5522847 6,19 L6,9 C6,8.44771525 6.44771525,8 7,8 Z" />
          </svg>
        </motion.div>

        {/* Mountain element */}
        <motion.div
          className="absolute top-[60%] right-[15%] w-72 h-72 opacity-15"
          animate={{
            y: [0, 5, 0],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="#9C92AC" xmlns="http://www.w3.org/2000/svg">
            <path d="M18,22 L6,22 L12,5 L18,22 Z M8.24,20 L15.76,20 L12,8.64 L8.24,20 Z M2,22 L9,8 L11,12.5 L13,8 L20,22 L2,22 Z" />
          </svg>
        </motion.div>

        {/* Camera element - new */}
        <motion.div
          className="absolute top-[25%] left-[60%] w-48 h-48 opacity-15"
          animate={{
            rotate: [0, -3, 0, 3, 0],
            scale: [1, 1.04, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="#9C92AC" xmlns="http://www.w3.org/2000/svg">
            <path d="M9,2 L15,2 L17,5 L21,5 C22.1045695,5 23,5.8954305 23,7 L23,19 C23,20.1045695 22.1045695,21 21,21 L3,21 C1.8954305,21 1,20.1045695 1,19 L1,7 C1,5.8954305 1.8954305,5 3,5 L7,5 L9,2 Z M12,7 C8.96243388,7 6.5,9.46243388 6.5,12.5 C6.5,15.5375661 8.96243388,18 12,18 C15.0375661,18 17.5,15.5375661 17.5,12.5 C17.5,9.46243388 15.0375661,7 12,7 Z M12,9 C13.9329966,9 15.5,10.5670034 15.5,12.5 C15.5,14.4329966 13.9329966,16 12,16 C10.0670034,16 8.5,14.4329966 8.5,12.5 C8.5,10.5670034 10.0670034,9 12,9 Z" />
          </svg>
        </motion.div>
      </div>
    </div>
  );
};
