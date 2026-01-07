import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    domains: ['zrbcztvcldcoiikbgctm.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'zrbcztvcldcoiikbgctm.supabase.co',
        pathname: '/storage/v1/object/public/images/**',
      },
    ],
  },
};

export default nextConfig;
