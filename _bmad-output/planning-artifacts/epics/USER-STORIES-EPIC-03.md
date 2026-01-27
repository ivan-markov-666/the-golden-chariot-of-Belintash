# User Stories - Epic 3: State Management & Persistence
## The Golden Chariot of Belintash

**Epic:** Epic 3 - State Management & Persistence  
**Total Stories:** 6  
**Total Story Points:** 21 SP  
**Sprint:** Sprint 2  
**Priority:** Critical  
**Version:** 1.0  
**Date:** January 13, 2026

---

## Epic Overview

**Epic Goal:** Implement centralized state management with Zustand and create robust save/load system for game persistence.

**Epic Success Criteria:**
- Zustand stores configured for all game state
- Save/load system works reliably
- Character progression persists across sessions
- Quest states tracked accurately
- NPC relationships saved and loaded
- DLC content state managed separately
- Auto-save implemented
- Multiple save slots supported

**Dependencies:** 
- Epic 1 (Project Setup) - Complete
- Epic 2 (Core Game Engine) - Complete

**Estimated Duration:** 5-7 days (Sprint 2, parallel with Epic 2)

---

## Table of Contents

- [Story 3.1: Setup Zustand Stores](#story-31-setup-zustand-stores)
- [Story 3.2: Implement Save/Load System](#story-32-implement-saveload-system)
- [Story 3.3: Character State Management](#story-33-character-state-management)
- [Story 3.4: Quest State Management](#story-34-quest-state-management)
- [Story 3.5: NPC Relationship Tracking](#story-35-npc-relationship-tracking)
- [Story 3.6: DLC State Handling](#story-36-dlc-state-handling)

---

## Story 3.1: Setup Zustand Stores

**Story ID:** 3.1  
**Story Points:** 3 SP  
**Priority:** Critical  
**Assignee:** Lead Developer  
**Sprint:** Sprint 2  
**Dependencies:** Epic 1 complete

### User Story

> **As a** developer  
> **I want** centralized state management with Zustand  
> **So that** game state is consistent and easy to manage across the app

### Detailed Description

Setup Zustand as the primary state management solution for the game. Create the store architecture with separate slices for different domains (game, character, quests, UI). Configure TypeScript types for all stores, implement devtools integration, and establish patterns for state updates and side effects.

Zustand was chosen over Redux because it's simpler, has less boilerplate, and works well with TypeScript. It provides just enough structure without being opinionated.

### Acceptance Criteria

#### Must Have
- [ ] Zustand installed and configured
- [ ] Store architecture defined (separate slices)
- [ ] TypeScript types for all stores
- [ ] Game state store created
- [ ] Character state store created
- [ ] Quest state store created
- [ ] UI state store created
- [ ] Store hooks exported for components
- [ ] Devtools integration working

#### Should Have
- [ ] Middleware for logging state changes
- [ ] Middleware for persistence
- [ ] State selectors for performance
- [ ] Store documentation

#### Nice to Have
- [ ] Redux DevTools integration
- [ ] Time-travel debugging
- [ ] State snapshots for testing

### Technical Implementation

#### Step 1: Install Zustand

```bash
# Install Zustand
npm install zustand

# Install devtools (optional but recommended)
npm install --save-dev @types/node

# Verify installation
npm list zustand
# Expected: zustand@4.x.x
```

#### Step 2: Create Store Architecture

**File:** `src/store/index.ts`

```typescript
/**
 * Main Store Export
 * 
 * Exports all store hooks and types
 */

export * from './gameStore';
export * from './characterStore';
export * from './questStore';
export * from './uiStore';

// Re-export Zustand types
export type { StateCreator } from 'zustand';
```

#### Step 3: Create Game State Store

**File:** `src/store/gameStore.ts`

```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { GameState, GameTime } from '@types/gameState';

/**
 * Game State Store
 * 
 * Manages core game state: flags, counters, location, time, etc.
 */

interface GameStateStore {
  // State
  gameState: GameState;
  
  // Actions
  setFlag: (key: string, value: boolean) => void;
  setCounter: (key: string, value: number) => void;
  incrementCounter: (key: string, amount?: number) => void;
  decrementCounter: (key: string, amount?: number) => void;
  setLocation: (locationId: string) => void;
  advanceTime: (hours: number) => void;
  setGameTime: (time: Partial<GameTime>) => void;
  setRelationship: (npcId: string, affinity: number) => void;
  adjustRelationship: (npcId: string, delta: number) => void;
  resetGameState: () => void;
  loadGameState: (state: GameState) => void;
}

const initialGameState: GameState = {
  flags: {},
  counters: {},
  location: 'start',
  gameTime: {
    day: 1,
    hour: 6,
    period: 'morning',
  },
  relationships: {},
  completedScenarios: [],
  unlockedLocations: ['start'],
  discoveredItems: [],
  activeQuests: [],
  completedQuests: [],
  metadata: {
    playthrough: 1,
    difficulty: 'normal',
    startedAt: Date.now(),
    lastSavedAt: Date.now(),
  },
};

export const useGameStore = create<GameStateStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        gameState: initialGameState,
        
        // Flag actions
        setFlag: (key: string, value: boolean) =>
          set(
            (state) => ({
              gameState: {
                ...state.gameState,
                flags: {
                  ...state.gameState.flags,
                  [key]: value,
                },
              },
            }),
            false,
            'game/setFlag'
          ),
        
        // Counter actions
        setCounter: (key: string, value: number) =>
          set(
            (state) => ({
              gameState: {
                ...state.gameState,
                counters: {
                  ...state.gameState.counters,
                  [key]: value,
                },
              },
            }),
            false,
            'game/setCounter'
          ),
        
        incrementCounter: (key: string, amount: number = 1) =>
          set(
            (state) => {
              const currentValue = state.gameState.counters[key] || 0;
              return {
                gameState: {
                  ...state.gameState,
                  counters: {
                    ...state.gameState.counters,
                    [key]: currentValue + amount,
                  },
                },
              };
            },
            false,
            'game/incrementCounter'
          ),
        
        decrementCounter: (key: string, amount: number = 1) =>
          set(
            (state) => {
              const currentValue = state.gameState.counters[key] || 0;
              return {
                gameState: {
                  ...state.gameState,
                  counters: {
                    ...state.gameState.counters,
                    [key]: Math.max(0, currentValue - amount),
                  },
                },
              };
            },
            false,
            'game/decrementCounter'
          ),
        
        // Location actions
        setLocation: (locationId: string) =>
          set(
            (state) => ({
              gameState: {
                ...state.gameState,
                location: locationId,
                unlockedLocations: state.gameState.unlockedLocations.includes(locationId)
                  ? state.gameState.unlockedLocations
                  : [...state.gameState.unlockedLocations, locationId],
              },
            }),
            false,
            'game/setLocation'
          ),
        
        // Time actions
        advanceTime: (hours: number) =>
          set(
            (state) => {
              const { gameTime } = state.gameState;
              const newHour = (gameTime.hour + hours) % 24;
              const newDay = gameTime.day + Math.floor((gameTime.hour + hours) / 24);
              
              let newPeriod: GameTime['period'];
              if (newHour >= 6 && newHour < 12) {
                newPeriod = 'morning';
              } else if (newHour >= 12 && newHour < 18) {
                newPeriod = 'afternoon';
              } else if (newHour >= 18 && newHour < 22) {
                newPeriod = 'evening';
              } else {
                newPeriod = 'night';
              }
              
              return {
                gameState: {
                  ...state.gameState,
                  gameTime: {
                    day: newDay,
                    hour: newHour,
                    period: newPeriod,
                  },
                },
              };
            },
            false,
            'game/advanceTime'
          ),
        
        setGameTime: (time: Partial<GameTime>) =>
          set(
            (state) => ({
              gameState: {
                ...state.gameState,
                gameTime: {
                  ...state.gameState.gameTime,
                  ...time,
                },
              },
            }),
            false,
            'game/setGameTime'
          ),
        
        // Relationship actions
        setRelationship: (npcId: string, affinity: number) =>
          set(
            (state) => ({
              gameState: {
                ...state.gameState,
                relationships: {
                  ...state.gameState.relationships,
                  [npcId]: Math.max(-100, Math.min(100, affinity)),
                },
              },
            }),
            false,
            'game/setRelationship'
          ),
        
        adjustRelationship: (npcId: string, delta: number) =>
          set(
            (state) => {
              const currentAffinity = state.gameState.relationships[npcId] || 0;
              return {
                gameState: {
                  ...state.gameState,
                  relationships: {
                    ...state.gameState.relationships,
                    [npcId]: Math.max(-100, Math.min(100, currentAffinity + delta)),
                  },
                },
              };
            },
            false,
            'game/adjustRelationship'
          ),
        
        // Reset state
        resetGameState: () =>
          set(
            () => ({
              gameState: {
                ...initialGameState,
                metadata: {
                  ...initialGameState.metadata,
                  startedAt: Date.now(),
                  lastSavedAt: Date.now(),
                },
              },
            }),
            false,
            'game/reset'
          ),
        
        // Load state
        loadGameState: (state: GameState) =>
          set(
            () => ({
              gameState: state,
            }),
            false,
            'game/load'
          ),
      }),
      {
        name: 'game-storage',
        partialize: (state) => ({ gameState: state.gameState }),
      }
    ),
    {
      name: 'GameStore',
    }
  )
);

/**
 * Selectors for optimized re-renders
 */
export const selectFlag = (key: string) => (state: GameStateStore) =>
  state.gameState.flags[key] ?? false;

export const selectCounter = (key: string) => (state: GameStateStore) =>
  state.gameState.counters[key] ?? 0;

export const selectLocation = (state: GameStateStore) =>
  state.gameState.location;

export const selectGameTime = (state: GameStateStore) =>
  state.gameState.gameTime;

export const selectRelationship = (npcId: string) => (state: GameStateStore) =>
  state.gameState.relationships[npcId] ?? 0;
```

#### Step 4: Create Character State Store

**File:** `src/store/characterStore.ts`

```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { PlayerCharacter, createDefaultCharacter } from '@types/character';

/**
 * Character State Store
 * 
 * Manages player character data: stats, skills, inventory, equipment
 */

interface CharacterStateStore {
  // State
  character: PlayerCharacter | null;
  
  // Actions
  createCharacter: (name: string) => void;
  updateCharacter: (updates: Partial<PlayerCharacter>) => void;
  addExperience: (amount: number) => void;
  levelUp: () => void;
  adjustHealth: (amount: number) => void;
  adjustMana: (amount: number) => void;
  adjustGold: (amount: number) => void;
  increaseStat: (stat: keyof PlayerCharacter['attributes'], amount: number) => void;
  increaseSkill: (skill: keyof PlayerCharacter['skills'], amount: number) => void;
  addItem: (itemId: string, quantity?: number) => void;
  removeItem: (itemId: string, quantity?: number) => void;
  equipItem: (itemId: string, slot: keyof PlayerCharacter['equipment']) => void;
  unequipItem: (slot: keyof PlayerCharacter['equipment']) => void;
  resetCharacter: () => void;
  loadCharacter: (character: PlayerCharacter) => void;
}

export const useCharacterStore = create<CharacterStateStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        character: null,
        
        // Create character
        createCharacter: (name: string) =>
          set(
            () => ({
              character: createDefaultCharacter(name),
            }),
            false,
            'character/create'
          ),
        
        // Update character
        updateCharacter: (updates: Partial<PlayerCharacter>) =>
          set(
            (state) => ({
              character: state.character
                ? { ...state.character, ...updates }
                : null,
            }),
            false,
            'character/update'
          ),
        
        // Experience and leveling
        addExperience: (amount: number) =>
          set(
            (state) => {
              if (!state.character) return state;
              
              const newExperience = state.character.experience + amount;
              const canLevelUp = newExperience >= state.character.experienceToNextLevel;
              
              return {
                character: {
                  ...state.character,
                  experience: newExperience,
                },
              };
            },
            false,
            'character/addExperience'
          ),
        
        levelUp: () =>
          set(
            (state) => {
              if (!state.character) return state;
              if (state.character.experience < state.character.experienceToNextLevel) {
                return state;
              }
              
              const newLevel = state.character.level + 1;
              const newMaxHealth = state.character.maxHealth + 10;
              const newMaxMana = state.character.maxMana + 5;
              const experienceForNextLevel = 100 * newLevel * (newLevel + 1) / 2;
              
              return {
                character: {
                  ...state.character,
                  level: newLevel,
                  maxHealth: newMaxHealth,
                  health: newMaxHealth, // Full heal on level up
                  maxMana: newMaxMana,
                  mana: newMaxMana,
                  experienceToNextLevel: experienceForNextLevel,
                },
              };
            },
            false,
            'character/levelUp'
          ),
        
        // Resources
        adjustHealth: (amount: number) =>
          set(
            (state) => {
              if (!state.character) return state;
              
              return {
                character: {
                  ...state.character,
                  health: Math.max(
                    0,
                    Math.min(
                      state.character.maxHealth,
                      state.character.health + amount
                    )
                  ),
                },
              };
            },
            false,
            'character/adjustHealth'
          ),
        
        adjustMana: (amount: number) =>
          set(
            (state) => {
              if (!state.character) return state;
              
              return {
                character: {
                  ...state.character,
                  mana: Math.max(
                    0,
                    Math.min(state.character.maxMana, state.character.mana + amount)
                  ),
                },
              };
            },
            false,
            'character/adjustMana'
          ),
        
        adjustGold: (amount: number) =>
          set(
            (state) => {
              if (!state.character) return state;
              
              return {
                character: {
                  ...state.character,
                  gold: Math.max(0, state.character.gold + amount),
                },
              };
            },
            false,
            'character/adjustGold'
          ),
        
        // Stats and skills
        increaseStat: (stat: keyof PlayerCharacter['attributes'], amount: number) =>
          set(
            (state) => {
              if (!state.character) return state;
              
              return {
                character: {
                  ...state.character,
                  attributes: {
                    ...state.character.attributes,
                    [stat]: Math.min(100, state.character.attributes[stat] + amount),
                  },
                },
              };
            },
            false,
            'character/increaseStat'
          ),
        
        increaseSkill: (skill: keyof PlayerCharacter['skills'], amount: number) =>
          set(
            (state) => {
              if (!state.character) return state;
              
              return {
                character: {
                  ...state.character,
                  skills: {
                    ...state.character.skills,
                    [skill]: Math.min(100, state.character.skills[skill] + amount),
                  },
                },
              };
            },
            false,
            'character/increaseSkill'
          ),
        
        // Inventory
        addItem: (itemId: string, quantity: number = 1) =>
          set(
            (state) => {
              if (!state.character) return state;
              
              const existingItem = state.character.inventory.find(
                (item) => item.id === itemId
              );
              
              if (existingItem) {
                return {
                  character: {
                    ...state.character,
                    inventory: state.character.inventory.map((item) =>
                      item.id === itemId
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                    ),
                  },
                };
              }
              
              return {
                character: {
                  ...state.character,
                  inventory: [
                    ...state.character.inventory,
                    { id: itemId, quantity },
                  ],
                },
              };
            },
            false,
            'character/addItem'
          ),
        
        removeItem: (itemId: string, quantity: number = 1) =>
          set(
            (state) => {
              if (!state.character) return state;
              
              return {
                character: {
                  ...state.character,
                  inventory: state.character.inventory
                    .map((item) =>
                      item.id === itemId
                        ? { ...item, quantity: item.quantity - quantity }
                        : item
                    )
                    .filter((item) => item.quantity > 0),
                },
              };
            },
            false,
            'character/removeItem'
          ),
        
        // Equipment
        equipItem: (itemId: string, slot: keyof PlayerCharacter['equipment']) =>
          set(
            (state) => {
              if (!state.character) return state;
              
              return {
                character: {
                  ...state.character,
                  equipment: {
                    ...state.character.equipment,
                    [slot]: { id: itemId },
                  },
                },
              };
            },
            false,
            'character/equipItem'
          ),
        
        unequipItem: (slot: keyof PlayerCharacter['equipment']) =>
          set(
            (state) => {
              if (!state.character) return state;
              
              return {
                character: {
                  ...state.character,
                  equipment: {
                    ...state.character.equipment,
                    [slot]: null,
                  },
                },
              };
            },
            false,
            'character/unequipItem'
          ),
        
        // Reset
        resetCharacter: () =>
          set(
            () => ({
              character: null,
            }),
            false,
            'character/reset'
          ),
        
        // Load
        loadCharacter: (character: PlayerCharacter) =>
          set(
            () => ({
              character,
            }),
            false,
            'character/load'
          ),
      }),
      {
        name: 'character-storage',
        partialize: (state) => ({ character: state.character }),
      }
    ),
    {
      name: 'CharacterStore',
    }
  )
);

/**
 * Selectors
 */
export const selectCharacter = (state: CharacterStateStore) => state.character;

export const selectCharacterStat = (stat: keyof PlayerCharacter['attributes']) => 
  (state: CharacterStateStore) => state.character?.attributes[stat] ?? 0;

export const selectCharacterSkill = (skill: keyof PlayerCharacter['skills']) =>
  (state: CharacterStateStore) => state.character?.skills[skill] ?? 0;

export const selectHealth = (state: CharacterStateStore) =>
  state.character ? {
    current: state.character.health,
    max: state.character.maxHealth,
  } : null;

export const selectMana = (state: CharacterStateStore) =>
  state.character ? {
    current: state.character.mana,
    max: state.character.maxMana,
  } : null;
```

#### Step 5: Create Quest State Store

**File:** `src/store/questStore.ts`

```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/**
 * Quest State Store
 * 
 * Manages quest progression and objectives
 */

interface Quest {
  id: string;
  status: 'not_started' | 'active' | 'completed' | 'failed';
  objectives: {
    id: string;
    completed: boolean;
  }[];
  startedAt?: number;
  completedAt?: number;
}

interface QuestStateStore {
  // State
  quests: Record<string, Quest>;
  
  // Actions
  startQuest: (questId: string, objectives: string[]) => void;
  completeObjective: (questId: string, objectiveId: string) => void;
  completeQuest: (questId: string) => void;
  failQuest: (questId: string) => void;
  resetQuests: () => void;
  loadQuests: (quests: Record<string, Quest>) => void;
}

export const useQuestStore = create<QuestStateStore>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        quests: {},
        
        // Start quest
        startQuest: (questId: string, objectives: string[]) =>
          set(
            (state) => ({
              quests: {
                ...state.quests,
                [questId]: {
                  id: questId,
                  status: 'active',
                  objectives: objectives.map((id) => ({
                    id,
                    completed: false,
                  })),
                  startedAt: Date.now(),
                },
              },
            }),
            false,
            'quest/start'
          ),
        
        // Complete objective
        completeObjective: (questId: string, objectiveId: string) =>
          set(
            (state) => {
              const quest = state.quests[questId];
              if (!quest) return state;
              
              return {
                quests: {
                  ...state.quests,
                  [questId]: {
                    ...quest,
                    objectives: quest.objectives.map((obj) =>
                      obj.id === objectiveId ? { ...obj, completed: true } : obj
                    ),
                  },
                },
              };
            },
            false,
            'quest/completeObjective'
          ),
        
        // Complete quest
        completeQuest: (questId: string) =>
          set(
            (state) => {
              const quest = state.quests[questId];
              if (!quest) return state;
              
              return {
                quests: {
                  ...state.quests,
                  [questId]: {
                    ...quest,
                    status: 'completed',
                    completedAt: Date.now(),
                  },
                },
              };
            },
            false,
            'quest/complete'
          ),
        
        // Fail quest
        failQuest: (questId: string) =>
          set(
            (state) => ({
              quests: {
                ...state.quests,
                [questId]: {
                  ...state.quests[questId],
                  status: 'failed',
                  completedAt: Date.now(),
                },
              },
            }),
            false,
            'quest/fail'
          ),
        
        // Reset
        resetQuests: () =>
          set(
            () => ({
              quests: {},
            }),
            false,
            'quest/reset'
          ),
        
        // Load
        loadQuests: (quests: Record<string, Quest>) =>
          set(
            () => ({
              quests,
            }),
            false,
            'quest/load'
          ),
      }),
      {
        name: 'quest-storage',
      }
    ),
    {
      name: 'QuestStore',
    }
  )
);

/**
 * Selectors
 */
export const selectQuest = (questId: string) => (state: QuestStateStore) =>
  state.quests[questId];

export const selectActiveQuests = (state: QuestStateStore) =>
  Object.values(state.quests).filter((q) => q.status === 'active');

export const selectCompletedQuests = (state: QuestStateStore) =>
  Object.values(state.quests).filter((q) => q.status === 'completed');
```

#### Step 6: Create UI State Store

**File:** `src/store/uiStore.ts`

```typescript
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * UI State Store
 * 
 * Manages UI state: modals, loading, notifications, etc.
 * Note: This store is NOT persisted
 */

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  duration?: number;
}

interface UIStateStore {
  // State
  loading: boolean;
  currentScreen: string;
  modalOpen: boolean;
  modalType: string | null;
  modalData: any;
  notifications: Notification[];
  
  // Actions
  setLoading: (loading: boolean) => void;
  setCurrentScreen: (screen: string) => void;
  openModal: (type: string, data?: any) => void;
  closeModal: () => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UIStateStore>()(
  devtools(
    (set) => ({
      // Initial state
      loading: false,
      currentScreen: 'home',
      modalOpen: false,
      modalType: null,
      modalData: null,
      notifications: [],
      
      // Actions
      setLoading: (loading: boolean) =>
        set(
          () => ({ loading }),
          false,
          'ui/setLoading'
        ),
      
      setCurrentScreen: (screen: string) =>
        set(
          () => ({ currentScreen: screen }),
          false,
          'ui/setCurrentScreen'
        ),
      
      openModal: (type: string, data: any = null) =>
        set(
          () => ({
            modalOpen: true,
            modalType: type,
            modalData: data,
          }),
          false,
          'ui/openModal'
        ),
      
      closeModal: () =>
        set(
          () => ({
            modalOpen: false,
            modalType: null,
            modalData: null,
          }),
          false,
          'ui/closeModal'
        ),
      
      addNotification: (notification: Omit<Notification, 'id'>) =>
        set(
          (state) => ({
            notifications: [
              ...state.notifications,
              {
                ...notification,
                id: `notif_${Date.now()}`,
              },
            ],
          }),
          false,
          'ui/addNotification'
        ),
      
      removeNotification: (id: string) =>
        set(
          (state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          }),
          false,
          'ui/removeNotification'
        ),
      
      clearNotifications: () =>
        set(
          () => ({ notifications: [] }),
          false,
          'ui/clearNotifications'
        ),
    }),
    {
      name: 'UIStore',
    }
  )
);

/**
 * Selectors
 */
export const selectLoading = (state: UIStateStore) => state.loading;
export const selectCurrentScreen = (state: UIStateStore) => state.currentScreen;
export const selectModal = (state: UIStateStore) => ({
  open: state.modalOpen,
  type: state.modalType,
  data: state.modalData,
});
export const selectNotifications = (state: UIStateStore) => state.notifications;
```

#### Step 7: Create Store Documentation

**File:** `src/store/README.md`

```markdown
# Store Architecture

## Overview

The game uses Zustand for state management, organized into separate stores by domain:

- **gameStore** - Game state (flags, counters, location, time, relationships)
- **characterStore** - Player character (stats, skills, inventory, equipment)
- **questStore** - Quest progression and objectives
- **uiStore** - UI state (modals, loading, notifications) - NOT persisted

## Usage

### In Components

```typescript
import { useGameStore, selectFlag } from '@store/gameStore';
import { useCharacterStore, selectHealth } from '@store/characterStore';

function MyComponent() {
  // Get specific value with selector (optimized)
  const hasKey = useGameStore(selectFlag('has_magic_key'));
  const health = useCharacterStore(selectHealth);
  
  // Get action
  const setFlag = useGameStore((state) => state.setFlag);
  const adjustHealth = useCharacterStore((state) => state.adjustHealth);
  
  // Use in handlers
  const handleUnlock = () => {
    if (hasKey) {
      setFlag('door_unlocked', true);
      adjustHealth(-10); // Door was trapped!
    }
  };
  
  return (
    <View>
      <Text>Health: {health?.current}/{health?.max}</Text>
      <Button onPress={handleUnlock}>Unlock Door</Button>
    </View>
  );
}
```

### Outside Components (Services, Game Engine)

```typescript
import { useGameStore } from '@store/gameStore';
import { useCharacterStore } from '@store/characterStore';

// Get state
const gameState = useGameStore.getState().gameState;
const character = useCharacterStore.getState().character;

// Call actions
useGameStore.getState().setFlag('quest_started', true);
useCharacterStore.getState().addExperience(100);
```

## Persistence

All stores except `uiStore` are persisted to AsyncStorage automatically.

**Storage keys:**
- `game-storage` - Game state
- `character-storage` - Character data
- `quest-storage` - Quest data

## DevTools

Zustand DevTools are enabled in development mode. Actions are named for easy debugging:
- `game/setFlag`
- `character/addExperience`
- `quest/start`

## Testing

```typescript
import { useGameStore } from '@store/gameStore';

beforeEach(() => {
  // Reset store before each test
  useGameStore.getState().resetGameState();
});

it('sets flag correctly', () => {
  const { setFlag, gameState } = useGameStore.getState();
  
  setFlag('test_flag', true);
  
  expect(gameState.flags['test_flag']).toBe(true);
});
```
```

### Testing Steps

#### Test 1: Verify Zustand Installation

```bash
npm list zustand
# Expected: zustand@4.x.x
```

#### Test 2: Test Store Imports

**File:** `src/__tests__/stores.test.ts`

```typescript
import { useGameStore } from '@store/gameStore';
import { useCharacterStore } from '@store/characterStore';
import { useQuestStore } from '@store/questStore';
import { useUIStore } from '@store/uiStore';

describe('Store Initialization', () => {
  it('imports all stores successfully', () => {
    expect(useGameStore).toBeDefined();
    expect(useCharacterStore).toBeDefined();
    expect(useQuestStore).toBeDefined();
    expect(useUIStore).toBeDefined();
  });
  
  it('has initial game state', () => {
    const { gameState } = useGameStore.getState();
    
    expect(gameState).toBeDefined();
    expect(gameState.flags).toEqual({});
    expect(gameState.location).toBe('start');
  });
  
  it('can set and get flag', () => {
    const { setFlag, gameState } = useGameStore.getState();
    
    setFlag('test_flag', true);
    
    expect(gameState.flags['test_flag']).toBe(true);
  });
  
  it('can create character', () => {
    const { createCharacter, character } = useCharacterStore.getState();
    
    createCharacter('Test Hero');
    
    expect(character).toBeDefined();
    expect(character?.name).toBe('Test Hero');
    expect(character?.level).toBe(1);
  });
});
```

#### Test 3: Run Tests

```bash
npm test
# Expected: All store tests pass
```

#### Test 4: Test in Component

**File:** `src/examples/StoreExample.tsx`

```typescript
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useGameStore, selectFlag } from '@store/gameStore';
import { useCharacterStore, selectCharacter } from '@store/characterStore';

export const StoreExample = () => {
  const hasKey = useGameStore(selectFlag('has_key'));
  const setFlag = useGameStore((state) => state.setFlag);
  
  const character = useCharacterStore(selectCharacter);
  const createCharacter = useCharacterStore((state) => state.createCharacter);
  
  return (
    <View style={{ padding: 20 }}>
      <Text>Has Key: {hasKey ? 'Yes' : 'No'}</Text>
      <Button
        title="Toggle Key"
        onPress={() => setFlag('has_key', !hasKey)}
      />
      
      <Text style={{ marginTop: 20 }}>
        Character: {character?.name || 'None'}
      </Text>
      <Button
        title="Create Character"
        onPress={() => createCharacter('Hero')}
      />
    </View>
  );
};
```

### Definition of Done

- [ ] Zustand installed and working
- [ ] All 4 stores created (game, character, quest, UI)
- [ ] TypeScript types defined
- [ ] Actions implemented for all stores
- [ ] Selectors created for common queries
- [ ] Persistence middleware configured
- [ ] DevTools integration working
- [ ] Store documentation complete
- [ ] Tests passing (90%+ coverage)
- [ ] Example component created
- [ ] Code reviewed

### Common Issues & Solutions

**Issue 1:** "Cannot find module 'zustand'"
```bash
# Solution: Install Zustand
npm install zustand
```

**Issue 2:** "Persist middleware not working"
```bash
# Solution: Install AsyncStorage
npm install @react-native-async-storage/async-storage
```

**Issue 3:** "DevTools not showing"
```bash
# Solution: Make sure you're in development mode
# DevTools only work when __DEV__ is true
```

### Estimated Time

- **Store setup:** 2 hours
- **Actions implementation:** 3 hours
- **Testing:** 2 hours
- **Documentation:** 1 hour
- **Total:** ~8 hours

### Notes

- Zustand is simpler than Redux - less boilerplate
- Persist middleware auto-saves to AsyncStorage
- DevTools are very helpful for debugging
- Selectors prevent unnecessary re-renders
- Test stores in isolation before integrating

### Related Documents

- Architecture Document: Section 5.3 (State Management)
- Story 3.2: Save/Load System uses these stores

---

[Stories 3.2-3.6 continue with detailed implementation...]

## Story 3.2: Implement Save/Load System

**Story ID:** 3.2  
**Story Points:** 5 SP  
**Priority:** Critical  
**Assignee:** Lead Developer  
**Sprint:** Sprint 2  
**Dependencies:** Story 3.1

### User Story

> **As a** player  
> **I want** to save my progress and load it later  
> **So that** I can continue my adventure across multiple sessions

### Detailed Description

Build a comprehensive save/load system that persists all game state to device storage. Support multiple save slots, auto-save functionality, save file validation, and cloud backup. The system must be robust - data corruption should never happen, and players should never lose progress.

This is one of the most critical systems in the game. A single bug here can destroy hours of player progress, so reliability is paramount.

### Acceptance Criteria

#### Must Have
- [ ] Save current game state to AsyncStorage
- [ ] Load game state from AsyncStorage
- [ ] Multiple save slots (3 slots minimum)
- [ ] Auto-save every 5 minutes
- [ ] Auto-save after major events (quest complete, level up)
- [ ] Save file validation (detect corruption)
- [ ] Save file versioning (for future updates)
- [ ] Save metadata (timestamp, playtime, location)
- [ ] Error handling (graceful failure)
- [ ] 95%+ test coverage (critical system)

#### Should Have
- [ ] Manual save/load UI
- [ ] Save slot preview (character name, level, location, timestamp)
- [ ] Delete save slot
- [ ] Export save to file
- [ ] Import save from file

#### Nice to Have
- [ ] Cloud save backup (iCloud/Google Drive)
- [ ] Save compression (reduce size)
- [ ] Save encryption (prevent tampering)

### Technical Implementation

#### Step 1: Create Save/Load Service

**File:** `src/services/SaveLoadService.ts`

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGameStore } from '@store/gameStore';
import { useCharacterStore } from '@store/characterStore';
import { useQuestStore } from '@store/questStore';
import { GameState } from '@types/gameState';
import { PlayerCharacter } from '@types/character';

/**
 * Save/Load Service
 * 
 * Manages saving and loading game state to/from device storage
 */

export interface SaveData {
  version: string;
  timestamp: number;
  metadata: SaveMetadata;
  gameState: GameState;
  character: PlayerCharacter;
  quests: any;
}

export interface SaveMetadata {
  slotIndex: number;
  characterName: string;
  level: number;
  playtime: number;
  location: string;
  lastSaved: number;
}

export interface SaveSlot {
  index: number;
  occupied: boolean;
  metadata?: SaveMetadata;
}

const SAVE_VERSION = '1.0.0';
const SAVE_KEY_PREFIX = 'save_slot_';
const MAX_SAVE_SLOTS = 3;
const AUTO_SAVE_INTERVAL = 5 * 60 * 1000; // 5 minutes

export class SaveLoadService {
  private static instance: SaveLoadService;
  private autoSaveTimer: NodeJS.Timeout | null = null;
  
  private constructor() {}
  
  public static getInstance(): SaveLoadService {
    if (!SaveLoadService.instance) {
      SaveLoadService.instance = new SaveLoadService();
    }
    return SaveLoadService.instance;
  }
  
  /**
   * Save game to specific slot
   */
  public async saveGame(slotIndex: number): Promise<void> {
    if (slotIndex < 0 || slotIndex >= MAX_SAVE_SLOTS) {
      throw new Error(`Invalid save slot: ${slotIndex}`);
    }
    
    console.log(`[SaveLoad] Saving to slot ${slotIndex}...`);
    
    try {
      // Gather state from all stores
      const gameState = useGameStore.getState().gameState;
      const character = useCharacterStore.getState().character;
      const quests = useQuestStore.getState().quests;
      
      if (!character) {
        throw new Error('No character to save');
      }
      
      // Create save data
      const saveData: SaveData = {
        version: SAVE_VERSION,
        timestamp: Date.now(),
        metadata: {
          slotIndex,
          characterName: character.name,
          level: character.level,
          playtime: character.metadata.playtime,
          location: gameState.location,
          lastSaved: Date.now(),
        },
        gameState,
        character,
        quests,
      };
      
      // Validate save data
      this.validateSaveData(saveData);
      
      // Serialize and save
      const serialized = JSON.stringify(saveData);
      const key = this.getSaveKey(slotIndex);
      
      await AsyncStorage.setItem(key, serialized);
      
      console.log(`[SaveLoad] Saved successfully to slot ${slotIndex}`);
      console.log(`[SaveLoad] Save size: ${(serialized.length / 1024).toFixed(2)} KB`);
    } catch (error: any) {
      console.error(`[SaveLoad] Failed to save to slot ${slotIndex}:`, error);
      throw new Error(`Save failed: ${error.message}`);
    }
  }
  
  /**
   * Load game from specific slot
   */
  public async loadGame(slotIndex: number): Promise<SaveData> {
    if (slotIndex < 0 || slotIndex >= MAX_SAVE_SLOTS) {
      throw new Error(`Invalid save slot: ${slotIndex}`);
    }
    
    console.log(`[SaveLoad] Loading from slot ${slotIndex}...`);
    
    try {
      const key = this.getSaveKey(slotIndex);
      const serialized = await AsyncStorage.getItem(key);
      
      if (!serialized) {
        throw new Error(`Save slot ${slotIndex} is empty`);
      }
      
      // Parse save data
      const saveData: SaveData = JSON.parse(serialized);
      
      // Validate save data
      this.validateSaveData(saveData);
      
      // Check version compatibility
      if (saveData.version !== SAVE_VERSION) {
        console.warn(`[SaveLoad] Save version mismatch: ${saveData.version} vs ${SAVE_VERSION}`);
        // TODO: Implement migration if needed
      }
      
      // Apply to stores
      useGameStore.getState().loadGameState(saveData.gameState);
      useCharacterStore.getState().loadCharacter(saveData.character);
      useQuestStore.getState().loadQuests(saveData.quests);
      
      console.log(`[SaveLoad] Loaded successfully from slot ${slotIndex}`);
      
      return saveData;
    } catch (error: any) {
      console.error(`[SaveLoad] Failed to load from slot ${slotIndex}:`, error);
      throw new Error(`Load failed: ${error.message}`);
    }
  }
  
  /**
   * Get all save slots
   */
  public async getSaveSlots(): Promise<SaveSlot[]> {
    const slots: SaveSlot[] = [];
    
    for (let i = 0; i < MAX_SAVE_SLOTS; i++) {
      try {
        const key = this.getSaveKey(i);
        const serialized = await AsyncStorage.getItem(key);
        
        if (serialized) {
          const saveData: SaveData = JSON.parse(serialized);
          slots.push({
            index: i,
            occupied: true,
            metadata: saveData.metadata,
          });
        } else {
          slots.push({
            index: i,
            occupied: false,
          });
        }
      } catch (error) {
        console.error(`[SaveLoad] Error reading slot ${i}:`, error);
        slots.push({
          index: i,
          occupied: false,
        });
      }
    }
    
    return slots;
  }
  
  /**
   * Delete save slot
   */
  public async deleteSave(slotIndex: number): Promise<void> {
    if (slotIndex < 0 || slotIndex >= MAX_SAVE_SLOTS) {
      throw new Error(`Invalid save slot: ${slotIndex}`);
    }
    
    console.log(`[SaveLoad] Deleting slot ${slotIndex}...`);
    
    try {
      const key = this.getSaveKey(slotIndex);
      await AsyncStorage.removeItem(key);
      
      console.log(`[SaveLoad] Deleted slot ${slotIndex}`);
    } catch (error: any) {
      console.error(`[SaveLoad] Failed to delete slot ${slotIndex}:`, error);
      throw new Error(`Delete failed: ${error.message}`);
    }
  }
  
  /**
   * Auto-save current game
   */
  public async autoSave(): Promise<void> {
    console.log('[SaveLoad] Auto-saving...');
    
    try {
      // Auto-save always goes to slot 0 (auto-save slot)
      await this.saveGame(0);
      console.log('[SaveLoad] Auto-save complete');
    } catch (error: any) {
      console.error('[SaveLoad] Auto-save failed:', error);
      // Don't throw - auto-save failures shouldn't crash the game
    }
  }
  
  /**
   * Start auto-save timer
   */
  public startAutoSave(): void {
    if (this.autoSaveTimer) {
      console.warn('[SaveLoad] Auto-save already running');
      return;
    }
    
    console.log(`[SaveLoad] Starting auto-save (every ${AUTO_SAVE_INTERVAL / 1000}s)`);
    
    this.autoSaveTimer = setInterval(() => {
      this.autoSave();
    }, AUTO_SAVE_INTERVAL);
  }
  
  /**
   * Stop auto-save timer
   */
  public stopAutoSave(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
      console.log('[SaveLoad] Stopped auto-save');
    }
  }
  
  /**
   * Export save to JSON file
   */
  public async exportSave(slotIndex: number): Promise<string> {
    const saveData = await this.loadGame(slotIndex);
    return JSON.stringify(saveData, null, 2);
  }
  
  /**
   * Import save from JSON string
   */
  public async importSave(jsonString: string, slotIndex: number): Promise<void> {
    try {
      const saveData: SaveData = JSON.parse(jsonString);
      this.validateSaveData(saveData);
      
      // Update slot index
      saveData.metadata.slotIndex = slotIndex;
      
      // Save to slot
      const serialized = JSON.stringify(saveData);
      const key = this.getSaveKey(slotIndex);
      await AsyncStorage.setItem(key, serialized);
      
      console.log(`[SaveLoad] Imported save to slot ${slotIndex}`);
    } catch (error: any) {
      throw new Error(`Import failed: ${error.message}`);
    }
  }
  
  /**
   * Validate save data structure
   */
  private validateSaveData(saveData: SaveData): void {
    if (!saveData.version) {
      throw new Error('Missing version');
    }
    
    if (!saveData.timestamp) {
      throw new Error('Missing timestamp');
    }
    
    if (!saveData.metadata) {
      throw new Error('Missing metadata');
    }
    
    if (!saveData.gameState) {
      throw new Error('Missing game state');
    }
    
    if (!saveData.character) {
      throw new Error('Missing character');
    }
    
    if (!saveData.quests) {
      throw new Error('Missing quests');
    }
    
    // Additional validation
    if (!saveData.character.name) {
      throw new Error('Character missing name');
    }
    
    if (saveData.character.level < 1) {
      throw new Error('Invalid character level');
    }
  }
  
  /**
   * Get storage key for save slot
   */
  private getSaveKey(slotIndex: number): string {
    return `${SAVE_KEY_PREFIX}${slotIndex}`;
  }
  
  /**
   * Get storage usage statistics
   */
  public async getStorageStats(): Promise<{
    totalSlots: number;
    usedSlots: number;
    totalSize: number;
  }> {
    let usedSlots = 0;
    let totalSize = 0;
    
    for (let i = 0; i < MAX_SAVE_SLOTS; i++) {
      try {
        const key = this.getSaveKey(i);
        const data = await AsyncStorage.getItem(key);
        
        if (data) {
          usedSlots++;
          totalSize += data.length;
        }
      } catch (error) {
        console.error(`[SaveLoad] Error reading slot ${i} for stats:`, error);
      }
    }
    
    return {
      totalSlots: MAX_SAVE_SLOTS,
      usedSlots,
      totalSize,
    };
  }
}

/**
 * Convenience functions
 */
export async function saveGame(slotIndex: number): Promise<void> {
  return SaveLoadService.getInstance().saveGame(slotIndex);
}

export async function loadGame(slotIndex: number): Promise<SaveData> {
  return SaveLoadService.getInstance().loadGame(slotIndex);
}

export async function getSaveSlots(): Promise<SaveSlot[]> {
  return SaveLoadService.getInstance().getSaveSlots();
}

export async function autoSave(): Promise<void> {
  return SaveLoadService.getInstance().autoSave();
}

export function startAutoSave(): void {
  SaveLoadService.getInstance().startAutoSave();
}

export function stopAutoSave(): void {
  SaveLoadService.getInstance().stopAutoSave();
}
```

#### Step 2: Create Save/Load Hooks

**File:** `src/hooks/useSaveLoad.ts`

```typescript
import { useState, useEffect } from 'react';
import { SaveLoadService, SaveSlot } from '@services/SaveLoadService';

/**
 * Hook for save/load operations
 */
export function useSaveLoad() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slots, setSlots] = useState<SaveSlot[]>([]);
  
  const service = SaveLoadService.getInstance();
  
  // Load save slots on mount
  useEffect(() => {
    loadSlots();
  }, []);
  
  const loadSlots = async () => {
    try {
      setLoading(true);
      const loadedSlots = await service.getSaveSlots();
      setSlots(loadedSlots);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const saveGame = async (slotIndex: number) => {
    try {
      setLoading(true);
      setError(null);
      await service.saveGame(slotIndex);
      await loadSlots(); // Refresh slots
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const loadGame = async (slotIndex: number) => {
    try {
      setLoading(true);
      setError(null);
      await service.loadGame(slotIndex);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const deleteSave = async (slotIndex: number) => {
    try {
      setLoading(true);
      setError(null);
      await service.deleteSave(slotIndex);
      await loadSlots(); // Refresh slots
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    loading,
    error,
    slots,
    saveGame,
    loadGame,
    deleteSave,
    refreshSlots: loadSlots,
  };
}
```

#### Step 3: Add Testing

**File:** `src/services/__tests__/SaveLoadService.test.ts`

```typescript
import { SaveLoadService } from '../SaveLoadService';
import { useGameStore } from '@store/gameStore';
import { useCharacterStore } from '@store/characterStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('SaveLoadService', () => {
  let service: SaveLoadService;
  
  beforeEach(() => {
    service = SaveLoadService.getInstance();
    
    // Clear AsyncStorage
    AsyncStorage.clear();
    
    // Reset stores
    useGameStore.getState().resetGameState();
    useCharacterStore.getState().resetCharacter();
    
    // Create test character
    useCharacterStore.getState().createCharacter('Test Hero');
  });
  
  describe('saveGame', () => {
    it('saves game to slot successfully', async () => {
      await service.saveGame(0);
      
      const saved = await AsyncStorage.getItem('save_slot_0');
      expect(saved).toBeTruthy();
      
      const data = JSON.parse(saved!);
      expect(data.version).toBe('1.0.0');
      expect(data.character.name).toBe('Test Hero');
    });
    
    it('throws error for invalid slot', async () => {
      await expect(service.saveGame(-1)).rejects.toThrow('Invalid save slot');
      await expect(service.saveGame(10)).rejects.toThrow('Invalid save slot');
    });
    
    it('throws error when no character', async () => {
      useCharacterStore.getState().resetCharacter();
      
      await expect(service.saveGame(0)).rejects.toThrow('No character to save');
    });
  });
  
  describe('loadGame', () => {
    it('loads game from slot successfully', async () => {
      // Save first
      await service.saveGame(0);
      
      // Modify state
      useGameStore.getState().setFlag('test', true);
      
      // Load
      await service.loadGame(0);
      
      // Verify restored
      const gameState = useGameStore.getState().gameState;
      expect(gameState.flags['test']).toBe(true);
    });
    
    it('throws error for empty slot', async () => {
      await expect(service.loadGame(0)).rejects.toThrow('empty');
    });
  });
  
  describe('getSaveSlots', () => {
    it('returns empty slots when no saves', async () => {
      const slots = await service.getSaveSlots();
      
      expect(slots).toHaveLength(3);
      expect(slots.every(s => !s.occupied)).toBe(true);
    });
    
    it('shows occupied slots correctly', async () => {
      await service.saveGame(0);
      await service.saveGame(2);
      
      const slots = await service.getSaveSlots();
      
      expect(slots[0].occupied).toBe(true);
      expect(slots[1].occupied).toBe(false);
      expect(slots[2].occupied).toBe(true);
      
      expect(slots[0].metadata?.characterName).toBe('Test Hero');
    });
  });
  
  describe('deleteSave', () => {
    it('deletes save slot', async () => {
      await service.saveGame(0);
      
      let slots = await service.getSaveSlots();
      expect(slots[0].occupied).toBe(true);
      
      await service.deleteSave(0);
      
      slots = await service.getSaveSlots();
      expect(slots[0].occupied).toBe(false);
    });
  });
  
  describe('autoSave', () => {
    it('auto-saves to slot 0', async () => {
      await service.autoSave();
      
      const slots = await service.getSaveSlots();
      expect(slots[0].occupied).toBe(true);
    });
    
    it('does not throw on error', async () => {
      // Corrupt state to cause error
      useCharacterStore.getState().resetCharacter();
      
      // Should not throw
      await expect(service.autoSave()).resolves.toBeUndefined();
    });
  });
});
```

### Definition of Done

- [ ] SaveLoadService implemented
- [ ] Save to AsyncStorage working
- [ ] Load from AsyncStorage working
- [ ] Multiple save slots supported (3)
- [ ] Auto-save implemented
- [ ] Save validation working
- [ ] Error handling robust
- [ ] 95%+ test coverage
- [ ] Hook created for UI
- [ ] Documentation complete
- [ ] Code reviewed

### Estimated Time

- **Service implementation:** 4 hours
- **Testing:** 3 hours
- **Hooks:** 1 hour
- **Documentation:** 1 hour
- **Total:** ~9 hours

### Notes

- NEVER lose player data - this is critical!
- Always validate save data before loading
- Auto-save should never crash the game
- Consider compression for large saves
- Test on low-memory devices

### Related Documents

- Story 3.1: Uses Zustand stores
- Story 3.6: DLC saves handled separately

---
## Story 3.3: Character State Management

**Story ID:** 3.3  
**Story Points:** 3 SP  
**Priority:** High  
**Dependencies:** Story 3.1

### User Story

> **As a** player  
> **I want** my character progression to persist  
> **So that** my stats, skills, and inventory are maintained across sessions

### Implementation Summary

Build on the character store from 3.1 to add:
- Level-up system with stat/skill point distribution
- Inventory management with weight limits
- Equipment system with stat modifiers
- Status effects tracking
- Character progression milestones

**Key Features:**
- Attribute point allocation on level up
- Skill training and progression
- Inventory sorting and filtering
- Equipment stat calculations
- Automatic stat recalculation on equipment change

**File:** `src/services/CharacterProgressionService.ts`

```typescript
export class CharacterProgressionService {
  /**
   * Apply level up
   * Player gets points to distribute
   */
  public static levelUp(character: PlayerCharacter): {
    attributePoints: number;
    skillPoints: number;
  } {
    const newLevel = character.level + 1;
    
    return {
      attributePoints: 2, // 2 points per level
      skillPoints: 3,     // 3 points per level
    };
  }
  
  /**
   * Calculate effective stats with equipment
   */
  public static calculateEffectiveStats(
    character: PlayerCharacter
  ): PlayerCharacter['attributes'] {
    const base = { ...character.attributes };
    
    // Apply equipment bonuses
    Object.values(character.equipment).forEach((item) => {
      if (item) {
        // TODO: Add item stat bonuses
      }
    });
    
    return base;
  }
  
  /**
   * Check if character can equip item
   */
  public static canEquip(
    character: PlayerCharacter,
    itemId: string
  ): boolean {
    // TODO: Check requirements (level, stats, class)
    return true;
  }
}
```

**Testing:** 90%+ coverage, focus on level-up edge cases

**Time:** ~4 hours

---

## Story 3.4: Quest State Management

**Story ID:** 3.4  
**Story Points:** 3 SP  
**Priority:** High  
**Dependencies:** Story 3.1

### User Story

> **As a** game designer  
> **I want** robust quest tracking  
> **So that** players can track multiple quests with complex objectives

### Implementation Summary

Expand quest store from 3.1 to support:
- Multi-stage quests
- Branching quest paths
- Quest dependencies
- Quest journal with filters
- Quest rewards system

**Key Features:**
- Quest stage progression
- Conditional objectives (complete A or B)
- Failed quest branches
- Quest expiration (time-limited quests)
- Quest rewards tracking

**File:** `src/services/QuestService.ts`

```typescript
export class QuestService {
  /**
   * Check if quest is available
   */
  public static isQuestAvailable(
    questId: string,
    gameState: GameState,
    character: PlayerCharacter
  ): boolean {
    // Check prerequisites
    // - Level requirement
    // - Previous quests completed
    // - Location
    // - Flags
    return true;
  }
  
  /**
   * Start quest with prerequisites check
   */
  public static startQuest(
    questId: string,
    gameState: GameState
  ): void {
    const questStore = useQuestStore.getState();
    
    // Load quest definition
    const questDef = this.getQuestDefinition(questId);
    
    // Create quest instance
    questStore.startQuest(questId, questDef.objectives);
    
    // Set initial flags
    gameState.flags[`quest_${questId}_started`] = true;
  }
  
  /**
   * Progress objective
   */
  public static progressObjective(
    questId: string,
    objectiveId: string,
    progress: number
  ): void {
    // Update objective progress
    // Check if objective complete
    // Check if all objectives complete
    // If yes, mark quest as completable
  }
}
```

**Testing:** 90%+ coverage, test complex quest chains

**Time:** ~4 hours

---

## Story 3.5: NPC Relationship Tracking

**Story ID:** 3.5  
**Story Points:** 3 SP  
**Priority:** Medium  
**Dependencies:** Story 3.1

### User Story

> **As a** player  
> **I want** my relationships with NPCs to persist  
> **So that** NPCs remember my past interactions

### Implementation Summary

Build relationship system that tracks:
- Affinity values (-100 to +100)
- Relationship milestones (Friend, Romance, Rival)
- Interaction history
- Reputation in different locations/factions
- Relationship-gated content

**Key Features:**
- Affinity decay over time (if not maintained)
- Relationship events (first meeting, romance, betrayal)
- Multiple relationship types (friend, romance, rival, enemy)
- Faction reputation
- Relationship impact on prices, quests, dialogue

**File:** `src/services/RelationshipService.ts`

```typescript
export class RelationshipService {
  /**
   * Get relationship level
   */
  public static getRelationshipLevel(
    affinity: number
  ): 'enemy' | 'unfriendly' | 'neutral' | 'friendly' | 'close' {
    if (affinity <= -50) return 'enemy';
    if (affinity <= -10) return 'unfriendly';
    if (affinity <= 10) return 'neutral';
    if (affinity <= 50) return 'friendly';
    return 'close';
  }
  
  /**
   * Adjust relationship with decay
   */
  public static adjustWithDecay(
    currentAffinity: number,
    delta: number,
    daysSinceLastInteraction: number
  ): number {
    // Apply decay (relationships drift toward neutral)
    const decay = daysSinceLastInteraction * 0.5;
    const withDecay = currentAffinity > 0 
      ? currentAffinity - decay
      : currentAffinity + decay;
    
    // Apply delta
    const newAffinity = withDecay + delta;
    
    // Clamp to -100 to +100
    return Math.max(-100, Math.min(100, newAffinity));
  }
  
  /**
   * Check if relationship gate is met
   */
  public static meetsRelationshipRequirement(
    npcId: string,
    required: number,
    gameState: GameState
  ): boolean {
    const affinity = gameState.relationships[npcId] ?? 0;
    return affinity >= required;
  }
}
```

**Testing:** 85%+ coverage

**Time:** ~3.5 hours

---

## Story 3.6: DLC State Handling

**Story ID:** 3.6  
**Story Points:** 4 SP  
**Priority:** Medium  
**Dependencies:** Stories 3.1, 3.2

### User Story

> **As a** developer  
> **I want** separate DLC state management  
> **So that** DLC content doesn't pollute base game saves

### Implementation Summary

Create DLC state system that:
- Detects installed DLCs
- Loads DLC-specific state
- Saves DLC state separately from base game
- Handles missing DLCs gracefully
- Validates DLC compatibility

**Key Features:**
- DLC detection and activation
- Separate save files for each DLC
- DLC state migration
- DLC content flags
- Compatibility checking

**File:** `src/services/DLCService.ts`

```typescript
export interface DLCManifest {
  id: string;
  version: string;
  name: string;
  dependencies: string[];
  contentFlags: string[];
}

export class DLCService {
  private static installedDLCs: Map<string, DLCManifest> = new Map();
  
  /**
   * Register installed DLC
   */
  public static registerDLC(manifest: DLCManifest): void {
    console.log(`[DLC] Registering: ${manifest.name}`);
    
    // Check dependencies
    for (const dep of manifest.dependencies) {
      if (!this.installedDLCs.has(dep)) {
        throw new Error(`Missing dependency: ${dep}`);
      }
    }
    
    this.installedDLCs.set(manifest.id, manifest);
  }
  
  /**
   * Check if DLC is installed
   */
  public static isDLCInstalled(dlcId: string): boolean {
    return this.installedDLCs.has(dlcId);
  }
  
  /**
   * Get DLC save key
   */
  public static getDLCSaveKey(dlcId: string, slotIndex: number): string {
    return `dlc_${dlcId}_slot_${slotIndex}`;
  }
  
  /**
   * Save DLC state
   */
  public static async saveDLCState(
    dlcId: string,
    slotIndex: number,
    state: any
  ): Promise<void> {
    const key = this.getDLCSaveKey(dlcId, slotIndex);
    const data = JSON.stringify({
      dlcId,
      version: this.installedDLCs.get(dlcId)?.version,
      timestamp: Date.now(),
      state,
    });
    
    await AsyncStorage.setItem(key, data);
  }
  
  /**
   * Load DLC state
   */
  public static async loadDLCState(
    dlcId: string,
    slotIndex: number
  ): Promise<any> {
    if (!this.isDLCInstalled(dlcId)) {
      console.warn(`[DLC] ${dlcId} not installed, skipping load`);
      return null;
    }
    
    const key = this.getDLCSaveKey(dlcId, slotIndex);
    const data = await AsyncStorage.getItem(key);
    
    if (!data) {
      return null;
    }
    
    const parsed = JSON.parse(data);
    
    // Check version compatibility
    const manifest = this.installedDLCs.get(dlcId);
    if (parsed.version !== manifest?.version) {
      console.warn(`[DLC] Version mismatch: ${parsed.version} vs ${manifest?.version}`);
      // TODO: Migrate if needed
    }
    
    return parsed.state;
  }
  
  /**
   * Enable DLC content flags in game state
   */
  public static enableDLCContent(dlcId: string, gameState: GameState): void {
    const manifest = this.installedDLCs.get(dlcId);
    if (!manifest) return;
    
    // Set flags for DLC content
    manifest.contentFlags.forEach((flag) => {
      gameState.flags[flag] = true;
    });
  }
}
```

**Testing:** 85%+ coverage, test missing DLC scenarios

**Time:** ~4.5 hours

---

## Epic 3 Summary

**Completion Status:** 0/6 stories complete  
**Total SP:** 21 SP  
**Estimated Duration:** 5-7 days (Sprint 2)  
**Critical Dependencies:** 
- Epic 1 (Project Setup) complete
- Epic 2 (Game Engine) complete

**Sprint 2 Goals:**
- ✅ State management fully functional
- ✅ Save/load system working reliably
- ✅ Character progression persists
- ✅ Quest tracking operational
- ✅ Auto-save prevents data loss
- ✅ 90%+ test coverage

**Integration Points:**
- Story 2.4 (ConsequenceApplicator) → Uses character store
- Story 2.6 (ChoiceProcessor) → Uses game store
- Story 4.x (UI Components) → Uses all stores

**Testing Strategy:**
- Unit tests for each store
- Integration tests for save/load
- Stress tests (large save files)
- Corruption recovery tests
- Auto-save reliability tests

**Performance Targets:**
- Save: < 500ms
- Load: < 1000ms
- Auto-save: < 300ms (background)
- State updates: < 10ms

**Next Epic:** Epic 4 - UI Components (13 SP)

---

**END OF EPIC 3 USER STORIES**
