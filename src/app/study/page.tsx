import designData from "@/data/designData.json";
import frontendData from "@/data/frontendData.json";
import backendData from "@/data/backendData.json";
import { CardProps } from "@/types/props.types";
import StudyListPage from "@/features/study-list/StudyListPage";

export const metadata = {
	title: "Study",
	description: "디자인, 프론트엔드, 백엔드 관련 내용을 공부하고 기록한 페이지입니다.",
	openGraph: {
		title: "Study",
		description: "디자인, 프론트엔드, 백엔드 관련 내용을 공부하고 기록한 페이지입니다.",
		url: "https://www.2taeyoon.com/study",
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
].sort((a, b) => {
	const dateA = new Date(a.sortDate || "2024-01-01").getTime();
	const dateB = new Date(b.sortDate || "2024-01-01").getTime();
	return dateB - dateA;
});

export default function page() {
	return <StudyListPage cards={combinedCards} sessionName="study" />
}
