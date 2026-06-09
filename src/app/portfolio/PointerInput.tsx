"use client";

import { useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { pointerState } from "./pointerState";

export default function PointerInput() {
  const viewport = useThree((state) => state.viewport);

  useEffect(() => {
    const setDown = (down: boolean) => {
      pointerState.down = down;
    };

    const onPointerDown = (e: PointerEvent) => {
      pointerState.moved = true;
      if (e.button === 0) setDown(true);
    };

    const onPointerUp = (e: PointerEvent) => {
      if (e.button === 0) setDown(false);
    };

    const onPointerMove = (e: PointerEvent) => {
      pointerState.moved = true;
      pointerState.ndcX = (e.clientX / window.innerWidth) * 2 - 1;
      pointerState.ndcY = -(e.clientY / window.innerHeight) * 2 + 1;
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
  }, []);

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
