import withPWA from 'next-pwa';

// Конфігурація PWA
const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offline-cache',
        networkTimeoutSeconds: 10,
        expiration: { maxEntries: 200, maxAgeSeconds: 7 * 24 * 60 * 60 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
  ],
  fallbacks: {
    document: '/offline.html', // 👈 важливо
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

// Експортуємо об'єднану конфігурацію Next.js та PWA
export default pwaConfig(nextConfig);
