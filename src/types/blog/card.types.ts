export interface CardProps {
  mdFile?: string;
  category?: ({ text: string; color?: never } | { color: string; text?: never })[];
  badge?: string;
  badge2?: string;
  image?: string;
  sortDate?: string;
  title: string;
  subTitle?: string;
  type?: string;
  hashs?: { name: string }[];
  sessionName?: string;
  date?: string;
  link?: string;
  skills?: { name: string; color: string; icon: string }[];
}

export interface Mapping {
  cards: CardProps[];
  sessionName?: string;
}

export interface StudyListPageProps {
  cards: CardProps[];
  sessionName: string;
}
