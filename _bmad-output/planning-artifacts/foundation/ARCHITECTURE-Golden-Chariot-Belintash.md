# Architecture Document
## The Golden Chariot of Belintash

**Version:** 1.0  
**Date:** January 12, 2026  
**Document Owner:** Technical Architecture Team  
**Status:** Draft for BMAD Implementation  
**Related Documents:** PRD v1.0

---

## Executive Summary

This document describes the technical architecture for **The Golden Chariot of Belintash**, a text-based RPG mobile game built with React Native and Expo. The architecture emphasizes offline-first functionality, modular design for DLC content, and efficient state management for complex game systems.

### Key Architectural Principles

1. **Offline-First:** Zero external dependencies, all functionality local
2. **Modular Design:** DLC content as separate, loadable modules
3. **Scalable State:** Support for complex game state with 100+ flags and relationships
4. **Performance:** 60 FPS UI, < 0.5s scenario transitions
5. **Maintainability:** Clear separation of concerns, typed interfaces

---

## 1. System Architecture Overview

### 1.1 High-Level Architecture

```

#### Occult Grid & Accessibility Support
- **Occult Grid Layout:** Използваме 8-колонен `OccultGrid` helper за StoryTile/Fact Spine и автоматично превключване към 12-колонен режим за Tablet/Desktop viewer. Всички екрани наследяват `withOccultGrid(Component)` HOC, който осигурява CSS grid styles и padding, съгласно UX спецификацията (StoryTile ≤420 px, Telegraph docked, Celestial Dial docked).
- **High-Contrast / Low Ember:** GuardianShell следи `accessibility.mode` и подава токени към ThemeProvider (Ascetic Runes). Компонентите използват `useAccessibilityStyles()` за outline pulse, dry seal и reduced motion поведения.
- **Telemetry Hooks:** ScenarioDisplay, ChoicePanel, ManualOverrideCTA и JourneyTracker диспечват събития към UX State Bus (`telemetry.gaugeLow`, `manualOverride.requested`, `journey.ctaTapped`). GuardianShell решава кога да покаже Consequences Telegraph glow или да блокира overlay, ако Occam правило е нарушено.
┌─────────────────────────────────────────────────────────────┐
│                     Mobile Application                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Presentation Layer                       │  │
│  │  ┌────────────┐  ┌──────────────┐  ┌─────────────┐  │  │
│  │  │   React    │  │  Navigation  │  │     UI      │  │  │
│  │  │ Components │  │    System    │  │  Components │  │  │
│  │  └────────────┘  └──────────────┘  └─────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│                            ↓                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Business Logic Layer                     │  │
│  │  ┌────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐ │  │
│  │  │  Game  │  │  Combat  │  │  Magic   │  │ Quest  │ │  │
│  │  │ Engine │  │  System  │  │  System  │  │ System │ │  │
│  │  └────────┘  └──────────┘  └──────────┘  └────────┘ │  │
│  │  ┌────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐ │  │
│  │  │  Econ  │  │Character │  │   NPC    │  │Travel  │ │  │
│  │  │ System │  │  System  │  │  System  │  │ System │ │  │
│  │  └────────┘  └──────────┘  └──────────┘  └────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
│                            ↓                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │               State Management Layer                  │  │
│  │  ┌────────────────┐     ┌──────────────────────┐    │  │
│  │  │  Zustand Store │ ←→  │   Game State Model   │    │  │
│  │  └────────────────┘     └──────────────────────┘    │  │
│  └──────────────────────────────────────────────────────┘  │
│                            ↓                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │               Persistence Layer                       │  │
│  │  ┌───────────────┐   ┌──────────────┐  ┌──────────┐ │  │
│  │  │  AsyncStorage │   │    SQLite    │  │   MMKV   │ │  │
│  │  │   (Simple)    │   │  (Complex)   │  │ (Cache)  │ │  │
│  │  └───────────────┘   └──────────────┘  └──────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
│                            ↓                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                 Content Layer                         │  │
│  │  ┌────────────┐  ┌─────────────┐  ┌──────────────┐  │  │
│  │  │  Scenario  │  │    Quest    │  │     Item     │  │  │
│  │  │   Files    │  │   Configs   │  │   Database   │  │  │
│  │  └────────────┘  └─────────────┘  └──────────────┘  │  │
│  │  ┌────────────┐  ┌─────────────┐  ┌──────────────┐  │  │
│  │  │    NPC     │  │   Bestiary  │  │  DLC Modules │  │  │
│  │  │   Data     │  │    Data     │  │              │  │  │
│  │  └────────────┘  └─────────────┘  └──────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Architecture Patterns

#### Primary Patterns

**1. Model-View-Controller (MVC) Variant**
- **Model:** Game state, business logic, data persistence
- **View:** React components, UI screens
- **Controller:** Game engine, system managers

**2. Service Layer Pattern**
- Abstraction layer for storage operations
- Decouples business logic from persistence implementation
- Enables easy storage provider swapping

**3. State Management Pattern**
- Centralized state with Zustand/Redux
- Immutable state updates
- Selector-based component subscriptions

**4. Content-as-Data Pattern**
- Game content in JSON/Markdown files
- Data-driven scenario engine
- Hot-reloadable content (development)

**5. Module Federation (DLC)**
- Lazy-loadable DLC modules
- Independent content sets
- Shared core dependencies

---

## 2. Technology Stack

### 2.1 Core Technologies

#### Frontend Framework
```typescript
{
  "framework": "React Native",
  "version": "0.73.x",
  "platform": "Expo (Managed Workflow)",
  "expoSdkVersion": "~50.x",
  "language": "TypeScript 5.x"
}
```

**Rationale:**
- React Native: Cross-platform with single codebase
- Expo: Simplified build process, OTA updates
- TypeScript: Type safety, better DX, reduced runtime errors

#### Navigation
```typescript
{
  "library": "@react-navigation/native",
  "version": "^6.x",
  "navigators": [
    "@react-navigation/stack"
  ]
}
```

**Triad Loop Shell (замества tab bars/snackbars):**
```
TriadLoopNavigator (stack)
├── StoryLoop
│   ├── StoryTileScreen (ScenarioDisplay + ConsequencesTelegraph)
│   └── CelestialDialSheet (modal for travel routes)
├── BattleLoop (CombatScreen)
├── MapLoop (MapScreen + JourneyTracker overlay)
└── JournalLoop (Journal/Journey history)
```
- Navigation между loops става чрез JourneyTracker CTA и GuardianShell events, а не чрез tab bar.
- ModalStack остава за Settings, Save/Load и Dialogue, но всички основни екрани спазват Occam Overlay ≤2 слоя.

### 2.2 State Management

#### Primary: Zustand
```typescript
{
  "library": "zustand",
  "version": "^4.x",
  "middleware": ["persist", "devtools", "immer"]
}
```

**Store Architecture:**
```typescript
// Core stores
stores/
├── gameStore.ts        // Current scenario, flags, world state
├── characterStore.ts   // Player stats, inventory, skills
├── combatStore.ts      // Battle state, turn order
├── questStore.ts       // Quest progress, objectives
├── npcStore.ts         // NPC relationships, dialogue state
└── uiStore.ts          // UI state, modals, loading
```

**Alternative: Redux Toolkit** (if more complex needs)
```typescript
{
  "library": "@reduxjs/toolkit",
  "version": "^2.x",
  "middleware": ["persist", "logger (dev only)"]
}
```

### 2.3 Data Persistence

#### Storage Strategy
```typescript
// Simple data (< 6MB)
AsyncStorage: {
  use: "User preferences, simple flags, current save slot",
  limit: "6MB",
  performance: "Fast for small data"
}

// Complex relational data
SQLite (expo-sqlite): {
  use: "Inventory, quests, NPC relationships, dialogue history",
  limit: "Device storage",
  performance: "Optimal for queries and relationships"
}

// High-performance cache
MMKV (react-native-mmkv): {
  use: "Frequently accessed data, session cache",
  limit: "Device memory",
  performance: "10-100x faster than AsyncStorage"
}
```

#### Storage Decision Matrix

| Data Type | Size | Access Frequency | Storage Choice |
|-----------|------|------------------|----------------|
| User preferences | <1KB | Low | AsyncStorage |
| Current game state | 10-50KB | Very High | MMKV |
| Save files | 100-500KB | Medium | SQLite |
| Inventory items | 50-200KB | High | SQLite + MMKV cache |
| Quest progress | 50-150KB | Medium | SQLite |
| Dialogue history | 100-300KB | Low | SQLite |
| Combat state | 10-20KB | Very High (in battle) | MMKV |

#### MMKV Integration for Hot State

```typescript
import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({
  id: 'golden-chariot-mmkv',
});

