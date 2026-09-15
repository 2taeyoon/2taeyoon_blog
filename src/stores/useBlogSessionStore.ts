"use client";

import { useEffect } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { SayingProps } from "@/types/blog/saying.types";

type BlogNavigationScope = "all" | "category";

type BlogSessionData = {
  searchQuery: string;
  currentPage: number;
  saying: SayingProps | null;
};

type BlogSessionState = {
  sessions: Record<string, BlogSessionData>;
  navigationScope: BlogNavigationScope;
  hasHydrated: boolean;
  setSearchQuery: (sessionName: string, searchQuery: string) => void;
  setCurrentPage: (sessionName: string, currentPage: number) => void;
  setSaying: (sessionName: string, saying: SayingProps) => void;
  setNavigationScope: (scope: BlogNavigationScope) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

type PersistedBlogSessionState = Pick<
  BlogSessionState,
  "sessions" | "navigationScope"
>;

const EMPTY_SESSION: BlogSessionData = {
  searchQuery: "",
  currentPage: 0,
  saying: null,
};

function withSession(
  sessions: Record<string, BlogSessionData>,
  sessionName: string,
  updates: Partial<BlogSessionData>,
) {
  return {
    ...sessions,
    [sessionName]: {
      ...EMPTY_SESSION,
      ...sessions[sessionName],
      ...updates,
    },
  };
}

export const useBlogSessionStore = create<BlogSessionState>()(
  persist(
    (set) => ({
      sessions: {},
      navigationScope: "category",
      hasHydrated: false,
      setSearchQuery: (sessionName, searchQuery) =>
        set((state) => ({
          sessions: withSession(state.sessions, sessionName, {
            searchQuery,
            currentPage: 0,
          }),
        })),
      setCurrentPage: (sessionName, currentPage) =>
        set((state) => ({
          sessions: withSession(state.sessions, sessionName, { currentPage }),
        })),
      setSaying: (sessionName, saying) =>
        set((state) => ({
          sessions: withSession(state.sessions, sessionName, { saying }),
        })),
      setNavigationScope: (navigationScope) => set({ navigationScope }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "blog-session-state",
      storage: createJSONStorage<PersistedBlogSessionState>(
        () => sessionStorage,
      ),
      partialize: ({ sessions, navigationScope }) => ({
        sessions,
        navigationScope,
      }),
      skipHydration: true,
    },
  ),
);

export function useHydrateBlogSessionStore() {
  useEffect(() => {
    if (!useBlogSessionStore.persist.hasHydrated()) {
      void Promise.resolve(useBlogSessionStore.persist.rehydrate()).finally(
        () => useBlogSessionStore.getState().setHasHydrated(true),
      );
    }
  }, []);
}
