"use client";

import { useLayoutEffect } from "react";
import { useThree } from "@react-three/fiber";
import type { PerspectiveCamera } from "three";

const BASE_FOV = 35;
const BASE_Z = 20;

/** 뷰포트 비율에 맞춰 FOV·카메라 거리를 조정해 좁은 화면에서도 큐브가 잘리지 않게 함 */
export default function ResponsiveCamera() {
  const camera = useThree((state) => state.camera) as PerspectiveCamera;
  const size = useThree((state) => state.size);

  useLayoutEffect(() => {
    const aspect = size.width / Math.max(size.height, 1);

    if (aspect < 0.85) {
      const narrow = 0.85 - aspect;
      camera.fov = BASE_FOV + narrow * 22;
      camera.position.z = BASE_Z + narrow * 10;
    } else if (aspect > 1.6) {
      const wide = aspect - 1.6;
      camera.fov = Math.max(28, BASE_FOV - wide * 8);
      camera.position.z = BASE_Z;
    } else {
      camera.fov = BASE_FOV;
      camera.position.z = BASE_Z;
    }

    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  return null;
}
