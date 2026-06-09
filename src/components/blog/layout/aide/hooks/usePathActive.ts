import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

/**
 * 현재 페이지가 특정 링크와 일치하는지 확인하는 훅
 * Hydration 에러 방지를 위해 마운트 후에만 동작
 */
export function usePathActive() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isPathActive = (href: string): boolean => {
    if (!isMounted) return false;
    if (!pathname) return false;
    if (pathname === href) return true;
    return pathname.startsWith(href + "/");
  };

  return { isPathActive };
}
