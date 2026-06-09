import { NextResponse } from "next/server";
import { allBlogCards } from "@/data/blog/cards";

async function getDynamicPaths(): Promise<{ url: string }[]> {
  return allBlogCards.map((item) => {
    const encodedTitle = encodeURIComponent(item.title.replace(/\s+/g, "-"));
    return {
      url: `/${item.type}/${encodedTitle}`,
    };
  });
}

function generateSitemap(paths: { url: string }[]) {
  const domain = "https://www.2taeyoon.com";

  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>${domain}</loc>
      <changefreq>weekly</changefreq>
      <priority>1.0</priority>
    </url>
    <url>
      <loc>${domain}/blog</loc>
      <changefreq>weekly</changefreq>
      <priority>1.0</priority>
    </url>
    <url>
      <loc>${domain}/blog/design</loc>
      <changefreq>weekly</changefreq>
      <priority>1.0</priority>
    </url>
    <url>
      <loc>${domain}/blog/frontend</loc>
      <changefreq>weekly</changefreq>
      <priority>1.0</priority>
    </url>
    <url>
      <loc>${domain}/blog/backend</loc>
      <changefreq>weekly</changefreq>
      <priority>1.0</priority>
    </url>
    <url>
      <loc>${domain}/blog/ai</loc>
      <changefreq>weekly</changefreq>
      <priority>1.0</priority>
    </url>
    ${paths
      .map(
        (path) =>
          `
          <url>
            <loc>${domain}${path.url}</loc>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
          </url>
        `,
      )
      .join("")}
  </urlset>
  `;
}

export async function GET() {
  const paths = await getDynamicPaths();
  const sitemap = generateSitemap(paths);

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
