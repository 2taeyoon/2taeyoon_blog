'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';

export default function HeaderWrapper() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  // 어디서든 header는 항상, /가 아닐 때만 mobile 추가
  const wrapperClassName = isHome ? 'header' : 'header mobile';

  return (
    <div className={wrapperClassName}>
      <Header />
    </div>
  );
}
