"use client";

import { useEffect, useState } from "react";
import BaubleScene from "@/components/portfolio/scene/BaubleScene";
import Underlay from "@/components/portfolio/ui/Underlay";
import { ColorPalette } from "@/components/portfolio/ui/ColorPalette";

export default function MainSection() {
  const [ballColor, setBallColor] = useState("fabric");
  const [paletteOpen, setPaletteOpen] = useState(false);

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
    <div className="main_section_container">
      <Underlay onTogglePalette={() => setPaletteOpen((prev) => !prev)} onClosePalette={() => setPaletteOpen(false)} />
      {paletteOpen && <ColorPalette value={ballColor} onChange={handleColorChange} />}
      <BaubleScene ballColor={ballColor} />
    </div>
  );
}
