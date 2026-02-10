'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './Nav.module.css';

const navItems = [
  { href: '/photography', label: 'Photography' },
  { href: '/digital-art', label: 'Digital Art' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isPhoto = pathname === '/' || pathname === '/photography';
  const isCrypto = pathname === '/digital-art';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={styles.nav}
      style={{ borderBottomColor: scrolled ? 'var(--border-bright)' : 'var(--border)' }}
    >
      <Link href="/" className={styles.navLogo}>
        DAVE KRUGMAN
      </Link>

      <ul className={`${styles.navLinks} ${menuOpen ? styles.navLinksOpen : ''}`}>
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`${styles.navLink} ${pathname === item.href ? styles.navLinkActive : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          </li>
        ))}
        <li>
          <div className={styles.modeToggle}>
            <button
              className={`${styles.modeBtn} ${isPhoto ? styles.modeBtnActive : ''}`}
              onClick={() => router.push('/photography')}
            >
              Photo
            </button>
            <button
              className={`${styles.modeBtn} ${isCrypto ? styles.modeBtnActive : ''}`}
              onClick={() => router.push('/digital-art')}
            >
              Digital
            </button>
          </div>
        </li>
      </ul>

      <button
        className={styles.hamburger}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu"
      >
        <span className={styles.hamburgerLine}></span>
        <span className={styles.hamburgerLine}></span>
        <span className={styles.hamburgerLine}></span>
      </button>
    </nav>
  );
}
