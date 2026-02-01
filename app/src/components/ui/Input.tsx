import React, { useState, forwardRef } from 'react';
import {
  TextInput as RNTextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps as RNTextInputProps,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@/theme/theme';

/**
 * Input Component
 * 
 * TextInput with validation, error states, and accessibility support.
 * Supports icons, helper text, and character counting.
 */

export type InputVariant = 'outlined' | 'filled' | 'underlined';
export type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends Omit<RNTextInputProps, 'style'> {
  /** Input variant style */
  variant?: InputVariant;
  /** Input size */
  size?: InputSize;
  /** Label text above input */
  label?: string;
  /** Helper text below input */
  helperText?: string;
  /** Error message - shows error state when provided */
  error?: string;
  /** Whether field is required */
  required?: boolean;
  /** Icon component to show at start */
  startIcon?: React.ReactNode;
  /** Icon component to show at end */
  endIcon?: React.ReactNode;
  /** Maximum character count */
  maxLength?: number;
  /** Show character counter */
  showCounter?: boolean;
  /** Container style override */
  containerStyle?: ViewStyle;
  /** Test ID */
  testID?: string;
}

export const Input = forwardRef<RNTextInput, InputProps>(
  (
    {
      variant = 'outlined',
      size = 'md',
      label,
      helperText,
      error,
      required = false,
      startIcon,
      endIcon,
      maxLength,
      showCounter = false,
      containerStyle,
      testID,
      value,
      onChangeText,
      placeholder,
      secureTextEntry,
      keyboardType,
      autoCapitalize,
      autoCorrect,
      editable = true,
      ...textInputProps
    },
    ref
  ) => {
    const { theme } = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const [characterCount, setCharacterCount] = useState((value as string)?.length || 0);

    const handleChangeText = (text: string) => {
      setCharacterCount(text.length);
      onChangeText?.(text);
    };

    const getInputHeight = (): number => {
      switch (size) {
        case 'sm':
          return 40;
        case 'md':
          return 48;
        case 'lg':
          return 56;
        default:
          return 48;
      }
    };

    const getBorderColor = (): string => {
      if (error) return theme.colors.error;
      if (isFocused) return theme.colors.primary;
      
      switch (variant) {
        case 'outlined':
          return theme.colors.border;
        case 'filled':
          return 'transparent';
        case 'underlined':
          return theme.colors.border;
        default:
          return theme.colors.border;
      }
    };

    const getBackgroundColor = (): string => {
      if (!editable) return theme.colors.surface;
      
      switch (variant) {
        case 'outlined':
          return 'transparent';
        case 'filled':
          return isFocused ? theme.colors.surfaceLight : theme.colors.surface;
        case 'underlined':
          return 'transparent';
        default:
          return 'transparent';
      }
    };

    const hasError = !!error;
    const showHelper = !!helperText && !hasError;
    const showCounterText = showCounter && maxLength;

    return (
      <View style={[styles.container, containerStyle]} testID={testID}>
        {label && (
          <Text
            style={[
              styles.label,
              {
                color: hasError ? theme.colors.error : theme.colors.textSecondary,
                fontSize: theme.typography.fontSize.sm,
                marginBottom: theme.spacing.xs,
              },
            ]}
            accessibilityLabel={label}
          >
            {label}
            {required && (
              <Text style={{ color: theme.colors.error }}> *</Text>
            )}
          </Text>
        )}

        <View
          style={[
            styles.inputContainer,
            {
              height: getInputHeight(),
              borderColor: getBorderColor(),
              borderWidth: variant === 'filled' ? 0 : 1,
              borderRadius: variant === 'outlined' ? theme.borderRadius.md : 0,
              backgroundColor: getBackgroundColor(),
              paddingHorizontal: theme.spacing.md,
            },
          ]}
        >
          {startIcon && (
            <View style={styles.iconContainer}>
              {startIcon}
            </View>
          )}

          <RNTextInput
            ref={ref}
            value={value}
            onChangeText={handleChangeText}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.textDisabled}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoCorrect={autoCorrect}
            editable={editable}
            maxLength={maxLength}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={[
              styles.input,
              {
                color: editable ? theme.colors.text : theme.colors.textDisabled,
                fontSize: theme.typography.fontSize.base,
                paddingLeft: startIcon ? theme.spacing.sm : 0,
                paddingRight: endIcon ? theme.spacing.sm : 0,
              },
            ]}
            accessibilityLabel={label}
            accessibilityState={{ disabled: !editable }}
            {...textInputProps}
          />

          {endIcon && (
            <View style={styles.iconContainer}>
              {endIcon}
            </View>
          )}
        </View>

        {(showHelper || hasError || showCounterText) && (
          <View style={styles.helperRow}>
            <View style={styles.helperContainer}>
              {hasError ? (
                <Text
                  style={[
                    styles.helperText,
                    { color: theme.colors.error, fontSize: theme.typography.fontSize.sm },
                  ]}
                >
                  {error}
                </Text>
              ) : showHelper ? (
                <Text
                  style={[
                    styles.helperText,
                    { color: theme.colors.textSecondary, fontSize: theme.typography.fontSize.sm },
                  ]}
                >
                  {helperText}
                </Text>
              ) : null}
            </View>

            {showCounterText && (
              <Text
                style={[
                  styles.counter,
                  {
                    color: characterCount > maxLength ? theme.colors.error : theme.colors.textSecondary,
                    fontSize: theme.typography.fontSize.sm,
                  },
                ]}
              >
                {characterCount}/{maxLength}
              </Text>
            )}
          </View>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  input: {
    flex: 1,
    height: '100%',
    paddingVertical: 0,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  helperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 4,
  },
  helperContainer: {
    flex: 1,
  },
  helperText: {
    flexWrap: 'wrap',
  },
  counter: {
    marginLeft: 8,
  },
});

export default Input;
