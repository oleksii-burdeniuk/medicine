'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    (async () => {
      try {
        // Unregister previous SWs to avoid conflicts from earlier builds
        const regs = await navigator.serviceWorker.getRegistrations();
        for (const r of regs) await r.unregister();

        const reg = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });
        console.log('[SW] registered', reg);
        reg.addEventListener('updatefound', () =>
          console.log('[SW] updatefound')
        );
        navigator.serviceWorker.addEventListener('controllerchange', () =>
          console.log('[SW] controller changed')
        );
      } catch (err) {
        console.warn('[SW] registration failed', err);
      }
    })();
  }, []);

  return null;
}
