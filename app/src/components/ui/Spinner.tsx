import React from 'react';
import { ActivityIndicator, View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/theme';
import { Text } from './Text';

/**
 * Spinner Component
 * 
 * Loading indicator with optional text label.
 * Supports different sizes and colors.
 */

export type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';

interface SpinnerProps {
  /** Spinner size */
  size?: SpinnerSize;
  /** Custom color (overrides theme) */
  color?: string;
  /** Loading text to display below spinner */
  text?: string;
  /** Whether to use overlay */
  overlay?: boolean;
  /** Test ID */
  testID?: string;
  /** Additional container style */
  style?: ViewStyle;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color,
  text,
  overlay = false,
  testID,
  style,
}) => {
  const { theme } = useTheme();

  const getSize = (): 'small' | 'large' | number => {
    switch (size) {
      case 'sm':
        return 'small';
      case 'md':
        return 'small';
      case 'lg':
        return 'large';
      case 'xl':
        return 'large';
      default:
        return 'small';
    }
  };

  const getCustomSize = (): number | undefined => {
    switch (size) {
      case 'sm':
        return 16;
      case 'md':
        return 24;
      case 'lg':
        return 32;
      case 'xl':
        return 48;
      default:
        return undefined;
    }
  };

  const spinnerColor = color || theme.colors.primary;

  const SpinnerContent = (
    <View
      style={[
        styles.container,
        overlay && styles.overlayContainer,
        overlay && { backgroundColor: theme.colors.overlay },
        style,
      ]}
      testID={testID}
    >
      <ActivityIndicator
        size={getSize()}
        color={spinnerColor}
        testID={`${testID}-indicator`}
      />
      {text && (
        <Text
          variant="bodySmall"
          color="textSecondary"
          style={styles.text}
        >
          {text}
        </Text>
      )}
    </View>
  );

  return SpinnerContent;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  text: {
    marginTop: 8,
  },
});

export default Spinner;
