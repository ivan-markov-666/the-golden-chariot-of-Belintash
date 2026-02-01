import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/theme';

/**
 * Card Component
 * 
 * Container component with shadow, border radius, and consistent styling.
 * Supports different variants and padding options.
 */

export type CardVariant = 'elevated' | 'outlined' | 'filled';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

interface CardProps {
  /** Card variant style */
  variant?: CardVariant;
  /** Padding size */
  padding?: CardPadding;
  /** Card content */
  children: React.ReactNode;
  /** Additional container style */
  style?: ViewStyle;
  /** Test ID */
  testID?: string;
}

export const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  padding = 'md',
  children,
  style,
  testID,
}) => {
  const { theme } = useTheme();

  const getBackgroundColor = (): string => {
    switch (variant) {
      case 'elevated':
        return theme.colors.surface;
      case 'outlined':
        return 'transparent';
      case 'filled':
        return theme.colors.surfaceLight;
      default:
        return theme.colors.surface;
    }
  };

  const getBorderStyle = (): ViewStyle => {
    switch (variant) {
      case 'outlined':
        return {
          borderWidth: 1,
          borderColor: theme.colors.border,
        };
      case 'filled':
      case 'elevated':
      default:
        return {
          borderWidth: 0,
        };
    }
  };

  const getPadding = (): number => {
    switch (padding) {
      case 'none':
        return 0;
      case 'sm':
        return theme.spacing.sm;
      case 'md':
        return theme.spacing.md;
      case 'lg':
        return theme.spacing.lg;
      default:
        return theme.spacing.md;
    }
  };

  const getShadow = (): ViewStyle => {
    if (variant === 'elevated') {
      return theme.shadows.md;
    }
    return {};
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: getBackgroundColor(),
          borderRadius: theme.borderRadius.lg,
          padding: getPadding(),
        },
        getBorderStyle(),
        getShadow(),
        style,
      ]}
      testID={testID}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
});

export default Card;
