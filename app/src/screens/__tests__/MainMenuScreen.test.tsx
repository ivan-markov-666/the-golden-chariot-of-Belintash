import React from 'react';
import { act, fireEvent } from '@testing-library/react-native';
import { Text, Pressable } from 'react-native';
import { MainMenuScreen } from '../MainMenuScreen';
import { useSaveSlots } from '../../state/saveSlots';
import { useUXState } from '../../state/uxState';
import { renderWithProviders } from '../../test-utils/renderWithProviders';

const mockNavigate = jest.fn();

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
    act(() => {
      useSaveSlots.getState().reset();
      useUXState.getState().setHighContrast(false);
    });
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
      useUXState.getState().setHighContrast(true);
    });

    const { getByTestId } = renderScreen();
    const overlay = getByTestId('main-menu-overlay');

    expect(getStyleProp(overlay.props.style, 'backgroundColor')).toBe('rgba(4, 4, 4, 0.88)');
  });
});
