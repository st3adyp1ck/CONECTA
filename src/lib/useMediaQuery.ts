import { useState, useEffect } from 'react';

/**
 * Custom hook for responsive design using media queries
 * 
 * @param query CSS media query string
 * @returns Boolean indicating if the media query matches
 * 
 * Example usage:
 * const isMobile = useMediaQuery('(max-width: 767px)');
 * const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
 * const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
 */
export function useMediaQuery(query: string): boolean {
  // Initialize with null to avoid hydration mismatch
  const [matches, setMatches] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window === 'undefined') return;
    
    // Create media query list
    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);
    
    // Create event listener
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    // Add event listener
    mediaQuery.addEventListener('change', handleChange);
    
    // Clean up
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);
  
  return matches;
}
