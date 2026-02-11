import Image from 'next/image';
import type { Collection } from '@/data/collections';
import styles from './CollectionCard.module.css';

interface LiveStats {
  floor: number;
  volume: number;
  owners: number;
}

interface StatWithLink {
  value: string;
  label: string;
  href?: string;
}

interface CollectionCardProps {
  collection: Collection;
  liveStats?: LiveStats;
}

function formatStat(value: number, decimals: number = 2): string {
  if (value === 0) return '—';
  if (value >= 1000) return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
  if (value >= 100) return value.toFixed(1);
  if (value >= 1) return value.toFixed(decimals);
  return value.toPrecision(3);
}

function buildStats(collection: Collection, live?: LiveStats): StatWithLink[] {
  if (!live || !collection.openseaSlug) return collection.stats;

  const stats: StatWithLink[] = [];
  const floorUrl = `https://opensea.io/collection/${collection.openseaSlug}?sortBy=UNIT_PRICE&sortDirection=ASC`;

  if (live.floor > 0) {
    stats.push({ value: formatStat(live.floor, 4), label: 'Floor (ETH)', href: floorUrl });
  }

  if (live.volume > 0) {
    stats.push({ value: formatStat(live.volume), label: 'Vol (ETH)' });
  }

  if (live.owners > 0) {
    stats.push({ value: live.owners.toLocaleString(), label: 'Owners' });
  }

  for (const stat of collection.stats) {
    const isLiveLabel = ['Floor (ETH)', 'Vol (ETH)', 'Owners'].includes(stat.label);
    if (!isLiveLabel) {
      stats.push(stat);
    }
  }

  return stats.length > 0 ? stats : collection.stats;
}

export default function CollectionCard({ collection, liveStats }: CollectionCardProps) {
  const stats = buildStats(collection, liveStats);

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
          {stats.map((stat, i) =>
            stat.href ? (
              <a
                key={i}
                href={stat.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.stat} ${styles.statLink}`}
              >
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </a>
            ) : (
              <div key={i} className={styles.stat}>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ),
          )}
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
