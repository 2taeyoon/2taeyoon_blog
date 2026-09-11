"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { puzzleSimulation } from "@/lib/portfolio/pointerState";
import { playUiHover } from "@/lib/portfolio/uiSound";

const PROJECT_ITEMS = [
  {
    title: "project1",
    image: "/images/portfolio/project-section/mirror-01-solar-tide.png",
  },
  {
    title: "project2",
    image: "/images/portfolio/project-section/mirror-02-copper-vein.png",
  },
  {
    title: "project3",
    image: "/images/portfolio/project-section/mirror-03-amber-flux.png",
  },
  {
    title: "project4",
    image: "/images/portfolio/project-section/mirror-04-tide-pool.png",
  },
  {
    title: "project5",
    image: "/images/portfolio/project-section/mirror-05-gilded-smoke.png",
  },
  {
    title: "project6",
    image: "/images/portfolio/project-section/mirror-06-ink-bloom.png",
  },
  {
    title: "project7",
    image: "/images/portfolio/project-section/mirror-07-blue-orbit.png",
  },
  {
    title: "project8",
    image: "/images/portfolio/project-section/mirror-08-eclipse-current.png",
  },
];

const TRACK_COPIES = [0, 1, 2];
const AUTO_SPEED = 0.34;

function formatIndex(index: number) {
  return String(index + 1).padStart(2, "0");
}

function modulo(value: number, divisor: number) {
  return ((value % divisor) + divisor) % divisor;
}

