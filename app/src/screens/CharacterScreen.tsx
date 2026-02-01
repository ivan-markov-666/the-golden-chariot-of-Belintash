import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Text, Button, Card } from '@/components/ui';
import { useTheme } from '@/theme/theme';

/**
 * Character Screen
 *
 * Displays character stats, equipment, and status effects.
 * Allows players to view their character's progress and current state.
 */

interface Character {
  name: string;
  level: number;
  xp: number;
  maxXp: number;
  attributes: {
    strength: number;
    dexterity: number;
    intelligence: number;
    wisdom: number;
    endurance: number;
    charisma: number;
    perception: number;
    luck: number;
  };
  equipment: {
    head?: string;
    body?: string;
    weapon?: string;
    accessory?: string;
  };
  statusEffects: string[];
}

type CharacterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ATTRIBUTE_LABELS: Record<string, string> = {
  strength: 'Сила',
  dexterity: 'Ловкост',
  intelligence: 'Интелект',
  wisdom: 'Мъдрост',
  endurance: 'Издръжливост',
  charisma: 'Харизма',
  perception: 'Възприятие',
  luck: 'Късмет',
};

const EQUIPMENT_SLOTS: Record<string, string> = {
  head: '🪖 Глава',
  body: '👕 Броня',
  weapon: '⚔️ Оръжие',
  accessory: '💍 Аксесоар',
};

export const CharacterScreen: React.FC = () => {
  const navigation = useNavigation<CharacterScreenNavigationProp>();
  const { theme } = useTheme();

  // Mock character data
  const character: Character = {
    name: 'Иван',
    level: 3,
    xp: 750,
    maxXp: 1000,
    attributes: {
      strength: 14,
      dexterity: 12,
      intelligence: 10,
      wisdom: 11,
      endurance: 13,
      charisma: 9,
      perception: 12,
      luck: 8,
    },
    equipment: {
      head: undefined,
      body: 'Кожена броня',
      weapon: 'Ръждясал меч',
      accessory: undefined,
    },
    statusEffects: ['Благословия на Белинташ', '+5% опит'],
  };

  const handleBackToGameplay = () => {
    navigation.navigate('MainMenu');
  };

  const renderAttributes = () => (
    <Card variant="outlined" style={styles.sectionCard}>
      <Text variant="h4" style={styles.sectionTitle}>
        Атрибути
      </Text>
      {Object.entries(character.attributes).map(([key, value]) => (
        <View key={key} style={styles.attributeRow}>
          <Text variant="body" style={styles.attributeLabel}>
            {ATTRIBUTE_LABELS[key]}
          </Text>
          <View style={styles.attributeValueContainer}>
            <Text variant="body" bold style={{ color: value >= 12 ? theme.colors.success : theme.colors.text }}>
              {value}
            </Text>
          </View>
        </View>
      ))}
    </Card>
  );

  const renderLevelInfo = () => {
    const xpPercentage = (character.xp / character.maxXp) * 100;
    return (
      <Card variant="filled" style={styles.levelCard}>
        <View style={styles.levelHeader}>
          <Text variant="h3">{character.name}</Text>
          <Text variant="h4" color="primary">
            Ниво {character.level}
          </Text>
        </View>
        <View style={styles.xpContainer}>
          <Text variant="caption" color="textSecondary">
            Опит: {character.xp}/{character.maxXp}
          </Text>
          <View style={styles.xpBarBackground}>
            <View
              style={{
                ...styles.xpBarFill,
                width: `${xpPercentage}%`,
                backgroundColor: theme.colors.primary,
              }}
            />
          </View>
        </View>
      </Card>
    );
  };

  const renderEquipment = () => (
    <Card variant="outlined" style={styles.sectionCard}>
      <Text variant="h4" style={styles.sectionTitle}>
        Екипировка
      </Text>
      {Object.entries(EQUIPMENT_SLOTS).map(([slot, label]) => (
        <View key={slot} style={styles.equipmentRow}>
          <Text variant="body" style={styles.equipmentLabel}>
            {label}
          </Text>
          <Text
            variant="body"
            color={character.equipment[slot as keyof typeof character.equipment] ? 'text' : 'textSecondary'}
          >
            {character.equipment[slot as keyof typeof character.equipment] || 'Празно'}
          </Text>
        </View>
      ))}
    </Card>
  );

  const renderStatusEffects = () => (
    <Card variant="outlined" style={styles.sectionCard}>
      <Text variant="h4" style={styles.sectionTitle}>
        Ефекти
      </Text>
      {character.statusEffects.length > 0 ? (
        character.statusEffects.map((effect, index) => (
          <View key={index} style={styles.effectRow}>
            <Text variant="body" color="accent">
              ✨ {effect}
            </Text>
          </View>
        ))
      ) : (
        <Text variant="body" color="textSecondary">
          Няма активни ефекти
        </Text>
      )}
    </Card>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {renderLevelInfo()}
        {renderAttributes()}
        {renderEquipment()}
        {renderStatusEffects()}

        <Button
          title="Обратно към играта"
          variant="primary"
          onPress={handleBackToGameplay}
          style={styles.backButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  levelCard: {
    marginBottom: 16,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  xpContainer: {
    marginTop: 8,
  },
  xpBarBackground: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 4,
    marginTop: 4,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  sectionCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  attributeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  attributeLabel: {
    flex: 1,
  },
  attributeValueContainer: {
    minWidth: 40,
    alignItems: 'flex-end',
  },
  equipmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  equipmentLabel: {
    flex: 1,
  },
  effectRow: {
    paddingVertical: 4,
  },
  backButton: {
    marginTop: 8,
  },
});
