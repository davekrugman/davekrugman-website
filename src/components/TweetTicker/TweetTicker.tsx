'use client';

import { useEffect, useState } from 'react';
import styles from './TweetTicker.module.css';

interface TweetData {
  text: string | null;
  url: string | null;
  date: string | null;
}

export default function TweetTicker() {
  const [tweet, setTweet] = useState<TweetData | null>(null);

  useEffect(() => {
    fetch('/api/latest-tweet')
      .then((res) => res.json())
      .then((data: TweetData) => {
        if (data.text && data.url) {
          setTweet(data);
        }
      })
      .catch(() => {
        // Silently fail — ticker just won't show
      });
  }, []);

  if (!tweet) return null;

  return (
    <a
      href={tweet.url!}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.ticker}
    >
      <span className={styles.tickerIcon}>
        <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </span>
      <span className={styles.tickerTextWrap}>
        <span className={styles.tickerText}>{tweet.text}</span>
      </span>
    </a>
  );
}
