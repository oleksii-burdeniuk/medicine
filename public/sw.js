// ------ PWA Service Worker (safe for next-pwa) ------
try {
  importScripts('/sw-version.js');
} catch (_) {
  // Keep fallback for environments where the generated file is missing.
}

// VERSION: generated in public/sw-version.js during prebuild/predev
const CACHE_VERSION =
  (self && self.__SW_CACHE_VERSION__) || `dev-${Date.now()}`;
const STATIC_CACHE = `medicine-static-${CACHE_VERSION}`;
const PAGE_CACHE = `medicine-pages-${CACHE_VERSION}`;
const RUNTIME_CACHE = `medicine-runtime-${CACHE_VERSION}`;

const OFFLINE_URL = '/offline.html';

// Only static assets you want to precache manually
const PRECACHE_ASSETS = [
  '/',
  OFFLINE_URL,
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/manifest.json',
];

// INSTALL
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_ASSETS)),
  );
  self.skipWaiting();
});

// ACTIVATE — clears all old caches EXCEPT workbox
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(
            (cacheName) =>
              ![STATIC_CACHE, PAGE_CACHE, RUNTIME_CACHE].includes(cacheName) &&
              !cacheName.includes('workbox'),
          )
          .map((cacheName) => caches.delete(cacheName)),
      );
    }),
  );

  self.clients.claim();
});

// -------- Fix navigation freezes (important!) -----------
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(event.request.url);

  // Never cache API calls
  if (requestUrl.pathname.startsWith('/api/')) {
    return;
  }

  // HTML pages: network-first with offline fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          const responseClone = networkResponse.clone();
          caches
            .open(PAGE_CACHE)
            .then((cache) => cache.put(event.request, responseClone));
          return networkResponse;
        })
        .catch(async () => {
          const cachedPage = await caches.match(event.request);
          const cachedAppShell = await caches.match('/', {
            ignoreSearch: true,
          });
          return cachedPage || cachedAppShell || caches.match(OFFLINE_URL);
        }),
    );
    return;
  }

  // App assets (including /_next/static/*.css, *.js): cache-first
  if (
    ['style', 'script', 'worker', 'font', 'image'].includes(
      event.request.destination,
    ) ||
    requestUrl.pathname.startsWith('/_next/static/')
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;

        return fetch(event.request).then((networkResponse) => {
          const responseClone = networkResponse.clone();
          caches
            .open(RUNTIME_CACHE)
            .then((cache) => cache.put(event.request, responseClone));
          return networkResponse;
        });
      }),
    );
    return;
  }

  // Other requests: network-first with cache fallback
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        const responseClone = networkResponse.clone();
        caches
          .open(RUNTIME_CACHE)
          .then((cache) => cache.put(event.request, responseClone));
        return networkResponse;
      })
      .catch(() =>
        caches
          .match(event.request)
          .then((res) => res || caches.match(OFFLINE_URL)),
      ),
  );
});

// ------- Push Notifications -------
self.addEventListener('push', function (event) {
  if (event.data) {
    let data = {};
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'Medicine App', body: event.data.text() };
    }

    const options = {
      body: data.body || 'You have a new notification',
      icon: data.icon || '/icons/icon-192x192.png',
      badge: data.badge || '/icons/icon-192x192.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/',
        dateOfArrival: Date.now(),
      },
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Medicine App', options),
    );
  }
});

// ------- Notification Click -------
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data?.url || '/');
        }
      }),
  );
});
