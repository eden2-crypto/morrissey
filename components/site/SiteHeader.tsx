'use client';

import { ArrowUpRight, Menu, Orbit, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const NAV_ITEMS = [
  { label: 'About', href: '#about' },
  { label: 'Where I\u2019m From', href: '#where-im-from' },
  { label: 'Connect', href: '#connect' },
  { label: 'Book', href: '#book' },
  { label: 'Quotes', href: '#quotes' },
  { label: 'Articles', href: '#articles' },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled || open ? 'border-b border-white/10 bg-obsidian/85 backdrop-blur-md' : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
        <a href="#top" onClick={() => setOpen(false)} className="group flex items-center gap-3 text-ivory">
          <Orbit className="h-5 w-5 text-gold-400 transition-transform duration-700 group-hover:rotate-180" strokeWidth={1.25} aria-hidden="true" />
          <span className="font-display text-lg tracking-wide">Morrissey Ward</span>
        </a>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-xs uppercase tracking-[0.2em] text-silver-300 transition-colors duration-300 hover:text-ivory">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-ivory transition-colors hover:border-gold-400 lg:hidden"
        >
          {open ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
        </button>
      </div>

      <nav id="mobile-nav" aria-label="Mobile" className={`${open ? 'block' : 'hidden'} border-t border-white/10 bg-obsidian/95 lg:hidden`}>
        <ul className="flex flex-col px-6 py-4">
          {NAV_ITEMS.map((item) => (
            <li key={item.href} className="border-b border-white/5 last:border-none">
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between py-4 font-display text-2xl text-ivory"
              >
                {item.label}
                <ArrowUpRight className="h-4 w-4 text-gold-400" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
