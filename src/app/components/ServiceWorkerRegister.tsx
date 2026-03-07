'use client';
import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) {
      return;
    }

    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        reg.onupdatefound = () => {
          const newWorker = reg.installing;
          if (!newWorker) return;

          newWorker.onstatechange = () => {
            if (
              newWorker.state === 'activated' &&
              navigator.serviceWorker.controller
            ) {
              window.location.reload();
            }
          };
        };
      })
      .catch((error) => {
        console.error('Service worker registration failed:', error);
      });
  }, []);

  return null;
}
