/** @type {import('tailwindcss').Config} */
module.exports = {
  // No dark mode
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    fontFamily: {
      sans: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      serif: ['Playfair Display', 'ui-serif', 'Georgia', 'serif'],
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 15px rgba(0, 128, 128, 0.3)',
        'inner-glow': 'inset 0 0 10px rgba(0, 128, 128, 0.2)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'texture-pattern': "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\",%3E%3Cpath d=\"M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\" fill=\"currentColor\" fill-opacity=\"0.03\" fill-rule=\"evenodd\"/%3E%3C/svg%3E')",
      },
      keyframes: {
        // Base animations (keep for compatibility)
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },

        // Enhanced glow effects
        "pulse-glow": {
          '0%, 100%': {
            boxShadow: '0 0 15px rgba(0, 128, 128, 0.3)',
            filter: 'brightness(1)'
          },
          '50%': {
            boxShadow: '0 0 25px rgba(0, 128, 128, 0.6), 0 0 40px rgba(0, 128, 128, 0.2)',
            filter: 'brightness(1.1)'
          },
        },
        "neon-pulse": {
          '0%, 100%': {
            boxShadow: '0 0 5px rgba(var(--primary), 0.5), 0 0 10px rgba(var(--primary), 0.2)',
            filter: 'brightness(1) contrast(1)'
          },
          '50%': {
            boxShadow: '0 0 20px rgba(var(--primary), 0.7), 0 0 40px rgba(var(--primary), 0.4), 0 0 60px rgba(var(--primary), 0.2)',
            filter: 'brightness(1.2) contrast(1.1)'
          },
        },

        // Enhanced movement animations
        "float": {
          '0%, 100%': { transform: 'translateY(0) rotate(0)' },
          '50%': { transform: 'translateY(-10px) rotate(0.5deg)' },
        },
        "float-complex": {
          '0%': { transform: 'translateY(0) rotate(0)' },
          '25%': { transform: 'translateY(-7px) rotate(1deg)' },
          '50%': { transform: 'translateY(-10px) rotate(0)' },
          '75%': { transform: 'translateY(-5px) rotate(-1deg)' },
          '100%': { transform: 'translateY(0) rotate(0)' },
        },
        "sway": {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },

        // 3D animations
        "tilt-3d": {
          '0%, 100%': { transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)' },
          '25%': { transform: 'perspective(1000px) rotateX(2deg) rotateY(2deg)' },
          '50%': { transform: 'perspective(1000px) rotateX(0deg) rotateY(4deg)' },
          '75%': { transform: 'perspective(1000px) rotateX(-2deg) rotateY(2deg)' },
        },
        "flip-3d": {
          '0%': { transform: 'perspective(1000px) rotateY(0deg)' },
          '100%': { transform: 'perspective(1000px) rotateY(360deg)' },
        },

        // Enhanced transitions
        "slide-in-right": {
          '0%': { transform: 'translateX(100%)', opacity: '0', filter: 'blur(8px)' },
          '100%': { transform: 'translateX(0)', opacity: '1', filter: 'blur(0)' },
        },
        "slide-in-left": {
          '0%': { transform: 'translateX(-100%)', opacity: '0', filter: 'blur(8px)' },
          '100%': { transform: 'translateX(0)', opacity: '1', filter: 'blur(0)' },
        },
        "slide-in-bottom": {
          '0%': { transform: 'translateY(100%)', opacity: '0', filter: 'blur(8px)' },
          '100%': { transform: 'translateY(0)', opacity: '1', filter: 'blur(0)' },
        },
        "slide-in-top": {
          '0%': { transform: 'translateY(-100%)', opacity: '0', filter: 'blur(8px)' },
          '100%': { transform: 'translateY(0)', opacity: '1', filter: 'blur(0)' },
        },

        // Fade animations
        "fade-in": {
          '0%': { opacity: '0', filter: 'blur(4px)' },
          '100%': { opacity: '1', filter: 'blur(0)' },
        },
        "fade-in-scale": {
          '0%': { opacity: '0', transform: 'scale(0.95)', filter: 'blur(4px)' },
          '100%': { opacity: '1', transform: 'scale(1)', filter: 'blur(0)' },
        },

        // Background effects
        "gradient-shift": {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        "shimmer": {
          '0%': { backgroundPosition: '-500px 0' },
          '100%': { backgroundPosition: '500px 0' },
        },

        // Particle effects
        "particle-pulse": {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.7' },
          '50%': { transform: 'scale(1.1)', opacity: '1' },
        },
        "particle-drift": {
          '0%': { transform: 'translateX(0) translateY(0)' },
          '25%': { transform: 'translateX(10px) translateY(-10px)' },
          '50%': { transform: 'translateX(20px) translateY(0)' },
          '75%': { transform: 'translateX(10px) translateY(10px)' },
          '100%': { transform: 'translateX(0) translateY(0)' },
        },

        // Text effects
        "text-blur": {
          '0%, 100%': { filter: 'blur(0px)' },
          '50%': { filter: 'blur(2px)' },
        },
        "text-glitch": {
          '0%, 100%': { transform: 'translate(0)' },
          '10%': { transform: 'translate(-2px, -2px)' },
          '20%': { transform: 'translate(2px, 2px)' },
          '30%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(2px, -2px)' },
          '50%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '70%': { transform: 'translate(-2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '90%': { transform: 'translate(-2px, -2px)' },
        },

        // Special effects
        "ripple": {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        "bounce-subtle": {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        "rotate-slow": {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        "morph-blob": {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '25%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
          '50%': { borderRadius: '50% 60% 30% 60% / 30% 60% 70% 40%' },
          '75%': { borderRadius: '60% 40% 60% 30% / 60% 40% 60% 40%' },
        },
      },
      animation: {
        // Base animations (keep for compatibility)
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",

        // Enhanced glow effects
        "pulse-glow": "pulse-glow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "neon-pulse": "neon-pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",

        // Enhanced movement animations
        "float": "float-complex 8s ease-in-out infinite",
        "float-slow": "float-complex 12s ease-in-out infinite",
        "float-fast": "float 5s ease-in-out infinite",
        "sway": "sway 6s ease-in-out infinite",

        // 3D animations
        "tilt-3d": "tilt-3d 10s ease-in-out infinite",
        "flip-3d": "flip-3d 20s linear infinite",

        // Enhanced transitions
        "slide-in-right": "slide-in-right 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-in-left": "slide-in-left 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-in-bottom": "slide-in-bottom 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-in-top": "slide-in-top 0.7s cubic-bezier(0.16, 1, 0.3, 1)",

        // Fade animations
        "fade-in": "fade-in 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in-scale": "fade-in-scale 0.7s cubic-bezier(0.16, 1, 0.3, 1)",

        // Background effects
        "gradient-shift": "gradient-shift 15s ease infinite",
        "shimmer": "shimmer 2s linear infinite",

        // Particle effects
        "particle-pulse": "particle-pulse 4s ease-in-out infinite",
        "particle-drift": "particle-drift 20s ease-in-out infinite",

        // Text effects
        "text-blur": "text-blur 8s ease-in-out infinite",
        "text-glitch": "text-glitch 5s ease-in-out infinite",

        // Special effects
        "ripple": "ripple 1s cubic-bezier(0, 0, 0.2, 1) forwards",
        "bounce-subtle": "bounce-subtle 2s ease-in-out infinite",
        "rotate-slow": "rotate-slow 20s linear infinite",
        "morph-blob": "morph-blob 25s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}