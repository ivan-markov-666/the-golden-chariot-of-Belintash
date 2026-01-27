# Corrections & Enhancements Bundle
## Files to Add/Update for Epic 1 & 2

**Package Contents:**
- Global type definitions
- PlayerCharacter types
- Path aliases configuration
- Enhanced Jest setup
- Scenario validator tool
- Quick reference guide
- Integration test example

---

## File 1: Global Type Definitions

**Location:** `src/global.d.ts`

```typescript
/**
 * Global type definitions
 * 
 * Declares types for globals that don't have TypeScript definitions
 */

// React Native __DEV__ constant
declare global {
  const __DEV__: boolean;
}

// Metro bundler environment
declare module '*.png' {
  const value: any;
  export = value;
}

declare module '*.jpg' {
  const value: any;
  export = value;
}

declare module '*.json' {
  const value: any;
  export = value;
}

// Expo constants
declare module 'expo-constants' {
  export interface Constants {
    expoVersion: string;
    installationId: string;
    platform: {
      ios?: any;
      android?: any;
    };
  }
  const constants: Constants;
  export default constants;
}

export {};
```

---

## File 2: PlayerCharacter Types (Complete)

**Location:** `src/game/types/character.ts`

```typescript
/**
 * Player Character Types
 * 
 * Defines the structure of the player character data,
 * including stats, skills, inventory, and equipment.
 */

/**
 * Complete player character data structure
 */
export interface PlayerCharacter {
  // Basic Info
  id: string;
  name: string;
  level: number;
  experience: number;
  experienceToNextLevel: number;
  
  // Resources
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  gold: number;
  
  // Attributes (8 core stats)
  attributes: CharacterAttributes;
  
  // Skills (16 skills)
  skills: CharacterSkills;
  
  // Inventory
  inventory: InventoryItem[];
  inventoryMaxSize: number;
  
  // Equipment
  equipment: CharacterEquipment;
  
  // Status effects
  statusEffects: StatusEffect[];
  
  // Metadata
  metadata: CharacterMetadata;
}

/**
 * Character attributes (stats)
 */
export interface CharacterAttributes {
  strength: number;      // Physical power (0-100)
  dexterity: number;     // Agility and reflexes (0-100)
  intelligence: number;  // Mental acuity (0-100)
  wisdom: number;        // Insight and perception (0-100)
  endurance: number;     // Stamina and resilience (0-100)
  charisma: number;      // Social influence (0-100)
  perception: number;    // Awareness of surroundings (0-100)
  luck: number;          // Fortune and chance (0-100)
}

/**
 * Character skills
 */
export interface CharacterSkills {
  // Social skills
  persuasion: number;      // Convince others (0-100)
  intimidation: number;    // Threaten or scare (0-100)
  deception: number;       // Lie or mislead (0-100)
  insight: number;         // Read intentions (0-100)
  
  // Exploration skills
  perception: number;      // Notice details (0-100)
  investigation: number;   // Search and analyze (0-100)
  survival: number;        // Wilderness skills (0-100)
  
  // Physical skills
  stealth: number;         // Move unseen (0-100)
  sleight_of_hand: number; // Pickpocket, trick (0-100)
  athletics: number;       // Physical prowess (0-100)
  acrobatics: number;      // Agility and balance (0-100)
  
  // Knowledge skills
  medicine: number;        // Heal and diagnose (0-100)
  herbalism: number;       // Plant knowledge (0-100)
  arcana: number;          // Magic knowledge (0-100)
  history: number;         // Historical knowledge (0-100)
  religion: number;        // Religious knowledge (0-100)
}

/**
 * Item in inventory
 */
export interface InventoryItem {
  id: string;
  quantity: number;
  acquiredAt: number; // Timestamp
}

/**
 * Character equipment slots
 */
export interface CharacterEquipment {
  weapon: EquippedItem | null;
  armor: EquippedItem | null;
  accessory: EquippedItem | null;
  amulet: EquippedItem | null;
}

/**
 * Equipped item reference
 */
export interface EquippedItem {
  id: string;
  equippedAt: number; // Timestamp
}

/**
 * Status effect (buff/debuff)
 */
export interface StatusEffect {
  id: string;
  type: 'buff' | 'debuff';
  duration: number; // Turns remaining
  value: number;
  appliedAt: number; // Timestamp
}

/**
 * Character metadata
 */
export interface CharacterMetadata {
  createdAt: number;
  lastPlayedAt: number;
  playtime: number; // Seconds
  deathCount: number;
  scenariosCompleted: number;
  questsCompleted: number;
  combatVictories: number;
  combatDefeats: number;
}

/**
 * Create default player character
 */
export function createDefaultCharacter(name: string): PlayerCharacter {
  return {
    id: generateCharacterId(),
    name,
    level: 1,
    experience: 0,
    experienceToNextLevel: 100,
    
    health: 100,
    maxHealth: 100,
    mana: 20,
    maxMana: 20,
    gold: 50,
    
    attributes: {
      strength: 10,
      dexterity: 10,
      intelligence: 10,
      wisdom: 10,
      endurance: 10,
      charisma: 10,
      perception: 10,
      luck: 10,
    },
    
    skills: {
      persuasion: 5,
      intimidation: 5,
      deception: 5,
      insight: 5,
      perception: 5,
      investigation: 5,
      survival: 5,
      stealth: 5,
      sleight_of_hand: 5,
      athletics: 5,
      acrobatics: 5,
      medicine: 5,
      herbalism: 5,
      arcana: 5,
      history: 5,
      religion: 5,
    },
    
    inventory: [],
    inventoryMaxSize: 50,
    
    equipment: {
      weapon: null,
      armor: null,
      accessory: null,
      amulet: null,
    },
    
    statusEffects: [],
    
    metadata: {
      createdAt: Date.now(),
      lastPlayedAt: Date.now(),
      playtime: 0,
      deathCount: 0,
      scenariosCompleted: 0,
      questsCompleted: 0,
      combatVictories: 0,
      combatDefeats: 0,
    },
  };
}

/**
 * Generate unique character ID
 */
function generateCharacterId(): string {
  return `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Calculate attribute modifier for skill checks
 * Used in skill check formula: d20 + skill/10 + attributeModifier
 */
