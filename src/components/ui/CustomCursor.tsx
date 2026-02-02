"use client";

import { useEffect, useRef } from "react";


// "/" 에서만 사용: 기본 커서를 숨기고 커스텀 커서를 마우스 위치에 즉시 따라가게 함
export default function CustomCursor() {
	const cursorRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		document.body.style.cursor = "none";
		const handleMouseMove = (e: MouseEvent) => {
			const el = cursorRef.current;
			if (!el) return;
			el.style.left = `${e.clientX}px`;
			el.style.top = `${e.clientY}px`;
			el.style.transform = "translate(-100%, -100%)";
		};
		window.addEventListener("mousemove", handleMouseMove, { passive: true });
		return () => {
			document.body.style.cursor = "";
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, []);

	return (
		<div ref={cursorRef} className="custom-cursor" aria-hidden />
	);
}
