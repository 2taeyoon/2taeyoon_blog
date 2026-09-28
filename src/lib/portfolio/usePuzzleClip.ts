"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { createPuzzleClipPath } from "@/lib/portfolio/puzzleClip";

export function usePuzzleClip<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [clipPath, setClipPath] = useState<string>();

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    const update = () => {
      const width = node.offsetWidth;
      const height = node.offsetHeight;
      if (width < 2 || height < 2) return;
      setClipPath(createPuzzleClipPath(width, height));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, clipPath };
}
