import { useQuestStore } from '@/store/questStore';
import { useCharacterStore } from '@/store/characterStore';
import { useGameStore } from '@/store/gameStore';
import type { Quest, QuestObjective, QuestReward } from '@/store/questStore';
import type { GameState } from '@/game/types/gameState';
import type { PlayerCharacter } from '@/game/types/character';

export interface QuestDefinition {
  id: string;
  levelRequirement?: number;
  requiredFlags?: string[];
  prerequisites?: string[];
  stages: Array<{
    id: string;
    objectives: QuestObjective[];
  }>;
  rewards?: QuestReward[];
}

const QUEST_DEFINITIONS: Record<string, QuestDefinition> = {
  'tutorial-scouting': {
    id: 'tutorial-scouting',
    levelRequirement: 1,
    prerequisites: ['prerequisite'],
    stages: [
      {
        id: 'survey-village',
        objectives: [
          { id: 'talk-elder', description: 'Speak with the village elder', completed: false },
          { id: 'inspect-fields', description: 'Inspect the farmlands', completed: false },
        ],
      },
      {
        id: 'report-back',
        objectives: [{ id: 'report', description: 'Report back to the elder', completed: false }],
      },
    ],
    rewards: [{ type: 'experience', payload: { amount: 150 } }],
  },
};

export class QuestService {
  public static isQuestAvailable(questId: string, gameState: GameState, character: PlayerCharacter): boolean {
    const definition = QUEST_DEFINITIONS[questId];
    if (!definition) return false;

    if (definition.levelRequirement && character.level < definition.levelRequirement) {
      return false;
    }

    if (definition.requiredFlags?.some((flag) => !gameState.flags[flag])) {
      return false;
    }

    const questStore = useQuestStore.getState();
    if (definition.prerequisites?.some((dependency) => questStore.quests[dependency]?.status !== 'completed')) {
      return false;
    }

    return !questStore.quests[questId];
  }

  public static startQuest(questId: string, gameState: GameState): void {
    const definition = QUEST_DEFINITIONS[questId];
    if (!definition) {
      throw new Error(`[QuestService] Missing definition for ${questId}`);
    }

    const character = useCharacterStore.getState().character;
    if (!character) {
      throw new Error('[QuestService] Cannot start quest without active character');
    }

    if (!this.isQuestAvailable(questId, gameState, character)) {
      throw new Error(`[QuestService] Quest ${questId} unavailable`);
    }

    const firstStage = definition.stages[0];
    useQuestStore
      .getState()
      .startQuest(questId, cloneObjectives(firstStage.objectives), {
        stageId: firstStage.id,
        rewards: definition.rewards,
      });

    gameState.flags[`quest_${questId}_started`] = true;
  }

  public static progressObjective(questId: string, objectiveId: string, progress: number): void {
    const questStore = useQuestStore.getState();
    questStore.updateObjectiveProgress(questId, objectiveId, progress);
    this.evaluateQuestState(questId);
  }

  public static completeObjective(questId: string, objectiveId: string): void {
    const questStore = useQuestStore.getState();
    questStore.completeObjective(questId, objectiveId);
    this.evaluateQuestState(questId);
  }

  public static failQuest(questId: string): void {
    useQuestStore.getState().failQuest(questId);
  }

  public static expireQuest(questId: string): void {
    useQuestStore.getState().expireQuest(questId);
  }

  private static evaluateQuestState(questId: string): void {
    const questStore = useQuestStore.getState();
    const quest = questStore.quests[questId];
    if (!quest) return;

    if (quest.expiresAt && quest.expiresAt < Date.now()) {
      questStore.expireQuest(questId);
      return;
    }

    const currentStageComplete = quest.objectives.every((objective) => objective.completed || objective.optional);
    if (!currentStageComplete) {
      return;
    }

    const definition = QUEST_DEFINITIONS[questId];
    if (!definition) return;

    const currentStageIndex = definition.stages.findIndex((stage) => stage.id === quest.stageId);
    const nextStage = definition.stages[currentStageIndex + 1];

    if (nextStage) {
      questStore.setQuestStage(questId, nextStage.id, cloneObjectives(nextStage.objectives));
    } else {
      questStore.completeQuest(questId);
      this.applyRewards(quest);
    }
  }

  private static applyRewards(quest: Quest): void {
    if (!quest.rewards) return;
    const characterStore = useCharacterStore.getState();
    const gameStore = useGameStore.getState();

    quest.rewards.forEach((reward) => {
      if (reward.claimed) return;
      switch (reward.type) {
        case 'experience':
          if (typeof reward.payload.amount === 'number') {
            characterStore.addExperience(reward.payload.amount);
          }
          break;
        case 'gold':
          if (typeof reward.payload.amount === 'number') {
            characterStore.adjustGold(reward.payload.amount);
          }
          break;
        case 'item':
          if (typeof reward.payload.itemId === 'string') {
            characterStore.addItem(reward.payload.itemId as string, reward.payload.quantity as number | undefined);
          }
          break;
        case 'flag':
          if (typeof reward.payload.flag === 'string') {
            gameStore.setFlag(reward.payload.flag as string, true);
          }
          break;
        default:
          break;
      }
    });

    useQuestStore.getState().claimQuestRewards(quest.id);
  }
}

const cloneObjectives = (objectives: QuestObjective[]) => objectives.map((objective) => ({ ...objective }));
