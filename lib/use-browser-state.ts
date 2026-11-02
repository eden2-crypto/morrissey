'use client';

import { useEffect, useState, type RefObject } from 'react';

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return reduced;
}

export function useWebGLSupport() {
  const [supported, setSupported] = useState<boolean | null>(null);
  useEffect(() => {
    const canvas = document.createElement('canvas');
    setSupported(Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl')));
  }, []);
  return supported;
}

export function useIsCompactViewport() {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px)');
    const update = () => setCompact(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return compact;
}

export function useInView<T extends Element>(ref: RefObject<T>, rootMargin = '0px') {
  const [inView, setInView] = useState(false);
  const [hasBeenInView, setHasBeenInView] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setHasBeenInView(true);
      },
      { rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, rootMargin]);
  return { inView, hasBeenInView };
}
