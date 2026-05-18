"use client";

import React, { useEffect, useRef } from "react";

export default function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -200, y: -200 });
  const outer = useRef({ x: -200, y: -200 });
  const trail = useRef({ x: -200, y: -200 });
  const rafId = useRef<number>(0);
  const isHovering = useRef(false);
  const isClicking = useRef(false);

  useEffect(() => {
    const outerEl = outerRef.current;
    const innerEl = innerRef.current;
    const trailEl = trailRef.current;
    if (!outerEl || !innerEl || !trailEl) return;

    let visible = false;

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      if (!visible) {
        visible = true;
        outerEl.classList.add("pf-cursor-outer--visible");
        innerEl.classList.add("pf-cursor-inner--visible");
        trailEl.classList.add("pf-cursor-trail--visible");
      }
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as Element;
      if (t.closest("a, button, [data-hover]")) {
        isHovering.current = true;
        outerEl.classList.add("pf-cursor-outer--hover");
      }
    };

    const onOut = (e: MouseEvent) => {
      const t = e.target as Element;
      if (t.closest("a, button, [data-hover]")) {
        isHovering.current = false;
        outerEl.classList.remove("pf-cursor-outer--hover");
      }
    };

    const onDown = () => {
      isClicking.current = true;
      outerEl.classList.add("pf-cursor-outer--click");
    };

    const onUp = () => {
      isClicking.current = false;
      outerEl.classList.remove("pf-cursor-outer--click");
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);

    const loop = () => {
      outer.current.x += (mouse.current.x - outer.current.x) * 0.1;
      outer.current.y += (mouse.current.y - outer.current.y) * 0.1;
      trail.current.x += (mouse.current.x - trail.current.x) * 0.05;
      trail.current.y += (mouse.current.y - trail.current.y) * 0.05;

      outerEl.style.transform = `translate(${outer.current.x - 20}px, ${outer.current.y - 20}px)`;
      innerEl.style.transform = `translate(${mouse.current.x - 4}px, ${mouse.current.y - 4}px)`;
      trailEl.style.transform = `translate(${trail.current.x - 12}px, ${trail.current.y - 12}px)`;

      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <>
      <div ref={trailRef} className="pf-cursor-trail" aria-hidden="true" />
      <div ref={outerRef} className="pf-cursor-outer" aria-hidden="true" />
      <div ref={innerRef} className="pf-cursor-inner" aria-hidden="true" />
    </>
  );
}
