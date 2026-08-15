export interface MenuSectionWithButtons {
  id: string;
  title: string;
  count?: number;
  items: { label: string; href: string; count?: number }[];
  type: "withButtons";
}

export interface MenuSectionLinkOnly {
  id: string;
  title: string;
  count?: number;
  href: string;
  type: "linkOnly";
  exact?: boolean;
}

export type MenuSection = MenuSectionWithButtons | MenuSectionLinkOnly;
