'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ExternalLink, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import styles from './TestFlightInvite.module.css';

const TESTFLIGHT_URL = 'https://testflight.apple.com/join/eUXXnWWW';
const DISMISSED_KEY = 'warecode-testflight-invite-v1-dismissed';

export default function TestFlightInvite() {
  const t = useTranslations('TestFlightInvite');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const isIPhone = /iPhone/i.test(navigator.userAgent);
    if (!isIPhone) return;

    try {
      if (localStorage.getItem(DISMISSED_KEY) !== 'true') {
        setIsOpen(true);
      }
    } catch {
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dismiss();
    };
    window.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen]);

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISSED_KEY, 'true');
    } catch {
      // The modal can still be dismissed when storage is unavailable.
    }
    setIsOpen(false);
  };

  const joinTestFlight = () => {
    dismiss();
    window.location.assign(TESTFLIGHT_URL);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={dismiss}>
      <section
        className={styles.modal}
        role='dialog'
        aria-modal='true'
        aria-labelledby='testflight-title'
        aria-describedby='testflight-description'
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type='button'
          className={styles.closeButton}
          onClick={dismiss}
          aria-label={t('close')}
        >
          <X size={22} />
        </button>

        <div className={styles.iconWrap}>
          <Image
            src='/icons/icon-192x192.png'
            alt=''
            width={76}
            height={76}
            className={styles.appIcon}
          />
        </div>

        <p className={styles.eyebrow}>TestFlight</p>
        <h2 id='testflight-title' className={styles.title}>
          {t('title')}
        </h2>
        <p id='testflight-description' className={styles.description}>
          {t('description')}
        </p>

        <button
          type='button'
          className={styles.primaryButton}
          onClick={joinTestFlight}
        >
          <span>{t('join')}</span>
          <ExternalLink size={18} />
        </button>
        <button
          type='button'
          className={styles.secondaryButton}
          onClick={dismiss}
        >
          {t('later')}
        </button>
      </section>
    </div>
  );
}
