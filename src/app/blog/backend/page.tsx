import { getBlogCategory } from "@/data/blog/cards";
import StudyListPage from "@/components/blog/study-list/StudyListPage";

const category = getBlogCategory("backend");

export const metadata = {
  title: "Back Study",
  description: "백엔드와 관련된 내용을 공부하고 기록한 페이지입니다.",
  openGraph: {
    title: "Back Study",
    description: "백엔드와 관련된 내용을 공부하고 기록한 페이지입니다.",
    url: "https://www.2taeyoon.com/blog/backend",
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
    <StudyListPage cards={category.data.cards} sessionName={category.sessionName} />
  );
}
