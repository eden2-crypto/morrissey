'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { QuotesUniverseScene } from '@/components/scenes/QuotesUniverseScene';
import { SceneCanvas } from '@/components/scenes/SceneCanvas';
import { siteContent } from '@/lib/content';

const { quotes } = siteContent;
const chapters = quotes.chapters;

export function SelectedQuotes() {
  const [selected, setSelected] = useState(0);
  const chapter = chapters[selected];
  const goTo = (index: number) => setSelected((index + chapters.length) % chapters.length);

  return (
    <section id="quotes" className="relative bg-obsidian">
      <div className="relative h-[64svh] min-h-[460px] overflow-hidden">
        <SceneCanvas
          label="A helix of glowing chapter stars. Select a chapter to bring its quotations forward."
          fallbackSrc="/images/bg.jpg"
          cameraPosition={[0, 0, 7]}
          fov={40}
        >
          <QuotesUniverseScene count={chapters.length} selected={selected} onSelect={setSelected} />
        </SceneCanvas>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-obsidian to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-obsidian to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-6 pb-12 lg:px-10">
          <h2 className="font-display text-4xl leading-[1.15] text-ivory md:text-6xl">{quotes.title}</h2>
          <p className="mt-5 max-w-3xl text-base leading-[1.5] text-silver-300 md:text-lg">{quotes.subtitle}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => goTo(selected - 1)}
            aria-label="Previous chapter"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 text-ivory transition-colors hover:border-gold-400 hover:text-gold-300"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <nav aria-label="Book chapters" className="min-w-0 flex-1">
            <ul className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {chapters.map((item, index) => {
                const active = index === selected;
                return (
                  <li key={item.label}>
                    <button
                      type="button"
                      onClick={() => setSelected(index)}
                      aria-pressed={active}
                      className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs uppercase tracking-[0.18em] transition-colors duration-300 ${
                        active
                          ? 'border-gold-400 bg-gold-400/10 text-gold-300'
                          : 'border-white/15 text-silver-300 hover:border-white/40 hover:text-ivory'
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
          <button
            type="button"
            onClick={() => goTo(selected + 1)}
            aria-label="Next chapter"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 text-ivory transition-colors hover:border-gold-400 hover:text-gold-300"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div aria-live="polite" className="mt-16 min-h-[320px] border-t border-white/10 pt-14">
          <AnimatePresence mode="wait">
            <motion.article
              key={selected}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-xs uppercase tracking-[0.25em] text-gold-300">{chapter.label}</p>
              <h3 className="mt-4 font-display text-3xl uppercase tracking-wide text-ivory md:text-4xl">{chapter.title}</h3>
              <ul className="mt-12 space-y-10">
                {chapter.quotes.map((quote) => (
                  <li key={quote} className="border-l border-gold-400/50 pl-6 md:pl-8">
                    <blockquote className="font-display text-2xl italic leading-[1.4] text-ivory/95 md:text-3xl">
                      &ldquo;{quote}&rdquo;
                    </blockquote>
                  </li>
                ))}
              </ul>
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="mt-20 flex flex-col gap-3 border-t border-white/10 pt-12">
          <p className="text-xs uppercase tracking-[0.25em] text-gold-300">Conclusion</p>
          <p className="font-display text-2xl italic text-ivory/90">{quotes.conclusion}</p>
        </div>
      </div>
    </section>
  );
}
