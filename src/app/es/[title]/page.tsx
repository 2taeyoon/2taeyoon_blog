import { notFound } from "next/navigation";
import EtcCard from "@/data/etcStudyData.json";
import EtcStudyContent from "@/app/es/[title]/EtcStudy"; // 클라이언트 컴포넌트 가져오기


// 서버 컴포넌트: 동적 메타데이터 설정
export async function generateMetadata({ params }: { params: Promise<{ title: string }> }) { // 동적 경로 매개변수인 params로 URL 가져옴
	const title = (await params).title

  const decodedTitle = decodeURIComponent(title) // decodeURIComponent로 인코딩을 풀어줌
	const replaceTitle = decodedTitle.replace(/-/g, " "); // 공백 대신 하이픈(-) 추가
  const EtcCardFind = EtcCard.cards.find((item) => item.title === replaceTitle); // JSON 데이터와 title을 비교하여 알맞는 데이터 찾음

	if (!EtcCardFind) return notFound(); // 데이터가 없으면 404

  return {
    title: EtcCardFind.title,
    description: EtcCardFind.subTitle,
    openGraph: {
      title: EtcCardFind.title,
      description: EtcCardFind.subTitle,
      url: `https://www.2taeyoon.com/es/${decodedTitle}`,
			images: [
				{
					url: `https://www.2taeyoon.com${EtcCardFind.image}`,
					alt: "Thumbnail",
				},
			],
      type: "article",
    },
  };
}


// 클라이언트 컴포넌트에도 사용할 수 있도록 Props 전달
export default async function Page({ params }: { params: Promise<{ title: string }> }) {
  return <EtcStudyContent title={(await params).title} />;
}