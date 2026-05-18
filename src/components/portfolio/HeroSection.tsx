"use client";

import React from "react";

export default function HeroSection() {
  return (
    <section id="hero" className="pf-hero">
      <div className="pf-hero__vignette" aria-hidden="true" />

      <div className="pf-hero__content">
        {/* <p className="pf-hero__eyebrow">
          <span className="pf-hero__eyebrow-dash" />
          Frontend Engineer &amp; Creative Developer
          <span className="pf-hero__eyebrow-dash" />
        </p> */}

        <h1 className="pf-hero__name">
          <span className="pf-hero__name-row pf-hero__name-row--1">페이지 준비중입니다.</span>
          {/* <span className="pf-hero__name-row pf-hero__name-row--2">YOON</span> */}
        </h1>

        {/* <p className="pf-hero__tagline">
          Crafting immersive digital experiences through code,
          <br />
          motion, and the power of the web.
        </p>

        <div className="pf-hero__actions">
          <a href="#projects" className="pf-hero__btn pf-hero__btn--primary">
            <span>View Projects</span>
            <svg className="pf-hero__btn-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a href="#contact" className="pf-hero__btn pf-hero__btn--ghost">
            <span>Get in Touch</span>
          </a>
        </div> */}
      </div>

      <div className="pf-hero__scroll">
        <div className="pf-hero__scroll-track">
          <div className="pf-hero__scroll-thumb" />
        </div>
        <span className="pf-hero__scroll-label">Scroll</span>
      </div>
    </section>
  );
}
