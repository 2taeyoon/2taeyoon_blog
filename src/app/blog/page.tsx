import designData from "@/data/blog/designData.json";
import frontendData from "@/data/blog/frontendData.json";
import backendData from "@/data/blog/backendData.json";
import aiData from "@/data/blog/aiData.json";
import { CardProps } from "@/types/props.types";
import StudyListPage from "@/features/study-list/StudyListPage";

export const metadata = {
	title: "Blog",
	description: "디자인, 프론트엔드, 백엔드, AI 관련 기록을 모아둔 블로그 페이지입니다.",
	openGraph: {
		title: "Blog",
		description: "디자인, 프론트엔드, 백엔드, AI 관련 기록을 모아둔 블로그 페이지입니다.",
		url: "https://www.2taeyoon.com/blog",
		images: [
			{
				url: "https://www.2taeyoon.com/favicon/main_meta_image.png",
				alt: "Thumbnail",
			},
		],
		type: "article",
	},
};

const combinedCards: CardProps[] = [
	...designData.cards,
	...frontendData.cards,
	...backendData.cards,
	...aiData.cards,
].sort((a, b) => {
	const dateA = new Date(a.sortDate || "2024-01-01").getTime();
	const dateB = new Date(b.sortDate || "2024-01-01").getTime();
	return dateB - dateA;
});

export default function page() {
	return <StudyListPage cards={combinedCards} sessionName="blog" />
}
