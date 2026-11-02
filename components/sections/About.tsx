import { Reveal } from '@/components/site/Reveal';
import { siteContent } from '@/lib/content';

const { about } = siteContent;

export function About() {
  return (
    <section id="about" className="relative mx-auto max-w-7xl px-6 py-32 lg:px-10 lg:py-40">
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
        <Reveal className="lg:col-span-5">
          <figure className="lg:sticky lg:top-32">
            <div className="relative overflow-hidden">
              <img
                src="/images/image02.jpg"
                alt=""
                loading="lazy"
                className="aspect-[449/522] w-full object-cover transition-transform [transition-duration:1600ms] ease-out hover:scale-[1.03]"
              />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
            </div>
          </figure>
        </Reveal>

        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal>
            <h2 className="font-display text-5xl leading-[1.1] text-ivory md:text-6xl">{about.title}</h2>
          </Reveal>
          <div className="mt-10 space-y-6 text-base leading-[1.5] text-silver-300 md:text-lg">
            {about.paragraphs.map((paragraph) => (
              <Reveal key={paragraph}>
                <p>{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <blockquote className="mt-16 border-l border-gold-400/60 pl-6 font-display text-2xl italic leading-[1.4] text-ivory/90 md:text-3xl">
              {about.dedication}
            </blockquote>
          </Reveal>

          <Reveal className="mt-16">
            <figure className="overflow-hidden">
              <img
                src="/images/image05.jpg"
                alt={about.photoCaption}
                loading="lazy"
                className="aspect-[449/315] w-full object-cover grayscale-[25%] transition-all [transition-duration:1200ms] hover:grayscale-0"
              />
            </figure>
          </Reveal>
        </div>
      </div>

      <Reveal className="mt-32">
        <figure className="relative overflow-hidden">
          <img
            src="/images/image03.jpg"
            alt=""
            loading="lazy"
            className="aspect-[16/7] w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian/60 to-transparent" />
        </figure>
      </Reveal>
    </section>
  );
}
