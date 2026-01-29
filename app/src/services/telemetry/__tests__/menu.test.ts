import {
  logMenuDlcLocked,
  logMenuOpened,
  logMenuOptionSelected,
  subscribeToMenuTelemetry,
} from '../menu';

describe('menu telemetry service', () => {
  const timestamp = 1_700_000_000_000;
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

  it('emits menu opened events with locale metadata', () => {
    const listener = jest.fn();
    const unsubscribe = subscribeToMenuTelemetry(listener);

    logMenuOpened({ locale: 'bg' });

    expect(listener).toHaveBeenCalledWith({
      type: 'menu.opened',
      timestamp,
      metadata: { locale: 'bg' },
    });
    expect(logSpy).toHaveBeenCalledWith('[telemetry] menu.opened', expect.any(Object));

    unsubscribe();
  });

  it('emits option selected and DLC locked events', () => {
    const listener = jest.fn();
    const unsubscribe = subscribeToMenuTelemetry(listener);

    logMenuOptionSelected('continue', { hasSaves: true });
    logMenuDlcLocked('dlc-occult', { entitlement: false });

    expect(listener).toHaveBeenNthCalledWith(1, {
      type: 'menu.optionSelected',
      optionId: 'continue',
      timestamp,
      metadata: { hasSaves: true },
    });
    expect(listener).toHaveBeenNthCalledWith(2, {
      type: 'menu.dlcLocked',
      optionId: 'dlc-occult',
      timestamp,
      metadata: { entitlement: false },
    });
    expect(logSpy).toHaveBeenCalledTimes(2);

    unsubscribe();
  });
});
