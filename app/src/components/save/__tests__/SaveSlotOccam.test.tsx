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
import { requestManualOverride } from '../../../services/guardianShell/manualOverride';
import { tsave } from '../../../localization/save';

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

jest.mock('../../../services/guardianShell/manualOverride', () => ({
  requestManualOverride: jest.fn(),
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

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

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

  it('превключва активния слот, ако текущият липсва в стора', () => {
    const { getByTestId } = render(<SaveSlotOccam />);

    act(() => {
      useSaveSlots.getState().reset([
        {
          id: 'solo-slot',
          occupied: true,
          title: 'Solo',
          updatedAt: '2026-01-28T00:00:00.000Z',
          playtimeMinutes: 42,
          lastSaveType: 'manual',
          dlcFlags: [],
          corrupted: false,
        },
      ] as any);
    });

    const soloCard = getByTestId('save-slot-card-solo-slot');
    expect(soloCard.props.accessibilityState?.selected).toBe(true);
  });

  it('извиква manual override при recover и маркира слота като чист', () => {
    const { getByTestId } = render(<SaveSlotOccam />);

    fireEvent.press(getByTestId('save-slot-card-slot-2'));
    fireEvent.press(getByTestId('action-recover'));

    expect(requestManualOverride).toHaveBeenCalledWith({ slotId: 'slot-2', reason: 'corruption' });
    const slot = useSaveSlots.getState().slots.find((s) => s.id === 'slot-2');
    expect(slot?.corrupted).toBe(false);
  });

  it('показва NG+ overlay копие и специално действие', () => {
    const { getByTestId, getAllByText } = render(<SaveSlotOccam />);

    fireEvent.press(getByTestId('save-slot-card-ng-plus'));

    expect(getByTestId('action-ng-plus')).toBeTruthy();
    expect(getAllByText(tsave('bg', 'button.newGamePlus')).length).toBeGreaterThan(0);
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

  it('управлява overlay visibility при mount/unmount', async () => {
    const { unmount } = render(<SaveSlotOccam />);

    await waitFor(() => {
      expect(useUXState.getState().overlaysVisible).toBe(2);
    });

    unmount();

    await waitFor(() => {
      expect(useUXState.getState().overlaysVisible).toBe(0);
    });
  });

  it('action бутоните select/delete актуализират стора и телеметрията', () => {
    const events: SaveTelemetryEvent[] = [];
    const unsubscribe = subscribeToSaveTelemetry((event) => events.push(event));
    const { getByTestId } = render(<SaveSlotOccam />);

    fireEvent.press(getByTestId('save-slot-card-slot-1'));
    fireEvent.press(getByTestId('action-select'));
    fireEvent.press(getByTestId('action-delete'));

    const slot = useSaveSlots.getState().slots.find((s) => s.id === 'slot-1');
    expect(slot).toMatchObject({ occupied: false, title: null, corrupted: false });
    expect(events.filter((event) => event.type === 'save.slotSelected')).toHaveLength(2);
    expect(events.find((event) => event.type === 'save.slotDeleted')).toBeTruthy();

    unsubscribe();
  });

  it('обновява overlay копието при NG+ и при възстановен слот', () => {
    const { getByTestId, getAllByText } = render(<SaveSlotOccam />);

    expect(getAllByText(tsave('bg', 'overlay.detailsTitle')).length).toBeGreaterThan(0);

    fireEvent.press(getByTestId('save-slot-card-ng-plus'));
    expect(getAllByText(tsave('bg', 'overlay.ngPlusTitle')).length).toBeGreaterThan(0);
    expect(getByTestId('action-ng-plus')).toBeTruthy();

    fireEvent.press(getByTestId('save-slot-card-slot-2'));
    expect(
      getAllByText(new RegExp(escapeRegExp(tsave('bg', 'status.corrupted')), 'i')).length,
    ).toBeGreaterThan(0);

    fireEvent.press(getByTestId('action-recover'));
    expect(
      getAllByText(new RegExp(escapeRegExp(tsave('bg', 'status.clean')), 'i')).length,
    ).toBeGreaterThan(0);
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
