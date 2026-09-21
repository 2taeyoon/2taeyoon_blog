"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Underlay from "@/components/portfolio/ui/Underlay";
import { buildPalette, syncPaletteCssVars } from "@/lib/portfolio/palette";
import {
  useHydratePortfolioSessionStore,
  usePortfolioSessionStore,
} from "@/stores/usePortfolioSessionStore";

export default function PortfolioChrome() {
  const pathname = usePathname();
  const isPortfolioRoute =
    pathname === "/" || pathname.startsWith("/project");

  if (!isPortfolioRoute) {
    return null;
  }

  return <ActivePortfolioChrome />;
}

function ActivePortfolioChrome() {
  useHydratePortfolioSessionStore();
  const themeColor = usePortfolioSessionStore((state) => state.themeColor);

  useEffect(() => {
    syncPaletteCssVars(buildPalette(themeColor));
  }, [themeColor]);

  return <Underlay />;
}
