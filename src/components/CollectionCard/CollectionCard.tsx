import Image from 'next/image';
import type { Collection } from '@/data/collections';
import styles from './CollectionCard.module.css';

interface CollectionCardProps {
  collection: Collection;
}

export default function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <div className={styles.collectionCard}>
      <a
        href={collection.links[0]?.url || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.collectionPreview}
      >
        <Image
          src={collection.image}
          alt={collection.imageAlt}
          fill
          sizes="(max-width: 600px) 100vw, (max-width: 968px) 50vw, 340px"
          style={{ objectFit: 'cover', transition: 'transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)' }}
        />
      </a>
      <div className={styles.collectionInfo}>
        <div className={styles.collectionTag}>{collection.tag}</div>
        <div className={styles.collectionName}>{collection.name}</div>
        <div className={styles.collectionDesc}>{collection.description}</div>
        <div className={styles.collectionStats}>
          {collection.stats.map((stat, i) => (
            <div key={i} className={styles.stat}>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
        <div className={styles.collectionLinks}>
          {collection.links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.collectionLink}
            >
              {link.label} &rarr;
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
