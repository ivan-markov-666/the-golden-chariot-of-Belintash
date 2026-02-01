import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameState } from '@/game/types/gameState';

export interface DLCManifest {
  id: string;
  version: string;
  name: string;
  dependencies: string[];
  contentFlags: string[];
}

interface DLCStateEnvelope {
  dlcId: string;
  version?: string;
  timestamp: number;
  state: unknown;
}

export class DLCService {
  private static installedDLCs: Map<string, DLCManifest> = new Map();

  /**
   * Регистрира инсталиран DLC manifest и валидира зависимостите му.
   */
  public static registerDLC(manifest: DLCManifest): void {
    for (const dependency of manifest.dependencies ?? []) {
      if (!this.installedDLCs.has(dependency)) {
        throw new Error(`Missing dependency: ${dependency}`);
      }
    }

    this.installedDLCs.set(manifest.id, manifest);
    if (__DEV__) {
      console.log(`[DLC] Registering: ${manifest.name}`);
    }
  }

  /**
   * Нулира регистрираните DLC (използва се основно в тестове).
   */
  public static reset(): void {
    this.installedDLCs.clear();
  }

  public static isDLCInstalled(dlcId: string): boolean {
    return this.installedDLCs.has(dlcId);
  }

  public static getDLCSaveKey(dlcId: string, slotIndex: number): string {
    return `dlc_${dlcId}_slot_${slotIndex}`;
  }

  public static getInstalledDLCs(): DLCManifest[] {
    return Array.from(this.installedDLCs.values());
  }

  /**
   * Записва отделно DLC състояние; пропуска, ако DLC не е регистриран.
   */
  public static async saveDLCState(
    dlcId: string,
    slotIndex: number,
    state: unknown,
  ): Promise<void> {
    const manifest = this.installedDLCs.get(dlcId);

    if (!manifest) {
      console.warn(`[DLC] ${dlcId} not registered, skipping save`);
      return;
    }

    const envelope: DLCStateEnvelope = {
      dlcId,
      version: manifest.version,
      timestamp: Date.now(),
      state,
    };

    await AsyncStorage.setItem(this.getDLCSaveKey(dlcId, slotIndex), JSON.stringify(envelope));
  }

  /**
   * Зарежда DLC състояние; връща null, ако DLC липсва, ключът липсва или payload-ът е невалиден.
   */
  public static async loadDLCState(dlcId: string, slotIndex: number): Promise<unknown | null> {
    if (!this.isDLCInstalled(dlcId)) {
      console.warn(`[DLC] ${dlcId} not installed, skipping load`);
      return null;
    }

    const raw = await AsyncStorage.getItem(this.getDLCSaveKey(dlcId, slotIndex));
    if (!raw) {
      return null;
    }

    let payload: DLCStateEnvelope;
    try {
      payload = JSON.parse(raw) as DLCStateEnvelope;
    } catch (error) {
      console.warn(`[DLC] Failed to parse DLC state for ${dlcId}`, error);
      return null;
    }

    const manifest = this.installedDLCs.get(dlcId);
    if (manifest && payload.version && payload.version !== manifest.version) {
      console.warn(`[DLC] Version mismatch: ${payload.version} vs ${manifest.version}`);
      // Hook for бъдещи миграции (Story 3.6 посочва TODO за migration)
    }

    return payload.state ?? null;
  }

  /**
   * Активира content flags от manifest-а в основния GameState.
   */
  public static enableDLCContent(dlcId: string, gameState: GameState): void {
    const manifest = this.installedDLCs.get(dlcId);
    if (!manifest) {
      return;
    }

    manifest.contentFlags.forEach((flag) => {
      gameState.flags[flag] = true;
    });
  }
}
