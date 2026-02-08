/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
    unoptimized: process.env.VERCEL ? false : false,
  },
  async rewrites() {
    return [{ source: "/favicon.ico", destination: "/logo/logo.png" }];
  },
};

module.exports = nextConfig;
