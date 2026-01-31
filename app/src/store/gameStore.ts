import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { withStoreLogger } from './middleware/withStoreLogger';
import { GameState, GameTime, createInitialGameState } from '@/game/types/gameState';

export interface GameStoreState {
  gameState: GameState;
  setFlag: (key: string, value: boolean) => void;
  setCounter: (key: string, value: number) => void;
  incrementCounter: (key: string, amount?: number) => void;
  decrementCounter: (key: string, amount?: number) => void;
  setLocation: (locationId: string) => void;
  advanceTime: (hours: number) => void;
  setGameTime: (time: Partial<GameTime>) => void;
  setRelationship: (npcId: string, affinity: number) => void;
  adjustRelationship: (npcId: string, delta: number) => void;
  resetGameState: () => void;
  loadGameState: (state: GameState) => void;
}

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const createFreshState = () => ({
  gameState: {
    ...createInitialGameState(),
    metadata: {
      ...createInitialGameState().metadata,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  },
});

export const useGameStore = create<GameStoreState>()(
  withStoreLogger(
    devtools(
      persist(
        (set, get) => ({
          gameState: createInitialGameState(),
          setFlag: (key, value) =>
            set(
              (state) => ({
                gameState: {
                  ...state.gameState,
                  flags: {
                    ...state.gameState.flags,
                    [key]: value,
                  },
                },
              }),
              false,
              `game/setFlag/${key}`,
            ),
        
        setCounter: (key, value) =>
          set(
            (state) => ({
              gameState: {
                ...state.gameState,
                counters: {
                  ...state.gameState.counters,
                  [key]: value,
                },
              },
            }),
            false,
            `game/setCounter/${key}`,
          ),
        incrementCounter: (key, amount = 1) =>
          set(
            (state) => {
              const current = state.gameState.counters[key] ?? 0;
              return {
                gameState: {
                  ...state.gameState,
                  counters: {
                    ...state.gameState.counters,
                    [key]: current + amount,
                  },
                },
              };
            },
            false,
            `game/incrementCounter/${key}`,
          ),
        decrementCounter: (key, amount = 1) =>
          set(
            (state) => {
              const current = state.gameState.counters[key] ?? 0;
              return {
                gameState: {
                  ...state.gameState,
                  counters: {
                    ...state.gameState.counters,
                    [key]: Math.max(0, current - amount),
                  },
                },
              };
            },
            false,
            `game/decrementCounter/${key}`,
          ),
        setLocation: (locationId) =>
          set(
            (state) => {
              const unlocked = state.gameState.unlockedLocations.includes(locationId)
                ? state.gameState.unlockedLocations
                : [...state.gameState.unlockedLocations, locationId];
              return {
                gameState: {
                  ...state.gameState,
                  location: locationId,
                  unlockedLocations: unlocked,
                },
              };
            },
            false,
            'game/setLocation',
          ),
        advanceTime: (hours) =>
          set(
            (state) => {
              const { day, hour } = state.gameState.gameTime;
              const totalHours = hour + hours;
              const newDay = day + Math.floor(totalHours / 24);
              const newHour = ((totalHours % 24) + 24) % 24;
              let period: GameTime['period'];
              if (newHour >= 6 && newHour < 12) {
                period = 'morning';
              } else if (newHour >= 12 && newHour < 18) {
                period = 'afternoon';
              } else if (newHour >= 18 && newHour < 22) {
                period = 'evening';
              } else {
                period = 'night';
              }
              return {
                gameState: {
                  ...state.gameState,
                  gameTime: { day: newDay, hour: newHour, period },
                },
              };
            },
            false,
            'game/advanceTime',
          ),
        setGameTime: (time) =>
          set(
            (state) => ({
              gameState: {
                ...state.gameState,
                gameTime: {
                  ...state.gameState.gameTime,
                  ...time,
                },
              },
            }),
            false,
            'game/setGameTime',
          ),
        setRelationship: (npcId, affinity) =>
          set(
            (state) => ({
              gameState: {
                ...state.gameState,
                relationships: {
                  ...state.gameState.relationships,
                  [npcId]: clamp(affinity, -100, 100),
                },
              },
            }),
            false,
            `game/setRelationship/${npcId}`,
          ),
        adjustRelationship: (npcId, delta) =>
          set(
            (state) => {
              const current = state.gameState.relationships[npcId] ?? 0;
              return {
                gameState: {
                  ...state.gameState,
                  relationships: {
                    ...state.gameState.relationships,
                    [npcId]: clamp(current + delta, -100, 100),
                  },
                },
              };
            },
            false,
            `game/adjustRelationship/${npcId}`,
          ),
        resetGameState: () => set(createFreshState(), false, 'game/reset'),
        loadGameState: (state) => set({ gameState: state }, false, 'game/load'),
      }),
        {
          name: 'game-storage',
          storage: createJSONStorage(() => AsyncStorage),
          partialize: (state) => ({ gameState: state.gameState }),
        },
      ),
      { name: 'GameStore' },
    ),
    'GameStore',
  ),
);

export const selectFlag = (key: string) => (state: GameStoreState) =>
  state.gameState.flags[key] ?? false;
export const selectCounter = (key: string) => (state: GameStoreState) =>
  state.gameState.counters[key] ?? 0;
export const selectLocation = (state: GameStoreState) => state.gameState.location;
export const selectGameTime = (state: GameStoreState) => state.gameState.gameTime;
export const selectRelationship = (npcId: string) => (state: GameStoreState) =>
  state.gameState.relationships[npcId] ?? 0;
