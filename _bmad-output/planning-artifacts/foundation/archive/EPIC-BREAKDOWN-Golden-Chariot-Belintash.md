Archived after Implementation Readiness Step 5 (2026‑01‑16)

# Epic Breakdown & User Stories
## The Golden Chariot of Belintash

**Version:** 1.0  
**Date:** January 12, 2026  
**Document Owner:** Product & Development Team  
**Status:** Draft for BMAD Implementation  
**Related Documents:** PRD v1.0, Architecture v1.0

---

## Executive Summary

This document provides a complete breakdown of **The Golden Chariot of Belintash** project into **28 Epics** and **145 User Stories**. The stories are organized to support an **Enterprise BMAD track** with an estimated **6-9 month development timeline** across **18-24 sprints**.

### Story Distribution

| Category | Epics | Stories | Estimated Effort (SP) |
|----------|-------|---------|----------------------|
| Foundation | 5 | 25 | 98 |
| Game Systems | 10 | 65 | 287 |
| Content Creation | 5 | 25 | 105 |
| DLC Modules | 4 | 16 | 72 |
| Polish & Release | 4 | 14 | 58 |
| **TOTAL** | **28** | **145** | **620 SP** |

**Velocity Assumptions:** 30-35 SP per 2-week sprint = ~18-24 sprints (~9-12 months, incl. buffer)

---

## Table of Contents

