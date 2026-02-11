import type { SocialPost } from '@/types/social';
import styles from './SocialDashboard.module.css';

function proxyUrl(url: string): string {
  return `/api/image-proxy?url=${encodeURIComponent(url)}`;
}

interface InstagramFeedProps {
  posts: SocialPost[];
}

export default function InstagramFeed({ posts }: InstagramFeedProps) {
  const hasImages = posts.some((p) => p.imageUrl);

  if (hasImages) {
    return (
      <div className={styles.instaGrid}>
        {posts.map((post) => (
          <a
            key={post.url}
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.instaThumb}
          >
            {post.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={proxyUrl(post.imageUrl)} alt={post.text || 'Instagram post'} className={styles.instaImg} />
            ) : (
              <div className={styles.instaPlaceholder} />
            )}
            <div className={styles.instaOverlay}>
              <span className={styles.instaCaption}>{post.text}</span>
            </div>
          </a>
        ))}
      </div>
    );
  }

  // Text fallback if no images
  return (
    <div className={styles.feedList}>
      {posts.map((post) => (
        <a
          key={post.url}
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.postItem}
        >
          <span className={styles.postPrefix}>#</span>
          <div className={styles.postContent}>
            <div className={styles.postText}>{post.text}</div>
          </div>
        </a>
      ))}
    </div>
  );
}
