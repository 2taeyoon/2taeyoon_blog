"use client";

import { Text } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

const NUNITO_SANS =
  "https://fonts.gstatic.com/s/nunitosans/v19/pe1mMImSLYBIv1o4X1M8ce2xCx3yop4tQpF_MeTm0lfGWVpNn64CL7U8upHZIbMV51Q42ptCp5F5bxqqtQ1yiU4GVi5ntA.ttf";

export default function PuzzleBackdropTitle() {
  const viewport = useThree((state) => state.viewport);
  const fontSize = viewport.width * 0.15;

  return (
    <Text
      position={[0, 0.12, -3.6]}
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
      Developer
    </Text>
  );
}
