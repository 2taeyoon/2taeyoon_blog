import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/react";
import BlogHeaderWrapper from "@/components/blog/header/BlogHeaderWrapper";
import BlogAideWrapper from "@/components/blog/aide/BlogAideWrapper";

import "@/styles/base/index.css";
import "@/styles/blog/index.css";
import "@/styles/portfolio/index.css";

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: "/favicon/portfolio/main_favicon.ico", type: "image/x-icon" },
      { url: "/favicon/portfolio/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/portfolio/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon/portfolio/favicon-72x72.png", sizes: "72x72", type: "image/png" },
      { url: "/favicon/portfolio/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon/portfolio/favicon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon/portfolio/main_favicon.ico",
    apple: [
      { url: "/favicon/portfolio/apple-icon-57x57.png", sizes: "57x57" },
      { url: "/favicon/portfolio/apple-icon-60x60.png", sizes: "60x60" },
      { url: "/favicon/portfolio/apple-icon-72x72.png", sizes: "72x72" },
      { url: "/favicon/portfolio/apple-icon-76x76.png", sizes: "76x76" },
      { url: "/favicon/portfolio/apple-icon-114x114.png", sizes: "114x114" },
      { url: "/favicon/portfolio/apple-icon-120x120.png", sizes: "120x120" },
      { url: "/favicon/portfolio/apple-icon-144x144.png", sizes: "144x144" },
      { url: "/favicon/portfolio/apple-icon-152x152.png", sizes: "152x152" },
      { url: "/favicon/portfolio/apple-icon-180x180.png", sizes: "180x180" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="ko">
      <head>
        <meta name="color-scheme" content="light"/>
        <meta name="supported-color-schemes" content="light"/>
				<meta name="format-detection" content="telephone=no, date=no, email=no, address=no"/>
				<meta name="naver-site-verification" content="b31001398f78b93a5261e498862e5905546ebe94" />
				<meta name="google-site-verification" content="JjftBsdUusKSonsp6gVw-ivUUVv5sVXF0rtETJu280Q" />
      </head>
      <body>
				<div className="RouteApp">
					<BlogHeaderWrapper />
					<BlogAideWrapper />
					{children}
				</div>
        {/* Vercel 측정도구 */}
				<Analytics />
				<SpeedInsights />
      </body>
    </html>
  );
}
