# User Stories - Epic 2: Core Game Engine
## The Golden Chariot of Belintash

**Epic:** Epic 2 - Core Game Engine  
**Total Stories:** 8  
**Total Story Points:** 34 SP  
**Sprint:** Sprint 2  
**Priority:** Critical  
**Version:** 1.0  
**Date:** January 12, 2026

---

## Epic Overview

**Epic Goal:** Build the core game engine that powers scenario processing, choice evaluation, and consequence application.

**Epic Success Criteria:**
- Scenarios load and parse correctly from JSON
- Conditions evaluate properly (flags, stats, items, relationships)
- Consequences apply correctly to game state
- Variable interpolation works in text
- Skill checks calculate correctly
- Choice processing handles success/failure paths
- Engine achieves 90%+ test coverage
- LRU cache improves scenario load performance by 50%+

**Dependencies:** Epic 1 (Project Setup must be complete)

**Estimated Duration:** 6-7 days (Sprint 2)

**Why This Epic is Critical:**
The game engine is the heart of the application. Every scenario, choice, and consequence flows through this system. Getting it right is essential for the entire game to function.

---

## Table of Contents

- [Story 2.1: Define Game Engine Interface](#story-21-define-game-engine-interface)
- [Story 2.2: Implement Scenario Loader](#story-22-implement-scenario-loader)
- [Story 2.3: Implement Condition Evaluator](#story-23-implement-condition-evaluator)
- [Story 2.4: Implement Consequence Applicator](#story-24-implement-consequence-applicator)
- [Story 2.5: Implement Variable Interpolation](#story-25-implement-variable-interpolation)
- [Story 2.6: Implement Choice Processing](#story-26-implement-choice-processing)
- [Story 2.7: Implement Scenario Cache](#story-27-implement-scenario-cache)
- [Story 2.8: Write Engine Tests](#story-28-write-engine-tests)

---

## Story 2.1: Define Game Engine Interface

**Story ID:** 2.1  
**Story Points:** 3 SP  
**Priority:** Critical  
**Assignee:** Lead Developer  
**Sprint:** Sprint 2  
**Dependencies:** Epic 1 complete

### User Story

> **As a** game developer  
> **I want** a well-defined game engine interface  
> **So that** all game systems interact consistently and the engine is testable

### Detailed Description

Define TypeScript interfaces and types for the core game engine. This includes data models for scenarios, choices, conditions, consequences, and game state. These interfaces serve as the contract between all game systems.

Well-defined types enable:
- Type safety across the entire codebase
- IntelliSense support in IDE
- Compile-time error catching
- Clear documentation of data structures
- Easy testing with mock data

### Acceptance Criteria

#### Must Have
- [ ] Scenario interface defined with all required fields
- [ ] Choice interface defined with conditions and consequences
- [ ] Condition interface defined for all condition types (flag, stat, item, etc.)
- [ ] Consequence interface defined for all consequence types
- [ ] GameState interface defined with all state data
- [ ] SkillCheck interface defined
- [ ] All interfaces exported from types folder
- [ ] TypeScript compiles with strict mode
- [ ] All types documented with JSDoc comments

#### Should Have
- [ ] Type guards for runtime type checking
- [ ] Helper types for common patterns
- [ ] Validation schemas (Zod) for runtime validation

#### Nice to Have
- [ ] Generated documentation from types
- [ ] Examples of each interface

### Technical Implementation

#### Step 1: Create Types Directory Structure

```bash
mkdir -p src/game/types
touch src/game/types/index.ts
touch src/game/types/scenario.ts
touch src/game/types/condition.ts
touch src/game/types/consequence.ts
touch src/game/types/gameState.ts
touch src/game/types/skillCheck.ts
```

#### Step 2: Define Scenario Types

**File:** `src/game/types/scenario.ts`

```typescript
/**
 * Scenario Types
 * 
 * Defines the structure of game scenarios, which are the core narrative units.
 * Each scenario presents text to the player and offers choices that affect the story.
 */

import { Condition } from './condition';
import { Consequence } from './consequence';
import { SkillCheck } from './skillCheck';

/**
 * Complete scenario data structure
 */
export interface Scenario {
  /** Unique identifier for this scenario */
  id: string;
  
  /** Translation key for scenario title */
  titleKey: string;
  
  /** Translation key for main narrative text */
  textKey: string;
  
  /** Act number (0 for prologue) */
  act: number;
  
  /** Scene number within act */
  scene: number;
  
  /** Location ID where scenario takes place */
  locationId: string;
  
  /** Array of choices available to player */
  choices: Choice[];
  
  /** Conditions that must be met to access this scenario */
  prerequisites: Condition[];
  
  /** NPCs present in this scenario */
  npcsPresent: string[];
  
  /** Optional metadata */
  metadata?: ScenarioMetadata;
}

/**
 * A choice available to the player in a scenario
 */
export interface Choice {
  /** Unique identifier for choice (usually a, b, c, d) */
  id: string;
  
  /** Translation key for choice text */
  textKey: string;
  
  /** Conditions that must be met for choice to be available */
  conditions: Condition[];
  
  /** Optional skill check required for this choice */
  skillCheck?: SkillCheck;
  
  /** Consequences that occur when choice is selected */
  consequences: Consequence[];
  
  /** ID of next scenario on success (or always if no skill check) */
  nextScenario: string;
  
  /** ID of next scenario on skill check failure (if applicable) */
  nextScenarioOnFailure?: string;
}

/**
 * Optional metadata for scenarios
 */
export interface ScenarioMetadata {
  /** Author of scenario content */
  author?: string;
  
  /** Date scenario was created */
  createdDate?: string;
  
  /** Tags for categorization */
  tags?: string[];
  
  /** Internal notes */
  notes?: string;
}

/**
 * Type guard to check if object is a valid Scenario
 */
export function isScenario(obj: any): obj is Scenario {
  return (
    obj &&
    typeof obj.id === 'string' &&
    typeof obj.titleKey === 'string' &&
    typeof obj.textKey === 'string' &&
    typeof obj.act === 'number' &&
    typeof obj.scene === 'number' &&
    typeof obj.locationId === 'string' &&
    Array.isArray(obj.choices) &&
    Array.isArray(obj.prerequisites) &&
    Array.isArray(obj.npcsPresent)
  );
}

/**
 * Type guard to check if object is a valid Choice
 */
export function isChoice(obj: any): obj is Choice {
  return (
    obj &&
    typeof obj.id === 'string' &&
    typeof obj.textKey === 'string' &&
    Array.isArray(obj.conditions) &&
    Array.isArray(obj.consequences) &&
    typeof obj.nextScenario === 'string'
  );
}
```

#### Step 3: Define Condition Types

**File:** `src/game/types/condition.ts`

```typescript
/**
 * Condition Types
 * 
 * Conditions determine whether scenarios, choices, or other game elements
 * are available to the player based on game state.
 */

/**
 * Type of condition to evaluate
 */
export type ConditionType =
  | 'flag'           // Boolean flag check
  | 'counter'        // Numeric counter comparison
  | 'stat'           // Character stat comparison
  | 'skill'          // Character skill comparison
  | 'item'           // Item possession check
  | 'relationship'   // NPC relationship level check
  | 'level'          // Character level check
  | 'location'       // Current location check
  | 'time'           // Game time check
  | 'and'            // Logical AND of multiple conditions
  | 'or'             // Logical OR of multiple conditions
  | 'not';           // Logical NOT of a condition

/**
 * Comparison operators for numeric conditions
 */
export type ComparisonOperator =
  | 'equals'         // ==
  | 'not_equals'     // !=
  | 'greater_than'   // >
  | 'less_than'      // <
  | 'greater_equal'  // >=
  | 'less_equal';    // <=

/**
 * Base condition interface
 */
export interface BaseCondition {
  /** Type of condition */
  type: ConditionType;
}

/**
 * Flag condition - checks boolean flag value
 */
export interface FlagCondition extends BaseCondition {
  type: 'flag';
  
  /** Flag name to check */
  target: string;
  
  /** Expected value */
  value: boolean;
}

/**
 * Counter condition - compares numeric counter
 */
export interface CounterCondition extends BaseCondition {
  type: 'counter';
  
  /** Counter name to check */
  target: string;
  
  /** Comparison operator */
  operator: ComparisonOperator;
  
  /** Value to compare against */
  value: number;
}

/**
 * Stat condition - compares character stat
 */
export interface StatCondition extends BaseCondition {
  type: 'stat';
  
  /** Stat name (strength, intelligence, etc.) */
  target: string;
  
  /** Comparison operator */
  operator: ComparisonOperator;
  
  /** Value to compare against */
  value: number;
}

/**
 * Skill condition - compares character skill level
 */
export interface SkillCondition extends BaseCondition {
  type: 'skill';
  
  /** Skill name (persuasion, stealth, etc.) */
  target: string;
  
  /** Comparison operator */
  operator: ComparisonOperator;
  
  /** Value to compare against */
  value: number;
}

/**
 * Item condition - checks if player has item
 */
export interface ItemCondition extends BaseCondition {
  type: 'item';
  
  /** Item ID to check for */
  target: string;
  
  /** Minimum quantity required (default: 1) */
  quantity?: number;
  
  /** Whether item must be equipped (default: false) */
  equipped?: boolean;
}

/**
 * Relationship condition - checks NPC affinity level
 */
export interface RelationshipCondition extends BaseCondition {
  type: 'relationship';
  
  /** NPC ID */
  target: string;
  
  /** Comparison operator */
  operator: ComparisonOperator;
  
  /** Affinity value to compare against (-100 to 100) */
  value: number;
}

/**
 * Level condition - checks character level
 */
export interface LevelCondition extends BaseCondition {
  type: 'level';
  
  /** Comparison operator */
  operator: ComparisonOperator;
  
  /** Level to compare against */
  value: number;
}

/**
 * Location condition - checks current location
 */
export interface LocationCondition extends BaseCondition {
  type: 'location';
  
  /** Location ID to check */
  target: string;
}

/**
 * Time condition - checks game time
 */
export interface TimeCondition extends BaseCondition {
  type: 'time';
  
  /** Time period to check */
  period: 'day' | 'night' | 'morning' | 'afternoon' | 'evening';
}

/**
 * AND condition - all sub-conditions must be true
 */
export interface AndCondition extends BaseCondition {
  type: 'and';
  
  /** Conditions to check (all must be true) */
  conditions: Condition[];
}

/**
 * OR condition - at least one sub-condition must be true
 */
export interface OrCondition extends BaseCondition {
  type: 'or';
  
  /** Conditions to check (at least one must be true) */
  conditions: Condition[];
}

/**
 * NOT condition - negates a condition
 */
export interface NotCondition extends BaseCondition {
  type: 'not';
  
  /** Condition to negate */
  condition: Condition;
}

/**
 * Union type of all possible conditions
 */
export type Condition =
  | FlagCondition
  | CounterCondition
  | StatCondition
  | SkillCondition
  | ItemCondition
  | RelationshipCondition
  | LevelCondition
  | LocationCondition
  | TimeCondition
  | AndCondition
  | OrCondition
  | NotCondition;

/**
 * Type guard to check if object is a valid Condition
 */
export function isCondition(obj: any): obj is Condition {
  return obj && typeof obj.type === 'string';
}
```

#### Step 4: Define Consequence Types

**File:** `src/game/types/consequence.ts`

```typescript
/**
 * Consequence Types
 * 
 * Consequences are actions that occur as a result of player choices.
 * They modify game state, give items, change relationships, etc.
 */

/**
 * Type of consequence action
 */
export type ConsequenceType =
  | 'flag'           // Set boolean flag
  | 'counter'        // Modify numeric counter
  | 'stat'           // Modify character stat
  | 'skill'          // Modify character skill
  | 'item'           // Add/remove item
  | 'experience'     // Give experience points
  | 'health'         // Modify health
  | 'mana'           // Modify mana
  | 'gold'           // Modify gold
  | 'relationship'   // Modify NPC relationship
  | 'unlock_shop'    // Unlock merchant shop
  | 'unlock_dialogue'// Unlock dialogue option
  | 'unlock_quest'   // Unlock quest
  | 'unlock_location'// Unlock location
  | 'trigger_event'  // Trigger custom event
  | 'set_location';  // Change player location

/**
 * Base consequence interface
 */
export interface BaseConsequence {
  /** Type of consequence */
  type: ConsequenceType;
}

/**
 * Flag consequence - sets a boolean flag
 */
export interface FlagConsequence extends BaseConsequence {
  type: 'flag';
  
  /** Flag name */
  target: string;
  
  /** Value to set */
  value: boolean;
}

/**
 * Counter consequence - modifies a numeric counter
 */
export interface CounterConsequence extends BaseConsequence {
  type: 'counter';
  
  /** Counter name */
  target: string;
  
  /** Action to perform */
  action: 'set' | 'increment' | 'decrement';
  
  /** Value (for set) or amount (for increment/decrement) */
  value: number;
}

/**
 * Stat consequence - modifies character stat
 */
export interface StatConsequence extends BaseConsequence {
  type: 'stat';
  
  /** Stat name (strength, intelligence, etc.) */
  target: string;
  
  /** Action to perform */
  action: 'set' | 'increase' | 'decrease';
  
  /** Value */
  value: number;
}

/**
 * Skill consequence - modifies character skill
 */
export interface SkillConsequence extends BaseConsequence {
  type: 'skill';
  
  /** Skill name */
  target: string;
  
  /** Action to perform */
  action: 'set' | 'increase' | 'decrease';
  
  /** Value */
  value: number;
}

/**
 * Item consequence - adds or removes item
 */
export interface ItemConsequence extends BaseConsequence {
  type: 'item';
  
  /** Item ID */
  target: string;
  
  /** Action to perform */
  action: 'add' | 'remove';
  
  /** Quantity (default: 1) */
  quantity?: number;
  
  /** Auto-equip if possible (for add action) */
  autoEquip?: boolean;
}

/**
 * Experience consequence - gives XP
 */
export interface ExperienceConsequence extends BaseConsequence {
  type: 'experience';
  
  /** XP amount */
  value: number;
}

/**
 * Health consequence - modifies health
 */
export interface HealthConsequence extends BaseConsequence {
  type: 'health';
  
  /** Health change (positive or negative) */
  value: number;
  
  /** Whether this can cause death */
  canKill?: boolean;
}

/**
 * Mana consequence - modifies mana
 */
export interface ManaConsequence extends BaseConsequence {
  type: 'mana';
  
  /** Mana change (positive or negative) */
  value: number;
}

/**
 * Gold consequence - modifies gold
 */
export interface GoldConsequence extends BaseConsequence {
  type: 'gold';
  
  /** Gold change (positive or negative) */
  value: number;
}

/**
 * Relationship consequence - modifies NPC affinity
 */
export interface RelationshipConsequence extends BaseConsequence {
  type: 'relationship';
  
  /** NPC ID */
  target: string;
  
  /** Affinity change (positive or negative, -100 to 100) */
  value: number;
}

/**
 * Unlock shop consequence - unlocks merchant inventory
 */
export interface UnlockShopConsequence extends BaseConsequence {
  type: 'unlock_shop';
  
  /** Shop/merchant ID */
  target: string;
}

/**
 * Unlock dialogue consequence - unlocks dialogue option
 */
export interface UnlockDialogueConsequence extends BaseConsequence {
  type: 'unlock_dialogue';
  
  /** Dialogue ID */
  target: string;
}

/**
 * Unlock quest consequence - makes quest available
 */
export interface UnlockQuestConsequence extends BaseConsequence {
  type: 'unlock_quest';
  
  /** Quest ID */
  target: string;
  
  /** Auto-start quest (default: false) */
  autoStart?: boolean;
}

/**
 * Unlock location consequence - reveals new location
 */
export interface UnlockLocationConsequence extends BaseConsequence {
  type: 'unlock_location';
  
  /** Location ID */
  target: string;
}

/**
 * Trigger event consequence - triggers custom event
 */
export interface TriggerEventConsequence extends BaseConsequence {
  type: 'trigger_event';
  
  /** Event ID */
  target: string;
  
  /** Optional event data */
  data?: Record<string, any>;
}

/**
 * Set location consequence - moves player to new location
 */
export interface SetLocationConsequence extends BaseConsequence {
  type: 'set_location';
  
  /** Location ID */
  target: string;
}

/**
 * Union type of all possible consequences
 */
export type Consequence =
  | FlagConsequence
  | CounterConsequence
  | StatConsequence
  | SkillConsequence
  | ItemConsequence
  | ExperienceConsequence
  | HealthConsequence
  | ManaConsequence
  | GoldConsequence
  | RelationshipConsequence
  | UnlockShopConsequence
  | UnlockDialogueConsequence
  | UnlockQuestConsequence
  | UnlockLocationConsequence
  | TriggerEventConsequence
  | SetLocationConsequence;

/**
 * Type guard to check if object is a valid Consequence
 */
export function isConsequence(obj: any): obj is Consequence {
  return obj && typeof obj.type === 'string';
}
```

#### Step 5: Define Skill Check Types

**File:** `src/game/types/skillCheck.ts`

```typescript
/**
 * Skill Check Types
 * 
 * Skill checks determine success/failure of choices requiring character abilities.
 * Uses d20 + skill modifier vs difficulty class (DC).
 */

/**
 * Available character skills
 */
export type SkillType =
  | 'persuasion'     // Convince others
  | 'intimidation'   // Threaten or scare
  | 'deception'      // Lie or mislead
  | 'insight'        // Read intentions
  | 'perception'     // Notice details
  | 'investigation'  // Search and analyze
  | 'stealth'        // Move unseen
  | 'sleight_of_hand'// Pickpocket, trick
  | 'athletics'      // Physical prowess
  | 'acrobatics'     // Agility and balance
  | 'medicine'       // Heal and diagnose
  | 'herbalism'      // Plant knowledge
  | 'arcana'         // Magic knowledge
  | 'history'        // Historical knowledge
  | 'religion'       // Religious knowledge
  | 'survival';      // Wilderness skills

/**
 * Skill check definition
 */
export interface SkillCheck {
  /** Skill being tested */
  skill: SkillType;
  
  /** Difficulty class (DC) to beat */
  dc: number;
  
  /** Optional: Minimum roll required (for critical checks) */
  minRoll?: number;
  
  /** Optional: Maximum roll allowed (for critical fails) */
  maxRoll?: number;
}

/**
 * Result of a skill check
 */
export interface SkillCheckResult {
  /** Whether check succeeded */
  success: boolean;
  
  /** Raw d20 roll (1-20) */
  roll: number;
  
  /** Skill modifier from character */
  modifier: number;
  
  /** Total (roll + modifier) */
  total: number;
  
  /** DC that was needed */
  dc: number;
  
  /** Whether this was a critical success (natural 20) */
  criticalSuccess: boolean;
  
  /** Whether this was a critical failure (natural 1) */
  criticalFailure: boolean;
  
  /** Margin of success/failure */
  margin: number;
}

/**
 * Calculate skill check result
 * 
 * @param skillCheck - The skill check to perform
 * @param skillLevel - Character's skill level (0-100)
 * @param attributeBonus - Relevant attribute bonus
 * @returns Skill check result
 */
export function performSkillCheck(
  skillCheck: SkillCheck,
  skillLevel: number,
  attributeBonus: number
): SkillCheckResult {
  // Roll d20 (1-20)
  const roll = Math.floor(Math.random() * 20) + 1;
  
  // Calculate modifier from skill and attribute
  // Skill contributes 0-10 (skill/10)
  // Attribute contributes -5 to +5
  const modifier = Math.floor(skillLevel / 10) + attributeBonus;
  
  // Calculate total
  const total = roll + modifier;
  
  // Check for critical success (natural 20)
  const criticalSuccess = roll === 20;
  
  // Check for critical failure (natural 1)
  const criticalFailure = roll === 1;
  
  // Determine success
  let success: boolean;
  if (criticalFailure) {
    success = false; // Natural 1 always fails
  } else if (criticalSuccess) {
    success = true; // Natural 20 always succeeds
  } else {
    success = total >= skillCheck.dc;
  }
  
  // Calculate margin
  const margin = total - skillCheck.dc;
  
  return {
    success,
    roll,
    modifier,
    total,
    dc: skillCheck.dc,
    criticalSuccess,
    criticalFailure,
    margin,
  };
}
```

#### Step 6: Define Game State Types

**File:** `src/game/types/gameState.ts`

```typescript
/**
 * Game State Types
 * 
 * Defines the complete state of the game at any point in time.
 * This is what gets saved/loaded.
 */

import { Scenario } from './scenario';

/**
 * Complete game state
 */
export interface GameState {
  /** Current scenario player is viewing */
  currentScenario: Scenario | null;
  
  /** Boolean flags */
  flags: Record<string, boolean>;
  
  /** Numeric counters */
  counters: Record<string, number>;
  
  /** Current location ID */
  location: string;
  
  /** NPC relationships (affinity -100 to 100) */
  relationships: Record<string, number>;
  
  /** Unlocked shops */
  unlockedShops: string[];
  
  /** Unlocked dialogues */
  unlockedDialogues: string[];
  
  /** Unlocked quests */
  unlockedQuests: string[];
  
  /** Unlocked locations */
  unlockedLocations: string[];
  
  /** Dialogue history (for preventing repeats) */
  dialogueHistory: string[];
  
  /** Scenario history (for analytics/debugging) */
  scenarioHistory: ScenarioHistoryEntry[];
  
  /** Game time */
  gameTime: GameTime;
  
  /** Metadata */
  metadata: GameStateMetadata;
}

/**
 * History entry for tracking scenario progression
 */
export interface ScenarioHistoryEntry {
  /** Scenario ID */
  scenarioId: string;
  
  /** Choice that was made (if any) */
  choiceId?: string;
  
  /** Timestamp when scenario was visited */
  timestamp: number;
  
  /** Skill check result (if applicable) */
  skillCheckResult?: {
    skill: string;
    success: boolean;
    roll: number;
    total: number;
  };
}

/**
 * Game time tracking
 */
export interface GameTime {
  /** Days elapsed */
  day: number;
  
  /** Current time of day (0-23) */
  hour: number;
  
  /** Current period */
  period: 'night' | 'morning' | 'afternoon' | 'evening';
}

/**
 * Metadata about game state
 */
export interface GameStateMetadata {
  /** When this state was created */
  createdAt: number;
  
  /** When this state was last updated */
  updatedAt: number;
  
  /** Game version */
  version: string;
  
  /** Content version */
  contentVersion: string;
  
  /** Total playtime in seconds */
  playtime: number;
}

/**
 * Create initial game state
 */
export function createInitialGameState(): GameState {
  return {
    currentScenario: null,
    flags: {},
    counters: {},
    location: 'kamenitsa_home',
    relationships: {},
    unlockedShops: [],
    unlockedDialogues: [],
    unlockedQuests: [],
    unlockedLocations: ['kamenitsa_home', 'kamenitsa'],
    dialogueHistory: [],
    scenarioHistory: [],
    gameTime: {
      day: 1,
      hour: 6,
      period: 'morning',
    },
    metadata: {
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: '1.0.0',
      contentVersion: '1.0.0',
      playtime: 0,
    },
  };
}
```

#### Step 7: Create Main Types Index

**File:** `src/game/types/index.ts`

```typescript
/**
 * Game Types
 * 
 * Central export for all game-related TypeScript types and interfaces.
 */

// Scenario types
export * from './scenario';
export type { Scenario, Choice, ScenarioMetadata } from './scenario';
export { isScenario, isChoice } from './scenario';

// Condition types
export * from './condition';
export type { Condition, ConditionType, ComparisonOperator } from './condition';
export { isCondition } from './condition';

// Consequence types
export * from './consequence';
export type { Consequence, ConsequenceType } from './consequence';
export { isConsequence } from './consequence';

// Skill check types
export * from './skillCheck';
export type { SkillCheck, SkillCheckResult, SkillType } from './skillCheck';
export { performSkillCheck } from './skillCheck';

// Game state types
export * from './gameState';
export type { GameState, GameTime, GameStateMetadata } from './gameState';
export { createInitialGameState } from './gameState';
```

#### Step 8: Add Validation with Zod (Optional but Recommended)

```bash
npm install zod
```

**File:** `src/game/types/validation.ts`

```typescript
import { z } from 'zod';

/**
 * Zod schemas for runtime validation
 * 
 * These schemas validate data loaded from JSON files to catch errors early.
 */

// Condition schema
export const ConditionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('flag'),
    target: z.string(),
    value: z.boolean(),
  }),
  z.object({
    type: z.literal('counter'),
    target: z.string(),
    operator: z.enum(['equals', 'not_equals', 'greater_than', 'less_than', 'greater_equal', 'less_equal']),
    value: z.number(),
  }),
  // ... other condition types
]);

// Consequence schema
export const ConsequenceSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('flag'),
    target: z.string(),
    value: z.boolean(),
  }),
  z.object({
    type: z.literal('item'),
    target: z.string(),
    action: z.enum(['add', 'remove']),
    quantity: z.number().optional(),
  }),
  // ... other consequence types
]);

// Skill check schema
export const SkillCheckSchema = z.object({
  skill: z.string(),
  dc: z.number().min(1).max(30),
});

// Choice schema
export const ChoiceSchema = z.object({
  id: z.string(),
  textKey: z.string(),
  conditions: z.array(ConditionSchema),
  skillCheck: SkillCheckSchema.optional(),
  consequences: z.array(ConsequenceSchema),
  nextScenario: z.string(),
  nextScenarioOnFailure: z.string().optional(),
});

// Scenario schema
export const ScenarioSchema = z.object({
  id: z.string(),
  titleKey: z.string(),
  textKey: z.string(),
  act: z.number(),
  scene: z.number(),
  locationId: z.string(),
  choices: z.array(ChoiceSchema),
  prerequisites: z.array(ConditionSchema),
  npcsPresent: z.array(z.string()),
  metadata: z.object({
    author: z.string().optional(),
    createdDate: z.string().optional(),
    tags: z.array(z.string()).optional(),
    notes: z.string().optional(),
  }).optional(),
});

/**
 * Validate scenario data from JSON
 */
export function validateScenario(data: unknown): Scenario {
  return ScenarioSchema.parse(data);
}
```

### Testing Steps

#### Test 1: Verify TypeScript Compilation

```bash
npm run type-check

# Expected: No errors
# All types should compile successfully
```

#### Test 2: Test Type Guards

**File:** `src/game/types/__tests__/typeGuards.test.ts`

```typescript
import { isScenario, isChoice, isCondition, isConsequence } from '../index';

describe('Type Guards', () => {
  describe('isScenario', () => {
    it('returns true for valid scenario', () => {
      const scenario = {
        id: 'test',
        titleKey: 'test.title',
        textKey: 'test.text',
        act: 1,
        scene: 1,
        locationId: 'test',
        choices: [],
        prerequisites: [],
        npcsPresent: [],
      };
      
      expect(isScenario(scenario)).toBe(true);
    });
    
    it('returns false for invalid scenario', () => {
      const invalid = { id: 'test' };
      expect(isScenario(invalid)).toBe(false);
    });
  });
  
  // ... more type guard tests
});
```

#### Test 3: Test Skill Check Calculation

**File:** `src/game/types/__tests__/skillCheck.test.ts`

```typescript
import { performSkillCheck } from '../skillCheck';

describe('performSkillCheck', () => {
  it('succeeds when total >= DC', () => {
    // Mock Math.random to return specific value
    jest.spyOn(Math, 'random').mockReturnValue(0.9); // Roll 19
    
    const result = performSkillCheck(
      { skill: 'persuasion', dc: 15 },
      50, // skill level
      3   // attribute bonus
    );
    
    // Roll: 19, Modifier: 5 + 3 = 8, Total: 27
    expect(result.success).toBe(true);
    expect(result.roll).toBe(19);
    expect(result.modifier).toBe(8);
    expect(result.total).toBe(27);
    
    jest.restoreAllMocks();
  });
  
  it('fails on natural 1', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0); // Roll 1
    
    const result = performSkillCheck(
      { skill: 'persuasion', dc: 5 },
      100, // Even high skill
      5    // High bonus
    );
    
    expect(result.success).toBe(false);
    expect(result.criticalFailure).toBe(true);
    
    jest.restoreAllMocks();
  });
  
  it('succeeds on natural 20', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.99); // Roll 20
    
    const result = performSkillCheck(
      { skill: 'persuasion', dc: 30 },
      0,  // Even low skill
      -5  // Negative bonus
    );
    
    expect(result.success).toBe(true);
    expect(result.criticalSuccess).toBe(true);
    
    jest.restoreAllMocks();
  });
});
```

#### Test 4: Test Initial Game State

```typescript
import { createInitialGameState } from '../gameState';

describe('createInitialGameState', () => {
  it('creates valid initial state', () => {
    const state = createInitialGameState();
    
    expect(state.currentScenario).toBeNull();
    expect(state.flags).toEqual({});
    expect(state.counters).toEqual({});
    expect(state.location).toBe('kamenitsa_home');
    expect(state.unlockedLocations).toContain('kamenitsa_home');
    expect(state.gameTime.day).toBe(1);
    expect(state.gameTime.hour).toBe(6);
    expect(state.metadata.version).toBe('1.0.0');
  });
});
```

### Definition of Done

- [ ] All interfaces defined and exported
- [ ] JSDoc comments on all types
- [ ] Type guards implemented
- [ ] Validation schemas created (Zod)
- [ ] TypeScript compiles with strict mode
- [ ] All tests passing
- [ ] Code reviewed
- [ ] Documentation updated

### Estimated Time

- **Interface design:** 1 hour
- **Implementation:** 2 hours
- **Validation schemas:** 1 hour
- **Testing:** 1 hour
- **Documentation:** 30 minutes
- **Total:** ~5.5 hours

### Notes

- These types are the foundation for the entire game engine
- Invest time in getting them right - changes later are costly
- Use discriminated unions for better type narrowing
- Add new types as needed but keep them organized
- Consider using branded types for IDs to prevent mixing

### Related Documents

- Architecture Document: Section 5 (Data Models)
- TypeScript Documentation: https://www.typescriptlang.org/

---

**[Story 2.2 and remaining stories continue in next section due to length...]**

Should I continue with Stories 2.2-2.8 in the same detail?

## Story 2.2: Implement Scenario Loader

**Story ID:** 2.2  
**Story Points:** 5 SP  
**Priority:** Critical  
**Assignee:** Lead Developer  
**Sprint:** Sprint 2  
**Dependencies:** Story 2.1

### User Story

> **As a** game developer  
> **I want** a scenario loader that efficiently loads and validates scenarios  
> **So that** scenarios display quickly and errors are caught early

### Detailed Description

Build the ScenarioLoader service that loads scenarios from JSON files in the data directory, validates them against schemas, handles errors gracefully, and provides consistent interface for scenario access throughout the app.

The loader must be robust (handle missing files, corrupted data), fast (< 100ms load time), and reliable (proper error messages for debugging).

### Acceptance Criteria

#### Must Have
- [ ] Load scenario by ID from JSON files
- [ ] Validate scenario structure with Zod schema
- [ ] Handle missing scenario files gracefully
- [ ] Handle corrupted JSON gracefully
- [ ] Return detailed error messages for debugging
- [ ] Load time < 100ms for cached scenarios
- [ ] Load time < 500ms for first load
- [ ] Support for async loading
- [ ] All exported functions typed properly

#### Should Have
- [ ] Preload adjacent scenarios in background
- [ ] Cache validation for faster subsequent loads
- [ ] Progress callback for loading indicator
- [ ] Batch loading multiple scenarios

#### Nice to Have
- [ ] Scenario dependency graph
- [ ] Auto-retry on failed loads
- [ ] Offline scenario bundle support

### Technical Implementation

#### Step 1: Create ScenarioLoader Service

**File:** `src/services/ScenarioLoader.ts`

```typescript
import { Scenario } from '../game/types';
import { ScenarioSchema } from '../game/types/validation';
import { z } from 'zod';

/**
 * ScenarioLoader Service
 * 
 * Loads and validates scenarios from JSON files.
 * Handles errors gracefully and provides consistent interface.
 */
export class ScenarioLoader {
  private static instance: ScenarioLoader;
  private loadedScenarios: Map<string, Scenario> = new Map();
  private loadingPromises: Map<string, Promise<Scenario>> = new Map();
  
  private constructor() {}
  
  /**
   * Get singleton instance
   */
  public static getInstance(): ScenarioLoader {
    if (!ScenarioLoader.instance) {
      ScenarioLoader.instance = new ScenarioLoader();
    }
    return ScenarioLoader.instance;
  }
  
  /**
   * Load scenario by ID
   * 
   * @param scenarioId - Unique scenario identifier (e.g., "act1-scene3")
   * @returns Promise resolving to validated Scenario
   * @throws ScenarioNotFoundError if scenario doesn't exist
   * @throws ScenarioValidationError if scenario is invalid
   */
  public async loadScenario(scenarioId: string): Promise<Scenario> {
    // Check if already loaded
    if (this.loadedScenarios.has(scenarioId)) {
      console.log(`[ScenarioLoader] Cache hit: ${scenarioId}`);
      return this.loadedScenarios.get(scenarioId)!;
    }
    
    // Check if currently loading (prevent duplicate loads)
    if (this.loadingPromises.has(scenarioId)) {
      console.log(`[ScenarioLoader] Loading in progress: ${scenarioId}`);
      return this.loadingPromises.get(scenarioId)!;
    }
    
    // Load scenario
    console.log(`[ScenarioLoader] Loading: ${scenarioId}`);
    const loadPromise = this.loadScenarioFromFile(scenarioId);
    this.loadingPromises.set(scenarioId, loadPromise);
    
    try {
      const scenario = await loadPromise;
      this.loadedScenarios.set(scenarioId, scenario);
      return scenario;
    } finally {
      this.loadingPromises.delete(scenarioId);
    }
  }
  
  /**
   * Load scenario from JSON file
   */
  private async loadScenarioFromFile(scenarioId: string): Promise<Scenario> {
    const startTime = Date.now();
    
    try {
      // Construct file path
      const filePath = this.getScenarioPath(scenarioId);
      
      // Import JSON file
      // Note: In React Native, we use require() for static imports
      const scenarioData = await this.importScenarioFile(filePath);
      
      // Validate with Zod schema
      const validatedScenario = this.validateScenario(scenarioData, scenarioId);
      
      const loadTime = Date.now() - startTime;
      console.log(`[ScenarioLoader] Loaded ${scenarioId} in ${loadTime}ms`);
      
      return validatedScenario;
    } catch (error) {
      const loadTime = Date.now() - startTime;
      console.error(`[ScenarioLoader] Failed to load ${scenarioId} after ${loadTime}ms:`, error);
      throw this.createDetailedError(scenarioId, error);
    }
  }
  
  /**
   * Get file path for scenario
   */
  private getScenarioPath(scenarioId: string): string {
    // Convert scenario ID to file path
    // Example: "act1-scene3" → "../game/data/scenarios/act1-scene3.json"
    return `../game/data/scenarios/${scenarioId}.json`;
  }
  
  /**
   * Import scenario file dynamically
   */
  private async importScenarioFile(filePath: string): Promise<unknown> {
    try {
      // Dynamic import for JSON
      const module = await import(filePath);
      return module.default || module;
    } catch (error: any) {
      if (error.code === 'MODULE_NOT_FOUND') {
        throw new ScenarioNotFoundError(`Scenario file not found: ${filePath}`);
      }
      throw new ScenarioLoadError(`Failed to import scenario file: ${error.message}`);
    }
  }
  
  /**
   * Validate scenario data with Zod
   */
  private validateScenario(data: unknown, scenarioId: string): Scenario {
    try {
      return ScenarioSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const issues = error.issues.map(issue => 
          `${issue.path.join('.')}: ${issue.message}`
        ).join(', ');
        throw new ScenarioValidationError(
          `Scenario validation failed for ${scenarioId}: ${issues}`
        );
      }
      throw error;
    }
  }
  
  /**
   * Create detailed error with context
   */
  private createDetailedError(scenarioId: string, error: any): Error {
    if (error instanceof ScenarioNotFoundError || 
        error instanceof ScenarioValidationError ||
        error instanceof ScenarioLoadError) {
      return error;
    }
    
    return new ScenarioLoadError(
      `Unexpected error loading scenario ${scenarioId}: ${error.message}`,
      error
    );
  }
  
  /**
   * Preload scenario in background
   * 
   * Useful for preloading next scenario while player reads current one
   */
  public preloadScenario(scenarioId: string): void {
    if (!this.loadedScenarios.has(scenarioId) && !this.loadingPromises.has(scenarioId)) {
      console.log(`[ScenarioLoader] Preloading: ${scenarioId}`);
      this.loadScenario(scenarioId).catch(error => {
        console.warn(`[ScenarioLoader] Preload failed for ${scenarioId}:`, error);
      });
    }
  }
  
  /**
   * Preload multiple scenarios
   */
  public preloadScenarios(scenarioIds: string[]): void {
    scenarioIds.forEach(id => this.preloadScenario(id));
  }
  
  /**
   * Check if scenario is loaded
   */
  public isLoaded(scenarioId: string): boolean {
    return this.loadedScenarios.has(scenarioId);
  }
  
  /**
   * Clear loaded scenarios (for memory management)
   */
  public clearCache(): void {
    console.log(`[ScenarioLoader] Clearing cache (${this.loadedScenarios.size} scenarios)`);
    this.loadedScenarios.clear();
  }
  
  /**
   * Get cache statistics
   */
  public getCacheStats(): {
    loaded: number;
    loading: number;
    memoryEstimate: string;
  } {
    const loaded = this.loadedScenarios.size;
    const loading = this.loadingPromises.size;
    
    // Rough memory estimate (each scenario ~5KB average)
    const memoryBytes = loaded * 5 * 1024;
    const memoryMB = (memoryBytes / (1024 * 1024)).toFixed(2);
    
    return {
      loaded,
      loading,
      memoryEstimate: `${memoryMB} MB`,
    };
  }
}

/**
 * Custom error classes
 */
export class ScenarioNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ScenarioNotFoundError';
  }
}

export class ScenarioValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ScenarioValidationError';
  }
}

export class ScenarioLoadError extends Error {
  public readonly originalError?: Error;
  
  constructor(message: string, originalError?: Error) {
    super(message);
    this.name = 'ScenarioLoadError';
    this.originalError = originalError;
  }
}

/**
 * Convenience function for loading scenarios
 */
export async function loadScenario(scenarioId: string): Promise<Scenario> {
  return ScenarioLoader.getInstance().loadScenario(scenarioId);
}

/**
 * Convenience function for preloading
 */
export function preloadScenario(scenarioId: string): void {
  ScenarioLoader.getInstance().preloadScenario(scenarioId);
}

/**
 * Convenience function for batch preloading
 */
export function preloadScenarios(scenarioIds: string[]): void {
  ScenarioLoader.getInstance().preloadScenarios(scenarioIds);
}
```

#### Step 2: Create Test Scenario Data

**File:** `src/game/data/scenarios/test-scenario-1.json`

```json
{
  "id": "test-scenario-1",
  "titleKey": "scenarios.test_scenario_1.title",
  "textKey": "scenarios.test_scenario_1.narrative",
  "act": 0,
  "scene": 1,
  "locationId": "test-location",
  "choices": [
    {
      "id": "a",
      "textKey": "scenarios.test_scenario_1.choice_a",
      "conditions": [],
      "consequences": [],
      "nextScenario": "test-scenario-2"
    },
    {
      "id": "b",
      "textKey": "scenarios.test_scenario_1.choice_b",
      "conditions": [],
      "skillCheck": {
        "skill": "persuasion",
        "dc": 10
      },
      "consequences": [],
      "nextScenario": "test-scenario-3"
    }
  ],
  "prerequisites": [],
  "npcsPresent": ["test-npc"]
}
```

**File:** `src/game/data/scenarios/invalid-scenario.json`

```json
{
  "id": "invalid-scenario",
  "titleKey": "scenarios.invalid.title"
  // Missing required fields - for testing validation
}
```

#### Step 3: Add Usage Example

**File:** `src/examples/ScenarioLoaderExample.tsx`

```typescript
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { loadScenario, preloadScenarios } from '../services/ScenarioLoader';
import { Scenario } from '../game/types';

export const ScenarioLoaderExample = () => {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    loadScenarioData();
  }, []);
  
  const loadScenarioData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load current scenario
      const loadedScenario = await loadScenario('test-scenario-1');
      setScenario(loadedScenario);
      
      // Preload next scenarios in background
      const nextScenarios = loadedScenario.choices.map(c => c.nextScenario);
      preloadScenarios(nextScenarios);
      
    } catch (err: any) {
      console.error('Failed to load scenario:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Loading scenario...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red' }}>Error: {error}</Text>
      </View>
    );
  }
  
  if (!scenario) {
    return <Text>No scenario loaded</Text>;
  }
  
  return (
    <View style={{ padding: 16 }}>
      <Text>Scenario ID: {scenario.id}</Text>
      <Text>Act: {scenario.act}, Scene: {scenario.scene}</Text>
      <Text>Choices: {scenario.choices.length}</Text>
    </View>
  );
};
```

### Testing Steps

#### Test 1: Load Valid Scenario

**File:** `src/services/__tests__/ScenarioLoader.test.ts`

```typescript
import { ScenarioLoader, ScenarioNotFoundError, ScenarioValidationError } from '../ScenarioLoader';
import { Scenario } from '../../game/types';

describe('ScenarioLoader', () => {
  let loader: ScenarioLoader;
  
  beforeEach(() => {
    loader = ScenarioLoader.getInstance();
    loader.clearCache();
  });
  
  describe('loadScenario', () => {
    it('loads valid scenario successfully', async () => {
      const scenario = await loader.loadScenario('test-scenario-1');
      
      expect(scenario).toBeDefined();
      expect(scenario.id).toBe('test-scenario-1');
      expect(scenario.choices).toHaveLength(2);
      expect(scenario.act).toBe(0);
    });
    
    it('throws ScenarioNotFoundError for missing scenario', async () => {
      await expect(
        loader.loadScenario('non-existent-scenario')
      ).rejects.toThrow(ScenarioNotFoundError);
    });
    
    it('throws ScenarioValidationError for invalid scenario', async () => {
      await expect(
        loader.loadScenario('invalid-scenario')
      ).rejects.toThrow(ScenarioValidationError);
    });
    
    it('caches loaded scenarios', async () => {
      // First load
      const start1 = Date.now();
      const scenario1 = await loader.loadScenario('test-scenario-1');
      const time1 = Date.now() - start1;
      
      // Second load (should be cached)
      const start2 = Date.now();
      const scenario2 = await loader.loadScenario('test-scenario-1');
      const time2 = Date.now() - start2;
      
      expect(scenario1).toBe(scenario2); // Same object reference
      expect(time2).toBeLessThan(time1 / 10); // Cache is 10x+ faster
      expect(time2).toBeLessThan(10); // Cache < 10ms
    });
    
    it('handles concurrent loads of same scenario', async () => {
      // Start multiple loads simultaneously
      const promises = [
        loader.loadScenario('test-scenario-1'),
        loader.loadScenario('test-scenario-1'),
        loader.loadScenario('test-scenario-1'),
      ];
      
      const scenarios = await Promise.all(promises);
      
      // All should return same instance
      expect(scenarios[0]).toBe(scenarios[1]);
      expect(scenarios[1]).toBe(scenarios[2]);
    });
    
    it('loads scenario in under 500ms', async () => {
      const start = Date.now();
      await loader.loadScenario('test-scenario-1');
      const loadTime = Date.now() - start;
      
      expect(loadTime).toBeLessThan(500);
    });
  });
  
  describe('preloadScenario', () => {
    it('preloads scenario in background', async () => {
      // Start preload (non-blocking)
      loader.preloadScenario('test-scenario-1');
      
      // Wait a bit for preload to complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Should be cached now
      expect(loader.isLoaded('test-scenario-1')).toBe(true);
    });
    
    it('does not throw on preload failure', () => {
      // Should not throw, just log warning
      expect(() => {
        loader.preloadScenario('non-existent-scenario');
      }).not.toThrow();
    });
  });
  
  describe('cache management', () => {
    it('clears cache correctly', async () => {
      await loader.loadScenario('test-scenario-1');
      expect(loader.isLoaded('test-scenario-1')).toBe(true);
      
      loader.clearCache();
      expect(loader.isLoaded('test-scenario-1')).toBe(false);
    });
    
    it('provides accurate cache stats', async () => {
      const stats1 = loader.getCacheStats();
      expect(stats1.loaded).toBe(0);
      
      await loader.loadScenario('test-scenario-1');
      
      const stats2 = loader.getCacheStats();
      expect(stats2.loaded).toBe(1);
      expect(stats2.memoryEstimate).toContain('MB');
    });
  });
});
```

#### Test 2: Performance Test

```typescript
describe('ScenarioLoader Performance', () => {
  it('loads 10 scenarios in under 5 seconds', async () => {
    const loader = ScenarioLoader.getInstance();
    loader.clearCache();
    
    const scenarioIds = Array.from({ length: 10 }, (_, i) => `scenario-${i}`);
    
    const start = Date.now();
    await Promise.all(scenarioIds.map(id => loader.loadScenario(id)));
    const totalTime = Date.now() - start;
    
    expect(totalTime).toBeLessThan(5000);
  });
  
  it('cached loads are under 10ms', async () => {
    const loader = ScenarioLoader.getInstance();
    
    // First load (warm cache)
    await loader.loadScenario('test-scenario-1');
    
    // Measure cached load
    const start = Date.now();
    await loader.loadScenario('test-scenario-1');
    const cachedTime = Date.now() - start;
    
    expect(cachedTime).toBeLessThan(10);
  });
});
```

### Definition of Done

- [ ] ScenarioLoader service implemented
- [ ] Singleton pattern working
- [ ] Load scenarios from JSON files
- [ ] Validate with Zod schemas
- [ ] Handle errors gracefully
- [ ] Caching implemented
- [ ] Preloading working
- [ ] All tests passing (90%+ coverage)
- [ ] Load time < 500ms (first load)
- [ ] Load time < 100ms (cached)
- [ ] Documentation complete
- [ ] Code reviewed

### Common Issues & Solutions

**Issue 1:** "Module not found error in tests"
```typescript
// Solution: Mock file imports in jest.setup.js
jest.mock('../game/data/scenarios/test-scenario-1.json', () => ({
  default: {
    id: 'test-scenario-1',
    // ... mock data
  }
}));
```

**Issue 2:** "Slow load times"
```typescript
// Solution: Use dynamic imports instead of require
// And ensure scenarios are properly tree-shaken
```

**Issue 3:** "Memory leak from cached scenarios"
```typescript
// Solution: Implement LRU cache with max size
// See Story 2.7 for full implementation
```

### Estimated Time

- **Service implementation:** 3 hours
- **Error handling:** 1 hour
- **Preloading:** 1 hour
- **Testing:** 2 hours
- **Documentation:** 30 minutes
- **Total:** ~7.5 hours

### Notes

- Singleton pattern ensures consistent cache across app
- Preloading significantly improves UX (no loading screen)
- Zod validation catches content errors early
- Consider implementing retry logic for network scenarios (future DLC)
- Monitor memory usage - clear cache if needed

### Related Documents

- Architecture Document: Section 6.1 (Scenario System)
- Story 2.7: Implement LRU cache for better memory management

---

## Story 2.3: Implement Condition Evaluator

**Story ID:** 2.3  
**Story Points:** 5 SP  
**Priority:** Critical  
**Assignee:** Lead Developer  
**Sprint:** Sprint 2  
**Dependencies:** Story 2.1

### User Story

> **As a** game developer  
> **I want** a condition evaluator that checks all condition types  
> **So that** scenarios and choices are available based on game state

### Detailed Description

Build the ConditionEvaluator that evaluates all 11 condition types (flag, counter, stat, skill, item, relationship, level, location, time, AND/OR/NOT) against current game state. Must support nested logical operators and short-circuit evaluation for performance.

This is critical logic - bugs here will break quest progression and game flow.

###

 Acceptance Criteria

#### Must Have
- [ ] Evaluate all 11 condition types correctly
- [ ] Support AND/OR/NOT logical operators
- [ ] Handle nested conditions (unlimited depth)
- [ ] Short-circuit evaluation (AND stops at first false, OR stops at first true)
- [ ] Return boolean result
- [ ] Handle missing data gracefully (default to false)
- [ ] Detailed logging for debugging
- [ ] 95%+ test coverage (critical logic)

#### Should Have
- [ ] Performance: evaluate 100 conditions in < 50ms
- [ ] Explain why condition failed (for debugging)
- [ ] Warning for impossible conditions

#### Nice to Have
- [ ] Condition visualization for debugging
- [ ] Automatic condition simplification

### Technical Implementation

#### Step 1: Create ConditionEvaluator Service

**File:** `src/services/ConditionEvaluator.ts`

```typescript
import {
  Condition,
  FlagCondition,
  CounterCondition,
  StatCondition,
  SkillCondition,
  ItemCondition,
  RelationshipCondition,
  LevelCondition,
  LocationCondition,
  TimeCondition,
  AndCondition,
  OrCondition,
  NotCondition,
  ComparisonOperator,
} from '../game/types/condition';
import { GameState } from '../game/types/gameState';
import { PlayerCharacter } from '../game/types/character';

/**
 * ConditionEvaluator Service
 * 
 * Evaluates conditions against game state to determine availability
 * of scenarios, choices, and other game elements.
 */
export class ConditionEvaluator {
  /**
   * Evaluate a condition against game state
   * 
   * @param condition - Condition to evaluate
   * @param gameState - Current game state
   * @param character - Player character data
   * @returns true if condition is met, false otherwise
   */
  public static evaluate(
    condition: Condition,
    gameState: GameState,
    character: PlayerCharacter
  ): boolean {
    // Log evaluation for debugging
    if (__DEV__) {
      console.log('[ConditionEvaluator] Evaluating:', JSON.stringify(condition));
    }
    
    const result = this.evaluateCondition(condition, gameState, character);
    
    if (__DEV__) {
      console.log('[ConditionEvaluator] Result:', result);
    }
    
    return result;
  }
  
  /**
   * Internal evaluation logic with type discrimination
   */
  private static evaluateCondition(
    condition: Condition,
    gameState: GameState,
    character: PlayerCharacter
  ): boolean {
    switch (condition.type) {
      case 'flag':
        return this.evaluateFlag(condition, gameState);
      
      case 'counter':
        return this.evaluateCounter(condition, gameState);
      
      case 'stat':
        return this.evaluateStat(condition, character);
      
      case 'skill':
        return this.evaluateSkill(condition, character);
      
      case 'item':
        return this.evaluateItem(condition, character);
      
      case 'relationship':
        return this.evaluateRelationship(condition, gameState);
      
      case 'level':
        return this.evaluateLevel(condition, character);
      
      case 'location':
        return this.evaluateLocation(condition, gameState);
      
      case 'time':
        return this.evaluateTime(condition, gameState);
      
      case 'and':
        return this.evaluateAnd(condition, gameState, character);
      
      case 'or':
        return this.evaluateOr(condition, gameState, character);
      
      case 'not':
        return this.evaluateNot(condition, gameState, character);
      
      default:
        console.warn('[ConditionEvaluator] Unknown condition type:', (condition as any).type);
        return false;
    }
  }
  
  /**
   * Evaluate flag condition
   */
  private static evaluateFlag(condition: FlagCondition, gameState: GameState): boolean {
    const flagValue = gameState.flags[condition.target];
    
    // Undefined flags default to false
    const actualValue = flagValue ?? false;
    
    return actualValue === condition.value;
  }
  
  /**
   * Evaluate counter condition
   */
  private static evaluateCounter(condition: CounterCondition, gameState: GameState): boolean {
    const counterValue = gameState.counters[condition.target];
    
    // Undefined counters default to 0
    const actualValue = counterValue ?? 0;
    
    return this.compareNumbers(actualValue, condition.operator, condition.value);
  }
  
  /**
   * Evaluate stat condition
   */
  private static evaluateStat(condition: StatCondition, character: PlayerCharacter): boolean {
    const statValue = character.attributes[condition.target as keyof typeof character.attributes];
    
    if (statValue === undefined) {
      console.warn(`[ConditionEvaluator] Unknown stat: ${condition.target}`);
      return false;
    }
    
    return this.compareNumbers(statValue, condition.operator, condition.value);
  }
  
  /**
   * Evaluate skill condition
   */
  private static evaluateSkill(condition: SkillCondition, character: PlayerCharacter): boolean {
    const skillValue = character.skills[condition.target as keyof typeof character.skills];
    
    if (skillValue === undefined) {
      console.warn(`[ConditionEvaluator] Unknown skill: ${condition.target}`);
      return false;
    }
    
    return this.compareNumbers(skillValue, condition.operator, condition.value);
  }
  
  /**
   * Evaluate item condition
   */
  private static evaluateItem(condition: ItemCondition, character: PlayerCharacter): boolean {
    const requiredQuantity = condition.quantity ?? 1;
    
    // Check if item is in inventory
    const itemsInInventory = character.inventory.filter(
      item => item.id === condition.target
    );
    
    const totalQuantity = itemsInInventory.reduce(
      (sum, item) => sum + (item.quantity ?? 1),
      0
    );
    
    // Check quantity requirement
    if (totalQuantity < requiredQuantity) {
      return false;
    }
    
    // Check if equipped (if required)
    if (condition.equipped) {
      const isEquipped = Object.values(character.equipment).some(
        equipped => equipped?.id === condition.target
      );
      
      if (!isEquipped) {
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * Evaluate relationship condition
   */
  private static evaluateRelationship(
    condition: RelationshipCondition,
    gameState: GameState
  ): boolean {
    const affinity = gameState.relationships[condition.target];
    
    // Undefined relationships default to 0
    const actualAffinity = affinity ?? 0;
    
    return this.compareNumbers(actualAffinity, condition.operator, condition.value);
  }
  
  /**
   * Evaluate level condition
   */
  private static evaluateLevel(condition: LevelCondition, character: PlayerCharacter): boolean {
    return this.compareNumbers(character.level, condition.operator, condition.value);
  }
  
  /**
   * Evaluate location condition
   */
  private static evaluateLocation(condition: LocationCondition, gameState: GameState): boolean {
    return gameState.location === condition.target;
  }
  
  /**
   * Evaluate time condition
   */
  private static evaluateTime(condition: TimeCondition, gameState: GameState): boolean {
    return gameState.gameTime.period === condition.period;
  }
  
  /**
   * Evaluate AND condition (all sub-conditions must be true)
   */
  private static evaluateAnd(
    condition: AndCondition,
    gameState: GameState,
    character: PlayerCharacter
  ): boolean {
    // Short-circuit: stop at first false
    for (const subCondition of condition.conditions) {
      if (!this.evaluateCondition(subCondition, gameState, character)) {
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * Evaluate OR condition (at least one sub-condition must be true)
   */
  private static evaluateOr(
    condition: OrCondition,
    gameState: GameState,
    character: PlayerCharacter
  ): boolean {
    // Short-circuit: stop at first true
    for (const subCondition of condition.conditions) {
      if (this.evaluateCondition(subCondition, gameState, character)) {
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * Evaluate NOT condition (negates sub-condition)
   */
  private static evaluateNot(
    condition: NotCondition,
    gameState: GameState,
    character: PlayerCharacter
  ): boolean {
    return !this.evaluateCondition(condition.condition, gameState, character);
  }
  
  /**
   * Compare two numbers with operator
   */
  private static compareNumbers(
    actual: number,
    operator: ComparisonOperator,
    expected: number
  ): boolean {
    switch (operator) {
      case 'equals':
        return actual === expected;
      
      case 'not_equals':
        return actual !== expected;
      
      case 'greater_than':
        return actual > expected;
      
      case 'less_than':
        return actual < expected;
      
      case 'greater_equal':
        return actual >= expected;
      
      case 'less_equal':
        return actual <= expected;
      
      default:
        console.warn('[ConditionEvaluator] Unknown operator:', operator);
        return false;
    }
  }
  
  /**
   * Evaluate multiple conditions (shorthand for AND)
   */
  public static evaluateAll(
    conditions: Condition[],
    gameState: GameState,
    character: PlayerCharacter
  ): boolean {
    if (conditions.length === 0) {
      return true; // No conditions = always true
    }
    
    return this.evaluateAnd(
      { type: 'and', conditions },
      gameState,
      character
    );
  }
  
  /**
   * Evaluate at least one condition (shorthand for OR)
   */
  public static evaluateAny(
    conditions: Condition[],
    gameState: GameState,
    character: PlayerCharacter
  ): boolean {
    if (conditions.length === 0) {
      return false; // No conditions = always false for ANY
    }
    
    return this.evaluateOr(
      { type: 'or', conditions },
      gameState,
      character
    );
  }
  
  /**
   * Get explanation of why condition failed (for debugging)
   */
  public static explainFailure(
    condition: Condition,
    gameState: GameState,
    character: PlayerCharacter
  ): string {
    // Evaluate condition
    const result = this.evaluate(condition, gameState, character);
    
    if (result) {
      return 'Condition passed';
    }
    
    // Generate explanation based on condition type
    switch (condition.type) {
      case 'flag':
        return `Flag '${condition.target}' is ${gameState.flags[condition.target] ?? false}, expected ${condition.value}`;
      
      case 'counter':
        return `Counter '${condition.target}' is ${gameState.counters[condition.target] ?? 0}, expected ${condition.operator} ${condition.value}`;
      
      case 'stat':
        const statValue = character.attributes[condition.target as keyof typeof character.attributes];
        return `Stat '${condition.target}' is ${statValue}, expected ${condition.operator} ${condition.value}`;
      
      case 'item':
        return `Player does not have item '${condition.target}'${condition.equipped ? ' equipped' : ''}`;
      
      case 'level':
        return `Player level is ${character.level}, expected ${condition.operator} ${condition.value}`;
      
      case 'location':
        return `Player is at '${gameState.location}', expected '${condition.target}'`;
      
      case 'and':
        const failedAnd = condition.conditions.find(c => 
          !this.evaluate(c, gameState, character)
        );
        return failedAnd ? this.explainFailure(failedAnd, gameState, character) : '';
      
      case 'or':
        return 'No sub-conditions were met';
      
      case 'not':
        return 'Negated condition was true';
      
      default:
        return 'Unknown failure reason';
    }
  }
}

/**
 * Convenience function for evaluating conditions
 */
export function evaluateCondition(
  condition: Condition,
  gameState: GameState,
  character: PlayerCharacter
): boolean {
  return ConditionEvaluator.evaluate(condition, gameState, character);
}

/**
 * Convenience function for evaluating multiple conditions
 */
export function evaluateConditions(
  conditions: Condition[],
  gameState: GameState,
  character: PlayerCharacter
): boolean {
  return ConditionEvaluator.evaluateAll(conditions, gameState, character);
}
```

#### Step 2: Add Testing

**File:** `src/services/__tests__/ConditionEvaluator.test.ts`

```typescript
import { ConditionEvaluator } from '../ConditionEvaluator';
import { createMockGameState, createMockCharacter } from '../../test-utils/mockData';

describe('ConditionEvaluator', () => {
  let gameState: GameState;
  let character: PlayerCharacter;
  
  beforeEach(() => {
    gameState = createMockGameState();
    character = createMockCharacter();
  });
  
  describe('Flag conditions', () => {
    it('returns true when flag matches', () => {
      gameState.flags['test_flag'] = true;
      
      const condition: FlagCondition = {
        type: 'flag',
        target: 'test_flag',
        value: true,
      };
      
      expect(ConditionEvaluator.evaluate(condition, gameState, character)).toBe(true);
    });
    
    it('returns false when flag does not match', () => {
      gameState.flags['test_flag'] = false;
      
      const condition: FlagCondition = {
        type: 'flag',
        target: 'test_flag',
        value: true,
      };
      
      expect(ConditionEvaluator.evaluate(condition, gameState, character)).toBe(false);
    });
    
    it('treats undefined flags as false', () => {
      const condition: FlagCondition = {
        type: 'flag',
        target: 'non_existent_flag',
        value: false,
      };
      
      expect(ConditionEvaluator.evaluate(condition, gameState, character)).toBe(true);
    });
  });
  
  describe('Counter conditions', () => {
    it('evaluates equals correctly', () => {
      gameState.counters['test_counter'] = 10;
      
      const condition: CounterCondition = {
        type: 'counter',
        target: 'test_counter',
        operator: 'equals',
        value: 10,
      };
      
      expect(ConditionEvaluator.evaluate(condition, gameState, character)).toBe(true);
    });
    
    it('evaluates greater_than correctly', () => {
      gameState.counters['test_counter'] = 15;
      
      const condition: CounterCondition = {
        type: 'counter',
        target: 'test_counter',
        operator: 'greater_than',
        value: 10,
      };
      
      expect(ConditionEvaluator.evaluate(condition, gameState, character)).toBe(true);
    });
    
    it('treats undefined counters as 0', () => {
      const condition: CounterCondition = {
        type: 'counter',
        target: 'non_existent_counter',
        operator: 'equals',
        value: 0,
      };
      
      expect(ConditionEvaluator.evaluate(condition, gameState, character)).toBe(true);
    });
  });
  
  describe('Item conditions', () => {
    it('returns true when player has item', () => {
      character.inventory.push({
        id: 'test_sword',
        quantity: 1,
      });
      
      const condition: ItemCondition = {
        type: 'item',
        target: 'test_sword',
      };
      
      expect(ConditionEvaluator.evaluate(condition, gameState, character)).toBe(true);
    });
    
    it('checks quantity correctly', () => {
      character.inventory.push({
        id: 'test_potion',
        quantity: 3,
      });
      
      const condition: ItemCondition = {
        type: 'item',
        target: 'test_potion',
        quantity: 5,
      };
      
      expect(ConditionEvaluator.evaluate(condition, gameState, character)).toBe(false);
    });
    
    it('checks equipped status', () => {
      character.inventory.push({
        id: 'test_sword',
        quantity: 1,
      });
      
      character.equipment.weapon = {
        id: 'test_sword',
        // ... other item data
      };
      
      const condition: ItemCondition = {
        type: 'item',
        target: 'test_sword',
        equipped: true,
      };
      
      expect(ConditionEvaluator.evaluate(condition, gameState, character)).toBe(true);
    });
  });
  
  describe('Logical operators', () => {
    it('evaluates AND correctly (all true)', () => {
      gameState.flags['flag1'] = true;
      gameState.flags['flag2'] = true;
      
      const condition: AndCondition = {
        type: 'and',
        conditions: [
          { type: 'flag', target: 'flag1', value: true },
          { type: 'flag', target: 'flag2', value: true },
        ],
      };
      
      expect(ConditionEvaluator.evaluate(condition, gameState, character)).toBe(true);
    });
    
    it('evaluates AND correctly (one false)', () => {
      gameState.flags['flag1'] = true;
      gameState.flags['flag2'] = false;
      
      const condition: AndCondition = {
        type: 'and',
        conditions: [
          { type: 'flag', target: 'flag1', value: true },
          { type: 'flag', target: 'flag2', value: true },
        ],
      };
      
      expect(ConditionEvaluator.evaluate(condition, gameState, character)).toBe(false);
    });
    
    it('evaluates OR correctly (one true)', () => {
      gameState.flags['flag1'] = false;
      gameState.flags['flag2'] = true;
      
      const condition: OrCondition = {
        type: 'or',
        conditions: [
          { type: 'flag', target: 'flag1', value: true },
          { type: 'flag', target: 'flag2', value: true },
        ],
      };
      
      expect(ConditionEvaluator.evaluate(condition, gameState, character)).toBe(true);
    });
    
    it('evaluates NOT correctly', () => {
      gameState.flags['test_flag'] = false;
      
      const condition: NotCondition = {
        type: 'not',
        condition: { type: 'flag', target: 'test_flag', value: true },
      };
      
      expect(ConditionEvaluator.evaluate(condition, gameState, character)).toBe(true);
    });
    
    it('handles nested conditions', () => {
      gameState.flags['flag1'] = true;
      gameState.flags['flag2'] = true;
      gameState.flags['flag3'] = false;
      
      // (flag1 AND flag2) OR flag3
      const condition: OrCondition = {
        type: 'or',
        conditions: [
          {
            type: 'and',
            conditions: [
              { type: 'flag', target: 'flag1', value: true },
              { type: 'flag', target: 'flag2', value: true },
            ],
          },
          { type: 'flag', target: 'flag3', value: true },
        ],
      };
      
      expect(ConditionEvaluator.evaluate(condition, gameState, character)).toBe(true);
    });
  });
  
  describe('Performance', () => {
    it('evaluates 100 conditions in under 50ms', () => {
      const conditions: Condition[] = Array.from({ length: 100 }, (_, i) => ({
        type: 'flag',
        target: `flag_${i}`,
        value: true,
      }));
      
      // Set all flags to true
      conditions.forEach((c: any) => {
        gameState.flags[c.target] = true;
      });
      
      const start = Date.now();
      
      conditions.forEach(condition => {
        ConditionEvaluator.evaluate(condition, gameState, character);
      });
      
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThan(50);
    });
  });
  
  describe('explainFailure', () => {
    it('explains flag failure', () => {
      gameState.flags['test_flag'] = false;
      
      const condition: FlagCondition = {
        type: 'flag',
        target: 'test_flag',
        value: true,
      };
      
      const explanation = ConditionEvaluator.explainFailure(condition, gameState, character);
      
      expect(explanation).toContain('test_flag');
      expect(explanation).toContain('false');
      expect(explanation).toContain('true');
    });
  });
});
```

### Definition of Done

- [ ] ConditionEvaluator implemented
- [ ] All 11 condition types working
- [ ] AND/OR/NOT operators working
- [ ] Nested conditions supported
- [ ] Short-circuit evaluation working
- [ ] 95%+ test coverage
- [ ] Performance < 50ms for 100 conditions
- [ ] Error handling robust
- [ ] Documentation complete
- [ ] Code reviewed

### Estimated Time

- **Core logic:** 3 hours
- **Logical operators:** 2 hours
- **Testing:** 2 hours
- **Documentation:** 1 hour
- **Total:** ~8 hours

### Notes

- Critical component - bugs break game progression
- Short-circuit evaluation is important for performance
- Explain failure is invaluable for debugging
- Consider caching evaluation results (future optimization)

### Related Documents

- Architecture Document: Section 6.3 (Condition System)
- Story 2.1: Condition type definitions



## Story 2.4: Implement Consequence Applicator

**Story ID:** 2.4  
**Story Points:** 5 SP  
**Priority:** Critical  
**Dependencies:** Story 2.1, Story 2.3

### User Story

> **As a** game developer  
> **I want** a consequence applicator that atomically applies consequences  
> **So that** game state changes are consistent and can be rolled back on error

### Technical Implementation Summary

**File:** `src/services/ConsequenceApplicator.ts`

```typescript
export class ConsequenceApplicator {
  /**
   * Apply consequences to game state atomically
   * All consequences succeed or all fail (transaction)
   */
  public static async apply(
    consequences: Consequence[],
    gameState: GameState,
    character: PlayerCharacter
  ): Promise<ApplyResult> {
    // Create snapshot for rollback
    const snapshot = this.createSnapshot(gameState, character);
    
    try {
      // Apply each consequence
      for (const consequence of consequences) {
        this.applyConsequence(consequence, gameState, character);
      }
      
      // Check for side effects (level up, death, etc.)
      this.handleSideEffects(gameState, character);
      
      return { success: true };
    } catch (error) {
      // Rollback on error
      this.rollback(snapshot, gameState, character);
      return { success: false, error };
    }
  }
  
  private static applyConsequence(
    consequence: Consequence,
    gameState: GameState,
    character: PlayerCharacter
  ): void {
    switch (consequence.type) {
      case 'flag':
        gameState.flags[consequence.target] = consequence.value;
        break;
      
      case 'counter':
        const current = gameState.counters[consequence.target] ?? 0;
        if (consequence.action === 'set') {
          gameState.counters[consequence.target] = consequence.value;
        } else if (consequence.action === 'increment') {
          gameState.counters[consequence.target] = current + consequence.value;
        } else {
          gameState.counters[consequence.target] = current - consequence.value;
        }
        break;
      
      case 'item':
        if (consequence.action === 'add') {
          this.addItem(consequence.target, character, consequence.quantity, consequence.autoEquip);
        } else {
          this.removeItem(consequence.target, character, consequence.quantity);
        }
        break;
      
      case 'experience':
        character.experience += consequence.value;
        break;
      
      case 'health':
        character.health += consequence.value;
        character.health = Math.max(0, Math.min(character.health, character.maxHealth));
        break;
      
      case 'relationship':
        const affinity = gameState.relationships[consequence.target] ?? 0;
        gameState.relationships[consequence.target] = Math.max(-100, Math.min(100, affinity + consequence.value));
        break;
      
      // ... other consequence types
    }
  }
}
```

**Key Features:**
- Atomic transactions (all-or-nothing)
- Snapshot/rollback on error
- Side effects handling (level up, death)
- Event notifications for UI
- 95%+ test coverage required

**Testing Focus:**
- Test each consequence type
- Test rollback on error
- Test side effects (level up at XP threshold)
- Test edge cases (negative health, item overflow)

**Estimated Time:** 8 hours

---

## Story 2.5: Implement Variable Interpolation

**Story ID:** 2.5  
**Story Points:** 3 SP  
**Priority:** High  
**Dependencies:** Story 2.1

### User Story

> **As a** content creator  
> **I want** dynamic text with variables  
> **So that** scenarios can reference player name, stats, gold, etc.

### Technical Implementation Summary

**File:** `src/services/VariableInterpolator.ts`

```typescript
export class VariableInterpolator {
  /**
   * Replace {{variables}} in text with actual values
   * 
   * Supported patterns:
   * - {{playerName}} → Character name
   * - {{gold}} → Gold amount
   * - {{location}} → Current location name
   * - {{gold|number}} → Formatted number (1,234)
   * - {{flag:has_sword|armed|unarmed}} → Conditional text
   */
  public static interpolate(
    text: string,
    gameState: GameState,
    character: PlayerCharacter,
    i18n: any
  ): string {
    return text.replace(/\{\{(.+?)\}\}/g, (match, variable) => {
      return this.resolveVariable(variable.trim(), gameState, character, i18n);
    });
  }
  
  private static resolveVariable(
    variable: string,
    gameState: GameState,
    character: PlayerCharacter,
    i18n: any
  ): string {
    // Check for conditional: {{flag:key|trueText|falseText}}
    if (variable.includes(':')) {
      const [type, rest] = variable.split(':', 2);
      
      if (type === 'flag') {
        const [flagName, trueText, falseText] = rest.split('|');
        const flagValue = gameState.flags[flagName.trim()] ?? false;
        return flagValue ? trueText.trim() : falseText.trim();
      }
    }
    
    // Check for formatter: {{value|formatter}}
    if (variable.includes('|')) {
      const [varName, formatter] = variable.split('|', 2);
      const value = this.getSimpleVariable(varName.trim(), gameState, character);
      return this.formatValue(value, formatter.trim());
    }
    
    // Simple variable
    return this.getSimpleVariable(variable, gameState, character);
  }
  
  private static getSimpleVariable(
    name: string,
    gameState: GameState,
    character: PlayerCharacter
  ): string {
    switch (name) {
      case 'playerName': return character.name;
      case 'gold': return character.gold.toString();
      case 'level': return character.level.toString();
      case 'health': return character.health.toString();
      case 'maxHealth': return character.maxHealth.toString();
      case 'location': return gameState.location;
      case 'day': return gameState.gameTime.day.toString();
      default:
        console.warn(`Unknown variable: ${name}`);
        return `{{${name}}}`;
    }
  }
  
  private static formatValue(value: string, formatter: string): string {
    switch (formatter) {
      case 'number':
        return parseInt(value).toLocaleString();
      case 'upper':
        return value.toUpperCase();
      case 'lower':
        return value.toLowerCase();
      default:
        return value;
    }
  }
}
```

**Examples:**
```typescript
// Input: "Здравей, {{playerName}}! Имаш {{gold|number}} злато."
// Output: "Здравей, Борис! Имаш 1,234 злато."

// Input: "Ти си {{flag:has_sword|въоръжен|невъоръжен}}."
// Output: "Ти си въоръжен." (if has_sword = true)
```

**Testing:** 80%+ coverage
**Estimated Time:** 3-4 hours

---

## Story 2.6: Implement Choice Processing

**Story ID:** 2.6  
**Story Points:** 5 SP  
**Priority:** Critical  
**Dependencies:** Stories 2.2, 2.3, 2.4, 2.5

### User Story

> **As a** player  
> **I want** my choices to process correctly  
> **So that** the game responds properly to my decisions

### Technical Implementation Summary

**File:** `src/services/ChoiceProcessor.ts`

```typescript
export class ChoiceProcessor {
  /**
   * Process player choice
   * 
   * Flow:
   * 1. Validate choice is available (check conditions)
   * 2. Perform skill check if required
   * 3. Apply consequences (success or failure path)
   * 4. Load next scenario
   * 5. Handle edge cases (death, etc.)
   */
  public static async processChoice(
    choice: Choice,
    scenario: Scenario,
    gameState: GameState,
    character: PlayerCharacter
  ): Promise<ChoiceResult> {
    // Step 1: Check if choice is available
    if (!this.isChoiceAvailable(choice, gameState, character)) {
      throw new Error('Choice not available');
    }
    
    // Step 2: Perform skill check if required
    let skillCheckResult: SkillCheckResult | undefined;
    let success = true;
    
    if (choice.skillCheck) {
      const skillLevel = character.skills[choice.skillCheck.skill];
      const attributeBonus = this.getAttributeBonus(choice.skillCheck.skill, character);
      
      skillCheckResult = performSkillCheck(
        choice.skillCheck,
        skillLevel,
        attributeBonus
      );
      
      success = skillCheckResult.success;
    }
    
    // Step 3: Apply consequences
    const consequences = success ? choice.consequences : choice.failureConsequences || [];
    
    await ConsequenceApplicator.apply(consequences, gameState, character);
    
    // Step 4: Determine next scenario
    const nextScenarioId = success ? choice.nextScenario : (choice.nextScenarioOnFailure || choice.nextScenario);
    
    // Step 5: Check for special states
    if (character.health <= 0) {
      return { type: 'death', skillCheckResult };
    }
    
    // Step 6: Load next scenario
    const nextScenario = await ScenarioLoader.getInstance().loadScenario(nextScenarioId);
    
    return {
      type: 'success',
      nextScenario,
      skillCheckResult,
    };
  }
}
```

**Testing:** 90%+ coverage required (critical path)
**Estimated Time:** 6-7 hours

---

## Story 2.7: Implement Scenario Cache

**Story ID:** 2.7  
**Story Points:** 3 SP  
**Priority:** Medium  
**Dependencies:** Story 2.2

### User Story

> **As a** player  
> **I want** fast scenario loading  
> **So that** transitions are smooth without loading screens

### Technical Implementation Summary

**File:** `src/services/ScenarioCache.ts`

```typescript
/**
 * LRU Cache for scenarios
 * Max 20 scenarios, evicts least recently used
 */
export class ScenarioCache {
  private cache: Map<string, CacheEntry> = new Map();
  private accessOrder: string[] = [];
  private readonly maxSize = 20;
  
  public get(scenarioId: string): Scenario | null {
    const entry = this.cache.get(scenarioId);
    
    if (!entry) {
      return null;
    }
    
    // Update access order (LRU)
    this.updateAccessOrder(scenarioId);
    
    // Update stats
    entry.hits++;
    entry.lastAccess = Date.now();
    
    return entry.scenario;
  }
  
  public set(scenarioId: string, scenario: Scenario): void {
    // Evict if cache full
    if (this.cache.size >= this.maxSize && !this.cache.has(scenarioId)) {
      this.evictLRU();
    }
    
    this.cache.set(scenarioId, {
      scenario,
      addedAt: Date.now(),
      lastAccess: Date.now(),
      hits: 0,
    });
    
    this.updateAccessOrder(scenarioId);
  }
  
  private evictLRU(): void {
    const lruId = this.accessOrder[0];
    this.cache.delete(lruId);
    this.accessOrder.shift();
  }
  
  private updateAccessOrder(scenarioId: string): void {
    // Remove from current position
    const index = this.accessOrder.indexOf(scenarioId);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
    
    // Add to end (most recently used)
    this.accessOrder.push(scenarioId);
  }
}
```

**Performance Target:** 50%+ load time improvement
**Testing:** 85%+ coverage
**Estimated Time:** 3-4 hours

---

## Story 2.8: Write Engine Tests

**Story ID:** 2.8  
**Story Points:** 8 SP  
**Priority:** Critical  
**Dependencies:** Stories 2.2-2.7

### User Story

> **As a** developer  
> **I want** comprehensive engine tests  
> **So that** I can confidently refactor and extend the engine

### Test Coverage Areas

1. **Unit Tests (60% of effort)**
   - ScenarioLoader: all methods
   - ConditionEvaluator: all condition types
   - ConsequenceApplicator: all consequence types
   - VariableInterpolator: all patterns
   - ChoiceProcessor: all paths
   - ScenarioCache: LRU logic

2. **Integration Tests (30% of effort)**
   - Complete choice flow: choice → skill check → consequences → next scenario
   - Multi-scenario progression
   - Error handling across services
   - Cache performance

3. **Edge Cases (10% of effort)**
   - Missing scenarios
   - Corrupted data
   - Invalid conditions
   - Death scenarios
   - Memory limits

**Coverage Target:** 90%+ overall
**Estimated Time:** 10-12 hours

---

## Epic 2 Summary (Full Detail)

**Total Stories:** 8  
**Total Story Points:** 34 SP  
**Total Estimated Time:** 50+ hours  
**Sprint Duration:** 6-7 days (2-week sprint with team of 3)

**Completion Checklist:**
- [ ] Story 2.1: Types defined ✅
- [ ] Story 2.2: ScenarioLoader working ✅
- [ ] Story 2.3: ConditionEvaluator working ✅
- [ ] Story 2.4: ConsequenceApplicator working ✅
- [ ] Story 2.5: VariableInterpolator working ✅
- [ ] Story 2.6: ChoiceProcessor working ✅
- [ ] Story 2.7: Cache implemented ✅
- [ ] Story 2.8: Tests passing (90%+) ✅

**Sprint Demo:**
- Show complete scenario flow
- Demonstrate skill checks
- Show conditional choices
- Display cache performance metrics

**Next Epic:** Epic 3 - State Management & Persistence (21 SP)

---

**END OF EPIC 2 USER STORIES (FULL DETAIL)**
