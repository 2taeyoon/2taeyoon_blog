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
        // 모바일로 전환될 때는 사이드바를 완전히 닫힌 상태로 초기화
        layoutRoot?.classList.remove("open");
        layoutRoot?.classList.remove("close");
      } else {
        // 데스크탑에서는 기본적으로 사이드바가 열린 상태를 유지
        layoutRoot?.classList.add("open");
        layoutRoot?.classList.remove("close");
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
