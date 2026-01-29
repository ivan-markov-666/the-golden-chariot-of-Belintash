import React from 'react';
import { render } from '@testing-library/react-native';
import { LoadGameScreen } from '../LoadGameScreen';

jest.mock('../../components/save/SaveSlotOccam', () => ({
  SaveSlotOccam: () => <></>,
}));

describe('LoadGameScreen', () => {
  it('renders the save slot component inside a SafeAreaView', () => {
    const { toJSON } = render(<LoadGameScreen />);

    expect(toJSON()).toMatchSnapshot();
  });
});
