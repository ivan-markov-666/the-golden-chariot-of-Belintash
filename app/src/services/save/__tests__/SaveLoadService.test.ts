import { act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SaveLoadService } from '@/services/save/SaveLoadService';
import { useGameStore } from '@/store/gameStore';
import { useCharacterStore } from '@/store/characterStore';
import { useQuestStore } from '@/store/questStore';
import { useSaveSlots } from '@/store/saveSlotsStore';

const SLOT_ID = 'slot-1' as const;

const seedState = () => {
  act(() => {
    useCharacterStore.getState().createCharacter({ name: 'Occam', level: 5, experience: 250 });
    useGameStore.getState().setLocation('belintash');
    useQuestStore.getState().startQuest('tutorial', [{ id: 'speak', completed: false }]);
  });
};

describe('SaveLoadService', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    act(() => {
      useGameStore.getState().resetGameState();
      useCharacterStore.getState().resetCharacter();
      useQuestStore.getState().resetQuests();
      useSaveSlots.getState().reset();
    });
  });

  it('saveGame сериализира текущото състояние и обновява saveSlots', async () => {
    seedState();
    const service = SaveLoadService.getInstance();
    await service.saveGame(SLOT_ID);

    const stored = await AsyncStorage.getItem('save-slot-slot-1');
    expect(stored).toBeTruthy();

    const slot = useSaveSlots.getState().slots.find((entry) => entry.id === SLOT_ID);
    expect(slot?.occupied).toBe(true);
    expect(slot?.title).toBe('Occam');
  });

  it('loadGame десериализира snapshot и хидратира store-овете', async () => {
    seedState();
    const service = SaveLoadService.getInstance();
    await service.saveGame(SLOT_ID);

    act(() => {
      useGameStore.getState().resetGameState();
      useCharacterStore.getState().resetCharacter();
      useQuestStore.getState().resetQuests();
    });

    const saveData = await service.loadGame(SLOT_ID);
    expect(saveData.metadata.slotId).toBe(SLOT_ID);
    expect(useCharacterStore.getState().character?.name).toBe('Occam');
    expect(useGameStore.getState().gameState.location).toBe('belintash');
    expect(Object.keys(useQuestStore.getState().quests)).toContain('tutorial');
  });

  it('deleteSave изтрива snapshot и маркира слота като празен', async () => {
    seedState();
    const service = SaveLoadService.getInstance();
    await service.saveGame(SLOT_ID);

    await service.deleteSave(SLOT_ID);
    const stored = await AsyncStorage.getItem('save-slot-slot-1');
    expect(stored).toBeNull();

    const slot = useSaveSlots.getState().slots.find((entry) => entry.id === SLOT_ID);
    expect(slot?.occupied).toBe(false);
  });

  it('exportSave/importSave работят с ръчно подадени payload-и', async () => {
    seedState();
    const service = SaveLoadService.getInstance();
    await service.saveGame(SLOT_ID);

    const payload = await service.exportSave(SLOT_ID);
    await service.importSave('slot-2', payload);

    const slot = useSaveSlots.getState().slots.find((entry) => entry.id === 'slot-2');
    expect(slot?.occupied).toBe(true);
    expect(slot?.title).toBe('Occam');
  });

  it('getStorageStats връща коректни стойности за използваните слотове', async () => {
    seedState();
    const service = SaveLoadService.getInstance();
    await service.saveGame(SLOT_ID);

    const stats = await service.getStorageStats();
    expect(stats.usedSlots).toBe(1);
    expect(stats.totalSlots).toBeGreaterThan(0);
  });
});