export default function ProjectSection() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const waterDisplacementRef = useRef<SVGFEDisplacementMapElement>(null);
  const navigateRef = useRef<(index: number) => void>(() => {});
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    return () => puzzleSimulation.setPaused(false);
  }, []);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const position = { x: 0 };
    let period = 0;
    let cardWidth = 0;
    let stride = 0;
    let velocity = 0;
    let pointerId: number | null = null;
    let previousX = 0;
    let previousTime = 0;
    let navigating = false;
    let navigationTween: gsap.core.Tween | null = null;
    let hoveredCard: HTMLElement | null = null;
    let isHoveringCard = false;

    const setHoveredCard = (next: HTMLElement | null) => {
      if (hoveredCard === next) return;
      hoveredCard?.classList.remove("is_hovered");
      hoveredCard = next;
      if (hoveredCard) {
        hoveredCard.classList.add("is_hovered");
        playUiHover();
      }
      isHoveringCard = hoveredCard !== null;
    };

    const cardAtPoint = (clientX: number, clientY: number) => {
      const cards = track.querySelectorAll<HTMLElement>(".project_section_card");
      let best: HTMLElement | null = null;
      let bestDist = Number.POSITIVE_INFINITY;

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const reflection = card.querySelector(".project_panel_reflection");
        const reflectionRect = reflection?.getBoundingClientRect();
        const overCard =
          clientX >= rect.left &&
          clientX <= rect.right &&
          clientY >= rect.top &&
          clientY <= rect.bottom;
        const overReflection = Boolean(
          reflectionRect &&
            clientX >= reflectionRect.left &&
            clientX <= reflectionRect.right &&
            clientY >= reflectionRect.top &&
            clientY <= reflectionRect.bottom,
        );
        if (!overCard && !overReflection) return;

        const dist = Math.abs(clientX - (rect.left + rect.width / 2));
        if (dist < bestDist) {
          bestDist = dist;
          best = card;
        }
      });

      return best;
    };

    const updateHover = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || pointerId !== null) {
        setHoveredCard(null);
        return;
      }
      setHoveredCard(cardAtPoint(event.clientX, event.clientY));
    };
    let waterTime = 0;

    const applyPosition = () => {
      if (!period) return;

      while (position.x <= -period * 2) position.x += period;
      while (position.x > -period) position.x -= period;
      gsap.set(track, { x: position.x });

      const center = viewport.clientWidth / 2;
      const cylinderRadius = Math.max(viewport.clientWidth * 0.82, 520);
      const maxAngle = (58 * Math.PI) / 180;
      const cards = track.querySelectorAll<HTMLElement>(".project_section_card");

      cards.forEach((card) => {
        const set = card.parentElement;
        const cardTrackLeft = (set?.offsetLeft ?? 0) + card.offsetLeft;
        const linearX =
          cardTrackLeft + position.x + cardWidth / 2 - center;
        const angle = gsap.utils.clamp(
          -maxAngle,
          maxAngle,
          linearX / cylinderRadius,
        );
        const cylindricalX = cylinderRadius * Math.sin(angle);
        const cylindricalZ = cylinderRadius * (1 - Math.cos(angle));
        const edgeRatio = Math.min(Math.abs(angle) / maxAngle, 1);

        gsap.set(card, {
          x: cylindricalX - linearX,
          y: 0,
          z: cylindricalZ,
          rotationY: (-angle * 180) / Math.PI,
          scale: 1,
          opacity: 1 - edgeRatio * 0.24,
        });
      });

      const virtualIndex = Math.round(
        (center - position.x - cardWidth / 2) / stride,
      );
      const nextIndex = modulo(virtualIndex, PROJECT_ITEMS.length);

      if (nextIndex !== activeIndexRef.current) {
        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
      }
    };

    const measure = () => {
      const sets = track.querySelectorAll<HTMLElement>(".project_section_set");
      const cards = track.querySelectorAll<HTMLElement>(".project_section_card");
      if (sets.length < 2 || cards.length < 2) return;

      period = sets[1].offsetLeft - sets[0].offsetLeft;
      cardWidth = cards[0].offsetWidth;
      stride = cards[1].offsetLeft - cards[0].offsetLeft;

      const center = viewport.clientWidth / 2;
      position.x =
        center -
        cardWidth / 2 -
        period -
        activeIndexRef.current * stride;
      applyPosition();
    };

    const goToIndex = (targetIndex: number) => {
      if (!period || !stride) return;

      const center = viewport.clientWidth / 2;
      const currentVirtualIndex = Math.round(
        (center - position.x - cardWidth / 2) / stride,
      );
      const currentIndex = modulo(currentVirtualIndex, PROJECT_ITEMS.length);
      let delta = targetIndex - currentIndex;

      if (delta > PROJECT_ITEMS.length / 2) delta -= PROJECT_ITEMS.length;
      if (delta < -PROJECT_ITEMS.length / 2) delta += PROJECT_ITEMS.length;

      const targetVirtualIndex = currentVirtualIndex + delta;
      const targetX =
        center - cardWidth / 2 - targetVirtualIndex * stride;

      navigationTween?.kill();
      navigating = true;
      velocity = 0;
      navigationTween = gsap.to(position, {
        x: targetX,
        duration: reducedMotion.matches ? 0 : 0.9,
        ease: "power3.inOut",
        onUpdate: applyPosition,
        onComplete: () => {
          navigating = false;
          applyPosition();
        },
      });
    };

    navigateRef.current = goToIndex;

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;

      navigationTween?.kill();
      navigating = false;
      pointerId = event.pointerId;
      previousX = event.clientX;
      previousTime = performance.now();
      velocity = 0;
      viewport.dataset.dragging = "true";
      viewport.setPointerCapture(event.pointerId);
    };

    const handlePointerMove = (event: PointerEvent) => {
      updateHover(event);

      if (pointerId !== event.pointerId) return;

      const now = performance.now();
      const elapsed = Math.max(now - previousTime, 8);
      const movement = event.clientX - previousX;
      position.x += movement;
      velocity = (movement / elapsed) * 16.67;
      previousX = event.clientX;
      previousTime = now;
      applyPosition();
    };

    const releasePointer = (event: PointerEvent) => {
      if (pointerId !== event.pointerId) return;

      if (viewport.hasPointerCapture(event.pointerId)) {
        viewport.releasePointerCapture(event.pointerId);
      }
      pointerId = null;
      viewport.dataset.dragging = "false";
    };

    const handlePointerLeave = () => {
      setHoveredCard(null);
    };

    const tick = () => {
      const frameRatio = gsap.ticker.deltaRatio(60);
      waterTime += frameRatio / 60;
      const idleWave =
        Math.sin(waterTime * 1.7) * 3 +
        Math.sin(waterTime * 0.83 + 1.4) * 2;
      waterDisplacementRef.current?.setAttribute(
        "scale",
        String(16 + idleWave),
      );

      if (!period || pointerId !== null || navigating) return;

      if (Math.abs(velocity) > 0.04) {
        position.x += velocity * frameRatio;
        velocity *= Math.pow(0.94, frameRatio);
      } else if (!reducedMotion.matches && !isHoveringCard) {
        position.x -= AUTO_SPEED * frameRatio;
      }
      applyPosition();
    };

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(viewport);
    viewport.addEventListener("pointerdown", handlePointerDown);
    viewport.addEventListener("pointermove", handlePointerMove);
    viewport.addEventListener("pointerup", releasePointer);
    viewport.addEventListener("pointercancel", releasePointer);
    viewport.addEventListener("pointerleave", handlePointerLeave);
    gsap.ticker.add(tick);
    measure();

    return () => {
      setHoveredCard(null);
      navigationTween?.kill();
      resizeObserver.disconnect();
      viewport.removeEventListener("pointerdown", handlePointerDown);
      viewport.removeEventListener("pointermove", handlePointerMove);
      viewport.removeEventListener("pointerup", releasePointer);
      viewport.removeEventListener("pointercancel", releasePointer);
      viewport.removeEventListener("pointerleave", handlePointerLeave);
      gsap.ticker.remove(tick);
      navigateRef.current = () => {};
    };
  }, []);

  return (
    <section
      className="project_section"
      aria-labelledby="projectSectionTitle"
      onPointerEnter={() => puzzleSimulation.setPaused(true)}
      onPointerLeave={() => puzzleSimulation.setPaused(false)}
    >
      <svg className="project_section_filter" aria-hidden="true">
        <defs>
          <filter id="projectSectionFluid" x="-8%" y="-8%" width="116%" height="116%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.008 0.014"
              numOctaves="2"
              seed="7"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                dur="11s"
                values="0.008 0.014;0.012 0.009;0.007 0.016;0.008 0.014"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="6"
              xChannelSelector="R"
              yChannelSelector="B"
            />
          </filter>
          <filter id="projectSectionWater" x="-16%" y="-8%" width="132%" height="116%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.008 0.065"
              numOctaves="2"
              seed="12"
              result="waterNoise"
            >
              <animate
                attributeName="baseFrequency"
                dur="7s"
                values="0.008 0.065;0.014 0.052;0.006 0.074;0.008 0.065"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              ref={waterDisplacementRef}
              in="SourceGraphic"
              in2="waterNoise"
              scale="16"
              xChannelSelector="R"
              yChannelSelector="B"
            />
            <feGaussianBlur stdDeviation="0.35" />
          </filter>
        </defs>
      </svg>

      <header className="project_section_header">
        <h2 id="projectSectionTitle" className="project_section_title">
          Project
        </h2>
        <p className="project_section_eyebrow">
          미학과 기술의 조각을 하나의 경험으로 연결합니다.
        </p>
        <p className="project_section_description">
          Building digital experiences, one piece at a time.
        </p>
      </header>

      <div
        ref={viewportRef}
        className="project_section_viewport"
        data-dragging="false"
        aria-label="드래그할 수 있는 프로젝트 갤러리"
      >
        <div ref={trackRef} className="project_section_track">
          {TRACK_COPIES.map((copy) => (
            <div
              className="project_section_set"
              key={copy}
              aria-hidden={copy !== 1}
            >
              {PROJECT_ITEMS.map((work) => (
                <article
                  className="project_section_card"
                  key={`${copy}-${work.title}`}
                >
                  <p className="project_panel_title">{work.title}</p>
                  <div className="project_panel_surface">
                    <div className="project_panel_art">
                      <Image
                        className="project_panel_image"
                        src={work.image}
                        alt={
                          copy === 1
                            ? `${work.title} 유체 추상 프로젝트 이미지`
                            : ""
                        }
                        fill
                        sizes="(max-width: 560px) 70vw, (max-width: 900px) 42vw, 32rem"
                        draggable={false}
                      />
                    </div>

                    <div className="project_panel_reflection" aria-hidden="true">
                      <Image
                        className="project_panel_reflection_image"
                        src={work.image}
                        alt=""
                        fill
                        sizes="(max-width: 560px) 70vw, (max-width: 900px) 42vw, 32rem"
                        draggable={false}
                      />
                      <span className="project_panel_ripple" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>

      <footer className="project_section_footer">
        <p className="project_section_fraction" aria-live="polite">
          <span>{formatIndex(activeIndex)}</span>
          <span aria-hidden="true">/</span>
          <span>{String(PROJECT_ITEMS.length).padStart(2, "0")}</span>
        </p>
        <p className="project_section_active_title">
          {PROJECT_ITEMS[activeIndex].title}
        </p>
        <div className="project_section_pagination" aria-label="작품 선택">
          {PROJECT_ITEMS.map((work, index) => (
            <button
              key={work.title}
              className={index === activeIndex ? "is_active" : ""}
              type="button"
              aria-label={`${work.title} 보기`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => navigateRef.current(index)}
              onMouseEnter={playUiHover}
            />
          ))}
        </div>
      </footer>
    </section>
  );
}
