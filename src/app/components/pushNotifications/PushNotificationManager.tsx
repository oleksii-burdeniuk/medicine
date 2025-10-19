'use client';

import { useState, useEffect } from 'react';
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
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    });
    setSubscription(sub);
    const serializedSub = JSON.parse(JSON.stringify(sub));
    await subscribeUser(serializedSub);
  }

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe();
    setSubscription(null);
    await unsubscribeUser();
  }

  async function sendTestNotification() {
    if (subscription) {
      await sendNotification(message);
      setMessage('');
    }
  }

  if (!isSupported) {
    return (
      <p className={styles.unsupported}>
        Twoja przeglądarka nie obsługuje powiadomień push 😕
      </p>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h3 className={styles.title}>🔔 Powiadomienia Push</h3>

        {subscription ? (
          <>
            <p className={styles.info}>
              Jesteś subskrybowany na powiadomienia push.
            </p>
            <div className={styles.actions}>
              <input
                type='text'
                placeholder='Wpisz wiadomość testową'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={styles.input}
              />
              <button
                onClick={sendTestNotification}
                className={styles.primaryButton}
              >
                Wyślij testowe powiadomienie
              </button>
              <button
                onClick={unsubscribeFromPush}
                className={styles.dangerButton}
              >
                Anuluj subskrypcję
              </button>
            </div>
          </>
        ) : (
          <>
            <p className={styles.info}>
              Nie jesteś jeszcze zapisany na powiadomienia push.
            </p>
            <button
              id='subscribeToPush'
              onClick={subscribeToPush}
              className={styles.primaryButton}
            >
              Subskrybuj
            </button>
          </>
        )}
      </div>
    </div>
  );
}
