"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";

export default function BlogAide() {
  const sidebarRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);

  const toggleOpen = () => {
    const layout = sidebarRef.current?.closest(".layout_wrap") as HTMLElement | null;
    layout?.classList.toggle("open");
  };

  useEffect(() => {
    const sidebar = sidebarRef.current;
    const nav = navRef.current;
    if (!sidebar || !nav) return;

    const buttons = nav.querySelectorAll<HTMLButtonElement>("button");
    if (buttons.length === 0) return;

    buttons[0].classList.add("active");

    const cleanups: (() => void)[] = [];
    buttons.forEach((button, index) => {
      const handler = () => {
        buttons.forEach((b) => b.classList.remove("active"));
        button.classList.add("active");
        nav.style.setProperty("--top", `${index === 0 ? 0 : index * 56}px`);
      };
      button.addEventListener("click", handler);
      cleanups.push(() => button.removeEventListener("click", handler));
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <aside ref={sidebarRef} className="blog_aide_sidebar">
      <button className="blog_aide_toggle" type="button" onClick={toggleOpen} aria-label="open/close">
        <span className="material-symbols-outlined">→</span>
      </button>
      <div className="blog_aide_inner">
        <div className="blog_aide_header">
          <Image src="/images/logo.svg" className="blog_aide_logo" alt="로고" width={32} height={32} unoptimized />
          <h1>BOLT UI</h1>
        </div>
        <nav ref={navRef} className="blog_aide_menu">
          <button type="button">
            <span className="material-symbols-outlined">1</span>
            <p>Dashboard</p>
          </button>
          <button type="button">
            <span className="material-symbols-outlined">2</span>
            <p>Leaderboard</p>
          </button>
          <button type="button">
            <span className="material-symbols-outlined">3</span>
            <p>Monitoring</p>
          </button>
          <button type="button">
            <span className="material-symbols-outlined">4</span>
            <p>Analytics</p>
          </button>
          <button type="button">
            <span className="material-symbols-outlined">5</span>
            <p>Message</p>
          </button>
          <button type="button">
            <span className="material-symbols-outlined">6</span>
            <p>Settings</p>
          </button>
        </nav>
      </div>
    </aside>
  );
}
