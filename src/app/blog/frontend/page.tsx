import { getBlogCategory } from "@/data/blog/cards";
import StudyListPage from "@/components/blog/study-list/StudyListPage";

const category = getBlogCategory("frontend");

export const metadata = {
  title: "Front Study",
  description: "프론트와 관련된 내용을 공부하고 기록한 페이지입니다.",
  openGraph: {
    title: "Front Study",
    description: "프론트와 관련된 내용을 공부하고 기록한 페이지입니다.",
    url: "https://www.2taeyoon.com/blog/frontend",
    images: [
      {
        url: "https://www.2taeyoon.com/favicon/main_meta_image.png",
        alt: "Thumbnail",
      },
    ],
    type: "article",
  },
};

export default function Page() {
  return (
    <StudyListPage
      cards={category.data.cards}
      sessionName={category.sessionName}
    />
  );
}
