import { act } from '@testing-library/react-native';
import { useEntitlements } from '@/store/entitlementsStore';

describe('entitlementsStore', () => {
  beforeEach(() => {
    act(() => {
      useEntitlements.getState().reset();
    });
  });

  it('starts with default DLC entitlements disabled', () => {
    const state = useEntitlements.getState();
    expect(state.hasEntitlement('dlc-occult-expansion')).toBe(false);
    expect(state.entitlements['dlc-occult-expansion']).toBe(false);
  });

  it('setEntitlement toggles flags and hasEntitlement reflects change', () => {
    act(() => {
      useEntitlements.getState().setEntitlement('dlc-occult-expansion', true);
    });

    const state = useEntitlements.getState();
    expect(state.entitlements['dlc-occult-expansion']).toBe(true);
    expect(state.hasEntitlement('dlc-occult-expansion')).toBe(true);
  });

  it('reset restores defaults even for custom entitlements', () => {
    act(() => {
      useEntitlements.getState().setEntitlement('secret-feature', true);
      useEntitlements.getState().reset();
    });

    const state = useEntitlements.getState();
    expect(state.hasEntitlement('secret-feature')).toBe(false);
    expect(state.hasEntitlement('dlc-occult-expansion')).toBe(false);
  });
});
