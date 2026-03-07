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
    try {
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) {
        alert(
          '❌ VAPID public key is not configured. Set NEXT_PUBLIC_VAPID_PUBLIC_KEY in your environment.'
        );
        return;
      }

      let applicationServerKey: Uint8Array;
      try {
        applicationServerKey = urlBase64ToUint8Array(vapidKey);
      } catch {
        alert('❌ Invalid VAPID public key format.');
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
      alert(
        '❌ Błąd podczas subskrypcji na powiadomienia push: ' + String(error)
      );
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
      <p className={styles.unsupported}>
        Twoja przeglądarka nie obsługuje powiadomień push 😕
      </p>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h3 className={styles.title}>🔔 Powiadomienia Push</h3>

        {!!subscription ? (
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
