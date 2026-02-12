import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 640;

/**
 * 모바일 화면 크기 감지 및 사이드바 상태 관리 훅
 */
export function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const layoutRoot = document.querySelector(".RouteApp") as HTMLElement | null;

    const handleResize = () => {
      const mobile = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;
      setIsMobile(mobile);

      if (mobile) {
        layoutRoot?.classList.remove("open");
      } else {
        layoutRoot?.classList.add("open");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return { isMobile };
}
