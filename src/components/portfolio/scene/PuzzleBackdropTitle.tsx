"use client";

import { useRef } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { mainExit } from "@/lib/portfolio/pointerState";

const NUNITO_SANS =
  "https://fonts.gstatic.com/s/nunitosans/v19/pe1mMImSLYBIv1o4X1M8ce2xCx3yop4tQpF_MeTm0lfGWVpNn64CL7U8upHZIbMV51Q42ptCp5F5bxqqtQ1yiU4GVi5ntA.ttf";

const LETTERS = "Developer".split("");
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
  const size = useThree((state) => state.size);
  const fontSize = viewport.width * 0.15;
  const titleRef = useRef<THREE.Group>(null);
  const textRefs = useRef<THREE.Mesh[]>([]);
  const homes = letterHomes(fontSize);

  useFrame(() => {
    const progress = Math.min(1, mainExit.progress);
    const opacity = 1 - THREE.MathUtils.smoothstep(progress, 0.04, 0.72);
    const scale = 1 + progress * 0.12;

    titleRef.current?.scale.setScalar(scale);
    titleRef.current?.position.set(0, 0.12, -3.6);
    textRefs.current.forEach((text) => {
      const material = text.material as THREE.Material & { opacity: number };
      material.transparent = true;
      material.opacity = opacity;
      text.visible = opacity > 0.01;
    });
  });

  if (size.width <= 640) return null;

  return (
    <group ref={titleRef} position={[0, 0.12, -3.6]}>
      {LETTERS.map((letter, index) => (
        <group
          key={`${letter}-${index}`}
          position={[homes[index], 0, 0]}
        >
          <Text
            ref={(node) => {
              if (node) textRefs.current[index] = node;
            }}
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
