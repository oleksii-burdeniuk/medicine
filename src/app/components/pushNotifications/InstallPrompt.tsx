'use client';

import { useEffect, useState } from 'react';
import PushNotificationManager from './PushNotificationManager';
import styles from './installPrompt.module.css';

function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
        !window.hasOwnProperty('MSStream')
    );
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);
  }, []);

  if (isStandalone) return null;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h3 className={styles.title}>📲 Zainstaluj aplikację</h3>
        <p className={styles.text}>
          Dodaj <strong>WareCode</strong> do ekranu głównego, aby mieć
          szybki dostęp — nawet bez internetu!
        </p>

        <button className={styles.installButton}>
          ➕ Dodaj do ekranu głównego
        </button>

        {isIOS && (
          <p className={styles.iosHint}>
            Aby zainstalować na urządzeniu <strong>iPhone</strong> lub{' '}
            <strong>iPad</strong>, kliknij przycisk
            <span className={styles.icon}> ⎋ </span> (Udostępnij), a następnie
            wybierz <strong>„Dodaj do ekranu głównego”</strong>{' '}
            <span className={styles.icon}>➕</span>.
          </p>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <div>
      <PushNotificationManager />
      <InstallPrompt />
    </div>
  );
}