// Combat state snapshot (updated every turn)
export class CombatStorage {
  static save(state: CombatState): void {
    storage.set('combat.current', JSON.stringify(state));
  }

  static load(): CombatState | null {
    const payload = storage.getString('combat.current');
    return payload ? JSON.parse(payload) : null;
  }

  static clear(): void {
    storage.delete('combat.current');
  }
}

// Frequently accessed flags/counters
export class HotFlags {
  static setFlag(key: string, value: boolean): void {
    storage.set(`flag.${key}`, value);
  }

  static getFlag(key: string): boolean {
    return storage.getBoolean(`flag.${key}`) ?? false;
  }
}
```

```typescript
// Zustand persistence using MMKV
const mmkvStorage = {
  getItem: (name: string) => storage.getString(name) ?? null,
  setItem: (name: string, value: string) => storage.set(name, value),
  removeItem: (name: string) => storage.delete(name),
};

export const useGameStore = create<GameStore>()(
  persist(set => ({ /* ... */ }), {
    name: 'game-store',
    storage: mmkvStorage,
  })
);
```

**Why:** MMKV is 10-100× по-бърз от AsyncStorage за четене/запис на малки парчета данни, което е критично за combat state, session cache и горещи флагове.

### 2.4 UI Component Library

#### Primary Components
```typescript
{
  "base": "React Native Core Components",
  "enhanced": "React Native Paper (optional)",
  "custom": "src/components/ui/*"
}
```

**Component Structure (актуализирана):**
```
src/components/
├── ui/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   ├── TextDisplay.tsx
│   └── ChoiceButton.tsx
├── game/
│   ├── ScenarioDisplay.tsx
│   ├── ConsequencesTelegraph.tsx
│   ├── JourneyTracker.tsx
│   ├── CelestialDial.tsx
│   ├── CharacterSheet.tsx
│   ├── InventoryGrid.tsx
│   ├── CombatUI.tsx
│   └── DialogueBox.tsx
├── guardian/
│   ├── GuardianShellProvider.tsx
│   ├── useGuardianEvent.ts
│   └── OccamOverlayBoundary.tsx
├── navigation/
│   ├── TriadLoopNavigator.tsx
│   └── ModalNavigator.tsx
└── screens/
    ├── StoryTileScreen.tsx
    ├── BattleScreen.tsx
    ├── MapScreen.tsx
    ├── JournalScreen.tsx
    └── SettingsModal.tsx
```

### 2.5 Development Tools

```typescript
{
  "linting": "ESLint with TypeScript",
  "formatting": "Prettier",
  "testing": {
    "unit": "Jest + React Native Testing Library",
    "e2e": "Detox (optional)"
  },
  "debugging": {
    "reactDevTools": true,
    "reactotron": true,
    "flipper": true
  }
}
```

### 2.6 UX State Bus & GuardianShell Layer

```typescript
// guardian-shell.ts
export interface GuardianEvent {
  type:
    | 'telemetry.gaugeLow'
    | 'manualOverride.requested'
    | 'journey.ctaTapped'
    | 'occam.overlayViolation'
    | 'accessibility.changed';
  payload?: Record<string, unknown>;
}

export const useUXStateBus = create<UXStateStore>()(
  persist(
    (set, get) => ({
      overlaysVisible: 1,
      manualOverridePending: false,
      witnessVoiceTimestamp: null,
      accessibility: { mode: 'default', drySeal: false },
      push: (event: GuardianEvent) => GuardianShell.handle(event, set, get),
    }),
    { name: 'ux-state-bus', storage: mmkvStorage }
  )
);

export class GuardianShell {
  static handle(event: GuardianEvent, set: UXStateStore['set'], get: UXStateStore['get']): void {
    // central place to enforce Occam Overlay, Manual Override cadence, Journey telemetry, etc.
  }
}
```

- **Purpose:** GuardianShell стои над presentation слоя и управлява Occam Overlay Rule (макс 2 слоя), Manual Override cadence, telemetry KPI и Journey Tracker/DLC hooks.
- **Events:** Всеки компонент подава lifecycle събития към `useUXStateBus`. GuardianShell изчислява дали да покаже Telemetry glow, dry seal fallback, Witness Voice reminder или да блокира overlay при нарушено правило.
- **Integration:** React Navigation providers обвиват приложението с `GuardianShellProvider`, който подписва ScenarioDisplay, ConsequencesTelegraph, JourneyTracker и CelestialDial за синхрон.

---

## 3. Component Architecture

### 3.1 Presentation Layer

#### Screen Component Pattern
```typescript
// Pattern for all screen components
interface ScreenProps {
  navigation: NavigationProp;
  route: RouteProp;
}

const GameScreen: React.FC<ScreenProps> = ({ navigation, route }) => {
  // 1. Hooks for state
  const currentScenario = useGameStore(state => state.currentScenario);
  const player = useCharacterStore(state => state.player);
  
  // 2. Local state for UI
  const [loading, setLoading] = useState(false);
  
  // 3. Effects for initialization
  useEffect(() => {
    loadScenario();
  }, []);
  
  // 4. Event handlers
  const handleChoice = (choiceId: string) => {
    processChoice(choiceId);
  };
  
  // 5. Render
  return (
    <View>
      <ScenarioDisplay scenario={currentScenario} />
      <ChoiceButtons choices={currentScenario.choices} onChoice={handleChoice} />
    </View>
  );
};
```

#### Component Hierarchy

**GameScreen (Primary):**
```
GameScreen
├── ScenarioDisplay
│   ├── NarrativeText (scrollable)
│   ├── CharacterPortrait
│   └── LocationBanner
├── ChoicePanel
│   ├── ChoiceButton (A)
│   ├── ChoiceButton (B)
│   ├── ChoiceButton (C)
│   └── ChoiceButton (D - optional)
├── QuickStatsBar
│   ├── HPDisplay
│   ├── ManaDisplay
│   └── GoldDisplay
└── MenuButton
```

**CharacterScreen:**
```
CharacterScreen
├── CharacterHeader
│   ├── Portrait
│   ├── Name/Level
│   └── ExperienceBar
├── StatsPanel
│   ├── PrimaryStats (HP/Mana/Stamina)
│   └── AttributeGrid (8 attributes)
├── SkillsPanel
│   └── SkillTree (hierarchical display)
└── EquipmentPanel
    ├── WeaponSlot
    ├── ArmorSlot
    ├── AccessorySlot
    └── AmuletSlot
```

**InventoryScreen:**
```
InventoryScreen
├── CategoryTabs (Weapons/Armor/Consumables/Materials/Quest)
├── ItemGrid/List
│   └── ItemCard (repeated)
│       ├── Icon
│       ├── Name
│       ├── Quantity
│       └── QuickActions
├── ItemDetailPanel (selected item)
│   ├── Description
│   ├── Stats/Effects
│   └── ActionButtons (Use/Equip/Drop/Sell)
└── WeightDisplay (current/max)
```

**CombatScreen:**
```
CombatScreen
├── BattleHeader
│   ├── TurnOrderDisplay
│   └── RoundCounter
├── EnemyPanel
│   └── EnemyCard (repeated)
│       ├── Portrait
│       ├── HealthBar
│       └── StatusIcons
├── PlayerPanel
│   ├── HealthBar
│   ├── ManaBar
│   └── StatusIcons
├── ActionMenu
│   ├── AttackButton
│   ├── MagicButton
│   ├── ItemButton
│   ├── DefendButton
│   └── FleeButton
├── CombatLog (scrollable)
└── AnimationOverlay
```

### 3.2 Business Logic Layer

#### Game Engine Core

```typescript
// Core game engine interface
interface GameEngine {
  // Scenario management
  loadScenario(scenarioId: string): Promise<Scenario>;
  processChoice(choiceId: string): void;
  evaluateConditions(conditions: Condition[]): boolean;
  applyConsequences(consequences: Consequence[]): void;
  
  // State management
  getGameState(): GameState;
  updateGameState(updates: Partial<GameState>): void;
  
  // Save/Load
  saveGame(slot: number): Promise<void>;
  loadGame(slot: number): Promise<void>;
  
  // Content loading
  loadDLC(dlcId: string): Promise<void>;
  unloadDLC(dlcId: string): void;
}

// Implementation structure
class GameEngineImpl implements GameEngine {
  private scenarioLoader: ScenarioLoader;
  private stateManager: StateManager;
  private combatSystem: CombatSystem;
  private magicSystem: MagicSystem;
  private economySystem: EconomySystem;
  private questSystem: QuestSystem;
  
