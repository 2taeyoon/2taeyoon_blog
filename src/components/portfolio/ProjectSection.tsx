"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import ProjectPageFloaters from "@/components/portfolio/project/ProjectPageFloaters";
import { featuredProjects } from "@/data/portfolio/projects";
import {
  mainExit,
  puzzleSimulation,
} from "@/lib/portfolio/pointerState";
import { playUiHover } from "@/lib/portfolio/uiSound";

const PROJECT_ITEMS = featuredProjects.map(({ title, image, slug }) => ({
  title,
  image,
  slug,
}));

const TRACK_COPIES = [0, 1, 2];
const AUTO_SPEED = 0.34;
const WATER_FRAME_TIME = 1 / 30;

interface CardLayout {
  element: HTMLElement;
  reflection: Element | null;
  trackLeft: number;
  visible: boolean;
}

function formatIndex(index: number) {
  return String(index + 1).padStart(2, "0");
}

function modulo(value: number, divisor: number) {
  return ((value % divisor) + divisor) % divisor;
}

export default function ProjectSection() {
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const waterDisplacementRef = useRef<SVGFEDisplacementMapElement>(null);
  const waterTurbulenceRef = useRef<SVGFETurbulenceElement>(null);
  const navigateRef = useRef<(index: number) => void>(() => {});
  const draggedRef = useRef(false);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showFloaters, setShowFloaters] = useState(false);

  useEffect(() => {
    return () => puzzleSimulation.setPaused(false);
  }, []);

  useEffect(() => {
    const root = document.querySelector(".portfolio_sections");
    if (!root) return;

    const read = () => {
      const value = Number(getComputedStyle(root).getPropertyValue("--project-enter"));
      setShowFloaters(value > 0.05);
    };

    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ["style"] });
    return () => observer.disconnect();
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
    let cardLayouts: CardLayout[] = [];

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
      let best: HTMLElement | null = null;
      let bestDist = Number.POSITIVE_INFINITY;

      cardLayouts.forEach(({ element: card, reflection, visible }) => {
        if (!visible) return;
        const rect = card.getBoundingClientRect();
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
    let waterElapsed = 0;

    const applyPosition = () => {
      if (!period) return;

      while (position.x <= -period * 2) position.x += period;
      while (position.x > -period) position.x -= period;
      track.style.transform = `translate3d(${position.x}px, 0, 0)`;

      const center = viewport.clientWidth / 2;
      const cylinderRadius = Math.max(viewport.clientWidth * 0.82, 520);
      const maxAngle = (58 * Math.PI) / 180;
      const renderLimit = center + cardWidth * 1.5;

      cardLayouts.forEach((layout) => {
        const card = layout.element;
        const linearX =
          layout.trackLeft + position.x + cardWidth / 2 - center;
        const visible = Math.abs(linearX) <= renderLimit;
        if (layout.visible !== visible) {
          layout.visible = visible;
          card.style.visibility = visible ? "visible" : "hidden";
          card.style.willChange = visible ? "transform, opacity" : "auto";
        }
        if (!visible) {
          if (hoveredCard === card) setHoveredCard(null);
          return;
        }

        const angle = gsap.utils.clamp(
          -maxAngle,
          maxAngle,
          linearX / cylinderRadius,
        );
        const cylindricalX = cylinderRadius * Math.sin(angle);
        const cylindricalZ = cylinderRadius * (1 - Math.cos(angle));
        const edgeRatio = Math.min(Math.abs(angle) / maxAngle, 1);

        card.style.transform =
          `translate3d(${cylindricalX - linearX}px, 0, ${cylindricalZ}px) ` +
          `rotateY(${(-angle * 180) / Math.PI}deg)`;
        card.style.opacity = String(1 - edgeRatio * 0.24);
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
      cardLayouts = Array.from(cards, (card) => ({
        element: card,
        reflection: card.querySelector(".project_panel_reflection"),
        trackLeft:
          (card.parentElement?.offsetLeft ?? 0) + card.offsetLeft,
        visible: false,
      }));

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

    let pressStartX = 0;
    let pressStartY = 0;
    let pressSlug: string | null = null;

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

      const card = (event.target as Element).closest<HTMLElement>(
        "[data-project-slug]",
      );
      pressStartX = event.clientX;
      pressStartY = event.clientY;
      pressSlug = card?.dataset.projectSlug ?? null;
      draggedRef.current = false;

      navigationTween?.kill();
      navigating = false;
      pointerId = event.pointerId;
      previousX = event.clientX;
      previousTime = performance.now();
      velocity = 0;
      viewport.dataset.dragging = "true";
      if (event.pointerType === "mouse") event.preventDefault();
      viewport.setPointerCapture(event.pointerId);
    };

    const handlePointerMove = (event: PointerEvent) => {
      updateHover(event);

      if (pointerId !== event.pointerId) return;

      const now = performance.now();
      const elapsed = Math.max(now - previousTime, 8);
      const movement = event.clientX - previousX;
      const travelX = event.clientX - pressStartX;
      const travelY = event.clientY - pressStartY;
      if (travelX * travelX + travelY * travelY > 36) draggedRef.current = true;
      position.x += movement;
      velocity = (movement / elapsed) * 16.67;
      previousX = event.clientX;
      previousTime = now;
      applyPosition();
    };

    const releasePointer = (event: PointerEvent) => {
      if (pointerId !== event.pointerId) return;

      const slug = pressSlug;
      const shouldOpen = Boolean(slug) && !draggedRef.current;
      pressSlug = null;

      if (viewport.hasPointerCapture(event.pointerId)) {
        viewport.releasePointerCapture(event.pointerId);
      }
      pointerId = null;
      viewport.dataset.dragging = "false";

      if (shouldOpen && slug) {
        routerRef.current.push(`/projects/${slug}`);
      }
    };

    const handlePointerLeave = () => {
      setHoveredCard(null);
    };

    const handleClickCapture = (event: MouseEvent) => {
      if (!draggedRef.current) return;
      event.preventDefault();
      event.stopPropagation();
    };

    const tick = () => {
      const frameRatio = gsap.ticker.deltaRatio(60);
      const elapsed = frameRatio / 60;

      if (mainExit.progress > 0.05) {
        waterTime += elapsed;
        waterElapsed += elapsed;
        if (waterElapsed >= WATER_FRAME_TIME) {
          waterElapsed %= WATER_FRAME_TIME;
          const idleWave =
            Math.sin(waterTime * 1.7) * 8 +
            Math.sin(waterTime * 0.83 + 1.4) * 5;
          const flow = Math.sin(waterTime * 0.9);
          waterDisplacementRef.current?.setAttribute(
            "scale",
            String(14 + idleWave),
          );
          waterTurbulenceRef.current?.setAttribute(
            "baseFrequency",
            `${0.007 + flow * 0.003} ${0.045 + Math.sin(waterTime * 1.35) * 0.018}`,
          );
        }
      }

      if (mainExit.progress < 0.75) return;
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
    viewport.addEventListener("click", handleClickCapture, true);
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
      viewport.removeEventListener("click", handleClickCapture, true);
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
      {showFloaters && <ProjectPageFloaters variant="section" />}

      <svg className="project_section_filter" aria-hidden="true">
        <defs>
          <filter id="projectSectionFluid" x="-8%" y="-8%" width="116%" height="116%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.008 0.014"
              numOctaves="2"
              seed="7"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="6"
              xChannelSelector="R"
              yChannelSelector="B"
            />
          </filter>
          <filter id="projectSectionWater" x="-20%" y="-24%" width="140%" height="148%">
            <feTurbulence
              ref={waterTurbulenceRef}
              type="fractalNoise"
              baseFrequency="0.008 0.05"
              numOctaves="2"
              seed="12"
              result="waterNoise"
            />
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
              {PROJECT_ITEMS.map((work, index) => (
                <Link
                  className="project_section_card"
                  href={`/projects/${work.slug}`}
                  key={`${copy}-${work.slug}`}
                  data-project-slug={work.slug}
                  tabIndex={copy === 1 ? undefined : -1}
                  draggable={false}
                  onDragStart={(event) => event.preventDefault()}
                  onClick={(event) => {
                    if (draggedRef.current) {
                      event.preventDefault();
                      draggedRef.current = false;
                      return;
                    }
                    if (event.detail === 0) return;
                    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                    event.preventDefault();
                  }}
                >
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
                      <div className="project_panel_reflection_mirror">
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
                  </div>
                </Link>
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
        <Link
          className="project_section_view_all"
          href="/projects"
          onMouseEnter={playUiHover}
        >
          View All Projects
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 19L19 5M9 5h10v10" />
          </svg>
        </Link>
      </footer>
    </section>
  );
}
