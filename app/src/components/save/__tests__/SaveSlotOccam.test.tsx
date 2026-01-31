import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { SaveSlotOccam } from '../SaveSlotOccam';
import { useUIStore } from '@/store/uiStore';
import { useUXPerfEvents } from '@/store/perfStore';
import { useSaveLoad, type UseSaveLoadResult } from '@/hooks/useSaveLoad';
import type { SaveSlotId } from '@/services/save/SaveLoadService';
import {
  logSaveNewGamePlus,
  logSaveRecoveryAttempt,
  logSaveSlotDeleted,
  logSaveSlotSelected,
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
    setOverlaysVisible: (value: number) => set({ overlaysVisible: value }),
    setHighContrast: (value: boolean) => set({ highContrast: value }),
    setLocale: (value: string) => set({ locale: value }),
    setEffectsAvailable: (value: boolean) => set({ effectsAvailable: value }),
  }));

  return { useUIStore };
});

jest.mock('../../../services/telemetry/save', () => ({
  logSaveSlotSelected: jest.fn(),
  logSaveSlotDeleted: jest.fn(),
  logSaveRecoveryAttempt: jest.fn(),
  logSaveNewGamePlus: jest.fn(),
}));

const createMockSlots = () => [
  {
    id: 'slot-1',
    occupied: true,
    title: 'Dry Seal of Stara Planina',
    updatedAt: '2026-01-29T09:00:00.000Z',
    playtimeMinutes: 324,
    lastSaveType: 'manual' as const,
    dlcFlags: ['occult'],
    corrupted: false,
  },
  {
    id: 'slot-2',
    occupied: true,
    title: 'Witness Of Rhodope',
    updatedAt: '2026-01-28T14:00:00.000Z',
    playtimeMinutes: 812,
    lastSaveType: 'auto' as const,
    dlcFlags: [],
    corrupted: true,
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

const createAsyncMock = <Args extends unknown[]>(
  impl?: (...args: Args) => Promise<void>,
) => jest.fn<Promise<void>, Args>(impl ?? (async () => {}));

const createSaveLoadMock = (): jest.Mocked<UseSaveLoadResult> => ({
  slots: createMockSlots(),
  actionState: { type: null, slotId: undefined },
  error: null,
  loading: false,
  refreshSlots: createAsyncMock(),
  saveToSlot: createAsyncMock<[SaveSlotId]>(async () => {}),
  loadFromSlot: createAsyncMock<[SaveSlotId]>(async () => {}),
  deleteSlot: createAsyncMock<[SaveSlotId]>(async () => {}),
  recoverSlot: createAsyncMock<[SaveSlotId]>(async () => {}),
});

const mockSaveLoadState = createSaveLoadMock();

jest.mock('@/hooks/useSaveLoad', () => ({
  useSaveLoad: jest.fn(() => mockSaveLoadState),
}));

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

const useSaveLoadMock = useSaveLoad as jest.MockedFunction<typeof useSaveLoad>;
const telemetryMocks = {
  logSaveSlotSelected: logSaveSlotSelected as jest.Mock,
  logSaveSlotDeleted: logSaveSlotDeleted as jest.Mock,
  logSaveRecoveryAttempt: logSaveRecoveryAttempt as jest.Mock,
  logSaveNewGamePlus: logSaveNewGamePlus as jest.Mock,
};

const resetStores = () => {
  act(() => {
    const fresh = createSaveLoadMock();
    Object.assign(mockSaveLoadState, fresh);
    useSaveLoadMock.mockReturnValue(mockSaveLoadState);
    useUXPerfEvents.getState().reset();
    const uiState = useUIStore.getState();
    uiState.setOverlaysVisible(0);
    uiState.setHighContrast(false);
    uiState.setLocale('bg');
    uiState.setEffectsAvailable(true);
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
    telemetryMocks.logSaveSlotSelected.mockClear();
    telemetryMocks.logSaveSlotDeleted.mockClear();
    telemetryMocks.logSaveRecoveryAttempt.mockClear();
    telemetryMocks.logSaveNewGamePlus.mockClear();
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

  it('логва telemetry за select/delete/recover/NG+', async () => {
    const { getByTestId } = render(<SaveSlotOccam />);

    fireEvent.press(getByTestId('save-slot-card-slot-2'));
    fireEvent.press(getByTestId('action-recover'));
    fireEvent.press(getByTestId('action-delete'));
    fireEvent.press(getByTestId('save-slot-card-ng-plus'));
    fireEvent.press(getByTestId('action-ng-plus'));

    expect(telemetryMocks.logSaveSlotSelected).toHaveBeenCalledWith(
      'slot-2',
      expect.objectContaining({ corrupted: true }),
    );
    expect(telemetryMocks.logSaveRecoveryAttempt).toHaveBeenCalledWith(
      'slot-2',
      expect.objectContaining({ dlcFlags: [] }),
    );
    await waitFor(() =>
      expect(telemetryMocks.logSaveSlotDeleted).toHaveBeenCalledWith('slot-2', expect.any(Object)),
    );
    await waitFor(() =>
      expect(telemetryMocks.logSaveNewGamePlus).toHaveBeenCalledWith('ng-plus', expect.any(Object)),
    );
  });

  it('превключва активния слот, ако текущият липсва в стора', () => {
    mockSaveLoadState.slots = [
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
    ] as any;
    useSaveLoadMock.mockReturnValue({ ...mockSaveLoadState });

    const { getByTestId } = render(<SaveSlotOccam />);

    const soloCard = getByTestId('save-slot-card-solo-slot');
    expect(soloCard.props.accessibilityState?.selected).toBe(true);
  });

  it('извиква manual override при recover и маркира слота като чист', () => {
    const { getByTestId } = render(<SaveSlotOccam />);

    fireEvent.press(getByTestId('save-slot-card-slot-2'));
    fireEvent.press(getByTestId('action-recover'));

    expect(requestManualOverride).toHaveBeenCalledWith({ slotId: 'slot-2', reason: 'corruption' });
    expect(mockSaveLoadState.recoverSlot).toHaveBeenCalledWith('slot-2');
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
      useUIStore.getState().setEffectsAvailable(false);
    });

    renderWithProviders(<SaveSlotOccam />);
    await waitFor(() => {
      expect(haptics.impactAsync).toHaveBeenCalledTimes(1);
    });
    jest.advanceTimersByTime(200);
    expect(haptics.impactAsync).toHaveBeenCalledTimes(2);

    act(() => {
      useUIStore.getState().setEffectsAvailable(true);
    });
  });

  it('управлява overlay visibility при mount/unmount', async () => {
    const { unmount } = render(<SaveSlotOccam />);

    await waitFor(() => {
      expect(useUIStore.getState().overlaysVisible).toBe(2);
    });

    unmount();

    await waitFor(() => {
      expect(useUIStore.getState().overlaysVisible).toBe(0);
    });
  });

  it('action бутоните select/delete актуализират стора и телеметрията', async () => {
    const { getByTestId } = render(<SaveSlotOccam />);

    fireEvent.press(getByTestId('save-slot-card-slot-1'));
    fireEvent.press(getByTestId('action-select'));
    fireEvent.press(getByTestId('action-delete'));

    expect(mockSaveLoadState.loadFromSlot).toHaveBeenCalledWith('slot-1');
    expect(mockSaveLoadState.deleteSlot).toHaveBeenCalledWith('slot-1');
    expect(telemetryMocks.logSaveSlotSelected).toHaveBeenCalled();
    await waitFor(() =>
      expect(telemetryMocks.logSaveSlotDeleted).toHaveBeenCalledWith('slot-1', expect.any(Object)),
    );
  });

  it('обновява overlay копието при NG+ и при възстановен слот', () => {
    const { getByTestId, getAllByText, rerender } = render(<SaveSlotOccam />);

    expect(getAllByText(tsave('bg', 'overlay.detailsTitle')).length).toBeGreaterThan(0);

    fireEvent.press(getByTestId('save-slot-card-ng-plus'));
    expect(getAllByText(tsave('bg', 'overlay.ngPlusTitle')).length).toBeGreaterThan(0);
    expect(getByTestId('action-ng-plus')).toBeTruthy();

    fireEvent.press(getByTestId('save-slot-card-slot-2'));
    expect(
      getAllByText(new RegExp(escapeRegExp(tsave('bg', 'status.corrupted')), 'i')).length,
    ).toBeGreaterThan(0);

    fireEvent.press(getByTestId('action-recover'));
    act(() => {
      mockSaveLoadState.slots = mockSaveLoadState.slots.map((slot) =>
        slot.id === 'slot-2' ? { ...slot, corrupted: false } : slot,
      );
      useSaveLoadMock.mockReturnValue({ ...mockSaveLoadState });
    });
    rerender(<SaveSlotOccam />);
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
