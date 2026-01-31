import { useCallback, useEffect, useState } from 'react';
import { SaveLoadService, type SaveSlotId } from '@/services/save/SaveLoadService';
import { useSaveSlots, type SaveSlot } from '@/store/saveSlotsStore';
import { useUIStore } from '@/store/uiStore';

type SaveActionType = 'refresh' | 'save' | 'load' | 'delete' | 'recover';

interface SaveActionState {
  type: SaveActionType | null;
  slotId?: SaveSlotId;
}

export interface UseSaveLoadResult {
  slots: SaveSlot[];
  actionState: SaveActionState;
  loading: boolean;
  error: string | null;
  refreshSlots: () => Promise<void>;
  saveToSlot: (slotId: SaveSlotId) => Promise<void>;
  loadFromSlot: (slotId: SaveSlotId) => Promise<void>;
  deleteSlot: (slotId: SaveSlotId) => Promise<void>;
  recoverSlot: (slotId: SaveSlotId) => Promise<void>;
}

const defaultActionState: SaveActionState = { type: null };

const getService = () => SaveLoadService.getInstance();

export const useSaveLoad = (): UseSaveLoadResult => {
  const slots = useSaveSlots((state) => state.slots);
  const setSlot = useSaveSlots((state) => state.setSlot);
  const addNotification = useUIStore((state) => state.addNotification);
  const [actionState, setActionState] = useState<SaveActionState>(defaultActionState);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async (
      type: SaveActionType,
      slotId: SaveSlotId | undefined,
      task: () => Promise<void>,
      successMessage?: string,
    ) => {
      setActionState({ type, slotId });
      setError(null);
      try {
        await task();
        if (successMessage) {
          addNotification({ type: 'success', message: successMessage });
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Save/load operation failed';
        setError(message);
        addNotification({ type: 'error', message });
        throw err;
      } finally {
        setActionState(defaultActionState);
      }
    },
    [addNotification],
  );

  const refreshSlots = useCallback(async () => {
    await run('refresh', undefined, async () => {
      await getService().getSaveSlots();
    });
  }, [run]);

  const saveToSlot = useCallback(
    async (slotId: SaveSlotId) => {
      await run('save', slotId, async () => {
        await getService().saveGame(slotId, 'manual');
      }, 'Chronicle saved');
    },
    [run],
  );

  const loadFromSlot = useCallback(
    async (slotId: SaveSlotId) => {
      await run('load', slotId, async () => {
        await getService().loadGame(slotId);
      }, 'Chronicle loaded');
    },
    [run],
  );

  const deleteSlot = useCallback(
    async (slotId: SaveSlotId) => {
      await run('delete', slotId, async () => {
        await getService().deleteSave(slotId);
      }, 'Save deleted');
    },
    [run],
  );

  const recoverSlot = useCallback(
    async (slotId: SaveSlotId) => {
      await run('recover', slotId, async () => {
        setSlot(slotId, { corrupted: false });
      }, 'Slot recovered');
    },
    [run, setSlot],
  );

  useEffect(() => {
    void refreshSlots();
  }, [refreshSlots]);

  return {
    slots,
    actionState,
    loading: actionState.type !== null,
    error,
    refreshSlots,
    saveToSlot,
    loadFromSlot,
    deleteSlot,
    recoverSlot,
  };
};
