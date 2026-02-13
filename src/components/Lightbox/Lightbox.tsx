'use client';

import { useState, useEffect, useCallback, useRef, type ReactNode, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import styles from './Lightbox.module.css';

interface LightboxProps {
  images: string[];
  projectTitle: string;
  children: ReactNode;
}

const SWIPE_THRESHOLD = 50;

export default function Lightbox({ images, projectTitle, children }: LightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const isOpen = activeIndex !== null;
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Wait for client mount before portaling
  useEffect(() => setMounted(true), []);

  const close = useCallback(() => setActiveIndex(null), []);

  const prev = useCallback(() => {
    setActiveIndex((i) => (i !== null ? (i - 1 + images.length) % images.length : null));
  }, [images.length]);

  const next = useCallback(() => {
    setActiveIndex((i) => (i !== null ? (i + 1) % images.length : null));
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    }

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, close, prev, next]);

  // Touch swipe navigation
  useEffect(() => {
    if (!isOpen) return;

    function handleTouchStart(e: TouchEvent) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    }

    function handleTouchEnd(e: TouchEvent) {
      if (touchStartX.current === null || touchStartY.current === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const dy = e.changedTouches[0].clientY - touchStartY.current;
      touchStartX.current = null;
      touchStartY.current = null;

      if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dy) > Math.abs(dx)) return;

      if (dx < 0) next();
      else prev();
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isOpen, prev, next]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  function handleGalleryClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const item = target.closest('[data-lightbox-index]') as HTMLElement | null;
    if (!item) return;

    const index = parseInt(item.dataset.lightboxIndex || '', 10);
    if (!isNaN(index) && index >= 0 && index < images.length) {
      setActiveIndex(index);
    }
  }

  function handleOverlayClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      close();
    }
  }

  const overlay = isOpen ? (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      {images.length > 1 && (
        <>
          <button
            className={`${styles.nav} ${styles.prev}`}
            onClick={prev}
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            className={`${styles.nav} ${styles.next}`}
            onClick={next}
            aria-label="Next image"
          >
            ›
          </button>
        </>
      )}

      <div className={styles.imageWrap}>
        <Image
          className={styles.lightboxImage}
          src={images[activeIndex]}
          alt={`${projectTitle} — ${activeIndex + 1}`}
          width={3840}
          height={2560}
          quality={80}
          sizes="100vw"
          priority
        />
        <button className={styles.close} onClick={close} aria-label="Close lightbox">
          ×
        </button>
      </div>

      <div className={styles.counter}>
        {activeIndex + 1} / {images.length}
      </div>
    </div>
  ) : null;

  return (
    <>
      <div onClick={handleGalleryClick}>
        {children}
      </div>

      {mounted && overlay && createPortal(overlay, document.body)}
    </>
  );
}
