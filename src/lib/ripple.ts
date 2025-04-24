/**
 * Creates a ripple effect on click for buttons and interactive elements
 * 
 * Usage:
 * 1. Add the 'ripple-container' class to the parent element
 * 2. Call createRipple(event) in the onClick handler
 * 
 * Example:
 * <button 
 *   className="ripple-container" 
 *   onClick={(e) => { createRipple(e); handleClick(); }}
 * >
 *   Click me
 * </button>
 */

export function createRipple(event: React.MouseEvent<HTMLElement>) {
  const button = event.currentTarget;
  
  // Remove any existing ripples
  const existingRipple = button.querySelector('.ripple');
  if (existingRipple) {
    existingRipple.remove();
  }
  
  // Create ripple element
  const ripple = document.createElement('span');
  ripple.classList.add('ripple');
  
  // Calculate size (should be at least as large as the button)
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  ripple.style.width = ripple.style.height = `${diameter}px`;
  
  // Position the ripple
  const rect = button.getBoundingClientRect();
  ripple.style.left = `${event.clientX - rect.left - diameter / 2}px`;
  ripple.style.top = `${event.clientY - rect.top - diameter / 2}px`;
  
  // Add ripple to button
  button.appendChild(ripple);
  
  // Remove ripple after animation completes
  setTimeout(() => {
    ripple.remove();
  }, 800); // Match the animation duration in CSS
}

/**
 * Hook to add ripple effect to any element
 * 
 * Usage:
 * const rippleProps = useRippleEffect();
 * 
 * <button {...rippleProps} className={cn("your-classes", "ripple-container")}>
 *   Click me
 * </button>
 */
export function useRippleEffect() {
  return {
    onClick: (event: React.MouseEvent<HTMLElement>) => createRipple(event),
  };
}
