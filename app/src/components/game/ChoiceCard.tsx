import React from 'react';
import { TouchableOpacity, View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/theme';
import { Text } from '../ui/Text';
import { Card } from '../ui/Card';

/**
 * ChoiceCard Component
 * 
 * Interactive choice selection card with skill checks and consequences.
 */

export type ChoiceType = 'normal' | 'skill' | 'combat' | 'dialogue';

interface ChoiceCardProps {
  /** Choice text */
  text: string;
  /** Choice type */
  type?: ChoiceType;
  /** Required skill name (for skill checks) */
  skillName?: string;
  /** Required skill value */
  skillValue?: number;
  /** Whether the skill check passes */
  skillPass?: boolean;
  /** Consequence hint text */
  consequence?: string;
  /** Whether choice is disabled */
  disabled?: boolean;
  /** Press handler */
  onPress?: () => void;
  /** Additional container style */
  style?: ViewStyle;
  /** Test ID */
  testID?: string;
}

export const ChoiceCard: React.FC<ChoiceCardProps> = ({
  text,
  type = 'normal',
  skillName,
  skillValue,
  skillPass,
  consequence,
  disabled = false,
  onPress,
  style,
  testID,
}) => {
  const { theme } = useTheme();

  const getTypeColor = (): string => {
    switch (type) {
      case 'combat':
        return theme.colors.error;
      case 'skill':
        return theme.colors.primary;
      case 'dialogue':
        return theme.colors.info;
      default:
        return theme.colors.text;
    }
  };

  const getTypeLabel = (): string => {
    switch (type) {
      case 'combat':
        return 'Combat';
      case 'skill':
        return 'Skill Check';
      case 'dialogue':
        return 'Dialogue';
      default:
        return '';
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.container, style]}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={text}
    >
      <Card
        variant={disabled ? 'filled' : 'elevated'}
        padding="md"
        style={disabled ? { ...styles.card, opacity: 0.5 } : styles.card}
      >
        <View style={styles.content}>
          <Text variant="body" style={{ color: getTypeColor() }}>
            {text}
          </Text>

          {type !== 'normal' && (
            <View style={[styles.badge, { backgroundColor: getTypeColor() + '20' }]}>
              <Text variant="caption" style={{ color: getTypeColor() }}>
                {getTypeLabel()}
              </Text>
            </View>
          )}
        </View>

        {skillName && skillValue !== undefined && (
          <View style={styles.skillRow}>
            <Text variant="caption" color="textSecondary">
              {skillName}:
            </Text>
            <Text
              variant="caption"
              style={{
                color: skillPass ? theme.colors.success : theme.colors.warning,
              }}
            >
              {skillValue}
            </Text>
          </View>
        )}

        {consequence && (
          <Text variant="caption" color="textSecondary" style={styles.consequence}>
            → {consequence}
          </Text>
        )}
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  card: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  skillRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 8,
  },
  consequence: {
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default ChoiceCard;