  // ... implementation
}
```

#### System Managers

**Combat System:**
```typescript
interface CombatSystem {
  initiateCombat(enemies: Enemy[]): void;
  processTurn(action: CombatAction): CombatResult;
  calculateDamage(attacker: Combatant, defender: Combatant, ability: Ability): number;
  applyStatusEffects(): void;
  checkVictoryConditions(): CombatOutcome;
  endCombat(outcome: CombatOutcome): void;
}
```

**Magic System:**
```typescript
interface MagicSystem {
  learnSpell(spellId: string, characterId: string): boolean;
  castSpell(spellId: string, target: Target): SpellResult;
  checkManaCost(spellId: string): boolean;
  consumeMana(amount: number): void;
  regenerateMana(): void;
  getAvailableSpells(characterId: string): Spell[];
}
```

**Economy System:**
```typescript
interface EconomySystem {
  buyItem(itemId: string, merchantId: string): PurchaseResult;
  sellItem(itemId: string, merchantId: string): SaleResult;
  calculatePrice(basePrice: number, reputation: number): number;
  convertCurrency(amount: number, from: Currency, to: Currency): number;
  processBarter(offeredItems: Item[], requestedItems: Item[]): boolean;
}
```

**Quest System:**
```typescript
interface QuestSystem {
  startQuest(questId: string): void;
  updateQuestObjective(questId: string, objectiveId: string, progress: number): void;
  completeQuest(questId: string): QuestReward;
  failQuest(questId: string): void;
  checkQuestAvailability(questId: string): boolean;
  getActiveQuests(): Quest[];
  getQuestProgress(questId: string): QuestProgress;
}
```

---

## 4. Data Models & Schemas

### 4.1 Core Data Models

#### Game State Model
```typescript
interface GameState {
  // Meta information
  version: string;
  timestamp: number;
  playtime: number;
  
  // Current state
  currentScenarioId: string;
  currentLocationId: string;
  currentAct: number;
  
  // Flags and counters
  flags: Record<string, boolean>;
  counters: Record<string, number>;
  
  // Relationships
  relationships: Record<string, number>; // NPC ID -> affinity (-100 to +100)
  
  // World state
  worldState: {
    completedQuests: string[];
    failedQuests: string[];
    activeQuests: QuestProgress[];
    discoveredLocations: string[];
    unlockedSecrets: string[];
    visitedScenarios: string[];
  };
  
  // Player reference
  playerId: string;
  
  // DLC state
  dlcState: Record<string, DLCState>;
}
```

#### Player Character Model
```typescript
interface PlayerCharacter {
  id: string;
  name: string;
  level: number;
  experience: number;
  experienceToNextLevel: number;
  
  // Primary stats
  stats: {
    health: number;
    maxHealth: number;
    mana: number;
    maxMana: number;
    stamina: number;
    maxStamina: number;
  };
  
  // Attributes
  attributes: {
    strength: number;
    dexterity: number;
    endurance: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
    perception: number;
    willpower: number;
  };
  
  // Skills (0-100 scale)
  skills: {
    combat: {
      melee: number;
      ranged: number;
      defense: number;
    };
    magic: {
      arcana: number;
      spirit: number;
      ritual: number;
    };
    social: {
      persuasion: number;
      deception: number;
      intimidation: number;
      leadership: number;
    };
    knowledge: {
      lore: number;
      investigation: number;
      medicine: number;
      survival: number;
    };
    physical: {
      athletics: number;
      stealth: number;
      sleightOfHand: number;
    };
    crafting: {
      engineering: number;
      alchemy: number;
    };
  };
  
  // Equipment
  equipment: {
    weapon: Item | null;
    armor: Item | null;
    accessory: Item | null;
    amulet: Item | null; // Special slot
  };
  
  // Inventory
  inventory: {
    items: Item[];
    gold: number; // In copper (convert for display)
    maxWeight: number;
    currentWeight: number;
  };
  
  // Learned abilities
  knownSpells: string[];
  knownRecipes: string[];
  
  // Status effects
  statusEffects: StatusEffect[];
  
  // Moral alignment
  karma: number; // -100 (evil) to +100 (good)
  
  // Portrait/appearance
  portrait: string; // Asset path
}
```

#### Scenario Model
```typescript
interface Scenario {
  id: string;
  title: string;
  act: number;
  scene: number;
  
  // Location context
  locationId: string;
  locationName: string;
  
  // Prerequisites
  prerequisites: Condition[];
  
  // Content
  narrative: string; // Markdown format with variable interpolation
  
  // NPCs present
  npcsPresent: string[];
  
  // Choices
  choices: Choice[];
  
  // Metadata
  tags: string[];
  category: 'main_quest' | 'side_quest' | 'dlc' | 'random_event';
  estimatedReadTime: number; // seconds
  
  // Traceability
  sourceDocument: string; // Reference to bible document
  lineNumber?: number;
}

interface Choice {
  id: string;
  text: string;
  
  // Requirements
  conditions: Condition[];
  skillChecks: SkillCheck[];
  
  // Consequences
  consequences: Consequence[];
  nextScenario: string | null; // null = end scenario
  
  // UI hints
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  hidden: boolean; // Revealed only if conditions met
  oneTime: boolean; // Can only be chosen once
}

interface Condition {
  type: 'flag' | 'counter' | 'relationship' | 'stat' | 'item' | 'quest' | 'level';
  target: string;
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains';
  value: any;
}

interface SkillCheck {
  skill: string; // e.g., "skills.combat.melee"
  dc: number; // Difficulty class (1-20)
  onSuccess: Consequence[];
  onFailure: Consequence[];
}

interface Consequence {
  type: 'flag' | 'counter' | 'relationship' | 'stat' | 'item' | 'quest' | 'experience' | 'gold' | 'reputation';
  action: 'set' | 'add' | 'remove' | 'multiply';
  target: string;
  value: any;
  description?: string; // For UI feedback
}
```

#### Quest Model
```typescript
interface Quest {
  id: string;
  title: string;
  description: string;
  questGiver: string; // NPC ID
  
  // Classification
  type: 'help' | 'combat' | 'mystery' | 'romance' | 'gathering';
  category: 'main' | 'side' | 'companion' | 'faction';
  region: string;
  
  // Requirements
  prerequisites: Condition[];
  level: number; // Recommended level
  
  // Objectives
  objectives: QuestObjective[];
  
  // Rewards
  rewards: {
    experience: number;
    gold: number;
    items: string[];
    reputation: Record<string, number>; // Faction ID -> change
    karma: number;
    unlocks: string[]; // IDs of things unlocked
  };
  
  // Failure conditions
  failureConditions: Condition[];
  
  // Time limits
  timeLimit?: number; // In-game days
  expiresAt?: string; // Specific scenario ID
  
  // Related content
  relatedQuests: string[];
  relatedScenarios: string[];
}

interface QuestObjective {
  id: string;
  description: string;
  type: 'reach_location' | 'talk_to_npc' | 'collect_item' | 'defeat_enemy' | 'skill_check' | 'wait';
  target: string;
  targetCount: number;
  currentCount: number;
  optional: boolean;
  hidden: boolean; // Revealed as quest progresses
}

interface QuestProgress {
  questId: string;
  status: 'not_started' | 'active' | 'completed' | 'failed';
  startedAt: number; // Timestamp
  completedAt?: number;
  objectives: Record<string, number>; // Objective ID -> progress
}
```

#### Item Model
```typescript
interface Item {
  id: string;
  name: string;
  description: string;
  
  // Classification
  category: 'weapon' | 'armor' | 'consumable' | 'material' | 'quest_item' | 'key' | 'artifact';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'unique';
  
  // Properties
  stackable: boolean;
  maxStack: number;
  weight: number;
  value: number; // Base value in copper
  
  // Equipment stats (if applicable)
  equipmentStats?: {
    slot: 'weapon' | 'armor' | 'accessory' | 'amulet';
    damageMin?: number;
    damageMax?: number;
    damageType?: 'physical' | 'fire' | 'cold' | 'holy' | 'dark';
    armor?: number;
    attributes?: Partial<PlayerCharacter['attributes']>;
    skillBonuses?: Record<string, number>;
  };
  
  // Consumable effects (if applicable)
  consumableEffects?: {
    healthRestore?: number;
    manaRestore?: number;
    staminaRestore?: number;
    buffs?: StatusEffect[];
    duration?: number; // turns
  };
  
  // Requirements
  requirements?: {
    level?: number;
    strength?: number;
    attributes?: Partial<PlayerCharacter['attributes']>;
  };
  
  // Special properties
  unique: boolean; // Only one can exist
  questRelated: boolean;
  tradeable: boolean;
  droppable: boolean;
  
  // Visual
  icon: string; // Asset path
}
```

#### NPC Model
```typescript
interface NPC {
  id: string;
  name: string;
  title?: string;
  
