'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { MotionConfig } from 'framer-motion';
import { useEffect, type ReactNode } from 'react';
import { usePrefersReducedMotion } from '@/lib/use-browser-state';

gsap.registerPlugin(ScrollTrigger);

const HEADER_OFFSET = -72;

export function SiteShell({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const handleAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as Element).closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor || !anchor.hash) return;
      const target = document.getElementById(anchor.hash.slice(1));
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target, { offset: HEADER_OFFSET });
    };
    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [reduced]);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
