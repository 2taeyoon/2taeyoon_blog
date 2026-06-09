"use client";

import { useEffect, useState } from "react";
import BaubleScene from "./BaubleScene";
import Underlay from "./Underlay";
import Overlay from "./Overlay";
import { ColorPalette } from "./ColorPalette";

export default function PortfolioPage() {
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
