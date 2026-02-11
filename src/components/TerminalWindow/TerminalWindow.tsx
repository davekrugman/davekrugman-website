import type { ReactNode } from 'react';
import styles from './TerminalWindow.module.css';

interface TerminalWindowProps {
  title: string;
  icon: ReactNode;
  status: 'loading' | 'connected' | 'error';
  children: ReactNode;
  delay?: number;
}

export default function TerminalWindow({ title, icon, status, children, delay = 0 }: TerminalWindowProps) {
  return (
    <div
      className={styles.terminal}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className={styles.terminalHeader}>
        <div className={styles.windowDots}>
          <span className={styles.dot} data-color="red" />
          <span className={styles.dot} data-color="yellow" />
          <span className={styles.dot} data-color="green" />
        </div>
        <div className={styles.headerIcon}>{icon}</div>
        <div className={styles.terminalTitle}>{title}</div>
        <div
          className={`${styles.statusDot} ${styles[status]}`}
          title={status}
        />
      </div>
      <div className={styles.terminalBody}>
        {children}
      </div>
      <div className={styles.terminalFooter}>
        <span className={styles.prompt}>&gt;</span>{' '}
        {status === 'loading' ? 'fetching...' : status === 'error' ? 'disconnected' : 'ready'}
        <span className={styles.cursor}>_</span>
      </div>
    </div>
  );
}
