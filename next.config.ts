import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },

      // Cloudinary media
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
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

      // Local-disk uploads served from the API's public URL when Cloudinary isn't configured
      // (e.g. production falls back to serving /uploads from pujaridekho.com itself).
      {
        protocol: "https",
        hostname: "pujaridekho.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "www.pujaridekho.com",
        pathname: "/uploads/**",
      },

      // Product and samagri photos shipped with the website (public/products, public/samagri),
      // stored as full URLs so the mobile app can load them too.
      ...["pujaridekho.com", "www.pujaridekho.com"].flatMap((hostname) =>
        ["/products/**", "/samagri/**"].map((pathname) => ({ protocol: "https" as const, hostname, pathname })),
      ),
    ],
  },
};

export default nextConfig;