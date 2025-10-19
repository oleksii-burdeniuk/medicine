// Service Worker for Medicine PWA
// - Caches core assets and offline fallback
// - Handles push notifications and notification clicks

const CACHE_NAME = 'medicine-core-v1';
const OFFLINE_URL = '/offline.html';
const PRECACHE_ASSETS = [
  OFFLINE_URL,
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/manifest.json',
  '/',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Clear old caches if any
      const keys = await caches.keys();
      await Promise.all(
        keys.map((k) =>
          k !== CACHE_NAME ? caches.delete(k) : Promise.resolve()
        )
      );
      await self.clients.claim();
    })()
  );
});

// Navigation fallback: try network first, fallback to cached offline page
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  let url;
  try {
    url = new URL(request.url);
  } catch (e) {
    // If URL can't be parsed, fallback to default
    return;
  }

  // Don't try to handle chrome-extension or other unsupported schemes
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Let Next.js static files be handled by the network/browser to avoid MIME issues
  if (url.pathname.startsWith('/_next/')) {
    event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)));
    return;
  }

  // Only handle same-origin requests; avoid caching cross-origin resources here
  if (url.origin !== self.location.origin) {
    event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)));
    return;
  }

  // Handle navigation (HTML) requests: network-first, fallback to offline page
  if (
    request.mode === 'navigate' ||
    (request.headers.get('accept') || '').includes('text/html')
  ) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Optionally update cache with fresh HTML, but guard caching
          try {
            const cloned = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              // cache only same-origin http(s) navigations
              cache.put(request, cloned).catch(() => {});
            });
          } catch (e) {}
          return response;
        })
        .catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // For other GET requests: try cache first, then network. If both fail, return network error
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((res) => {
          // Cache successful same-origin basic responses
          try {
            if (res && res.status === 200 && res.type === 'basic') {
              const clone = res.clone();
              caches.open(CACHE_NAME).then((cache) => {
                // Guard cache.put to prevent caching unsupported schemes
                cache.put(request, clone).catch(() => {});
              });
            }
          } catch (e) {
            // ignore
          }
          return res;
        })
        .catch(() => {
          // Don't return the HTML offline page for CSS/JS/images — return a network error so the browser
          // doesn't try to interpret HTML as script/style (which causes MIME type errors).
          return Response.error();
        });
    })
  );
});

// --- Push notification handlers (preserve existing behavior) ---
self.addEventListener('push', function (event) {
  if (event.data) {
    let data = {};
    try {
      data = event.data.json();
    } catch (e) {
      // If payload isn't JSON, fallback to text
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
        primaryKey: data.primaryKey || '2',
      },
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Medicine App', options)
    );
  }
});

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
      })
  );
});
