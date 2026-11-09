"use client";

import React, { startTransition, useEffect, useMemo, useRef, useState } from "react";
import { createTocAnchorItems } from "@/lib/blog/headingAnchor";
import { TocItem } from "@/types/blog/toc.types";
import { useActiveTocAnchor } from "@/components/blog/study-detail/hooks/useActiveTocAnchor";

interface StudyTocProps {
  items: TocItem[];
}

export default function StudyToc({ items }: StudyTocProps) {
  const tocRef = useRef<HTMLElement | null>(null);
  const [isFixed, setIsFixed] = useState(false);

  const tocItemsWithAnchor = useMemo(() => createTocAnchorItems(items), [items]);
  const activeAnchorId = useActiveTocAnchor(tocItemsWithAnchor);

  useEffect(() => {
    const updateFixedState = () => {
      if (!tocRef.current) return;

      const tocElement = tocRef.current;
      const rect = tocElement.getBoundingClientRect();
      const rawTop = window.getComputedStyle(tocElement).top;
      const parsedTop = Number.parseFloat(rawTop);
      const topFromStyle = Number.isFinite(parsedTop) ? parsedTop : 0;
      const parentWrap = tocElement.closest(".blog_wrap");

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

  // 활성 항목이 바뀌면 목차 자체 스크롤을 옮겨 활성 항목이 목차 가운데에 보이게 한다.
  // scrollIntoView는 페이지 전체까지 스크롤할 수 있어서 aside의 scrollTop만 직접 조정한다.
  useEffect(() => {
    const tocElement = tocRef.current;
    if (!tocElement || !activeAnchorId) return;
    if (tocElement.scrollHeight <= tocElement.clientHeight) return;

    const activeItem = tocElement.querySelector<HTMLElement>(".study_toc_item.is_active");
    if (!activeItem) return;

    const tocRect = tocElement.getBoundingClientRect();
    const itemRect = activeItem.getBoundingClientRect();
    const itemTopInToc = itemRect.top - tocRect.top + tocElement.scrollTop;
    const targetTop = itemTopInToc - (tocElement.clientHeight - itemRect.height) / 2;

    tocElement.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
  }, [activeAnchorId]);

  return (
    <aside ref={tocRef} className={`study_toc ${isFixed ? "fix" : ""}`}>
      {!items.length ? (
        <div className="study_toc_empty">목차를 만들 제목이 아직 없습니다.</div>
      ) : (
        <ul className="study_toc_list">
          {tocItemsWithAnchor.map((item) => (
            <li key={item.id} className={`study_toc_item level-${item.level} ${activeAnchorId === item.anchorId ? "is_active" : ""}`}>
              <a href={`#${item.anchorId}`} className="study_toc_line">
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
