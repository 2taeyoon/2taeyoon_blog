"use client";

import React, { useMemo } from "react";
import { createTocAnchorItems } from "./headingAnchor";
import { TocItem } from "./useStudyDetail";
import { useActiveTocAnchor } from "./useActiveTocAnchor";

interface StudyTocProps {
  items: TocItem[];
}

export default function StudyToc({ items }: StudyTocProps) {
  const tocItemsWithAnchor = useMemo(() => createTocAnchorItems(items), [items]);
  const activeAnchorId = useActiveTocAnchor(tocItemsWithAnchor);

  return (
    <aside className="study_toc">
      {!items.length ? (
        <div className="study_toc_empty">목차를 만들 제목이 아직 없습니다.</div>
      ) : (
        <ul className="study_toc_list">
          {tocItemsWithAnchor.map((item) => (
            <li
              key={item.id}
              className={`study_toc_item level-${item.level} ${activeAnchorId === item.anchorId ? "is_active" : ""}`}
            >
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
