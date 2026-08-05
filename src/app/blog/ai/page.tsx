import { getBlogCategory } from "@/data/blog/cards";
import StudyListPage from "@/components/blog/study-list/StudyListPage";

const category = getBlogCategory("ai");

export const metadata = {
  title: "AI",
  description: "AI 인사이트와 직접 적용한 에이전트 및 실험 기록을 모아둔 페이지입니다.",
  openGraph: {
    title: "AI",
    description: "AI 인사이트와 직접 적용한 에이전트 및 실험 기록을 모아둔 페이지입니다.",
    url: "https://www.2taeyoon.com/blog/ai",
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
