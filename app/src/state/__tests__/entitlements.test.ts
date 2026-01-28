import { act } from '@testing-library/react-native';
import { useEntitlements } from '../entitlements';

describe('useEntitlements store', () => {
  beforeEach(() => {
    useEntitlements.getState().reset();
  });

  it('returns default entitlements and supports updates', () => {
    expect(useEntitlements.getState().hasEntitlement('dlc-occult-expansion')).toBe(false);

    act(() => {
      useEntitlements.getState().setEntitlement('dlc-occult-expansion', true);
    });

    expect(useEntitlements.getState().hasEntitlement('dlc-occult-expansion')).toBe(true);
    expect(useEntitlements.getState().entitlements['dlc-occult-expansion']).toBe(true);
  });

  it('resets to defaults', () => {
    act(() => {
      useEntitlements.getState().setEntitlement('dlc-occult-expansion', true);
    });

    act(() => {
      useEntitlements.getState().reset();
    });

    expect(useEntitlements.getState().entitlements['dlc-occult-expansion']).toBe(false);
  });
});
