import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import SectionHeader from '@/components/SectionHeader/SectionHeader';
import ContactForm from '@/components/ContactForm/ContactForm';
import styles from './ContactSection.module.css';

export default function ContactSection() {
  return (
    <section id="contact" className={styles.contact}>
      <ScrollReveal>
        <SectionHeader label="004 — connect" title="Get in Touch" />
      </ScrollReveal>
      <ScrollReveal>
        <ContactForm />
      </ScrollReveal>
    </section>
  );
}
