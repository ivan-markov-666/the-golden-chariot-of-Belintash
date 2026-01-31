import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameState, isGameState } from '@/game/types/gameState';
import { PlayerCharacter } from '@/game/types/character';
import { useGameStore } from '@/store/gameStore';
import { useCharacterStore } from '@/store/characterStore';
import { useQuestStore, type Quest } from '@/store/questStore';
import { useSaveSlots, type SaveSlot } from '@/store/saveSlotsStore';

const SAVE_VERSION = '1.0.0';
const SAVE_KEY_PREFIX = 'save-slot-';
const SAVE_SLOT_IDS = ['slot-1', 'slot-2', 'slot-3'] as const;
export type SaveSlotId = (typeof SAVE_SLOT_IDS)[number];
const AUTO_SAVE_SLOT: SaveSlotId = 'slot-1';
const AUTO_SAVE_INTERVAL_MS = 5 * 60 * 1000;

export interface SaveMetadata {
  slotId: SaveSlotId;
  characterName: string;
  level: number;
  location: string;
  playtimeMinutes: number;
  lastSaved: number;
  saveType: 'manual' | 'auto';
}

export interface SaveData {
  version: string;
  timestamp: number;
  metadata: SaveMetadata;
  gameState: GameState;
  character: PlayerCharacter;
  quests: Record<string, Quest>;
}

export interface StorageStats {
  totalSlots: number;
  usedSlots: number;
  totalSize: number;
}

export class SaveLoadService {
  private static instance: SaveLoadService | null = null;
  private autoSaveTimer: ReturnType<typeof setInterval> | null = null;

  private constructor() {}

  public static getInstance(): SaveLoadService {
    if (!SaveLoadService.instance) {
      SaveLoadService.instance = new SaveLoadService();
    }
    return SaveLoadService.instance;
  }

  public async saveGame(slotId: SaveSlotId, saveType: 'manual' | 'auto' = 'manual'): Promise<void> {
    this.ensureValidSlot(slotId);

    const gameState = useGameStore.getState().gameState;
    const character = useCharacterStore.getState().character;
    const quests = useQuestStore.getState().quests;

    if (!character) {
      throw new Error('Cannot save without an active character');
    }

    const timestamp = Date.now();
    const metadata: SaveMetadata = {
      slotId,
      characterName: character.name,
      level: character.level,
      location: gameState.location,
      playtimeMinutes: Math.floor((gameState.metadata.playtime ?? 0) / 60),
      lastSaved: timestamp,
      saveType,
    };

    const saveData: SaveData = {
      version: SAVE_VERSION,
      timestamp,
      metadata,
      gameState,
      character,
      quests,
    };

    this.validateSaveData(saveData);

    const serialized = JSON.stringify(saveData);
    await AsyncStorage.setItem(this.getSaveKey(slotId), serialized);

    this.updateSaveSlotStore(slotId, saveData);
  }

  public async loadGame(slotId: SaveSlotId): Promise<SaveData> {
    this.ensureValidSlot(slotId);

    const serialized = await AsyncStorage.getItem(this.getSaveKey(slotId));
    if (!serialized) {
      throw new Error(`Save slot ${slotId} is empty`);
    }

    const saveData = this.parseSave(serialized);
    this.validateSaveData(saveData);

    useGameStore.getState().loadGameState(saveData.gameState);
    useCharacterStore.getState().loadCharacter(saveData.character);
    useQuestStore.getState().loadQuests(saveData.quests);
    this.updateSaveSlotStore(slotId, saveData);

    return saveData;
  }

  public async getSaveSlots(): Promise<SaveSlot[]> {
    const slots = await Promise.all(SAVE_SLOT_IDS.map((slotId) => this.readSlot(slotId)));
    useSaveSlots.getState().reset(slots);
    return slots;
  }

  public async deleteSave(slotId: SaveSlotId): Promise<void> {
    this.ensureValidSlot(slotId);
    await AsyncStorage.removeItem(this.getSaveKey(slotId));
    this.updateSaveSlotStore(slotId, null);
  }

  public async autoSave(): Promise<void> {
    try {
      await this.saveGame(AUTO_SAVE_SLOT, 'auto');
    } catch (error) {
      console.error('[SaveLoadService] Auto-save failed', error);
    }
  }

  public startAutoSave(): void {
    if (this.autoSaveTimer) {
      return;
    }
    this.autoSaveTimer = setInterval(() => {
      void this.autoSave();
    }, AUTO_SAVE_INTERVAL_MS);
  }

  public stopAutoSave(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }

  public async exportSave(slotId: SaveSlotId): Promise<string> {
    this.ensureValidSlot(slotId);
    const serialized = await AsyncStorage.getItem(this.getSaveKey(slotId));
    if (!serialized) {
      throw new Error(`Save slot ${slotId} is empty`);
    }
    return serialized;
  }