1. [Foundation Epics (1-5)](#foundation-epics)
2. [Game Systems Epics (6-15)](#game-systems-epics)
3. [Content Creation Epics (16-20)](#content-creation-epics)
4. [DLC Modules Epics (21-24)](#dlc-modules-epics)
5. [Polish & Release Epics (25-28)](#polish-release-epics)
6. [Dependency Map](#dependency-map)
7. [Sprint Planning Recommendations](#sprint-planning)
8. [Critical Path Analysis](#critical-path)

---

# Foundation Epics

## Epic 1: Project Setup & Infrastructure

**Priority:** Critical  
**Category:** Foundation  
**Estimated Effort:** 21 SP  
**Dependencies:** None  
**Sprint Target:** Sprint 1

### Description
Establish the foundational project structure, development environment, and CI/CD pipeline for the game.

### User Stories

#### Story 1.1: Initialize React Native Project
**Story Points:** 2  
**Priority:** Critical

**User Story:**
As a developer, I want a properly configured React Native + Expo project so that I can start development with a solid foundation.

**Acceptance Criteria:**
- [ ] Expo managed workflow initialized (SDK 50.x)
- [ ] TypeScript configured with strict mode
- [ ] Project structure follows architecture specifications
- [ ] Git repository initialized with .gitignore
- [ ] README.md with setup instructions created

**Technical Notes:**
- Use `expo init` with TypeScript template
- Configure tsconfig.json for strict type checking
- Setup folder structure per Architecture doc

**Dependencies:** None

---

#### Story 1.2: Configure Development Tools
**Story Points:** 3  
**Priority:** High

**User Story:**
As a developer, I want code quality tools configured so that I can maintain consistent code standards.

**Acceptance Criteria:**
- [ ] ESLint configured with React Native + TypeScript rules
- [ ] Prettier configured and integrated with ESLint
- [ ] Husky pre-commit hooks setup
- [ ] VS Code workspace settings created
- [ ] EditorConfig file created

**Technical Notes:**
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended"
  ]
}
```

**Dependencies:** Story 1.1

---

#### Story 1.3: Setup Testing Framework
**Story Points:** 3  
**Priority:** High

**User Story:**
As a developer, I want Jest and React Native Testing Library configured so that I can write unit and integration tests.

**Acceptance Criteria:**
- [ ] Jest configured for React Native
- [ ] @testing-library/react-native installed
- [ ] Test utilities and helpers created
- [ ] Example test written and passing
- [ ] Test coverage reporting configured

**Technical Notes:**
- Configure Jest preset for React Native
- Setup test file patterns (*.test.ts, *.spec.tsx)
- Coverage threshold: 70%

**Dependencies:** Story 1.1

---

#### Story 1.4: Configure Build System
**Story Points:** 5  
**Priority:** High

**User Story:**
As a developer, I want EAS Build configured so that I can create iOS and Android builds.

**Acceptance Criteria:**
- [ ] EAS CLI installed and authenticated
- [ ] eas.json configured for dev/preview/production
- [ ] iOS build profile created
- [ ] Android build profile created
- [ ] First successful build completed for both platforms

**Technical Notes:**
```json
// eas.json
{
  "build": {
    "development": { "developmentClient": true },
    "preview": { "distribution": "internal" },
    "production": {}
  }
}
```

**Dependencies:** Story 1.1

---

#### Story 1.5: Setup CI/CD Pipeline
**Story Points:** 5  
**Priority:** Medium

**User Story:**
As a developer, I want automated CI/CD so that tests run on every commit and builds are automated.

**Acceptance Criteria:**
- [ ] GitHub Actions workflow created
- [ ] Automated testing on PR
- [ ] Automated builds on merge to main
- [ ] Code quality checks automated
- [ ] Deployment to TestFlight/Play Store (internal) automated

**Technical Notes:**
- Use EAS Build GitHub Action
- Run tests before build
- Cache dependencies for faster builds

**Dependencies:** Story 1.3, Story 1.4

---

#### Story 1.6: Create Development Documentation
**Story Points:** 3  
**Priority:** Medium

**User Story:**
As a new developer, I want comprehensive setup documentation so that I can get started quickly.

**Acceptance Criteria:**
- [ ] CONTRIBUTING.md created
- [ ] Development setup guide written
- [ ] Code style guide documented
- [ ] Testing guidelines documented
- [ ] Troubleshooting section added

**Technical Notes:**
- Include platform-specific setup (iOS/Android)
- Document common issues and solutions
- Link to architecture and PRD documents

**Dependencies:** Story 1.1, Story 1.2, Story 1.3

---

## Epic 2: Core Game Engine

**Priority:** Critical  
**Category:** Foundation  
**Estimated Effort:** 34 SP  
**Dependencies:** Epic 1  
**Sprint Target:** Sprint 2-3

### Description
Implement the core game engine that powers scenario loading, choice processing, and state management.

### User Stories

#### Story 2.1: Create Game Engine Interface
**Story Points:** 3  
**Priority:** Critical

**User Story:**
As a developer, I want a well-defined game engine interface so that I can implement game mechanics consistently.

**Acceptance Criteria:**
- [ ] GameEngine interface defined with TypeScript
- [ ] Core methods specified: loadScenario, processChoice, evaluateConditions, applyConsequences
- [ ] State management methods defined
- [ ] Save/load methods declared
- [ ] Interface documented with JSDoc

**Technical Notes:**
```typescript
interface GameEngine {
  loadScenario(scenarioId: string): Promise<Scenario>;
  processChoice(choiceId: string): void;
  evaluateConditions(conditions: Condition[]): boolean;
  applyConsequences(consequences: Consequence[]): void;
}
```

**Dependencies:** Story 1.1

---

#### Story 2.2: Implement Scenario Loader
**Story Points:** 5  
**Priority:** Critical

**User Story:**
As a game engine, I want to load scenario files from assets so that I can display narrative content to players.

**Acceptance Criteria:**
- [ ] Scenario file format parser implemented (Markdown)
- [ ] Scenario cache system created
- [ ] File loading from bundled assets works
- [ ] Error handling for missing files
- [ ] Unit tests for loader (95%+ coverage)

**Technical Notes:**
- Support both .md and .json scenario formats
- Implement LRU cache for frequently accessed scenarios
- Validate scenario structure on load

**Dependencies:** Story 2.1

---

#### Story 2.3: Implement Condition Evaluator
**Story Points:** 5  
**Priority:** Critical

**User Story:**
As a game engine, I want to evaluate conditions so that I can determine which choices and content are available.

**Acceptance Criteria:**
- [ ] Support flag conditions (boolean checks)
- [ ] Support counter conditions (numeric comparisons)
- [ ] Support relationship conditions (NPC affinity)
- [ ] Support stat conditions (character attributes)
- [ ] Support item conditions (inventory checks)
- [ ] Support complex AND/OR logic
- [ ] Unit tests with 100% condition type coverage

**Technical Notes:**
```typescript
interface Condition {
  type: 'flag' | 'counter' | 'relationship' | 'stat' | 'item';
  target: string;
  operator: 'equals' | 'greater_than' | 'less_than';
  value: any;
}
```

**Dependencies:** Story 2.1

---

#### Story 2.4: Implement Consequence Applicator
**Story Points:** 5  
**Priority:** Critical

**User Story:**
As a game engine, I want to apply consequences of player choices so that the game state updates correctly.

**Acceptance Criteria:**
- [ ] Flag setting/updating implemented
- [ ] Counter addition/subtraction implemented
- [ ] Relationship changes applied
- [ ] Stat modifications work
- [ ] Item add/remove integrated with inventory
- [ ] Experience and gold changes processed
- [ ] Side effects (notifications, achievements) triggered
- [ ] Unit tests for all consequence types

**Technical Notes:**
- Consequences should be atomic transactions
- Support rollback for failed consequences
- Log all consequences for debugging

**Dependencies:** Story 2.1, Story 2.3

---

#### Story 2.5: Implement Variable Interpolation
**Story Points:** 3  
**Priority:** High

**User Story:**
As a game engine, I want to substitute variables in narrative text so that scenarios feel personalized.

**Acceptance Criteria:**
- [ ] Support {player.name} replacement
- [ ] Support {player.level} and other stats
- [ ] Support {location} for current location name
- [ ] Support {npc.name} for NPC references
- [ ] Support conditional text blocks
- [ ] Handle missing variables gracefully

**Technical Notes:**
```typescript
const interpolated = interpolate(
  "Welcome, {player.name}! You are in {location}.",
  { player, location }
);
```

**Dependencies:** Story 2.2

---

#### Story 2.6: Implement Choice Processing System
**Story Points:** 5  
**Priority:** Critical

**User Story:**
As a player, I want my choices to be processed correctly so that I see appropriate consequences and next scenarios.

**Acceptance Criteria:**
- [ ] Choice validation (available choices only)
- [ ] Skill check execution if required
- [ ] Consequence application on choice
- [ ] Navigation to next scenario
- [ ] Choice history recording
- [ ] Undo last choice (dev mode only)
- [ ] Integration tests for full choice flow

**Technical Notes:**
- Skill checks: d20 roll + skill value vs DC
- Support critical success/failure (nat 20/1)
- Record choice in dialogue history

**Dependencies:** Story 2.3, Story 2.4

---

#### Story 2.7: Create Scenario Cache System
**Story Points:** 3  
**Priority:** Medium

**User Story:**
As a developer, I want a caching system for scenarios so that frequently accessed content loads instantly.

**Acceptance Criteria:**
- [ ] LRU cache implementation
- [ ] Configurable cache size (default 50 scenarios)
- [ ] Cache hit/miss metrics
- [ ] Cache invalidation on content update
- [ ] Memory-efficient storage

**Technical Notes:**
- Cache key: scenarioId
- Evict least recently used when full
- Preload next scenarios in background

**Dependencies:** Story 2.2

---

#### Story 2.8: Create Game Engine Tests
**Story Points:** 5  
**Priority:** High

**User Story:**
As a developer, I want comprehensive tests for the game engine so that I can refactor confidently.

**Acceptance Criteria:**
- [ ] Unit tests for all engine components
- [ ] Integration tests for full scenario flow
- [ ] Test scenario files created
- [ ] Edge case tests (missing data, invalid choices)
- [ ] Performance tests (load times < 0.5s)
- [ ] 90%+ code coverage

**Technical Notes:**
- Use Jest for unit tests
- Create mock scenario data
- Test with various condition combinations

**Dependencies:** Story 2.1-2.7

---

## Epic 3: State Management & Persistence

**Priority:** Critical  
**Category:** Foundation  
**Estimated Effort:** 21 SP  
**Dependencies:** Epic 2  
**Sprint Target:** Sprint 3-4

### Description
Implement centralized state management with Zustand and data persistence with AsyncStorage/SQLite.

### User Stories

#### Story 3.1: Create Game State Store
**Story Points:** 5  
**Priority:** Critical

**User Story:**
As a developer, I want a centralized game state store so that I can manage game flags, counters, and current scenario.

**Acceptance Criteria:**
- [ ] Zustand store created with TypeScript types
- [ ] State includes: currentScenario, flags, counters, location
- [ ] Actions: loadScenario, updateFlags, updateCounters
- [ ] State persisted to AsyncStorage
- [ ] DevTools integration for debugging
- [ ] Immer middleware for immutable updates

**Technical Notes:**
```typescript
interface GameStore {
  currentScenario: Scenario | null;
  flags: Record<string, boolean>;
  counters: Record<string, number>;
  updateFlags: (updates: Record<string, boolean>) => void;
}
```

**Dependencies:** Epic 2

---

#### Story 3.2: Create Character State Store
**Story Points:** 5  
**Priority:** Critical

**User Story:**
As a developer, I want a character state store so that I can manage player stats, inventory, and progression.

**Acceptance Criteria:**
- [ ] PlayerCharacter model implemented
- [ ] Stats: health, mana, stamina with getters/setters
- [ ] Attributes: 8 core attributes
- [ ] Skills: 15+ skills with progression
- [ ] Equipment slots: weapon, armor, accessory, amulet
- [ ] Inventory array with weight calculation
- [ ] Actions: levelUp, equipItem, addItem, removeItem

**Technical Notes:**
- Validate stat changes (prevent negative HP)
- Calculate derived stats (max weight from strength)
- Trigger events on level up

**Dependencies:** Epic 2

---

#### Story 3.3: Create Combat State Store
**Story Points:** 3  
**Priority:** High

**User Story:**
As a developer, I want a combat state store so that I can manage battle state separately from main game state.

**Acceptance Criteria:**
- [ ] CombatState model created
- [ ] Turn order tracking
- [ ] Combatant arrays (player, companions, enemies)
- [ ] Combat log for action history
- [ ] Actions: initiateCombat, processTurn, endCombat
- [ ] Combat state cleared after battle

**Technical Notes:**
- Use MMKV for combat state (high performance)
- Don't persist combat state to disk
- Clear on app backgrounding

**Dependencies:** Epic 2

---

#### Story 3.4: Create Quest State Store
**Story Points:** 3  
**Priority:** High

**User Story:**
As a developer, I want a quest state store so that I can track active, completed, and failed quests.

**Acceptance Criteria:**
- [ ] Quest progress tracking
- [ ] Objective completion percentages
- [ ] Actions: startQuest, updateObjective, completeQuest
- [ ] Quest filtering (active, completed, failed)
- [ ] Quest notifications on updates

**Technical Notes:**
- Store quest progress in SQLite
- Cache active quests in memory
- Sync with game flags

**Dependencies:** Epic 2

---

#### Story 3.5: Setup AsyncStorage Persistence
**Story Points:** 2  
**Priority:** Critical

**User Story:**
As a developer, I want AsyncStorage configured so that simple game data persists across sessions.

**Acceptance Criteria:**
- [ ] @react-native-async-storage/async-storage installed
- [ ] Wrapper service created for type safety
- [ ] Error handling for storage failures
- [ ] Storage size monitoring
- [ ] Clear storage utility for dev/testing

**Technical Notes:**
```typescript
class StorageService {
  async get<T>(key: string): Promise<T | null>;
  async set<T>(key: string, value: T): Promise<void>;
  async remove(key: string): Promise<void>;
}
```

**Dependencies:** Epic 1

---

#### Story 3.6: Setup SQLite Database
**Story Points:** 3  
**Priority:** Critical

**User Story:**
As a developer, I want SQLite configured so that I can store complex relational data efficiently.

**Acceptance Criteria:**
- [ ] expo-sqlite installed and configured
- [ ] Database schema created (10 tables)
- [ ] Migration system implemented
- [ ] Database wrapper service created
- [ ] Index creation for performance
- [ ] Database initialization on app first run

**Technical Notes:**
- Schema from Architecture doc Section 4.2
- Use transactions for bulk operations
- PRAGMA foreign_keys = ON

**Dependencies:** Epic 1

---

## Epic 4: UI Framework & Components

**Priority:** Critical  
**Category:** Foundation  
**Estimated Effort:** 13 SP  
**Dependencies:** Epic 3  
**Sprint Target:** Sprint 4-5

### Description
Build reusable UI components and establish design system for consistent look and feel.

### User Stories

#### Story 4.1: Create Design System
**Story Points:** 3  
**Priority:** High

**User Story:**
As a designer/developer, I want a design system defined so that UI is consistent across the app.

**Acceptance Criteria:**
- [ ] Color palette defined (primary, secondary, backgrounds, text)
- [ ] Typography scale defined (headings, body, captions)
- [ ] Spacing system defined (margins, paddings)
- [ ] Component sizes defined (buttons, inputs)
- [ ] Theme file created with all constants
- [ ] Dark mode variants defined

**Technical Notes:**
```typescript
export const theme = {
  colors: {
    primary: '#8B4513',
    secondary: '#DAA520',
    background: '#1a1a1a',
    text: '#f0f0f0',
  },
  spacing: {
    xs: 4, sm: 8, md: 16, lg: 24, xl: 32,
  },
};
```

**Dependencies:** Epic 1

---

#### Story 4.2: Create Base UI Components
**Story Points:** 5  
**Priority:** Critical

**User Story:**
As a developer, I want reusable base UI components so that I can build screens efficiently.

**Acceptance Criteria:**
- [ ] Button component with variants (primary, secondary, text)
- [ ] Card component for content containers
- [ ] Modal component for overlays
- [ ] TextDisplay component for formatted text
- [ ] ChoiceButton component for scenario choices
- [ ] LoadingSpinner component
- [ ] All components have TypeScript props
- [ ] All components tested with Storybook (optional) or tests

**Technical Notes:**
- Use React.memo for performance
- Support disabled and loading states
- Accessibility: proper labels and roles

**Dependencies:** Story 4.1

---

#### Story 4.3: Create Game-Specific Components
**Story Points:** 5  
**Priority:** High

**User Story:**
As a developer, I want game-specific UI components so that I can build game screens.

**Acceptance Criteria:**
- [ ] ScenarioDisplay component (narrative text)
- [ ] ChoicePanel component (choice buttons layout)
- [ ] QuickStatsBar component (HP/Mana/Gold display)
- [ ] CharacterSheet component
- [ ] InventoryGrid component
- [ ] CombatUI component skeleton
- [ ] All components styled per design system

**Technical Notes:**
- ScenarioDisplay: ScrollView with auto-scroll to new content
- ChoicePanel: Support 2-4 choices dynamically
- QuickStatsBar: Real-time updates via store subscriptions

**Dependencies:** Story 4.2

---

## Epic 5: Navigation System

**Priority:** Critical  
**Category:** Foundation  
**Estimated Effort:** 9 SP  
**Dependencies:** Epic 4  
**Sprint Target:** Sprint 5

### Description
Implement React Navigation structure for all app screens and navigation flows.

### User Stories

#### Story 5.1: Setup Navigation Structure
**Story Points:** 3  
**Priority:** Critical

**User Story:**
As a player, I want smooth navigation between screens so that I can access different game functions.

**Acceptance Criteria:**
- [ ] @react-navigation/native installed
- [ ] Stack navigator for main flow
- [ ] Tab navigator for game functions (optional)
- [ ] Modal stack for overlays
- [ ] Navigation types defined for TypeScript
- [ ] Deep linking configured

**Technical Notes:**
```typescript
type RootStackParamList = {
  Game: undefined;
  Character: undefined;
  Inventory: undefined;
  Map: undefined;
  Journal: undefined;
  Combat: { enemies: Enemy[] };
};
```

**Dependencies:** Epic 4

---

#### Story 5.2: Create Navigation Components
**Story Points:** 3  
**Priority:** High

**User Story:**
As a developer, I want navigation components so that I can implement screen transitions.

**Acceptance Criteria:**
- [ ] RootNavigator component created
- [ ] MainNavigator component created
- [ ] Custom header components
- [ ] Navigation transitions configured
- [ ] Back button handling
- [ ] Android hardware back button support

**Technical Notes:**
- Use slide transition for primary navigation
- Modal transition for overlays
- Gesture handling for iOS swipe back

**Dependencies:** Story 5.1

---

#### Story 5.3: Implement Screen Placeholders
**Story Points:** 3  
**Priority:** Medium

**User Story:**
As a developer, I want placeholder screens created so that I can navigate to all planned screens.

**Acceptance Criteria:**
- [ ] GameScreen placeholder
- [ ] CharacterScreen placeholder
- [ ] InventoryScreen placeholder
- [ ] MapScreen placeholder
- [ ] JournalScreen placeholder
- [ ] CombatScreen placeholder
- [ ] SettingsScreen placeholder
- [ ] All screens navigable from main menu

**Technical Notes:**
- Each screen: simple header + "Coming Soon" message
- Proper TypeScript types
- Connect to navigation system

**Dependencies:** Story 5.2

---

# Game Systems Epics

## Epic 6: Scenario System

**Priority:** Critical  
**Category:** Game Systems  
**Estimated Effort:** 34 SP  
**Dependencies:** Epic 2, Epic 5  
**Sprint Target:** Sprint 6-7

### Description
Implement complete scenario display, choice processing, and narrative flow system.

### User Stories

#### Story 6.1: Create Scenario Display Component
**Story Points:** 5  
**Priority:** Critical

**User Story:**
As a player, I want to read scenario text clearly so that I can understand the story.

**Acceptance Criteria:**
- [ ] Scrollable narrative text display
- [ ] Support for Markdown formatting (bold, italic, headers)
- [ ] Variable interpolation in text
- [ ] Auto-scroll to new content
- [ ] Adjustable text size (accessibility)
- [ ] Portrait display for character/NPC images
- [ ] Location banner at top

**Technical Notes:**
- Use react-native-markdown-display for formatting
- Implement custom renderers for game-specific tags
- Smooth scroll animation

**Dependencies:** Epic 4, Epic 5

---

#### Story 6.2: Create Choice Selection UI
**Story Points:** 3  
**Priority:** Critical

**User Story:**
As a player, I want to select choices easily so that I can progress the story.

**Acceptance Criteria:**
- [ ] ChoiceButton component displays choice text
- [ ] Choices lettered (A, B, C, D)
- [ ] Disabled state for unavailable choices
- [ ] Skill check indication (DC shown)
- [ ] Consequences hint on long press (optional)
- [ ] Confirmation dialog for critical choices
- [ ] Touch feedback (haptics)

**Technical Notes:**
```typescript
interface ChoiceButtonProps {
  choice: Choice;
  onPress: (choiceId: string) => void;
  disabled: boolean;
}
```

**Dependencies:** Epic 4

---

#### Story 6.3: Implement Scenario Loading Flow
**Story Points:** 5  
**Priority:** Critical

**User Story:**
As a player, I want scenarios to load smoothly so that I have a seamless experience.

**Acceptance Criteria:**
- [ ] Loading indicator during scenario fetch
- [ ] Transition animation between scenarios
- [ ] Error handling for missing scenarios
- [ ] Preload next likely scenarios
- [ ] Scenario history (back button) - optional
- [ ] Skip animation option for replays

**Technical Notes:**
- Use suspense boundaries for loading states
- Implement fade transition
- Cache 5 most recent scenarios

**Dependencies:** Story 6.1, Story 6.2, Epic 2

---

#### Story 6.4: Implement Skill Check System
**Story Points:** 5  
**Priority:** High

**User Story:**
As a player, I want skill checks to feel fair and exciting so that choices feel meaningful.

**Acceptance Criteria:**
- [ ] D20 roll animation
- [ ] Roll result display (roll + modifier vs DC)
- [ ] Success/failure messages
- [ ] Critical success (nat 20) special effects
- [ ] Critical failure (nat 1) special effects
- [ ] Skill check results stored in history

**Technical Notes:**
```typescript
function performSkillCheck(skill: number, dc: number): SkillCheckResult {
  const roll = Math.floor(Math.random() * 20) + 1;
  const total = roll + skill;
  return { roll, total, success: total >= dc };
}
```

**Dependencies:** Epic 2

---

#### Story 6.5: Implement Consequence Display
**Story Points:** 3  
**Priority:** Medium

**User Story:**
As a player, I want to see consequences of my choices so that I understand what happened.

**Acceptance Criteria:**
- [ ] Notification for stat changes (+HP, -Mana, etc.)
- [ ] Notification for item gains/losses
- [ ] Notification for relationship changes
- [ ] Notification for quest updates
- [ ] Subtle animations for notifications
- [ ] Dismiss notification manually or auto (5s)

**Technical Notes:**
- Toast-style notifications at bottom
- Queue multiple notifications
- Group similar notifications ("+3 items gained")

**Dependencies:** Epic 3

---

#### Story 6.6: Create Scenario Parser
**Story Points:** 5  
**Priority:** High

**User Story:**
As a developer, I want a robust scenario parser so that content creators can write scenarios easily.

**Acceptance Criteria:**
- [ ] Parse Markdown scenario files
- [ ] Extract metadata (title, act, scene, location)
- [ ] Parse choices with conditions
- [ ] Parse consequences
- [ ] Validate scenario structure
- [ ] Error messages for invalid scenarios
- [ ] Support for comments in scenario files

**Technical Notes:**
```markdown
# Act I, Scene 3: "The Blacksmith"
## Location: Kamenitsa
## Prerequisites: completed_prologue = true

You enter Stoyan's workshop...

## Choices
A) Ask about weapons (Persuasion DC 11)
B) Offer to help (Strength DC 12)
C) Leave quietly
```

**Dependencies:** Epic 2

---

#### Story 6.7: Implement Auto-Save Checkpoints
**Story Points:** 3  
**Priority:** High

**User Story:**
As a player, I want the game to auto-save so that I don't lose progress.

**Acceptance Criteria:**
- [ ] Auto-save after each choice
- [ ] Auto-save on scenario completion
- [ ] Auto-save on app backgrounding
- [ ] Auto-save indicator (subtle icon)
- [ ] Max 1 auto-save per 30 seconds (throttle)
- [ ] Auto-save doesn't block UI

**Technical Notes:**
- Save to slot 0 (reserved for auto-save)
- Debounce save operations
- Show "Saving..." for < 1s

**Dependencies:** Epic 3

---

#### Story 6.8: Create Scenario Testing Tools
**Story Points:** 5  
**Priority:** Medium

**User Story:**
As a content creator, I want testing tools so that I can validate scenarios.

**Acceptance Criteria:**
- [ ] Scenario validator CLI tool
- [ ] Scenario preview in dev mode
- [ ] Force flag/counter values for testing
- [ ] Skip to any scenario by ID
- [ ] Scenario graph visualizer (optional)
- [ ] Export scenario report (choices, consequences)

**Technical Notes:**
- Dev-only features
- Use Expo dev menu to access tools
- Scenario graph: show connections between scenarios

**Dependencies:** Story 6.6

---

## Epic 7: Character System

**Priority:** Critical  
**Category:** Game Systems  
**Estimated Effort:** 26 SP  
**Dependencies:** Epic 3  
**Sprint Target:** Sprint 7-8

### Description
Implement character creation, stats, leveling, and skill progression systems.

### User Stories

#### Story 7.1: Create Character Creation Flow
**Story Points:** 5  
**Priority:** Critical

**User Story:**
As a player, I want to create my character so that I can start the game.

**Acceptance Criteria:**
- [ ] Character name input screen
- [ ] Starting stats displayed (fixed for balance)
- [ ] Character portrait selection (optional)
- [ ] Confirm character creation
- [ ] Character saved to database
- [ ] Navigate to prologue after creation

**Technical Notes:**
- Starting stats: HP 100, Mana 20, all attributes 10
- Name validation (2-20 characters)
- Default portrait if none selected

**Dependencies:** Epic 3, Epic 5

---

#### Story 7.2: Create Character Sheet UI
**Story Points:** 5  
**Priority:** High

**User Story:**
As a player, I want to view my character stats so that I can track my progress.

**Acceptance Criteria:**
- [ ] Character header (portrait, name, level, XP bar)
- [ ] Primary stats display (HP, Mana, Stamina)
- [ ] 8 attributes displayed
- [ ] 15+ skills displayed with values
- [ ] Equipment slots with equipped items
- [ ] Level up button (when available)
- [ ] Stats update in real-time

**Technical Notes:**
- Subscribe to characterStore
- Use FlatList for skills (performance)
- Color-code stat changes (green +, red -)

**Dependencies:** Story 7.1, Epic 4

---

#### Story 7.3: Implement Level Up System
**Story Points:** 5  
**Priority:** High

**User Story:**
As a player, I want to level up when I gain enough XP so that I become stronger.

**Acceptance Criteria:**
- [ ] XP gain from quests, combat, discoveries
- [ ] Level up at XP thresholds (exponential curve)
- [ ] Level up animation/modal
- [ ] Gain skill points on level up (3 points)
- [ ] Skill point allocation UI
- [ ] Stats increase automatically (HP +10, Mana +5)
- [ ] Level cap at 20

**Technical Notes:**
```typescript
const xpForLevel = (level: number) => Math.floor(100 * Math.pow(1.5, level - 1));
```

**Dependencies:** Story 7.2, Epic 3

---

#### Story 7.4: Implement Skill System
**Story Points:** 5  
**Priority:** High

**User Story:**
As a player, I want to improve skills so that I become better at certain actions.

**Acceptance Criteria:**
- [ ] Skills increase from use (passive)
- [ ] Skills increase from skill points (active)
- [ ] Skill values 0-100
- [ ] Skill check bonuses calculated from skill value
- [ ] Skill tooltips explain usage
- [ ] Skill prerequisites (e.g., Arcana 20 for advanced spells)

**Technical Notes:**
- Passive skill gain: +1 on successful use
- Active skill gain: spend 1 skill point for +5
- Diminishing returns at high levels

**Dependencies:** Story 7.3

---

#### Story 7.5: Implement Equipment System
**Story Points:** 3  
**Priority:** High

**User Story:**
As a player, I want to equip items so that I gain their benefits.

**Acceptance Criteria:**
- [ ] Equip item from inventory
- [ ] Unequip item to inventory
- [ ] Equipment requirements checked (level, stats)
- [ ] Equipment bonuses applied to stats
- [ ] Visual indication of equipped items
- [ ] Equip animation (optional)

**Technical Notes:**
- Validate requirements before equip
- Update character stats on equip/unequip
- Prevent equipping if inventory full

**Dependencies:** Story 7.2, Epic 10 (Inventory)

---

#### Story 7.6: Create Derived Stats Calculator
**Story Points:** 3  
**Priority:** Medium

**User Story:**
As a developer, I want derived stats calculated automatically so that the system stays consistent.

**Acceptance Criteria:**
- [ ] Max HP from Endurance (100 + END * 5)
- [ ] Max Mana from Intelligence (20 + INT * 3)
- [ ] Max Weight from Strength (50 + STR * 2)
- [ ] Initiative from Dexterity (DEX + d20)
- [ ] Recalculate on stat changes
- [ ] Memoize calculations for performance

**Technical Notes:**
```typescript
const calculateMaxHP = (endurance: number) => 100 + endurance * 5;
```

**Dependencies:** Story 7.2

---

## Epic 8: Combat System

**Priority:** Critical  
**Category:** Game Systems  
**Estimated Effort:** 34 SP  
**Dependencies:** Epic 3, Epic 7  
**Sprint Target:** Sprint 8-10

### Description
Implement turn-based combat with initiative, abilities, status effects, and enemy AI.

### User Stories

#### Story 8.1: Create Combat Initiation
**Story Points:** 3  
**Priority:** Critical

**User Story:**
As a player, I want combat to start smoothly from scenarios so that battles feel integrated.

**Acceptance Criteria:**
- [ ] Combat trigger from scenario choices
- [ ] Enemy data loaded (from bestiary)
- [ ] Initiative order calculated
- [ ] Combat state initialized
- [ ] Transition to combat screen
- [ ] Combat intro animation (optional)

**Technical Notes:**
- Initiative: DEX + d20 for each combatant
- Sort combatants by initiative (descending)
- Store pre-combat scenario for return

**Dependencies:** Epic 3, Epic 6

---

#### Story 8.2: Create Combat UI
**Story Points:** 5  
**Priority:** Critical

**User Story:**
As a player, I want a clear combat UI so that I can make tactical decisions.

**Acceptance Criteria:**
- [ ] Turn order display (initiative tracker)
- [ ] Enemy cards (portrait, HP bar, status icons)
- [ ] Player panel (HP, Mana, status icons)
- [ ] Action buttons (Attack, Magic, Item, Defend, Flee)
- [ ] Combat log (scrollable history)
- [ ] Current turn highlight
- [ ] Round counter display

**Technical Notes:**
- Update UI in real-time as combat progresses
- Animate HP bars on damage
- Highlight available actions

**Dependencies:** Story 8.1, Epic 4

---

#### Story 8.3: Implement Turn Processing
**Story Points:** 5  
**Priority:** Critical

**User Story:**
As a player, I want turns to process correctly so that combat feels tactical.

**Acceptance Criteria:**
- [ ] Player turn: enable action buttons
- [ ] Enemy turn: AI selects action automatically
- [ ] Action processing (attack, spell, item, defend)
- [ ] Turn advancement after action
- [ ] Round increment after all combatants acted
- [ ] Victory/defeat check after each action

**Technical Notes:**
```typescript
interface CombatAction {
  type: 'attack' | 'spell' | 'item' | 'defend' | 'flee';
  actorId: string;
  targetId: string;
  data?: any;
}
```

**Dependencies:** Story 8.2, Epic 3

---

#### Story 8.4: Implement Attack System
**Story Points:** 5  
**Priority:** Critical

**User Story:**
As a player, I want to attack enemies so that I can damage them.

**Acceptance Criteria:**
- [ ] Calculate hit chance (base + DEX + weapon)
- [ ] Roll for hit (d100)
- [ ] Calculate damage (weapon + STR)
- [ ] Apply armor reduction
- [ ] Critical hits (5% chance, 2x damage)
- [ ] Miss animation/message
- [ ] Damage numbers animation
- [ ] Update combat log

**Technical Notes:**
```typescript
const damage = (weapon.damageMin + weapon.damageMax) / 2 + strength;
const finalDamage = Math.max(0, damage - target.armor);
```

**Dependencies:** Story 8.3

---

#### Story 8.5: Implement Magic in Combat
**Story Points:** 5  
**Priority:** High

**User Story:**
As a player, I want to cast spells in combat so that I can use magic abilities.

**Acceptance Criteria:**
- [ ] Magic menu displays known spells
- [ ] Filter spells by available mana
- [ ] Spell target selection
- [ ] Mana consumption
- [ ] Spell effects (damage, heal, buff, debuff)
- [ ] Spell animations
- [ ] Update combat log

**Technical Notes:**
- Check mana before casting
- Support single-target and area spells
- Apply status effects from spells

**Dependencies:** Story 8.3, Epic 9 (Magic)

---

#### Story 8.6: Implement Item Usage in Combat
**Story Points:** 3  
**Priority:** High

**User Story:**
As a player, I want to use items in combat so that I can heal or buff myself.

**Acceptance Criteria:**
- [ ] Item menu displays usable items (consumables)
- [ ] Item target selection
- [ ] Item consumption (remove from inventory)
- [ ] Item effects applied (heal, mana restore, buffs)
- [ ] Update combat log

**Technical Notes:**
- Only consumable items in combat
- Items don't consume turn (minor action)

**Dependencies:** Story 8.3, Epic 10 (Inventory)

---

#### Story 8.7: Implement Status Effects
**Story Points:** 5  
**Priority:** High

**User Story:**
As a player, I want status effects to work so that combat has depth.

**Acceptance Criteria:**
- [ ] Apply status effect (buff/debuff/DoT/HoT)
- [ ] Status icons displayed on combatants
- [ ] Process status effects each turn
- [ ] Duration tracking (turns remaining)
- [ ] Remove expired status effects
- [ ] Stack multiple effects of same type
- [ ] Status effect tooltips

**Technical Notes:**
```typescript
interface StatusEffect {
  id: string;
  name: string;
  type: 'buff' | 'debuff' | 'dot' | 'hot';
  duration: number;
  effect: (combatant: Combatant) => void;
}
```

**Dependencies:** Story 8.3

---

#### Story 8.8: Implement Enemy AI
**Story Points:** 5  
**Priority:** High

**User Story:**
As a developer, I want enemy AI so that enemies act intelligently.

**Acceptance Criteria:**
- [ ] AI strategies: aggressive, defensive, support, balanced
- [ ] Target selection: weakest, strongest, random, player
- [ ] Action selection based on situation (low HP = heal)
- [ ] Use abilities when available
- [ ] Flee at low HP (some enemies)
- [ ] AI decisions logged (dev mode)

**Technical Notes:**
```typescript
class EnemyAI {
  selectAction(enemy: Combatant, allies: Combatant[], opponents: Combatant[]): CombatAction {
    // Strategy-based decision making
  }
}
```

**Dependencies:** Story 8.3

---

#### Story 8.9: Implement Combat End Conditions
**Story Points:** 3  
**Priority:** Critical

**User Story:**
As a player, I want combat to end appropriately so that I can continue the game.

**Acceptance Criteria:**
- [ ] Victory condition: all enemies defeated
- [ ] Defeat condition: player health <= 0
- [ ] Flee success: random chance based on situation
- [ ] Victory rewards displayed (XP, gold, loot)
- [ ] Defeat consequences (respawn, game over)
- [ ] Return to scenario after combat
- [ ] Combat summary screen

**Technical Notes:**
- XP = sum of enemy XP values
- Gold = random drop from enemies
- Loot = random items from enemy loot tables

**Dependencies:** Story 8.3

---

## Epic 9: Magic System

**Priority:** High  
**Category:** Game Systems  
**Estimated Effort:** 26 SP  
**Dependencies:** Epic 3, Epic 7  
**Sprint Target:** Sprint 10-11

### Description
Implement the magic system with 4 schools, 40+ spells, mana management, and spell learning.

### User Stories

#### Story 9.1: Create Spell Data Models
**Story Points:** 3  
**Priority:** Critical

**User Story:**
As a developer, I want spell data models so that I can implement spells consistently.

**Acceptance Criteria:**
- [ ] Spell interface defined (TypeScript)
- [ ] Properties: id, name, school, manaCost, effect, target, cooldown
- [ ] Spell schools: Folk, Elemental, Sacred, Amulet
- [ ] Spell database (JSON) with 40+ spells
- [ ] Validation for spell data

**Technical Notes:**
```typescript
interface Spell {
  id: string;
  name: string;
  school: 'folk' | 'elemental' | 'sacred' | 'amulet';
  manaCost: number;
  damage?: number;
  healing?: number;
  statusEffects?: StatusEffect[];
  target: 'single' | 'all_enemies' | 'all_allies' | 'self';
  cooldown?: number;
}
```

**Dependencies:** Epic 3

---

#### Story 9.2: Implement Mana System
**Story Points:** 3  
**Priority:** Critical

**User Story:**
As a player, I want mana to manage my spell usage so that magic feels strategic.

**Acceptance Criteria:**
- [ ] Mana pool (20-100 based on Intelligence)
- [ ] Mana consumption on spell cast
- [ ] Mana regeneration (passive +5 per 3 turns)
- [ ] Mana regeneration (active: rest, prayer, meditation)
- [ ] Mana display in UI (current/max)
- [ ] Low mana indicator
- [ ] Prevent casting if insufficient mana

**Technical Notes:**
- Max mana = 20 + (Intelligence * 3)
- Regeneration increases with Wisdom
- Potions can restore mana

**Dependencies:** Story 9.1, Epic 7

---

#### Story 9.3: Implement Spell Learning System
**Story Points:** 5  
**Priority:** High

**User Story:**
As a player, I want to learn spells from teachers so that I can expand my abilities.

**Acceptance Criteria:**
- [ ] NPCs can teach spells
- [ ] Teaching dialogue with spell details
- [ ] Costs: gold, reputation, quest completion
- [ ] Spell prerequisites checked (level, skills, other spells)
- [ ] Add spell to character's known spells
- [ ] Spell learned notification
- [ ] Track which spells learned from which teachers

**Technical Notes:**
- Each teacher has teachableSpells array
- Check prerequisites before teaching
- Record in NPC relationship

**Dependencies:** Story 9.1, Story 9.2

---

#### Story 9.4: Implement Spell Casting (Non-Combat)
**Story Points:** 5  
**Priority:** High

**User Story:**
As a player, I want to cast spells outside combat so that I can use magic for exploration.

**Acceptance Criteria:**
- [ ] Spell menu accessible from game screen
- [ ] Filter spells by context (combat vs non-combat)
- [ ] Target selection for spells
- [ ] Mana consumption
- [ ] Spell effects (reveal hidden, heal, light, etc.)
- [ ] Spell cooldown tracking
- [ ] Spell cast animation

**Technical Notes:**
- Non-combat spells: Reveal Hidden, Heal, Light, Talk to Spirits
- Some spells trigger special scenarios
- Update game flags based on spell use

**Dependencies:** Story 9.2, Story 9.3, Epic 6

---

#### Story 9.5: Implement Folk Magic School
**Story Points:** 3  
**Priority:** High

**User Story:**
As a player, I want to use folk magic so that I can use traditional Bulgarian spells.

**Acceptance Criteria:**
- [ ] 10+ folk spells implemented
- [ ] Bayania (chants) for healing, protection
- [ ] Herb-based spells
- [ ] Curse and curse removal
- [ ] Spell text in Bulgarian with translation
- [ ] Cultural accuracy validation

**Technical Notes:**
- Baene za bolesti (Heal Disease)
- Baene za spirane na krv (Stop Bleeding)
- Baene protiv strah (Remove Fear)
- Zashita ot uroki (Protection from Curse)

**Dependencies:** Story 9.4

---

#### Story 9.6: Implement Elemental Magic School
**Story Points:** 3  
**Priority:** High

**User Story:**
As a player, I want to use elemental magic so that I can wield fire, water, and earth.

**Acceptance Criteria:**
- [ ] Fire spells: Spark, Fire Wall, Fire Storm
- [ ] Water spells: Heal Water, Freeze, Water Mist
- [ ] Earth spells: Stone Skin, Earthquake
- [ ] Elemental damage types
- [ ] Elemental resistances (enemies)

**Technical Notes:**
- Fire: high damage, area effects
- Water: healing, crowd control
- Earth: defense, control

**Dependencies:** Story 9.4

---

#### Story 9.7: Implement Sacred Magic School
**Story Points:** 3  
**Priority:** High

**User Story:**
As a player, I want to use sacred magic so that I can wield holy powers.

**Acceptance Criteria:**
- [ ] Sacred Light (illuminate darkness)
- [ ] Healing Touch (restore HP)
- [ ] Banish Evil (damage to dark creatures)
- [ ] Shield of Faith (block magic attack)
- [ ] Reveal Truth (detect lies)
- [ ] Sacred magic requires Holy Relic
- [ ] Sacred magic unavailable in Act V (relic lost)

**Technical Notes:**
- Check for Holy Relic before allowing sacred spells
- Double damage to cultists and demons
- Disable sacred spells when relic is lost

**Dependencies:** Story 9.4

---

#### Story 9.8: Implement Amulet Powers
**Story Points:** 3  
**Priority:** High

**User Story:**
As a player, I want to use amulet powers so that I can interact with spirits.

**Acceptance Criteria:**
- [ ] Talk to Spirits (passive, always on)
- [ ] Speak with Magical Animals (costs 5 mana)
- [ ] See Magic Auras (passive, always on)
- [ ] Protection from Weak Evil (passive)
- [ ] Amulet must be equipped

**Technical Notes:**
- Amulet in special equipment slot
- Cannot be removed (quest item)
- Passive abilities always active when equipped

**Dependencies:** Story 9.4

---

#### Story 9.9: Create Magic Testing Tools
**Story Points:** 3  
**Priority:** Medium

**User Story:**
As a developer, I want magic testing tools so that I can test spells easily.

**Acceptance Criteria:**
- [ ] Dev mode spell menu (all spells accessible)
- [ ] Infinite mana mode (dev)
- [ ] Instant cooldown reset (dev)
- [ ] Spell damage calculator tool
- [ ] Spell balance spreadsheet export

**Technical Notes:**
- Accessible via Expo dev menu
- Log spell usage for balancing
- Export spell stats to CSV

**Dependencies:** Story 9.1-9.8

---

## Epic 10: Economy & Inventory

**Priority:** High  
**Category:** Game Systems  
**Estimated Effort:** 29 SP  
**Dependencies:** Epic 3, Epic 7  
**Sprint Target:** Sprint 11-12

### Description
Implement currency system, inventory management, trading, and crafting.

### User Stories

#### Story 10.1: Create Item Data Models
**Story Points:** 3  
**Priority:** Critical

**User Story:**
As a developer, I want item data models so that I can implement items consistently.

**Acceptance Criteria:**
- [ ] Item interface defined (TypeScript)
- [ ] Item categories: weapon, armor, consumable, material, quest, key, artifact
- [ ] Rarity levels: common, uncommon, rare, epic, legendary, unique
- [ ] Item database (JSON) with 100+ items
- [ ] Item validation

**Technical Notes:**
```typescript
interface Item {
  id: string;
  name: string;
  description: string;
  category: ItemCategory;
  rarity: ItemRarity;
  value: number; // in copper
  weight: number;
  stackable: boolean;
  maxStack: number;
}
```

**Dependencies:** Epic 3

---

#### Story 10.2: Create Inventory UI
**Story Points:** 5  
**Priority:** Critical

**User Story:**
As a player, I want to view my inventory so that I can manage items.

**Acceptance Criteria:**
- [ ] Grid view with item icons
- [ ] List view option
- [ ] Category tabs (All, Weapons, Armor, Consumables, etc.)
- [ ] Item detail panel on selection
- [ ] Weight display (current/max)
- [ ] Quick actions (Use, Equip, Drop, Sell)
- [ ] Search/filter functionality

**Technical Notes:**
- Use FlatList for performance
- Implement virtual scrolling
- Cache item icons

**Dependencies:** Story 10.1, Epic 4

---

#### Story 10.3: Implement Currency System
**Story Points:** 3  
**Priority:** High

**User Story:**
As a player, I want to manage historical currency so that trading feels authentic.

**Acceptance Criteria:**
- [ ] Currency types: Gold Perpera, Silver Trachea, Copper Trachea
- [ ] Conversion rates: 1 Gold = 12 Silver = 288 Copper
- [ ] Display currency in appropriate format
- [ ] Currency conversion utility
- [ ] Add/remove currency with validation

**Technical Notes:**
```typescript
// Store all in copper internally
const copper = 1500; // 5 silver, 36 copper
const display = formatCurrency(copper); // "5 silver, 36 copper"
```

**Dependencies:** Story 10.1

---

#### Story 10.4: Implement Item Management
**Story Points:** 5  
**Priority:** High

**User Story:**
As a player, I want to add/remove items so that I can manage inventory.

**Acceptance Criteria:**
- [ ] Add item to inventory
- [ ] Remove item from inventory
- [ ] Stack items (if stackable)
- [ ] Weight calculation
- [ ] Prevent adding if overweight
- [ ] Drop item (remove without selling)
- [ ] Item acquisition notifications

**Technical Notes:**
- Check weight before adding
- Auto-stack same items
- Update SQLite inventory table

**Dependencies:** Story 10.2

---

#### Story 10.5: Implement Trading System
**Story Points:** 5  
**Priority:** High

**User Story:**
As a player, I want to buy and sell items so that I can acquire equipment.

**Acceptance Criteria:**
- [ ] Merchant UI with inventory
- [ ] Buy item (currency check, inventory space check)
- [ ] Sell item (price calculation)
- [ ] Price modifiers (reputation, charisma)
- [ ] Merchant refresh (daily/weekly)
- [ ] Special merchant items (rare)
- [ ] Trading dialogue

**Technical Notes:**
```typescript
const buyPrice = item.value;
const sellPrice = Math.floor(item.value * 0.5);
const reputationModifier = 0.05 * reputation; // -20% to +20%
```

**Dependencies:** Story 10.3, Story 10.4

---

#### Story 10.6: Implement Barter System
**Story Points:** 3  
**Priority:** Medium

**User Story:**
As a player, I want to barter with villagers so that I can trade without money.

**Acceptance Criteria:**
- [ ] Barter UI (offer items, request items)
- [ ] Value calculation for barter
- [ ] Accept/reject barter offer
- [ ] Barter success based on persuasion
- [ ] Barter available with specific NPCs

**Technical Notes:**
- Calculate total value of offered items
- Compare to requested items value
- Persuasion check if values don't match

**Dependencies:** Story 10.5

---

#### Story 10.7: Implement Crafting System
**Story Points:** 5  
**Priority:** Medium

**User Story:**
As a player, I want to craft items so that I can create equipment.

**Acceptance Criteria:**
- [ ] Recipe system (learn recipes)
- [ ] Crafting UI (ingredients, result)
- [ ] Check ingredients availability
- [ ] Consume ingredients on craft
- [ ] Create crafted item
- [ ] Crafting skill requirements
- [ ] Crafting failure chance (return some materials)

**Technical Notes:**
```typescript
interface Recipe {
  id: string;
  result: Item;
  ingredients: { itemId: string; quantity: number }[];
  requiredSkill: { skill: string; level: number };
  successRate: number;
}
```

**Dependencies:** Story 10.4

---

## Epic 11: Quest System

**Priority:** High  
**Category:** Game Systems  
**Estimated Effort:** 26 SP  
**Dependencies:** Epic 3, Epic 6  
**Sprint Target:** Sprint 12-13

### Description
Implement quest tracking, objectives, rewards, and quest chains.

### User Stories

#### Story 11.1: Create Quest Data Models
**Story Points:** 3  
**Priority:** Critical

**User Story:**
As a developer, I want quest data models so that I can implement quests consistently.

**Acceptance Criteria:**
- [ ] Quest interface defined (TypeScript)
- [ ] Quest types: help, combat, mystery, romance, gathering
- [ ] Quest objectives with progress tracking
- [ ] Quest rewards (XP, gold, items, reputation)
- [ ] Quest database (JSON) with 65+ side quests
- [ ] Quest validation

**Technical Notes:**
```typescript
interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  objectives: QuestObjective[];
  rewards: QuestReward;
  prerequisites: Condition[];
}
```

**Dependencies:** Epic 3

---

#### Story 11.2: Create Quest Journal UI
**Story Points:** 5  
**Priority:** High

**User Story:**
As a player, I want to view my quests so that I can track progress.

**Acceptance Criteria:**
- [ ] Quest list (active, completed, failed)
- [ ] Quest detail view (description, objectives, rewards)
- [ ] Objective progress bars
- [ ] Quest location on map (if applicable)
- [ ] Quest sorting/filtering
- [ ] Quest pinning (track on HUD)

**Technical Notes:**
- Use tabs for quest categories
- Show completed objectives with checkmark
- Highlight nearest quest objective

**Dependencies:** Story 11.1, Epic 4

---

#### Story 11.3: Implement Quest Starting
**Story Points:** 3  
**Priority:** Critical

**User Story:**
As a player, I want to accept quests so that I can earn rewards.

**Acceptance Criteria:**
- [ ] Quest offer dialogue with NPC
- [ ] Quest prerequisites checked
- [ ] Accept/decline quest options
- [ ] Quest added to active quests
- [ ] Quest notification on start
- [ ] Quest log updated

**Technical Notes:**
- Check prerequisites before offering
- Some quests auto-start (main quest)
- Track quest giver in quest data

**Dependencies:** Story 11.1, Story 11.2

---

#### Story 11.4: Implement Objective Tracking
**Story Points:** 5  
**Priority:** Critical

**User Story:**
As a player, I want objectives to update automatically so that I can see progress.

**Acceptance Criteria:**
- [ ] Objective types: reach_location, talk_to_npc, collect_item, defeat_enemy, skill_check
- [ ] Auto-detect objective completion
- [ ] Update objective progress (e.g., 3/5 items collected)
- [ ] Objective completion notification
- [ ] Hidden objectives revealed at right time
- [ ] Optional objectives marked

**Technical Notes:**
```typescript
interface QuestObjective {
  id: string;
  description: string;
  type: ObjectiveType;
  target: string;
  targetCount: number;
  currentCount: number;
  hidden: boolean;
  optional: boolean;
}
```

**Dependencies:** Story 11.3

---

#### Story 11.5: Implement Quest Completion
**Story Points:** 3  
**Priority:** Critical

**User Story:**
As a player, I want to complete quests so that I can earn rewards.

**Acceptance Criteria:**
- [ ] Check all objectives completed
- [ ] Return to quest giver (if required)
- [ ] Quest completion dialogue
- [ ] Distribute rewards (XP, gold, items, reputation)
- [ ] Quest moved to completed list
- [ ] Quest completion notification
- [ ] Unlock follow-up quests

**Technical Notes:**
- Some quests auto-complete (objectives only)
- Some require return to NPC
- Update world flags on completion

**Dependencies:** Story 11.4

---

#### Story 11.6: Implement Quest Failure
**Story Points:** 3  
**Priority:** Medium

**User Story:**
As a player, I want quests to fail if conditions are met so that choices have weight.

**Acceptance Criteria:**
- [ ] Failure conditions checked (time limit, NPC death, wrong choice)
- [ ] Quest failure notification
- [ ] Quest moved to failed list
- [ ] Consequences applied (reputation loss, story changes)
- [ ] Some quests can be retried

**Technical Notes:**
- Time-limited quests check on day change
- NPC death triggers quest failure
- Some failures are permanent

**Dependencies:** Story 11.4

---

#### Story 11.7: Implement Quest Chains
**Story Points:** 3  
**Priority:** Medium

**User Story:**
As a player, I want quest chains so that stories develop over multiple quests.

**Acceptance Criteria:**
- [ ] Quest prerequisites (previous quest completed)
- [ ] Auto-start next quest in chain
- [ ] Quest chain indicators in UI
- [ ] Branching quest chains (different outcomes)
- [ ] Quest chain completion bonus

**Technical Notes:**
- Use prerequisites field for chains
- Example: Quest 2 requires Quest 1 completed
- Branching: Quest 3A or 3B based on Quest 2 choice

**Dependencies:** Story 11.5

---

#### Story 11.8: Implement Regional Quest Sets
**Story Points:** 3  
**Priority:** Medium

**User Story:**
As a player, I want to complete all quests in a region so that I can get set bonuses.

**Acceptance Criteria:**
- [ ] Track quests by region
- [ ] Set bonus on all quests completed
- [ ] Set bonus notification
- [ ] Regional completion percentage
- [ ] Regional unlock (special content)

**Technical Notes:**
- Set bonuses defined in SIDE-QUESTS.md
- Example: All Kamenitsa quests → discount at merchants
- Track in game flags

**Dependencies:** Story 11.5

---

## Epic 12: NPC & Relationship System

**Priority:** High  
**Category:** Game Systems  
**Estimated Effort:** 21 SP  
**Dependencies:** Epic 3, Epic 6  
**Sprint Target:** Sprint 13-14

### Description
Implement NPC interactions, dialogue system, and relationship tracking.

### User Stories

#### Story 12.1: Create NPC Data Models
**Story Points:** 3  
**Priority:** Critical

**User Story:**
As a developer, I want NPC data models so that I can implement NPCs consistently.

**Acceptance Criteria:**
- [ ] NPC interface defined (TypeScript)
- [ ] NPC properties: id, name, role, faction, affinity
- [ ] NPC dialogues (dialogue tree IDs)
- [ ] NPC database (JSON) with 50+ NPCs
- [ ] NPC validation

**Technical Notes:**
```typescript
interface NPC {
  id: string;
  name: string;
  title?: string;
  role: 'merchant' | 'companion' | 'quest_giver' | 'teacher' | 'enemy' | 'neutral';
  faction: string;
  baseAffinity: number;
  dialogues: string[];
}
```

**Dependencies:** Epic 3

---

#### Story 12.2: Create Dialogue System
**Story Points:** 5  
**Priority:** Critical

**User Story:**
As a player, I want to have conversations with NPCs so that I can learn and interact.

**Acceptance Criteria:**
- [ ] Dialogue UI (NPC portrait, name, dialogue text)
- [ ] Dialogue options (player responses)
- [ ] Dialogue branching based on conditions
- [ ] Dialogue history tracking
- [ ] Exit dialogue option
- [ ] Dialogue animations (text reveal)

**Technical Notes:**
```typescript
interface DialogueNode {
  id: string;
  speaker: 'npc' | 'player';
  text: string;
  responses: DialogueResponse[];
  conditions?: Condition[];
}
```

**Dependencies:** Story 12.1, Epic 4

---

#### Story 12.3: Implement Relationship System
**Story Points:** 5  
**Priority:** High

**User Story:**
As a player, I want relationships with NPCs so that my actions affect interactions.

**Acceptance Criteria:**
- [ ] Affinity scale (-100 to +100)
- [ ] Affinity thresholds: hostile, unfriendly, neutral, friendly, trusted
- [ ] Affinity changes from actions and choices
- [ ] Affinity affects dialogue options
- [ ] Affinity affects prices (merchants)
- [ ] Affinity display in NPC info
- [ ] Relationship notifications

**Technical Notes:**
- Store in npc_relationships SQLite table
- Update affinity on quest completion, dialogue choices
- Thresholds: -80 (hostile), -40 (unfriendly), 0 (neutral), 40 (friendly), 80 (trusted)

**Dependencies:** Story 12.2

---

#### Story 12.4: Implement Faction Reputation
**Story Points:** 3  
**Priority:** High

**User Story:**
As a player, I want reputation with factions so that groups react to me differently.

**Acceptance Criteria:**
- [ ] Faction list: Royal Court, Brotherhood, Church, Merchants, Villagers, Cultists
- [ ] Reputation scale (-100 to +100)
- [ ] Reputation affects all NPCs in faction
- [ ] Reputation changes from quests and actions
- [ ] Reputation display in UI
- [ ] Opposing faction system (e.g., Church vs Cultists)

**Technical Notes:**
- Faction reputation stored separately from individual NPC affinity
- Some actions affect multiple factions
- Reputation gates: access to locations, quests, items

**Dependencies:** Story 12.3

---

#### Story 12.5: Implement NPC Schedules (Optional)
**Story Points:** 5  
**Priority:** Low

**User Story:**
As a player, I want NPCs to have schedules so that the world feels alive.

**Acceptance Criteria:**
- [ ] Time of day system (morning, afternoon, evening, night)
- [ ] NPC location changes based on time
- [ ] NPC availability based on schedule
- [ ] Sleep schedules (can't interact at night)
- [ ] Event schedules (market days, festivals)

**Technical Notes:**
- Simplified system: 4 time periods per day
- Most NPCs have 2-3 locations
- Optional feature, can be skipped if time constrained

**Dependencies:** Story 12.1

---

## Epic 13: Companion System

**Priority:** Medium  
**Category:** Game Systems  
**Estimated Effort:** 21 SP  
**Dependencies:** Epic 12  
**Sprint Target:** Sprint 14-15

### Description
Implement recruitable companions with personal quests, combat abilities, and affinity.

### User Stories

#### Story 13.1: Create Companion Data Models
**Story Points:** 3  
**Priority:** High

**User Story:**
As a developer, I want companion data models so that I can implement companions.

**Acceptance Criteria:**
- [ ] Companion interface extends NPC
- [ ] Combat stats and abilities
- [ ] Personal quest ID
- [ ] Recruitment conditions
- [ ] Companion database (JSON) with 10+ companions
- [ ] Romance flags (if applicable)

**Technical Notes:**
```typescript
interface Companion extends NPC {
  companionData: {
    recruitable: boolean;
    recruitQuest?: string;
    combatAbilities: string[];
    personalQuest?: string;
    romanceable: boolean;
  };
}
```

**Dependencies:** Epic 12

---

#### Story 13.2: Implement Companion Recruitment
**Story Points:** 3  
**Priority:** High

**User Story:**
As a player, I want to recruit companions so that I have allies.

**Acceptance Criteria:**
- [ ] Recruitment dialogue with NPC
- [ ] Recruitment conditions checked (quest, affinity)
- [ ] Companion added to party
- [ ] Companion follows player
- [ ] Max 2 companions at once
- [ ] Companion recruitment notification

**Technical Notes:**
- Check recruitment prerequisites
- Update NPC status to recruited
- Add to characterStore.companions

**Dependencies:** Story 13.1, Epic 12

---

#### Story 13.3: Implement Companion Management
**Story Points:** 3  
**Priority:** High

**User Story:**
As a player, I want to manage companions so that I can choose my party.

**Acceptance Criteria:**
- [ ] Companion list UI
- [ ] Recruit/dismiss companions
- [ ] Set active companions (2 max)
- [ ] View companion stats and abilities
- [ ] View companion affinity
- [ ] Companion location (if not in party)

**Technical Notes:**
- Active companions participate in combat
- Dismissed companions return to last location
- Can re-recruit dismissed companions

**Dependencies:** Story 13.2

---

#### Story 13.4: Implement Companion Combat
**Story Points:** 5  
**Priority:** High

**User Story:**
As a player, I want companions to fight with me so that combat is easier.

**Acceptance Criteria:**
- [ ] Companions added to combat as allies
- [ ] Companion AI (support, damage, tank roles)
- [ ] Companion abilities usable
- [ ] Companion health tracking
- [ ] Companion death (temporary, revive after battle)
- [ ] Companion XP gain

**Technical Notes:**
- Companions act on their turn (auto)
- AI: support companions prioritize healing, damage companions attack
- Companions level up with player

**Dependencies:** Story 13.3, Epic 8

---

#### Story 13.5: Implement Companion Personal Quests
**Story Points:** 3  
**Priority:** Medium

**User Story:**
As a player, I want to do companion quests so that I learn their stories.

**Acceptance Criteria:**
- [ ] Companion quest unlocked at affinity threshold
- [ ] Companion quest dialogue triggers
- [ ] Complete companion quest
- [ ] Companion affinity boost on completion
- [ ] Companion ability unlock (optional)
- [ ] Companion loyalty ensured

**Technical Notes:**
- One personal quest per companion
- Quests reveal companion backstory
- High affinity + completed quest = loyal companion

**Dependencies:** Story 13.2, Epic 11

---

#### Story 13.6: Implement Companion Dialogues
**Story Points:** 3  
**Priority:** Medium

**User Story:**
As a player, I want to talk with companions so that I can build relationships.

**Acceptance Criteria:**
- [ ] Companion dialogue menu
- [ ] Companion comments on events
- [ ] Companion opinions on player choices
- [ ] Affinity changes from dialogues
- [ ] Companion banter (companions talk to each other)
- [ ] Romance dialogues (if romanceable)

**Technical Notes:**
- Companions comment after major choices
- Affinity affects companion dialogue options
- Romance requires high affinity + personal quest completed

**Dependencies:** Story 13.5, Epic 12

---

## Epic 14: Travel & Exploration

**Priority:** Medium  
**Category:** Game Systems  
**Estimated Effort:** 18 SP  
**Dependencies:** Epic 6  
**Sprint Target:** Sprint 15

### Description
Implement world map, travel system, random encounters, and location discovery.

### User Stories

#### Story 14.1: Create World Map UI
**Story Points:** 5  
**Priority:** High

**User Story:**
As a player, I want to see a map so that I can navigate the world.

**Acceptance Criteria:**
- [ ] World map displayed (image or interactive)
- [ ] Locations marked on map
- [ ] Current location highlighted
- [ ] Travel to location on tap
- [ ] Undiscovered locations hidden
- [ ] Travel distance displayed
- [ ] Quest markers on map

**Technical Notes:**
- Use static map image with overlay
- Or use interactive map (react-native-maps)
- Store discovered locations in game state

**Dependencies:** Epic 4

---

#### Story 14.2: Implement Travel System
**Story Points:** 3  
**Priority:** High

**User Story:**
As a player, I want to travel between locations so that I can explore.

**Acceptance Criteria:**
- [ ] Select destination from map
- [ ] Travel time calculated (distance-based)
- [ ] Loading screen during travel
- [ ] Arrival at destination
- [ ] Update current location
- [ ] Random encounters during travel (optional)

**Technical Notes:**
- Travel time: 1-5 time units based on distance
- Can skip time with instant travel (fast travel unlocked later)
- Random encounter chance: 20% per travel

**Dependencies:** Story 14.1

---

#### Story 14.3: Implement Random Encounters
**Story Points:** 5  
**Priority:** Medium

**User Story:**
As a player, I want random encounters so that travel is interesting.

**Acceptance Criteria:**
- [ ] Random encounter chance during travel
- [ ] Encounter types: combat, NPC, discovery, event
- [ ] Encounter scenario displayed
- [ ] Encounter choices (fight, talk, flee, investigate)
- [ ] Encounter rewards (XP, items, lore)
- [ ] Encounter frequency based on location

**Technical Notes:**
```typescript
const encounters = [
  { type: 'combat', chance: 0.5, enemies: ['bandit', 'wolf'] },
  { type: 'npc', chance: 0.3, npcId: 'traveling_merchant' },
  { type: 'discovery', chance: 0.15, discoveryId: 'hidden_cave' },
  { type: 'event', chance: 0.05, eventId: 'strange_light' },
];
```

**Dependencies:** Story 14.2

---

#### Story 14.4: Implement Location Discovery
**Story Points:** 3  
**Priority:** Medium

**User Story:**
As a player, I want to discover new locations so that I can explore.

**Acceptance Criteria:**
- [ ] Locations start hidden or revealed based on quest
- [ ] Discover location on first visit
- [ ] Discovery notification with XP reward
- [ ] Location unlocked on map
- [ ] Location lore displayed on discovery
- [ ] Track discovered locations in game state

**Technical Notes:**
- Some locations auto-discovered (main quest)
- Some require exploration or quest
- Discovery XP: 50-100 based on location importance

**Dependencies:** Story 14.1

---

#### Story 14.5: Implement Fast Travel
**Story Points:** 2  
**Priority:** Low

**User Story:**
As a player, I want fast travel so that I can skip long journeys.

**Acceptance Criteria:**
- [ ] Fast travel unlocked after first visit
- [ ] Fast travel from map
- [ ] Instant travel (no time cost)
- [ ] No random encounters during fast travel
- [ ] Fast travel disabled during combat or quests

**Technical Notes:**
- Unlock after visiting location once
- Optional feature for convenience
- Can be disabled for difficulty

**Dependencies:** Story 14.2

---

## Epic 15: Save/Load System

**Priority:** Critical  
**Category:** Game Systems  
**Estimated Effort:** 21 SP  
**Dependencies:** Epic 3  
**Sprint Target:** Sprint 16

### Description
Implement save game functionality, multiple save slots, auto-save, and save migration.

### User Stories

#### Story 15.1: Implement Save Game Functionality
**Story Points:** 5  
**Priority:** Critical

**User Story:**
As a player, I want to save my game so that I can continue later.

**Acceptance Criteria:**
- [ ] Save current game state
- [ ] Snapshot includes: player, world state, quests, NPCs, inventory
- [ ] Save to SQLite save_slots table
- [ ] Save to AsyncStorage as backup
- [ ] Save timestamp and playtime
- [ ] Save validation on write
- [ ] Save completion notification

**Technical Notes:**
```typescript
interface SaveSnapshot {
  version: string;
  timestamp: number;
  playtime: number;
  gameState: GameState;
  characterState: CharacterState;
  questState: QuestState;
  npcState: NPCState;
}
```

**Dependencies:** Epic 3

---

#### Story 15.2: Implement Load Game Functionality
**Story Points:** 5  
**Priority:** Critical

**User Story:**
As a player, I want to load my saved game so that I can continue.

**Acceptance Criteria:**
- [ ] Load save from slot
- [ ] Validate save integrity
- [ ] Restore all game state
- [ ] Handle corrupted saves gracefully
- [ ] Version migration if needed
- [ ] Load completion notification
- [ ] Return to saved scenario

**Technical Notes:**
- Check version compatibility
- Migrate saves if version mismatch
- If corrupted, try AsyncStorage backup
- Restore player position, inventory, quests, etc.

**Dependencies:** Story 15.1

---

#### Story 15.3: Create Save/Load UI
**Story Points:** 3  
**Priority:** High

**User Story:**
As a player, I want a save/load menu so that I can manage saves.

**Acceptance Criteria:**
- [ ] Save menu (3 manual slots + 1 auto-save slot)
- [ ] Save slot display: thumbnail, name, timestamp, playtime, location
- [ ] Save to slot with confirmation
- [ ] Load from slot with confirmation
- [ ] Delete save with confirmation
- [ ] Save slot sorting (timestamp)

**Technical Notes:**
- Slot 0: Auto-save (cannot be deleted)
- Slots 1-3: Manual saves
- Thumbnail: screenshot of current scenario (optional)

**Dependencies:** Story 15.2, Epic 4

---

#### Story 15.4: Implement Auto-Save
**Story Points:** 3  
**Priority:** High

**User Story:**
As a player, I want auto-save so that I don't lose progress.

**Acceptance Criteria:**
- [ ] Auto-save after major events (scenario complete, quest complete)
- [ ] Auto-save on app backgrounding
- [ ] Auto-save throttle (max once per 30s)
- [ ] Auto-save to slot 0
- [ ] Auto-save notification (subtle)
- [ ] Auto-save doesn't block UI

**Technical Notes:**
- Use debounce for save operations
- Show "Saving..." icon briefly
- Don't interrupt player actions

**Dependencies:** Story 15.1

---

#### Story 15.5: Implement Save Migration
**Story Points:** 5  
**Priority:** Medium

**User Story:**
As a developer, I want save migration so that updates don't break saves.

**Acceptance Criteria:**
- [ ] Detect save version on load
- [ ] Migration chain from old versions
- [ ] Add new fields with defaults
- [ ] Remove deprecated fields
- [ ] Migrate data structures
- [ ] Migration testing with old saves
- [ ] Migration failure recovery

**Technical Notes:**
```typescript
class SaveMigrationService {
  migrate(save: SaveSnapshot, fromVersion: string, toVersion: string): SaveSnapshot {
    // Apply migrations in order
  }
}
```

**Dependencies:** Story 15.2

---

# Content Creation Epics

## Epic 16: Main Quest Content (Acts I-II)

**Priority:** Critical  
**Category:** Content  
**Estimated Effort:** 21 SP  
**Dependencies:** Epic 6  
**Sprint Target:** Sprint 17-18

### Description
Implement Prologue, Act I, and Act II scenarios (~60 scenarios total).

### User Stories

#### Story 16.1: Create Prologue Scenarios
**Story Points:** 3  
**Priority:** Critical

**User Story:**
As a player, I want to experience the prologue so that I understand the story setup.

**Acceptance Criteria:**
- [ ] 4 prologue scenarios implemented
- [ ] Scenarios: Awakening, Fireplace, Stoyan, Diary
- [ ] Variables working (grandfather, map, chariot)
- [ ] Choices functional
- [ ] Transitions smooth
- [ ] Prologue tested end-to-end

**Technical Notes:**
- Files from game bible: 01-sabuzhdane.md, 02-kaminata.md, 03-stoyan.md, 04-dnevnik.md
- Set flags: completed_prologue, met_stoyan
- Unlock Act I

**Dependencies:** Epic 6

---

#### Story 16.2: Create Act I Scenarios (Kamenitsa)
**Story Points:** 8  
**Priority:** Critical

**User Story:**
As a player, I want to play Act I so that I begin my journey.

**Acceptance Criteria:**
- [ ] ~25 Act I scenarios implemented
- [ ] Location: Kamenitsa village
- [ ] Key NPCs: Stoyan, Kalina, villagers
- [ ] Main quest progression tracked
- [ ] Side quest hooks planted
- [ ] Act I completion leads to Act II

**Technical Notes:**
- Implement scenarios from MAIN-QUEST-OUTLINE.md Act I
- Introduce game mechanics: combat, magic, inventory
- First boss: Minor threat (bandits or wolves)

**Dependencies:** Story 16.1, Epic 6

---

#### Story 16.3: Create Act II Scenarios (Stanimaka)
**Story Points:** 10  
**Priority:** Critical

**User Story:**
As a player, I want to play Act II so that I progress the story.

**Acceptance Criteria:**
- [ ] ~30 Act II scenarios implemented
- [ ] Location: Stanimaka town
- [ ] Key NPCs: Dimitre, Maria, Greek quarter NPCs
- [ ] Main quest progression tracked
- [ ] Moneta key #2 obtained
- [ ] Act II completion leads to Act III

**Technical Notes:**
- Implement scenarios from MAIN-QUEST-OUTLINE.md Act II
- Introduce: Monastery, Greek quarter, tournament
- First major choice: Alliance or opposition

**Dependencies:** Story 16.2

---

## Epic 17: Main Quest Content (Acts III-V)

**Priority:** Critical  
**Category:** Content  
**Estimated Effort:** 34 SP  
**Dependencies:** Epic 16  
**Sprint Target:** Sprint 18-20

### Description
Implement Act III, IV, V scenarios and 4 epilogue variants (~70 scenarios total).

### User Stories

#### Story 17.1: Create Act III Scenarios (Philippopolis)
**Story Points:** 10  
**Priority:** Critical

**User Story:**
As a player, I want to play Act III so that I reach the major city.

**Acceptance Criteria:**
- [ ] ~30 Act III scenarios implemented
- [ ] Location: Philippopolis (major city)
- [ ] Key NPCs: Elena, Philosopher, City officials
- [ ] Library research section
- [ ] Political intrigue section
- [ ] Act III completion leads to Act IV

**Technical Notes:**
- Implement scenarios from MAIN-QUEST-OUTLINE.md Act III
- Introduce: Library, Underground, Arena
- Obtain moneta keys #3-4

**Dependencies:** Epic 16

---

#### Story 17.2: Create Act IV Scenarios (Mountains)
**Story Points:** 8  
**Priority:** Critical

**User Story:**
As a player, I want to play Act IV so that I find the Holy Relic.

**Acceptance Criteria:**
- [ ] ~20 Act IV scenarios implemented
- [ ] Locations: Zabardo, Wondrous Bridges, Krustova Gora
- [ ] Key NPCs: Hermit, Brotherhood members
- [ ] Holy Relic obtained
- [ ] Sacred magic unlocked
- [ ] Act IV completion leads to Act V

**Technical Notes:**
- Implement scenarios from MAIN-QUEST-OUTLINE.md Act IV
- Obtain moneta keys #5-6
- Major battle: Cultists at Wondrous Bridges

**Dependencies:** Story 17.1

---

#### Story 17.3: Create Act V Scenarios (Belintash)
**Story Points:** 8  
**Priority:** Critical

**User Story:**
As a player, I want to play Act V so that I reach the finale.

**Acceptance Criteria:**
- [ ] ~15 Act V scenarios implemented
- [ ] Location: Belintash sacred rock + underground
- [ ] 7 moneta keys required to enter
- [ ] Underground navigation
- [ ] Trap and puzzle sections
- [ ] Final guardian encounter
- [ ] Golden Chariot discovery
- [ ] Act V completion leads to Epilogue

**Technical Notes:**
- Implement scenarios from MAIN-QUEST-OUTLINE.md Act V
- Holy Relic lost before finale
- Multiple entry attempts allowed
- Final boss: Guardian or Cultist leader

**Dependencies:** Story 17.2

---

#### Story 17.4: Create Epilogue Scenarios (4 Variants)
**Story Points:** 8  
**Priority:** Critical

**User Story:**
As a player, I want to see an ending based on my choices so that my journey concludes meaningfully.

**Acceptance Criteria:**
- [ ] 4 epilogue variants implemented
- [ ] Epilogue I: Voice of Vanga (prophetic vision)
- [ ] Epilogue II: Letters and Heirs (legacy continuation)
- [ ] Epilogue III: Archaeologists (modern discovery)
- [ ] Epilogue IV: Traces of Gold (final resolution)
- [ ] Ending selection based on karma, choices, companions
- [ ] Credits sequence
- [ ] New Game+ unlock

**Technical Notes:**
- Epilogue selection formula based on multiple factors
- Each epilogue 3-4 scenarios
- Show player stats and journey summary

**Dependencies:** Story 17.3

---

## Epic 18: Side Quests (Batch 1)

**Priority:** High  
**Category:** Content  
**Estimated Effort:** 26 SP  
**Dependencies:** Epic 6, Epic 11  
**Sprint Target:** Sprint 20-21

### Description
Implement side quests for Kamenitsa, Mostovo/Gornoslav, and Bachkovo (~30 side quests).

### User Stories

#### Story 18.1: Create Kamenitsa Side Quests
**Story Points:** 8  
**Priority:** High

**User Story:**
As a player, I want side quests in Kamenitsa so that I can explore the village.

**Acceptance Criteria:**
- [ ] 13 side quests implemented (Help: 5, Combat: 3, Mystery: 3, Gathering: 2)
- [ ] Quests: Mice in cellar, Lost sheep, Water for Baba Pena, etc.
- [ ] Set bonus: Village support (discount, morale boost)
- [ ] Quest interconnections work
- [ ] All quests tested

**Technical Notes:**
- Implement from SIDE-QUESTS.md Kamenitsa section
- Use quest templates from game bible
- Set flags for quest completion

**Dependencies:** Epic 6, Epic 11

---

#### Story 18.2: Create Mostovo/Gornoslav Side Quests
**Story Points:** 8  
**Priority:** High

**User Story:**
As a player, I want side quests in Mostovo so that I can explore the mountains.

**Acceptance Criteria:**
- [ ] 11 side quests implemented (Help: 4, Combat: 3, Mystery: 4)
- [ ] Quests: Herbs for Kalina, Sick child, Wolf threat, etc.
- [ ] Introduce Baба Ruska (magic teacher)
- [ ] Set bonus: Mountain paths unlocked
- [ ] All quests tested

**Technical Notes:**
- Implement from SIDE-QUESTS.md Mostovo section
- Link to main quest (Baба Ruska teaches magic)

**Dependencies:** Epic 6, Epic 11

---

#### Story 18.3: Create Bachkovo Monastery Side Quests
**Story Points:** 5  
**Priority:** High

**User Story:**
As a player, I want side quests at the monastery so that I can explore holy sites.

**Acceptance Criteria:**
- [ ] 6 side quests implemented (Help: 4, Mystery: 2)
- [ ] Quests: Library manuscripts, Pilgrim in need, Secret of Kluvia, etc.
- [ ] Moneta key #2 obtainable (Kluvia quest)
- [ ] Set bonus: Monastery blessing (buff)
- [ ] All quests tested

**Technical Notes:**
- Implement from SIDE-QUESTS.md Bachkovo section
- Link to main quest (Moneta key)

**Dependencies:** Epic 6, Epic 11

---

#### Story 18.4: Create Krustova Gora Side Quests
**Story Points:** 5  
**Priority:** High

**User Story:**
As a player, I want side quests at Krustova Gora so that I can find the Holy Relic.

**Acceptance Criteria:**
- [ ] 3 side quests implemented (Mystery: 3)
- [ ] Quests: Piece of Cross, Last wish, Hermit's secret
- [ ] Moneta key #7 obtainable (Hermit quest)
- [ ] Holy Relic location discovered
- [ ] All quests tested

**Technical Notes:**
- Implement from SIDE-QUESTS.md Krustova Gora section
- Critical for Act IV progression

**Dependencies:** Epic 6, Epic 11

---

## Epic 19: Side Quests (Batch 2)

**Priority:** High  
**Category:** Content  
**Estimated Effort:** 29 SP  
**Dependencies:** Epic 18  
**Sprint Target:** Sprint 21-22

### Description
Implement side quests for Stanimaka, Philippopolis, Zabardo, and Road events (~35 side quests).

### User Stories

#### Story 19.1: Create Stanimaka Side Quests
**Story Points:** 8  
**Priority:** High

**User Story:**
As a player, I want side quests in Stanimaka so that I can explore the town.

**Acceptance Criteria:**
- [ ] 9 side quests implemented (Help: 4, Combat: 3, Mystery: 2, Romance: 1)
- [ ] Quests: Nikifor's package, Lost document, Tournament, etc.
- [ ] Romance subplot: Maria's letters
- [ ] Set bonus: Town security (reduced encounters)
- [ ] All quests tested

**Technical Notes:**
- Implement from uploaded SIDE-QUESTS Stanimaka files
- Romance quest affects epilogue

**Dependencies:** Epic 18

---

#### Story 19.2: Create Philippopolis Side Quests
**Story Points:** 10  
**Priority:** High

**User Story:**
As a player, I want side quests in Philippopolis so that I can explore the city.

**Acceptance Criteria:**
- [ ] 10 side quests implemented (Help: 4, Combat: 3, Mystery: 4)
- [ ] Quests: Elena's library, Assassination plot, Underground secrets, etc.
- [ ] Companion unlock: Elena (after library quest)
- [ ] Moneta key #4 obtainable (Underground quest)
- [ ] Set bonus: City influence (access)
- [ ] All quests tested

**Technical Notes:**
- Implement from uploaded SIDE-QUESTS Philippopolis files
- Complex urban quests with intrigue

**Dependencies:** Epic 18

---

#### Story 19.3: Create Zabardo/Wondrous Bridges Side Quests
**Story Points:** 6  
**Priority:** High

**User Story:**
As a player, I want side quests at Zabardo so that I can prepare for the finale.

**Acceptance Criteria:**
- [ ] 5 side quests implemented (Combat: 3, Mystery: 2)
- [ ] Quests: Sons of Snake cult, Rescue victims, Dragon tears, etc.
- [ ] Link to main quest (cult confrontation)
- [ ] Set bonus: Warfront stabilized (navigation bonus)
- [ ] All quests tested

**Technical Notes:**
- Implement from uploaded SIDE-QUESTS Zabardo files
- High difficulty quests

**Dependencies:** Epic 18

---

#### Story 19.4: Create Road Event Side Quests
**Story Points:** 5  
**Priority:** Medium

**User Story:**
As a player, I want road events so that travel is interesting.

**Acceptance Criteria:**
- [ ] 5 road events implemented (Trail: 5)
- [ ] Events: Merchant and bandits, Lost caravan, Bridge spirits, etc.
- [ ] Events trigger during travel
- [ ] Set bonus: Safe corridor (reduced encounters)
- [ ] All events tested

**Technical Notes:**
- Implement from uploaded SIDE-QUESTS Trail files
- Random event triggers

**Dependencies:** Epic 14, Epic 18

---

## Epic 20: Item & Enemy Content

**Priority:** Medium  
**Category:** Content  
**Estimated Effort:** 5 SP  
**Dependencies:** Epic 7, Epic 8  
**Sprint Target:** Sprint 22

### Description
Populate item database and enemy bestiary with all content.

### User Stories

#### Story 20.1: Populate Item Database
**Story Points:** 3  
**Priority:** High

**User Story:**
As a developer, I want all items in the database so that they can be used in the game.

**Acceptance Criteria:**
- [ ] 100+ items added to database (JSON)
- [ ] Categories: weapons (15+), armor (12+), consumables (30+), materials (20+), quest items (20+)
- [ ] All item stats defined
- [ ] Item icons assigned (or placeholder)
- [ ] Item validation passed

**Technical Notes:**
- Import from ITEMS.md
- Validate all item references in quests and scenarios
- Create placeholder icons if needed

**Dependencies:** Epic 10

---

#### Story 20.2: Populate Enemy Bestiary
**Story Points:** 2  
**Priority:** High

**User Story:**
As a developer, I want all enemies in the bestiary so that they can appear in combat.

**Acceptance Criteria:**
- [ ] 20+ enemies added to database (JSON)
- [ ] Categories: animals (5), humans (8), magical creatures (4), bosses (3)
- [ ] All enemy stats defined (HP, armor, abilities, loot)
- [ ] Enemy AI strategies assigned
- [ ] Enemy icons/sprites assigned

**Technical Notes:**
- Import from BESTIARY.md
- Balance enemy stats for progression
- Define loot tables

**Dependencies:** Epic 8

---

# DLC Modules Epics

## Epic 21: DLC-01 Belintash Crack

**Priority:** Medium  
**Category:** DLC  
**Estimated Effort:** 18 SP  
**Dependencies:** Epic 17  
**Sprint Target:** Sprint 23

### Description
Implement DLC-01: Belintash Crack expansion (engineering/rescue theme, 3 quests).

### User Stories

#### Story 21.1: Create DLC-01 Infrastructure
**Story Points:** 3  
**Priority:** High

**User Story:**
As a developer, I want DLC-01 structure so that content can be loaded separately.

**Acceptance Criteria:**
- [ ] DLC folder structure created
- [ ] DLC config file (metadata)
- [ ] DLC content loader implemented
- [ ] DLC state namespace created
- [ ] DLC unlock condition (completed main game)
- [ ] DLC purchase flow (if applicable)

**Technical Notes:**
```
/dlc/belintash-crack/
├── config.json
├── scenarios/
├── quests.json
├── capabilities.json
└── assets/
```

**Dependencies:** Epic 17

---

#### Story 21.2: Implement DLC-01 Quests
**Story Points:** 8  
**Priority:** High

**User Story:**
As a player, I want DLC-01 quests so that I can experience new content.

**Acceptance Criteria:**
- [ ] Quest 1: Stabilize Vault (~5 scenarios)
- [ ] Quest 2: Rescue Archivists (~5 scenarios)
- [ ] Quest 3: Shattered Vision (~5 scenarios)
- [ ] DLC mechanics: collapse_stage, brace_kit, calcify spell
- [ ] DLC state tracked separately
- [ ] All quests tested

**Technical Notes:**
- Implement from DLC-01 game bible section
- New mechanics: hazard timer, support nodes
- Rescue mechanics

**Dependencies:** Story 21.1

---

#### Story 21.3: Test DLC-01 Integration
**Story Points:** 3  
**Priority:** Medium

**User Story:**
As a developer, I want DLC-01 tested so that it integrates smoothly.

**Acceptance Criteria:**
- [ ] DLC loads without errors
- [ ] DLC content accessible after main game
- [ ] DLC state isolated from main game
- [ ] DLC saves correctly
- [ ] DLC can be unloaded
- [ ] No conflicts with main game

**Technical Notes:**
- Test with and without DLC loaded
- Verify save compatibility
- Check for memory leaks

**Dependencies:** Story 21.2

---

#### Story 21.4: Create DLC-01 Assets
**Story Points:** 2  
**Priority:** Low

**User Story:**
As a player, I want DLC-01 to have unique visuals so that it feels distinct.

**Acceptance Criteria:**
- [ ] DLC-specific location images
- [ ] New item icons (brace_kit, etc.)
- [ ] DLC quest icons
- [ ] DLC achievement icons

**Technical Notes:**
- Can use placeholder assets initially
- Commission/create final assets later

**Dependencies:** Story 21.2

---

#### Story 21.5: Create DLC-01 Documentation
**Story Points:** 2  
**Priority:** Low

**User Story:**
As a player, I want to understand DLC-01 so that I know what to expect.

**Acceptance Criteria:**
- [ ] DLC description written
- [ ] DLC features listed
- [ ] DLC gameplay guide created
- [ ] DLC added to store listing
- [ ] DLC trailer script (optional)

**Technical Notes:**
- Marketing copy for App Store/Play Store
- In-game DLC info screen

**Dependencies:** Story 21.2

---

## Epic 22: DLC-02 Next Guardians

**Priority:** Medium  
**Category:** DLC  
**Estimated Effort:** 18 SP  
**Dependencies:** Epic 21  
**Sprint Target:** Sprint 24

### Description
Implement DLC-02: Next Guardians expansion (town management theme, 3 quests).

### User Stories

#### Story 22.1: Create DLC-02 Infrastructure
**Story Points:** 3  
**Priority:** High

**User Story:**
As a developer, I want DLC-02 structure so that content can be loaded.

**Acceptance Criteria:**
- [ ] DLC folder structure created
- [ ] DLC config file
- [ ] DLC content loader
- [ ] DLC state namespace (legacy_rank, town_morale, structures)
- [ ] DLC unlock condition
- [ ] DLC purchase flow

**Technical Notes:**
- Similar structure to DLC-01
- Town management state

**Dependencies:** Epic 21

---

#### Story 22.2: Implement DLC-02 Quests
**Story Points:** 8  
**Priority:** High

**User Story:**
As a player, I want DLC-02 quests so that I can manage the town.

**Acceptance Criteria:**
- [ ] Quest 1: Initiation (~5 scenarios)
- [ ] Quest 2: Build Citadel (~5 scenarios)
- [ ] Quest 3: Legacy Trials (~5 scenarios)
- [ ] DLC mechanics: building construction, resource management, heir selection
- [ ] Town buildings: tower, library, ward, training yard, ritual grove
- [ ] All quests tested

**Technical Notes:**
- Implement from DLC-02 game bible section
- Resource system: wood, ore, arcana, labor
- Seasonal mechanics

**Dependencies:** Story 22.1

---

#### Story 22.3-22.5: [Similar to DLC-01]
**Story Points:** 3, 2, 2  
**Priority:** Medium/Low

[Integration testing, assets, documentation - same pattern as Epic 21]

---

## Epic 23: DLC-03 Balkan Trail

**Priority:** Medium  
**Category:** DLC  
**Estimated Effort:** 18 SP  
**Dependencies:** Epic 22  
**Sprint Target:** Sprint 25

### Description
Implement DLC-03: Balkan Trail expansion (expedition sandbox theme, 3 quests).

### User Stories

[Similar structure to Epic 21-22]

**Key Features:**
- Quest 1: Map of Light
- Quest 2: Guardians' Pass
- Quest 3: Beam over Salonika
- Mechanics: convoy management, alliance tracks (Byzantine/Latin/Voinuk), hex-based traversal

---

## Epic 24: DLC-04 Laut Stronghold

**Priority:** Medium  
**Category:** DLC  
**Estimated Effort:** 18 SP  
**Dependencies:** Epic 23  
**Sprint Target:** Sprint 26

### Description
Implement DLC-04: Laut Stronghold expansion (tactical defense theme, 3 quests).

### User Stories

[Similar structure to Epic 21-23]

**Key Features:**
- Quest 1: Shadows
- Quest 2: Three Walls
- Quest 3: Oath
- Mechanics: stronghold defense, ward power, espionage, siege phases

---

# Polish & Release Epics

## Epic 25: Localization

**Priority:** High  
**Category:** Polish  
**Estimated Effort:** 13 SP  
**Dependencies:** Epic 17, Epic 19  
**Sprint Target:** Sprint 27

### Description
Implement localization system and translate content to Bulgarian and English.

### User Stories

#### Story 25.1: Setup Localization Framework
**Story Points:** 3  
**Priority:** Critical

**User Story:**
As a developer, I want a localization framework so that I can support multiple languages.

**Acceptance Criteria:**
- [ ] i18next or react-i18next installed
- [ ] Language files structure created (bg.json, en.json)
- [ ] Language switching implemented
- [ ] Language preference saved
- [ ] Fallback to English if translation missing
- [ ] RTL support (if needed in future)

**Technical Notes:**
```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: { bg: { translation: bg }, en: { translation: en } },
  lng: 'bg',
  fallbackLng: 'en',
});
```

**Dependencies:** Epic 1

---

#### Story 25.2: Translate UI Text
**Story Points:** 3  
**Priority:** High

**User Story:**
As a player, I want UI in my language so that I can understand the game.

**Acceptance Criteria:**
- [ ] All UI strings extracted to language files
- [ ] Bulgarian translations complete
- [ ] English translations complete
- [ ] Button labels, screen titles, menu items translated
- [ ] Error messages translated
- [ ] No hardcoded strings in components

**Technical Notes:**
- Use t() function from i18next
- Example: `<Text>{t('common.continue')}</Text>`
- ~200-300 UI strings

**Dependencies:** Story 25.1

---

#### Story 25.3: Translate Scenario Content
**Story Points:** 8  
**Priority:** High

**User Story:**
As a player, I want scenarios in my language so that I can enjoy the story.

**Acceptance Criteria:**
- [ ] Prologue scenarios translated (BG + EN)
- [ ] Act I scenarios translated
- [ ] Act II scenarios translated
- [ ] All main quest scenarios translated
- [ ] Side quests translated
- [ ] Quality check by native speakers

**Technical Notes:**
- 120+ main quest scenarios
- 65+ side quest scenarios
- ~150K words total
- Consider professional translation service

**Dependencies:** Story 25.1, Epic 17, Epic 19

---

#### Story 25.4: Translate Game Data
**Story Points:** 2  
**Priority:** Medium

**User Story:**
As a player, I want items and spells in my language so that I understand mechanics.

**Acceptance Criteria:**
- [ ] Item names and descriptions translated
- [ ] Spell names and descriptions translated
- [ ] Quest titles and descriptions translated
- [ ] NPC names and titles translated (or kept authentic)
- [ ] Achievement names and descriptions translated

**Technical Notes:**
- 100+ items, 40+ spells, 65+ quests, 50+ NPCs
- Some names stay in Bulgarian (e.g., "Baene za bolesti")
- Provide English transliteration/explanation

**Dependencies:** Story 25.1

---

## Epic 26: Performance Optimization

**Priority:** High  
**Category:** Polish  
**Estimated Effort:** 13 SP  
**Dependencies:** Epic 17  
**Sprint Target:** Sprint 28

### Description
Optimize app performance to meet 60 FPS and < 3s cold start targets.

### User Stories

#### Story 26.1: Profile and Identify Bottlenecks
**Story Points:** 3  
**Priority:** Critical

**User Story:**
As a developer, I want to profile the app so that I can find performance issues.

**Acceptance Criteria:**
- [ ] React DevTools Profiler used
- [ ] Flipper performance monitoring setup
- [ ] Identify slow renders (> 16ms)
- [ ] Identify unnecessary re-renders
- [ ] Identify memory leaks
- [ ] Create performance report

**Technical Notes:**
- Use React DevTools Profiler
- Use Flipper for native performance
- Profile on low-end devices

**Dependencies:** Epic 17

---

#### Story 26.2: Optimize Rendering Performance
**Story Points:** 5  
**Priority:** High

**User Story:**
As a player, I want smooth UI so that the game feels responsive.

**Acceptance Criteria:**
- [ ] Implement React.memo for expensive components
- [ ] Implement useMemo for expensive calculations
- [ ] Implement useCallback for event handlers
- [ ] Optimize FlatList rendering
- [ ] Reduce re-renders via proper state structure
- [ ] Achieve 60 FPS target

**Technical Notes:**
- Use React DevTools to verify optimizations
- Memoize selectors in Zustand
- Use getItemLayout for FlatLists

**Dependencies:** Story 26.1

---

#### Story 26.3: Optimize Bundle Size
**Story Points:** 3  
**Priority:** Medium

**User Story:**
As a player, I want small app size so that download is fast.

**Acceptance Criteria:**
- [ ] Remove unused dependencies
- [ ] Enable Hermes engine
- [ ] Enable ProGuard/R8 (Android)
- [ ] Optimize images (compress, resize)
- [ ] Bundle size < 300MB for base game
- [ ] Each DLC < 50MB

**Technical Notes:**
- Use `react-native-bundle-visualizer`
- Compress images with TinyPNG
- Use WebP format for images

**Dependencies:** Story 26.1

---

#### Story 26.4: Optimize Memory Usage
**Story Points:** 2  
**Priority:** Medium

**User Story:**
As a developer, I want low memory usage so that the app doesn't crash on low-end devices.

**Acceptance Criteria:**
- [ ] Fix memory leaks (event listeners, intervals)
- [ ] Implement image caching with size limits
- [ ] Unload unused assets
- [ ] Limit cache sizes
- [ ] Memory usage < 250MB

**Technical Notes:**
- Use Flipper Memory Profiler
- Clear timers on component unmount
- Use react-native-fast-image for caching

**Dependencies:** Story 26.1

---

## Epic 27: Testing & QA

**Priority:** Critical  
**Category:** Polish  
**Estimated Effort:** 18 SP  
**Dependencies:** Epic 26  
**Sprint Target:** Sprint 29-30

### Description
Comprehensive testing of all game systems and content.

### User Stories

#### Story 27.1: Create Test Plan
**Story Points:** 2  
**Priority:** Critical

**User Story:**
As a QA tester, I want a test plan so that I can test systematically.

**Acceptance Criteria:**
- [ ] Test cases for all features
- [ ] Test scenarios for all quests
- [ ] Edge case scenarios defined
- [ ] Device testing matrix created
- [ ] Regression test suite defined

**Technical Notes:**
- Cover all Epics
- Prioritize critical path (main quest)
- Test on multiple devices

**Dependencies:** Epic 26

---

#### Story 27.2: System Testing
**Story Points:** 5  
**Priority:** Critical

**User Story:**
As a QA tester, I want to test all systems so that they work correctly.

**Acceptance Criteria:**
- [ ] Test combat system thoroughly
- [ ] Test magic system thoroughly
- [ ] Test inventory and economy
- [ ] Test quest system
- [ ] Test save/load system
- [ ] Test all NPC interactions
- [ ] Document all bugs

**Technical Notes:**
- Create bug reports in tracking system
- Prioritize bugs: Critical, High, Medium, Low
- Verify fixes

**Dependencies:** Story 27.1

---

#### Story 27.3: Content Testing
**Story Points:** 8  
**Priority:** High

**User Story:**
As a QA tester, I want to test all content so that there are no progression blockers.

**Acceptance Criteria:**
- [ ] Play through entire main quest
- [ ] Test all side quests
- [ ] Test all DLC content
- [ ] Verify all choices work
- [ ] Verify all endings accessible
- [ ] Check for typos and errors
- [ ] Document all issues

**Technical Notes:**
- Multiple playthroughs with different choices
- Check all branching paths
- Verify quest flags and counters

**Dependencies:** Story 27.1

---

#### Story 27.4: Device Testing
**Story Points:** 3  
**Priority:** High

**User Story:**
As a QA tester, I want to test on multiple devices so that compatibility is ensured.

**Acceptance Criteria:**
- [ ] Test on iOS devices (iPhone SE, 12, 14, iPad)
- [ ] Test on Android devices (Samsung, Google Pixel, OnePlus)
- [ ] Test on low-end devices
- [ ] Test on tablets
- [ ] Verify performance meets targets on all devices
- [ ] Document device-specific issues

**Technical Notes:**
- Use TestFlight (iOS) and Internal Testing (Android)
- Focus on devices from 2020+

**Dependencies:** Story 27.2

---

## Epic 28: Release & Deployment

**Priority:** Critical  
**Category:** Release  
**Estimated Effort:** 14 SP  
**Dependencies:** Epic 27  
**Sprint Target:** Sprint 31

### Description
Prepare and execute app release to App Store and Google Play Store.

### User Stories

#### Story 28.1: Prepare App Store Listing
**Story Points:** 3  
**Priority:** Critical

**User Story:**
As a developer, I want App Store listing ready so that I can submit the app.

**Acceptance Criteria:**
- [ ] App description written (BG + EN)
- [ ] Keywords researched and set
- [ ] Screenshots prepared (5+ per platform)
- [ ] App icon finalized (1024x1024)
- [ ] Privacy policy written
- [ ] Content rating obtained
- [ ] Pricing and availability set

**Technical Notes:**
- iOS: App Store Connect
- Android: Google Play Console
- Include DLC information

**Dependencies:** Epic 27

---

#### Story 28.2: Submit to App Stores
**Story Points:** 3  
**Priority:** Critical

**User Story:**
As a developer, I want to submit the app so that it can be reviewed.

**Acceptance Criteria:**
- [ ] iOS build submitted to App Store Connect
- [ ] Android build submitted to Google Play Console
- [ ] All store requirements met
- [ ] Beta testing completed (TestFlight, Internal Testing)
- [ ] Review notes provided
- [ ] Response to review feedback (if needed)

**Technical Notes:**
- Use EAS Build for production builds
- Expect 1-7 days review time
- Address any rejections promptly

**Dependencies:** Story 28.1

---

#### Story 28.3: Launch Marketing Materials
**Story Points:** 3  
**Priority:** High

**User Story:**
As a marketer, I want marketing materials so that I can promote the game.

**Acceptance Criteria:**
- [ ] Launch trailer created (1-2 minutes)
- [ ] Gameplay video created
- [ ] Press kit prepared (screenshots, description, contact)
- [ ] Social media posts scheduled
- [ ] Influencer outreach completed
- [ ] Landing page created (optional)

**Technical Notes:**
- Target Bulgarian gaming community
- Reach out to Bulgarian gaming media
- Consider Reddit, Discord, Twitter/X

**Dependencies:** Story 28.1

---

#### Story 28.4: Post-Launch Support Plan
**Story Points:** 2  
**Priority:** High

**User Story:**
As a developer, I want a support plan so that I can handle post-launch issues.

**Acceptance Criteria:**
- [ ] Bug reporting system setup (email, form)
- [ ] Hotfix process defined
- [ ] OTA update strategy defined
- [ ] Community support channels setup (Discord, Reddit)
- [ ] Update schedule planned (bug fixes, DLC releases)

**Technical Notes:**
- Use EAS Update for hotfixes
- Monitor crash reports (Sentry)
- Respond to reviews

**Dependencies:** Story 28.2

---

#### Story 28.5: Post-Launch Analytics
**Story Points:** 3  
**Priority:** Medium

**User Story:**
As a product owner, I want analytics so that I can track success.

**Acceptance Criteria:**
- [ ] Track downloads and installs
- [ ] Track active users (DAU, MAU)
- [ ] Track retention (D1, D7, D30)
- [ ] Track completion rate
- [ ] Track DLC purchases
- [ ] Track user reviews and ratings
- [ ] Monthly analytics reports

**Technical Notes:**
- Use App Store Connect Analytics and Google Play Console
- Respect privacy (no personal data)
- Focus on aggregate metrics

**Dependencies:** Story 28.2

---

# Dependency Map

## Critical Path (Must Complete in Order)

```
Epic 1 (Setup)
  ↓
