import type { SocialPost } from '@/types/social';
import { formatRelativeDate } from './utils';
import styles from './SocialDashboard.module.css';

interface SubstackFeedProps {
  posts: SocialPost[];
}

export default function SubstackFeed({ posts }: SubstackFeedProps) {
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
          <span className={styles.postPrefix}>$</span>
          <div className={styles.postContent}>
            <div className={styles.postTitle}>{post.text}</div>
            {post.description && (
              <div className={styles.postDescription}>{post.description}</div>
            )}
            {post.date && (
              <div className={styles.postDate}>{formatRelativeDate(post.date)}</div>
            )}
          </div>
        </a>
      ))}
    </div>
  );
}
