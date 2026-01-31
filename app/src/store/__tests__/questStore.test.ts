import { act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  selectActiveQuests,
  selectCompletedQuests,
  selectQuest,
  useQuestStore,
  type QuestObjective,
} from '@/store/questStore';

describe('questStore', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    act(() => {
      useQuestStore.getState().resetQuests();
    });
  });

  it('startQuest creates an active quest with startedAt', () => {
    const objectives: QuestObjective[] = [
      { id: 'obj-1', completed: false },
      { id: 'obj-2', completed: false },
    ];

    act(() => {
      useQuestStore.getState().startQuest('q1', objectives);
    });

    const state = useQuestStore.getState();
    const quest = selectQuest('q1')(state);
    expect(quest).toBeTruthy();
    expect(quest?.status).toBe('active');
    expect(quest?.startedAt).toEqual(expect.any(Number));
    expect(selectActiveQuests(state)).toHaveLength(1);
  });

  it('completeObjective is a no-op when quest does not exist', () => {
    act(() => {
      useQuestStore.getState().completeObjective('missing', 'obj');
    });

    expect(Object.keys(useQuestStore.getState().quests)).toHaveLength(0);
  });

  it('completeObjective marks objective completed', () => {
    const objectives: QuestObjective[] = [
      { id: 'obj-1', completed: false },
      { id: 'obj-2', completed: false },
    ];

    act(() => {
      useQuestStore.getState().startQuest('q1', objectives);
      useQuestStore.getState().completeObjective('q1', 'obj-2');
    });

    const quest = selectQuest('q1')(useQuestStore.getState());
    expect(quest?.objectives.find((o) => o.id === 'obj-2')?.completed).toBe(true);
  });

  it('completeQuest/failQuest are no-op for missing quest and set status for existing', () => {
    act(() => {
      useQuestStore.getState().completeQuest('missing');
      useQuestStore.getState().failQuest('missing');
    });

    expect(Object.keys(useQuestStore.getState().quests)).toHaveLength(0);

    act(() => {
      useQuestStore.getState().startQuest('q1', [{ id: 'obj', completed: false }]);
      useQuestStore.getState().completeQuest('q1');
    });

    let quest = selectQuest('q1')(useQuestStore.getState());
    expect(quest?.status).toBe('completed');
    expect(quest?.completedAt).toEqual(expect.any(Number));
    expect(selectCompletedQuests(useQuestStore.getState())).toHaveLength(1);

    act(() => {
      useQuestStore.getState().startQuest('q2', [{ id: 'obj', completed: false }]);
      useQuestStore.getState().failQuest('q2');
    });

    quest = selectQuest('q2')(useQuestStore.getState());
    expect(quest?.status).toBe('failed');
    expect(quest?.completedAt).toEqual(expect.any(Number));
  });

  it('loadQuests replaces snapshot and resetQuests clears', () => {
    act(() => {
      useQuestStore.getState().loadQuests({
        q1: { id: 'q1', status: 'active', objectives: [{ id: 'obj', completed: false }] },
      });
    });

    expect(selectActiveQuests(useQuestStore.getState())).toHaveLength(1);

    act(() => {
      useQuestStore.getState().resetQuests();
    });

    expect(Object.keys(useQuestStore.getState().quests)).toHaveLength(0);
  });
});
