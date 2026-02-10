import type { Metadata } from 'next';
import DigitalArtSection from '@/components/DigitalArtSection/DigitalArtSection';

export const metadata: Metadata = {
  title: 'Digital Art | Dave Krugman',
  description: 'On-chain photography collections and digital art by Dave Krugman.',
};

export default function DigitalArtPage() {
  return <DigitalArtSection />;
}
