"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import ProjectShowcaseCard from "@/components/portfolio/ui/ProjectShowcaseCard";
import ProjectDetail from "@/components/portfolio/ui/ProjectDetail";
import {
  SHOWCASE_PROJECTS,
  type ShowcaseProject,
  type ShowcaseProjectId,
} from "@/data/portfolio/showcaseProjects";

type ShowcaseMode = "gallery" | "detail";
type ParticleStyle = CSSProperties & Record<`--${string}`, string>;

const GLASS_PARTICLES: ParticleStyle[] = [
  {
    "--particle-x": "5%",
    "--particle-size": "22px",
    "--particle-r": "18deg",
    "--particle-duration": "12s",
    "--particle-delay": "-4s",
    "--particle-drift": "44px",
  },
  {
    "--particle-x": "17%",
    "--particle-size": "12px",
    "--particle-r": "74deg",
    "--particle-duration": "9s",
    "--particle-delay": "-1s",
    "--particle-drift": "-32px",
  },
  {
    "--particle-x": "31%",
    "--particle-size": "18px",
    "--particle-r": "-20deg",
    "--particle-duration": "14s",
    "--particle-delay": "-7s",
    "--particle-drift": "58px",
  },
  {
    "--particle-x": "44%",
    "--particle-size": "9px",
    "--particle-r": "48deg",
    "--particle-duration": "11s",
    "--particle-delay": "-5s",
    "--particle-drift": "-38px",
  },
  {
    "--particle-x": "58%",
    "--particle-size": "26px",
    "--particle-r": "12deg",
    "--particle-duration": "15s",
    "--particle-delay": "-8s",
    "--particle-drift": "30px",
  },
  {
    "--particle-x": "69%",
    "--particle-size": "13px",
    "--particle-r": "92deg",
    "--particle-duration": "10s",
    "--particle-delay": "-3s",
    "--particle-drift": "-52px",
  },
  {
    "--particle-x": "79%",
    "--particle-size": "20px",
    "--particle-r": "32deg",
    "--particle-duration": "13s",
    "--particle-delay": "-6s",
    "--particle-drift": "42px",
  },
  {
    "--particle-x": "89%",
    "--particle-size": "15px",
    "--particle-r": "-14deg",
    "--particle-duration": "12s",
    "--particle-delay": "-9s",
    "--particle-drift": "-28px",
  },
  {
    "--particle-x": "96%",
    "--particle-size": "8px",
    "--particle-r": "56deg",
    "--particle-duration": "9s",
    "--particle-delay": "-2s",
    "--particle-drift": "34px",
  },
];

const INITIAL_DETAIL = SHOWCASE_PROJECTS[1];