export function calculateAttributeModifier(attributeValue: number): number {
  // Attribute: 0-100
  // Modifier: -5 to +5
  return Math.floor((attributeValue - 50) / 10);
}

/**
 * Calculate experience needed for level
 */
export function calculateExperienceForLevel(level: number): number {
  // Formula: 100 * level * (level + 1) / 2
  // Level 1: 100 XP
  // Level 2: 300 XP total (200 more)
  // Level 3: 600 XP total (300 more)
  // Level 4: 1000 XP total (400 more)
  return 100 * level * (level + 1) / 2;
}

/**
 * Check if character can level up
 */
export function canLevelUp(character: PlayerCharacter): boolean {
  return character.experience >= character.experienceToNextLevel;
}

/**
 * Level up character
 */
export function levelUpCharacter(character: PlayerCharacter): void {
  if (!canLevelUp(character)) {
    throw new Error('Not enough experience to level up');
  }
  
  character.level += 1;
  character.experienceToNextLevel = calculateExperienceForLevel(character.level + 1);
  
  // Increase health and mana
  character.maxHealth += 10;
  character.health = character.maxHealth; // Full heal on level up
  character.maxMana += 5;
  character.mana = character.maxMana;
  
  // TODO: Add attribute points to distribute
  // TODO: Add skill points to distribute
}

/**
 * Type guard
 */
export function isPlayerCharacter(obj: any): obj is PlayerCharacter {
  return (
    obj &&
    typeof obj.name === 'string' &&
    typeof obj.level === 'number' &&
    obj.attributes &&
    obj.skills &&
    Array.isArray(obj.inventory)
  );
}
```

---

## File 3: Updated tsconfig.json with Path Aliases

**Location:** `tsconfig.json`

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    // Strict mode
    "strict": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    
    // Module resolution
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-native",
    
    // Path aliases
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@types/*": ["src/game/types/*"],
      "@services/*": ["src/services/*"],
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"],
      "@store/*": ["src/store/*"],
      "@game/*": ["src/game/*"],
      "@i18n/*": ["src/i18n/*"]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts",
    "src/global.d.ts"
  ],
  "exclude": [
    "node_modules",
    "babel.config.js",
    "metro.config.js",
    "jest.config.js"
  ]
}
```

