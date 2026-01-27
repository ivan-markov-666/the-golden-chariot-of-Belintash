# 🔧 CORRECTIONS APPLICATION GUIDE
## Epic 1 & Epic 2 - Practical Implementation

**Version:** 1.2  
**Date:** January 14, 2026  
**Time to Complete:** 30-45 minutes  
**Difficulty:** Easy (copy-paste + test)

---

## 📋 Overview

This guide shows you **exactly** how to apply all 15 fixes and 11 improvements (вкл. локализация) от ревюто към проекта.

**What You'll Do:**
1. ✅ Add 7 new files
2. ✅ Update 6 existing files (добавени Localization Architecture стъпки)  
3. ✅ Install 1 new package
4. ✅ Update Localization Architecture (pluralization + Weblate)
5. ✅ Test everything works

**Result:** Production-ready code base with all issues fixed!

---

## Part 1: Prerequisites

```bash
# 1. Make sure you're in project root
pwd
# Should show: /path/to/golden-chariot-belintash

# 2. Backup current code (just in case)
git add .
git commit -m "Before applying review corrections"
git branch backup-before-corrections

# 3. Verify Node.js version
node -v
# Should be: v18.x or v20.x
```

---

## Part 2: Add New Files (7 files)

### File 1: Global Type Definitions

**Create:** `src/global.d.ts`

```bash
cat > src/global.d.ts << 'EOF'
/**
 * Global type definitions
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

export {};
EOF
```

✅ **Why:** Fixes TypeScript errors for `__DEV__` and file imports

---

### File 2: PlayerCharacter Types

**Create:** `src/game/types/character.ts`

```bash
# First, create directory if not exists
mkdir -p src/game/types

# Create file (this is long, so using heredoc)
cat > src/game/types/character.ts << 'EOF'
/**
 * Player Character Types
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
  
  // Skills (16 skills)
  skills: {
    persuasion: number;
    intimidation: number;
    deception: number;
    insight: number;
    perception: number;
    investigation: number;
    survival: number;
    stealth: number;
    sleight_of_hand: number;
    athletics: number;
    acrobatics: number;
    medicine: number;
    herbalism: number;
    arcana: number;
    history: number;
    religion: number;
  };
  
  // Inventory
  inventory: Array<{
    id: string;
    quantity: number;
  }>;
  inventoryMaxSize: number;
  
  // Equipment
  equipment: {
    weapon: { id: string } | null;
    armor: { id: string } | null;
    accessory: { id: string } | null;
    amulet: { id: string } | null;
  };
  
  // Status effects
  statusEffects: Array<any>;
  
  // Metadata
  metadata: {
    createdAt: number;
    lastPlayedAt: number;
    playtime: number;
  };
}

export function createDefaultCharacter(name: string): PlayerCharacter {
  return {
    id: `char_${Date.now()}`,
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
    },
  };
}

export function calculateAttributeModifier(attributeValue: number): number {
  return Math.floor((attributeValue - 50) / 10);
}
EOF
```

✅ **Why:** Fixes missing PlayerCharacter type referenced in ConditionEvaluator

**Update exports:**
```bash
# Add to types/index.ts
echo "export * from './character';" >> src/game/types/index.ts
```

---

### File 3: Quick Reference Guide

**Create:** `docs/QUICK-REFERENCE.md`

```bash
mkdir -p docs

cat > docs/QUICK-REFERENCE.md << 'EOF'
# Quick Reference Guide

## Common Commands

### Development
```bash
npm start                    # Start Metro bundler
npm run ios                  # Run on iOS (Mac only)
npm run android              # Run on Android
```

### Testing
```bash
npm test                     # Run tests
npm run test:watch           # Watch mode
npm run test:coverage        # Coverage report
```

### Code Quality
```bash
npm run lint                 # Check code style
npm run lint:fix             # Fix code style
npm run type-check           # Check TypeScript
```

## Troubleshooting

### Metro Bundler Won't Start
```bash
npm start -- --reset-cache
```

### iOS Build Fails
```bash
cd ios && pod install && cd ..
```

### Android Build Fails
```bash
cd android && ./gradlew clean && cd ..
```

### Tests Fail
```bash
npm test -- --clearCache
```

## Project Structure
```
src/
├── components/     # UI components
├── game/           # Game logic
├── services/       # Business logic
├── store/          # State management
└── utils/          # Utilities
```
EOF
```

✅ **Why:** Quick troubleshooting reference for developers

---

### File 4: Scenario Validator Tool

**Create:** `tools/validate-scenarios.ts`

