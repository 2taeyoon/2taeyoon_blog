import React from "react";
import MainSection from "@/components/portfolio/MainSection";

export const metadata = {
  title: "2taeyoon",
  description: "2taeyoon's portfolio",
  openGraph: {
    title: "2taeyoon",
    description: "2taeyoon's portfolio",
    url: "https://www.2taeyoon.com/",
    images: [
      {
        url: "https://www.2taeyoon.com/favicon/main_thumbnail.png",
        alt: "Profile Thumbnail",
      },
    ],
    type: "article",
  },
};

export default function Page() {
  return (
    <main>
      <MainSection />
    </main>
  );
}
