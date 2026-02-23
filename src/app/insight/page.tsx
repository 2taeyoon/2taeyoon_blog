import insightData from "@/data/insightData.json";
import StudyListPage from "@/features/study-list/StudyListPage";

export const metadata = {
	title: "Insight",
	description: "인사이트와 관련된 내용을 기록한 페이지입니다.",
	openGraph: {
		title: "Insight",
		description: "인사이트와 관련된 내용을 기록한 페이지입니다.",
		url: "https://www.2taeyoon.com/insight",
		images: [
			{
				url: "https://www.2taeyoon.com/favicon/main_meta_image.png",
				alt: "Thumbnail",
			},
		],
		type: "article",
	},
};

export default function page() {
	return <StudyListPage cards={insightData.cards} sessionName="insight" />
}
