"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Underlay from "@/components/portfolio/ui/Underlay";
import { buildPalette, syncPaletteCssVars, syncThemeAccent } from "@/lib/portfolio/palette";
import {
  useHydratePortfolioSessionStore,
  usePortfolioSessionStore,
} from "@/stores/usePortfolioSessionStore";

export default function PortfolioChrome() {
  const pathname = usePathname();
  const isPortfolioRoute =
    pathname === "/" || pathname.startsWith("/projects");

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
    syncThemeAccent(themeColor);
  }, [themeColor]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("portfolio_scroll");
    root.classList.toggle("portfolio_theme_default", themeColor === "fabric");
    return () => {
      root.classList.remove("portfolio_scroll");
      root.classList.remove("portfolio_theme_default");
      root.style.removeProperty("--pfScrollThumb");
    };
  }, [themeColor]);

  return <Underlay />;
}
