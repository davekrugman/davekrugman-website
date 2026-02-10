import type { Metadata } from 'next';
import DisableCRT from '@/components/DisableCRT/DisableCRT';
import AboutSection from '@/components/AboutSection/AboutSection';

export const metadata: Metadata = {
  title: 'About | Dave Krugman',
  description: 'New York City-based photographer, writer, and digital artist.',
};

export default function AboutPage() {
  return (
    <>
      <DisableCRT />
      <AboutSection />
    </>
  );
}
