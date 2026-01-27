import { Locale } from '../../theme/guardianShell';

export type MenuEventType = 'menu.opened' | 'menu.optionSelected' | 'menu.dlcLocked';

export type MenuTelemetryEvent = {
  type: MenuEventType;
  timestamp: number;
  optionId?: string;
  metadata?: Record<string, unknown>;
};

const listeners = new Set<(event: MenuTelemetryEvent) => void>();

const emit = (event: MenuTelemetryEvent) => {
  listeners.forEach((listener) => listener(event));
  // Fallback logging for now; replace with GuardianShell bus integration later.
  console.log(`[telemetry] ${event.type}`, event);
};

export const subscribeToMenuTelemetry = (
  listener: (event: MenuTelemetryEvent) => void,
): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const logMenuOpened = (context: { locale: Locale }) =>
  emit({ type: 'menu.opened', timestamp: Date.now(), metadata: context });

export const logMenuOptionSelected = (
  optionId: string,
  metadata?: Record<string, unknown>,
) => emit({ type: 'menu.optionSelected', optionId, timestamp: Date.now(), metadata });

export const logMenuDlcLocked = (optionId: string, metadata?: Record<string, unknown>) =>
  emit({ type: 'menu.dlcLocked', optionId, timestamp: Date.now(), metadata });
