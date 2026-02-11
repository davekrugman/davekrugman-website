import type { Metadata } from 'next';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import SectionHeader from '@/components/SectionHeader/SectionHeader';
import SocialDashboard from '@/components/SocialDashboard/SocialDashboard';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Feed | Dave Krugman',
  description: 'Live social feed dashboard — latest posts from X, Substack, Threads, and Instagram.',
};

export default function DashboardPage() {
  return (
    <section className={styles.dashboardPage}>
      <ScrollReveal>
        <SectionHeader label="005 — feed" title="Social Dashboard" />
      </ScrollReveal>
      <ScrollReveal>
        <SocialDashboard />
      </ScrollReveal>
    </section>
  );
}
