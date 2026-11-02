import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '@/components/site/Reveal';
import { siteContent } from '@/lib/content';

const { social } = siteContent;

export function SocialLinks() {
  return (
    <section id="connect" className="relative mx-auto max-w-7xl px-6 py-32 lg:px-10">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
        <Reveal className="lg:col-span-5">
          <h2 className="font-display text-4xl leading-[1.15] text-ivory md:text-5xl">{social.title}</h2>
        </Reveal>
        <Reveal className="lg:col-span-6 lg:col-start-7">
          <p className="text-base leading-[1.5] text-silver-300 md:text-lg">{social.paragraph}</p>
        </Reveal>
      </div>

      <ul className="mt-16 grid grid-cols-1 border-t border-white/10 sm:grid-cols-2 lg:grid-cols-3">
        {social.links.map((link) => (
          <li key={link.name} className="border-b border-white/10 sm:odd:border-r lg:border-r lg:last:border-r-0 lg:[&:nth-child(3n)]:border-r-0">
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between px-2 py-10 transition-colors duration-500 hover:bg-white/[0.02] md:px-8"
            >
              <span className="font-display text-3xl text-ivory transition-colors duration-500 group-hover:text-gold-300 md:text-4xl">
                {link.name}
              </span>
              <ArrowUpRight
                className="h-6 w-6 text-silver-400 transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-gold-400"
                strokeWidth={1.25}
                aria-hidden="true"
              />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
