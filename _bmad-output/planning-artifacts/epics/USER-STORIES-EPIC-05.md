# User Stories - Epic 5: Game Screens
## The Golden Chariot of Belintash
### 🎊 FINAL FOUNDATION EPIC!

**Epic:** Epic 5 - Game Screens  
**Total Stories:** 4  
**Total Story Points:** 13 SP  
**Sprint:** Sprint 3  
**Priority:** High  
**Version:** 1.0  
**Date:** January 13, 2026

---

## Epic Overview

**Epic Goal:** Build all core game screens using the UI component library and connect them to game state.

**Epic Success Criteria:**
- Main Menu screen with navigation
- Character Creation screen with stat allocation
- Gameplay screen with scenario display and choice selection
- Inventory & Character screen with equipment management
- Screen navigation working (React Navigation)
- All screens connected to Zustand stores
- Responsive layouts for different screen sizes
- Smooth transitions and animations

**Dependencies:** 
- Epic 1 (Project Setup) - Complete ✅
- Epic 2 (Core Game Engine) - Complete ✅
- Epic 3 (State Management) - Complete ✅
- Epic 4 (UI Components) - Complete ✅

**Estimated Duration:** 3-4 days (Sprint 3)

**🎉 This is the LAST epic of the foundation! After this, you can start building content or implementation!**

---

## Table of Contents

