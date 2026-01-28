import { act } from '@testing-library/react-native';
import { useUXState } from '../uxState';

describe('useUXState store', () => {
  beforeEach(() => {
    const { setOverlaysVisible, setHighContrast, setLocale, setEffectsAvailable } = useUXState.getState();
    act(() => {
      setOverlaysVisible(0);
      setHighContrast(false);
      setLocale('bg');
      setEffectsAvailable(true);
    });
  });

  it('updates overlay counters and toggles high contrast', () => {
    act(() => {
      useUXState.getState().setOverlaysVisible(3);
      useUXState.getState().setHighContrast(true);
    });

    expect(useUXState.getState().overlaysVisible).toBe(3);
    expect(useUXState.getState().highContrast).toBe(true);
  });

  it('changes locale and effect availability', () => {
    act(() => {
      useUXState.getState().setLocale('en');
      useUXState.getState().setEffectsAvailable(false);
    });

    expect(useUXState.getState().locale).toBe('en');
    expect(useUXState.getState().effectsAvailable).toBe(false);
  });
});
