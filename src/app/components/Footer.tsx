'use client';

import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';
import { useTranslations } from 'next-intl';
import { Github, Instagram, Linkedin } from 'lucide-react';
import BetaSupportModal from './BetaSupportModal';
import { OPEN_CONSENT_EVENT } from './privacy/consent';

export default function Footer() {
  const t = useTranslations('Footer');
  const year = new Date().getFullYear();
  const appName = 'Medicine';

  return (
    <footer className={styles.footer}>
      <p className={styles.text}>{t('description', { appName })}</p>

      <p className={styles.links}>
        <Link
          href='https://www.linkedin.com/in/oleksii-burdeniuk-9b1b6a22b/'
          target='_blank'
          rel='noopener noreferrer'
          className={styles.link}
          aria-label={t('linkedin')}
          title={t('linkedin')}
        >
          <Linkedin size={24} />
        </Link>
        <Link
          href='https://github.com/oleksii-burdeniuk'
          target='_blank'
          rel='noopener noreferrer'
          className={styles.link}
          aria-label={t('github')}
          title={t('github')}
        >
          <Github size={24} />
        </Link>
        <Link
          href='https://www.instagram.com/olekssiy/'
          target='_blank'
          rel='noopener noreferrer'
          className={styles.link}
          aria-label={t('instagram')}
          title={t('instagram')}
        >
          <Instagram size={24} />
        </Link>
      </p>

      <p className={styles.phoneLine}>
        {t('phoneLabel')}:{' '}
        <a className={styles.link} href='tel:+48798884005'>
          +48 798 884 005
        </a>
      </p>

      <div className={styles.supportWrap}>
        <BetaSupportModal triggerClassName={styles.supportBtn} />
      </div>

      <div className={styles.legalLinks}>
        <Link href='/privacy' className={styles.legalLink}>
          {t('privacy')}
        </Link>
        <button
          type='button'
          className={styles.legalButton}
          onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
        >
          {t('cookieSettings')}
        </button>
      </div>

      <p className={styles.copy}>{t('copyright', { year })}</p>
    </footer>
  );
}
