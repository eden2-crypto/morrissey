'use client';

import { gsap } from 'gsap';
import { ChevronDown } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { EarthScene } from '@/components/scenes/EarthScene';
import { SceneCanvas } from '@/components/scenes/SceneCanvas';
import { siteContent } from '@/lib/content';
import { usePrefersReducedMotion } from '@/lib/use-browser-state';

const { hero } = siteContent;

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      if (!reduced) {
        gsap.from('[data-hero-reveal]', {
          opacity: 0,
          y: 32,
          duration: 1.4,
          stagger: 0.14,
          ease: 'power3.out',
          delay: 0.25,
        });
      }
      gsap.to('[data-hero-earth]', {
        yPercent: 16,
        scale: 1.05,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to(content, {
        opacity: 0,
        y: -48,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top top', end: '70% top', scrub: true },
      });
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative min-h-[100svh] overflow-hidden bg-obsidian"
    >
      <div data-hero-earth className="absolute inset-0">
        <SceneCanvas
          label="A slowly rotating Earth beneath a thin band of atmosphere and distant stars"
          fallbackSrc="/images/bg.jpg"
          cameraPosition={[0, 0, 4.2]}
          fov={40}
        >
          <EarthScene />
        </SceneCanvas>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/75 to-obsidian/10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-obsidian to-transparent" />

      <div
        ref={contentRef}
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-6 pb-28 pt-32 lg:px-10"
      >
        <p data-hero-reveal className="text-xs uppercase tracking-[0.3em] text-gold-300">
          {hero.role}
        </p>
        <h1 data-hero-reveal className="mt-6 font-display text-6xl leading-[1.05] text-ivory sm:text-7xl lg:text-8xl">
          {hero.name}
        </h1>
        <blockquote data-hero-reveal className="mt-8 max-w-2xl border-l border-gold-400/60 pl-6 font-display text-2xl italic leading-[1.3] text-ivory/90 md:text-3xl">
          {hero.tagline}
        </blockquote>
        <div data-hero-reveal className="mt-10 max-w-xl space-y-5 text-base leading-[1.5] text-silver-300">
          {hero.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>
        <a
          data-hero-reveal
          href="#about"
          className="group mt-12 inline-flex w-fit items-center gap-3 text-xs uppercase tracking-[0.25em] text-silver-300 transition-colors hover:text-ivory"
        >
          <span>{hero.cta}</span>
          <ChevronDown className="h-4 w-4 text-gold-400 transition-transform duration-500 group-hover:translate-y-1" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
