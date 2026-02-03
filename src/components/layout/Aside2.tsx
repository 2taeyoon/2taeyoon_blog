"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";

const MENU_ITEMS = [
  { icon: "🏠", label: "Dashboard" },
  { icon: "🏠", label: "Leaderboard" },
  { icon: "🏠", label: "Monitoring" },
  { icon: "🏠", label: "Analytics" },
  { icon: "🏠", label: "Message" },
  { icon: "🏠", label: "Settings" },
] as const;

export default function Aside2() {
  const sidebarRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);

  const toggleOpen = () => {
    sidebarRef.current?.classList.toggle("open");
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
    <aside ref={sidebarRef} className="sidebar">
      <button className="toggle" type="button" onClick={toggleOpen} aria-label="사이드바 열기/닫기">
        <span className="material-symbols-outlined">→</span>
      </button>
      <div className="inner">
        <div className="header2">
          <Image src="/images/logo.svg" className="logo" alt="로고" width={32} height={32} unoptimized />
          <h1>BOLT UI</h1>
        </div>
        <div className="search">
          <span className="material-symbols-outlined">search</span>
          <input type="text" placeholder="Search" />
        </div>
        <nav ref={navRef} className="menu">
          {MENU_ITEMS.map((item) => (
            <button key={item.label} type="button">
              <span className="material-symbols-outlined">{item.icon}</span>
              <p>{item.label}</p>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
