import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    // URL-only image storage after the Supabase migration: allow common
    // hosted-image domains. Tighten these once a real upload provider is wired.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
