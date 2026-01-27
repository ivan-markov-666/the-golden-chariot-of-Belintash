import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { Text, Pressable } from 'react-native';
import { MainMenuScreen } from '../MainMenuScreen';

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

describe('MainMenuScreen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('пренасочва към LoadGame при навигация от менюто', () => {
    const { getByTestId } = render(<MainMenuScreen />);

    fireEvent.press(getByTestId('mock-menu-load'));

    expect(mockNavigate).toHaveBeenCalledWith('LoadGame');
  });

  it('пренасочва към CharacterCreation при избор на New Game', () => {
    const { getByTestId } = render(<MainMenuScreen />);

    fireEvent.press(getByTestId('mock-menu-new'));

    expect(mockNavigate).toHaveBeenCalledWith('CharacterCreation');
  });

  it('пренасочва към Settings', () => {
    const { getByTestId } = render(<MainMenuScreen />);

    fireEvent.press(getByTestId('mock-menu-settings'));

    expect(mockNavigate).toHaveBeenCalledWith('Settings');
  });

  it('пренасочва към Credits', () => {
    const { getByTestId } = render(<MainMenuScreen />);

    fireEvent.press(getByTestId('mock-menu-credits'));

    expect(mockNavigate).toHaveBeenCalledWith('Credits');
  });

  it('не навигира при неподдържана опция', () => {
    const { getByTestId } = render(<MainMenuScreen />);

    fireEvent.press(getByTestId('mock-menu-dlc'));

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
