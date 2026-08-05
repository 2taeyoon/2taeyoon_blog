"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

function openMobileSidebar() {
  if (typeof document === "undefined") return;

  const layoutRoot = document.querySelector(".RouteApp") as HTMLElement | null;
  if (!layoutRoot) return;

  layoutRoot.classList.add("open");
  layoutRoot.classList.remove("close");
}

export default function BlogHeader() {
  return (
    <header className="blog_header">
      <div className="blog_header_inner">
        <Link href="/blog" className="blog_header_title">
          심오한 개발자
        </Link>
        <button type="button" className="blog_header_avatar" aria-label="사이드바 열기" onClick={openMobileSidebar}>
          <Image src="/favicon/blog/favicon-48x48.png" alt="프로필 이미지" width={40} height={40} className="blog_header_avatar_image" unoptimized />
        </button>
      </div>
    </header>
  );
}
