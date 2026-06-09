/**
 * 사이드바 열기/닫기 기능을 관리하는 훅
 */
export function useSidebarToggle() {
  const handleClose = () => {
    const layoutRoot = document.querySelector(".RouteApp") as HTMLElement | null;
    if (!layoutRoot) return;

    const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;

    if (isMobile) {
      // 모바일에서는 close 클래스를 절대 사용하지 않고, open만 제거
      layoutRoot.classList.remove("open");
      layoutRoot.classList.remove("close");
    } else {
      layoutRoot.classList.add("close");
      layoutRoot.classList.remove("open");
    }
  };

  const handleOpen = () => {
    const layoutRoot = document.querySelector(".RouteApp") as HTMLElement | null;
    if (!layoutRoot) return;

    const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;

    if (isMobile) {
      layoutRoot.classList.add("open");
      layoutRoot.classList.remove("close");
    } else {
      layoutRoot.classList.remove("close");
      layoutRoot.classList.add("open");
    }
  };

  return { handleClose, handleOpen };
}
