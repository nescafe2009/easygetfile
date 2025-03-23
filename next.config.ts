import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
    serverComponentsExternalPackages: [],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  async headers() {
    return [];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'standalone',
  serverRuntimeConfig: {
    port: 3001,
  },
};

export default nextConfig;
