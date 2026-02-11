import type { SocialPost } from '@/types/social';
import { formatRelativeDate } from './utils';
import styles from './SocialDashboard.module.css';

function proxyUrl(url: string): string {
  return `/api/image-proxy?url=${encodeURIComponent(url)}`;
}

interface ThreadsFeedProps {
  posts: SocialPost[];
}

export default function ThreadsFeed({ posts }: ThreadsFeedProps) {
  return (
    <div className={styles.feedList}>
      {posts.map((post) =>
        post.imageUrl ? (
          <a
            key={post.url}
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.postItemWithImage}
          >
            <div className={styles.postImageLeft}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={proxyUrl(post.imageUrl)} alt="" />
            </div>
            <div className={styles.postTextRight}>
              <div className={styles.postTextRightInner}>
                <div className={styles.postText}>{post.text}</div>
                {post.date && (
                  <div className={styles.postDate}>{formatRelativeDate(post.date)}</div>
                )}
              </div>
            </div>
          </a>
        ) : (
          <a
            key={post.url}
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.postItem}
          >
            <span className={styles.postPrefix}>@</span>
            <div className={styles.postContent}>
              <div className={styles.postText}>{post.text}</div>
              {post.date && (
                <div className={styles.postDate}>{formatRelativeDate(post.date)}</div>
              )}
            </div>
          </a>
        )
      )}
    </div>
  );
}
