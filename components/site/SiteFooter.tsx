export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-obsidian">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-12 sm:flex-row sm:items-center lg:px-10">
        <p className="font-display text-xl text-ivory">Morrissey Ward</p>
        <a
          href="#top"
          className="text-xs uppercase tracking-[0.25em] text-silver-300 transition-colors hover:text-gold-300"
        >
          Back to top
        </a>
      </div>
    </footer>
  );
}
