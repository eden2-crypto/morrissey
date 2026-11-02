import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '@/components/site/Reveal';
import { siteContent } from '@/lib/content';

const { articles } = siteContent;

export function LatestArticles() {
  return (
    <section id="articles" className="relative border-t border-white/10 bg-midnight-900 py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal>
          <h2 className="font-display text-5xl leading-[1.1] text-ivory md:text-6xl">{articles.title}</h2>
        </Reveal>

        <ul className="mt-20 divide-y divide-white/10 border-y border-white/10">
          {articles.items.map((article, index) => (
            <li key={index} className="group py-14 transition-colors duration-500 hover:bg-white/[0.02] md:px-6">
              <Reveal className="grid gap-8 md:grid-cols-12 md:gap-12">
                <div className="space-y-6 md:col-span-8">
                  {article.title && (
                    <h3 className="font-display text-3xl leading-[1.2] text-ivory md:text-4xl">{article.title}</h3>
                  )}
                  {article.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)} className="text-base leading-[1.5] text-silver-300 md:text-lg">
                      {paragraph}
                    </p>
                  ))}
                  {'footnote' in article && article.footnote && (
                    <p className="text-sm uppercase tracking-[0.18em] text-silver-400">{article.footnote}</p>
                  )}
                </div>

                {article.href && (
                  <div className="flex md:col-span-4 md:justify-end md:self-start">
                    <a
                      href={article.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 rounded-full border border-white/20 px-6 py-3 text-xs font-medium uppercase tracking-[0.2em] text-ivory transition-colors duration-300 hover:border-gold-400 hover:text-gold-300"
                    >
                      Read Article
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                    </a>
                  </div>
                )}
              </Reveal>
            </li>
          ))}
        </ul>

      </div>
    </section>
  );
}
