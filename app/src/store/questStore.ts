import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { withStoreLogger } from './middleware/withStoreLogger';

export type QuestStatus = 'not_started' | 'active' | 'completed' | 'failed';

export interface QuestObjective {
  id: string;
  description?: string;
  completed: boolean;
}

export interface Quest {
  id: string;
  status: QuestStatus;
  objectives: QuestObjective[];
  startedAt?: number;
  completedAt?: number;
}

export interface QuestStoreState {
  quests: Record<string, Quest>;
  startQuest: (questId: string, objectives: QuestObjective[]) => void;
  completeObjective: (questId: string, objectiveId: string) => void;
  completeQuest: (questId: string) => void;
  failQuest: (questId: string) => void;
  resetQuests: () => void;
  loadQuests: (quests: Record<string, Quest>) => void;
}

export const useQuestStore = create<QuestStoreState>()(
  withStoreLogger(
    devtools(
      persist(
        (set) => ({
          quests: {},
          startQuest: (questId, objectives) =>
            set(
              (state) => ({
                quests: {
                  ...state.quests,
                  [questId]: {
                    id: questId,
                    status: 'active',
                    objectives,
                    startedAt: Date.now(),
                  },
                },
              }),
              false,
              `quest/start/${questId}`,
            ),
          completeObjective: (questId, objectiveId) =>
            set(
              (state) => {
                const quest = state.quests[questId];
                if (!quest) return state;
                return {
                  quests: {
                    ...state.quests,
                    [questId]: {
                      ...quest,
                      objectives: quest.objectives.map((obj) =>
                        obj.id === objectiveId ? { ...obj, completed: true } : obj,
                      ),
                    },
                  },
                };
              },
              false,
              `quest/completeObjective/${questId}`,
            ),
          completeQuest: (questId) =>
            set(
              (state) => {
                const quest = state.quests[questId];
                if (!quest) return state;
                return {
                  quests: {
                    ...state.quests,
                    [questId]: {
                      ...quest,
                      status: 'completed',
                      completedAt: Date.now(),
                    },
                  },
                };
              },
              false,
              `quest/complete/${questId}`,
            ),
          failQuest: (questId) =>
            set(
              (state) => {
                const quest = state.quests[questId];
                if (!quest) return state;
                return {
                  quests: {
                    ...state.quests,
                    [questId]: {
                      ...quest,
                      status: 'failed',
                      completedAt: Date.now(),
                    },
                  },
                };
              },
              false,
              `quest/fail/${questId}`,
            ),
          resetQuests: () => set({ quests: {} }, false, 'quest/reset'),
          loadQuests: (quests) => set({ quests }, false, 'quest/load'),
        }),
        {
          name: 'quest-storage',
          storage: createJSONStorage(() => AsyncStorage),
          partialize: (state) => ({ quests: state.quests }),
        },
      ),
      { name: 'QuestStore' },
    ),
    'QuestStore',
  ),
);

export const selectQuest = (questId: string) => (state: QuestStoreState) =>
  state.quests[questId];
export const selectActiveQuests = (state: QuestStoreState) =>
  Object.values(state.quests).filter((quest) => quest.status === 'active');
export const selectCompletedQuests = (state: QuestStoreState) =>
  Object.values(state.quests).filter((quest) => quest.status === 'completed');
