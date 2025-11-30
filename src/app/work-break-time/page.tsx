'use client';

import styles from './workBreakTime.module.css';
import { useTranslations } from 'next-intl';

export default function WorkBreakTimePage() {
  const t = useTranslations('WorkBreakTimePage');

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>{t('title')}</h1>

        <p
          className={styles.text}
          dangerouslySetInnerHTML={{ __html: t('description') }}
        />

        <div className={styles.shift}>
          <h2 className={styles.subtitle}>{t('firstShift')}</h2>
          <p className={styles.schedule}>{t('firstShiftHours')}</p>
          <ul className={styles.list}>
            <li>{t('firstShiftBreak1')}</li>
            <li>{t('firstShiftBreak2')}</li>
          </ul>
        </div>

        <div className={styles.shift}>
          <h2 className={styles.subtitle}>{t('secondShift')}</h2>
          <p className={styles.schedule}>{t('secondShiftHours')}</p>
          <ul className={styles.list}>
            <li>{t('secondShiftBreak1')}</li>
            <li>{t('secondShiftBreak2')}</li>
          </ul>
        </div>

        <p className={styles.footer}>{t('footer')}</p>
      </div>
    </div>
  );
}