Epic 2 (Game Engine)
  ↓
Epic 3 (State Management)
  ↓
Epic 4 (UI Framework)
  ↓
Epic 5 (Navigation)
  ↓
Epic 6 (Scenario System)
  ↓
Epic 16 (Main Quest Acts I-II)
  ↓
Epic 17 (Main Quest Acts III-V)
  ↓
Epic 25 (Localization)
  ↓
Epic 26 (Performance)
  ↓
Epic 27 (Testing)
  ↓
Epic 28 (Release)
```

## Parallel Development Tracks

**Track A: Core Systems (Sprints 6-16)**
- Epic 7 (Character System)
- Epic 8 (Combat System)
- Epic 9 (Magic System)
- Epic 10 (Economy & Inventory)
- Epic 11 (Quest System)
- Epic 12 (NPC & Relationship)
- Epic 13 (Companion System)
- Epic 14 (Travel & Exploration)
- Epic 15 (Save/Load System)

**Track B: Content Creation (Sprints 17-22)**
- Epic 18 (Side Quests Batch 1)
- Epic 19 (Side Quests Batch 2)
- Epic 20 (Items & Enemies)

**Track C: DLC Development (Sprints 23-26)**
- Epic 21 (DLC-01)
- Epic 22 (DLC-02)
- Epic 23 (DLC-03)
- Epic 24 (DLC-04)

## Dependency Matrix

| Epic | Depends On | Can Start After Sprint |
|------|-----------|------------------------|
| Epic 1 | None | Sprint 1 |
| Epic 2 | Epic 1 | Sprint 2 |
| Epic 3 | Epic 2 | Sprint 3 |
| Epic 4 | Epic 3 | Sprint 4 |
| Epic 5 | Epic 4 | Sprint 5 |
| Epic 6 | Epic 2, 5 | Sprint 6 |
| Epic 7 | Epic 3 | Sprint 7 |
| Epic 8 | Epic 3, 7 | Sprint 8 |
| Epic 9 | Epic 3, 7 | Sprint 10 |
| Epic 10 | Epic 3, 7 | Sprint 11 |
| Epic 11 | Epic 3, 6 | Sprint 12 |
| Epic 12 | Epic 3, 6 | Sprint 13 |
| Epic 13 | Epic 12 | Sprint 14 |
| Epic 14 | Epic 6 | Sprint 15 |
| Epic 15 | Epic 3 | Sprint 16 |
| Epic 16 | Epic 6 | Sprint 17 |
| Epic 17 | Epic 16 | Sprint 18 |
| Epic 18 | Epic 6, 11 | Sprint 20 |
| Epic 19 | Epic 18 | Sprint 21 |
| Epic 20 | Epic 7, 8 | Sprint 22 |
| Epic 21-24 | Epic 17 | Sprint 23-26 |
| Epic 25 | Epic 17, 19 | Sprint 27 |
| Epic 26 | Epic 17 | Sprint 28 |
| Epic 27 | Epic 26 | Sprint 29 |
| Epic 28 | Epic 27 | Sprint 31 |

---

# Sprint Planning Recommendations

## Sprint Duration
**Recommended:** 2 weeks per sprint

## Team Velocity Assumptions
- **Small Team (1-2 devs):** 20-25 SP per sprint
- **Medium Team (3-4 devs):** 30-35 SP per sprint
- **Large Team (5+ devs):** 40-50 SP per sprint

## Sprint Breakdown (for Medium Team, 30-35 SP/sprint)

### Foundation Phase (Sprints 1-5)
- **Sprint 1:** Epic 1 (21 SP) + Epic 2 start (13 SP) = **34 SP**
- **Sprint 2:** Epic 2 finish (21 SP) + Epic 3 start (10 SP) = **31 SP**
- **Sprint 3:** Epic 3 finish (11 SP) + Epic 4 (13 SP) + Epic 5 start (5 SP) = **29 SP**
- **Sprint 4:** Epic 5 finish (4 SP) + Epic 6 start (25 SP) = **29 SP**
- **Sprint 5:** Epic 6 finish (9 SP) + Epic 7 start (21 SP) = **30 SP**

### Systems Development Phase (Sprints 6-16)
- **Sprint 6:** Epic 7 finish (5 SP) + Epic 8 start (25 SP) = **30 SP**
- **Sprint 7:** Epic 8 continue (34 SP total, split over 2 sprints)
- **Sprint 8:** Epic 8 finish + Epic 9 start
- **Sprint 9:** Epic 9 continue + Epic 10 start
- **Sprint 10:** Epic 10 continue + Epic 11 start
- **Sprint 11:** Epic 11 finish + Epic 12 start
- **Sprint 12:** Epic 12 continue + Epic 13 start
- **Sprint 13:** Epic 13 continue + Epic 14 start
- **Sprint 14:** Epic 14 finish + Epic 15 start
- **Sprint 15:** Epic 15 finish
- **Sprint 16:** **Buffer Sprint #1** – risk mitigation, bug fixing, polish

### Content Creation Phase (Sprints 17-22)
- **Sprint 17:** Epic 16 (Main Quest Acts I-II) - 21 SP
- **Sprint 18:** Epic 17 start (Acts III-V) - 34 SP (split)
- **Sprint 19:** Epic 17 continue
- **Sprint 20:** Epic 17 finish + Epic 18 start (Side Quests Batch 1)
- **Sprint 21:** Epic 18 finish + Epic 19 start (Side Quests Batch 2)
- **Sprint 22:** Epic 19 finish + Epic 20 (Items & Enemies)

### DLC Development Phase (Sprints 23-26)
- **Sprint 23:** Epic 21 (DLC-01) - 18 SP
- **Sprint 24:** Epic 22 (DLC-02) - 18 SP
- **Sprint 25:** Epic 23 (DLC-03) - 18 SP
- **Sprint 26:** Epic 24 (DLC-04) - 18 SP

### Polish & Release Phase (Sprints 27-31)
- **Sprint 27:** Epic 25 (Localization) - 13 SP
- **Sprint 28:** Epic 26 (Performance) - 13 SP
- **Sprint 29:** Epic 27 start (Testing) - 18 SP (split)
- **Sprint 30:** Epic 27 finish + Epic 28 start (Release prep)
- **Sprint 30.5:** **Buffer Sprint #2** – launch readiness, regression fixes, store prep
- **Sprint 31:** Epic 28 finish (Launch!)

**Total: 31 sprints × 2 weeks = 62 weeks (~14 months)**

With efficient team and parallel work on content:
**Optimistic: 18-20 sprints (~9 months)**

---

# Critical Path Analysis

## Must-Have for MVP (Minimum Viable Product)

### Core Functionality (Sprints 1-16)
1. Project setup and infrastructure ✅
2. Game engine (scenario loading, choices) ✅
3. Character system (stats, leveling) ✅
4. Combat system (basic turn-based) ✅
5. Save/load system ✅

### Minimum Content (Sprints 17-20)
6. Prologue + Act I (playable demo) ✅
7. Acts II-III (mid-game) ✅
8. Core side quests (20-30 quests) ✅

**MVP Timeline: ~20 sprints (10 months)**

## Nice-to-Have (Post-MVP)

### Enhanced Systems
- Magic system (can be simplified initially)
- Companion system (can launch with fewer companions)
- Travel random encounters (can be added later)

### Additional Content
- Acts IV-V (can be added as update)
- Full side quest catalog (launch with subset)
- All 4 DLCs (stagger releases post-launch)

### Polish
- Advanced localization (start with 2 languages)
- Performance optimization (ongoing)
- Additional testing (continuous)

---

# Risk Assessment & Mitigation

## High-Risk Areas

### Content Volume Risk
**Risk:** 150+ scenarios is massive amount of writing  
**Mitigation:**
- Start with MVP content (Prologue + Acts I-II)
- Release remaining acts as updates
- Use scenario templates to speed creation

### Technical Complexity Risk
**Risk:** Multiple interconnected systems may have bugs  
**Mitigation:**
- Extensive unit testing for each system
- Integration testing between systems
- Alpha/beta testing phase

### Scope Creep Risk
**Risk:** Feature additions during development  
**Mitigation:**
- Strict adherence to PRD
- Feature freeze after Epic 15
- Backlog for post-launch features

### Performance Risk
**Risk:** Game may be slow on low-end devices  
**Mitigation:**
- Performance testing from Sprint 10 onwards
- Dedicated optimization sprint
- Target devices from 2020+

---

**END OF EPIC BREAKDOWN DOCUMENT**

**Next Steps:**
1. Review and approve Epic Breakdown
2. Import Epics into Windsurf/BMAD system
3. Refine individual User Stories
4. Begin Sprint 1 implementation

**Total Project Scope:**
- **28 Epics**
- **145 User Stories**
- **620 Story Points**
- **~9-14 months development** (team size dependent)
- **BMAD Enterprise Track** ✅
