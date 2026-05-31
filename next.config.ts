import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  experimental: {
    devtoolSegmentExplorer: false,
    optimizePackageImports: ['lucide-react'],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
      config.resolve.symlinks = false;
    }

    return config;
  },
};

export default nextConfig;