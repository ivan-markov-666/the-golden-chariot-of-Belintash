import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { withStoreLogger } from './middleware/withStoreLogger';

export type QuestStatus = 'not_started' | 'active' | 'completed' | 'failed' | 'expired';

export interface QuestObjective {
  id: string;
  description?: string;
  completed: boolean;
  optional?: boolean;
  branch?: string;
  progress?: number;
  targetProgress?: number;
}

export interface QuestReward {
  type: 'gold' | 'item' | 'experience' | 'flag';
  payload: Record<string, unknown>;
  claimed?: boolean;
}

export interface Quest {
  id: string;
  status: QuestStatus;
  objectives: QuestObjective[];
  stageId?: string;
  branch?: string;
  rewards?: QuestReward[];
  startedAt?: number;
  completedAt?: number;
  failedAt?: number;
  expiresAt?: number;
}

export interface QuestJournalFilters {
  showCompleted: boolean;
  showFailed: boolean;
  showActive: boolean;
}

export interface QuestStoreState {
  quests: Record<string, Quest>;
  journalFilters: QuestJournalFilters;
  startQuest: (questId: string, objectives: QuestObjective[], options?: Partial<Quest>) => void;
  setQuestStage: (questId: string, stageId: string, objectives: QuestObjective[]) => void;
  setQuestBranch: (questId: string, branch: string) => void;
  setQuestExpiration: (questId: string, expiresAt: number) => void;
  expireQuest: (questId: string) => void;
  updateObjectiveProgress: (questId: string, objectiveId: string, progress: number) => void;
  completeObjective: (questId: string, objectiveId: string) => void;
  completeQuest: (questId: string) => void;
  failQuest: (questId: string) => void;
  claimQuestRewards: (questId: string) => void;
  setJournalFilters: (filters: Partial<QuestJournalFilters>) => void;
  resetQuests: () => void;
  loadQuests: (quests: Record<string, Quest>) => void;
}

export const useQuestStore = create<QuestStoreState>()(
  withStoreLogger(
    devtools(
      persist(
        (set) => ({
          quests: {},
          journalFilters: { showActive: true, showCompleted: true, showFailed: true },
          startQuest: (questId, objectives, options = {}) =>
            set(
              (state) => ({
                quests: {
                  ...state.quests,
                  [questId]: {
                    id: questId,
                    status: 'active',
                    objectives,
                    stageId: options.stageId,
                    branch: options.branch,
                    rewards: options.rewards,
                    startedAt: options.startedAt ?? Date.now(),
                    expiresAt: options.expiresAt,
                  },
                },
              }),
              false,
              `quest/start/${questId}`,
            ),
          setQuestStage: (questId, stageId, objectives) =>
            set(
              (state) => {
                const quest = state.quests[questId];
                if (!quest || quest.status !== 'active') return state;
                return {
                  quests: {
                    ...state.quests,
                    [questId]: {
                      ...quest,
                      stageId,
                      objectives,
                    },
                  },
                };
              },
              false,
              `quest/stage/${questId}`,
            ),
          setQuestBranch: (questId, branch) =>
            set(
              (state) => {
                const quest = state.quests[questId];
                if (!quest) return state;
                return {
                  quests: {
                    ...state.quests,
                    [questId]: { ...quest, branch },
                  },
                };
              },
              false,
              `quest/branch/${questId}`,
            ),
          setQuestExpiration: (questId, expiresAt) =>
            set(
              (state) => {
                const quest = state.quests[questId];
                if (!quest || quest.status !== 'active') return state;
                return {
                  quests: {
                    ...state.quests,
                    [questId]: { ...quest, expiresAt },
                  },
                };
              },
              false,
              `quest/expiration/${questId}`,
            ),
          expireQuest: (questId) =>
            set(
              (state) => {
                const quest = state.quests[questId];
                if (!quest || quest.status !== 'active') return state;
                return {
                  quests: {
                    ...state.quests,
                    [questId]: {
                      ...quest,
                      status: 'expired',
                      failedAt: Date.now(),
                    },
                  },
                };
              },
              false,
              `quest/expire/${questId}`,
            ),
          updateObjectiveProgress: (questId, objectiveId, progress) =>
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
                        obj.id === objectiveId
                          ? {
                              ...obj,
                              progress,
                              completed:
                                obj.targetProgress !== undefined
                                  ? progress >= obj.targetProgress
                                  : obj.completed,
                            }
                          : obj,
                      ),
                    },
                  },
                };
              },
              false,
              `quest/progress/${questId}`,
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
                        obj.id === objectiveId
                          ? {
                              ...obj,
                              completed: true,
                              progress: obj.targetProgress ?? obj.progress,
                            }
                          : obj,
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
          claimQuestRewards: (questId) =>
            set(
              (state) => {
                const quest = state.quests[questId];
                if (!quest || !quest.rewards?.length) return state;
                return {
                  quests: {
                    ...state.quests,
                    [questId]: {
                      ...quest,
                      rewards: quest.rewards.map((reward) => ({ ...reward, claimed: true })),
                    },
                  },
                };
              },
              false,
              `quest/rewards/${questId}`,
            ),
          setJournalFilters: (filters) =>
            set(
              (state) => ({
                journalFilters: { ...state.journalFilters, ...filters },
              }),
              false,
              'quest/journalFilters',
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
export const selectJournalFilters = (state: QuestStoreState) => state.journalFilters;
export const selectFilteredQuests = (state: QuestStoreState) => {
  const { showActive, showCompleted, showFailed } = state.journalFilters;
  return Object.values(state.quests).filter((quest) => {
    if (quest.status === 'active') return showActive;
    if (quest.status === 'completed') return showCompleted;
    if (quest.status === 'failed' || quest.status === 'expired') return showFailed;
    return false;
  });
};
