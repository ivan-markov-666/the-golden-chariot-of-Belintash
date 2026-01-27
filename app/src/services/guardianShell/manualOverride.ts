type ManualOverridePayload = {
  slotId: string;
  reason: string;
};

const manualOverrideListeners = new Set<(payload: ManualOverridePayload) => void>();

export const requestManualOverride = (payload: ManualOverridePayload) => {
  console.log('[guardianShell] manualOverride.requested', payload);
  manualOverrideListeners.forEach((listener) => listener(payload));
};

export const subscribeToManualOverride = (
  listener: (payload: ManualOverridePayload) => void,
): (() => void) => {
  manualOverrideListeners.add(listener);
  return () => manualOverrideListeners.delete(listener);
};
