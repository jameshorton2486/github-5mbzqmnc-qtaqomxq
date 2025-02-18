import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Add support for reduced motion preferences
export function supportsReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Add support for safe transform scale
export function getScaleTransform(scale: number): string {
  return supportsReducedMotion() ? 'none' : `scale(${scale})`;
}

// Smooth scroll to element
export function smoothScrollTo(element: HTMLElement, offset = 0): void {
  const supportsNativeSmoothScroll = 'scrollBehavior' in document.documentElement.style;
  const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;

  if (supportsNativeSmoothScroll) {
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  } else {
    // Fallback for browsers that don't support smooth scrolling
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 500;
    let start: number | null = null;

    function step(timestamp: number) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const percentage = Math.min(progress / duration, 1);

      window.scrollTo(0, startPosition + distance * easeInOutCubic(percentage));

      if (progress < duration) {
        window.requestAnimationFrame(step);
      }
    }

    window.requestAnimationFrame(step);
  }
}

// Easing function for smooth scrolling
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Get element offset from top of page
export function getOffsetTop(element: HTMLElement): number {
  let offsetTop = 0;
  while(element) {
    offsetTop += element.offsetTop;
    element = element.offsetParent as HTMLElement;
  }
  return offsetTop;
}

// Detect if element is in viewport
export function isInViewport(element: HTMLElement, offset = 0): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 - offset &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}