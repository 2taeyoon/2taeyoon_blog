"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";
import { A11y, Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import ProjectScreenshotLightbox from "./ProjectScreenshotLightbox";

export interface ProjectScreenshot {
  src: string;
  alt: string;
}

interface ProjectScreenshotSliderProps {
  images: ProjectScreenshot[];
}

export default function ProjectScreenshotSlider({
  images,
}: ProjectScreenshotSliderProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const [openedImage, setOpenedImage] = useState<ProjectScreenshot | null>(null);
  const closeLightbox = useCallback(() => setOpenedImage(null), []);
  const canSlide = images.length > 1;

  return (
    <div className="project_screenshot">
      <Swiper
        className="project_screenshot_main"
        modules={[A11y, Navigation, Thumbs]}
        a11y={{
          prevSlideMessage: "이전 스크린샷",
          nextSlideMessage: "다음 스크린샷",
        }}
        navigation={canSlide}
        watchOverflow
        spaceBetween={0}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
      >
        {images.map((image) => (
          <SwiperSlide key={image.src}>
            <button
              type="button"
              aria-label={`${image.alt || "스크린샷"} 크게 보기`}
              onClick={() => setOpenedImage(image)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 700px) 92vw, 80vw"
              />
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        className="project_screenshot_thumbs"
        modules={[Thumbs]}
        watchSlidesProgress
        slidesPerView="auto"
        spaceBetween={12}
        onSwiper={setThumbsSwiper}
      >
        {images.map((image, index) => (
          <SwiperSlide key={image.src}>
            <button type="button" aria-label={`${index + 1}번 스크린샷 미리보기`}>
              <Image src={image.src} alt="" fill sizes="16rem" />
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
      {openedImage && (
        <ProjectScreenshotLightbox image={openedImage} onClose={closeLightbox} />
      )}
    </div>
  );
}
