'use client';

import { useTranslations } from 'next-intl';
import PushNotificationManager from '../components/pushNotifications/PushNotificationManager';
import styles from './PushNotificationsPage.module.css';

export default function PushNotificationsPage() {
  const t = useTranslations('PushNotificationsPage');

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>{t('title')}</h1>
        <p className={styles.description}>{t('description')}</p>

        <PushNotificationManager />
      </div>
    </div>
  );
}
