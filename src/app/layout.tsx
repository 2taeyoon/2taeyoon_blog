/* Common Styles */
import "@/styles/common/variables.css";
import "@/styles/common/reset.css";
import "@/styles/common/fonts.css";
import "@/styles/common/animations.css";
import "@/styles/common/layout.css";

/* Component Styles */
import "@/styles/components/layout/header.css";
import "@/styles/components/layout/aside.css";
import "@/styles/components/ui/banner.css";
import "@/styles/components/ui/sliderFade.css";
import "@/styles/components/ui/saying.css";
import "@/styles/components/ui/customCursor.css";
import "@/styles/components/list/card.css";
import "@/styles/components/utill/hashs.css";
import "@/styles/components/utill/pagination.css";
import "@/styles/components/canvas/dotFieldCanvas.css";

/* Markdown Styles */
import "@/styles/markdown/markdown.css";
import "@/styles/markdown/markdownAtom.css";

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/react";
// import HeaderAside from "@/components/layout/HeaderAside";

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
				<link rel="icon" href="/favicon.ico" title="icon"/>
				<link rel="shortcut icon" type="image/x-icon" href="/favicon.ico"/>
				<link rel="apple-touch-icon" sizes="57x57" href="/favicon/apple-icon-57x57.png"/>
				<link rel="apple-touch-icon" sizes="60x60" href="/favicon/apple-icon-60x60.png"/>
				<link rel="apple-touch-icon" sizes="72x72" href="/favicon/apple-icon-72x72.png"/>
				<link rel="apple-touch-icon" sizes="76x76" href="/favicon/apple-icon-76x76.png"/>
				<link rel="apple-touch-icon" sizes="114x114" href="/favicon/apple-icon-114x114.png"/>
				<link rel="apple-touch-icon" sizes="120x120" href="/favicon/apple-icon-120x120.png"/>
				<link rel="apple-touch-icon" sizes="144x144" href="/favicon/apple-icon-144x144.png"/>
				<link rel="apple-touch-icon" sizes="152x152" href="/favicon/apple-icon-152x152.png"/>
				<link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-icon-180x180.png"/>
				<link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png"/>
				<link rel="icon" type="image/png" sizes="48x48" href="/favicon/favicon-48x48.png"/>
				<link rel="icon" type="image/png" sizes="72x72" href="/favicon/favicon-72x72.png"/>
				<link rel="icon" type="image/png" sizes="96x96" href="/favicon/favicon-96x96.png"/>
				<link rel="icon" type="image/png" sizes="192x192"  href="/favicon/favicon-192x192.png"/>
				<link rel="icon" type="image/png" sizes="512x512"  href="/favicon/favicon-512x512.png"/>
				<meta name="naver-site-verification" content="b31001398f78b93a5261e498862e5905546ebe94" />
				<meta name="google-site-verification" content="JjftBsdUusKSonsp6gVw-ivUUVv5sVXF0rtETJu280Q" />
      </head>
      <body>
				<div className="RouteApp">
					{/* <HeaderAside/> */}
					{children}
				</div>
        {/* Vercel 측정도구 */}
				<Analytics />
				<SpeedInsights />
      </body>
    </html>
  );
}