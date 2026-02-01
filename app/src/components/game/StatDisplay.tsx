import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/theme';
import { Text } from '../ui/Text';
import { Card } from '../ui/Card';

/**
 * StatDisplay Component
 * 
 * Displays character attributes and skills with optional modifiers.
 */

interface StatDisplayProps {
  /** Stat name */
  label: string;
  /** Current value */
  value: number;
  /** Maximum value (for progress indication) */
  max?: number;
  /** Modifier bonus (e.g., +2, -1) */
  modifier?: number;
  /** Show as percentage bar */
  showBar?: boolean;
  /** Icon component */
  icon?: React.ReactNode;
  /** Additional container style */
  style?: ViewStyle;
  /** Test ID */
  testID?: string;
}

export const StatDisplay: React.FC<StatDisplayProps> = ({
  label,
  value,
  max,
  modifier,
  showBar = false,
  icon,
  style,
  testID,
}) => {
  const { theme } = useTheme();

  const percentage = max ? Math.min(100, (value / max) * 100) : 0;

  const getModifierColor = (): string => {
    if (!modifier) return theme.colors.textSecondary;
    return modifier > 0 ? theme.colors.success : theme.colors.error;
  };

  const formatModifier = (mod: number): string => {
    return mod > 0 ? `+${mod}` : `${mod}`;
  };

  return (
    <View style={[styles.container, style]} testID={testID}>
      <View style={styles.row}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <View style={styles.labelContainer}>
          <Text variant="bodySmall" color="textSecondary">
            {label}
          </Text>
        </View>
        <View style={styles.valueContainer}>
          <Text variant="body" bold>
            {value}
          </Text>
          {modifier !== undefined && (
            <Text variant="caption" customColor={getModifierColor()}>
              {' '}
              ({formatModifier(modifier)})
            </Text>
          )}
        </View>
      </View>
      {showBar && max && (
        <View style={styles.barContainer}>
          <View
            style={[
              styles.barFill,
              {
                width: `${percentage}%`,
                backgroundColor: theme.colors.primary,
              },
            ]}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  labelContainer: {
    flex: 1,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  barContainer: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    marginTop: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },
});

export default StatDisplay;
