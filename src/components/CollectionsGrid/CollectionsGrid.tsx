'use client';

import { useEffect, useState } from 'react';
import CollectionCard from '@/components/CollectionCard/CollectionCard';
import { collections } from '@/data/collections';
import type { CollectionStatsResponse } from '@/app/api/collection-stats/route';
import styles from '../DigitalArtSection/DigitalArtSection.module.css';

export default function CollectionsGrid() {
  const [liveStats, setLiveStats] = useState<CollectionStatsResponse | null>(null);

  useEffect(() => {
    fetch('/api/collection-stats')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && !data.error) setLiveStats(data);
      })
      .catch(() => {});
  }, []);

  return (
    <div className={styles.collectionsGrid}>
      {collections.map((collection) => (
        <CollectionCard
          key={collection.id}
          collection={collection}
          liveStats={liveStats?.[collection.id]}
        />
      ))}
    </div>
  );
}
