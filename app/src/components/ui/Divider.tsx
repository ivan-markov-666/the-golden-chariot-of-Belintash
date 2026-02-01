import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/theme';

/**
 * Divider Component
 * 
 * Horizontal or vertical divider line with consistent styling.
 * Supports text labels and different thicknesses.
 */

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerThickness = 'thin' | 'medium' | 'thick';

interface DividerProps {
  /** Divider orientation */
  orientation?: DividerOrientation;
  /** Line thickness */
  thickness?: DividerThickness;
  /** Optional text label (horizontal only) */
  label?: string;
  /** Spacing around divider */
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  /** Test ID */
  testID?: string;
  /** Additional style */
  style?: ViewStyle;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  thickness = 'thin',
  label,
  spacing = 'md',
  testID,
  style,
}) => {
  const { theme } = useTheme();

  const getThickness = (): number => {
    switch (thickness) {
      case 'thin':
        return 1;
      case 'medium':
        return 2;
      case 'thick':
        return 4;
      default:
        return 1;
    }
  };

  const getSpacing = (): number => {
    switch (spacing) {
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

  if (orientation === 'vertical') {
    return (
      <View
        style={[
          styles.vertical,
          {
            width: getThickness(),
            backgroundColor: theme.colors.border,
            marginHorizontal: getSpacing(),
          },
          style,
        ]}
        testID={testID}
      />
    );
  }

  // Horizontal divider
  return (
    <View
      style={[
        styles.horizontal,
        {
          marginVertical: getSpacing(),
        },
        style,
      ]}
      testID={testID}
    >
      <View
        style={[
          styles.line,
          {
            height: getThickness(),
            backgroundColor: theme.colors.border,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  horizontal: {
    width: '100%',
  },
  vertical: {
    height: '100%',
  },
  line: {
    width: '100%',
  },
});

export default Divider;
