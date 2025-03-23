import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    }
  },
  images: {
    unoptimized: true,
  },
  output: 'standalone',
};

export default nextConfig;
