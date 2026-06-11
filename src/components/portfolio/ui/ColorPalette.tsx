"use client";

import React, { useRef } from "react";

/** hex가 아닌 특수 표면 프리셋 (텍스처/그라데이션) */
const NAMED_PRESETS = ["fabric", "gradient"];

const PRESET_COLORS = [
  "fabric",
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
  if (NAMED_PRESETS.includes(value)) return true;
  return PRESET_COLORS.some(
    (c) => !NAMED_PRESETS.includes(c) && normalizeHex(c) === normalizeHex(value),
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
  const selectedPreset = NAMED_PRESETS.includes(value)
    ? value
    : isPresetColor(value)
      ? normalizeHex(value)
      : null;

  const openCustomPicker = () => {
    colorInputRef.current?.click();
  };

  return (
    <div className="color_palette" onPointerDown={(e) => e.stopPropagation()}>
      <p className="color_palette_label">COLOR</p>

      <div className="color_palette_swatches" role="radiogroup" aria-label="공 색상 선택">
        {PRESET_COLORS.map((color) => {
          const isNamed = NAMED_PRESETS.includes(color);
          const isSelected = selectedPreset === (isNamed ? color : normalizeHex(color));
          return (
            <button key={color} type="button" role="radio" aria-checked={isSelected}
							className={`color_palette_swatch${color === "fabric" ? " color_palette_swatch_fabric" : ""}${color === "gradient" ? " color_palette_swatch_gradient" : ""}${isSelected ? " is_selected" : ""}`}
							style={isNamed ? undefined : ({ "--swatch-color": color } as React.CSSProperties)} onClick={() => onChange(color)} />
          );
        })}
      </div>

      <hr className="color_palette_divider" />

      <button type="button" className="color_palette_custom" onClick={openCustomPicker}>
        <span>직접 선택</span>
        <span className="color_palette_custom_preview" style={{ backgroundColor: value }} />
      </button>

      <input ref={colorInputRef} type="color" className="color_palette_input" value={value}
				onChange={(e) => onChange(e.target.value)} aria-label="직접 색상 선택" />
    </div>
  );
}
