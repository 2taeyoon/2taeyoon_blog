"use client";

import React from "react";
import Image from "next/image";

export default function BlogAide() {

  const toggleOpen = () => {
    const layoutRoot = document.querySelector(".RouteApp") as HTMLElement | null;
    layoutRoot?.classList.toggle("open");
  };

  return (
    <aside className="blog_aide_sidebar">
      <div className="blog_aide_inner">
        <div className="blog_aide_header">
          <Image src="/favicon/favicon-32x32.png" className="blog_aide_logo" alt="로고" width={32} height={32} unoptimized />
          <h1>2taeyoon</h1>
					<button className="blog_aide_toggle" type="button" onClick={toggleOpen} aria-label="open/close">
						<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256">
							<path d="M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z"></path>
						</svg>
					</button>
        </div>
        <nav className="blog_aide_menu">
					<div className="blog_aide_menu_title">STUDY</div>
          <button type="button">
            <span>1</span>
            <p>Dashboard</p>
          </button>
          <button type="button">
            <span>2</span>
            <p>Leaderboard</p>
          </button>
          <button type="button">
            <span>3</span>
            <p>Monitoring</p>
          </button>
          <button type="button">
            <span>4</span>
            <p>Analytics</p>
          </button>
          <button type="button">
            <span>5</span>
            <p>Message</p>
          </button>
          <button type="button">
            <span>6</span>
            <p>Settings</p>
          </button>
        </nav>
      </div>
    </aside>
  );
}