  public async importSave(slotId: SaveSlotId, payload: string): Promise<void> {
    this.ensureValidSlot(slotId);
    const saveData = this.parseSave(payload);
    this.validateSaveData(saveData);

    const stampedData: SaveData = {
      ...saveData,
      timestamp: Date.now(),
      metadata: {
        ...saveData.metadata,
        slotId,
        lastSaved: Date.now(),
      },
    };

    await AsyncStorage.setItem(this.getSaveKey(slotId), JSON.stringify(stampedData));
    this.updateSaveSlotStore(slotId, stampedData);
  }

  public async getStorageStats(): Promise<StorageStats> {
    let usedSlots = 0;
    let totalSize = 0;

    await Promise.all(
      SAVE_SLOT_IDS.map(async (slotId) => {
        const data = await AsyncStorage.getItem(this.getSaveKey(slotId));
        if (data) {
          usedSlots += 1;
          totalSize += data.length;
        }
      }),
    );

    return {
      totalSlots: SAVE_SLOT_IDS.length,
      usedSlots,
      totalSize,
    };
  }

  private getSaveKey(slotId: SaveSlotId): string {
    return `${SAVE_KEY_PREFIX}${slotId}`;
  }

  private ensureValidSlot(slotId: string): asserts slotId is SaveSlotId {
    if (!SAVE_SLOT_IDS.includes(slotId as SaveSlotId)) {
      throw new Error(`Invalid save slot: ${slotId}`);
    }
  }

  private parseSave(serialized: string): SaveData {
    try {
      return JSON.parse(serialized) as SaveData;
    } catch (error) {
      throw new Error('Save file is corrupted');
    }
  }

  private validateSaveData(saveData: SaveData): void {
    if (!saveData.version) {
      throw new Error('Missing save version');
    }
    if (!isGameState(saveData.gameState)) {
      throw new Error('Invalid game state payload');
    }
    if (!saveData.character || !saveData.character.name) {
      throw new Error('Character data is invalid');
    }
    if (!saveData.quests || typeof saveData.quests !== 'object') {
      throw new Error('Quest data is invalid');
    }
  }

  private async readSlot(slotId: SaveSlotId): Promise<SaveSlot> {
    const emptySlot = this.createEmptySlot(slotId);

    try {
      const serialized = await AsyncStorage.getItem(this.getSaveKey(slotId));
      if (!serialized) {
        return emptySlot;
      }

      const saveData = this.parseSave(serialized);
      this.validateSaveData(saveData);
      return this.toSaveSlot(slotId, saveData);
    } catch (error) {
      console.warn(`[SaveLoadService] Slot ${slotId} is corrupted`, error);
      return {
        ...emptySlot,
        occupied: true,
        corrupted: true,
      };
    }
  }

  private updateSaveSlotStore(slotId: SaveSlotId, saveData: SaveData | null): void {
    const slotState = useSaveSlots.getState();
    if (saveData) {
      slotState.setSlot(slotId, this.toSaveSlot(slotId, saveData));
    } else {
      slotState.deleteSlot(slotId);
    }
  }

  private toSaveSlot(slotId: SaveSlotId, saveData: SaveData): SaveSlot {
    return {
      id: slotId,
      occupied: true,
      title: saveData.metadata.characterName,
      updatedAt: new Date(saveData.metadata.lastSaved).toISOString(),
      playtimeMinutes: saveData.metadata.playtimeMinutes,
      lastSaveType: saveData.metadata.saveType,
      dlcFlags: [],
      corrupted: false,
    };
  }

  private createEmptySlot(slotId: SaveSlotId): SaveSlot {
    return {
      id: slotId,
      occupied: false,
      title: null,
      updatedAt: null,
      playtimeMinutes: 0,
      lastSaveType: 'manual',
      dlcFlags: [],
      corrupted: false,
    };
  }
}

export const saveGame = (slotId: SaveSlotId, type: 'manual' | 'auto' = 'manual') =>
  SaveLoadService.getInstance().saveGame(slotId, type);
export const loadGame = (slotId: SaveSlotId) => SaveLoadService.getInstance().loadGame(slotId);
export const getSaveSlots = () => SaveLoadService.getInstance().getSaveSlots();
export const deleteSave = (slotId: SaveSlotId) => SaveLoadService.getInstance().deleteSave(slotId);
export const exportSave = (slotId: SaveSlotId) => SaveLoadService.getInstance().exportSave(slotId);
export const importSave = (slotId: SaveSlotId, payload: string) =>
  SaveLoadService.getInstance().importSave(slotId, payload);
export const startAutoSave = () => SaveLoadService.getInstance().startAutoSave();
export const stopAutoSave = () => SaveLoadService.getInstance().stopAutoSave();
export const getStorageStats = () => SaveLoadService.getInstance().getStorageStats();
