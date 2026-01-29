jest.mock('expo-haptics', () => ({
  ImpactFeedbackStyle: { Medium: 'Medium' },
  impactAsync: jest.fn(),
  __esModule: true,
}));

import * as Haptics from 'expo-haptics';
import { triggerDoubleHaptic } from '../drySeal';

describe('triggerDoubleHaptic', () => {
  const impactAsyncMock = jest.mocked(Haptics.impactAsync);

  beforeEach(() => {
    jest.useFakeTimers();
    impactAsyncMock.mockReset();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('fires two medium impacts with a short delay', async () => {
    impactAsyncMock.mockResolvedValueOnce(undefined).mockResolvedValueOnce(undefined);
    await triggerDoubleHaptic();
    expect(impactAsyncMock).toHaveBeenCalledTimes(1);
    expect(impactAsyncMock).toHaveBeenLastCalledWith(Haptics.ImpactFeedbackStyle.Medium);

    jest.advanceTimersByTime(120);
    await Promise.resolve();

    expect(impactAsyncMock).toHaveBeenCalledTimes(2);
  });

  it('logs a warning if the first impact fails', async () => {
    const error = new Error('haptics missing');
    impactAsyncMock.mockRejectedValueOnce(error);
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

    await triggerDoubleHaptic();

    expect(warnSpy).toHaveBeenCalledWith('[haptics] unavailable', error);
    expect(impactAsyncMock).toHaveBeenCalledTimes(1);
  });

  it('swallows secondary impact failures without warning', async () => {
    impactAsyncMock.mockResolvedValueOnce(undefined).mockRejectedValueOnce(new Error('secondary fail'));
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

    await triggerDoubleHaptic();
    jest.advanceTimersByTime(120);
    await Promise.resolve();

    expect(impactAsyncMock).toHaveBeenCalledTimes(2);
    expect(warnSpy).not.toHaveBeenCalled();
  });
});
