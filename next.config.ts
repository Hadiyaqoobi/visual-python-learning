import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Allow build to complete even with type errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // Allow build to complete even with ESLint errors  
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
