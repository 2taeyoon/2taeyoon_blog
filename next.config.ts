import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // public(약 394MB)은 CDN으로만 제공하고 서버리스 함수에는 넣지 않는다.
  outputFileTracingExcludes: {
    "*": [
      "./public/**/*",
      "./.next/cache/**/*",
    ],
  },
};

export default nextConfig;