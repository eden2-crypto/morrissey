'use client';

import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { BookScene } from '@/components/scenes/BookScene';
import { SceneCanvas } from '@/components/scenes/SceneCanvas';
import { Reveal } from '@/components/site/Reveal';
import { siteContent } from '@/lib/content';

const { book } = siteContent;

export function BookIntro() {
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
    <section id="book" ref={sectionRef} className="relative overflow-hidden border-t border-white/10 bg-midnight-900 py-32 lg:py-40">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-12 lg:gap-12 lg:px-10">
        <Reveal className="relative h-[70svh] min-h-[460px] lg:col-span-7">
          <SceneCanvas
            label="The Coming Of Age Of Humanity book, rendered in 3D. Drag to rotate the book."
            fallbackSrc={book.cover}
            fallbackClassName="object-contain p-10 opacity-100"
            cameraPosition={[0, 0, 5.4]}
            fov={34}
          >
            <BookScene progress={progress} coverSrc={book.cover} />
          </SceneCanvas>
          <p className="pointer-events-none absolute bottom-0 left-0 text-xs uppercase tracking-[0.25em] text-silver-400">
            Drag to rotate
          </p>
        </Reveal>

        <Reveal delay={0.15} className="lg:col-span-4 lg:col-start-9">
          <h2 className="font-display text-4xl leading-[1.15] text-ivory md:text-5xl">{book.title}</h2>
          <p className="mt-5 font-display text-2xl italic leading-[1.3] text-silver-300">{book.subtitle}</p>

          <p className="mt-10 text-xs font-medium uppercase tracking-[0.22em] text-gold-300">{book.availability}</p>
          <ul className="mt-5 flex flex-col gap-3 text-sm uppercase tracking-[0.18em] text-ivory/90">
            {book.formats.map((format) => (
              <li key={format} className="flex items-center gap-3 border-b border-white/10 pb-3">
                {format}
              </li>
            ))}
          </ul>

          <div className="mt-12 flex flex-col gap-4 sm:flex-row">
            {book.actions.map((action, index) => (
              <a
                key={action.href}
                href={action.href}
                className={`group inline-flex items-center justify-center gap-3 rounded-full px-7 py-3.5 text-xs font-medium uppercase tracking-[0.2em] transition-colors duration-300 ${
                  index === 0
                    ? 'bg-ivory text-obsidian hover:bg-gold-300'
                    : 'border border-white/25 text-ivory hover:border-gold-400 hover:text-gold-300'
                }`}
              >
                {action.label}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
