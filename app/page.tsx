import { SiteFooter } from '@/components/site/SiteFooter';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteShell } from '@/components/site/SiteShell';
import { About } from '@/components/sections/About';
import { BookIntro } from '@/components/sections/BookIntro';
import { Hero } from '@/components/sections/Hero';
import { LatestArticles } from '@/components/sections/LatestArticles';
import { SelectedQuotes } from '@/components/sections/SelectedQuotes';
import { SocialLinks } from '@/components/sections/SocialLinks';
import { WhereImFrom } from '@/components/sections/WhereImFrom';

export default function Home() {
  return (
    <SiteShell>
      <SiteHeader />
      <main>
        <Hero />
        <About />
        <WhereImFrom />
        <SocialLinks />
        <BookIntro />
        <SelectedQuotes />
        <LatestArticles />
      </main>
      <SiteFooter />
    </SiteShell>
  );
}
