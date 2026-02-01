import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/theme';
import { Text } from '../ui/Text';

/**
 * ResourceBar Component
 * 
 * Displays health, mana, gold or other resources with icons and values.
 */

export type ResourceType = 'health' | 'mana' | 'gold' | 'stamina' | 'experience';

interface ResourceBarProps {
  /** Resource type */
  type: ResourceType;
  /** Current value */
  current: number;
  /** Maximum value */
  max: number;
  /** Show as percentage bar */
  showBar?: boolean;
  /** Bar height */
  barHeight?: number;
  /** Additional container style */
  style?: ViewStyle;
  /** Test ID */
  testID?: string;
}

export const ResourceBar: React.FC<ResourceBarProps> = ({
  type,
  current,
  max,
  showBar = true,
  barHeight = 8,
  style,
  testID,
}) => {
  const { theme } = useTheme();

  const percentage = Math.max(0, Math.min(100, (current / max) * 100));

  const getResourceConfig = () => {
    switch (type) {
      case 'health':
        return {
          label: 'HP',
          color: theme.colors.success,
          icon: '❤️',
        };
      case 'mana':
        return {
          label: 'MP',
          color: theme.colors.info,
          icon: '💎',
        };
      case 'gold':
        return {
          label: 'Gold',
          color: theme.colors.warning,
          icon: '🪙',
        };
      case 'stamina':
        return {
          label: 'STA',
          color: theme.colors.primary,
          icon: '⚡',
        };
      case 'experience':
        return {
          label: 'XP',
          color: theme.colors.accent,
          icon: '⭐',
        };
    }
  };

  const config = getResourceConfig();

  return (
    <View style={[styles.container, style]} testID={testID}>
      <View style={styles.header}>
        <View style={styles.labelContainer}>
          <Text variant="caption" color="textSecondary">
            {config.icon} {config.label}
          </Text>
        </View>
        <Text variant="caption" color="textSecondary">
          {current}/{max}
        </Text>
      </View>

      {showBar && (
        <View
          style={[
            styles.barContainer,
            {
              height: barHeight,
              backgroundColor: theme.colors.surfaceLight,
              borderRadius: barHeight / 2,
            },
          ]}
        >
          <View
            style={[
              styles.barFill,
              {
                width: `${percentage}%`,
                backgroundColor: config.color,
                borderRadius: barHeight / 2,
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  barContainer: {
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
  },
});

export default ResourceBar;