```bash
mkdir -p tools

cat > tools/validate-scenarios.ts << 'EOF'
/**
 * Scenario Validator Tool
 * 
 * Usage: npm run validate:scenarios
 */

import * as fs from 'fs';
import * as path from 'path';

const scenariosDir = path.join(__dirname, '../src/game/data/scenarios');

function validateScenarios(): void {
  if (!fs.existsSync(scenariosDir)) {
    console.log('📁 Scenarios directory not found (will be created later)');
    process.exit(0);
  }
  
  const files = fs.readdirSync(scenariosDir).filter(f => f.endsWith('.json'));
  
  console.log(`\n🔍 Validating ${files.length} scenarios...\n`);
  
  let valid = 0;
  let invalid = 0;
  
  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(scenariosDir, file), 'utf-8');
      JSON.parse(content); // Basic JSON validation
      console.log(`✅ ${file}`);
      valid++;
    } catch (error: any) {
      console.error(`❌ ${file}: ${error.message}`);
      invalid++;
    }
  }
  
  console.log(`\n📊 Summary: ${valid} valid, ${invalid} invalid\n`);
  
  if (invalid > 0) {
    process.exit(1);
  }
}

validateScenarios();
EOF
```

✅ **Why:** Validates scenario JSON files before runtime

---

### File 5: VS Code Workspace Settings

**Create:** `.vscode/settings.json`

```bash
mkdir -p .vscode

cat > .vscode/settings.json << 'EOF'
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "files.eol": "\n",
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "jest.autoRun": "off"
}
EOF
```

✅ **Why:** Consistent IDE settings across team

---

### File 6: VS Code Extensions Recommendations

**Create:** `.vscode/extensions.json`

```bash
cat > .vscode/extensions.json << 'EOF'
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "expo.vscode-expo-tools",
    "orta.vscode-jest"
  ]
}
EOF
```

✅ **Why:** Prompts team to install useful extensions

---

### File 7: Integration Test Example

**Create:** `src/services/__tests__/integration/CompleteFlow.test.ts`

```bash
mkdir -p src/services/__tests__/integration

cat > src/services/__tests__/integration/CompleteFlow.test.ts << 'EOF'
/**
 * Integration Test: Complete Flow
 * 
 * Tests the entire pipeline (placeholder for now)
 */

describe('Complete Flow Integration', () => {
  it('is a placeholder test', () => {
    // TODO: Implement full integration test
    // See Epic 2 Story 2.8 for complete example
    expect(true).toBe(true);
  });
});
EOF
```

✅ **Why:** Structure for future integration tests

---

## Part 3: Update Existing Files (5 files)

### Update 1: tsconfig.json (Add Path Aliases)

```bash
# Backup current
cp tsconfig.json tsconfig.json.backup

# Update with path aliases
cat > tsconfig.json << 'EOF'
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
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
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-native",
    
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
    "node_modules"
  ]
}
EOF
```

✅ **Why:** Enables clean imports like `@types/scenario` instead of `../../../`

---

### Update 2: babel.config.js (Path Resolver)

```bash
# Backup
cp babel.config.js babel.config.js.backup

cat > babel.config.js << 'EOF'
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
EOF
```

✅ **Why:** Makes path aliases work in runtime

---

### Update 3: jest.setup.js (Enhanced Mocks)

```bash
# Backup
cp jest.setup.js jest.setup.js.backup

cat > jest.setup.js << 'EOF'
// Mock console
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

// Mock __DEV__
global.__DEV__ = true;

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock React Navigation
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    addListener: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
}));

// Mock Reanimated
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
    gestureHandlerRootHOC: jest.fn(),
    Directions: {},
  };
});

// Mock Expo modules
jest.mock('expo-font');
jest.mock('expo-asset');

jest.useFakeTimers();
jest.setTimeout(10000);
EOF
```

✅ **Why:** Comprehensive native module mocks for testing

---

### Update 4: package.json (Add Scripts)

```bash
# Add validation script
npm pkg set scripts.validate:scenarios="ts-node tools/validate-scenarios.ts"

# Verify
npm run
# Should show validate:scenarios in list
```

✅ **Why:** Adds scenario validation command

---

### Update 5: .github/workflows/test.yml (Node 20)

**Only if you have GitHub Actions:**

```bash
# Update Node version in workflow
sed -i '' 's/node-version: .18./node-version: '\''20'\''/g' .github/workflows/test.yml
sed -i '' 's/actions\/setup-node@v3/actions\/setup-node@v4/g' .github/workflows/test.yml
```

✅ **Why:** Uses latest Node LTS and GitHub Actions version

---

## Part 3b: Localization Architecture Updates (NEW in v1.2)

1. **Open** `claude-BMAD-files/LOCALIZATION-ARCHITECTURE.md`
2. **Add Section 2.5 – Pluralization Rules (Bulgarian example)**  
   ```jsonc
   // src/i18n/locales/bg/translation.json
   {
     "inventory": {
       "items_one": "{{count}} предмет",
       "items_few": "{{count}} предмета",
       "items_other": "{{count}} предмети"
     }
   }
   ```
   ```typescript
   i18n.init({
     pluralSeparator: '_',
     pluralization: {
       bg: (count: number) => {
         const n = Math.abs(count);
         if (n === 1) return 'one';
         if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14)) return 'few';
         return 'other';
       },
     },
   });
   ```
3. **Extend Section 4.4 – Community Translation Workflow** with **Option C: Weblate**  
   - Docker Compose snippet for self-hosted Weblate  
   - Hosted pricing note (~$20–50/month)  
   - Translator invite + glossary/QA process  
   - `tools/localization/weblate-sync.sh` script for syncing branches  
   - Cost/benefit guidance (self-hosted vs cloud, when to invest)
