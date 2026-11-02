import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import { siteContent } from '@/lib/content';

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
});

const body = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'Morrissey Ward | Author',
  description: siteContent.hero.tagline,
  openGraph: {
    title: 'Morrissey Ward | Author',
    description: siteContent.hero.tagline,
    images: [{ url: '/images/card.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/card.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