  // Classification
  role: 'merchant' | 'companion' | 'quest_giver' | 'teacher' | 'enemy' | 'neutral';
  faction: string;
  
  // Relationship
  baseAffinity: number; // Starting relationship (-100 to +100)
  currentAffinity: number;
  affinityThresholds: {
    hostile: number;    // -80
    unfriendly: number; // -40
    neutral: number;    // 0
    friendly: number;   // 40
    trusted: number;    // 80
  };
  
  // Interactions
  dialogues: string[]; // Dialogue tree IDs
  questsOffered: string[];
  teachableSpells: string[];
  merchantInventory?: string[]; // Item IDs
  
  // Companion data (if recruitable)
  companionData?: {
    recruitable: boolean;
    recruitQuest?: string;
    combatAbilities: string[];
    specialAbilities: string[];
    personalQuest?: string;
    romanceable: boolean;
  };
  
  // Location
  defaultLocation: string;
  currentLocation: string;
  
  // State
  met: boolean;
  recruited: boolean;
  alive: boolean;
  
  // Visual
  portrait: string;
  sprite?: string;
}
```

#### Combat Models
```typescript
interface CombatState {
  active: boolean;
  roundNumber: number;
  turnOrder: string[]; // Combatant IDs
  currentTurn: string;
  
  // Combatants
  player: Combatant;
  companions: Combatant[];
  enemies: Combatant[];
  
  // History
  combatLog: CombatLogEntry[];
  
  // Conditions
  battleConditions: {
    terrain: 'normal' | 'advantageous' | 'disadvantageous';
    weather: 'clear' | 'rain' | 'snow' | 'fog';
    lighting: 'bright' | 'dim' | 'dark';
  };
}

interface Combatant {
  id: string;
  name: string;
  type: 'player' | 'companion' | 'enemy';
  
  // Stats
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  
  // Combat stats
  initiative: number;
  armor: number;
  
  // Abilities
  abilities: CombatAbility[];
  
  // Status
  statusEffects: StatusEffect[];
  
  // AI (for enemies)
  ai?: {
    strategy: 'aggressive' | 'defensive' | 'support' | 'balanced';
    targetPriority: 'weakest' | 'strongest' | 'random' | 'player';
  };
}

interface CombatAbility {
  id: string;
  name: string;
  type: 'attack' | 'spell' | 'item' | 'defend' | 'flee';
  
  // Costs
  manaCost?: number;
  staminaCost?: number;
  itemRequired?: string;
  
  // Effects
  damage?: number;
  damageType?: 'physical' | 'magical';
  accuracy: number; // Base 100
  
  // Targeting
  target: 'single' | 'all_enemies' | 'all_allies' | 'self' | 'area';
  
  // Additional effects
  statusEffects?: StatusEffect[];
  
  // Cooldown
  cooldown?: number; // Turns
  currentCooldown: number;
}

interface StatusEffect {
  id: string;
  name: string;
  type: 'buff' | 'debuff' | 'dot' | 'hot';
  
  // Effects
  statModifiers?: Partial<PlayerCharacter['attributes']>;
  damagePerTurn?: number;
  healPerTurn?: number;
  
  // Duration
  duration: number; // Turns remaining
  permanent: boolean;
  
  // Visual
  icon: string;
}
```

### 4.2 Database Schema (SQLite)

```sql
-- Player character table
CREATE TABLE player_characters (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    level INTEGER DEFAULT 1,
    experience INTEGER DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    -- Stats stored as JSON
    stats TEXT NOT NULL,
    attributes TEXT NOT NULL,
    skills TEXT NOT NULL,
    karma INTEGER DEFAULT 0
);

-- Inventory table
CREATE TABLE inventory_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id TEXT NOT NULL,
    item_id TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    equipped BOOLEAN DEFAULT FALSE,
    slot TEXT,
    acquired_at INTEGER NOT NULL,
    FOREIGN KEY (character_id) REFERENCES player_characters(id) ON DELETE CASCADE
);

-- Quest progress table
CREATE TABLE quest_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id TEXT NOT NULL,
    quest_id TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('active', 'completed', 'failed')),
    started_at INTEGER NOT NULL,
    completed_at INTEGER,
    -- Objectives as JSON
    objectives TEXT,
    FOREIGN KEY (character_id) REFERENCES player_characters(id) ON DELETE CASCADE,
    UNIQUE(character_id, quest_id)
);

-- NPC relationships table
CREATE TABLE npc_relationships (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id TEXT NOT NULL,
    npc_id TEXT NOT NULL,
    affinity INTEGER DEFAULT 0,
    met BOOLEAN DEFAULT FALSE,
    recruited BOOLEAN DEFAULT FALSE,
    last_interaction INTEGER,
    FOREIGN KEY (character_id) REFERENCES player_characters(id) ON DELETE CASCADE,
    UNIQUE(character_id, npc_id)
);

-- Game state table
CREATE TABLE game_states (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id TEXT NOT NULL,
    current_scenario_id TEXT NOT NULL,
    current_location_id TEXT NOT NULL,
    current_act INTEGER DEFAULT 1,
    -- Flags and counters as JSON
    flags TEXT DEFAULT '{}',
    counters TEXT DEFAULT '{}',
    world_state TEXT DEFAULT '{}',
    dlc_state TEXT DEFAULT '{}',
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    FOREIGN KEY (character_id) REFERENCES player_characters(id) ON DELETE CASCADE
);

-- Save slots table
CREATE TABLE save_slots (
    slot_number INTEGER PRIMARY KEY CHECK(slot_number BETWEEN 1 AND 3),
    character_id TEXT,
    save_name TEXT,
    playtime INTEGER DEFAULT 0,
    timestamp INTEGER NOT NULL,
    -- Snapshot of entire game state as JSON
    state_snapshot TEXT NOT NULL,
    FOREIGN KEY (character_id) REFERENCES player_characters(id) ON DELETE SET NULL
);

-- Dialogue history table
CREATE TABLE dialogue_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id TEXT NOT NULL,
    npc_id TEXT NOT NULL,
    dialogue_id TEXT NOT NULL,
    choice_made TEXT,
    timestamp INTEGER NOT NULL,
    FOREIGN KEY (character_id) REFERENCES player_characters(id) ON DELETE CASCADE
);

-- Achievements table
CREATE TABLE achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id TEXT NOT NULL,
    achievement_id TEXT NOT NULL,
    unlocked_at INTEGER NOT NULL,
    FOREIGN KEY (character_id) REFERENCES player_characters(id) ON DELETE CASCADE,
    UNIQUE(character_id, achievement_id)
);

-- Combat history table (optional, for statistics)
CREATE TABLE combat_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id TEXT NOT NULL,
    scenario_id TEXT NOT NULL,
    enemies TEXT NOT NULL, -- JSON array
    result TEXT NOT NULL CHECK(result IN ('victory', 'defeat', 'fled')),
    rounds INTEGER NOT NULL,
    damage_dealt INTEGER DEFAULT 0,
    damage_taken INTEGER DEFAULT 0,
    timestamp INTEGER NOT NULL,
    FOREIGN KEY (character_id) REFERENCES player_characters(id) ON DELETE CASCADE
);

-- Indexes for performance (NEW: covers all heavy queries)
CREATE INDEX idx_inventory_character ON inventory_items(character_id);
CREATE INDEX idx_inventory_item_id ON inventory_items(item_id);
CREATE INDEX idx_quest_character ON quest_progress(character_id);
CREATE INDEX idx_quest_quest_id ON quest_progress(quest_id);
CREATE INDEX idx_quest_status ON quest_progress(status);
CREATE INDEX idx_npc_character ON npc_relationships(character_id);
CREATE INDEX idx_npc_npc_id ON npc_relationships(npc_id);
CREATE INDEX idx_dialogue_character ON dialogue_history(character_id);
CREATE INDEX idx_dialogue_npc ON dialogue_history(npc_id);
CREATE INDEX idx_achievements_character ON achievements(character_id);
CREATE INDEX idx_game_states_character ON game_states(character_id); -- NEW (10x faster save/load)
CREATE INDEX idx_save_slots_character ON save_slots(character_id);
```

---

## 5. State Management Architecture

### 5.1 Zustand Store Structure

```typescript
// Main game store
interface GameStore {
  // Current state
  currentScenario: Scenario | null;
  currentLocation: string;
  currentAct: number;
  
  // Loading states
  loading: boolean;
  error: string | null;
  
  // Actions
  loadScenario: (scenarioId: string) => Promise<void>;
  processChoice: (choiceId: string) => void;
  updateFlags: (flags: Record<string, boolean>) => void;
  updateCounters: (counters: Record<string, number>) => void;
  
