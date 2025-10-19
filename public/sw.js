self.addEventListener('push', function (event) {
  if (event.data) {
    let data = {};
    try {
      data = event.data.json();
    } catch (e) {
      console.error('Push event JSON parse error', e);
    }

    const options = {
      body: data.body || 'Masz nowe powiadomienie!',
      icon: data.icon || '/icon.png',
      badge: data.badge || '/badge.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || 'https://medicine-sand.vercel.app/',
        dateOfArrival: Date.now(),
        primaryKey: '2',
      },
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Medicine App', options)
    );
  }
});

self.addEventListener('notificationclick', function (event) {
  console.log('Notification click received.');
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
          return clients.openWindow(
            event.notification.data?.url || 'https://medicine-sand.vercel.app/'
          );
        }
      })
  );
});
