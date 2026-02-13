import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import DisableCRT from '@/components/DisableCRT/DisableCRT';
import Lightbox from '@/components/Lightbox/Lightbox';
import { getProjects, getProject } from '@/data/photography';
import styles from './page.module.css';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: 'Not Found' };
  return {
    title: `${project.title} | Dave Krugman`,
    description: `${project.title} — a photography project by Dave Krugman. ${project.imageCount} works.`,
    openGraph: {
      title: `${project.title} | Dave Krugman`,
      description: `${project.title} — a photography project by Dave Krugman. ${project.imageCount} works.`,
      images: [
        {
          url: `/og/photography/${slug}.jpg`,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} | Dave Krugman`,
      images: [`/og/photography/${slug}.jpg`],
    },
  };
}

export default async function ProjectGalleryPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <section id="gallery">
      <DisableCRT />
      <ScrollReveal>
        <div className={styles.galleryHeader}>
          <Link href="/photography" className={styles.backLink}>
            <span className={styles.backArrow}>←</span> Back to Photography
          </Link>
          <h1 className={styles.galleryTitle}>{project.title}</h1>
          <div className={styles.galleryMeta}>
            {project.imageCount} works
          </div>
        </div>
      </ScrollReveal>

      <Lightbox images={project.images} projectTitle={project.title}>
        <div className={styles.gallery}>
          {project.images.map((src, i) => (
            <div key={src} className={styles.galleryItem} data-lightbox-index={i}>
              <Image
                src={src}
                alt={`${project.title} — ${i + 1}`}
                width={1600}
                height={1200}
                sizes="(max-width: 600px) 100vw, (max-width: 968px) 50vw, 50vw"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
                quality={85}
              />
            </div>
          ))}
        </div>
      </Lightbox>
    </section>
  );
}
