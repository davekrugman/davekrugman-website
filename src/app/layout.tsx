import type { Metadata } from 'next';
import { IBM_Plex_Mono, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import Nav from '@/components/Nav/Nav';
import Footer from '@/components/Footer/Footer';
import '@/styles/globals.css';

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.davekrugman.com'),
  title: 'Dave Krugman | Photographer & Digital Artist',
  description: 'Photographer, writer, and digital artist. Creating work at the intersection of technology and art.',
  openGraph: {
    type: 'website',
    siteName: 'Dave Krugman',
    title: 'Dave Krugman | Photographer & Digital Artist',
    description: 'Photographer, writer, and digital artist. Creating work at the intersection of technology and art.',
    images: [
      {
        url: '/og/headshot.jpg',
        width: 1200,
        height: 800,
        alt: 'Dave Krugman',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@davekrugman',
    images: ['/og/headshot.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${ibmPlexMono.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable}`}>
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
