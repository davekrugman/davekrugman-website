'use client';

import { useEffect, useState } from 'react';
import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import SectionHeader from '@/components/SectionHeader/SectionHeader';
import type { SocialPost } from '@/types/social';
import styles from './WritingSection.module.css';

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function WritingSection() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/social-feeds/substack')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.posts) setPosts(data.posts);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const featured = posts[0];
  let rest = posts.slice(1);
  // Preview: duplicate featured into grid when there's only one post
  if (featured && rest.length === 0) {
    rest = [featured, featured];
  }

  return (
    <section className={styles.writing}>
      <ScrollReveal>
        <SectionHeader label="004 — writing" title="Writing" />
      </ScrollReveal>

      <ScrollReveal>
        <p className={styles.intro}>
          Thoughts on photography, technology, creativity, and the spaces where they intersect.
        </p>
      </ScrollReveal>

      {loading && (
        <ScrollReveal>
          <div className={styles.loader}>
            <div className={styles.loaderLine}>$ fetching posts<span className={styles.cursor}>_</span></div>
          </div>
        </ScrollReveal>
      )}

      {!loading && posts.length === 0 && (
        <ScrollReveal>
          <div className={styles.empty}>
            <div className={styles.emptyLine}>$ no posts found</div>
            <div className={styles.emptyHint}>Check back soon — new writing on the way.</div>
          </div>
        </ScrollReveal>
      )}

      {featured && (
        <ScrollReveal>
          <a
            href={featured.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.featuredCard}
          >
            {featured.imageUrl && (
              <div className={styles.featuredImage}>
                <img src={featured.imageUrl} alt="" />
              </div>
            )}
            <div className={styles.featuredContent}>
              <div className={styles.featuredMeta}>
                {featured.date && (
                  <span className={styles.date}>{formatDate(featured.date)}</span>
                )}
                {featured.readingTime && (
                  <span className={styles.readingTime}>{featured.readingTime} min read</span>
                )}
              </div>
              <h2 className={styles.featuredTitle}>{featured.text}</h2>
              {featured.description && (
                <p className={styles.featuredDesc}>{featured.description}</p>
              )}
              <span className={styles.readLink}>Read on Substack →</span>
            </div>
          </a>
        </ScrollReveal>
      )}

      {rest.length > 0 && (
        <ScrollReveal>
          <div className={styles.postGrid}>
            {rest.map((post, i) => (
              <a
                key={i}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.postCard}
              >
                {post.imageUrl && (
                  <div className={styles.postImage}>
                    <img src={post.imageUrl} alt="" />
                  </div>
                )}
                <div className={styles.postContent}>
                  <div className={styles.postMeta}>
                    {post.date && (
                      <span className={styles.date}>{formatDate(post.date)}</span>
                    )}
                    {post.readingTime && (
                      <span className={styles.readingTime}>{post.readingTime} min read</span>
                    )}
                  </div>
                  <h3 className={styles.postTitle}>{post.text}</h3>
                  {post.description && (
                    <p className={styles.postDesc}>{post.description}</p>
                  )}
                  <span className={styles.readLink}>Read on Substack →</span>
                </div>
              </a>
            ))}
          </div>
        </ScrollReveal>
      )}
    </section>
  );
}
