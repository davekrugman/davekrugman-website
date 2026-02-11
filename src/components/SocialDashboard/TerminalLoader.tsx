import styles from './SocialDashboard.module.css';

const bootLines = [
  '> initializing feed...',
  '> connecting to rss endpoint...',
  '> parsing xml response...',
  '> rendering posts',
];

export default function TerminalLoader() {
  return (
    <div className={styles.loader}>
      {bootLines.map((line, i) => (
        <div
          key={i}
          className={styles.bootLine}
          style={{ animationDelay: `${i * 0.4}s` }}
        >
          {line}
          {i === bootLines.length - 1 && <span className={styles.loaderCursor}>_</span>}
        </div>
      ))}
    </div>
  );
}
