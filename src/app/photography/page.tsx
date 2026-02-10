import type { Metadata } from 'next';
import PhotographySection from '@/components/PhotographySection/PhotographySection';

export const metadata: Metadata = {
  title: 'Photography | Dave Krugman',
  description: 'Commercial, editorial, and street photography by Dave Krugman.',
};

export default function PhotographyPage() {
  return <PhotographySection />;
}
