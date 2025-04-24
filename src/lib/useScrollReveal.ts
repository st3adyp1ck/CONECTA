import { useEffect, useRef, useState } from 'react';

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

/**
 * Hook to reveal elements when they enter the viewport
 * 
 * Usage:
 * const { ref, isVisible } = useScrollReveal();
 * 
 * <div 
 *   ref={ref} 
 *   className={`reveal-on-scroll ${isVisible ? 'is-visible' : ''}`}
 * >
 *   Content to reveal
 * </div>
 */
export function useScrollReveal({
  threshold = 0.1,
  rootMargin = '0px',
  once = true,
}: ScrollRevealOptions = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const hasTriggered = useRef(false);

  useEffect(() => {
    // Skip if already triggered and once is true
    if (once && hasTriggered.current) return;
    
    const currentRef = ref.current;
    if (!currentRef) return;

    // Cleanup previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          hasTriggered.current = true;
          
          // Disconnect observer if once is true
          if (once && observerRef.current) {
            observerRef.current.disconnect();
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observerRef.current.observe(currentRef);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, rootMargin, once]);

  return { ref, isVisible };
}

/**
 * Utility to add scroll reveal to multiple elements with staggered delay
 * 
 * Usage:
 * const { refs, isVisible } = useStaggeredScrollReveal({ count: 5, staggerDelay: 0.1 });
 * 
 * {items.map((item, index) => (
 *   <div 
 *     key={item.id}
 *     ref={(el) => refs.current[index] = el}
 *     className={`reveal-on-scroll ${isVisible[index] ? 'is-visible' : ''}`}
 *     style={{ transitionDelay: `${index * 0.1}s` }}
 *   >
 *     {item.content}
 *   </div>
 * ))}
 */
export function useStaggeredScrollReveal({
  count,
  threshold = 0.1,
  rootMargin = '0px',
  once = true,
  staggerDelay = 0.1,
}: {
  count: number;
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  staggerDelay?: number;
}) {
  const [isVisible, setIsVisible] = useState<boolean[]>(Array(count).fill(false));
  const refs = useRef<(HTMLElement | null)[]>(Array(count).fill(null));
  const observersRef = useRef<(IntersectionObserver | null)[]>(Array(count).fill(null));
  const hasTriggered = useRef<boolean[]>(Array(count).fill(false));

  useEffect(() => {
    // Create observers for each ref
    for (let i = 0; i < count; i++) {
      // Skip if already triggered and once is true
      if (once && hasTriggered.current[i]) continue;
      
      const currentRef = refs.current[i];
      if (!currentRef) continue;

      // Cleanup previous observer
      if (observersRef.current[i]) {
        observersRef.current[i]?.disconnect();
      }

      // Create new observer with staggered delay
      observersRef.current[i] = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting) {
            // Use setTimeout to create staggered effect
            setTimeout(() => {
              setIsVisible(prev => {
                const newState = [...prev];
                newState[i] = true;
                return newState;
              });
              hasTriggered.current[i] = true;
            }, i * staggerDelay * 1000);
            
            // Disconnect observer if once is true
            if (once && observersRef.current[i]) {
              observersRef.current[i]?.disconnect();
            }
          } else if (!once) {
            setIsVisible(prev => {
              const newState = [...prev];
              newState[i] = false;
              return newState;
            });
          }
        },
        { threshold, rootMargin }
      );

      observersRef.current[i]?.observe(currentRef);
    }

    return () => {
      observersRef.current.forEach(observer => {
        if (observer) observer.disconnect();
      });
    };
  }, [count, threshold, rootMargin, once, staggerDelay]);

  return { refs, isVisible };
}
