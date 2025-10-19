'use client';

import PushNotificationManager from '../components/pushNotifications/PushNotificationManager';
import styles from './PushNotificationsPage.module.css';

export default function PushNotificationsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>🔔 Powiadomienia Push</h1>
        <p className={styles.description}>
          Włącz powiadomienia, aby otrzymywać ważne alerty z aplikacji{' '}
          <strong>Medicine</strong> — np. przypomnienia o przerwach lub
          nowościach.
        </p>

        <PushNotificationManager />
      </div>
    </div>
  );
}
