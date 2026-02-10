import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLeft}>
        <div className={styles.footerName}>Dave Krugman</div>
        <div className={styles.footerCopy}>&copy; 2025 All rights reserved</div>
      </div>
      <div className={styles.footerSocials}>
        <a href="https://instagram.com/dave.krugman" target="_blank" rel="noopener noreferrer">Instagram</a>
        <a href="https://twitter.com/dave_krugman" target="_blank" rel="noopener noreferrer">X</a>
        <a href="https://threads.net/@dave.krugman" target="_blank" rel="noopener noreferrer">Threads</a>
      </div>
      <div className={styles.footerAllships}>
        Founder of <a href="https://allships.co" target="_blank" rel="noopener noreferrer">ALLSHIPS</a>
      </div>
    </footer>
  );
}
