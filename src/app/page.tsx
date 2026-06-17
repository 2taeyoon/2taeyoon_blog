import React from "react";
import MainSection from "@/components/portfolio/MainSection";
import SkillSection from "@/components/portfolio/SkillSection";

export const metadata = {
  title: "2taeyoon",
  description: "2taeyoon's portfolio",
  openGraph: {
    title: "2taeyoon",
    description: "2taeyoon's portfolio",
    url: "https://www.2taeyoon.com/",
    images: [
      {
        url: "https://www.2taeyoon.com/favicon/main_meta_image.png",
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
      <SkillSection />
    </main>
  );
}
