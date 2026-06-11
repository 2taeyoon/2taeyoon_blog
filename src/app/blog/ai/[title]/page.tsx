import { blogCategoryData } from "@/data/blog/cards";
import { generateStudyMetadata } from "@/lib/blog/generateStudyMetadata";
import StudyDetailPage from "@/components/blog/study-detail/StudyDetailPage";

export const generateMetadata = (params: { params: Promise<{ title: string }> }) =>
  generateStudyMetadata("ai", params.params);

export default async function Page({ params }: { params: Promise<{ title: string }> }) {
  return (
    <StudyDetailPage title={(await params).title} cards={blogCategoryData.ai.cards} />
  );
}
