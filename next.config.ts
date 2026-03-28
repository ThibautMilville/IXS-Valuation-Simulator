import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [{ source: "/og.png", destination: "/api/og" }];
  },
};

export default nextConfig;
