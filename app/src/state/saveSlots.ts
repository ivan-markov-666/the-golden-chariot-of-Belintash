import { create } from 'zustand';

export type SaveSlot = {
  id: string;
  occupied: boolean;
  title: string | null;
  updatedAt: string | null;
  playtimeMinutes: number;
  lastSaveType: 'manual' | 'auto';
  dlcFlags: string[];
  corrupted: boolean;
};

const DEFAULT_SLOTS: SaveSlot[] = [
  {
    id: 'slot-1',
    occupied: true,
    title: 'Dry Seal of Stara Planina',
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    playtimeMinutes: 324,
    lastSaveType: 'manual',
    dlcFlags: ['occult'],
    corrupted: false,
  },
  {
    id: 'slot-2',
    occupied: true,
    title: 'Witness Of Rhodope',
    updatedAt: new Date(Date.now() - 1000 * 60 * 145).toISOString(),
    playtimeMinutes: 812,
    lastSaveType: 'auto',
    dlcFlags: [],
    corrupted: true,
  },
  {
    id: 'slot-3',
    occupied: false,
    title: null,
    updatedAt: null,
    playtimeMinutes: 0,
    lastSaveType: 'manual',
    dlcFlags: [],
    corrupted: false,
  },
];

const cloneSlots = (slots: SaveSlot[]) => slots.map((slot) => ({ ...slot }));
const hasOccupied = (slots: SaveSlot[]) => slots.some((slot) => slot.occupied);

export type SaveSlotState = {
  slots: SaveSlot[];
  hasOccupied: boolean;
  setSlot: (id: string, data: Partial<SaveSlot>) => void;
  deleteSlot: (id: string) => void;
  reset: (slots?: SaveSlot[]) => void;
};

export const useSaveSlots = create<SaveSlotState>((set) => ({
  slots: cloneSlots(DEFAULT_SLOTS),
  hasOccupied: false,
  setSlot: (id, data) =>
    set((state) => {
      const slots = state.slots.map((slot) =>
        slot.id === id
          ? {
              ...slot,
              ...data,
              occupied: data.occupied ?? slot.occupied,
              title: data.title ?? slot.title,
              updatedAt: data.updatedAt ?? slot.updatedAt,
            }
          : slot,
      );
      return { slots, hasOccupied: hasOccupied(slots) };
    }),
  deleteSlot: (id) =>
    set((state) => {
      const slots = state.slots.map((slot) =>
        slot.id === id
          ? {
              ...slot,
              occupied: false,
              title: null,
              updatedAt: null,
              playtimeMinutes: 0,
              dlcFlags: [],
              corrupted: false,
            }
          : slot,
      );
      return { slots, hasOccupied: hasOccupied(slots) };
    }),
  reset: (slots = DEFAULT_SLOTS) => {
    const cloned = cloneSlots(slots);
    return set({ slots: cloned, hasOccupied: hasOccupied(cloned) });
  },
}));
