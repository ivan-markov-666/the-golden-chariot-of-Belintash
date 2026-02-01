import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from '../Text';

// Mock the theme
jest.mock('@/theme/theme', () => ({
  useTheme: () => ({
    theme: {
      colors: {
        primary: '#DAA520',
        secondary: '#1E3A5F',
        accent: '#DC143C',
        text: '#F5F5F5',
        textSecondary: '#BDBDBD',
        textDisabled: '#757575',
        error: '#F44336',
        warning: '#FFC107',
        success: '#4CAF50',
      },
      typography: {
        fontSize: {
          xs: 12,
          sm: 14,
          base: 16,
          lg: 18,
          xl: 20,
          '2xl': 24,
          '3xl': 30,
          '4xl': 36,
        },
        lineHeight: {
          tight: 1.2,
          normal: 1.5,
          relaxed: 1.8,
        },
      },
    },
  }),
}));

describe('Text', () => {
  it('renders with default body variant', () => {
    const { getByText } = render(<Text>Test content</Text>);
    expect(getByText('Test content')).toBeTruthy();
  });

  it('renders with different typography variants', () => {
    const variants = ['h1', 'h2', 'h3', 'h4', 'body', 'bodySmall', 'caption', 'label'] as const;
    
    variants.forEach((variant) => {
      const { getByText } = render(<Text variant={variant}>{variant} text</Text>);
      expect(getByText(`${variant} text`)).toBeTruthy();
    });
  });

  it('renders with different colors', () => {
    const colors = ['primary', 'secondary', 'accent', 'text', 'textSecondary', 'error', 'warning', 'success'] as const;
    
    colors.forEach((color) => {
      const { getByText } = render(<Text color={color}>{color} text</Text>);
      expect(getByText(`${color} text`)).toBeTruthy();
    });
  });

  it('renders with custom color', () => {
    const { getByText } = render(<Text customColor="#FF0000">Custom color</Text>);
    expect(getByText('Custom color')).toBeTruthy();
  });

  it('renders with different alignments', () => {
    const alignments = ['auto', 'left', 'right', 'center', 'justify'] as const;
    
    alignments.forEach((align) => {
      const { getByText } = render(<Text align={align}>{align} aligned</Text>);
      expect(getByText(`${align} aligned`)).toBeTruthy();
    });
  });

  it('renders with bold text', () => {
    const { getByText } = render(<Text bold>Bold text</Text>);
    expect(getByText('Bold text')).toBeTruthy();
  });

  it('renders with italic text', () => {
    const { getByText } = render(<Text italic>Italic text</Text>);
    expect(getByText('Italic text')).toBeTruthy();
  });

  it('limits number of lines', () => {
    const { getByText } = render(<Text numberOfLines={2}>Multi line text</Text>);
    expect(getByText('Multi line text')).toBeTruthy();
  });

  it('has accessibility label', () => {
    const { getByLabelText } = render(<Text accessibilityLabel="Accessible text">Content</Text>);
    expect(getByLabelText('Accessible text')).toBeTruthy();
  });
});
