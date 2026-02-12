/**
 * 사이드바 열기/닫기 기능을 관리하는 훅
 */
export function useSidebarToggle() {
  const handleClose = () => {
    const layoutRoot = document.querySelector(".RouteApp") as HTMLElement | null;
    layoutRoot?.classList.add("close");
  };

  const handleOpen = () => {
    const layoutRoot = document.querySelector(".RouteApp") as HTMLElement | null;
    layoutRoot?.classList.remove("close");
  };

  return { handleClose, handleOpen };
}
