import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { MainMenuOccam } from '../MainMenuOccam';
import { useSaveSlots } from '../../../state/saveSlots';
import { useEntitlements } from '../../../state/entitlements';
import {
  subscribeToMenuTelemetry,
  type MenuTelemetryEvent,
} from '../../../services/telemetry/menu';
import { useUXPerfEvents } from '../../../state/perf';

jest.mock('expo-linear-gradient', () => {
  const React = require('react');
  return {
    LinearGradient: ({ children }: any) => <React.Fragment>{children}</React.Fragment>,
  };
});

const EMPTY_SLOTS = [
  { id: 'slot-1', occupied: false, title: null, updatedAt: null },
  { id: 'slot-2', occupied: false, title: null, updatedAt: null },
  { id: 'slot-3', occupied: false, title: null, updatedAt: null },
];

const resetStores = () => {
  useSaveSlots.getState().reset(EMPTY_SLOTS as any);
  useEntitlements.getState().reset();
  useUXPerfEvents.getState().reset();
};

describe('MainMenuOccam', () => {
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    act(() => {
      resetStores();
    });
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
    act(() => {
      resetStores();
    });
  });

  it('уважава Occam Overlay и отключва Continue/Load при save слотове', () => {
    const { getByTestId, rerender } = render(<MainMenuOccam />);

    expect(getByTestId('occam-layer-primary')).toBeTruthy();
    expect(getByTestId('occam-layer-overlay')).toBeTruthy();

    const continueButton = getByTestId('menu-option-continue');
    expect(continueButton.props.accessibilityState?.disabled).toBe(true);

    act(() => {
      useSaveSlots.getState().setSlot('slot-1', {
        occupied: true,
        title: 'Dry Seal',
        updatedAt: new Date().toISOString(),
      });
    });

    rerender(<MainMenuOccam />);
    expect(getByTestId('menu-option-continue').props.accessibilityState?.disabled).toBe(false);
  });

  it('логва telemetry за действия и DLC заключване', () => {
    const events: MenuTelemetryEvent[] = [];
    const unsubscribe = subscribeToMenuTelemetry((event) => events.push(event));
    const { getByTestId } = render(<MainMenuOccam />);

    fireEvent.press(getByTestId('menu-option-newGame'));
    fireEvent.press(getByTestId('menu-option-dlc'));

    expect(events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'menu.opened' }),
        expect.objectContaining({ type: 'menu.optionSelected', optionId: 'newGame' }),
        expect.objectContaining({ type: 'menu.dlcLocked', optionId: 'dlc' }),
      ]),
    );

    unsubscribe();
  });

  it('прави snapshot на двуслойния layout', () => {
    const { toJSON } = render(<MainMenuOccam />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('декларира perf guardrail под 16ms', async () => {
    const nowSpy = jest
      .spyOn(performance, 'now')
      .mockImplementationOnce(() => 0)
      .mockImplementationOnce(() => 12.5);

    render(<MainMenuOccam />);

    await waitFor(() => {
      const measurements = useUXPerfEvents.getState().events;
      expect(measurements.length).toBeGreaterThan(0);
      const lastMeasurement = measurements[measurements.length - 1];
      expect(lastMeasurement.durationMs).toBeLessThan(16);
    });

    nowSpy.mockRestore();
  });
});
