'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  subscribeUser,
  unsubscribeUser,
  sendNotification,
} from '../../actions';
import styles from './pushNotificationManager.module.css';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function PushNotificationManager() {
  const t = useTranslations('PushNotificationManager');
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [message, setMessage] = useState('');

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    });
    const sub = await registration.pushManager.getSubscription();
    setSubscription(sub);
  }

  async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready;
    try {
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) {
        alert(t('vapidMissing'));
        return;
      }

      let applicationServerKey: Uint8Array;
      try {
        applicationServerKey = urlBase64ToUint8Array(vapidKey);
      } catch {
        alert(t('vapidInvalid'));
        return;
      }

      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey as unknown as BufferSource,
      });
      setSubscription(sub);
      const serializedSub = JSON.parse(JSON.stringify(sub));
      await subscribeUser(serializedSub);
    } catch (error) {
      console.error('Push subscription error', error);
      alert(t('subscribeError', { error: String(error) }));
    }
  }

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe();
    setSubscription(null);
    await unsubscribeUser();
  }

  async function sendTestNotification() {
    if (subscription) {
      const serializedSub = JSON.parse(JSON.stringify(subscription));
      await sendNotification(message, serializedSub);
      setMessage('');
    }
  }

  if (!isSupported) {
    return (
      <p className={styles.unsupported}>{t('unsupported')}</p>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h3 className={styles.title}>{t('title')}</h3>

        {!!subscription ? (
          <>
            <p className={styles.info}>{t('subscribedInfo')}</p>
            <div className={styles.actions}>
              <input
                type='text'
                placeholder={t('messagePlaceholder')}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={styles.input}
              />
              <button
                onClick={sendTestNotification}
                className={styles.primaryButton}
              >
                {t('sendTest')}
              </button>
              <button
                onClick={unsubscribeFromPush}
                className={styles.dangerButton}
              >
                {t('unsubscribe')}
              </button>
            </div>
          </>
        ) : (
          <>
            <p className={styles.info}>{t('notSubscribedInfo')}</p>
            <button
              id='subscribeToPush'
              onClick={subscribeToPush}
              className={styles.primaryButton}
            >
              {t('subscribe')}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
