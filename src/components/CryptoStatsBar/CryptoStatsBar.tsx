import { cryptoStats } from '@/data/collections';
import styles from './CryptoStatsBar.module.css';

export default function CryptoStatsBar() {
  return (
    <div className={styles.cryptoStatsBar}>
      {cryptoStats.map((stat, i) => (
        <div key={i} className={styles.cryptoStat}>
          <div className={styles.cryptoStatValue}>{stat.value}</div>
          <div className={styles.cryptoStatLabel}>{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
