const mockSetItem = jest.fn().mockResolvedValue(undefined);
const mockGetItem = jest.fn().mockResolvedValue(null);

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    setItem: mockSetItem,
    getItem: mockGetItem,
  },
}));

import { DLCService } from '../DLCService';
import { createInitialGameState } from '@/game/types/gameState';

describe('DLCService', () => {
  const manifest = {
    id: 'dlc-occult-expansion',
    version: '1.2.3',
    name: 'Occult Expansion',
    dependencies: [],
    contentFlags: ['dlc.occult.unlocked'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    DLCService.reset();
  });

  describe('registerDLC', () => {
    it('registers manifest и позволява последващ достъп', () => {
      DLCService.registerDLC(manifest);
      expect(DLCService.isDLCInstalled(manifest.id)).toBe(true);
    });

    it('хвърля грешка при липсваща зависимост', () => {
      expect(() =>
        DLCService.registerDLC({
          ...manifest,
          id: 'dlc-addon',
          dependencies: ['dlc-base'],
        }),
      ).toThrow('Missing dependency: dlc-base');
    });
  });

  describe('saveDLCState', () => {
    it('записва envelope със версия и timestamp', async () => {
      DLCService.registerDLC(manifest);
      await DLCService.saveDLCState(manifest.id, 1, { progress: 42 });

      expect(mockSetItem).toHaveBeenCalledTimes(1);
      const payload = JSON.parse(mockSetItem.mock.calls[0][1]);
      expect(payload).toMatchObject({
        dlcId: manifest.id,
        version: manifest.version,
        state: { progress: 42 },
      });
    });

    it('пропуска запис, ако DLC не е регистриран', async () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
      await DLCService.saveDLCState('unknown-dlc', 0, {});
      expect(mockSetItem).not.toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalledWith('[DLC] unknown-dlc not registered, skipping save');
      warnSpy.mockRestore();
    });
  });

  describe('loadDLCState', () => {
    it('връща null и логва предупреждение за неинсталиран DLC', async () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
      const result = await DLCService.loadDLCState('missing', 0);
      expect(result).toBeNull();
      expect(warnSpy).toHaveBeenCalledWith('[DLC] missing not installed, skipping load');
      warnSpy.mockRestore();
    });

    it('връща state, когато данните са валидни', async () => {
      DLCService.registerDLC(manifest);
      const envelope = {
        dlcId: manifest.id,
        version: manifest.version,
        timestamp: Date.now(),
        state: { relics: 3 },
      };
      mockGetItem.mockResolvedValueOnce(JSON.stringify(envelope));

      const result = await DLCService.loadDLCState(manifest.id, 2);
      expect(result).toEqual({ relics: 3 });
    });

    it('логва при version mismatch, но все пак връща state', async () => {
      DLCService.registerDLC({ ...manifest, version: '2.0.0' });
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
      const envelope = {
        dlcId: manifest.id,
        version: '1.0.0',
        timestamp: Date.now(),
        state: { relics: 1 },
      };
      mockGetItem.mockResolvedValueOnce(JSON.stringify(envelope));

      const result = await DLCService.loadDLCState(manifest.id, 0);
      expect(result).toEqual({ relics: 1 });
      expect(warnSpy).toHaveBeenCalledWith('[DLC] Version mismatch: 1.0.0 vs 2.0.0');
      warnSpy.mockRestore();
    });
  });

  describe('enableDLCContent', () => {
    it('активира manifest flags в GameState', () => {
      DLCService.registerDLC(manifest);
      const gameState = createInitialGameState();

      DLCService.enableDLCContent(manifest.id, gameState);

      expect(gameState.flags['dlc.occult.unlocked']).toBe(true);
    });
  });
});
