import { useCallback } from 'react';

/**
 * Agrega la clase `is-visible` a un elemento cuando entra al viewport.
 * Ideal para animaciones de entrada al scroll.
 *
 * @param {{ threshold?: number, rootMargin?: string, once?: boolean }} options
 * @returns {React.RefCallback}
 */
export default function useReveal({
  threshold = 0.15,
  rootMargin = '0px 0px -40px 0px',
  once = true,
} = {}) {
  return useCallback(
    (el) => {
      if (!el) return;

      // Respetar prefers-reduced-motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        el.classList.add('is-visible');
        return;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.classList.add('is-visible');
            if (once) observer.unobserve(el);
          }
        },
        { threshold, rootMargin },
      );

      observer.observe(el);
      return () => observer.disconnect();
    },
    [threshold, rootMargin, once],
  );
}
