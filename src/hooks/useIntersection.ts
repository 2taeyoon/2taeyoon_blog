"use client";

import { useEffect, useRef, RefObject } from "react";

interface Options {
  threshold?: number | number[];
  rootMargin?: string;
  once?: boolean;
  onEnter?: (entry: IntersectionObserverEntry) => void;
  onLeave?: (entry: IntersectionObserverEntry) => void;
}

export function useIntersection<T extends Element>(
  options: Options = {}
): RefObject<T | null> {
  const { threshold = 0.15, rootMargin = "0px", once = true, onEnter, onLeave } = options;
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("is-visible");
            onEnter?.(entry);
            if (once) observer.unobserve(el);
          } else {
            if (!once) {
              el.classList.remove("is-visible");
              onLeave?.(entry);
            }
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once, onEnter, onLeave]);

  return ref;
}
