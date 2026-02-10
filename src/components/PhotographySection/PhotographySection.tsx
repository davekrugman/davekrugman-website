import Link from 'next/link';
import Image from 'next/image';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import SectionHeader from '@/components/SectionHeader/SectionHeader';
import { getProjects } from '@/data/photography';
import styles from './PhotographySection.module.css';

export default function PhotographySection() {
  const projects = getProjects();

  return (
    <section id="photography">
      <ScrollReveal>
        <SectionHeader label="001 — work" title="Photography" />
      </ScrollReveal>

      <div className={styles.projectGrid}>
        {projects.map((project) => (
          <ScrollReveal key={project.slug}>
            <Link
              href={`/photography/${project.slug}`}
              className={styles.projectCard}
            >
              <div className={styles.projectImageWrap}>
                <Image
                  src={project.thumbnail}
                  alt={project.title}
                  fill
                  sizes="(max-width: 600px) 100vw, (max-width: 968px) 50vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className={styles.projectOverlay}>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <span className={styles.projectCount}>
                  {project.imageCount} works
                </span>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
