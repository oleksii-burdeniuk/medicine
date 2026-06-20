'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cookie } from 'lucide-react';
import { useTranslations } from 'next-intl';
import styles from './CookieConsent.module.css';
import {
  OPEN_CONSENT_EVENT,
  readConsent,
  removeGoogleAnalyticsCookies,
  saveConsent,
  type ConsentChoice,
} from './privacy/consent';

export default function CookieConsent() {
  const t = useTranslations('CookieConsent');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(readConsent() === null);
    const openPreferences = () => setIsOpen(true);
    window.addEventListener(OPEN_CONSENT_EVENT, openPreferences);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, openPreferences);
  }, []);

  const choose = (choice: ConsentChoice) => {
    if (choice === 'essential') removeGoogleAnalyticsCookies();
    saveConsent(choice);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <section
      className={styles.banner}
      role='dialog'
      aria-modal='true'
      aria-labelledby='cookie-title'
      aria-describedby='cookie-description'
    >
      <div className={styles.icon} aria-hidden='true'>
        <Cookie size={24} />
      </div>
      <div className={styles.copy}>
        <h2 id='cookie-title'>{t('title')}</h2>
        <p id='cookie-description'>{t('description')}</p>
        <p className={styles.details}>
          <strong>{t('essentialTitle')}:</strong> {t('essentialDescription')}{' '}
          <strong>{t('analyticsTitle')}:</strong> {t('analyticsDescription')}
        </p>
        <Link href='/privacy' className={styles.policyLink}>
          {t('policyLink')}
        </Link>
      </div>
      <div className={styles.actions}>
        <button
          type='button'
          className={styles.rejectButton}
          onClick={() => choose('essential')}
        >
          {t('reject')}
        </button>
        <button
          type='button'
          className={styles.acceptButton}
          onClick={() => choose('analytics')}
        >
          {t('accept')}
        </button>
      </div>
    </section>
  );
}