  // DLC management
  activeDLCs: string[];
  loadDLC: (dlcId: string) => Promise<void>;
}

// Character store
interface CharacterStore {
  player: PlayerCharacter | null;
  
  // Actions
  createCharacter: (name: string) => void;
  loadCharacter: (id: string) => Promise<void>;
  updateStats: (stats: Partial<PlayerCharacter['stats']>) => void;
  levelUp: () => void;
  addExperience: (amount: number) => void;
  equipItem: (itemId: string, slot: EquipmentSlot) => void;
  unequipItem: (slot: EquipmentSlot) => void;
  addItem: (item: Item, quantity: number) => void;
  removeItem: (itemId: string, quantity: number) => void;
  learnSpell: (spellId: string) => void;
}

// Combat store
interface CombatStore {
  combatState: CombatState | null;
  
  // Actions
  initiateCombat: (enemies: Enemy[]) => void;
  processTurn: (action: CombatAction) => void;
  endCombat: (outcome: CombatOutcome) => void;
  applyDamage: (targetId: string, amount: number) => void;
  applyStatusEffect: (targetId: string, effect: StatusEffect) => void;
  clearCombat: () => void;
}

// Quest store
interface QuestStore {
  activeQuests: QuestProgress[];
  completedQuests: string[];
  failedQuests: string[];
  
  // Actions
  startQuest: (questId: string) => void;
  updateObjective: (questId: string, objectiveId: string, progress: number) => void;
  completeQuest: (questId: string) => void;
  failQuest: (questId: string) => void;
  getQuestProgress: (questId: string) => QuestProgress | undefined;
}

// NPC store
interface NPCStore {
  relationships: Record<string, number>;
  metNPCs: string[];
  recruitedCompanions: string[];
  
  // Actions
  updateAffinity: (npcId: string, change: number) => void;
  markAsMet: (npcId: string) => void;
  recruitCompanion: (npcId: string) => void;
  dismissCompanion: (npcId: string) => void;
}

// UI store
interface UIStore {
  // Modal states
  settingsOpen: boolean;
  inventoryOpen: boolean;
  characterSheetOpen: boolean;
  mapOpen: boolean;
  
  // Notifications
  notifications: Notification[];
  
  // Actions
  openModal: (modal: string) => void;
  closeModal: (modal: string) => void;
  addNotification: (notification: Notification) => void;
  clearNotifications: () => void;
}
```

### 5.2 Store Implementation Example

```typescript
import create from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// Game store with persistence
export const useGameStore = create<GameStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        currentScenario: null,
        currentLocation: 'kamenitsa',
        currentAct: 1,
        loading: false,
        error: null,
        activeDLCs: [],
        
        loadScenario: async (scenarioId: string) => {
          set({ loading: true, error: null });
          try {
            const scenario = await ScenarioLoader.load(scenarioId);
            set({ currentScenario: scenario, loading: false });
          } catch (error) {
            set({ error: error.message, loading: false });
          }
        },
        
        processChoice: (choiceId: string) => {
          const scenario = get().currentScenario;
          if (!scenario) return;
          
          const choice = scenario.choices.find(c => c.id === choiceId);
          if (!choice) return;
          
          // Apply consequences
          choice.consequences.forEach(consequence => {
            applyConsequence(consequence);
          });
          
          // Load next scenario
          if (choice.nextScenario) {
            get().loadScenario(choice.nextScenario);
          }
        },
        
        updateFlags: (flags) => set((state) => {
          Object.assign(state.flags, flags);
        }),
        
        updateCounters: (counters) => set((state) => {
          Object.assign(state.counters, counters);
        }),
        
        loadDLC: async (dlcId: string) => {
          // Load DLC content
          await DLCLoader.load(dlcId);
          set((state) => {
            state.activeDLCs.push(dlcId);
          });
        },
      })),
      {
        name: 'game-storage',
        getStorage: () => AsyncStorage, // Use MMKV for better performance
      }
    )
  )
);
```

### 5.3 State Persistence Strategy

```typescript
// Save game service
class SaveGameService {
  async saveToSlot(slot: number): Promise<void> {
    // 1. Gather state from all stores
    const gameState = useGameStore.getState();
    const characterState = useCharacterStore.getState();
    const questState = useQuestStore.getState();
    const npcState = useNPCStore.getState();
    
    // 2. Create save snapshot
    const snapshot: SaveSnapshot = {
      version: APP_VERSION,
      timestamp: Date.now(),
      playtime: getPlaytime(),
      gameState,
      characterState,
      questState,
      npcState,
    };
    
    // 3. Persist to SQLite
    await db.executeSql(
      'INSERT OR REPLACE INTO save_slots (slot_number, character_id, save_name, playtime, timestamp, state_snapshot) VALUES (?, ?, ?, ?, ?, ?)',
      [slot, characterState.player.id, characterState.player.name, snapshot.playtime, snapshot.timestamp, JSON.stringify(snapshot)]
    );
    
    // 4. Also save to AsyncStorage as backup
    await AsyncStorage.setItem(`save_${slot}`, JSON.stringify(snapshot));
  }
  
  async loadFromSlot(slot: number): Promise<void> {
    // 1. Load from SQLite
    const result = await db.executeSql(
      'SELECT state_snapshot FROM save_slots WHERE slot_number = ?',
      [slot]
    );
    
    if (result.rows.length === 0) {
      throw new Error('Save slot is empty');
    }
    
    const snapshot: SaveSnapshot = JSON.parse(result.rows.item(0).state_snapshot);
    
    // 2. Validate version compatibility
    if (!isVersionCompatible(snapshot.version)) {
      snapshot = await migrateSave(snapshot);
    }
    
    // 3. Restore state to all stores
    useGameStore.setState(snapshot.gameState);
    useCharacterStore.setState(snapshot.characterState);
    useQuestStore.setState(snapshot.questState);
    useNPCStore.setState(snapshot.npcState);
  }
  
  async autoSave(): Promise<void> {
    // Auto-save to special slot 0
    await this.saveToSlot(0);
  }
}
```

---

## 6. Game Engine Architecture

### 6.1 Scenario Engine

```typescript
class ScenarioEngine {
  private contentLoader: ContentLoader;
  private conditionEvaluator: ConditionEvaluator;
  private consequenceApplicator: ConsequenceApplicator;
  
  async loadScenario(scenarioId: string): Promise<Scenario> {
    // 1. Load scenario data
    const scenarioData = await this.contentLoader.loadScenario(scenarioId);
    
    // 2. Parse markdown content
    const parsedScenario = this.parseScenario(scenarioData);
    
    // 3. Evaluate conditions for choices
    const availableChoices = parsedScenario.choices.filter(choice => 
      this.conditionEvaluator.evaluate(choice.conditions)
    );
    
    // 4. Substitute variables in narrative
    const interpolatedNarrative = this.interpolateVariables(parsedScenario.narrative);
    
    return {
      ...parsedScenario,
      narrative: interpolatedNarrative,
      choices: availableChoices,
    };
  }
  
  processChoice(choice: Choice): void {
    // 1. Perform skill checks
    const skillCheckResults = choice.skillChecks.map(check => 
      this.performSkillCheck(check)
    );
    
    // 2. Apply consequences based on results
    skillCheckResults.forEach(result => {
      const consequences = result.success ? result.check.onSuccess : result.check.onFailure;
      consequences.forEach(consequence => 
        this.consequenceApplicator.apply(consequence)
      );
    });
    
    // 3. Apply choice consequences
    choice.consequences.forEach(consequence => 
      this.consequenceApplicator.apply(consequence)
    );
    
    // 4. Record choice in history
    this.recordChoice(choice);
    
    // 5. Navigate to next scenario
    if (choice.nextScenario) {
      this.loadScenario(choice.nextScenario);
    }
  }
  
  private performSkillCheck(check: SkillCheck): SkillCheckResult {
    const player = useCharacterStore.getState().player;
    const skillValue = this.getNestedValue(player, check.skill);
    
    // Roll d20 + skill value
    const roll = Math.floor(Math.random() * 20) + 1;
    const total = roll + skillValue;
    
    return {
      check,
      roll,
      total,
      success: total >= check.dc,
    };
  }
  