- [Story 5.1: Main Menu Screen](#story-51-main-menu-screen)
- [Story 5.2: Character Creation Screen](#story-52-character-creation-screen)
- [Story 5.3: Gameplay Screen](#story-53-gameplay-screen)
- [Story 5.4: Inventory & Character Screen](#story-54-inventory--character-screen)

---

## Story 5.1: Main Menu Screen

**Story ID:** 5.1  
**Story Points:** 3 SP  
**Priority:** Critical  
**Assignee:** Frontend Developer  
**Sprint:** Sprint 3  
**Dependencies:** Story 4.1

### User Story

> **As a** player  
> **I want** a main menu to start the game  
> **So that** I can begin my adventure or continue from a save

### Detailed Description

Create the main menu screen that serves as the entry point to the game. The screen should display the game title, main menu options (New Game, Continue, Load Game, Settings, Credits), and background artwork. Include smooth animations and audio feedback.

This is the first screen players see - it sets the tone for the entire experience. Must be polished, atmospheric, and easy to navigate.

### Acceptance Criteria

#### Must Have
- [ ] Game title displayed prominently
- [ ] "New Game" button (navigates to character creation)
- [ ] "Continue" button (loads last save, disabled if no saves)
- [ ] "Load Game" button (shows save slots)
- [ ] "Settings" button
- [ ] Background image/artwork
- [ ] Responsive layout
- [ ] Navigation working
- [ ] Disabled state for unavailable options

#### Should Have
- [ ] "Credits" button
- [ ] Version number display
- [ ] Fade-in animation on mount
- [ ] Button hover/press animations
- [ ] Background music toggle
- [ ] Save slot preview on hover

#### Nice to Have
- [ ] Animated background (particles, fog)
- [ ] Sound effects on button press
- [ ] Localization switcher
- [ ] Accessibility options quick access

### Technical Implementation

#### Step 1: Setup React Navigation

**File:** `src/navigation/AppNavigator.tsx`

```typescript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainMenuScreen } from '@/screens/MainMenuScreen';
import { CharacterCreationScreen } from '@/screens/CharacterCreationScreen';
import { GameplayScreen } from '@/screens/GameplayScreen';
import { InventoryScreen } from '@/screens/InventoryScreen';
import { LoadGameScreen } from '@/screens/LoadGameScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';

export type RootStackParamList = {
  MainMenu: undefined;
  CharacterCreation: undefined;
  Gameplay: { scenarioId?: string };
  Inventory: undefined;
  LoadGame: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        <Stack.Screen name="MainMenu" component={MainMenuScreen} />
        <Stack.Screen name="CharacterCreation" component={CharacterCreationScreen} />
        <Stack.Screen name="Gameplay" component={GameplayScreen} />
        <Stack.Screen name="Inventory" component={InventoryScreen} />
        <Stack.Screen name="LoadGame" component={LoadGameScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
```

#### Step 2: Create Main Menu Screen

**File:** `src/screens/MainMenuScreen.tsx`

```typescript
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ImageBackground, Animated } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/AppNavigator';
import { ScreenContainer, Button, Text } from '@components/ui';
import { useTheme } from '@/theme/theme';
import { useSaveLoad } from '@/hooks/useSaveLoad';

type MainMenuScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MainMenu'>;
};

export const MainMenuScreen: React.FC<MainMenuScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { slots } = useSaveLoad();
  const [fadeAnim] = useState(new Animated.Value(0));
  
  // Check if there are any saves
  const hasSaves = slots.some(slot => slot.occupied);
  const lastSaveSlot = slots.find(slot => slot.occupied);
  
  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);
  
  const handleNewGame = () => {
    navigation.navigate('CharacterCreation');
  };
  
  const handleContinue = () => {
    if (lastSaveSlot) {
      // Load last save and navigate to gameplay
      // TODO: Implement auto-load
      navigation.navigate('Gameplay', { scenarioId: undefined });
    }
  };
  
  const handleLoadGame = () => {
    navigation.navigate('LoadGame');
  };
  
  const handleSettings = () => {
    navigation.navigate('Settings');
  };
  
  return (
    <ScreenContainer>
      <ImageBackground
        source={require('@/assets/images/main-menu-bg.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              backgroundColor: theme.colors.overlay,
            },
          ]}
        >
          {/* Title */}
          <View style={styles.titleContainer}>
            <Text variant="h1" align="center" color={theme.colors.primary}>
              The Golden Chariot
            </Text>
            <Text variant="h3" align="center" color={theme.colors.primaryLight}>
              of Belintash
            </Text>
            <Text
              variant="caption"
              align="center"
              color={theme.colors.textSecondary}
              style={styles.subtitle}
            >
              A Tale of 1221 Bulgaria
            </Text>
          </View>
          
          {/* Menu Buttons */}
          <View style={styles.menuContainer}>
            <Button
              title="New Game"
              variant="primary"
              size="lg"
              onPress={handleNewGame}
              fullWidth
              style={styles.menuButton}
            />
            
            <Button
              title="Continue"
              variant="secondary"
              size="lg"
              onPress={handleContinue}
              disabled={!hasSaves}
              fullWidth
              style={styles.menuButton}
            />
            
            <Button
              title="Load Game"
              variant="secondary"
              size="lg"
              onPress={handleLoadGame}
              disabled={!hasSaves}
              fullWidth
              style={styles.menuButton}
            />
            
            <Button
              title="Settings"
              variant="ghost"
              size="lg"
              onPress={handleSettings}
              fullWidth
              style={styles.menuButton}
            />
          </View>
          
          {/* Version */}
          <View style={styles.footer}>
            <Text variant="caption" color={theme.colors.textSecondary}>
              Version 1.0.0
            </Text>
          </View>
        </Animated.View>
      </ImageBackground>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  titleContainer: {
    marginTop: 80,
    alignItems: 'center',
  },
  subtitle: {
    marginTop: 8,
  },
  menuContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  menuButton: {
    marginBottom: 16,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 16,
  },
});
```

#### Step 3: Create Load Game Screen

**File:** `src/screens/LoadGameScreen.tsx`

```typescript
import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/AppNavigator';
import { ScreenContainer, Button, Text, Card } from '@components/ui';
import { useSaveLoad } from '@/hooks/useSaveLoad';
import { useTheme } from '@/theme/theme';

type LoadGameScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'LoadGame'>;
};

export const LoadGameScreen: React.FC<LoadGameScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { slots, loadGame, loading } = useSaveLoad();
  
  const handleLoadSlot = async (slotIndex: number) => {
    try {
      await loadGame(slotIndex);
      navigation.navigate('Gameplay', { scenarioId: undefined });
    } catch (error) {
      console.error('Failed to load save:', error);
      // TODO: Show error toast
    }
  };
  
  const handleBack = () => {
    navigation.goBack();
  };
  
  return (
    <ScreenContainer>
      <View style={[styles.container, { padding: theme.spacing.md }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="h2">Load Game</Text>
        </View>
        
        {/* Save Slots */}
        <FlatList
          data={slots}
          keyExtractor={(item) => `slot-${item.index}`}
          renderItem={({ item }) => (
            <Card
              variant="outlined"
              padding="md"
              style={[
                styles.slotCard,
                !item.occupied && { opacity: 0.5 },
              ]}
            >
              {item.occupied && item.metadata ? (
                <View>
                  <Text variant="h4">{item.metadata.characterName}</Text>
                  <Text variant="body" color={theme.colors.textSecondary}>
                    Level {item.metadata.level} • {item.metadata.location}
                  </Text>
                  <Text variant="caption" color={theme.colors.textSecondary}>
                    {new Date(item.metadata.lastSaved).toLocaleString()}
                  </Text>
                  <Button
                    title="Load"
                    variant="primary"
                    onPress={() => handleLoadSlot(item.index)}
                    loading={loading}
                    style={styles.loadButton}
                  />
                </View>
              ) : (
                <View>
                  <Text variant="body" color={theme.colors.textSecondary}>
                    Empty Slot {item.index + 1}
                  </Text>
                </View>
              )}
            </Card>
          )}
          contentContainerStyle={styles.listContent}
        />
        
        {/* Back Button */}
        <Button
          title="Back"
          variant="secondary"
          onPress={handleBack}
          fullWidth
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 24,
  },
  listContent: {
    paddingBottom: 16,
  },
  slotCard: {
    marginBottom: 16,
  },
  loadButton: {
    marginTop: 12,
  },
});
```

### Testing Steps

#### Test 1: Navigation

```typescript
describe('MainMenuScreen Navigation', () => {
  it('navigates to character creation on New Game', () => {
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(<MainMenuScreen navigation={navigation} />);
    
    fireEvent.press(getByText('New Game'));
    
    expect(navigation.navigate).toHaveBeenCalledWith('CharacterCreation');
  });
  
  it('disables Continue when no saves exist', () => {
    // Mock no saves
    const { getByText } = render(<MainMenuScreen navigation={navigation} />);
    
    const continueButton = getByText('Continue');
    expect(continueButton.props.accessibilityState.disabled).toBe(true);
  });
});
```

#### Test 2: UI Rendering

```typescript
describe('MainMenuScreen UI', () => {
  it('renders title correctly', () => {
    const { getByText } = render(<MainMenuScreen navigation={navigation} />);
    
    expect(getByText('The Golden Chariot')).toBeTruthy();
    expect(getByText('of Belintash')).toBeTruthy();
  });
  
  it('shows all menu options', () => {
    const { getByText } = render(<MainMenuScreen navigation={navigation} />);
    
    expect(getByText('New Game')).toBeTruthy();
    expect(getByText('Continue')).toBeTruthy();
    expect(getByText('Load Game')).toBeTruthy();
    expect(getByText('Settings')).toBeTruthy();
  });
});
```

### Definition of Done

- [ ] Main menu screen created
- [ ] Navigation configured
- [ ] All menu options functional
- [ ] Save detection working
- [ ] Fade-in animation working
- [ ] Responsive layout
- [ ] Load game screen created
- [ ] Tests passing (85%+ coverage)
- [ ] Works on iOS and Android
- [ ] Code reviewed

### Estimated Time

- **Navigation setup:** 1 hour
- **Main menu screen:** 2 hours
- **Load game screen:** 1.5 hours
- **Testing:** 1 hour
- **Polish:** 30 minutes
- **Total:** ~6 hours

### Notes

- Main menu is critical - first impression
- Ensure smooth animations (60 FPS)
- Test with and without saves
- Background image should be atmospheric
- Consider adding particles/effects (nice to have)

### Related Documents

- Architecture Document: Section 8 (Navigation)
- Story 5.2: Character creation is next screen

---

## Story 5.2: Character Creation Screen

**Story ID:** 5.2  
**Story Points:** 4 SP  
**Priority:** Critical  
**Dependencies:** Story 5.1

### User Story

> **As a** player  
> **I want** to create my character  
> **So that** I can customize my starting attributes and begin the story

### Implementation Summary

Build character creation screen with:
- Name input
- Stat point allocation (Strength, Dexterity, Intelligence, etc.)
- Skill point allocation
- Character preview
- Validation (minimum/maximum values)
- Confirmation step

**Key Features:**
- Point pool system (distribute limited points)
- Real-time stat preview
- Recommended builds (optional)
- Reset button
- Character stored in Zustand on confirm

**File:** `src/screens/CharacterCreationScreen.tsx`

```typescript
export const CharacterCreationScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [attributes, setAttributes] = useState({
    strength: 10,
    dexterity: 10,
    intelligence: 10,
    wisdom: 10,
    endurance: 10,
    charisma: 10,
    perception: 10,
    luck: 10,
  });
  
  const STARTING_POINTS = 20;
  const pointsUsed = Object.values(attributes).reduce((sum, val) => sum + (val - 10), 0);
  const pointsRemaining = STARTING_POINTS - pointsUsed;
  
  const handleIncreaseStat = (stat: keyof typeof attributes) => {
    if (pointsRemaining > 0 && attributes[stat] < 20) {
      setAttributes({ ...attributes, [stat]: attributes[stat] + 1 });
    }
  };
  
  const handleDecreaseStat = (stat: keyof typeof attributes) => {
    if (attributes[stat] > 5) {
      setAttributes({ ...attributes, [stat]: attributes[stat] - 1 });
    }
  };
  
  const handleConfirm = () => {
    if (!name.trim()) {
      // Show error
      return;
    }
    
    // Create character
    const createCharacter = useCharacterStore.getState().createCharacter;
    createCharacter(name);
    
    // Update attributes
    const character = useCharacterStore.getState().character;
    if (character) {
      character.attributes = attributes;
    }
    
    // Navigate to gameplay
    navigation.navigate('Gameplay', { scenarioId: 'act1-scene1' });
  };
  
  return (
    <ScrollableScreen>
      <Text variant="h2">Create Your Character</Text>
      
      {/* Name Input */}
      <Input
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
        maxLength={20}
      />
      
      {/* Points Display */}
      <Text>Points Remaining: {pointsRemaining}</Text>
      
      {/* Stat Sliders */}
      {Object.keys(attributes).map((stat) => (
        <StatSlider
          key={stat}
          label={stat}
          value={attributes[stat]}
          onIncrease={() => handleIncreaseStat(stat)}
          onDecrease={() => handleDecreaseStat(stat)}
        />
      ))}
      
      {/* Confirm Button */}
      <Button
        title="Begin Adventure"
        variant="primary"
        onPress={handleConfirm}
        disabled={pointsRemaining !== 0 || !name.trim()}
        fullWidth
      />
    </ScrollableScreen>
  );
};
```

**Testing:** 85%+ coverage  
**Time:** ~7 hours

---

## Story 5.3: Gameplay Screen

**Story ID:** 5.3  
**Story Points:** 4 SP  
**Priority:** Critical  
**Dependencies:** Stories 5.1, 4.2

### Implementation Summary

The main gameplay screen where players experience scenarios and make choices:

**Key Features:**
- Display current scenario (title, narrative)
- Show available choices (filtered by conditions)
- Display character resources (health, mana, gold)
- Show active quests
- Handle choice selection
- Process consequences
- Load next scenario
- Auto-save after each choice

**File:** `src/screens/GameplayScreen.tsx`

```typescript
export const GameplayScreen: React.FC<Props> = ({ navigation, route }) => {
  const { gameState } = useGameStore();
  const { character } = useCharacterStore();
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadCurrentScenario();
  }, []);
  
  const loadCurrentScenario = async () => {
    try {
      const scenarioId = route.params?.scenarioId || gameState.currentScenario;
      const loaded = await ScenarioLoader.getInstance().loadScenario(scenarioId);
      setScenario(loaded);
    } catch (error) {
      console.error('Failed to load scenario:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleChoice = async (choice: Choice) => {
    if (!scenario || !character) return;
    
    try {
      // Process choice
      const result = await ChoiceProcessor.processChoice(
        choice,
        scenario,
        gameState,
        character
      );
      
      // Auto-save
      await SaveLoadService.getInstance().autoSave();
      
      // Load next scenario
      if (result.type === 'success') {
        setScenario(result.nextScenario);
      } else if (result.type === 'death') {
        // Handle death
        navigation.navigate('MainMenu');
      }
    } catch (error) {
      console.error('Failed to process choice:', error);
    }
  };
  
  if (loading || !scenario) {
    return <Spinner />;
  }
  
  // Filter available choices
  const availableChoices = scenario.choices.filter((choice) =>
    ConditionEvaluator.evaluateAll(choice.conditions, gameState, character)
  );
  
  return (
    <GameScreen
      title={t(scenario.titleKey)}
      narrative={VariableInterpolator.interpolate(
        t(scenario.textKey),
        gameState,
        character,
        i18n
      )}
      footer={
        <ResourceBar
          health={character.health}
          maxHealth={character.maxHealth}
          mana={character.mana}
          maxMana={character.maxMana}
          gold={character.gold}
        />
      }
    >
      {availableChoices.map((choice) => (
        <ChoiceCard
          key={choice.id}
          choice={choice}
          onPress={() => handleChoice(choice)}
          skillCheckDC={choice.skillCheck?.dc}
        />
      ))}
    </GameScreen>
  );
};
```

**Testing:** 90%+ coverage (critical path)  
**Time:** ~7 hours

---

## Story 5.4: Inventory & Character Screen

**Story ID:** 5.4  
**Story Points:** 2 SP  
**Priority:** Medium  
**Dependencies:** Stories 4.2, 5.3

### Implementation Summary

Screens for viewing character stats and managing inventory:

**Character Screen:**
- Display all attributes and skills
- Show equipment
- Display active status effects
- Level and experience bar

**Inventory Screen:**
- Grid of inventory items
- Equip/unequip functionality
- Use consumables
- Sort/filter options

**Implementation:** Uses StatDisplay, InventorySlot components from Epic 4

**Testing:** 80%+ coverage  
**Time:** ~4 hours

---

## Epic 5 Summary

**Completion Status:** 0/4 stories complete  
**Total SP:** 13 SP  
**Estimated Duration:** 3-4 days (Sprint 3)

**Sprint 3 Goals:**
- ✅ All core screens implemented
- ✅ Navigation working smoothly
- ✅ Save/load integrated
- ✅ Game loop functional
- ✅ 85%+ test coverage

**🎊 FOUNDATION COMPLETE!**

After Epic 5, you have:
- ✅ Complete project setup
- ✅ Core game engine
- ✅ State management
- ✅ UI components
- ✅ Game screens
- ✅ **Ready to add content!**

**Next Phase:** Content creation (Epics 6-23) or start implementation!

---

**END OF EPIC 5 USER STORIES**

**🏆 FOUNDATION DOCUMENTATION: 100% COMPLETE! 🏆**
