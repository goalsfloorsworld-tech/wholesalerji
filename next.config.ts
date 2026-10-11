import type { NextConfig } from "next";

const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://blog.goalsfloors.com';
const wpHostname = new URL(wpUrl).hostname;

const nextConfig: NextConfig = {

  async redirects() {
    return [
      {
        source: '/products/primo-panels',
        destination: '/wall-panels/primo',
        permanent: true,
      },
      {
        source: '/products/elite-panels',
        destination: '/wall-panels/elite',
        permanent: true,
      },
      {
        source: '/products/primo-fluted-panels',
        destination: '/wall-panels/primo-fluted',
        permanent: true,
      },
      {
        source: '/products/elite-fluted-panels',
        destination: '/wall-panels/elite-fluted',
        permanent: true,
      },
    ];
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'goalsfloors.com',
      },
      {
        protocol: 'https',
        hostname: wpHostname,
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/images/:account(def2qsxjg|dcezlxt8r)/:path*',
        destination: 'https://res.cloudinary.com/:account/image/upload/:path*',
      },
      {
        source: '/images/:path*',
        destination: 'https://res.cloudinary.com/def2qsxjg/image/upload/:path*',
      },
    ];
  },
};

export default nextConfig;
