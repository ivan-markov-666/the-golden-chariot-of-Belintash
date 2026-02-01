import React, { useState, useCallback } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Text, Button, Card } from '@/components/ui';
import { useTheme } from '@/theme/theme';

/**
 * Character Creation Screen
 *
 * Allows players to create their character by:
 * - Entering a name
 * - Allocating stat points (20 points to distribute)
 * - All stats start at 10, min 5, max 20
 */

type AttributeKey = 'strength' | 'dexterity' | 'intelligence' | 'wisdom' | 'endurance' | 'charisma' | 'perception' | 'luck';

interface Attributes {
  strength: number;
  dexterity: number;
  intelligence: number;
  wisdom: number;
  endurance: number;
  charisma: number;
  perception: number;
  luck: number;
}

const DEFAULT_ATTRIBUTES: Attributes = {
  strength: 10,
  dexterity: 10,
  intelligence: 10,
  wisdom: 10,
  endurance: 10,
  charisma: 10,
  perception: 10,
  luck: 10,
};

const STARTING_POINTS = 20;
const MIN_STAT = 5;
const MAX_STAT = 20;

const ATTRIBUTE_LABELS: Record<AttributeKey, string> = {
  strength: 'Сила',
  dexterity: 'Ловкост',
  intelligence: 'Интелект',
  wisdom: 'Мъдрост',
  endurance: 'Издръжливост',
  charisma: 'Харизма',
  perception: 'Възприятие',
  luck: 'Късмет',
};

export const CharacterCreationScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { theme } = useTheme();

  const [name, setName] = useState('');
  const [attributes, setAttributes] = useState<Attributes>(DEFAULT_ATTRIBUTES);

  const pointsUsed = Object.values(attributes).reduce(
    (sum, val) => sum + (val - 10),
    0
  );
  const pointsRemaining = STARTING_POINTS - pointsUsed;

  const handleIncreaseStat = useCallback((stat: AttributeKey) => {
    if (pointsRemaining > 0 && attributes[stat] < MAX_STAT) {
      setAttributes((prev) => ({
        ...prev,
        [stat]: prev[stat] + 1,
      }));
    }
  }, [pointsRemaining, attributes]);

  const handleDecreaseStat = useCallback((stat: AttributeKey) => {
    if (attributes[stat] > MIN_STAT) {
      setAttributes((prev) => ({
        ...prev,
        [stat]: prev[stat] - 1,
      }));
    }
  }, [attributes]);

  const handleReset = useCallback(() => {
    setAttributes(DEFAULT_ATTRIBUTES);
  }, []);

  const handleConfirm = useCallback(() => {
    if (!name.trim()) {
      return;
    }

    if (pointsRemaining !== 0) {
      return;
    }

    // TODO: Integrate with character store
    // For now, just navigate to gameplay
    navigation.navigate('Gameplay', { scenarioId: 'act1-scene1' });
  }, [name, pointsRemaining, navigation]);

  const isValid = name.trim().length > 0 && pointsRemaining === 0;

  const renderStatRow = (stat: AttributeKey, value: number) => (
    <View key={stat} style={styles.statRow}>
      <View style={styles.statLabelContainer}>
        <Text variant="body">
          {ATTRIBUTE_LABELS[stat]}
        </Text>
        <Text variant="caption" color="textSecondary">
          {value}
        </Text>
      </View>
      <View style={styles.statControls}>
        <Pressable
          onPress={() => handleDecreaseStat(stat)}
          disabled={value <= MIN_STAT}
          style={({ pressed }) => [
            styles.statButton,
            {
              backgroundColor: value <= MIN_STAT
                ? theme.colors.surface
                : pressed
                ? theme.colors.primaryDark
                : theme.colors.primary,
              opacity: value <= MIN_STAT ? 0.5 : 1,
            },
          ]}
        >
          <Text style={styles.statButtonText}>-</Text>
        </Pressable>
        <Text variant="body" style={styles.statValue}>
          {value}
        </Text>
        <Pressable
          onPress={() => handleIncreaseStat(stat)}
          disabled={pointsRemaining === 0 || value >= MAX_STAT}
          style={({ pressed }) => [
            styles.statButton,
            {
              backgroundColor: pointsRemaining === 0 || value >= MAX_STAT
                ? theme.colors.surface
                : pressed
                ? theme.colors.primaryDark
                : theme.colors.primary,
              opacity: pointsRemaining === 0 || value >= MAX_STAT ? 0.5 : 1,
            },
          ]}
        >
          <Text style={styles.statButtonText}>+</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Title */}
        <Text variant="h2" align="center" style={styles.title}>
          Създай своя герой
        </Text>

        {/* Name Input */}
        <Card variant="outlined" style={styles.nameCard}>
          <Text variant="body" style={styles.inputLabel}>
            Име на героя
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Въведете име"
            maxLength={20}
            style={{
              height: 48,
              borderWidth: 1,
              borderRadius: 8,
              paddingHorizontal: 16,
              fontSize: 16,
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
              borderColor: theme.colors.border,
            }}
            placeholderTextColor={theme.colors.textSecondary}
          />
        </Card>

        {/* Points Display */}
        <Card
          variant="filled"
          style={{
            ...styles.pointsCard,
            backgroundColor:
              pointsRemaining === 0
                ? theme.colors.success
                : theme.colors.primary,
          }}
        >
          <Text variant="h3" align="center" style={{ color: '#FFFFFF' }}>
            Оставащи точки: {pointsRemaining}
          </Text>
        </Card>

        {/* Stats */}
        <Card variant="outlined" style={styles.statsCard}>
          <Text variant="h4" style={styles.statsTitle}>
            Атрибути
          </Text>
          {(Object.keys(attributes) as AttributeKey[]).map((stat) =>
            renderStatRow(stat, attributes[stat])
          )}
        </Card>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Начало"
            variant="secondary"
            onPress={handleReset}
            style={styles.resetButton}
          />
          <Button
            title="Започни приключението"
            variant="primary"
            onPress={handleConfirm}
            disabled={!isValid}
            style={styles.confirmButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    marginBottom: 24,
  },
  nameCard: {
    marginBottom: 16,
  },
  inputLabel: {
    marginBottom: 8,
  },
  nameInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  pointsCard: {
    marginBottom: 16,
  },
  statsCard: {
    marginBottom: 24,
  },
  statsTitle: {
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  statLabelContainer: {
    flex: 1,
  },
  statControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statValue: {
    width: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 12,
  },
  resetButton: {
    marginBottom: 8,
  },
  confirmButton: {
    marginBottom: 16,
  },
});
