import { create } from 'zustand';

export type EntitlementState = {
  entitlements: Record<string, boolean>;
  setEntitlement: (id: string, value: boolean) => void;
  hasEntitlement: (id: string) => boolean;
  reset: () => void;
};

const defaultEntitlements: Record<string, boolean> = {
  'dlc-occult-expansion': false,
};

const cloneEntitlements = () => ({ ...defaultEntitlements });

export const useEntitlements = create<EntitlementState>((set, get) => ({
  entitlements: cloneEntitlements(),
  setEntitlement: (id, value) =>
    set((state) => ({ entitlements: { ...state.entitlements, [id]: value } })),
  hasEntitlement: (id) => !!get().entitlements[id],
  reset: () => set({ entitlements: cloneEntitlements() }),
}));
