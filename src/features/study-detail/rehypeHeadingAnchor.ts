import { getH2AnchorId, getH3AnchorId } from "./headingAnchor";

type HastNode = {
  type?: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

/**
 * h2/h3 heading에 계층형 anchor id를 주입합니다.
 */
export const rehypeHeadingAnchor = () => {
  return (tree: HastNode) => {
    let h2Index = 0;
    let h3Index = 0;

    const visit = (node: HastNode) => {
      if (node.type === "element") {
        if (node.tagName === "h2") {
          h2Index += 1;
          h3Index = 0;
          node.properties = { ...(node.properties ?? {}), id: getH2AnchorId(h2Index) };
        } else if (node.tagName === "h3") {
          if (h2Index === 0) h2Index = 1;
          h3Index += 1;
          node.properties = { ...(node.properties ?? {}), id: getH3AnchorId(h2Index, h3Index) };
        }
      }

      if (!node.children?.length) return;
      for (const child of node.children) visit(child);
    };

    visit(tree);
  };
};
