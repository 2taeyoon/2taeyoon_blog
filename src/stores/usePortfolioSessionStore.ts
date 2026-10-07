"use client";

import { useEffect } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ProjectFilter } from "@/data/portfolio/projects";

const PROJECT_FILTERS = [
  "all",
  "company-team",
  "company-maintenance",
  "personal-team",
  "personal-individual",
] as const satisfies readonly ProjectFilter[];

function isProjectFilter(value: unknown): value is ProjectFilter {
  return PROJECT_FILTERS.some((filter) => filter === value);
}

type PortfolioSessionState = {
  themeColor: string;
  musicEnabled: boolean;
  volume: number;
  projectPage: number;
  projectFilter: ProjectFilter;
  hasHydrated: boolean;
  setThemeColor: (themeColor: string) => void;
  setMusicEnabled: (musicEnabled: boolean) => void;
  setVolume: (volume: number) => void;
  setProjectPage: (projectPage: number) => void;
  setProjectFilter: (projectFilter: ProjectFilter) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

type PersistedPortfolioSessionState = Pick<
  PortfolioSessionState,
  "themeColor" | "musicEnabled" | "volume" | "projectPage" | "projectFilter"
>;

export const usePortfolioSessionStore = create<PortfolioSessionState>()(
  persist(
    (set) => ({
      themeColor: "fabric",
      musicEnabled: false,
      volume: 100,
      projectPage: 0,
      projectFilter: "all",
      hasHydrated: false,
      setThemeColor: (themeColor) => set({ themeColor }),
      setMusicEnabled: (musicEnabled) => set({ musicEnabled }),
      setVolume: (volume) =>
        set({ volume: Math.min(100, Math.max(0, volume)) }),
      setProjectPage: (projectPage) =>
        set({ projectPage: Math.max(0, projectPage) }),
      setProjectFilter: (projectFilter) =>
        set({
          projectFilter: isProjectFilter(projectFilter) ? projectFilter : "all",
        }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "portfolio-session-state",
      storage: createJSONStorage<PersistedPortfolioSessionState>(
        () => sessionStorage,
      ),
      partialize: ({
        themeColor,
        musicEnabled,
        volume,
        projectPage,
        projectFilter,
      }) => ({
        themeColor,
        musicEnabled,
        volume,
        projectPage,
        projectFilter: isProjectFilter(projectFilter) ? projectFilter : "all",
      }),
      skipHydration: true,
    },
  ),
);

export function useHydratePortfolioSessionStore() {
  useEffect(() => {
    if (!usePortfolioSessionStore.persist.hasHydrated()) {
      void Promise.resolve(
        usePortfolioSessionStore.persist.rehydrate(),
      ).finally(() =>
        usePortfolioSessionStore.getState().setHasHydrated(true),
      );
    }
  }, []);
}
