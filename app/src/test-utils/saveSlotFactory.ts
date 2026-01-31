import { SaveSlot } from '@/store/saveSlotsStore';

let counter = 0;

export const buildSaveSlot = (overrides: Partial<SaveSlot> = {}): SaveSlot => {
  counter += 1;
  return {
    id: overrides.id ?? `slot-${counter}`,
    occupied: overrides.occupied ?? true,
    title: overrides.title ?? `Chronicle ${counter}`,
    updatedAt: overrides.updatedAt ?? new Date().toISOString(),
    playtimeMinutes: overrides.playtimeMinutes ?? 120,
    lastSaveType: overrides.lastSaveType ?? 'manual',
    dlcFlags: overrides.dlcFlags ?? [],
    corrupted: overrides.corrupted ?? false,
  };
};
