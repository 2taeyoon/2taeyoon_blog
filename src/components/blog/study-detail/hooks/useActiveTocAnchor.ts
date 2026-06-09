import { useEffect, useState } from "react";

type AnchorItem = {
  anchorId: string;
};

export const useActiveTocAnchor = (items: AnchorItem[], offsetTop = 120) => {
  const [activeAnchorId, setActiveAnchorId] = useState<string | null>(null);

  useEffect(() => {
    if (!items.length) {
      setActiveAnchorId(null);
      return;
    }

    const update = () => {
      let currentActiveId: string | null = null;

      for (const item of items) {
        const heading = document.getElementById(item.anchorId);
        if (!heading) continue;

        if (heading.getBoundingClientRect().top <= offsetTop) {
          currentActiveId = item.anchorId;
        } else {
          break;
        }
      }

      setActiveAnchorId((prev) => (prev === currentActiveId ? prev : currentActiveId));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items, offsetTop]);

  return activeAnchorId;
};
