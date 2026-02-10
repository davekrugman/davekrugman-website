'use client';

import { useState } from 'react';
import { pressItems } from '@/data/press';
import styles from './PressLinks.module.css';

export default function PressLinks() {
  const [showAll, setShowAll] = useState(false);

  const featured = pressItems.filter((item) => item.featured);
  const rest = pressItems.filter((item) => !item.featured);
  const visible = showAll ? pressItems : featured;

  return (
    <div className={styles.pressSection}>
      <div className={styles.pressLabel}>Select Press &amp; Features</div>
      <div className={styles.pressList}>
        {visible.map((item) => (
          <a
            key={item.url}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.pressTag}
          >
            {item.label}
          </a>
        ))}
        {rest.length > 0 && (
          <button
            className={styles.showAllBtn}
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less ↑' : `+ ${rest.length} More`}
          </button>
        )}
      </div>
    </div>
  );
}