  private interpolateVariables(text: string): string {
    const player = useCharacterStore.getState().player;
    const gameState = useGameStore.getState();
    
    return text
      .replace(/\{player\.name\}/g, player.name)
      .replace(/\{player\.level\}/g, String(player.level))
      .replace(/\{location\}/g, gameState.currentLocation)
      // ... more replacements
  }
}
```

### 6.2 Combat Engine

```typescript
class CombatEngine {
  initiateCombat(enemies: Enemy[], companions: Companion[] = []): CombatState {
    // 1. Create combatants
    const player = this.createPlayerCombatant();
    const companionCombatants = companions.map(c => this.createCompanionCombatant(c));
    const enemyCombatants = enemies.map(e => this.createEnemyCombatant(e));
    
    // 2. Calculate initiative order
    const allCombatants = [player, ...companionCombatants, ...enemyCombatants];
    const turnOrder = this.calculateInitiative(allCombatants);
    
    // 3. Create combat state
    const combatState: CombatState = {
      active: true,
      roundNumber: 1,
      turnOrder,
      currentTurn: turnOrder[0],
      player,
      companions: companionCombatants,
      enemies: enemyCombatants,
      combatLog: [],
      battleConditions: this.determineBattleConditions(),
    };
    
    // 4. Store in combat store
    useCombatStore.setState({ combatState });
    
    return combatState;
  }
  
  processTurn(action: CombatAction): CombatResult {
    const state = useCombatStore.getState().combatState!;
    const actor = this.getCombatant(state, state.currentTurn);
    
    let result: CombatResult;
    
    switch (action.type) {
      case 'attack':
        result = this.processAttack(actor, action.target);
        break;
      case 'spell':
        result = this.processSpell(actor, action.spellId, action.target);
        break;
      case 'item':
        result = this.processItemUse(actor, action.itemId, action.target);
        break;
      case 'defend':
        result = this.processDefend(actor);
        break;
      case 'flee':
        result = this.processFlee(actor);
        break;
    }
    
    // Add to combat log
    this.addToCombatLog(result);
    
    // Check victory conditions
    const outcome = this.checkVictoryConditions(state);
    if (outcome) {
      this.endCombat(outcome);
      return result;
    }
    
    // Process status effects
    this.processStatusEffects(state);
    
    // Advance turn
    this.advanceTurn(state);
    
    // Process AI turns if needed
    if (this.isAITurn(state)) {
      this.processAITurn(state);
    }
    
    return result;
  }
  
  private processAttack(attacker: Combatant, target: Combatant): CombatResult {
    // d20 roll with explicit critical windows (per CORRECTIONS bundle)
    const roll = Math.floor(Math.random() * 20) + 1;

    if (roll === 20) {
      const critDamage = this.calculateBaseDamage(attacker) * 2;
      this.applyDamage(target, critDamage);
      return {
        type: 'hit',
        attacker: attacker.id,
        target: target.id,
        damage: critDamage,
        critical: true,
        message: 'Critical hit!',
      };
    }

    if (roll === 1) {
      return {
        type: 'miss',
        attacker: attacker.id,
        target: target.id,
        criticalMiss: true,
        message: 'Critical miss!',
        penalty: this.rollCriticalMissPenalty(),
      };
    }

    const attackRoll = roll + attacker.attackBonus;
    const hits = attackRoll >= target.armorClass;

    if (!hits) {
      return { type: 'miss', attacker: attacker.id, target: target.id };
    }

    const baseDamage = this.calculateBaseDamage(attacker);
    const mitigated = Math.max(0, baseDamage - target.armor);
    this.applyDamage(target, mitigated);

    return {
      type: 'hit',
      attacker: attacker.id,
      target: target.id,
      damage: mitigated,
      critical: false,
    };
  }

  private rollCriticalMissPenalty(): CriticalMissPenalty | null {
    const chance = Math.random();
    if (chance < 0.3) {
      return { type: 'debuff', effect: 'shaken', duration: 1 };
    }
    if (chance < 0.5) {
      return { type: 'stun', duration: 1 };
    }
    return null; // no extra penalty
  }
  
  private checkVictoryConditions(state: CombatState): CombatOutcome | null {
    // Check if all enemies defeated
    if (state.enemies.every(e => e.health <= 0)) {
      return {
        result: 'victory',
        experience: this.calculateExperience(state.enemies),
        gold: this.calculateGold(state.enemies),
        loot: this.generateLoot(state.enemies),
      };
    }
    
    // Check if player defeated
    if (state.player.health <= 0) {
      return {
        result: 'defeat',
      };
    }
    
    return null;
  }
}
```

### 6.3 Content Loader

```typescript
class ContentLoader {
  private cache: Map<string, any> = new Map();
  
  async loadScenario(scenarioId: string): Promise<ScenarioData> {
    // Check cache first
    if (this.cache.has(`scenario_${scenarioId}`)) {
      return this.cache.get(`scenario_${scenarioId}`);
    }
    
    // Determine source file
    const filePath = this.resolveScenarioPath(scenarioId);
    
    // Load from bundled assets
    const scenarioData = await this.loadAsset(filePath);
    
    // Parse markdown
    const parsed = this.parseMarkdown(scenarioData);
    
    // Cache for future use
    this.cache.set(`scenario_${scenarioId}`, parsed);
    
    return parsed;
  }
  
  async loadQuest(questId: string): Promise<Quest> {
    if (this.cache.has(`quest_${questId}`)) {
      return this.cache.get(`quest_${questId}`);
    }
    
    const questData = await this.loadAsset(`data/quests/${questId}.json`);
    this.cache.set(`quest_${questId}`, questData);
    
    return questData;
  }
  
  async loadItem(itemId: string): Promise<Item> {
    if (this.cache.has(`item_${itemId}`)) {
      return this.cache.get(`item_${itemId}`);
    }
    
    const itemData = await this.loadAsset(`data/items/${itemId}.json`);
    this.cache.set(`item_${itemId}`, itemData);
    
    return itemData;
  }
  
  private async loadAsset(path: string): Promise<any> {
    // In React Native, use require for static assets
    // Or use fetch for dynamically loaded content
    try {
      const asset = require(`../../assets/game/${path}`);
      return asset;
    } catch (error) {
      console.error(`Failed to load asset: ${path}`, error);
      throw error;
    }
  }
  
  private parseMarkdown(markdown: string): ScenarioData {
    // Parse markdown into structured data
    // Extract title, narrative, choices, etc.
    // This would use a markdown parser library
    return {
      // ... parsed data
    };
  }
  
  clearCache(): void {
    this.cache.clear();
  }
}
```

---

## 7. DLC Architecture

### 7.1 DLC Module Structure

```
/dlc
├── belintash-crack/
│   ├── index.ts              # DLC entry point
│   ├── config.json           # DLC metadata
│   ├── scenarios/            # DLC scenarios
│   │   ├── bc-01-stabilize.md
│   │   ├── bc-02-rescue.md
│   │   └── bc-03-shattered-vision.md
│   ├── quests/               # DLC quests
│   │   └── quests.json
│   ├── items/                # DLC items
│   │   └── items.json
│   ├── capabilities.json     # DLC-specific mechanics
│   └── assets/               # DLC assets
│       └── images/
├── next-guardians/
│   └── ... (same structure)
├── balkan-trail/
│   └── ... (same structure)
└── laut-stronghold/
    └── ... (same structure)
```

### 7.2 DLC Loading System

```typescript
interface DLCConfig {
  id: string;
  title: string;
  version: string;
  description: string;
  requiredBaseVersion: string;
  unlockCondition: string; // Flag or condition
  capabilities: string[];  // New mechanics
  content: {
    scenarios: string[];
    quests: string[];
    items: string[];
    npcs: string[];
  };
}

class DLCManager {
  private loadedDLCs: Map<string, DLCModule> = new Map();
  
  async loadDLC(dlcId: string): Promise<void> {
    // 1. Check if already loaded
    if (this.loadedDLCs.has(dlcId)) {
      return;
    }
    
    // 2. Load DLC config
    const config = await this.loadDLCConfig(dlcId);
    
    // 3. Validate base version compatibility
    if (!this.isVersionCompatible(config.requiredBaseVersion)) {
      throw new Error(`DLC ${dlcId} requires base game version ${config.requiredBaseVersion}`);
    }
    
    // 4. Check unlock condition
    if (!this.checkUnlockCondition(config.unlockCondition)) {
      throw new Error(`DLC ${dlcId} unlock condition not met`);
    }
    
    // 5. Load DLC content
    const module = await this.loadDLCModule(dlcId);
    
    // 6. Register DLC content
    this.registerDLCContent(dlcId, module);
    
    // 7. Initialize DLC state
    this.initializeDLCState(dlcId, config);
    
    // 8. Cache loaded DLC
    this.loadedDLCs.set(dlcId, module);
    
    // 9. Update game state
    useGameStore.getState().activeDLCs.push(dlcId);
  }
  
