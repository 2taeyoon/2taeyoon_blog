import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 이미지는 이미 webp로 압축해 올리므로 Vercel 이미지 변환(Image Optimization)을 쓰지 않는다.
  // 변환 횟수 한도(Hobby 5K)를 넘지 않게 원본 파일을 그대로 내려준다.
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: "/project",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/project/:slug",
        destination: "/projects/:slug",
        permanent: true,
      },
    ];
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