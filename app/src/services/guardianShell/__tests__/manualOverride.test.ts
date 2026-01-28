import { requestManualOverride, subscribeToManualOverride } from '../manualOverride';

describe('manual override bus', () => {
  const payload = { slotId: 'slot-4', reason: 'corruption' };
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it('notifies all subscribers and logs payloads', () => {
    const listener = jest.fn();
    const unsubscribe = subscribeToManualOverride(listener);

    requestManualOverride(payload);

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(payload);
    expect(logSpy).toHaveBeenCalledWith('[guardianShell] manualOverride.requested', payload);

    unsubscribe();
  });

  it('supports unsubscribing to stop future notifications', () => {
    const listener = jest.fn();
    const unsubscribe = subscribeToManualOverride(listener);

    unsubscribe();
    requestManualOverride(payload);

    expect(listener).not.toHaveBeenCalled();
  });
});
