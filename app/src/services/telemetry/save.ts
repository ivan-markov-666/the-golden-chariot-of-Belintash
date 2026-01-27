export type SaveEventType =
  | 'save.slotSelected'
  | 'save.slotDeleted'
  | 'save.recoveryAttempt'
  | 'save.newGamePlus';

export type SaveTelemetryEvent = {
  type: SaveEventType;
  timestamp: number;
  slotId: string;
  metadata?: Record<string, unknown>;
};

const listeners = new Set<(event: SaveTelemetryEvent) => void>();

const emit = (event: SaveTelemetryEvent) => {
  listeners.forEach((listener) => listener(event));
  console.log(`[telemetry] ${event.type}`, event);
};

export const subscribeToSaveTelemetry = (listener: (event: SaveTelemetryEvent) => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const buildEvent = (type: SaveEventType, slotId: string, metadata?: Record<string, unknown>) => ({
  type,
  slotId,
  timestamp: Date.now(),
  metadata,
});

export const logSaveSlotSelected = (slotId: string, metadata?: Record<string, unknown>) =>
  emit(buildEvent('save.slotSelected', slotId, metadata));

export const logSaveSlotDeleted = (slotId: string, metadata?: Record<string, unknown>) =>
  emit(buildEvent('save.slotDeleted', slotId, metadata));

export const logSaveRecoveryAttempt = (slotId: string, metadata?: Record<string, unknown>) =>
  emit(buildEvent('save.recoveryAttempt', slotId, metadata));

export const logSaveNewGamePlus = (slotId: string, metadata?: Record<string, unknown>) =>
  emit(buildEvent('save.newGamePlus', slotId, metadata));
