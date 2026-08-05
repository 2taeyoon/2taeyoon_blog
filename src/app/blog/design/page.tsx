import { getBlogCategory } from "@/data/blog/cards";
import StudyListPage from "@/components/blog/study-list/StudyListPage";

const category = getBlogCategory("design");

export const metadata = {
  title: "Design Study",
  description: "디자인과 관련된 내용을 공부하고 기록한 페이지입니다.",
  openGraph: {
    title: "Design Study",
    description: "디자인과 관련된 내용을 공부하고 기록한 페이지입니다.",
    url: "https://www.2taeyoon.com/blog/design",
    images: [
      {
        url: "https://www.2taeyoon.com/favicon/blog/blog_meta_image.png",
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
