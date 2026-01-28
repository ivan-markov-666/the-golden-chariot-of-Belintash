import React from 'react';
import { render } from '@testing-library/react-native';
import { PlaceholderScreen } from '../PlaceholderScreen';

describe('PlaceholderScreen', () => {
  it('renders title and description text', () => {
    const { getByText } = render(
      <PlaceholderScreen title="Coming soon" description="This ritual is not ready" />,
    );

    expect(getByText('Coming soon')).toBeTruthy();
    expect(getByText('This ritual is not ready')).toBeTruthy();
  });
});
