import frontStudyData from "@/data/frontStudyData.json";
import StudyListPage from "@/features/study-list/StudyListPage";

export const metadata = {
	title: "Front Study",
	description: "프론트와 관련된 내용을 공부하고 기록한 페이지입니다.",
	openGraph: {
		title: "Front Study",
		description: "프론트와 관련된 내용을 공부하고 기록한 페이지입니다.",
		url: "https://www.2taeyoon.com/fs",
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
	return <StudyListPage cards={frontStudyData.cards} sessionName="fs" />
}