import React from 'react';
import { Text as RNText, StyleSheet, TextStyle } from 'react-native';
import { useTheme } from '@/theme/theme';

/**
 * Typography Component
 * 
 * Text component with predefined typography variants.
 * Supports all theme typography styles with consistent styling.
 */

export type TypographyVariant = 
  | 'h1' 
  | 'h2' 
  | 'h3' 
  | 'h4' 
  | 'body' 
  | 'bodySmall' 
  | 'caption' 
  | 'label';

export type TextColor = 
  | 'primary' 
  | 'secondary' 
  | 'accent' 
  | 'text' 
  | 'textSecondary' 
  | 'textDisabled' 
  | 'error' 
  | 'warning' 
  | 'success';

interface TextProps {
  /** Typography variant */
  variant?: TypographyVariant;
  /** Text color theme key */
  color?: TextColor;
  /** Custom color (overrides theme color) */
  customColor?: string;
  /** Text alignment */
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  /** Number of lines to show */
  numberOfLines?: number;
  /** Whether text should be bold */
  bold?: boolean;
  /** Whether text should be italic */
  italic?: boolean;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Test ID */
  testID?: string;
  /** Additional styles */
  style?: TextStyle;
  /** Text content */
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color = 'text',
  customColor,
  align = 'left',
  numberOfLines,
  bold = false,
  italic = false,
  accessibilityLabel,
  testID,
  style,
  children,
}) => {
  const { theme } = useTheme();

  const getVariantStyles = (): TextStyle => {
    const baseStyle: TextStyle = {};
    
    switch (variant) {
      case 'h1':
        baseStyle.fontSize = theme.typography.fontSize['4xl'];
        baseStyle.fontWeight = '700';
        baseStyle.lineHeight = theme.typography.fontSize['4xl'] * theme.typography.lineHeight.tight;
        break;
      case 'h2':
        baseStyle.fontSize = theme.typography.fontSize['3xl'];
        baseStyle.fontWeight = '700';
        baseStyle.lineHeight = theme.typography.fontSize['3xl'] * theme.typography.lineHeight.tight;
        break;
      case 'h3':
        baseStyle.fontSize = theme.typography.fontSize['2xl'];
        baseStyle.fontWeight = '600';
        baseStyle.lineHeight = theme.typography.fontSize['2xl'] * theme.typography.lineHeight.tight;
        break;
      case 'h4':
        baseStyle.fontSize = theme.typography.fontSize.xl;
        baseStyle.fontWeight = '600';
        baseStyle.lineHeight = theme.typography.fontSize.xl * theme.typography.lineHeight.normal;
        break;
      case 'body':
        baseStyle.fontSize = theme.typography.fontSize.base;
        baseStyle.fontWeight = '400';
        baseStyle.lineHeight = theme.typography.fontSize.base * theme.typography.lineHeight.normal;
        break;
      case 'bodySmall':
        baseStyle.fontSize = theme.typography.fontSize.sm;
        baseStyle.fontWeight = '400';
        baseStyle.lineHeight = theme.typography.fontSize.sm * theme.typography.lineHeight.normal;
        break;
      case 'caption':
        baseStyle.fontSize = theme.typography.fontSize.xs;
        baseStyle.fontWeight = '400';
        baseStyle.lineHeight = theme.typography.fontSize.xs * theme.typography.lineHeight.normal;
        break;
      case 'label':
        baseStyle.fontSize = theme.typography.fontSize.sm;
        baseStyle.fontWeight = '500';
        baseStyle.lineHeight = theme.typography.fontSize.sm * theme.typography.lineHeight.tight;
        baseStyle.textTransform = 'uppercase';
        baseStyle.letterSpacing = 0.5;
        break;
    }

    return baseStyle;
  };

  const getColor = (): string => {
    if (customColor) return customColor;
    
    switch (color) {
      case 'primary':
        return theme.colors.primary;
      case 'secondary':
        return theme.colors.secondary;
      case 'accent':
        return theme.colors.accent;
      case 'text':
        return theme.colors.text;
      case 'textSecondary':
        return theme.colors.textSecondary;
      case 'textDisabled':
        return theme.colors.textDisabled;
      case 'error':
        return theme.colors.error;
      case 'warning':
        return theme.colors.warning;
      case 'success':
        return theme.colors.success;
      default:
        return theme.colors.text;
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <RNText
      style={[
        styles.text,
        variantStyles,
        {
          color: getColor(),
          textAlign: align,
          fontStyle: italic ? 'italic' : 'normal',
        },
        bold && { fontWeight: '700' },
        style,
      ]}
      numberOfLines={numberOfLines}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'System',
  },
});

export default Text;
