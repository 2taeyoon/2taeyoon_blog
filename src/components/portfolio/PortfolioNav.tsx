"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export default function PortfolioNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className={`pf-nav${scrolled ? " pf-nav--scrolled" : ""}`}>
      <div className="pf-nav__inner">
        {/* 블로그와 동일한 로고 */}
        <a
          href="#hero"
          className="pf-nav__logo"
          onClick={(e) => handleAnchorClick(e, "#hero")}
        >
          <Image
            src="/favicon/favicon-48x48.png"
            alt="로고"
            width={32}
            height={32}
            className="pf-nav__logo-img"
            unoptimized
          />
          <span className="pf-nav__logo-text">심오한 개발자</span>
        </a>

        <ul className={`pf-nav__links${menuOpen ? " pf-nav__links--open" : ""}`}>
          {NAV_ITEMS.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                className="pf-nav__link"
                onClick={(e) => handleAnchorClick(e, href)}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Blog 이동 버튼 */}
        <Link href="/blog" className="pf-nav__cta">
          Blog
        </Link>

        <button
          type="button"
          className={`pf-nav__burger${menuOpen ? " pf-nav__burger--open" : ""}`}
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}
