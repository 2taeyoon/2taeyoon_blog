import EtcStudyCard from "@/data/etcStudyData.json";
import StudyListPage from "@/features/study-list/StudyListPage";

export const metadata = {
  title: "Etc Study",
  description: "디자인과 퍼블리싱 외의 내용을 공부하고 기록한 페이지입니다.",
  openGraph: {
    title: "Etc Study",
    description: "디자인과 퍼블리싱 외의 내용을 공부하고 기록한 페이지입니다.",
		url: "https://www.2taeyoon.com/es",
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
	return <StudyListPage cards={EtcStudyCard.cards} sessionName="es" />
}