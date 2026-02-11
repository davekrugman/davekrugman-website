import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import SectionHeader from '@/components/SectionHeader/SectionHeader';
import CryptoStatsBar from '@/components/CryptoStatsBar/CryptoStatsBar';
import CollectionsGrid from '@/components/CollectionsGrid/CollectionsGrid';
import styles from './DigitalArtSection.module.css';

export default function DigitalArtSection() {
  return (
    <section id="digital-art" className={styles.digitalArt}>
      <ScrollReveal>
        <SectionHeader label="002 — digital art" title="Digital Art" />
      </ScrollReveal>
      <ScrollReveal>
        <p className={styles.intro}>
          Exploring the boundaries of photography, generative systems, and blockchain provenance. Each collection is a visual thesis — an investigation into the nature of time, light, and digital permanence.
        </p>
      </ScrollReveal>
      <ScrollReveal>
        <CryptoStatsBar />
      </ScrollReveal>
      <ScrollReveal>
        <CollectionsGrid />
      </ScrollReveal>
    </section>
  );
}
