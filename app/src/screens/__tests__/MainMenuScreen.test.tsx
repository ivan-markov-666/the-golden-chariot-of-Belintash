import React from 'react';
import { act, fireEvent } from '@testing-library/react-native';
import { Text, Pressable } from 'react-native';
import { MainMenuScreen } from '../MainMenuScreen';
import { useSaveSlots } from '@/store/saveSlotsStore';
import { useUIStore } from '@/store/uiStore';
import { renderWithProviders } from '../../test-utils/renderWithProviders';
import { resetUiAndSaveStores } from '../../test-utils/resetTestStores';

const mockNavigate = jest.fn();

type MockUIState = {
  overlaysVisible: number;
  highContrast: boolean;
  locale: string;
  effectsAvailable: boolean;
  setOverlaysVisible: (value: number) => void;
  setHighContrast: (value: boolean) => void;
  setLocale: (value: string) => void;
  setEffectsAvailable: (value: boolean) => void;
};

type MockSaveSlot = {
  id: string;
  occupied: boolean;
  title: string | null;
  updatedAt: string | null;
  playtimeMinutes: number;
  lastSaveType: 'manual' | 'auto';
  dlcFlags: string[];
  corrupted: boolean;
};

type MockSaveSlotsState = {
  slots: MockSaveSlot[];
  hasOccupied: boolean;
  setSlot: (id: string, data: Partial<MockSaveSlot>) => void;
  deleteSlot: (id: string) => void;
  reset: (slots?: MockSaveSlot[]) => void;
};

jest.mock('@/store/uiStore', () => {
  const mockState: MockUIState = {
    overlaysVisible: 0,
    highContrast: false,
    locale: 'bg',
    effectsAvailable: true,
    setOverlaysVisible: (value: number) => {
      mockState.overlaysVisible = value;
    },
    setHighContrast: (value: boolean) => {
      mockState.highContrast = value;
    },
    setLocale: (value: string) => {
      mockState.locale = value;
    },
    setEffectsAvailable: (value: boolean) => {
      mockState.effectsAvailable = value;
    },
  };

  const useUIStore = (selector?: (state: MockUIState) => any) =>
    selector ? selector(mockState) : mockState;

  useUIStore.getState = () => mockState;

  return { useUIStore };
});

jest.mock('@/store/saveSlotsStore', () => {
  const DEFAULT_SLOTS: MockSaveSlot[] = [
    {
      id: 'slot-1',
      occupied: true,
      title: 'Test Slot',
      updatedAt: '2023-01-01T00:00:00.000Z',
      playtimeMinutes: 120,
      lastSaveType: 'manual',
      dlcFlags: [],
      corrupted: false,
    },
  ];

  const cloneSlots = (slots: MockSaveSlot[]) => slots.map((slot) => ({ ...slot }));
  const hasOccupied = (slots: MockSaveSlot[]) => slots.some((slot) => slot.occupied);

  const mockState: MockSaveSlotsState = {
    slots: cloneSlots(DEFAULT_SLOTS),
    hasOccupied: hasOccupied(DEFAULT_SLOTS),
    setSlot: (id, data) => {
      mockState.slots = mockState.slots.map((slot) => (slot.id === id ? { ...slot, ...data } : slot));
      mockState.hasOccupied = hasOccupied(mockState.slots);
    },
    deleteSlot: (id) => {
      mockState.slots = mockState.slots.map((slot) =>
        slot.id === id
          ? {
              ...slot,
              occupied: false,
              title: null,
              updatedAt: null,
              playtimeMinutes: 0,
            }
          : slot,
      );
      mockState.hasOccupied = hasOccupied(mockState.slots);
    },
    reset: (slots = DEFAULT_SLOTS) => {
      mockState.slots = cloneSlots(slots);
      mockState.hasOccupied = hasOccupied(mockState.slots);
    },
  };

  const useSaveSlots = (selector?: (state: MockSaveSlotsState) => any) =>
    selector ? selector(mockState) : mockState;

  useSaveSlots.getState = () => mockState;

  return { useSaveSlots };
});

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({ navigate: mockNavigate }),
  };
});

