'use client';

import { useEffect, useState } from 'react';
import { cryptoStats } from '@/data/collections';
import type { CollectionStatsResponse } from '@/app/api/collection-stats/route';
import styles from './CryptoStatsBar.module.css';

function computeLiveStats(data: CollectionStatsResponse) {
  let totalVolume = 0;
  let totalOwners = 0;

  for (const stats of Object.values(data)) {
    totalVolume += stats.volume;
    totalOwners += stats.owners;
  }

  return [
    { value: `${Math.round(totalVolume).toLocaleString('en-US')}+`, label: 'Total Volume (ETH)' },
    { value: cryptoStats[1].value, label: cryptoStats[1].label },
    { value: cryptoStats[2].value, label: cryptoStats[2].label },
    { value: `${totalOwners.toLocaleString('en-US')}+`, label: 'Unique Owners' },
  ];
}

export default function CryptoStatsBar() {
  const [stats, setStats] = useState(cryptoStats);

  useEffect(() => {
    fetch('/api/collection-stats')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && !data.error) setStats(computeLiveStats(data));
      })
      .catch(() => {});
  }, []);

  return (
    <div className={styles.cryptoStatsBar}>
      {stats.map((stat, i) => (
        <div key={i} className={styles.cryptoStat}>
          <div className={styles.cryptoStatValue}>{stat.value}</div>
          <div className={styles.cryptoStatLabel}>{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
