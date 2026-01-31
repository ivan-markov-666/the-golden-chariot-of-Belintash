import { create } from 'zustand';

export type UXPerfEvent = {
  id: string;
  durationMs: number;
  timestamp: number;
};

export type UXPerfStoreState = {
  events: UXPerfEvent[];
  logEvent: (event: UXPerfEvent) => void;
  reset: () => void;
};

export const useUXPerfEvents = create<UXPerfStoreState>((set) => ({
  events: [],
  logEvent: (event) =>
    set((state) => ({
      events: [...state.events.slice(-49), event],
    })),
  reset: () => set({ events: [] }),
}));
