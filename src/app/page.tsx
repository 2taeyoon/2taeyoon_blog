import React from "react";
import PortfolioSections from "@/components/portfolio/PortfolioSections";

export const metadata = {
  title: "2taeyoon",
  description: "2taeyoon's portfolio",
  openGraph: {
    title: "2taeyoon",
    description: "2taeyoon's portfolio",
    url: "https://www.2taeyoon.com/",
    images: [
      {
        url: "https://www.2taeyoon.com/favicon/portfolio/main_meta_image.png",
        alt: "Profile Thumbnail",
      },
    ],
    type: "article",
  },
};

export default function Page() {
  return (
    <main>
      <PortfolioSections />
    </main>
  );
}
