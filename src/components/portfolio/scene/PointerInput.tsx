"use client";

import { useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { pointerState, puzzleSimulation } from "@/lib/portfolio/pointerState";

export default function PointerInput() {
  const viewport = useThree((state) => state.viewport);
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    const canvas = gl.domElement;
    let canvasRect = canvas.getBoundingClientRect();
    const updateCanvasRect = () => {
      canvasRect = canvas.getBoundingClientRect();
    };
    const resizeObserver = new ResizeObserver(updateCanvasRect);
    resizeObserver.observe(canvas);

    // 메인 섹션 캔버스 영역 안에 있을 때만 반응 (다른 섹션에서의 마우스 이동 무시)
    const isInside = (e: PointerEvent) =>
      e.clientX >= canvasRect.left &&
      e.clientX <= canvasRect.right &&
      e.clientY >= canvasRect.top &&
      e.clientY <= canvasRect.bottom;

    const setDown = (down: boolean) => {
      pointerState.down = down;
    };

    const parkPointer = () => {
      pointerState.down = false;
      pointerState.moved = false;
      pointerState.x = 0;
      pointerState.y = 0;
      pointerState.z = -100;
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") {
        parkPointer();
        return;
      }
      if (puzzleSimulation.paused) return;
      if (!isInside(e)) return;
      pointerState.moved = true;
      if (e.button === 0) setDown(true);
    };

    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerType === "touch") {
        parkPointer();
        return;
      }
      if (e.button === 0) setDown(false);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") {
        parkPointer();
        return;
      }
      if (puzzleSimulation.paused) return;
      if (!isInside(e)) return;
      pointerState.moved = true;
      pointerState.ndcX =
        ((e.clientX - canvasRect.left) / canvasRect.width) * 2 - 1;
      pointerState.ndcY =
        -((e.clientY - canvasRect.top) / canvasRect.height) * 2 + 1;
    };

    const onBlur = () => setDown(false);

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("blur", onBlur);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("blur", onBlur);
    };
  }, [gl]);

  useFrame((state) => {
    if (puzzleSimulation.paused || !pointerState.moved) return;
    const ndcX = pointerState.ndcX || state.pointer.x;
    const ndcY = pointerState.ndcY || state.pointer.y;
    pointerState.x = (ndcX * viewport.width) / 2;
    pointerState.y = (ndcY * viewport.height) / 2;
    pointerState.z = 2.5;
  });

  return null;
}
