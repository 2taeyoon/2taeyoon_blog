"use client";

import { useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { pointerState } from "@/lib/portfolio/pointerState";

export default function PointerInput() {
  const viewport = useThree((state) => state.viewport);
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    const canvas = gl.domElement;

    // 메인 섹션 캔버스 영역 안에 있을 때만 반응 (다른 섹션에서의 마우스 이동 무시)
    const isInside = (e: PointerEvent, rect: DOMRect) =>
      e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;

    const setDown = (down: boolean) => {
      pointerState.down = down;
    };

    const onPointerDown = (e: PointerEvent) => {
      if (!isInside(e, canvas.getBoundingClientRect())) return;
      pointerState.moved = true;
      if (e.button === 0) setDown(true);
    };

    const onPointerUp = (e: PointerEvent) => {
      if (e.button === 0) setDown(false);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (!isInside(e, rect)) return;
      pointerState.moved = true;
      pointerState.ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointerState.ndcY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onBlur = () => setDown(false);

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("blur", onBlur);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("blur", onBlur);
    };
  }, [gl]);

  useFrame((state) => {
    if (!pointerState.moved) return;
    const ndcX = pointerState.ndcX || state.pointer.x;
    const ndcY = pointerState.ndcY || state.pointer.y;
    pointerState.x = (ndcX * viewport.width) / 2;
    pointerState.y = (ndcY * viewport.height) / 2;
    pointerState.z = 2.5;
  });

  return null;
}
