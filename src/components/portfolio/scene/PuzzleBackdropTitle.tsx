"use client";

import { useRef } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { mainExit } from "@/lib/portfolio/pointerState";

const NUNITO_SANS =
  "https://fonts.gstatic.com/s/nunitosans/v19/pe1mMImSLYBIv1o4X1M8ce2xCx3yop4tQpF_MeTm0lfGWVpNn64CL7U8upHZIbMV51Q42ptCp5F5bxqqtQ1yiU4GVi5ntA.ttf";

const LETTERS = "Developer".split("");
const MID = (LETTERS.length - 1) / 2;
const LETTER_ADVANCE: Record<string, number> = {
  D: 0.72,
  e: 0.56,
  v: 0.58,
  l: 0.3,
  o: 0.62,
  p: 0.6,
  r: 0.44,
};

function letterHomes(fontSize: number) {
  const widths = LETTERS.map((letter) => (LETTER_ADVANCE[letter] ?? 0.56) * fontSize);
  const total = widths.reduce((sum, width) => sum + width, 0);
  let cursor = -total / 2;
  return widths.map((width) => {
    const x = cursor + width / 2;
    cursor += width;
    return x;
  });
}

export default function PuzzleBackdropTitle() {
  const viewport = useThree((state) => state.viewport);
  const fontSize = viewport.width * 0.15;
  const letterRefs = useRef<(THREE.Group | null)[]>([]);
  const homes = letterHomes(fontSize);

  useFrame(() => {
    const burst = Math.min(1, mainExit.progress);
    letterRefs.current.forEach((letter, index) => {
      if (!letter) return;
      const dir = index <= MID ? -1 : 1;
      const edge = Math.abs(index - MID) / MID;
      letter.position.x = homes[index] + dir * burst * (7 + edge * 11);
      letter.visible = burst < 0.98;
    });
  });

  return (
    <group position={[0, 0.12, -3.6]}>
      {LETTERS.map((letter, index) => (
        <group
          key={`${letter}-${index}`}
          ref={(node) => {
            letterRefs.current[index] = node;
          }}
          position={[homes[index], 0, 0]}
        >
          <Text
            font={NUNITO_SANS}
            fontSize={fontSize}
            letterSpacing={-0.05}
            color="#ffffff"
            fillOpacity={1}
            anchorX="center"
            anchorY="middle"
            material-toneMapped={false}
            frustumCulled={false}
          >
            {letter}
          </Text>
        </group>
      ))}
    </group>
  );
}
