import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { SaveSlotOccam } from '../SaveSlotOccam';
import { useSaveSlots } from '../../../state/saveSlots';
import { useUXState } from '../../../state/uxState';
import { useUXPerfEvents } from '../../../state/perf';
import {
  subscribeToSaveTelemetry,
  type SaveTelemetryEvent,
} from '../../../services/telemetry/save';
import { renderWithProviders } from '../../../test-utils/renderWithProviders';

jest.mock('expo-linear-gradient', () => {
  const React = require('react');
  return {
    LinearGradient: ({ children }: any) => <React.Fragment>{children}</React.Fragment>,
  };
});

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: { Medium: 'medium' },
}));

const resetStores = () => {
  act(() => {
    useSaveSlots.getState().reset();
    useUXPerfEvents.getState().reset();
    const uxState = useUXState.getState();
    uxState.setOverlaysVisible(0);
    uxState.setHighContrast(false);
    uxState.setLocale('bg');
    uxState.setEffectsAvailable(true);
  });
};

const flattenStyle = (style: any) => {
  if (Array.isArray(style)) {
    return style.reduce((acc, item) => ({ ...acc, ...flattenStyle(item) }), {});
  }
  return style ?? {};
};

describe('SaveSlotOccam', () => {
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useRealTimers();
    resetStores();
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
    resetStores();
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  it('спазва Occam двуслоен layout и reach зона <=48px', () => {
    const { getByTestId } = renderWithProviders(<SaveSlotOccam />);
    expect(getByTestId('occam-layer-primary')).toBeTruthy();
    expect(getByTestId('occam-layer-overlay')).toBeTruthy();
    const reachZoneStyle = flattenStyle(getByTestId('reach-zone').props.style);
    expect(reachZoneStyle.width).toBeWithinRange(0, 48);
  });

  it('логва telemetry за select/delete/recover/NG+', () => {
    const events: SaveTelemetryEvent[] = [];
    const unsubscribe = subscribeToSaveTelemetry((event) => events.push(event));
    const { getByTestId } = render(<SaveSlotOccam />);

    fireEvent.press(getByTestId('save-slot-card-slot-2'));
    fireEvent.press(getByTestId('action-recover'));
    fireEvent.press(getByTestId('action-delete'));
    fireEvent.press(getByTestId('save-slot-card-ng-plus'));
    fireEvent.press(getByTestId('action-ng-plus'));

    expect(events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'save.slotSelected', slotId: 'slot-2' }),
        expect.objectContaining({ type: 'save.recoveryAttempt', slotId: 'slot-2' }),
        expect.objectContaining({ type: 'save.slotDeleted', slotId: 'slot-2' }),
        expect.objectContaining({ type: 'save.newGamePlus', slotId: 'ng-plus' }),
      ]),
    );

    unsubscribe();
  });

  it('задейства dry seal fallback хаптик когато effects липсват', async () => {
    jest.useFakeTimers();
    const haptics = require('expo-haptics');

    act(() => {
      useUXState.getState().setEffectsAvailable(false);
    });

    renderWithProviders(<SaveSlotOccam />);
    await waitFor(() => {
      expect(haptics.impactAsync).toHaveBeenCalledTimes(1);
    });
    jest.advanceTimersByTime(200);
    expect(haptics.impactAsync).toHaveBeenCalledTimes(2);

    act(() => {
      useUXState.getState().setEffectsAvailable(true);
    });
  });

  it('запазва perf guardrail под 16ms', async () => {
    const nowSpy = jest
      .spyOn(performance, 'now')
      .mockImplementationOnce(() => 0)
      .mockImplementationOnce(() => 12.2);

    render(<SaveSlotOccam />);

    await waitFor(() => {
      const events = useUXPerfEvents.getState().events;
      expect(events.length).toBeGreaterThan(0);
      expect(events.at(-1)?.durationMs).toBeLessThan(16);
    });

    nowSpy.mockRestore();
  });
});