  async unloadDLC(dlcId: string): Promise<void> {
    // 1. Check if loaded
    if (!this.loadedDLCs.has(dlcId)) {
      return;
    }
    
    // 2. Unregister content
    this.unregisterDLCContent(dlcId);
    
    // 3. Clean up state
    this.cleanupDLCState(dlcId);
    
    // 4. Remove from loaded DLCs
    this.loadedDLCs.delete(dlcId);
    
    // 5. Update game state
    const activeDLCs = useGameStore.getState().activeDLCs;
    useGameStore.setState({
      activeDLCs: activeDLCs.filter(id => id !== dlcId)
    });
  }
  
  private registerDLCContent(dlcId: string, module: DLCModule): void {
    // Register scenarios
    module.scenarios.forEach(scenario => {
      ScenarioRegistry.register(scenario.id, scenario);
    });
    
    // Register quests
    module.quests.forEach(quest => {
      QuestRegistry.register(quest.id, quest);
    });
    
    // Register items
    module.items.forEach(item => {
      ItemRegistry.register(item.id, item);
    });
    
    // Register NPCs
    module.npcs.forEach(npc => {
      NPCRegistry.register(npc.id, npc);
    });
  }
  
  isDLCActive(dlcId: string): boolean {
    return this.loadedDLCs.has(dlcId);
  }
  
  getActiveDLCs(): string[] {
    return Array.from(this.loadedDLCs.keys());
  }
}
```

### 7.3 DLC State Management

```typescript
// DLC state is namespaced within main game state
interface DLCState {
  [dlcId: string]: {
    enabled: boolean;
    progress: DLCProgress;
    capabilities: Record<string, any>; // DLC-specific mechanics
    unlocks: string[];
  };
}

// Example: Belintash Crack DLC state
interface BelintashCrackState {
  collapse_stage: number;       // 0-4
  rescued_archivists: number;
  support_nodes: string[];
  hazard_timer: 'stable' | 'spike' | 'critical';
}

// DLC state is stored in main game state
interface GameState {
  // ... other state
  dlcState: {
    'belintash-crack'?: BelintashCrackState;
    'next-guardians'?: NextGuardiansState;
    'balkan-trail'?: BalkanTrailState;
    'laut-stronghold'?: LautStrongholdState;
  };
}
```

### 7.4 DLC Purchase & Unlock Flow

```typescript
class DLCPurchaseManager {
  async purchaseDLC(dlcId: string): Promise<PurchaseResult> {
    // 1. Check if already purchased
    if (await this.isDLCPurchased(dlcId)) {
      return { success: true, alreadyOwned: true };
    }
    
    // 2. Initiate platform purchase
    // iOS: In-App Purchase
    // Android: Google Play Billing
    const purchase = await this.platformPurchase(dlcId);
    
    if (!purchase.success) {
      return { success: false, error: purchase.error };
    }
    
    // 3. Verify purchase with receipt validation
    const verified = await this.verifyPurchase(purchase.receipt);
    
    if (!verified) {
      return { success: false, error: 'Purchase verification failed' };
    }
    
    // 4. Store purchase locally
    await this.storePurchase(dlcId, purchase.receipt);
    
    // 5. Unlock DLC content
    await this.unlockDLC(dlcId);
    
    return { success: true };
  }
  
  private ensureBaseVersionCompatibility(config: DLCConfig): void {
    // Semver validation – prevents loading DLC on incompatible builds
    if (!semver.satisfies(APP_VERSION, config.requiredBaseVersion)) {
      throw new Error(
        `DLC ${config.id} requires base version ${config.requiredBaseVersion}, current ${APP_VERSION}`
      );
    }
  }

  private async platformPurchase(dlcId: string): Promise<any> {
    // Use expo-in-app-purchases or similar library
    // Platform-specific implementation
  }
  
  private async unlockDLC(dlcId: string): Promise<void> {
    const config = await DLCManager.getConfig(dlcId);
    this.ensureBaseVersionCompatibility(config);
    
    // Mark DLC as purchased/unlocked
    await AsyncStorage.setItem(`dlc_${dlcId}_purchased`, 'true');
    
    // Load DLC content
    await DLCManager.loadDLC(dlcId);
    
    // Show unlock notification
    useUIStore.getState().addNotification({
      type: 'success',
      title: 'DLC Unlocked!',
      message: `${dlcId} is now available.`,
    });
  }
  
  async restorePurchases(): Promise<void> {
    // Restore all purchased DLCs
    // Used when reinstalling app
    const purchases = await this.getPlatformPurchases();
    
    for (const purchase of purchases) {
      await this.storePurchase(purchase.dlcId, purchase.receipt);
      await this.unlockDLC(purchase.dlcId);
    }
  }
}
```

---

## 8. Performance Optimization

### 8.1 Rendering Optimization

```typescript
// Use React.memo for expensive components
const ScenarioDisplay = React.memo(({ scenario }: Props) => {
  return (
    <ScrollView>
      <Text>{scenario.narrative}</Text>
    </ScrollView>
  );
}, (prevProps, nextProps) => {
  // Custom comparison
  return prevProps.scenario.id === nextProps.scenario.id;
});

// Use useMemo for expensive computations
const CharacterSheet = ({ character }: Props) => {
  const totalAttributes = useMemo(() => {
    return Object.values(character.attributes).reduce((sum, val) => sum + val, 0);
  }, [character.attributes]);
  
  // ... render
};

// Use useCallback for event handlers
const GameScreen = () => {
  const handleChoice = useCallback((choiceId: string) => {
    processChoice(choiceId);
  }, []);
  
  // ... render
};
```

### 8.2 List Optimization

```typescript
// Use FlatList with performance optimizations
const InventoryGrid = ({ items }: Props) => {
  return (
    <FlatList
      data={items}
      renderItem={({ item }) => <ItemCard item={item} />}
      keyExtractor={(item) => item.id}
      // Performance optimizations
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      initialNumToRender={10}
      windowSize={5}
      getItemLayout={(data, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
      })}
    />
  );
};
```

### 8.3 Image Optimization

```typescript
// Use FastImage for better performance
import FastImage from 'react-native-fast-image';

const CharacterPortrait = ({ uri }: Props) => {
  return (
    <FastImage
      source={{ uri, priority: FastImage.priority.high }}
      style={styles.portrait}
      resizeMode={FastImage.resizeMode.contain}
    />
  );
};

// Preload critical images
useEffect(() => {
  FastImage.preload([
    { uri: 'portrait1.png' },
    { uri: 'portrait2.png' },
  ]);
}, []);
```

### 8.4 State Optimization

```typescript
// Use selectors to prevent unnecessary re-renders
const usePlayerHealth = () => {
  return useCharacterStore(state => state.player?.stats.health);
};

// Instead of:
// const player = useCharacterStore(state => state.player);
// (This would re-render on ANY player change)

// Split stores to reduce update scope
// Instead of one big store, use multiple focused stores
// gameStore, characterStore, combatStore, etc.
```

### 8.5 Bundle Size Optimization

```typescript
// Code splitting for DLC
const DLCModule = lazy(() => import('./dlc/belintash-crack'));

// Lazy load heavy libraries
const ChartLibrary = lazy(() => import('react-native-chart-kit'));

// Remove unused imports
// Use tree-shaking
// Analyze bundle with:
// npx react-native-bundle-visualizer
```

---

## 9. Security & Data Integrity

### 9.1 Save Data Protection

```typescript
class SaveDataProtection {
  // Basic obfuscation (not encryption, this is single-player)
  obfuscate(data: string): string {
    // Simple base64 + salt
    const salt = 'golden_chariot_2026';
    const combined = salt + data;
    return Buffer.from(combined).toString('base64');
  }
  
  deobfuscate(obfuscatedData: string): string {
    const salt = 'golden_chariot_2026';
    const decoded = Buffer.from(obfuscatedData, 'base64').toString('utf-8');
    return decoded.substring(salt.length);
  }
  
  // Checksum validation
  generateChecksum(data: string): string {
    // Simple checksum for data integrity
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }
  
  validateChecksum(data: string, checksum: string): boolean {
    return this.generateChecksum(data) === checksum;
  }
}

// Usage in save system
async function saveGame(slot: number) {
  const snapshot = createSaveSnapshot();
  const serialized = JSON.stringify(snapshot);
  
  // Obfuscate and add checksum
  const obfuscated = SaveDataProtection.obfuscate(serialized);
  const checksum = SaveDataProtection.generateChecksum(serialized);
  
  const saveData = {
    data: obfuscated,
    checksum,
    version: APP_VERSION,
  };
  
  await AsyncStorage.setItem(`save_${slot}`, JSON.stringify(saveData));
}
```

### 9.2 Content Integrity

```typescript
// Validate scenario data structure
function validateScenario(scenario: any): scenario is Scenario {
  return (
    typeof scenario.id === 'string' &&
    typeof scenario.title === 'string' &&
    Array.isArray(scenario.choices) &&
    scenario.choices.every(isValidChoice)
  );
}

