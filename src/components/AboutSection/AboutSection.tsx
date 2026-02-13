import Image from 'next/image';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import SectionHeader from '@/components/SectionHeader/SectionHeader';
import PressLinks from '@/components/PressLinks/PressLinks';
import styles from './AboutSection.module.css';

export default function AboutSection() {
  return (
    <section id="about">
      <ScrollReveal>
        <SectionHeader label="003 — info" title="About" />
      </ScrollReveal>
      <ScrollReveal>
        <div className={styles.aboutLayout}>
          <div className={styles.aboutImageBlock}>
            <div className={styles.aboutImage}>
              <Image
                src="/images/headshot.jpg"
                alt="Dave Krugman portrait"
                fill
                sizes="(max-width: 968px) 100vw, 50vw"
                quality={85}
                style={{ objectFit: 'cover', objectPosition: 'center 20%' }}
                priority
              />
            </div>
          </div>

          <div className={styles.aboutContent}>
            <h3>Creating work at the intersection of technology and art.</h3>

            <p className={styles.aboutText}>
              Dave Krugman is a New York based Photographer, and is the founder of ALLSHIPS, a Creative Community based on the idea that a rising tide raises all ships. His photography is a study of humanity&#39;s intersection with cities and how people are influenced by their immediate environment. Through his environmental portraiture and candid street photography he works to reveal the beauty at confluences of circumstance. For daily updates, follow his{' '}
              <Link href="https://instagram.com/dave.krugman" target="_blank" rel="noopener noreferrer">Instagram account</Link>, and for longer editorial, his{' '}
              <Link href="https://stories.davekrugman.com" target="_blank" rel="noopener noreferrer">photo essays</Link>.
            </p>

            <div className={styles.connectSection}>
              <div className={styles.connectLabel}>Connect With Me</div>
              <div className={styles.connectSocials}>
                <a href="https://instagram.com/dave.krugman" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="5" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                <a href="https://x.com/davekrugman" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="X">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a href="https://www.threads.net/@dave.krugman" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Threads">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221z" />
                  </svg>
                </a>
                <a href="https://substack.com/@davekrugman" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Substack">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24l9.56-5.39L20.539 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
                  </svg>
                </a>
                <a href="https://www.linkedin.com/in/davejkrugman/" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>

            <PressLinks />
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
