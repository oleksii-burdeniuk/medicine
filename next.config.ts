import type { NextConfig } from 'next';
import withPWA from 'next-pwa';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default withPWA({
  dest: 'public', // де зберігається service worker
  register: true,
  skipWaiting: true,
})(nextConfig);
