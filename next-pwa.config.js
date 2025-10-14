import withPWA from 'next-pwa';

// 1. PWA-specific options (passed to the next-pwa function call)
const pwaOptions = {
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
    document: '/offline.html',
  },
};

// 2. Wrap the PWA options
const pwaConfig = withPWA(pwaOptions);

/** @type {import('next').NextConfig} */
// 3. Next.js specific options (THIS IS WHERE reactStrictMode BELONGS)
const nextConfig = {
  // FIX: Ensure reactStrictMode is only here, and remove swcMinify
  reactStrictMode: true,
};

// 4. Export the combined configuration
export default pwaConfig(nextConfig);
