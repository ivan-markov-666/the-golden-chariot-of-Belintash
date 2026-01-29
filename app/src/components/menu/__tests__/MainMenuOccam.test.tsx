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
import { useUXState } from '../../../state/uxState';
import { t } from '../../../localization/menu';

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
  const uxState = useUXState.getState();
  uxState.setOverlaysVisible(0);
  uxState.setHighContrast(false);
  uxState.setLocale('bg');
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

  it('не навигира и не логва, когато опцията е деактивирана (липсват сейвове)', () => {
    const events: MenuTelemetryEvent[] = [];
    const unsubscribe = subscribeToMenuTelemetry((event) => events.push(event));
    act(() => {
      useSaveSlots.getState().reset([
        {
          id: 'slot-1',
          occupied: false,
          title: null,
          updatedAt: null,
          playtimeMinutes: 0,
          lastSaveType: 'manual',
          dlcFlags: [],
          corrupted: false,
        },
      ] as any);
    });

    const { getByTestId } = render(<MainMenuOccam />);
    fireEvent.press(getByTestId('menu-option-load'));

    expect(events.filter((event) => event.type === 'menu.optionSelected')).toHaveLength(0);
    unsubscribe();
  });

  it('извиква onNavigate за отключена опция', () => {
    const onNavigate = jest.fn();
    const { getByTestId } = render(<MainMenuOccam onNavigate={onNavigate} />);

    fireEvent.press(getByTestId('menu-option-newGame'));

    expect(onNavigate).toHaveBeenCalledWith('newGame');
  });

  it('показва отключен DLC badge и навигира при entitlement', () => {
    act(() => {
      useEntitlements.getState().setEntitlement('dlc-occult-expansion', true);
    });
    const events: MenuTelemetryEvent[] = [];
    const unsubscribe = subscribeToMenuTelemetry((event) => events.push(event));
    const onNavigate = jest.fn();
    const { getByTestId, getByText } = render(<MainMenuOccam onNavigate={onNavigate} />);

    expect(getByText(t('bg', 'dlc.unlockedLabel'))).toBeTruthy();

    fireEvent.press(getByTestId('menu-option-dlc'));

    expect(events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'menu.optionSelected', optionId: 'dlc' }),
      ]),
    );
    expect(onNavigate).toHaveBeenCalledWith('dlc');
    unsubscribe();
  });

  it('обновява tooltip при сменен акцент и управлява overlay visibility', async () => {
    const { getByTestId, getByText, unmount } = render(<MainMenuOccam />);

    act(() => {
      fireEvent(getByTestId('menu-option-credits'), 'pressIn');
    });

    await waitFor(() => {
      expect(getByText(t('bg', 'tooltips.credits'))).toBeTruthy();
      expect(useUXState.getState().overlaysVisible).toBe(2);
    });

    unmount();
    await waitFor(() => {
      expect(useUXState.getState().overlaysVisible).toBe(0);
    });
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
