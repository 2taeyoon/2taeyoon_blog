import { notFound } from "next/navigation";
import { CardProps } from "@/types/blog/card.types";
import { blogCategoryData, type BlogCategory } from "@/data/blog/cards";

function findCardBySlug(cards: CardProps[], slug: string) {
  const decodedTitle = decodeURIComponent(slug);

  const byHyphenSlug = cards.find(
    (item) => item.title.replace(/\s+/g, "-") === decodedTitle,
  );
  if (byHyphenSlug) {
    return { card: byHyphenSlug, decodedTitle };
  }

  const replaceTitle = decodedTitle.replace(/-/g, " ");
  const byTitle = cards.find((item) => item.title === replaceTitle);
  if (byTitle) {
    return { card: byTitle, decodedTitle };
  }

  return null;
}

export async function generateStudyMetadata(
  category: BlogCategory,
  params: Promise<{ title: string }>,
) {
  const { cards } = blogCategoryData[category];
  const title = (await params).title;
  const result = findCardBySlug(cards, title);

  if (!result) return notFound();

  const { card, decodedTitle } = result;

  return {
    title: card.title,
    description: card.subTitle,
    openGraph: {
      title: card.title,
      description: card.subTitle,
      url: `https://www.2taeyoon.com/blog/${category}/${decodedTitle}`,
      images: [
        {
          url: `https://www.2taeyoon.com${card.image}`,
          alt: "Thumbnail",
        },
      ],
      type: "article",
    },
  };
}
