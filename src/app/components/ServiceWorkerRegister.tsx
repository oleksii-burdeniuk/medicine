'use client';
import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then((reg) => {
        reg.onupdatefound = () => {
          const newWorker = reg.installing;

          newWorker.onstatechange = () => {
            if (newWorker.state === 'activated') {
              // Якщо це новий SW — перезавантажити сторінку
              if (navigator.serviceWorker.controller) {
                window.location.reload();
              }
            }
          };
        };
      });
    }
  }, []);

  return null;
}
