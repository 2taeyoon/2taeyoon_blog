"use client";

import { useEffect, useState } from "react";
import BaubleScene from "@/components/portfolio/scene/BaubleScene";
import Underlay from "@/components/portfolio/ui/Underlay";
import Overlay from "@/components/portfolio/ui/Overlay";
import { ColorPalette } from "@/components/portfolio/ui/ColorPalette";

export default function MainPage() {
  const [ballColor, setBallColor] = useState("gradient");

  useEffect(() => {
    const savedColor = sessionStorage.getItem("baubleColor");
    if (savedColor) {
      setBallColor(savedColor);
    }
  }, []);

  const handleColorChange = (color: string) => {
    setBallColor(color);
    sessionStorage.setItem("baubleColor", color);
  };

  return (
    <div className="main-section-container">
      <Underlay />
      <ColorPalette value={ballColor} onChange={handleColorChange} />
      <BaubleScene ballColor={ballColor} />
      <Overlay />
    </div>
  );
}
