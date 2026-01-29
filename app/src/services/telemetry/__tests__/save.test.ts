import {
  logSaveNewGamePlus,
  logSaveRecoveryAttempt,
  logSaveSlotDeleted,
  logSaveSlotSelected,
  subscribeToSaveTelemetry,
} from '../save';

describe('save telemetry service', () => {
  const timestamp = 1_700_000_123_000;
  let nowSpy: jest.SpyInstance;
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    nowSpy = jest.spyOn(Date, 'now').mockReturnValue(timestamp);
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    nowSpy.mockRestore();
    logSpy.mockRestore();
  });

  it('emits events for each save lifecycle log', () => {
    const listener = jest.fn();
    const unsubscribe = subscribeToSaveTelemetry(listener);

    logSaveSlotSelected('slot-1', { origin: 'main-menu' });
    logSaveSlotDeleted('slot-1');
    logSaveRecoveryAttempt('slot-2', { corruption: true });
    logSaveNewGamePlus('slot-3', { ngpLevel: 2 });

    expect(listener).toHaveBeenNthCalledWith(1, {
      type: 'save.slotSelected',
      slotId: 'slot-1',
      timestamp,
      metadata: { origin: 'main-menu' },
    });
    expect(listener).toHaveBeenNthCalledWith(2, {
      type: 'save.slotDeleted',
      slotId: 'slot-1',
      timestamp,
      metadata: undefined,
    });
    expect(listener).toHaveBeenNthCalledWith(3, {
      type: 'save.recoveryAttempt',
      slotId: 'slot-2',
      timestamp,
      metadata: { corruption: true },
    });
    expect(listener).toHaveBeenNthCalledWith(4, {
      type: 'save.newGamePlus',
      slotId: 'slot-3',
      timestamp,
      metadata: { ngpLevel: 2 },
    });
    expect(logSpy).toHaveBeenCalledTimes(4);

    unsubscribe();
  });
});
