"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ProjectScreenshot } from "./ProjectScreenshotSlider";

interface ProjectScreenshotLightboxProps {
  images: ProjectScreenshot[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

// 브라우저 기본 이미지 뷰어처럼 화면에 맞춰 보여주고, 클릭하면 원본 크기로 확대
export default function ProjectScreenshotLightbox({
  images,
  index,
  onIndexChange,
  onClose,
}: ProjectScreenshotLightboxProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [zoomable, setZoomable] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const image = images[index];
  const hasPrev = index > 0;
  const hasNext = index < images.length - 1;

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft" && hasPrev) onIndexChange(index - 1);
      if (event.key === "ArrowRight" && hasNext) onIndexChange(index + 1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [index, hasPrev, hasNext, onIndexChange, onClose]);

  // 다른 이미지로 넘어가면 확대 상태와 스크롤을 처음으로
  useEffect(() => {
    setZoomed(false);
    setZoomable(false);
    overlayRef.current?.scrollTo(0, 0);
  }, [index]);

  // 화면에 맞춘 크기가 원본보다 작을 때만 확대 가능
  const checkZoomable = () => {
    const img = imageRef.current;
    if (!img) return;
    setZoomable(
      img.naturalWidth > img.clientWidth + 1 ||
        img.naturalHeight > img.clientHeight + 1,
    );
  };

  useEffect(() => {
    window.addEventListener("resize", checkZoomable);
    return () => window.removeEventListener("resize", checkZoomable);
  }, []);

  const handleImageClick = (event: React.MouseEvent<HTMLImageElement>) => {
    event.stopPropagation();
    if (zoomed) {
      setZoomed(false);
      return;
    }
    if (!zoomable) return;

    // 클릭한 지점이 확대 후에도 화면 가운데 오도록 스크롤
    const rect = event.currentTarget.getBoundingClientRect();
    const ratioX = (event.clientX - rect.left) / rect.width;
    const ratioY = (event.clientY - rect.top) / rect.height;
    setZoomed(true);
    requestAnimationFrame(() => {
      const overlay = overlayRef.current;
      const img = imageRef.current;
      if (!overlay || !img) return;
      overlay.scrollTo(
        img.offsetLeft + img.offsetWidth * ratioX - overlay.clientWidth / 2,
        img.offsetTop + img.offsetHeight * ratioY - overlay.clientHeight / 2,
      );
    });
  };

  const className = [
    "project_lightbox",
    zoomed && "is_zoomed",
    zoomable && "is_zoomable",
  ]
    .filter(Boolean)
    .join(" ");

  return createPortal(
    <div
      ref={overlayRef}
      className={className}
      role="dialog"
      aria-modal="true"
      aria-label={image.alt || "스크린샷 크게 보기"}
      onClick={onClose}
    >
      <div className="project_lightbox_stage">
        <img
          key={image.src}
          ref={imageRef}
          src={image.src}
          alt={image.alt}
          onLoad={checkZoomable}
          onClick={handleImageClick}
        />
      </div>
      <button
        type="button"
        className="project_lightbox_close"
        aria-label="닫기"
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
      {images.length > 1 && (
        <>
          <button
            type="button"
            className="project_lightbox_nav is_prev"
            aria-label="이전 스크린샷"
            aria-disabled={!hasPrev}
            onClick={(event) => {
              event.stopPropagation();
              if (hasPrev) onIndexChange(index - 1);
            }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <button
            type="button"
            className="project_lightbox_nav is_next"
            aria-label="다음 스크린샷"
            aria-disabled={!hasNext}
            onClick={(event) => {
              event.stopPropagation();
              if (hasNext) onIndexChange(index + 1);
            }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <p className="project_lightbox_count">
            {index + 1} / {images.length}
          </p>
        </>
      )}
    </div>,
    document.body,
  );
}
