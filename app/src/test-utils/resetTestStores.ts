import { act } from '@testing-library/react-native';
import { useUIStore } from '@/store/uiStore';
import { useSaveSlots } from '@/store/saveSlotsStore';

export const resetUiAndSaveStores = () => {
  act(() => {
    const ui = useUIStore.getState();
    ui.setOverlaysVisible(0);
    ui.setHighContrast(false);
    ui.setLocale('bg');
    ui.setEffectsAvailable(true);
    useSaveSlots.getState().reset();
  });
};
