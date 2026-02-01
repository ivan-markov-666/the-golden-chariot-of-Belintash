import React from 'react';
import { TouchableOpacity, View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/theme';
import { Text } from '../ui/Text';

/**
 * InventorySlot Component
 * 
 * Displays an item slot with icon, quantity, and rarity border.
 */

export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

interface InventorySlotProps {
  /** Item icon/emoji */
  icon?: string;
  /** Item name */
  name?: string;
  /** Item quantity */
  quantity?: number;
  /** Item rarity */
  rarity?: ItemRarity;
  /** Whether item is equipped */
  equipped?: boolean;
  /** Slot size */
  size?: 'sm' | 'md' | 'lg';
  /** Press handler */
  onPress?: () => void;
  /** Long press handler (for context menu) */
  onLongPress?: () => void;
  /** Additional container style */
  style?: ViewStyle;
  /** Test ID */
  testID?: string;
}

export const InventorySlot: React.FC<InventorySlotProps> = ({
  icon,
  name,
  quantity,
  rarity = 'common',
  equipped = false,
  size = 'md',
  onPress,
  onLongPress,
  style,
  testID,
}) => {
  const { theme } = useTheme();

  const getSize = () => {
    switch (size) {
      case 'sm':
        return { width: 48, height: 48, fontSize: 20 };
      case 'md':
        return { width: 64, height: 64, fontSize: 28 };
      case 'lg':
        return { width: 80, height: 80, fontSize: 36 };
      default:
        return { width: 64, height: 64, fontSize: 28 };
    }
  };

  const getRarityColor = (): string => {
    switch (rarity) {
      case 'common':
        return theme.colors.border;
      case 'uncommon':
        return theme.colors.success;
      case 'rare':
        return theme.colors.info;
      case 'epic':
        return theme.colors.primary;
      case 'legendary':
        return theme.colors.warning;
      default:
        return theme.colors.border;
    }
  };

  const sizeStyles = getSize();
  const isEmpty = !icon && !name;

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={isEmpty || !onPress}
      style={[styles.container, style]}
      testID={testID}
      accessibilityLabel={name || 'Empty slot'}
      accessibilityRole="button"
    >
      <View
        style={[
          styles.slot,
          {
            width: sizeStyles.width,
            height: sizeStyles.height,
            backgroundColor: isEmpty ? theme.colors.surfaceLight : theme.colors.surface,
            borderColor: equipped ? theme.colors.primary : getRarityColor(),
            borderWidth: equipped ? 3 : 2,
          },
        ]}
      >
        {icon && (
          <Text style={{ fontSize: sizeStyles.fontSize }}>{icon}</Text>
        )}
        
        {quantity !== undefined && quantity > 1 && (
          <View style={styles.quantityBadge}>
            <Text variant="caption" color="text">
              {quantity}
            </Text>
          </View>
        )}

        {equipped && (
          <View style={[styles.equippedBadge, { backgroundColor: theme.colors.primary }]}>
            <Text variant="caption" color="text">
              E
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
  slot: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    position: 'relative',
  },
  quantityBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    minWidth: 16,
    alignItems: 'center',
  },
  equippedBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default InventorySlot;
