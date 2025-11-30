'use client';

import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';
import { useTranslations } from 'next-intl';

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
        >
          {t('linkedin')}
        </Link>
        {' | '}
        <Link
          href='https://github.com/oleksii-burdeniuk'
          target='_blank'
          rel='noopener noreferrer'
          className={styles.link}
        >
          {t('github')}
        </Link>
      </p>

      <p className={styles.copy}>{t('copyright', { year })}</p>
    </footer>
  );
}
