import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';
import { ThemeProvider } from '@/theme/theme';

// Mock the theme
jest.mock('@/theme/theme', () => ({
  useTheme: () => ({
    theme: {
      colors: {
        primary: '#DAA520',
        secondary: '#1E3A5F',
        gray: '#424242',
        black: '#0A0A0A',
        text: '#F5F5F5',
        textDisabled: '#757575',
      },
      typography: {
        fontSize: {
          sm: 14,
          base: 16,
          lg: 18,
        },
        fontWeight: {
          semibold: '600',
        },
      },
      borderRadius: {
        md: 8,
      },
      shadows: {
        sm: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 1.41,
          elevation: 2,
        },
      },
    },
  }),
  ThemeProvider: function ThemeProvider({ children }: { children: React.ReactNode }) {
    return children as React.ReactElement;
  },
}));

describe('Button', () => {
  const defaultProps = {
    title: 'Test Button',
    onPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    const result = render(React.createElement(Button, { ...defaultProps, testID: 'test-button' }));
    expect(result.getByText('Test Button')).toBeTruthy();
    expect(result.getByTestId('test-button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const result = render(React.createElement(Button, { ...defaultProps, onPress, testID: 'test-button' }));
    fireEvent.press(result.getByTestId('test-button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    const result = render(React.createElement(Button, { ...defaultProps, onPress, disabled: true, testID: 'test-button' }));
    fireEvent.press(result.getByTestId('test-button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('shows loading spinner when loading', () => {
    const result = render(React.createElement(Button, { ...defaultProps, loading: true, testID: 'test-button' }));
    expect(result.getByTestId('test-button-spinner')).toBeTruthy();
  });

  it('does not call onPress when loading', () => {
    const onPress = jest.fn();
    const result = render(React.createElement(Button, { ...defaultProps, onPress, loading: true, testID: 'test-button' }));
    fireEvent.press(result.getByTestId('test-button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('renders with correct accessibility label', () => {
    const result = render(React.createElement(Button, { ...defaultProps, accessibilityLabel: 'Custom Label', testID: 'test-button' }));
    expect(result.getByLabelText('Custom Label')).toBeTruthy();
  });

  it('uses title as accessibility label when not provided', () => {
    const result = render(React.createElement(Button, { ...defaultProps, testID: 'test-button' }));
    expect(result.getByLabelText('Test Button')).toBeTruthy();
  });

  it('has correct accessibility role', () => {
    const result = render(React.createElement(Button, { ...defaultProps, testID: 'test-button' }));
    expect(result.getByRole('button')).toBeTruthy();
  });

  it('renders with primary variant by default', () => {
    const result = render(React.createElement(Button, { ...defaultProps, testID: 'test-button' }));
    expect(result.getByTestId('test-button')).toBeTruthy();
  });

  it('renders with secondary variant', () => {
    const result = render(React.createElement(Button, { ...defaultProps, variant: 'secondary', testID: 'test-button' }));
    expect(result.getByTestId('test-button')).toBeTruthy();
  });

  it('renders with ghost variant', () => {
    const result = render(React.createElement(Button, { ...defaultProps, variant: 'ghost', testID: 'test-button' }));
    expect(result.getByTestId('test-button')).toBeTruthy();
  });

  it('renders with different sizes', () => {
    const sizes = ['sm', 'md', 'lg'] as const;

    sizes.forEach((size) => {
      const result = render(React.createElement(Button, { ...defaultProps, size, testID: `button-${size}` }));
      expect(result.getByTestId(`button-${size}`)).toBeTruthy();
    });
  });
});
