"use client";

import React, { useRef } from "react";

const PRESET_COLORS = [
  "gradient",
  "#b21210",
  "#e0761f",
  "#c2a10f",
  "#09770e",
  "#0033ff",
  "#0322ab",
  "#631e76",
];

function normalizeHex(hex: string) {
  return hex.toLowerCase();
}

function isPresetColor(value: string) {
  if (value === "gradient") return true;
  return PRESET_COLORS.some(
    (c) => c !== "gradient" && normalizeHex(c) === normalizeHex(value),
  );
}

export function ColorPalette({
  value,
  onChange,
}: {
  value: string;
  onChange: (color: string) => void;
}) {
  const colorInputRef = useRef<HTMLInputElement>(null);
  const selectedPreset =
    value === "gradient"
      ? "gradient"
      : isPresetColor(value)
        ? normalizeHex(value)
        : null;

  const openCustomPicker = () => {
    colorInputRef.current?.click();
  };

  return (
    <div
      className="color_palette"
      onPointerDown={(e) => e.stopPropagation()}
    >
      <p className="color_palette_label">COLOR</p>

      <div
        className="color_palette_swatches"
        role="radiogroup"
        aria-label="공 색상 선택"
      >
        {PRESET_COLORS.map((color) => {
          const isSelected =
            selectedPreset ===
            (color === "gradient" ? "gradient" : normalizeHex(color));
          const isGradient = color === "gradient";
          return (
            <button
              key={color}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={`color_palette_swatch${isSelected ? " is_selected" : ""}`}
              style={
                isGradient
                  ? { background: "linear-gradient(to bottom, #b21210, #0033ff)" }
                  : ({ "--swatch-color": color } as React.CSSProperties)
              }
              onClick={() => onChange(color)}
            />
          );
        })}
      </div>

      <hr className="color_palette_divider" />

      <button
        type="button"
        className="color_palette_custom"
        onClick={openCustomPicker}
      >
        <span>직접 선택</span>
        <span
          className="color_palette_custom_preview"
          style={{ backgroundColor: value }}
        />
      </button>

      <input
        ref={colorInputRef}
        type="color"
        className="color_palette_input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="직접 색상 선택"
      />
    </div>
  );
}
