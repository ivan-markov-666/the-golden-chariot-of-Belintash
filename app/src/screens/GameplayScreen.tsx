import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { GameScreen } from '@/components/layouts/GameScreen';
import { Button, Card, Text, Spinner } from '@/components/ui';
import { useTheme } from '@/theme/theme';

/**
 * Gameplay Screen
 *
 * Main gameplay screen displaying scenarios and handling player choices.
 * Shows narrative text and available choices for the player to progress.
 */

// Mock types for now - these would come from actual stores in future
interface Choice {
  id: string;
  text: string;
  nextScenarioId?: string;
  skillCheck?: {
    dc: number;
    attribute: string;
  };
  locked?: boolean;
}

interface Scenario {
  id: string;
  title: string;
  narrative: string;
  choices: Choice[];
}

interface Character {
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  gold: number;
}

type GameplayScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Gameplay'>;
type GameplayScreenRouteProp = RouteProp<RootStackParamList, 'Gameplay'>;

export const GameplayScreen: React.FC = () => {
  const navigation = useNavigation<GameplayScreenNavigationProp>();
  const route = useRoute<GameplayScreenRouteProp>();
  const { theme } = useTheme();

  const [loading, setLoading] = useState(false);
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [character] = useState<Character>({
    health: 100,
    maxHealth: 100,
    mana: 50,
    maxMana: 50,
    gold: 10,
  });

  // Mock scenario for demonstration
  const mockScenario: Scenario = {
    id: 'act1-scene1',
    title: 'Пътят към Белинташ',
    narrative: 'Слънцето залязва зад Родопите, оцветявайки небето в пурпурно и златно. Пред вас се открива древният път, водещ към Белинташ - мистичното скално светилище. Легендите разказват, че тук някога е кацнал златният колесница на боговете.\n\nВятърът прошумолява през боровете, а в далечината се чува нещо като... пеене? Или може би е само вятъра? Пътят пред вас се разклонява на две.',
    choices: [
      {
        id: 'choice-1',
        text: 'Продължавам по главния път към светилището',
        nextScenarioId: 'act1-scene2-main',
      },
      {
        id: 'choice-2',
        text: 'Следвам страничната пътека към източния склон',
        nextScenarioId: 'act1-scene2-east',
      },
      {
        id: 'choice-3',
        text: 'Оглеждам се за източника на звука',
        skillCheck: {
          dc: 12,
          attribute: 'perception',
        },
      },
      {
        id: 'choice-4',
        text: 'Крия се и наблюдавам от прикритие',
        locked: true,
      },
    ],
  };

  // Load scenario on mount
  React.useEffect(() => {
    // In the future, this would load from a scenario service
    setScenario(mockScenario);
  }, []);

  const handleChoice = useCallback((choice: Choice) => {
    if (choice.locked) return;

    // TODO: Process choice consequences
    // For now, just navigate to next scenario or reload
    if (choice.nextScenarioId) {
      // In real implementation, this would load the next scenario
      console.log('Navigating to:', choice.nextScenarioId);
    }
  }, []);

  const handleBackToMenu = useCallback(() => {
    navigation.navigate('MainMenu');
  }, [navigation]);

  const renderResourceBar = () => (
    <View style={styles.resourceBar}>
      <View style={styles.resourceItem}>
        <Text variant="caption" color="error">Здраве</Text>
        <View style={styles.resourceBarContainer}>
          <View
            style={[
              styles.resourceBarFill,
              {
                width: `${(character.health / character.maxHealth) * 100}%`,
                backgroundColor: theme.colors.error,
              },
            ]}
          />
        </View>
        <Text variant="caption">{character.health}/{character.maxHealth}</Text>
      </View>

      <View style={styles.resourceItem}>
        <Text variant="caption" color="primary">Мана</Text>
        <View style={styles.resourceBarContainer}>
          <View
            style={[
              styles.resourceBarFill,
              {
                width: `${(character.mana / character.maxMana) * 100}%`,
                backgroundColor: theme.colors.primary,
              },
            ]}
          />
        </View>
        <Text variant="caption">{character.mana}/{character.maxMana}</Text>
      </View>

      <View style={styles.goldContainer}>
        <Text variant="caption" color="accent">Злато: {character.gold}</Text>
      </View>
    </View>
  );

  const renderChoice = (choice: Choice) => (
    <Card
      key={choice.id}
      variant={choice.locked ? 'filled' : 'outlined'}
      padding="md"
      style={{
        marginBottom: 12,
        opacity: choice.locked ? 0.5 : 1,
      }}
    >
      <Button
        title={choice.text}
        variant={choice.locked ? 'ghost' : 'secondary'}
        onPress={() => handleChoice(choice)}
        disabled={choice.locked}
        style={{ width: '100%' }}
      />
      {choice.skillCheck && (
        <Text variant="caption" color="primary" style={styles.skillCheck}>
          Проверка: {choice.skillCheck.attribute.toUpperCase()} DC {choice.skillCheck.dc}
        </Text>
      )}
      {choice.locked && (
        <Text variant="caption" color="textSecondary" style={styles.lockedBadge}>
          🔒 Заключено
        </Text>
      )}
    </Card>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <Spinner />
        <Text variant="body" style={styles.loadingText}>
          Зареждане на сценарий...
        </Text>
      </View>
    );
  }

  if (!scenario) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.colors.background }]}>
        <Text variant="h3" color="error" style={styles.errorTitle}>
          Грешка при зареждане
        </Text>
        <Text variant="body" style={styles.errorText}>
          Не може да се зареди сценарият.
        </Text>
        <Button
          title="Обратно към менюто"
          variant="primary"
          onPress={handleBackToMenu}
        />
      </View>
    );
  }

  return (
    <GameScreen
      title={scenario.title}
      narrative={scenario.narrative}
      footer={renderResourceBar()}
    >
      <View style={styles.choicesContainer}>
        <Text variant="h4" style={styles.choicesTitle}>
          Вашият избор:
        </Text>
        {scenario.choices.map(renderChoice)}
      </View>
    </GameScreen>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    marginBottom: 8,
  },
  errorText: {
    marginBottom: 24,
    textAlign: 'center',
  },
  resourceBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
  },
  resourceItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  resourceBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 4,
    marginVertical: 4,
    overflow: 'hidden',
  },
  resourceBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  goldContainer: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  choicesContainer: {
    marginTop: 24,
  },
  choicesTitle: {
    marginBottom: 16,
  },
  choiceCard: {
    marginBottom: 12,
  },
  skillCheck: {
    marginTop: 8,
    textAlign: 'center',
  },
  lockedBadge: {
    marginTop: 8,
    textAlign: 'center',
  },
});
