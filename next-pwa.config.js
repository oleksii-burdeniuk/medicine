// next-pwa.config.mjs
import runtimeCaching from 'next-pwa/cache.js';

const config = {
  dest: 'public', // куди зберігається service worker
  register: true, // автоматична реєстрація
  skipWaiting: true, // активує нову версію одразу
  runtimeCaching, // стандартне кешування сторінок і зображень
};

export default config;
