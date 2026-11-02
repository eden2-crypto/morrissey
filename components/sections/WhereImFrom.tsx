'use client';

import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';
import { LabradorScene } from '@/components/scenes/LabradorScene';
import { SceneCanvas } from '@/components/scenes/SceneCanvas';
import { siteContent } from '@/lib/content';

const { whereImFrom } = siteContent;

export function WhereImFrom() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        progress.current = self.progress;
      },
    });
    return () => trigger.kill();
  }, []);

  return (
    <section
      id="where-im-from"
      ref={sectionRef}
      className="relative isolate min-h-[120svh] overflow-hidden bg-midnight-900"
    >
      <SceneCanvas
        label="The rugged Labrador coastline at dusk, with icebergs drifting in cold ocean water beneath distant mountains"
        fallbackSrc="/images/card.jpg"
        cameraPosition={[0, 4.6, 14]}
        fov={50}
      >
        <LabradorScene progress={progress} />
      </SceneCanvas>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-obsidian via-obsidian/40 to-obsidian" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-obsidian/85 via-obsidian/40 to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[120svh] max-w-7xl flex-col justify-center px-6 py-32 lg:px-10">
        <div className="max-w-2xl">
          <h2 className="font-display text-5xl leading-[1.1] text-ivory md:text-6xl">{whereImFrom.title}</h2>
          <div className="mt-10 space-y-6 text-base leading-[1.5] text-silver-300 md:text-lg">
            {whereImFrom.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
          <figure className="mt-16 border-t border-white/10 pt-10">
            <blockquote className="font-display text-2xl italic leading-[1.4] text-ivory md:text-3xl">
              &ldquo;{whereImFrom.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-6 text-xs uppercase tracking-[0.25em] text-gold-300">
              {whereImFrom.quoteAuthor}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
