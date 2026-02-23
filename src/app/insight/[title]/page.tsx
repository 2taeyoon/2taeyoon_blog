import { notFound } from "next/navigation";
import insightData from "@/data/insightData.json";
import InsightContent from "@/app/insight/[title]/InsightStudy";


export async function generateMetadata({ params }: { params: Promise<{ title: string }> }) {
	const title = (await params).title

  const decodedTitle = decodeURIComponent(title)
	const replaceTitle = decodedTitle.replace(/-/g, " ");
  const insightFind = insightData.cards.find((item) => item.title === replaceTitle);

	if (!insightFind) return notFound();

  return {
    title: insightFind.title,
    description: insightFind.subTitle,
    openGraph: {
      title: insightFind.title,
      description: insightFind.subTitle,
      url: `https://www.2taeyoon.com/insight/${decodedTitle}`,
			images: [
				{
					url: `https://www.2taeyoon.com${insightFind.image}`,
					alt: "Thumbnail",
				},
			],
      type: "article",
    },
  };
}


export default async function Page({ params }: { params: Promise<{ title: string }> }) {
  return <InsightContent title={(await params).title} />;
}
