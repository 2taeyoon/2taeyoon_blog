import DesignStudyCard from "@/data/designStudyData.json";
import StudyListPage from "@/features/study-list/StudyListPage";

export const metadata = {
  title: "Design Study",
  description: "디자인과 관련된 내용을 공부하고 기록한 페이지입니다.",
  openGraph: {
    title: "Design Study",
    description: "디자인과 관련된 내용을 공부하고 기록한 페이지입니다.",
		url: "https://www.2taeyoon.com/ds",
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
	return <StudyListPage cards={DesignStudyCard.cards} sessionName="ds" />
}