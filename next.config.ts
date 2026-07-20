import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      // Match lib/storage.ts's own 5MB image validation limit, with some
      // headroom for multipart/form-data boundary and field overhead.
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
