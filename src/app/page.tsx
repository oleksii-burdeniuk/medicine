import { getTranslations } from 'next-intl/server';

import styles from './page.module.css';

import Link from 'next/link';
import BarCodeContent from './components/barCodePage/BarCodeContent';

export default async function BarcodePage() {
  const t = await getTranslations('HomePage');
  return (
    <div>
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>{t('title')}</h1>
          <BarCodeContent />
        </div>
      </div>
      <Link
        href='./colors'
        target='_self'
        rel='noopener noreferrer'
        className={styles.colorBtn}
        aria-label={t('colorsButtonAria')}
      >
        <svg
          className={styles.paletteIcon}
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'
        >
          <circle cx='12' cy='6' r='4' fill='#ff595e' />
          <circle cx='6' cy='14' r='4' fill='#8ac926' />
          <circle cx='18' cy='14' r='4' fill='#1982c4' />
          <circle cx='12' cy='18' r='4' fill='#ffca3a' />
        </svg>
      </Link>
    </div>
  );
}
