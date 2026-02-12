import type { Metadata } from 'next';
import WritingSection from '@/components/WritingSection/WritingSection';

export const metadata: Metadata = {
  title: 'Writing | Dave Krugman',
  description: 'Thoughts on photography, technology, creativity, and the spaces where they intersect.',
};

export default function WritingPage() {
  return <WritingSection />;
}