4. **Mark sections as updated** with version note “✅ Done v1.2, Jan 14 2026”.

✅ **Why:** Ensures localization pipeline covers pluralization edge cases and provides a scalable translation workflow.

---

## Part 4: Install Dependencies

```bash
# Install babel-plugin-module-resolver for path aliases
npm install --save-dev babel-plugin-module-resolver

# Install TypeScript 5.3.x (if not already installed)
npm install --save-dev typescript@~5.3.0

# Reinstall all dependencies (clean install)
rm -rf node_modules package-lock.json
npm install
```

---

## Part 5: Verification & Testing

### Step 1: Test TypeScript Compilation

```bash
npm run type-check
```

**Expected:** ✅ No errors

**If errors:** Check that all new files are created

---

### Step 2: Test Imports with Path Aliases

**Create test file:** `src/test-imports.ts`

```typescript
// Test path aliases
import type { Scenario } from '@types/scenario';
import type { PlayerCharacter } from '@types/character';

console.log('Path aliases working!');
```

```bash
npx tsc --noEmit src/test-imports.ts
```

**Expected:** ✅ No errors

**Cleanup:**
```bash
rm src/test-imports.ts
```

---

### Step 3: Run Tests

```bash
npm test
```

**Expected:** ✅ All tests pass (or skip if no tests yet)

---

### Step 4: Test App

```bash
# Start Metro
npm start

# In another terminal:
npm run ios    # or npm run android
```

**Expected:** ✅ App runs without errors

---

### Step 5: Validate Scenarios (Optional)

```bash
npm run validate:scenarios
```

**Expected:** Either validates scenarios or says "not found" (OK if no scenarios yet)

---

## Part 6: Commit Changes

```bash
# Check what changed
git status

# Review changes
git diff

# Stage all changes
git add .

# Commit
git commit -m "Apply Epic 1-2 review corrections

- Added global type definitions
- Added PlayerCharacter types
- Configured path aliases
- Enhanced Jest setup with native mocks
- Added scenario validator tool
- Added quick reference guide
- Updated tsconfig, babel, jest configs
- Updated package.json scripts

All 13 issues fixed, 10 improvements applied.
"

# Verify commit
git log -1 --stat
```

---

## Part 7: Verification Checklist

Check off each item:

### TypeScript
- [ ] `npm run type-check` passes
- [ ] No `__DEV__` errors
- [ ] Path aliases work (`@types/`, `@services/`, etc.)

### Testing
- [ ] `npm test` passes
- [ ] Jest setup has native mocks
- [ ] No module not found errors

### Build
- [ ] `npm run ios` works (Mac only)
- [ ] `npm run android` works
- [ ] No build errors

### Code Quality
- [ ] `npm run lint` passes
- [ ] VS Code auto-formats on save
- [ ] Extensions prompt appears in VS Code

### Documentation
- [ ] `docs/QUICK-REFERENCE.md` exists
- [ ] README.md updated
- [ ] `.vscode/settings.json` exists
- [ ] Localization Architecture updated (Section 2.5 + 4.4 notes)

### Scripts
- [ ] `npm run validate:scenarios` exists
- [ ] All scripts in package.json work

### Localization
- [ ] Bulgarian pluralization keys exported in `src/i18n/locales/bg/*`
- [ ] i18next pluralization config matches rules (one/few/other)
- [ ] Weblate workflow documented + sync script added

---

## 🎉 Success!

If all checks pass, you're done! Your project now has:

✅ All 13 issues fixed  
✅ All 10 improvements applied  
✅ Production-ready foundation  
✅ Clean, typed codebase  
✅ Better developer experience  

---

## Troubleshooting

### "Module not found" errors

```bash
# Clear Metro cache
npm start -- --reset-cache

# Clear watchman (Mac only)
watchman watch-del-all

# Reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors persist

```bash
# Restart TypeScript server in VS Code
# Cmd+Shift+P → "TypeScript: Restart TS Server"

# Or close and reopen VS Code
```

### Tests fail with "Cannot find module"

```bash
# Clear Jest cache
npm test -- --clearCache

# Run again
npm test
```

### Path aliases not working

```bash
# Verify babel-plugin-module-resolver installed
npm list babel-plugin-module-resolver

# If not installed:
npm install --save-dev babel-plugin-module-resolver

# Restart Metro
npm start -- --reset-cache
```

---

## Next Steps

After completing corrections, choose:

### Option A: Start Implementation
- Begin Sprint 1 (Epic 1)
- Build project foundation
- Setup development environment

### Option B: Continue Documentation
- Document Epic 3 (State Management)
- Complete foundation documentation
- Then start implementation

### Option C: Test Thoroughly
- Write more tests
- Test on physical devices
- Ensure everything works perfectly

---

## 📞 Need Help?

If you encounter issues:

1. Check this guide again
2. See QUICK-REFERENCE.md
3. Check GitHub issues
4. Ask team in Slack/Discord

---

**Completion Time:** 30-45 minutes  
**Difficulty:** Easy  
**Status:** Ready to apply! 🚀

---

**END OF CORRECTIONS APPLICATION GUIDE**
