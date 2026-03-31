import { notFound } from "next/navigation";
import aiData from "@/data/blog/aiData.json";
import AiContent from "@/app/blog/ai/[title]/AiStudy";


export async function generateMetadata({ params }: { params: Promise<{ title: string }> }) {
	const title = (await params).title

  const decodedTitle = decodeURIComponent(title)
	const replaceTitle = decodedTitle.replace(/-/g, " ");
  const aiFind = aiData.cards.find((item) => item.title === replaceTitle);

	if (!aiFind) return notFound();

  return {
    title: aiFind.title,
    description: aiFind.subTitle,
    openGraph: {
      title: aiFind.title,
      description: aiFind.subTitle,
      url: `https://www.2taeyoon.com/blog/ai/${decodedTitle}`,
			images: [
				{
					url: `https://www.2taeyoon.com${aiFind.image}`,
					alt: "Thumbnail",
				},
			],
      type: "article",
    },
  };
}


export default async function Page({ params }: { params: Promise<{ title: string }> }) {
  return <AiContent title={(await params).title} />;
}
