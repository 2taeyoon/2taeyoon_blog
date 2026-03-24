export const HEADING_ANCHOR_PREFIX = "section";

type HeadingLevelItem = {
  level: 2 | 3;
};

export const getH2AnchorId = (h2Index: number) => `${HEADING_ANCHOR_PREFIX}-${h2Index}`;

export const getH3AnchorId = (h2Index: number, h3Index: number) =>
  `${HEADING_ANCHOR_PREFIX}-${h2Index}-${h3Index}`;

export const createTocAnchorItems = <T extends HeadingLevelItem>(items: T[]) => {
  let h2Index = 0;
  let h3Index = 0;

  return items.map((item) => {
    if (item.level === 2) {
      h2Index += 1;
      h3Index = 0;
      return { ...item, anchorId: getH2AnchorId(h2Index) };
    }

    if (h2Index === 0) h2Index = 1;
    h3Index += 1;
    return { ...item, anchorId: getH3AnchorId(h2Index, h3Index) };
  });
};
