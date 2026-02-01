import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/theme';
import { Text } from '../ui/Text';

/**
 * HealthBar Component
 * 
 * Visual health indicator with smooth animations.
 * Shows current/max health with color changes on low health.
 */

interface HealthBarProps {
  /** Current health value */
  current: number;
  /** Maximum health value */
  max: number;
  /** Bar width (default: 100%) */
  width?: `${number}%` | number;
  /** Bar height (default: 12) */
  height?: number;
  /** Show numeric values */
  showValues?: boolean;
  /** Additional container style */
  style?: ViewStyle;
  /** Test ID */
  testID?: string;
}

export const HealthBar: React.FC<HealthBarProps> = ({
  current,
  max,
  width = '100%',
  height = 12,
  showValues = true,
  style,
  testID,
}) => {
  const { theme } = useTheme();
  const animatedValue = useRef(new Animated.Value(current / max)).current;

  const percentage = Math.max(0, Math.min(100, (current / max) * 100));

  // Animate health changes
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: percentage / 100,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [current, max, percentage]);

  // Determine color based on health percentage
  const getHealthColor = (): string => {
    if (percentage <= 20) return theme.colors.error;
    if (percentage <= 50) return theme.colors.warning;
    return theme.colors.success;
  };

  const widthInterpolate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.container, typeof width === 'number' ? { width } : { width }, style]} testID={testID}>
      {showValues && (
        <View style={styles.labelRow}>
          <Text variant="caption" color="textSecondary">
            Health
          </Text>
          <Text variant="caption" color="textSecondary">
            {current}/{max}
          </Text>
        </View>
      )}
      <View
        style={[
          styles.barContainer,
          {
            height,
            backgroundColor: theme.colors.surfaceLight,
            borderRadius: height / 2,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.fill,
            {
              width: widthInterpolate,
              backgroundColor: getHealthColor(),
              borderRadius: height / 2,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  barContainer: {
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});

export default HealthBar;
