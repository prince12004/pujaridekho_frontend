import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Media Library uploads — Google Cloud Storage in production, local API disk in dev.
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
      },
    ],
  },
};

export default nextConfig;
