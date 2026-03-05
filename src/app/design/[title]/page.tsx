import { notFound } from "next/navigation";
import DesignCard from "@/data/designData.json";
import DesignStudyContent from "@/app/design/[title]/DesignStudy";


// 서버 컴포넌트: 동적 메타데이터 설정
export async function generateMetadata({ params }: { params: Promise<{ title: string }> }) { // 동적 경로 매개변수인 params로 URL 가져옴
	const title = (await params).title;

  const decodedTitle = decodeURIComponent(title); // 인코딩 해제

	// 카드의 제목을 슬러그 형태로 변환한 값과 URL 파라미터를 비교
	const DesignCardFind = DesignCard.cards.find((item) => item.title.replace(/\s+/g, "-") === decodedTitle);

	if (!DesignCardFind) return notFound(); // 데이터가 없으면 404

  return {
    title: DesignCardFind.title,
    description: DesignCardFind.subTitle,
    openGraph: {
      title: DesignCardFind.title,
      description: DesignCardFind.subTitle,
      url: `https://www.2taeyoon.com/design/${decodedTitle}`,
			images: [
				{
					url: `https://www.2taeyoon.com${DesignCardFind.image}`,
					alt: "Thumbnail",
				},
			],
      type: "article",
    },
  };
}


// 클라이언트 컴포넌트에도 사용할 수 있도록 Props 전달
export default async function Page({ params }: { params: Promise<{ title: string }> }) {
  return <DesignStudyContent title={(await params).title} />;
}