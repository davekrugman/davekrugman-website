import type { Metadata } from 'next';
import ContactSection from '@/components/ContactSection/ContactSection';

export const metadata: Metadata = {
  title: 'Contact | Dave Krugman',
  description: 'Get in touch for photography, editorial, and digital art collaborations.',
};

export default function ContactPage() {
  return <ContactSection />;
}
