import React from 'react';
import { render } from '@testing-library/react-native';
import { LoadGameScreen } from '../LoadGameScreen';

jest.mock('../../components/save/SaveSlotOccam', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    SaveSlotOccam: () => <View testID="mock-save-slot" />,
  };
});

describe('LoadGameScreen', () => {
  it('wraps content in SafeAreaView and renders save slots', () => {
    const { toJSON, getByTestId } = render(<LoadGameScreen />);

    const tree = toJSON();
    expect(tree && typeof tree === 'object' && 'type' in tree).toBe(true);
    const rootType = (tree as { type?: string }).type ?? '';
    expect(rootType).toMatch(/SafeAreaView$/i);

    expect(() => getByTestId('mock-save-slot')).not.toThrow();
  });
});
