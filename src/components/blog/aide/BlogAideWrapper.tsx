'use client';

import { usePathname } from 'next/navigation';
import BlogAide from "@/components/blog/aide/BlogAide";

export default function BlogAideWrapper() {
  const pathname = usePathname();
  
  // 블로그 라우트 밖에서는 포트폴리오 전용 내비게이션과 충돌하지 않도록 숨김
  if (!pathname.startsWith('/blog')) {
    return null;
  }
  
  return <BlogAide />;
}
