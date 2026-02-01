import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '@/theme/theme';

/**
 * Button Component
 * 
 * Reusable button with primary, secondary, and ghost variants.
 * Supports loading state, disabled state, and accessibility labels.
 */

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  /** Button text content */
  title: string;
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Disabled state */
  disabled?: boolean;
  /** Loading state - shows spinner instead of text */
  loading?: boolean;
  /** Press handler */
  onPress?: () => void;
  /** Accessibility label for screen readers */
  accessibilityLabel?: string;
  /** Test ID for testing */
  testID?: string;
  /** Additional container styles */
  style?: ViewStyle;
  /** Additional text styles */
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onPress,
  accessibilityLabel,
  testID,
  style,
  textStyle,
}) => {
  const { theme } = useTheme();

  const getBackgroundColor = (): string => {
    if (disabled || loading) return theme.colors.gray;
    
    switch (variant) {
      case 'primary':
        return theme.colors.primary;
      case 'secondary':
        return theme.colors.secondary;
      case 'ghost':
        return 'transparent';
      default:
        return theme.colors.primary;
    }
  };

  const getTextColor = (): string => {
    if (disabled || loading) return theme.colors.textDisabled;
    
    switch (variant) {
      case 'primary':
        return theme.colors.black;
      case 'secondary':
        return theme.colors.text;
      case 'ghost':
        return theme.colors.primary;
      default:
        return theme.colors.black;
    }
  };

  const getBorderColor = (): string => {
    if (disabled || loading) return theme.colors.gray;
    
    switch (variant) {
      case 'primary':
        return theme.colors.primary;
      case 'secondary':
        return theme.colors.secondary;
      case 'ghost':
        return theme.colors.primary;
      default:
        return theme.colors.primary;
    }
  };

  const getPadding = (): { paddingVertical: number; paddingHorizontal: number } => {
    switch (size) {
      case 'sm':
        return { paddingVertical: 8, paddingHorizontal: 12 };
      case 'md':
        return { paddingVertical: 12, paddingHorizontal: 16 };
      case 'lg':
        return { paddingVertical: 16, paddingHorizontal: 24 };
      default:
        return { paddingVertical: 12, paddingHorizontal: 16 };
    }
  };

  const getFontSize = (): number => {
    switch (size) {
      case 'sm':
        return theme.typography.fontSize.sm;
      case 'md':
        return theme.typography.fontSize.base;
      case 'lg':
        return theme.typography.fontSize.lg;
      default:
        return theme.typography.fontSize.base;
    }
  };

  const { paddingVertical, paddingHorizontal } = getPadding();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      testID={testID}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'ghost' ? 1 : 0,
          borderRadius: theme.borderRadius.md,
          paddingVertical,
          paddingHorizontal,
          ...theme.shadows.sm,
        },
        style,
      ]}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={getTextColor()}
          testID={`${testID}-spinner`}
        />
      ) : (
        <Text
          style={[
            styles.text,
            {
              color: getTextColor(),
              fontSize: getFontSize(),
              fontWeight: theme.typography.fontWeight.semibold as '600',
            },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    textAlign: 'center',
  },
});

export default Button;
