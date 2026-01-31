// @ts-nocheck
import { act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QuestService } from '@/services/QuestService';
import { useQuestStore } from '@/store/questStore';
import { useCharacterStore } from '@/store/characterStore';
import { useGameStore } from '@/store/gameStore';

describe('QuestService', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    act(() => {
      useQuestStore.getState().resetQuests();
      useCharacterStore.getState().resetCharacter();
      useGameStore.getState().resetGameState();
      useCharacterStore.getState().createCharacter({ level: 2 });
    });
  });

  const getGameState = () => useGameStore.getState().gameState;

  it('не позволява старт без изпълнени prerequisites', () => {
    const state = getGameState();
    const character = useCharacterStore.getState().character;
    expect(character).toBeTruthy();
    if (!character) {
      throw new Error('Character not initialised');
    }
    // prerequisite quest не е завършен → should block
    act(() => {
      useQuestStore.getState().loadQuests({
        prerequisite: { id: 'prerequisite', status: 'active', objectives: [] },
      });
    });

    expect(QuestService.isQuestAvailable('tutorial-scouting', state, character)).toBe(false);
  });

  it('стартира quest и сетва стартов флаг', () => {
    const state = getGameState();
    const character = useCharacterStore.getState().character;
    if (!character) {
      throw new Error('Character not initialised');
    }
    // Mark prerequisite quest completed
    act(() => {
      useQuestStore.getState().loadQuests({
        prerequisite: { id: 'prerequisite', status: 'completed', objectives: [] },
      });
    });
    expect(QuestService.isQuestAvailable('tutorial-scouting', state, character)).toBe(true);

    act(() => {
      QuestService.startQuest('tutorial-scouting', state);
    });

    const quest = useQuestStore.getState().quests['tutorial-scouting'];
    expect(quest).toBeTruthy();
    expect(state.flags['quest_tutorial-scouting_started']).toBe(true);
  });

  it('прогресира през стейджове и прилага rewards', () => {
    const state = getGameState();
    act(() => {
      useQuestStore.getState().loadQuests({
        prerequisite: { id: 'prerequisite', status: 'completed', objectives: [] },
      });
    });
    act(() => {
      QuestService.startQuest('tutorial-scouting', state);
      QuestService.completeObjective('tutorial-scouting', 'talk-elder');
      QuestService.completeObjective('tutorial-scouting', 'inspect-fields');
      QuestService.completeObjective('tutorial-scouting', 'report');
    });

    const quest = useQuestStore.getState().quests['tutorial-scouting'];
    expect(quest?.status).toBe('completed');
    expect(quest?.rewards?.every((reward) => reward.claimed)).toBe(true);
    expect(useCharacterStore.getState().character?.experience).toBeGreaterThan(0);
  });

  it('маркира quest като expired при изтекъл срок', () => {
    const state = getGameState();
    act(() => {
      useQuestStore.getState().loadQuests({
        prerequisite: { id: 'prerequisite', status: 'completed', objectives: [] },
      });
    });
    act(() => {
      QuestService.startQuest('tutorial-scouting', state);
      useQuestStore.getState().setQuestExpiration('tutorial-scouting', Date.now() - 1000);
      QuestService.progressObjective('tutorial-scouting', 'talk-elder', 1);
    });

    const quest = useQuestStore.getState().quests['tutorial-scouting'];
    expect(quest?.status).toBe('expired');
  });
});
