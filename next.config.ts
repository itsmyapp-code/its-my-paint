import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
  // Silence Turbopack vs Webpack warning in Next.js 16/Vercel
  // next-pwa currently requires Webpack to inject service worker logic
  experimental: {
    turbopack: {},
  },
};

export default withPWA(nextConfig);