export default function ProjectSection2() {
  const rootRef = useRef<HTMLElement>(null);
  const detailScrollRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const cardRefs = useRef<Record<ShowcaseProjectId, HTMLButtonElement | null>>({
    codex: null,
    claude: null,
    cursor: null,
  });
  const pointerRef = useRef({
    x: 0,
    y: 0,
    clientX: -10000,
    clientY: -10000,
  });
  const animationFrameRef = useRef(0);
  const toastTimerRef = useRef<number | undefined>(undefined);
  const transitionTimerRef = useRef<number | undefined>(undefined);
  const focusTimerRef = useRef<number | undefined>(undefined);
  const reducedMotionRef = useRef(false);

  const [mode, setMode] = useState<ShowcaseMode>("gallery");
  const [selectedId, setSelectedId] = useState<ShowcaseProjectId | null>(null);
  const [saved, setSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const selectedProject = useMemo(
    () => SHOWCASE_PROJECTS.find((project) => project.id === selectedId) ?? INITIAL_DETAIL,
    [selectedId],
  );

  const showToast = useCallback((message: string) => {
    window.clearTimeout(toastTimerRef.current);
    setToastMessage(message);
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage("");
    }, 1800);
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => {
      reducedMotionRef.current = reducedMotion.matches;
    };

    reducedMotion.addEventListener("change", syncMotionPreference);
    syncMotionPreference();

    return () => {
      reducedMotion.removeEventListener("change", syncMotionPreference);
    };
  }, []);

  const updateParallax = useCallback(() => {
    animationFrameRef.current = 0;
    if (reducedMotionRef.current) return;

    const root = rootRef.current;
    const selectedCard = selectedId ? cardRefs.current[selectedId] : null;
    if (!root) return;

    if (mode === "detail" && selectedCard) {
      const rootBounds = root.getBoundingClientRect();
      const projectBounds = selectedCard.getBoundingClientRect();
      const projectCenterX = projectBounds.left + projectBounds.width / 2;
      const projectCenterY = projectBounds.top + projectBounds.height / 2;
      const { clientX, clientY } = pointerRef.current;
      const pointerInside =
        clientX >= rootBounds.left &&
        clientX <= rootBounds.right &&
        clientY >= rootBounds.top &&
        clientY <= rootBounds.bottom;
      const horizontalReach =
        clientX < projectCenterX
          ? Math.max(projectCenterX - rootBounds.left, 1)
          : Math.max(rootBounds.right - projectCenterX, 1);
      const verticalReach =
        clientY < projectCenterY
          ? Math.max(projectCenterY - rootBounds.top, 1)
          : Math.max(rootBounds.bottom - projectCenterY, 1);
      const viewportX = pointerInside
        ? Math.max(-1, Math.min(1, (clientX - projectCenterX) / horizontalReach))
        : -5 / 16;
      const viewportY = pointerInside
        ? Math.max(-1, Math.min(1, (clientY - projectCenterY) / verticalReach))
        : 0;

      selectedCard.style.setProperty("--detail-yaw", `${viewportX * 16}deg`);
      selectedCard.style.setProperty("--detail-pitch", `${viewportY * -10}deg`);
      selectedCard.dataset.orbiting = String(pointerInside);
      return;
    }

    if (mode !== "gallery") return;

    const { x, y } = pointerRef.current;
    root.style.setProperty("--mx", `${x * 11}px`);
    root.style.setProperty("--my", `${y * 8}px`);
    SHOWCASE_PROJECTS.forEach((project, index) => {
      const depth = index === 1 ? 1 : 0.58;
      const card = cardRefs.current[project.id];
      card?.style.setProperty("--local-x", `${x * 15 * depth}px`);
      card?.style.setProperty("--local-y", `${y * 9 * depth}px`);
    });
  }, [mode, selectedId]);

  const requestParallaxUpdate = useCallback(() => {
    if (!animationFrameRef.current) {
      animationFrameRef.current = window.requestAnimationFrame(updateParallax);
    }
  }, [updateParallax]);

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerRef.current = {
      x: (event.clientX - bounds.left) / bounds.width - 0.5,
      y: (event.clientY - bounds.top) / bounds.height - 0.5,
      clientX: event.clientX,
      clientY: event.clientY,
    };
    requestParallaxUpdate();
  };

  const handlePointerLeave = () => {
    pointerRef.current = {
      x: 0,
      y: 0,
      clientX: -10000,
      clientY: -10000,
    };
    requestParallaxUpdate();
  };

  const selectProject = (project: ShowcaseProject) => {
    if (mode === "detail") return;

    window.clearTimeout(transitionTimerRef.current);
    setSelectedId(project.id);
    setSaved(false);
    setMode("detail");
    detailScrollRef.current?.scrollTo({ top: 0 });

    const card = cardRefs.current[project.id];
    card?.style.setProperty("--detail-yaw", "-5deg");
    card?.style.setProperty("--detail-pitch", "0deg");
    if (card) card.dataset.orbiting = "false";
  };

  const closeDetail = useCallback(() => {
    if (mode !== "detail" || !selectedId) return;

    const closingId = selectedId;
    const closingCard = cardRefs.current[closingId];
    setMode("gallery");
    closingCard?.style.setProperty("--detail-yaw", "-5deg");
    closingCard?.style.setProperty("--detail-pitch", "0deg");
    if (closingCard) closingCard.dataset.orbiting = "false";

    transitionTimerRef.current = window.setTimeout(() => {
      setSelectedId(null);
      cardRefs.current[closingId]?.focus({ preventScroll: true });
    }, reducedMotionRef.current ? 0 : 700);
  }, [mode, selectedId]);

  useEffect(() => {
    if (mode !== "detail") return;

    detailScrollRef.current?.scrollTo({ top: 0 });
    focusTimerRef.current = window.setTimeout(() => {
      closeButtonRef.current?.focus({ preventScroll: true });
    }, reducedMotionRef.current ? 0 : 700);

    return () => window.clearTimeout(focusTimerRef.current);
  }, [mode, selectedId]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      closeDetail();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [closeDetail]);

  useEffect(
    () => () => {
      window.cancelAnimationFrame(animationFrameRef.current);
      window.clearTimeout(toastTimerRef.current);
      window.clearTimeout(transitionTimerRef.current);
      window.clearTimeout(focusTimerRef.current);
    },
    [],
  );

  const toggleSave = () => {
    const nextSaved = !saved;
    setSaved(nextSaved);
    showToast(
      nextSaved
        ? "Saved to your reading list."
        : "Removed from your reading list.",
    );
  };

  return (
    <section
      id="projects"
      ref={rootRef}
      className="project_section2"
      data-mode={mode}
      aria-label="Project Showcase"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="stage" role="region" aria-label="Interactive web project gallery">
        <h2 className="hero-word" aria-hidden="true">
          Project
        </h2>

        <div className="gallery" aria-label="Selected web development projects">
          {SHOWCASE_PROJECTS.map((project) => (
            <ProjectShowcaseCard
              key={project.id}
              project={project}
              selected={selectedId === project.id}
              disabled={selectedId !== null}
              cardRef={(node) => {
                cardRefs.current[project.id] = node;
              }}
              onSelect={selectProject}
            />
          ))}
        </div>

        <ProjectDetail
          project={selectedProject}
          hidden={mode !== "detail"}
          saved={saved}
          scrollRef={detailScrollRef}
          onSave={toggleSave}
          onToast={showToast}
        />

        <button
          ref={closeButtonRef}
          className="close-button"
          type="button"
          aria-label="Close detail view"
          tabIndex={mode === "detail" ? 0 : -1}
          onClick={closeDetail}
        >
          ×
        </button>

        <div className="glass-particle-field" aria-hidden="true">
          {GLASS_PARTICLES.map((style, index) => (
            <span className="glass-particle" style={style} key={index}>
              <i />
            </span>
          ))}
        </div>
      </div>

      <div
        className="toast"
        role="status"
        aria-live="polite"
        data-show={toastMessage ? "true" : "false"}
      >
        {toastMessage}
      </div>
    </section>
  );
}
