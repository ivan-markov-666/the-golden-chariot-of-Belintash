import { act } from '@testing-library/react-native';
import { useUIStore } from '@/store/uiStore';

describe('uiStore', () => {
  const reset = () => {
    const ui = useUIStore.getState();
    act(() => {
      ui.setLoading(false);
      ui.setCurrentScreen('home');
      ui.closeModal();
      ui.clearNotifications();
      ui.setOverlaysVisible(0);
      ui.setHighContrast(false);
      ui.setLocale('bg');
      ui.setEffectsAvailable(true);
    });
  };

  beforeEach(reset);

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
    let notificationId = '';
    act(() => {
      useUIStore.getState().addNotification({ type: 'info', message: 'Hello' });
      notificationId = useUIStore.getState().notifications[0]?.id ?? '';
    });

    expect(useUIStore.getState().notifications).toHaveLength(1);

    act(() => {
      if (notificationId) {
        useUIStore.getState().removeNotification(notificationId);
      }
      useUIStore.getState().addNotification({ type: 'success', message: 'Saved' });
      useUIStore.getState().clearNotifications();
    });

    expect(useUIStore.getState().notifications).toHaveLength(0);
  });

  it('tracks loading state, current screen and modal lifecycle', () => {
    act(() => {
      useUIStore.getState().setLoading(true);
      useUIStore.getState().setCurrentScreen('quests');
      useUIStore.getState().openModal('confirm', { action: 'sacrifice' });
    });

    let state = useUIStore.getState();
    expect(state.loading).toBe(true);
    expect(state.currentScreen).toBe('quests');
    expect(state.modalOpen).toBe(true);
    expect(state.modalType).toBe('confirm');
    expect(state.modalData).toEqual({ action: 'sacrifice' });

    act(() => {
      useUIStore.getState().closeModal();
      useUIStore.getState().setLoading(false);
    });

    state = useUIStore.getState();
    expect(state.modalOpen).toBe(false);
    expect(state.modalType).toBeNull();
    expect(state.loading).toBe(false);
  });

  it('avoids re-render when effects flag stays the same', () => {
    const initial = useUIStore.getState();

    act(() => {
      useUIStore.getState().setEffectsAvailable(true);
    });

    expect(useUIStore.getState()).toBe(initial);

    act(() => {
      useUIStore.getState().setEffectsAvailable(false);
    });

    expect(useUIStore.getState().effectsAvailable).toBe(false);
  });
});
