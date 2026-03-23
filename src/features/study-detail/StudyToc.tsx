'use client';

import React, { startTransition, useEffect, useRef, useState } from "react";
import { TocItem } from "./useStudyDetail";

interface StudyTocProps {
  items: TocItem[];
}

export default function StudyToc({ items }: StudyTocProps) {
  const tocRef = useRef<HTMLElement | null>(null);
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const updateFixedState = () => {
      if (!tocRef.current) return;

      const tocElement = tocRef.current;
      const rect = tocElement.getBoundingClientRect();
      const rawTop = window.getComputedStyle(tocElement).top;
      const parsedTop = Number.parseFloat(rawTop);
      const topFromStyle = Number.isFinite(parsedTop) ? parsedTop : 0;
      const parentWrap = tocElement.closest(".common_wrap");

      const reachedTop = window.scrollY > 0 && rect.top <= topFromStyle + 1;

      let insideParent = true;
      if (parentWrap) {
        const parentRect = parentWrap.getBoundingClientRect();
        insideParent =
          parentRect.top <= topFromStyle &&
          parentRect.bottom > topFromStyle + rect.height;
      }

      startTransition(() => {
        setIsFixed(reachedTop && insideParent);
      });
    };

    updateFixedState();
    window.addEventListener("scroll", updateFixedState, { passive: true });
    window.addEventListener("resize", updateFixedState);

    return () => {
      window.removeEventListener("scroll", updateFixedState);
      window.removeEventListener("resize", updateFixedState);
    };
  }, []);

  return (
    <aside ref={tocRef} className={`study_toc ${isFixed ? "fix" : ""}`}>
      {!items.length ? (
        <div className="study_toc_empty">목차를 만들 제목이 아직 없습니다.</div>
      ) : (
        <ul className="study_toc_list">
          {items.map((item) => (
            <li key={item.id} className={`study_toc_item level-${item.level}`}>
              <span className="study_toc_line">{item.text}</span>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
