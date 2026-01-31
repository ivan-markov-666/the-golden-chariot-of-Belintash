import { act } from '@testing-library/react-native';
import { useUIStore } from '@/store/uiStore';

describe('uiStore', () => {
  beforeEach(() => {
    const ui = useUIStore.getState();
    act(() => {
      ui.setOverlaysVisible(0);
      ui.setHighContrast(false);
      ui.setLocale('bg');
      ui.setEffectsAvailable(true);
    });
  });

  it('updates overlay visibility only when value changes', () => {
    act(() => {
      useUIStore.getState().setOverlaysVisible(2);
      useUIStore.getState().setOverlaysVisible(2);
      useUIStore.getState().setOverlaysVisible(1);
    });

    expect(useUIStore.getState().overlaysVisible).toBe(1);
  });

  it('toggles high contrast and locale', () => {
    act(() => {
      useUIStore.getState().setHighContrast(true);
      useUIStore.getState().setLocale('en');
    });

    const state = useUIStore.getState();
    expect(state.highContrast).toBe(true);
    expect(state.locale).toBe('en');
  });

  it('manages notifications lifecycle', () => {
    let id: string | undefined;
    act(() => {
      useUIStore.getState().addNotification({ type: 'info', message: 'Hello' });
      id = useUIStore.getState().notifications[0]?.id;
    });

    expect(useUIStore.getState().notifications).toHaveLength(1);

    act(() => {
      if (id) {
        useUIStore.getState().removeNotification(id);
      }
      useUIStore.getState().addNotification({ type: 'success', message: 'Saved' });
      useUIStore.getState().clearNotifications();
    });

    expect(useUIStore.getState().notifications).toHaveLength(0);
  });
});
