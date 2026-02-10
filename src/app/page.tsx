import Hero from '@/components/Hero/Hero';
import AboutSection from '@/components/AboutSection/AboutSection';
import PhotographySection from '@/components/PhotographySection/PhotographySection';
import DigitalArtSection from '@/components/DigitalArtSection/DigitalArtSection';
import ContactSection from '@/components/ContactSection/ContactSection';

export default function Home() {
  return (
    <>
      <Hero />
      <AboutSection />
      <PhotographySection />
      <DigitalArtSection />
      <ContactSection />
    </>
  );
}
