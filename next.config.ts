import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Erzwingt sauberes Routing ohne versteckte Slash-Probleme
  trailingSlash: false, 
};

export default nextConfig;