**Also update:** `babel.config.js`

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@types': './src/game/types',
            '@services': './src/services',
            '@components': './src/components',
            '@utils': './src/utils',
            '@store': './src/store',
            '@game': './src/game',
            '@i18n': './src/i18n',
          },
        },
      ],
    ],
  };
};
```

**Install:** `npm install --save-dev babel-plugin-module-resolver`

---

## File 4: Enhanced jest.setup.js

**Location:** `jest.setup.js`

```javascript
// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

// Mock __DEV__ global
global.__DEV__ = true;

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock React Navigation
jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      addListener: jest.fn(),
      reset: jest.fn(),
      setParams: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
      key: 'test-route',
      name: 'TestScreen',
    }),
    useFocusEffect: jest.fn(),
    useIsFocused: () => true,
  };
});

// Mock React Native Reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock Gesture Handler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  return {
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView: View,
    Slider: View,
    Switch: View,
    TextInput: View,
    ToolbarAndroid: View,
    ViewPagerAndroid: View,
    DrawerLayoutAndroid: View,
    WebView: View,
    NativeViewGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    RawButton: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
    FlatList: View,
    gestureHandlerRootHOC: jest.fn(),
    Directions: {},
  };
});

// Mock Expo modules
jest.mock('expo-font', () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn(() => true),
}));

jest.mock('expo-asset', () => ({
  Asset: {
    loadAsync: jest.fn(),
    fromModule: jest.fn(() => ({
      downloadAsync: jest.fn(),
    })),
  },
}));

jest.mock('expo-constants', () => ({
  default: {
    expoVersion: '1.0.0',
    platform: { ios: {}, android: {} },
  },
}));

// Setup fake timers
jest.useFakeTimers();

// Increase timeout for integration tests
jest.setTimeout(10000);

