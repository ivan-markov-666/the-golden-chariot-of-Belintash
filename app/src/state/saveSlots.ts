import { create } from 'zustand';

export type SaveSlot = {
  id: string;
  occupied: boolean;
  title: string | null;
  updatedAt: string | null;
};

const DEFAULT_SLOTS: SaveSlot[] = [
  { id: 'slot-1', occupied: false, title: null, updatedAt: null },
  { id: 'slot-2', occupied: false, title: null, updatedAt: null },
  { id: 'slot-3', occupied: false, title: null, updatedAt: null },
];

const cloneSlots = (slots: SaveSlot[]) => slots.map((slot) => ({ ...slot }));
const hasOccupied = (slots: SaveSlot[]) => slots.some((slot) => slot.occupied);

export type SaveSlotState = {
  slots: SaveSlot[];
  hasOccupied: boolean;
  setSlot: (id: string, data: Partial<SaveSlot>) => void;
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
  reset: (slots = cloneSlots(DEFAULT_SLOTS)) =>
    set({ slots, hasOccupied: hasOccupied(slots) }),
}));
