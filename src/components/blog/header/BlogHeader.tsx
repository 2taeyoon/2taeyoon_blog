"use client";

import React from "react";
import Link from "next/link";

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
          2taeyoon
        </Link>
        <button type="button" className="blog_header_menu" aria-label="사이드바 열기" onClick={openMobileSidebar}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256" aria-hidden="true">
            <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" />
          </svg>
        </button>
      </div>
    </header>
  );
}