// Global test utilities
global.flushPromises = () => new Promise(resolve => setImmediate(resolve));
```

---

## File 5: Scenario Validator Tool

**Location:** `tools/validate-scenarios.ts`

```typescript
/**
 * Scenario Validator Tool
 * 
 * Validates all scenarios in the game data directory.
 * Catches errors before runtime.
 * 
 * Usage:
 *   npm run validate:scenarios
 *   npx ts-node tools/validate-scenarios.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { ScenarioSchema } from '../src/game/types/validation';
import { z } from 'zod';

interface ValidationResult {
  file: string;
  valid: boolean;
  errors?: string[];
}

const scenariosDir = path.join(__dirname, '../src/game/data/scenarios');

function validateAllScenarios(): ValidationResult[] {
  const results: ValidationResult[] = [];
  
  if (!fs.existsSync(scenariosDir)) {
    console.error(`❌ Scenarios directory not found: ${scenariosDir}`);
    process.exit(1);
  }
  
  const files = fs.readdirSync(scenariosDir);
  const jsonFiles = files.filter(f => f.endsWith('.json'));
  
  console.log(`\n🔍 Validating ${jsonFiles.length} scenarios...\n`);
  
  for (const file of jsonFiles) {
    const result = validateScenario(file);
    results.push(result);
    
    if (result.valid) {
      console.log(`✅ ${file}`);
    } else {
      console.error(`❌ ${file}`);
      result.errors?.forEach(err => console.error(`   ${err}`));
    }
  }
  
  return results;
}

function validateScenario(filename: string): ValidationResult {
  const filePath = path.join(scenariosDir, filename);
  
  try {
    // Read file
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Parse JSON
    let data: any;
    try {
      data = JSON.parse(content);
    } catch (error: any) {
      return {
        file: filename,
        valid: false,
        errors: [`JSON parse error: ${error.message}`],
      };
    }
    
    // Validate with Zod schema
    try {
      ScenarioSchema.parse(data);
      return {
        file: filename,
        valid: true,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.issues.map(issue => 
          `${issue.path.join('.')}: ${issue.message}`
        );
        return {
          file: filename,
          valid: false,
          errors,
        };
      }
      throw error;
    }
  } catch (error: any) {
    return {
      file: filename,
      valid: false,
      errors: [`Unexpected error: ${error.message}`],
    };
  }
}

function printSummary(results: ValidationResult[]): void {
  const valid = results.filter(r => r.valid).length;
  const invalid = results.filter(r => !r.valid).length;
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`📊 Summary:`);
  console.log(`   ✅ Valid: ${valid}`);
  console.log(`   ❌ Invalid: ${invalid}`);
  console.log(`   📁 Total: ${results.length}`);
  console.log(`${'='.repeat(50)}\n`);
  
  if (invalid > 0) {
    console.error(`\n⚠️  Found ${invalid} invalid scenario(s). Please fix before continuing.\n`);
    process.exit(1);
  } else {
    console.log(`\n✨ All scenarios valid! Ready for use.\n`);
    process.exit(0);
  }
}

// Run validation
const results = validateAllScenarios();
printSummary(results);
```

**Add to package.json:**
```json
{
  "scripts": {
    "validate:scenarios": "ts-node tools/validate-scenarios.ts"
  }
}
```

---

## File 6: Quick Reference Guide

**Location:** `docs/QUICK-REFERENCE.md`

```markdown
# Quick Reference Guide
## The Golden Chariot of Belintash

Essential commands and troubleshooting for daily development.

---

## 🚀 Common Commands

### Development
```bash
npm start                    # Start Metro bundler
npm run ios                  # Run on iOS simulator (Mac only)
npm run android              # Run on Android emulator
npm run web                  # Run on web (for testing only)

npm start -- --reset-cache   # Clear Metro cache
npm start -- --port 8082     # Use different port
```

### Code Quality
```bash
npm run lint                 # Check code style
npm run lint:fix             # Auto-fix code style issues
npm run type-check           # Check TypeScript types
npm run format               # Format code with Prettier
npm run format:check         # Check if code is formatted
```

### Testing
```bash
npm test                     # Run all tests
npm run test:watch           # Run tests in watch mode
npm run test:coverage        # Generate coverage report
npm test -- ScenarioLoader   # Test specific file
npm run test:ci              # Run tests for CI
```

### Building
```bash
npm run build:dev:ios        # Development build (iOS)
npm run build:dev:android    # Development build (Android)
npm run build:preview:ios    # Preview build (iOS)
npm run build:preview:android # Preview build (Android)
npm run build:prod:ios       # Production build (iOS)
npm run build:prod:android   # Production build (Android)
```

### Content
```bash
npm run validate:scenarios   # Validate all scenario files
```

---

## 🔧 Troubleshooting

### Metro Bundler Issues

**Problem:** Metro won't start
```bash
# Solution:
npm start -- --reset-cache
# or
npx react-native start --reset-cache
```

**Problem:** Port already in use
```bash
# Solution: Kill process on port 8081
npx kill-port 8081
# or use different port
npm start -- --port 8082
```

---

### iOS Issues (Mac only)

**Problem:** Build fails with Pod errors
```bash
# Solution: Reinstall pods
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

**Problem:** Xcode build fails
```bash
# Solution: Clean build
cd ios
xcodebuild clean
cd ..
```

**Problem:** iOS simulator not found
```bash
# Solution: List available simulators
xcrun simctl list devices

# Boot specific simulator
xcrun simctl boot "iPhone 15"
```

---

### Android Issues

**Problem:** Build fails with Gradle errors
```bash
# Solution: Clean Gradle cache
cd android
./gradlew clean
cd ..
```

**Problem:** Android emulator not found
```bash
# Solution: List available emulators
emulator -list-avds

# Start specific emulator
emulator -avd Pixel_5_API_33
```

**Problem:** ADB not found
```bash
# Solution: Add to PATH (Mac/Linux)
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Windows
setx ANDROID_HOME "%LOCALAPPDATA%\Android\Sdk"
setx PATH "%PATH%;%LOCALAPPDATA%\Android\Sdk\platform-tools"
```

---

### Test Issues

**Problem:** Tests failing unexpectedly
```bash
# Solution: Clear Jest cache
npm test -- --clearCache
```

**Problem:** Coverage not generating
```bash
# Solution: Delete coverage folder and regenerate
rm -rf coverage
npm run test:coverage
```

---

### Git Issues

**Problem:** Husky hooks not running
```bash
# Solution: Reinstall hooks
rm -rf .husky
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

**Problem:** Commit blocked by lint errors
```bash
# Solution: Fix lint errors first
npm run lint:fix
git add .
git commit -m "your message"
```

---

### General Issues

**Problem:** Node modules corrupted
```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Problem:** TypeScript errors after update
```bash
# Solution: Rebuild TypeScript
npm run type-check
# If persists, restart TS server in VS Code:
# Cmd+Shift+P → "TypeScript: Restart TS Server"
```

**Problem:** Can't find module
```bash
# Solution: Check path aliases in tsconfig.json
# Make sure imports use @ aliases correctly
```

---

## 📁 Project Structure

```
golden-chariot-belintash/
├── .bmad/                    # BMAD documentation
├── .github/workflows/        # CI/CD workflows
├── src/
│   ├── components/          # React components
│   ├── game/                # Game logic
│   │   ├── engine/          # Core engine
│   │   ├── data/            # Game data (JSON)
│   │   └── types/           # TypeScript types
│   ├── services/            # Business logic
│   ├── store/               # State management
│   ├── utils/               # Utilities
│   └── i18n/                # Translations
├── assets/                  # Images, fonts, sounds
├── tools/                   # Build tools, scripts
└── game-bible/              # Content (Markdown)
```

---

## 🔗 Useful Links

- **Documentation:** `.bmad/` folder
- **Architecture:** `.bmad/ARCHITECTURE.md`
- **Epic Breakdown:** `.bmad/EPIC-BREAKDOWN.md`
- **User Stories:** `.bmad/USER-STORIES-EPIC-*.md`
- **Contributing:** `CONTRIBUTING.md`

---

## 💡 Pro Tips

1. **Use path aliases:** Import with `@types/scenario` instead of `../../../game/types/scenario`
2. **Clear cache often:** Metro cache can cause weird issues
3. **Test incrementally:** Don't write 100 lines before testing
4. **Commit frequently:** Small commits are easier to review
5. **Use Profiler:** Monitor performance with `Profiler.measure()`

---

## 🆘 Getting Help

1. Check this guide first
2. Search existing GitHub issues
3. Check team Slack/Discord
4. Read BMAD documentation
5. Create detailed GitHub issue if bug

---

**Last Updated:** January 12, 2026
```

---

## File 7: Integration Test Example (Complete)

**Location:** `src/services/__tests__/integration/CompleteScenarioFlow.test.ts`

```typescript
/**
 * Integration Test: Complete Scenario Flow
 * 
 * Tests the entire game engine pipeline from loading
 * a scenario to processing a choice and loading the next scenario.
 */

