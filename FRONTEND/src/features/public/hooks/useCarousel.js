import { useCallback, useEffect, useRef, useState } from 'react';

export default function useCarousel(length, delay = 6000) {
  const [slide, setSlide] = useState(0);
  const [fading, setFading] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const interacting = hovered || focused;
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const transition = useRef(null);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = (event) => setReducedMotion(event.matches);
    query.addEventListener('change', update);
    return () => {
      query.removeEventListener('change', update);
      clearTimeout(transition.current);
    };
  }, []);
  const changeSlide = useCallback(
    (next) => {
      clearTimeout(transition.current);
      setFading(!reducedMotion);
      transition.current = setTimeout(
        () => {
          setSlide(next);
          setFading(false);
        },
        reducedMotion ? 0 : 300,
      );
    },
    [reducedMotion],
  );
  useEffect(() => {
    if (!autoplay || interacting || reducedMotion) return;
    const timer = setTimeout(() => changeSlide((slide + 1) % length), delay);
    return () => clearTimeout(timer);
  }, [autoplay, interacting, reducedMotion, slide, length, delay, changeSlide]);
  return {
    slide,
    fading,
    changeSlide,
    autoplay: autoplay && !reducedMotion,
    toggleAutoplay: () => setAutoplay((value) => !value),
    setHovered,
    setFocused,
  };
}
