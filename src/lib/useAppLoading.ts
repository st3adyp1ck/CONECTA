import { useState, useEffect } from 'react';

interface UseAppLoadingOptions {
  minLoadTime?: number;
  initialDelay?: number;
}

/**
 * Hook to manage application loading state
 * 
 * @param options Configuration options
 * @returns Loading state and functions to control it
 */
export function useAppLoading({
  minLoadTime = 2500,
  initialDelay = 0,
}: UseAppLoadingOptions = {}) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  // Track when minimum display time has elapsed
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, minLoadTime + initialDelay);

    return () => clearTimeout(timer);
  }, [minLoadTime, initialDelay]);

  // Track when all assets are loaded
  useEffect(() => {
    const handleLoad = () => {
      setAssetsLoaded(true);
    };

    // Check if document is already loaded
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  // Update loading state when both conditions are met
  useEffect(() => {
    if (assetsLoaded && minTimeElapsed) {
      setIsLoading(false);
    }
  }, [assetsLoaded, minTimeElapsed]);

  // Simulate progress
  useEffect(() => {
    if (!isLoading) return;

    let lastTime = Date.now();
    let frame: number;

    const updateProgress = () => {
      const now = Date.now();
      const deltaTime = now - lastTime;
      lastTime = now;

      // Calculate progress increment based on time elapsed
      // Slow down as we approach 100%
      setProgress((prev) => {
        // Target is 99% until assets are loaded
        const target = assetsLoaded ? 100 : 99;
        const remaining = target - prev;
        
        // Faster at the beginning, slower as we approach the target
        const increment = (remaining * deltaTime * 0.0005) + (deltaTime * 0.01);
        
        // Ensure we don't exceed the target
        return Math.min(prev + increment, target);
      });

      if (isLoading) {
        frame = requestAnimationFrame(updateProgress);
      }
    };

    // Add initial delay before starting progress
    const delayTimer = setTimeout(() => {
      frame = requestAnimationFrame(updateProgress);
    }, initialDelay);

    return () => {
      clearTimeout(delayTimer);
      cancelAnimationFrame(frame);
    };
  }, [isLoading, assetsLoaded, initialDelay]);

  return {
    isLoading,
    progress,
    setIsLoading,
    assetsLoaded,
    minTimeElapsed,
  };
}
