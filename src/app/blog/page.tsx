import { getSortedBlogCards } from "@/data/blog/cards";
import StudyListPage from "@/components/blog/study-list/StudyListPage";

export const metadata = {
  title: "Blog",
  description: "디자인, 프론트엔드, 백엔드, AI 관련 기록을 모아둔 블로그 페이지입니다.",
  openGraph: {
    title: "Blog",
    description: "디자인, 프론트엔드, 백엔드, AI 관련 기록을 모아둔 블로그 페이지입니다.",
    url: "https://www.2taeyoon.com/blog",
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
  return <StudyListPage cards={getSortedBlogCards()} sessionName="blog" />;
}
