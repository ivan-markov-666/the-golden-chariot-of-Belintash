import { create } from 'zustand';
import { Locale } from '../theme/guardianShell';

export type UXState = {
  overlaysVisible: number;
  highContrast: boolean;
  locale: Locale;
  setOverlaysVisible: (value: number) => void;
  setHighContrast: (value: boolean) => void;
  setLocale: (value: Locale) => void;
  effectsAvailable: boolean;
  setEffectsAvailable: (value: boolean) => void;
};

export const useUXState = create<UXState>((set) => ({
  overlaysVisible: 0,
  highContrast: false,
  locale: 'bg',
  effectsAvailable: true,
  setOverlaysVisible: (value) => set({ overlaysVisible: value }),
  setHighContrast: (value) => set({ highContrast: value }),
  setLocale: (value) => set({ locale: value }),
  setEffectsAvailable: (value) => set({ effectsAvailable: value }),
}));
