'use client';

import { usePathname } from 'next/navigation';
import BlogAide from './BlogAide';

export default function BlogAideWrapper() {
  const pathname = usePathname();
  
  // HOME (/)에서는 BlogAide를 완전히 표시하지 않음
  if (pathname === '/') {
    return null;
  }
  
  return <BlogAide />;
}
