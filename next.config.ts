// next.config.mjs

import createNextIntlPlugin from 'next-intl/plugin';
// 1. Імпортуємо плагін next-pwa
import withPWA from 'next-pwa';
// 2. Імпортуємо вашу конфігурацію
import pwaConfig from './next-pwa.config.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... ваш основний контент конфігурації
  async headers() {
    return [
      // ... ваші заголовки, включаючи sw.js
    ];
  },
};

// 3. Обгортаємо nextConfig плагіном PWA, передаючи конфігурацію
const pwaMiddleware = withPWA(pwaConfig)(nextConfig);

// 4. Обгортаємо результат плагіном next-intl
export default createNextIntlPlugin()(pwaMiddleware);
