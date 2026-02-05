import { NextResponse } from "next/server";
import DesignStudyData from "@/data/designStudyData.json";
import FrontStudyData from "@/data/frontStudyData.json";
import BackStudyData from "@/data/backStudyData.json";
import EtcStudyData from "@/data/etcStudyData.json";
import { CardProps } from "@/types/props.types";

// JSON 파일을 하나의 배열로 통합
const combinedData: CardProps[] = [
  ...DesignStudyData.cards,
  ...FrontStudyData.cards,
  ...BackStudyData.cards,
  ...EtcStudyData.cards,
];

// 동적 경로 생성
async function getDynamicPaths(): Promise<{ url: string; }[]> {
	// 해당 함수에서는는 await가 없어서 굳이 async를 안 써도 작동하지만 다른 코드에서 await 호출되므로 사용
  return combinedData.map((item) => {
		// decodeURIComponent로 인코딩을 풀어주고 공백 대신 하이픈 추가
    const encodedTitle = encodeURIComponent(item.title.replace(/\s+/g, "-"));
		return {
      url: `/${item.type}/${encodedTitle}`, // url을 "/type값/제목 인코딩 풀어준 값" 으로 반환
    };
  });
};

// Sitemap XML 생성
function generateSitemap(paths: { url: string; }[]) {
  const domain = "https://www.2taeyoon.com";

	// path.map 부분의 마지막에 .join("")을 사용해야 배열 형태로 출력되는 요소들을 하나의 문자열로 합쳐줌
  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>${domain}</loc>
      <changefreq>weekly</changefreq>
      <priority>1.0</priority>
    </url>
		<url>
      <loc>${domain}/ds</loc>
      <changefreq>weekly</changefreq>
      <priority>1.0</priority>
    </url>
		<url>
      <loc>${domain}/fs</loc>
      <changefreq>weekly</changefreq>
      <priority>1.0</priority>
    </url>
		<url>
      <loc>${domain}/bs</loc>
      <changefreq>weekly</changefreq>
      <priority>1.0</priority>
    </url>
		<url>
      <loc>${domain}/es</loc>
      <changefreq>weekly</changefreq>
      <priority>1.0</priority>
    </url>
    ${paths
      .map((path) => 
				`
					<url>
						<loc>${domain}${path.url}</loc>
						<changefreq>weekly</changefreq>
						<priority>0.8</priority>
					</url>
				`
			).join("")}
  </urlset>
  `;
};

// ✅ NextJS 서버 API 라우트 GET()
export async function GET() {
  const paths = await getDynamicPaths(); //  `/${item.type}/${encodedTitle}` 값을 사용
  const sitemap = generateSitemap(paths); // 변환한 값을 generateSitemap의 인수로 넣음

	// NextJS API HTTP 응답
  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
