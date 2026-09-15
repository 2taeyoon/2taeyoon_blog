"use client";

import { useEffect } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type PortfolioSessionState = {
  themeColor: string;
  musicEnabled: boolean;
  volume: number;
  hasHydrated: boolean;
  setThemeColor: (themeColor: string) => void;
  setMusicEnabled: (musicEnabled: boolean) => void;
  setVolume: (volume: number) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

type PersistedPortfolioSessionState = Pick<
  PortfolioSessionState,
  "themeColor" | "musicEnabled" | "volume"
>;

export const usePortfolioSessionStore = create<PortfolioSessionState>()(
  persist(
    (set) => ({
      themeColor: "fabric",
      musicEnabled: false,
      volume: 100,
      hasHydrated: false,
      setThemeColor: (themeColor) => set({ themeColor }),
      setMusicEnabled: (musicEnabled) => set({ musicEnabled }),
      setVolume: (volume) =>
        set({ volume: Math.min(100, Math.max(0, volume)) }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "portfolio-session-state",
      storage: createJSONStorage<PersistedPortfolioSessionState>(
        () => sessionStorage,
      ),
      partialize: ({ themeColor, musicEnabled, volume }) => ({
        themeColor,
        musicEnabled,
        volume,
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