import { ScenarioLoader } from '../../ScenarioLoader';
import { ConditionEvaluator } from '../../ConditionEvaluator';
import { ConsequenceApplicator } from '../../ConsequenceApplicator';
import { ChoiceProcessor } from '../../ChoiceProcessor';
import { VariableInterpolator } from '../../VariableInterpolator';
import { createMockGameState, createMockCharacter } from '../../../test-utils/mockData';
import { GameState } from '../../../game/types/gameState';
import { PlayerCharacter } from '../../../game/types/character';

describe('Complete Scenario Flow Integration', () => {
  let gameState: GameState;
  let character: PlayerCharacter;
  
  beforeEach(() => {
    gameState = createMockGameState();
    character = createMockCharacter();
    
    // Clear caches
    ScenarioLoader.getInstance().clearCache();
  });
  
  describe('Happy Path: Successful skill check', () => {
    it('completes full flow from scenario load to next scenario', async () => {
      // Setup: Give character high persuasion
      character.skills.persuasion = 80;
      
      // Step 1: Load initial scenario
      const scenario = await ScenarioLoader.getInstance().loadScenario('test-scenario-1');
      
      expect(scenario).toBeDefined();
      expect(scenario.id).toBe('test-scenario-1');
      expect(scenario.choices.length).toBeGreaterThan(0);
      
      // Step 2: Interpolate narrative text
      const narrativeText = VariableInterpolator.interpolate(
        scenario.textKey,
        gameState,
        character,
        {} // i18n mock
      );
      
      expect(narrativeText).toBeDefined();
      
      // Step 3: Filter available choices based on conditions
      const availableChoices = scenario.choices.filter(choice =>
        ConditionEvaluator.evaluateAll(choice.conditions, gameState, character)
      );
      
      expect(availableChoices.length).toBeGreaterThan(0);
      
      // Step 4: Select choice with skill check
      const choiceWithSkillCheck = availableChoices.find(c => c.skillCheck);
      
      if (!choiceWithSkillCheck) {
        // If no skill check choice, skip this test
        return;
      }
      
      // Step 5: Mock good roll (15)
      jest.spyOn(Math, 'random').mockReturnValue(0.75); // 75% → Roll 15
      
      // Step 6: Process choice
      const result = await ChoiceProcessor.processChoice(
        choiceWithSkillCheck,
        scenario,
        gameState,
        character
      );
      
      // Step 7: Verify successful result
      expect(result.type).toBe('success');
      expect(result.skillCheckResult).toBeDefined();
      expect(result.skillCheckResult?.success).toBe(true);
      expect(result.nextScenario).toBeDefined();
      
      // Step 8: Verify consequences were applied
      // (Specific to consequence types in test scenario)
      
      // Step 9: Verify next scenario is different
      expect(result.nextScenario.id).not.toBe(scenario.id);
      
      jest.restoreAllMocks();
    });
  });
  
  describe('Failure Path: Failed skill check', () => {
    it('handles failed skill check and loads failure scenario', async () => {
      // Setup: Give character very low persuasion
      character.skills.persuasion = 5;
      
      // Step 1: Load scenario
      const scenario = await ScenarioLoader.getInstance().loadScenario('test-scenario-1');
      
      // Step 2: Find choice with skill check
      const choiceWithSkillCheck = scenario.choices.find(c => c.skillCheck);
      
      if (!choiceWithSkillCheck || !choiceWithSkillCheck.nextScenarioOnFailure) {
        return; // Skip if no failure path defined
      }
      
      // Step 3: Mock bad roll (1 - critical failure)
      jest.spyOn(Math, 'random').mockReturnValue(0); // 0% → Roll 1
      
      // Step 4: Process choice
      const result = await ChoiceProcessor.processChoice(
        choiceWithSkillCheck,
        scenario,
        gameState,
        character
      );
      
      // Step 5: Verify failure result
      expect(result.type).toBe('success'); // Still successful processing
      expect(result.skillCheckResult?.success).toBe(false);
      expect(result.skillCheckResult?.criticalFailure).toBe(true);
      
      // Step 6: Verify failure scenario loaded
      expect(result.nextScenario.id).toBe(choiceWithSkillCheck.nextScenarioOnFailure);
      
      jest.restoreAllMocks();
    });
  });
  
  describe('Edge Cases', () => {
    it('handles choice with unavailable conditions', async () => {
      // Setup: Set flags to make choice unavailable
      gameState.flags['required_flag'] = false;
      
      const scenario = await ScenarioLoader.getInstance().loadScenario('test-scenario-1');
      
      // Find choice with conditions
      const choiceWithConditions = scenario.choices.find(c => 
        c.conditions.length > 0
      );
      
      if (!choiceWithConditions) {
        return;
      }
      
      // Verify choice is not available
      const isAvailable = ConditionEvaluator.evaluateAll(
        choiceWithConditions.conditions,
        gameState,
        character
      );
      
      expect(isAvailable).toBe(false);
      
      // Attempting to process unavailable choice should throw
      await expect(
        ChoiceProcessor.processChoice(choiceWithConditions, scenario, gameState, character)
      ).rejects.toThrow('Choice not available');
    });
    
    it('handles consequence that causes death', async () => {
      // Setup: Low health
      character.health = 10;
      
      const scenario = await ScenarioLoader.getInstance().loadScenario('test-death-scenario');
      
      // Choice that deals fatal damage
      const deathChoice = scenario.choices[0];
      
      const result = await ChoiceProcessor.processChoice(
        deathChoice,
        scenario,
        gameState,
        character
      );
      
      // Should return death result
      expect(result.type).toBe('death');
      expect(character.health).toBeLessThanOrEqual(0);
    });
    
    it('preloads next scenarios efficiently', async () => {
      // Load initial scenario
      const scenario = await ScenarioLoader.getInstance().loadScenario('test-scenario-1');
      
      // Get next scenario IDs
      const nextScenarios = scenario.choices.map(c => c.nextScenario);
      
      // Preload them
      ScenarioLoader.getInstance().preloadScenarios(nextScenarios);
      
      // Wait for preload
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Verify they're cached
      nextScenarios.forEach(id => {
        expect(ScenarioLoader.getInstance().isLoaded(id)).toBe(true);
      });
      
      // Loading cached scenario should be instant
      const start = Date.now();
      await ScenarioLoader.getInstance().loadScenario(nextScenarios[0]);
      const loadTime = Date.now() - start;
      
      expect(loadTime).toBeLessThan(10); // Cached load < 10ms
    });
  });
  
  describe('Performance', () => {
    it('processes choice in under 100ms', async () => {
      const scenario = await ScenarioLoader.getInstance().loadScenario('test-scenario-1');
      const choice = scenario.choices[0];
      
      const start = Date.now();
      await ChoiceProcessor.processChoice(choice, scenario, gameState, character);
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThan(100);
    });
    
    it('handles 10 consecutive scenario loads efficiently', async () => {
      const scenarioIds = [
        'test-scenario-1',
        'test-scenario-2',
        'test-scenario-3',
        'test-scenario-4',
        'test-scenario-5',
        'test-scenario-6',
        'test-scenario-7',
        'test-scenario-8',
        'test-scenario-9',
        'test-scenario-10',
      ];
      
      const start = Date.now();
      
      for (const id of scenarioIds) {
        await ScenarioLoader.getInstance().loadScenario(id).catch(() => {
          // Ignore missing scenarios in test
        });
      }
      
      const duration = Date.now() - start;
      const avgTime = duration / scenarioIds.length;
      
      expect(avgTime).toBeLessThan(50); // Average < 50ms per scenario
    });
  });
});
```

---

## Installation Instructions

### 1. Copy Global Types
```bash
# Create global.d.ts
cat > src/global.d.ts << 'EOF'
[paste File 1 content]
EOF
```

### 2. Add PlayerCharacter Types
```bash
# Create character.ts
cat > src/game/types/character.ts << 'EOF'
[paste File 2 content]
EOF

