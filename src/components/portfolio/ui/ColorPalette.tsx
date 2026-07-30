"use client";

import React from "react";

/** hex가 아닌 특수 표면 프리셋 (텍스처) */
const NAMED_PRESETS = ["fabric"];

const PRESET_COLORS = [
  "fabric",
  "#b21210",
  "#e0761f",
  "#c2a10f",
  "#09770e",
  "#0033ff",
  "#001570",
  "#631e76",
];

const DEFAULT_CUSTOM_COLOR = "#0033ff";

function normalizeHex(hex: string) {
  return hex.toLowerCase();
}

function isHexColor(value: string) {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

function isPresetColor(value: string) {
  if (NAMED_PRESETS.includes(value)) return true;
  return PRESET_COLORS.some(
    (c) => !NAMED_PRESETS.includes(c) && normalizeHex(c) === normalizeHex(value),
  );
}

function toColorInputValue(value: string) {
  return isHexColor(value) ? normalizeHex(value) : DEFAULT_CUSTOM_COLOR;
}

export function ColorPalette({
  value,
  onChange,
}: {
  value: string;
  onChange: (color: string) => void;
}) {
  const selectedPreset = NAMED_PRESETS.includes(value)
    ? value
    : isPresetColor(value)
      ? normalizeHex(value)
      : null;

  const inputValue = toColorInputValue(value);
  const previewIsFabric = value === "fabric";

  return (
    <div className="color_palette" onPointerDown={(e) => e.stopPropagation()}>
      <p className="color_palette_label">COLOR</p>

      <div className="color_palette_swatches" role="radiogroup" aria-label="공 색상 선택">
        {PRESET_COLORS.map((color) => {
          const isNamed = NAMED_PRESETS.includes(color);
          const isSelected = selectedPreset === (isNamed ? color : normalizeHex(color));
          return (
            <button
              key={color}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={`color_palette_swatch${color === "fabric" ? " color_palette_swatch_fabric" : ""}${isSelected ? " is_selected" : ""}`}
              style={isNamed ? undefined : ({ "--swatch-color": color } as React.CSSProperties)}
              onClick={() => onChange(color)}
            />
          );
        })}
      </div>

      <hr className="color_palette_divider" />

      {/* 모바일에서 programmatic click()이 막히므로 label + 투명 input 오버레이로 직접 탭 */}
      <label className="color_palette_custom">
        <span>직접 선택</span>
        <span
          className={`color_palette_custom_preview${previewIsFabric ? " color_palette_swatch_fabric" : ""}`}
          style={previewIsFabric ? undefined : { backgroundColor: inputValue }}
          aria-hidden="true"
        />
        <input
          type="color"
          className="color_palette_input"
          value={inputValue}
          onChange={(e) => onChange(e.target.value)}
          aria-label="직접 색상 선택"
        />
      </label>
    </div>
  );
}
