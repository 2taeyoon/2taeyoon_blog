"use client";

import CustomCursor from "@/components/ui/CustomCursor";
import DotFieldCanvas from "@/components/canvas/DotFieldCanvas";

export default function Home() {
	return (
		<>
			<DotFieldCanvas />
			<CustomCursor />
		</>
	);
}