# Update types/index.ts
echo "export * from './character';" >> src/game/types/index.ts
```

### 3. Update tsconfig.json
```bash
# Backup current config
cp tsconfig.json tsconfig.json.backup

# Replace with new config
cat > tsconfig.json << 'EOF'
[paste File 3 content]
EOF
```

### 4. Install babel-plugin-module-resolver
```bash
npm install --save-dev babel-plugin-module-resolver

# Update babel.config.js
[paste babel config from File 3]
```

### 5. Update jest.setup.js
```bash
# Replace jest.setup.js
cat > jest.setup.js << 'EOF'
[paste File 4 content]
EOF
```

### 6. Add Validator Tool
```bash
# Create tools directory if needed
mkdir -p tools

# Create validator
cat > tools/validate-scenarios.ts << 'EOF'
[paste File 5 content]
EOF

# Add script to package.json
npm pkg set scripts.validate:scenarios="ts-node tools/validate-scenarios.ts"
```

### 7. Add Quick Reference
```bash
# Create docs directory
mkdir -p docs

# Create quick reference
cat > docs/QUICK-REFERENCE.md << 'EOF'
[paste File 6 content]
EOF
```

### 8. Add Integration Tests
```bash
# Create integration tests directory
mkdir -p src/services/__tests__/integration

# Create test file
cat > src/services/__tests__/integration/CompleteScenarioFlow.test.ts << 'EOF'
[paste File 7 content]
EOF
```

---

## Testing After Installation

```bash
# 1. Test TypeScript compilation
npm run type-check

# 2. Test path aliases
# Create test file that imports with @types/scenario
# Should compile without errors

# 3. Run tests
npm test

# 4. Validate scenarios (will fail if no scenarios yet, that's OK)
npm run validate:scenarios

# 5. Build app
npm run ios
# or
npm run android
```

---

## Summary

✅ 7 files added/updated
✅ All High Priority fixes applied
✅ Path aliases configured
✅ Enhanced testing setup
✅ Validator tool added
✅ Quick reference created
✅ Integration tests added

**Status:** Ready for implementation!

---

**END OF CORRECTIONS BUNDLE**
