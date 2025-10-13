import type { NextConfig } from 'next';
import withPWA from 'next-pwa';
import pwaConfig from './next-pwa.config.js';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

export default withPWA(pwaConfig)(nextConfig);