// Runtime validation
const scenario = await ContentLoader.loadScenario(scenarioId);
if (!validateScenario(scenario)) {
  console.error('Invalid scenario data:', scenarioId);
  throw new Error('Corrupted scenario data');
}
```

### 9.3 Version Migration

```typescript
class SaveMigrationService {
  async migrate(save: SaveSnapshot, fromVersion: string, toVersion: string): Promise<SaveSnapshot> {
    // Migration chain
    const migrations = this.getMigrationChain(fromVersion, toVersion);
    
    let currentSave = save;
    for (const migration of migrations) {
      currentSave = await migration(currentSave);
    }
    
    currentSave.version = toVersion;
    return currentSave;
  }
  
  private getMigrationChain(from: string, to: string): Migration[] {
    // Return ordered list of migrations
    // Example: 1.0.0 -> 1.1.0 -> 1.2.0
    return [
      this.migration_1_0_to_1_1,
      this.migration_1_1_to_1_2,
    ];
  }
  
  private migration_1_0_to_1_1(save: SaveSnapshot): SaveSnapshot {
    // Add new fields with defaults
    return {
      ...save,
      dlcState: {},
      // ... other new fields
    };
  }
}
```

---

## 10. Deployment & Distribution

### 10.1 Build Configuration

```typescript
// app.json - Expo configuration
{
  "expo": {
    "name": "The Golden Chariot of Belintash",
    "slug": "golden-chariot-belintash",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#1a1a1a"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.studio.goldenchariot",
      "buildNumber": "1"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#1a1a1a"
      },
      "package": "com.studio.goldenchariot",
      "versionCode": 1
    },
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
```

### 10.2 EAS Build Configuration

```json
// eas.json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "simulator": true
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      },
      "ios": {
        "simulator": false
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABCD1234"
      },
      "android": {
        "serviceAccountKeyPath": "./path/to/service-account.json",
        "track": "production"
      }
    }
  }
}
```

### 10.3 Over-The-Air (OTA) Updates

```typescript
// Update service using EAS Update
class UpdateService {
  async checkForUpdates(): Promise<void> {
    try {
      const update = await Updates.checkForUpdateAsync();
      
      if (update.isAvailable) {
        // Show update notification
        await this.promptUpdate();
        
        // Fetch and load update
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (error) {
      console.error('Update check failed:', error);
    }
  }
  
  private async promptUpdate(): Promise<void> {
    return new Promise((resolve) => {
      Alert.alert(
        'Update Available',
        'A new version is available. Update now?',
        [
          { text: 'Later', onPress: () => resolve(), style: 'cancel' },
          { text: 'Update', onPress: () => resolve() },
        ]
      );
    });
  }
}
```

### 10.4 Analytics & Error Tracking (Optional)

```typescript
// If analytics needed (while respecting privacy)
// Use Sentry for error tracking only
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'your-sentry-dsn',
  enableInExpoDevelopment: false,
  debug: __DEV__,
  // Minimal data collection
  beforeSend(event) {
    // Strip personal data
    delete event.user;
    return event;
  },
});

// Track critical errors only
try {
  // ... game logic
} catch (error) {
  Sentry.captureException(error);
  throw error;
}
```

---

## 11. Testing Strategy

### 11.1 Unit Testing

```typescript
// Example: Combat system tests
describe('CombatEngine', () => {
  let engine: CombatEngine;
  
  beforeEach(() => {
    engine = new CombatEngine();
  });
  
  test('initiate combat creates valid state', () => {
    const enemies = [createTestEnemy()];
    const state = engine.initiateCombat(enemies);
    
    expect(state.active).toBe(true);
    expect(state.roundNumber).toBe(1);
    expect(state.enemies).toHaveLength(1);
  });
  
  test('attack calculates damage correctly', () => {
    const attacker = createTestCombatant({ strength: 10 });
    const defender = createTestCombatant({ armor: 5 });
    
    const result = engine.processAttack(attacker, defender);
    
    expect(result.damage).toBeGreaterThan(0);
  });
  
  test('victory condition triggers correctly', () => {
    const state = createTestCombatState();
    // Set all enemies to 0 health
    state.enemies.forEach(e => e.health = 0);
    
    const outcome = engine.checkVictoryConditions(state);
    
    expect(outcome?.result).toBe('victory');
  });
});
```

### 11.2 Integration Testing

```typescript
// Example: Save/load integration test
describe('Save System Integration', () => {
  test('save and load preserves game state', async () => {
    // Create test game state
    const originalState = createTestGameState();
    useGameStore.setState(originalState);
    
    // Save to slot 1
    await SaveGameService.saveToSlot(1);
    
    // Clear state
    useGameStore.setState(createEmptyGameState());
    
    // Load from slot 1
    await SaveGameService.loadFromSlot(1);
    
    // Verify state restored
    const restoredState = useGameStore.getState();
    expect(restoredState).toEqual(originalState);
  });
});
```

### 11.3 E2E Testing (Optional)

```typescript
// Example: Detox E2E test
describe('Game Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });
  
  it('should complete prologue', async () => {
    // Start new game
    await element(by.text('New Game')).tap();
    
    // Enter character name
    await element(by.id('character-name-input')).typeText('Test Hero');
    await element(by.text('Start Adventure')).tap();
    
    // Make first choice
    await element(by.id('choice-a')).tap();
    
    // Verify next scenario loads
    await expect(element(by.id('scenario-display'))).toBeVisible();
  });
});
```

---

## 12. Appendices

### Appendix A: Folder Structure

```
golden-chariot-belintash/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   ├── game/
│   │   └── screens/
│   ├── game/
│   │   ├── engine/
│   │   │   ├── ScenarioEngine.ts
│   │   │   ├── CombatEngine.ts
│   │   │   ├── MagicSystem.ts
│   │   │   ├── EconomySystem.ts
│   │   │   └── QuestSystem.ts
│   │   ├── data/
│   │   │   ├── scenarios/
│   │   │   ├── quests/
│   │   │   ├── items/
│   │   │   ├── npcs/
│   │   │   └── enemies/
│   │   └── types/
│   │       ├── models.ts
│   │       ├── enums.ts
│   │       └── interfaces.ts
│   ├── store/
│   │   ├── gameStore.ts
│   │   ├── characterStore.ts
│   │   ├── combatStore.ts
│   │   ├── questStore.ts
│   │   ├── npcStore.ts
│   │   └── uiStore.ts
│   ├── services/
│   │   ├── SaveGameService.ts
│   │   ├── ContentLoader.ts
│   │   ├── DLCManager.ts
│   │   └── StorageService.ts
│   ├── navigation/
│   │   ├── RootNavigator.tsx
│   │   ├── MainNavigator.tsx
│   │   └── types.ts
│   ├── utils/
│   │   ├── helpers.ts
│   │   ├── constants.ts
│   │   └── validators.ts
│   ├── assets/
│   │   ├── images/
│   │   ├── fonts/
│   │   └── sounds/
│   └── dlc/
│       ├── belintash-crack/
│       ├── next-guardians/
│       ├── balkan-trail/
│       └── laut-stronghold/
├── App.tsx
├── app.json
├── eas.json
├── package.json
├── tsconfig.json
└── README.md
```

### Appendix B: Technology Versions

```json
{
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.73.0",
    "expo": "~50.0.0",
    "typescript": "^5.3.0",
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/stack": "^6.3.0",
    "zustand": "^4.4.0",
    "@react-native-async-storage/async-storage": "^1.21.0",
    "expo-sqlite": "~13.0.0",
    "react-native-mmkv": "^2.11.0",
    "react-native-fast-image": "^8.6.0"
  }
}
```

### Appendix C: Performance Targets

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Cold Start Time | < 3s | Time to interactive |
| Scenario Load | < 0.5s | Scene transition |
| Combat Turn | < 0.1s | Action processing |
| Save Operation | < 2s | Write completion |
| Load Operation | < 2s | State restoration |
| FPS (UI) | 60 FPS | React DevTools |
| Memory Usage | < 250MB | XCode Instruments / Android Profiler |
| Battery Drain | < 10%/hour | Device metrics |
| Bundle Size | < 300MB base | APK/IPA size |
| DLC Size | < 50MB each | Individual packages |

---

**END OF ARCHITECTURE DOCUMENT**

**Next Steps:**
- Architecture Review & Approval
- Epic Breakdown
- Story Creation (BMAD Method)
- Implementation Planning with Windsurf

**Document Status:** Ready for BMAD Implementation Phase
