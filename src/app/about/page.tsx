'use client';

import styles from './about.module.css';
import { useTranslations } from 'next-intl';

export default function AboutPage() {
  const t = useTranslations('AboutPage');

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>{t('title')}</h1>

        <p className={styles.text}>{t('description')}</p>

        <h2 className={styles.subtitle}>{t('featuresTitle')}</h2>
        <ul className={styles.list}>
          <li>{t('feature1')}</li>
          <li>{t('feature2')}</li>
          <li>{t('feature3')}</li>
          <li>{t('feature4')}</li>
        </ul>

        <h2 className={styles.subtitle}>{t('usageTitle')}</h2>
        <ol className={styles.steps}>
          <li>{t('step1')}</li>
          <li>{t('step2')}</li>
          <li>{t('step3')}</li>
          <li>{t('step4')}</li>
        </ol>

        <p className={styles.footer}>{t('footer')}</p>
      </div>
    </div>
  );
}
