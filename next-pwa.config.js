// next-pwa.config.mjs
import runtimeCaching from 'next-pwa/cache.js';

const config = {
  dest: 'public',
  register: true,
  skipWaiting: true,

  // ВАЖЛИВО: вимикаємо SW у dev-режимі
  disable: process.env.NODE_ENV === 'development',

  // Вказуємо що НЕ треба включати у SW
  buildExcludes: [/middleware-manifest\.json$/, /_middleware\.js$/],

  // Стандартні стратегії кешування
  runtimeCaching,

  // Дозволяє працювати з App Router
  cacheOnFrontEndNav: true,
};

export default config;