jest.mock('../../components/menu/MainMenuOccam', () => {
  const React = require('react');
  const { Pressable, Text, View } = require('react-native');
  return {
    MainMenuOccam: ({ onNavigate }: { onNavigate?: (option: string) => void }) => (
      <View>
        <Pressable testID="mock-menu-load" onPress={() => onNavigate?.('load')}>
          <Text>Mock Load</Text>
        </Pressable>
        <Pressable testID="mock-menu-new" onPress={() => onNavigate?.('newGame')}>
          <Text>Mock New</Text>
        </Pressable>
        <Pressable testID="mock-menu-settings" onPress={() => onNavigate?.('settings')}>
          <Text>Mock Settings</Text>
        </Pressable>
        <Pressable testID="mock-menu-credits" onPress={() => onNavigate?.('credits')}>
          <Text>Mock Credits</Text>
        </Pressable>
        <Pressable testID="mock-menu-dlc" onPress={() => onNavigate?.('dlc')}>
          <Text>Mock DLC</Text>
        </Pressable>
      </View>
    ),
  };
});

const renderScreen = () => renderWithProviders(<MainMenuScreen />);

const getStyleProp = (styleProp: any, key: string) => {
  if (!styleProp) return undefined;
  if (Array.isArray(styleProp)) {
    for (const item of styleProp) {
      if (item && typeof item === 'object' && key in item) {
        return item[key];
      }
    }
    return undefined;
  }
  return styleProp[key];
};

describe('MainMenuScreen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    resetUiAndSaveStores();
  });

  it('пренасочва към LoadGame при навигация от менюто', () => {
    const { getByTestId } = renderScreen();

    fireEvent.press(getByTestId('mock-menu-load'));

    expect(mockNavigate).toHaveBeenCalledWith('LoadGame');
  });

  it('пренасочва към CharacterCreation при избор на New Game', () => {
    const { getByTestId } = renderScreen();

    fireEvent.press(getByTestId('mock-menu-new'));

    expect(mockNavigate).toHaveBeenCalledWith('CharacterCreation');
  });

  it('пренасочва към Settings', () => {
    const { getByTestId } = renderScreen();

    fireEvent.press(getByTestId('mock-menu-settings'));

    expect(mockNavigate).toHaveBeenCalledWith('Settings');
  });

  it('пренасочва към Credits', () => {
    const { getByTestId } = renderScreen();

    fireEvent.press(getByTestId('mock-menu-credits'));

    expect(mockNavigate).toHaveBeenCalledWith('Credits');
  });

  it('не навигира при неподдържана опция', () => {
    const { getByTestId } = renderScreen();

    fireEvent.press(getByTestId('mock-menu-dlc'));

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('показва версия и позволява toggle на музика', () => {
    const { getByTestId } = renderScreen();

    const toggle = getByTestId('bgm-toggle');
    expect(toggle.props.accessibilityState?.checked).toBe(true);

    fireEvent.press(toggle);
    expect(toggle.props.accessibilityState?.checked).toBe(false);

    expect(getByTestId('main-menu-version').props.children).toBe('v1.0.0');
  });

  it('показва empty preview hint когато няма save слотове', () => {
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

    const { getByTestId } = renderScreen();

    expect(getByTestId('save-preview-hint')).toBeTruthy();
  });

  it('fades in overlay when running outside of test environment', async () => {
    const originalWorkerId = process.env.JEST_WORKER_ID;
    delete process.env.JEST_WORKER_ID;
    jest.useFakeTimers();

    const { getByTestId } = renderScreen();
    const overlay = getByTestId('main-menu-overlay');
    expect(getStyleProp(overlay.props.style, 'opacity')).toBe(0);

    await act(async () => {
      jest.advanceTimersByTime(200);
    });

    expect(getStyleProp(overlay.props.style, 'opacity')).toBe(1);

    jest.useRealTimers();
    process.env.JEST_WORKER_ID = originalWorkerId;
  });

  it('uses high-contrast overlay colors when enabled', () => {
    act(() => {
      useUIStore.getState().setHighContrast(true);
    });

    const { getByTestId } = renderScreen();
    const overlay = getByTestId('main-menu-overlay');

    expect(getStyleProp(overlay.props.style, 'backgroundColor')).toBe('rgba(4, 4, 4, 0.88)');
  });
});
