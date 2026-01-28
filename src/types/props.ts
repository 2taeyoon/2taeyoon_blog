import { ReactNode } from "react";

// 메타 태그 START!
export interface MetaProps {
  title: string | undefined;
  keywords: string | undefined;
  description: string | undefined;
  ogTitle: string | undefined;
  ogDescription: string | undefined;
	ogImage: string | undefined;
	ogURL: string | undefined;
	ogType: string | undefined;
}
// 메타 태그 END!

// 호버 시 클래스 추가 START!
export interface IsHoverProps {
  children: ReactNode;
  baseClass: string;
  hoverClass: string;
}
// 호버 시 클래스 추가 END!

// 링크 컴포넌트 START!
export interface ListLinkProps {
  linkTo: string;
  title?: string;
  baseClass?: string;
	target?: string;
	rel?: string;
	ariaLabel?: string;
	image?: string;
	svgWH?: string;
	svgColor?: string;
	path?: string;
	count?: number;
	onClick?: () => void;
}
// 링크 컴포넌트 END!

// 카테고리 링크 컴포넌트 START!
export interface CategoryLinksProps {
  category?: string;
	categoryClass?: string;
  links: {
    linkInfo: {
      linkTo: string;
      title?: string;
    };
    svgInfo?: {
      svgWH?: string;
      svgColor?: string;
      path?: string;
    };
  }[];
	icons?: boolean;
	categoryCapital?: boolean;
}
// 카테고리 링크 컴포넌트 END!

// SVG 컴포넌트 START!
export interface SvgProps {
	svgWH?: string;
	svgColor?: string;
	path?: string;
	path2?: string;
}
// 카테고리 링크 컴포넌트 END!

// 카드 컴포넌트 START!
export interface CardProps {
	mdFile?: string; // 마크다운 파일 경로
	category?: { text: string; color: string }[]; // 카드 카테고리
  badge?: string; // 카드에 출력되는 뱃지
	badge2?: string; // 카드에 출력되는 뱃지
  image?: string; // 카드 썸네일
	sortDate?: string; // 최신순 정렬을 위한 날짜
  title: string; // 카드 제목
  subTitle?: string; // 카드 부제목
	type?: string; // Home에서 PageUrl 클릭 시 링크 오류로 인한 url 설정
  hashs?: { name: string }[]; // 배너에 사용되는 해시태그
	sessionName?: string; // ds, ps, es에서 카드 클릭 시 링크 오류로 인한 url 설정
	date?: string; // 포트폴리오 날짜인데 곧 삭제
	link?: string; // 배너에 사용하는 포트폴리오 링크인데 곧 삭제
	skills?: { name: string; color: string; icon: string }[]; // 배너에 사용되는 포트폴리오 스킬인데 곧 삭제
}

export interface Mapping {
  cards: CardProps[];
	sessionName?: string;
}
// 카드 컴포넌트 END!

// 카드 페이지네이션 컴포넌트 START!
export interface CardPaginationProps {
  filteredCards: CardProps[]; // 타입 정의
	sessionName: string;
	currentPage: number;
	setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}
// 카드 페이지네이션 컴포넌트 END!

// 이전, 다음 페이지 URL START!
export interface PageUrlsProps {
	hyphenRemoval: string;
	cards: CardProps[];
}
// 이전, 다음 페이지 URL END!

// 해시태그 필터링 START!
export interface HashsProps {
  selectedHash: string | null;
  setSelectedHash: React.Dispatch<React.SetStateAction<string | null>>;
  uniqueHashs: string[];
  sessionName: string;
	setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}
// 해시태그 필터링 END!

// 명언 컴포넌트 START!
export interface SayingProps {
  say: string;
  writer: string;
	job: string;
};

export interface SayingComponentProps {
  sessionName: string;
};
// 명언 컴포넌트 END!

// 헤더 컴포넌트 START!
export interface AsideContextProps {
  trueActive: () => void;
}
// 헤더 컴포넌트 END!

// 콘텐츠 컴포넌트 START!
export interface TitleProps {
  title: string;
}
// 콘텐츠 컴포넌트 END!