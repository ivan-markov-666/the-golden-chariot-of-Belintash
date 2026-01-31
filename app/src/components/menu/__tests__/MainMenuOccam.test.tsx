import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { MainMenuOccam } from '../MainMenuOccam';
import { useSaveSlots } from '@/store/saveSlotsStore';
import { useEntitlements } from '@/store/entitlementsStore';
import { subscribeToMenuTelemetry } from '../../../services/telemetry/menu';
import { useUXPerfEvents } from '@/store/perfStore';
import { useUIStore } from '@/store/uiStore';
import { t } from '../../../localization/menu';

jest.mock('expo-linear-gradient', () => {
  const React = require('react');
  return {
    LinearGradient: ({ children }: any) => <React.Fragment>{children}</React.Fragment>,
  };
});

jest.mock('@/store/uiStore', () => {
  const { create } = require('zustand') as typeof import('zustand');
  const initialState = {
    overlaysVisible: 0,
    highContrast: false,
    locale: 'bg',
    effectsAvailable: true,
  };

  const useUIStore = create((set) => ({
    ...initialState,
    setOverlaysVisible: (value: number) =>
      set((state: typeof initialState) =>
        state.overlaysVisible === value ? state : { overlaysVisible: value },
      ),
    setHighContrast: (value: boolean) =>
      set((state: typeof initialState) =>
        state.highContrast === value ? state : { highContrast: value },
      ),
    setLocale: (value: string) =>
      set((state: typeof initialState) => (state.locale === value ? state : { locale: value })),
    setEffectsAvailable: (value: boolean) =>
      set((state: typeof initialState) =>
        state.effectsAvailable === value ? state : { effectsAvailable: value },
      ),
  }));

  return { useUIStore };
});

jest.mock('@/store/saveSlotsStore', () => {
  const { create } = require('zustand') as typeof import('zustand');
  const DEFAULT_SLOTS = [
    {
      id: 'slot-1',
      occupied: false,
      title: null,
      updatedAt: null,
      playtimeMinutes: 0,
      lastSaveType: 'manual' as const,
      dlcFlags: [],
      corrupted: false,
    },
    {
      id: 'slot-2',
      occupied: false,
      title: null,
      updatedAt: null,
      playtimeMinutes: 0,
      lastSaveType: 'manual' as const,
      dlcFlags: [],
      corrupted: false,
    },
    {
      id: 'slot-3',
      occupied: false,
      title: null,
      updatedAt: null,
      playtimeMinutes: 0,
      lastSaveType: 'manual' as const,
      dlcFlags: [],
      corrupted: false,
    },
  ];

  const cloneSlots = (slots: any[]) => slots.map((slot) => ({ ...slot }));
  const hasOccupied = (slots: any[]) => slots.some((slot) => slot.occupied);

  const useSaveSlots = create((set) => ({
    slots: cloneSlots(DEFAULT_SLOTS),
    hasOccupied: hasOccupied(DEFAULT_SLOTS),
    setSlot: (id: string, data: Partial<any>) =>
      set((state: any) => {
        const slots = state.slots.map((slot: any) => (slot.id === id ? { ...slot, ...data } : slot));
        return { slots, hasOccupied: hasOccupied(slots) };
      }),
    deleteSlot: (id: string) =>
      set((state: any) => {
        const slots = state.slots.map((slot: any) =>
          slot.id === id
            ? {
                ...slot,
                occupied: false,
                title: null,
                updatedAt: null,
                playtimeMinutes: 0,
                corrupted: false,
              }
            : slot,
        );
        return { slots, hasOccupied: hasOccupied(slots) };
      }),
    reset: (slots = DEFAULT_SLOTS) => {
      const cloned = cloneSlots(slots);
      set({ slots: cloned, hasOccupied: hasOccupied(cloned) });
    },
  }));

  return { useSaveSlots };
});

jest.mock('@/store/perfStore', () => {
  type MockUXPerfEvent = { id: string; durationMs: number; timestamp: number };
  const state = {
    events: [] as MockUXPerfEvent[],
    logEvent: (event: MockUXPerfEvent) => {
      state.events.push(event);
    },
    reset: () => {
      state.events = [];
    },
  };

  const useUXPerfEvents = (selector?: (s: typeof state) => any) =>
    selector ? selector(state) : state;

  useUXPerfEvents.getState = () => state;

  return { useUXPerfEvents };
});

const EMPTY_SLOTS = [
  { id: 'slot-1', occupied: false, title: null, updatedAt: null },
  { id: 'slot-2', occupied: false, title: null, updatedAt: null },
  { id: 'slot-3', occupied: false, title: null, updatedAt: null },
];

type MenuTelemetryEvent = {
  type: string;
  optionId?: string;
  slotId?: string;
};

const resetStores = () => {
  useSaveSlots.getState().reset(EMPTY_SLOTS as any);
  useEntitlements.getState().reset();
  useUXPerfEvents.getState().reset();
  const uiState = useUIStore.getState();
  uiState.setOverlaysVisible(0);
  uiState.setHighContrast(false);
  uiState.setLocale('bg');
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
      expect(useUIStore.getState().overlaysVisible).toBe(2);
    });

    unmount();
    await waitFor(() => {
      expect(useUIStore.getState().overlaysVisible).toBe(0);
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
