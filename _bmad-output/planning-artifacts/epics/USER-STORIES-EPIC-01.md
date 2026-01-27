# User Stories - Epic 1: Project Setup & Infrastructure
## The Golden Chariot of Belintash

**Epic:** Epic 1 - Project Setup & Infrastructure  
**Total Stories:** 6  
**Total Story Points:** 21 SP  
**Sprint:** Sprint 1  
**Priority:** Critical  
**Version:** 1.0  
**Date:** January 12, 2026

---

## Epic Overview

**Epic Goal:** Establish foundational project structure, development environment, and CI/CD pipeline.

**Epic Success Criteria:**
- React Native + Expo project initialized with TypeScript
- Development tools configured (ESLint, Prettier, Husky)
- Testing framework setup (Jest + React Native Testing Library)
- Build system configured (EAS Build for iOS + Android)
- CI/CD pipeline automated (GitHub Actions)
- Documentation complete for new developers

**Dependencies:** None (this is the first epic)

**Estimated Duration:** 3-5 days (Sprint 1)

---

## Table of Contents

- [Story 1.1: Initialize React Native Project](#story-11-initialize-react-native-project)
- [Story 1.2: Configure Development Tools](#story-12-configure-development-tools)
- [Story 1.3: Setup Testing Framework](#story-13-setup-testing-framework)
- [Story 1.4: Configure Build System](#story-14-configure-build-system)
- [Story 1.5: Setup CI/CD Pipeline](#story-15-setup-cicd-pipeline)
- [Story 1.6: Create Development Documentation](#story-16-create-development-documentation)

---

## Story 1.1: Initialize React Native Project

**Story ID:** 1.1  
**Story Points:** 2 SP  
**Priority:** Critical  
**Assignee:** Lead Developer  
**Sprint:** Sprint 1  
**Dependencies:** None

### User Story

> **As a** developer  
> **I want** a properly configured React Native + Expo project  
> **So that** I can start development with a solid foundation

### Detailed Description

Initialize a new React Native project using Expo managed workflow with TypeScript. Configure the project with strict TypeScript settings, setup the folder structure according to the Architecture document, and ensure the project runs on both iOS and Android simulators.

This story establishes the baseline project structure that all future development will build upon. It's critical that this is done correctly from the start to avoid restructuring later.

### Acceptance Criteria

#### Must Have
- [ ] Expo managed workflow initialized (SDK 50.x)
- [ ] TypeScript configured with strict mode enabled
- [ ] Project structure follows Architecture document specifications
- [ ] Git repository initialized with proper .gitignore
- [ ] README.md with basic setup instructions created
- [ ] Project successfully runs on iOS simulator
- [ ] Project successfully runs on Android emulator
- [ ] No errors or warnings in console on first run

#### Should Have
- [ ] app.json properly configured with app metadata
- [ ] package.json has correct project name and version
- [ ] Assets folder structure created (images, fonts)

#### Nice to Have
- [ ] Custom app icon placeholder
- [ ] Custom splash screen placeholder

### Technical Implementation

#### Step 1: Install Expo CLI

```bash
# Install Expo CLI globally
npm install -g expo-cli

# Verify installation
expo --version
# Expected: 6.x.x or higher
```

#### Step 2: Initialize Project

```bash
# Create new project with TypeScript template
npx create-expo-app@latest golden-chariot-belintash --template expo-template-blank-typescript

# Navigate to project
cd golden-chariot-belintash

# Verify structure
ls -la
```

#### Step 3: Configure TypeScript (Strict Mode)

**File:** `tsconfig.json`

```json
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
    "jsx": "react-native"
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

#### Step 4: Create Folder Structure

**According to Architecture Document:**

```bash
mkdir -p src/{components,game,store,services,navigation,utils,i18n}
mkdir -p src/components/{ui,game,screens}
mkdir -p src/game/{engine,data,types}
mkdir -p assets/{images,fonts,sounds}
mkdir -p tools
```

**Resulting Structure:**

```
golden-chariot-belintash/
├── .expo/
├── .git/
├── assets/
│   ├── images/
│   ├── fonts/
│   └── sounds/
├── src/
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   ├── game/         # Game-specific components
│   │   └── screens/      # Screen components
│   ├── game/
│   │   ├── engine/       # Core game engine
│   │   ├── data/         # Game data (scenarios, items, etc.)
│   │   └── types/        # TypeScript type definitions
│   ├── store/            # Zustand stores
│   ├── services/         # Business logic services
│   ├── navigation/       # React Navigation setup
│   ├── utils/            # Utility functions
│   └── i18n/             # Internationalization
├── tools/                # Build tools, scripts
├── .gitignore
├── app.json
├── App.tsx
├── package.json
├── tsconfig.json
└── README.md
```

#### Step 5: Configure app.json

**File:** `app.json`

```json
{
  "expo": {
    "name": "The Golden Chariot of Belintash",
    "slug": "golden-chariot-belintash",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#1a1a1a"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.goldenchariot.belintash",
      "buildNumber": "1.0.0"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#1a1a1a"
      },
      "package": "com.goldenchariot.belintash",
      "versionCode": 1
    },
    "web": {
      "favicon": "./assets/images/favicon.png"
    },
    "extra": {
      "gameVersion": "1.0.0",
      "contentVersion": "1.0.0"
    }
  }
}
```

#### Step 6: Initialize Git

```bash
# Initialize git repository
git init

# Create .gitignore (if not exists)
cat > .gitignore << 'EOF'
# Expo
.expo/
dist/
web-build/

# Node
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# MacOS
.DS_Store

# IDE
.vscode/
.idea/
*.swp
*.swo

# Environment
.env
.env.local

# Build
*.apk
*.ipa
*.aab

# Temp
temp/
tmp/

# Testing
coverage/
.jest/
EOF

# Add all files
git add .

# Initial commit
git commit -m "Initial project setup with Expo + TypeScript"
```

#### Step 7: Update README.md

**File:** `README.md`

```markdown
# The Golden Chariot of Belintash

A historical text-based RPG set in 1221 Bulgaria, inspired by Bulgarian folklore and Thracian mythology.

## Tech Stack

- React Native 0.73.x
- Expo SDK 50.x
- TypeScript 5.x
- Zustand (state management)
- React Navigation (navigation)
- i18next (internationalization)

## Prerequisites

- Node.js 18+ (LTS)
- npm or yarn
- iOS: Xcode 14+ (Mac only)
- Android: Android Studio with SDK 33+

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on iOS (Mac only)
npm run ios

# Run on Android
npm run android

# Run on web (for testing)
npm run web
```

## Project Structure

See [ARCHITECTURE.md](.bmad/ARCHITECTURE.md) for detailed architecture documentation.

## Development

- **Documentation:** `.bmad/` folder
- **Game Content:** `game-bible/` folder
- **Source Code:** `src/` folder
- **Tools:** `tools/` folder

## License

Copyright © 2026 Golden Chariot Development Team
```

#### Step 8: Update App.tsx (Entry Point)

**File:** `App.tsx`

```typescript
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>The Golden Chariot of Belintash</Text>
      <Text style={styles.subtitle}>Project Initialized ✓</Text>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#DAA520',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#f0f0f0',
  },
});
```

### Testing Steps

#### Manual Testing

1. **Test iOS (Mac only):**
   ```bash
   npm run ios
   ```
   - App opens in iOS Simulator
   - Shows title "The Golden Chariot of Belintash"
   - Shows "Project Initialized ✓"
   - No console errors

2. **Test Android:**
   ```bash
   npm run android
   ```
   - App opens in Android Emulator
   - Shows title and subtitle
   - No console errors

3. **Test TypeScript:**
   ```bash
   npx tsc --noEmit
   ```
   - No TypeScript errors
   - Strict mode warnings resolved

4. **Verify Folder Structure:**
   ```bash
   tree -L 3 src/
   ```
   - All folders created
   - Structure matches Architecture doc

### Definition of Done

- [ ] Project runs without errors on iOS
- [ ] Project runs without errors on Android
- [ ] TypeScript compiles with strict mode
- [ ] Git repository initialized with clean history
- [ ] README.md has setup instructions
- [ ] Folder structure matches Architecture document
- [ ] app.json properly configured
- [ ] No build warnings
- [ ] Code reviewed and approved
- [ ] Documentation updated

### Estimated Time

- **Setup time:** 30 minutes
- **Configuration:** 30 minutes
- **Testing:** 15 minutes
- **Documentation:** 15 minutes
- **Total:** ~1.5 hours

### Notes

- Use Expo SDK 50.x (latest stable as of Jan 2026)
- Keep Expo Go app installed on physical devices for testing
- If encountering issues with simulators, check Xcode/Android Studio installation
- Commit frequently with descriptive messages

### Related Documents

- Architecture Document: Section 2 (Technology Stack)
- Implementation Guide: Section 2 (Project Initialization)

---

## Story 1.2: Configure Development Tools

**Story ID:** 1.2  
**Story Points:** 3 SP  
**Priority:** High  
**Assignee:** Lead Developer  
**Sprint:** Sprint 1  
**Dependencies:** Story 1.1

### User Story

> **As a** developer  
> **I want** code quality tools configured  
> **So that** I can maintain consistent code standards across the team

### Detailed Description

Configure ESLint for code linting, Prettier for code formatting, and Husky for pre-commit hooks. Integrate these tools with VS Code for automatic formatting on save. Setup lint-staged to run linters only on staged files for faster commits.

This ensures all code follows consistent style and quality standards, preventing common bugs and making code reviews easier.

### Acceptance Criteria

#### Must Have
- [ ] ESLint configured with React Native + TypeScript rules
- [ ] Prettier configured and integrated with ESLint
- [ ] Husky pre-commit hooks setup and working
- [ ] lint-staged configured to run on staged files only
- [ ] VS Code workspace settings created for auto-format
- [ ] EditorConfig file created for cross-editor consistency
- [ ] Pre-commit hook runs and prevents commits with errors
- [ ] All existing code passes linting

#### Should Have
- [ ] Custom ESLint rules for project-specific patterns
- [ ] Prettier ignore file for generated code
- [ ] Git hook for commit message linting (optional)

#### Nice to Have
- [ ] Visual Studio Code extension recommendations file
- [ ] ESLint performance optimizations

### Technical Implementation

#### Step 1: Install ESLint Dependencies

```bash
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install --save-dev eslint-plugin-react eslint-plugin-react-native
npm install --save-dev eslint-plugin-react-hooks
```

#### Step 2: Configure ESLint

**File:** `.eslintrc.js`

```javascript
module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-native/all',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    'react',
    'react-native',
    '@typescript-eslint',
    'react-hooks',
  ],
  env: {
    'react-native/react-native': true,
    es6: true,
    node: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // TypeScript specific
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    
    // React specific
    'react/react-in-jsx-scope': 'off', // Not needed in React Native
    'react/prop-types': 'off', // Using TypeScript
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // React Native specific
    'react-native/no-unused-styles': 'error',
    'react-native/no-inline-styles': 'warn',
    'react-native/no-color-literals': 'warn',
    
    // General
    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    'prefer-const': 'error',
    'no-var': 'error',
  },
};
```

#### Step 3: Install Prettier

```bash
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier
```

#### Step 4: Configure Prettier

**File:** `.prettierrc`

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "bracketSpacing": true,
  "jsxBracketSameLine": false
}
```

**File:** `.prettierignore`

```
# Dependencies
node_modules/

# Build output
dist/
build/
.expo/

# Generated files
coverage/

# Package manager
package-lock.json
yarn.lock
```

#### Step 5: Update ESLint to Work with Prettier

**Update `.eslintrc.js`:**

```javascript
module.exports = {
  // ... previous config
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-native/all',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier', // Add this - must be last
  ],
  plugins: [
    'react',
    'react-native',
    '@typescript-eslint',
    'react-hooks',
    'prettier', // Add this
  ],
  rules: {
    // ... previous rules
    'prettier/prettier': 'error', // Add this
  },
};
```

#### Step 6: Install Husky and lint-staged

```bash
# Install packages
npm install --save-dev husky lint-staged

# Initialize Husky
npx husky install

# Add Husky to package.json prepare script
npm pkg set scripts.prepare="husky install"
```

#### Step 7: Create Pre-commit Hook

```bash
# Create pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"
```

**Verify `.husky/pre-commit` was created:**

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

#### Step 8: Configure lint-staged

**Add to `package.json`:**

```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write \"**/*.{ts,tsx,json,md}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,json,md}\"",
    "type-check": "tsc --noEmit"
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

#### Step 9: Create VS Code Workspace Settings

**File:** `.vscode/settings.json`

```json
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
  }
}
```

**File:** `.vscode/extensions.json`

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "expo.vscode-expo-tools"
  ]
}
```

#### Step 10: Create EditorConfig

**File:** `.editorconfig`

```ini
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false

[{package.json,*.yml}]
indent_size = 2
```

### Testing Steps

#### Test 1: Verify ESLint Works

```bash
# Run ESLint
npm run lint

# Expected: Should show any linting errors in existing code
# Fix errors manually or run:
npm run lint:fix
```

#### Test 2: Verify Prettier Works

```bash
# Check formatting
npm run format:check

# Fix formatting
npm run format
```

#### Test 3: Test Pre-commit Hook

```bash
# Create a test file with intentional errors
cat > src/test.ts << 'EOF'
const  test   =   "badly formatted"  ;
console.log(test)
EOF

# Try to commit
git add src/test.ts
git commit -m "Test pre-commit hook"

# Expected: Hook should run, fix formatting, and prevent commit if errors
```

#### Test 4: VS Code Integration

1. Open project in VS Code
2. Install recommended extensions (should prompt)
3. Open a .ts file
4. Add some unformatted code
5. Save file
6. **Expected:** File auto-formats on save

#### Test 5: Type Checking

```bash
# Run TypeScript compiler
npm run type-check

# Expected: No errors
```

### Definition of Done

- [ ] ESLint installed and configured
- [ ] Prettier installed and configured
- [ ] Husky pre-commit hooks working
- [ ] lint-staged runs on git commit
- [ ] VS Code auto-formats on save
- [ ] All existing code passes linting
- [ ] No TypeScript errors
- [ ] EditorConfig file created
- [ ] Documentation updated
- [ ] Team members can clone and run setup

### Common Issues & Solutions

**Issue 1:** "Husky hooks not running"
```bash
# Solution: Reinstall hooks
rm -rf .husky
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
chmod +x .husky/pre-commit
```

**Issue 2:** "ESLint and Prettier conflicting"
```bash
# Solution: Ensure prettier is last in extends
# And prettier/prettier rule is enabled
```

**Issue 3:** "Pre-commit hook too slow"
```bash
# Solution: Use lint-staged (already configured)
# It only lints staged files, not entire project
```

### Estimated Time

- **Installation:** 15 minutes
- **Configuration:** 45 minutes
- **Testing:** 30 minutes
- **Documentation:** 15 minutes
- **Total:** ~2 hours

### Notes

- Pre-commit hooks ensure code quality before it enters the repository
- Team members must run `npm install` after cloning to setup Husky
- VS Code extensions must be installed manually (or via extension recommendations)
- Consider disabling React Native specific rules if they're too strict

### Related Documents

- Architecture Document: Section 9 (Development Workflow)
- CONTRIBUTING.md: Coding standards section

---

## Story 1.3: Setup Testing Framework

**Story ID:** 1.3  
**Story Points:** 3 SP  
**Priority:** High  
**Assignee:** Lead Developer  
**Sprint:** Sprint 1  
**Dependencies:** Story 1.1, Story 1.2

### User Story

> **As a** developer  
> **I want** Jest and React Native Testing Library configured  
> **So that** I can write unit and integration tests for the game

### Detailed Description

Setup Jest as the testing framework and React Native Testing Library for component testing. Configure test utilities, helpers, and example tests. Setup coverage reporting to ensure code quality.

Testing is critical for a game with complex state management and branching narratives. This foundation ensures we can test game logic, UI components, and user interactions.

### Acceptance Criteria

#### Must Have
- [ ] Jest configured for React Native with TypeScript
- [ ] @testing-library/react-native installed and configured
- [ ] Test utilities and helpers created
- [ ] Example test written and passing
- [ ] Test coverage reporting configured (70% threshold)
- [ ] Test scripts added to package.json
- [ ] Tests run successfully in CI environment
- [ ] Mock files for AsyncStorage and other native modules

#### Should Have
- [ ] Custom test matchers for game-specific assertions
- [ ] Test data generators for scenarios, items, NPCs
- [ ] Snapshot testing examples

#### Nice to Have
- [ ] Visual regression testing setup
- [ ] E2E testing framework (Detox) configured

### Technical Implementation

#### Step 1: Install Testing Dependencies

```bash
# Core testing
npm install --save-dev jest @types/jest
npm install --save-dev @testing-library/react-native @testing-library/jest-native
npm install --save-dev react-test-renderer @types/react-test-renderer

# Additional testing utilities
npm install --save-dev jest-expo
npm install --save-dev @testing-library/react-hooks
```

#### Step 2: Configure Jest

**File:** `jest.config.js`

```javascript
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    '<rootDir>/jest.setup.js',
  ],
  testEnvironment: 'node',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
    '!src/**/index.ts',
  ],
  coverageThresholds: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)',
  ],
};
```

#### Step 3: Create Jest Setup File

**File:** `jest.setup.js`

```javascript
// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Keep native behaviour for error and warn
  error: jest.fn(),
  warn: jest.fn(),
  // Mock other methods
  log: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

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
    }),
    useRoute: () => ({
      params: {},
    }),
  };
});

// Mock Expo modules
jest.mock('expo-font');
jest.mock('expo-asset');

// Setup fake timers
jest.useFakeTimers();
```

#### Step 4: Create Mock Files

**File:** `__mocks__/fileMock.js`

```javascript
module.exports = 'test-file-stub';
```

**File:** `__mocks__/AsyncStorage.js`

```javascript
export default {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
  multiGet: jest.fn(),
  multiSet: jest.fn(),
};
```

#### Step 5: Create Test Utilities

**File:** `src/test-utils/index.tsx`

```typescript
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react-native';

// Add any providers that wrap the app
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

// Custom render that includes providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react-native';

// Override render method
export { customRender as render };
```

**File:** `src/test-utils/mockData.ts`

```typescript
import { Scenario, Item, NPC } from '../game/types';

/**
 * Mock scenario data for testing
 */
export const mockScenario: Scenario = {
  id: 'test-scenario',
  titleKey: 'scenarios.test.title',
  textKey: 'scenarios.test.narrative',
  act: 1,
  scene: 1,
  locationId: 'test-location',
  choices: [
    {
      id: 'a',
      textKey: 'scenarios.test.choice_a',
      consequences: [],
      nextScenario: 'test-scenario-2',
    },
    {
      id: 'b',
      textKey: 'scenarios.test.choice_b',
      skillCheck: {
        skill: 'persuasion',
        dc: 10,
      },
      consequences: [
        {
          type: 'relationship',
          target: 'test-npc',
          value: 5,
        },
      ],
      nextScenario: 'test-scenario-3',
    },
  ],
  prerequisites: [],
  npcsPresent: ['test-npc'],
};

/**
 * Mock item data for testing
 */
export const mockItem: Item = {
  id: 'test-sword',
  nameKey: 'items.test_sword.name',
  descriptionKey: 'items.test_sword.description',
  category: 'weapon',
  rarity: 'common',
  value: 50,
  weight: 2,
  stackable: false,
  damage: {
    min: 5,
    max: 8,
  },
  requirements: {
    level: 1,
    strength: 10,
  },
};

/**
 * Mock NPC data for testing
 */
export const mockNPC: NPC = {
  id: 'test-npc',
  nameKey: 'npcs.test_npc.name',
  role: 'merchant',
  faction: 'villagers',
  baseAffinity: 0,
  currentAffinity: 0,
  location: 'test-village',
};

/**
 * Create mock player character
 */
export const createMockPlayer = (overrides = {}) => ({
  name: 'Test Hero',
  level: 1,
  experience: 0,
  health: 100,
  maxHealth: 100,
  mana: 20,
  maxMana: 20,
  gold: 100,
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
    stealth: 5,
    // ... other skills
  },
  inventory: [],
  equipment: {
    weapon: null,
    armor: null,
    accessory: null,
    amulet: null,
  },
  ...overrides,
});
```

#### Step 6: Add Test Scripts to package.json

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --maxWorkers=2",
    "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand"
  }
}
```

#### Step 7: Write Example Tests

**File:** `src/components/ui/__tests__/Button.test.tsx`

```typescript
import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { render } from '../../../test-utils';
import { Button } from '../Button';

describe('Button Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Button title="Test Button" onPress={() => {}} />);
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(<Button title="Test Button" onPress={mockOnPress} />);
    
    fireEvent.press(getByText('Test Button'));
    
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button title="Test Button" onPress={mockOnPress} disabled={true} />
    );
    
    fireEvent.press(getByText('Test Button'));
    
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('matches snapshot', () => {
    const { toJSON } = render(<Button title="Test Button" onPress={() => {}} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
```

**File:** `src/game/engine/__tests__/ScenarioEngine.test.ts`

```typescript
import { ScenarioEngine } from '../ScenarioEngine';
import { mockScenario } from '../../../test-utils/mockData';

describe('ScenarioEngine', () => {
  let engine: ScenarioEngine;

  beforeEach(() => {
    engine = new ScenarioEngine();
  });

  describe('loadScenario', () => {
    it('loads scenario successfully', async () => {
      const scenario = await engine.loadScenario('test-scenario');
      expect(scenario).toBeDefined();
      expect(scenario.id).toBe('test-scenario');
    });

    it('throws error for invalid scenario', async () => {
      await expect(engine.loadScenario('invalid-id')).rejects.toThrow();
    });
  });

  describe('evaluateConditions', () => {
    it('returns true when all conditions met', () => {
      const conditions = [
        { type: 'flag', target: 'test_flag', operator: 'equals', value: true },
      ];
      
      const gameState = {
        flags: { test_flag: true },
      };
      
      const result = engine.evaluateConditions(conditions, gameState);
      expect(result).toBe(true);
    });

    it('returns false when conditions not met', () => {
      const conditions = [
        { type: 'flag', target: 'test_flag', operator: 'equals', value: true },
      ];
      
      const gameState = {
        flags: { test_flag: false },
      };
      
      const result = engine.evaluateConditions(conditions, gameState);
      expect(result).toBe(false);
    });
  });

  describe('processChoice', () => {
    it('applies consequences correctly', () => {
      const choice = mockScenario.choices[1]; // Choice with skill check
      const gameState = {
        flags: {},
        relationships: {},
      };
      
      engine.processChoice(choice, gameState, true); // Success
      
      expect(gameState.relationships['test-npc']).toBe(5);
    });
  });
});
```

#### Step 8: Create Test Coverage Configuration

**File:** `.coveragerc` (optional, for detailed reports)

```ini
[run]
omit =
  */node_modules/*
  */test_utils/*
  */__tests__/*
  */coverage/*
```

### Testing Steps

#### Test 1: Run Tests

```bash
# Run all tests
npm test

# Expected output:
# PASS  src/components/ui/__tests__/Button.test.tsx
# PASS  src/game/engine/__tests__/ScenarioEngine.test.ts
# 
# Test Suites: 2 passed, 2 total
# Tests:       8 passed, 8 total
```

#### Test 2: Run Tests in Watch Mode

```bash
npm run test:watch

# Should watch for file changes and re-run tests
```

#### Test 3: Generate Coverage Report

```bash
npm run test:coverage

# Expected:
# File                | % Stmts | % Branch | % Funcs | % Lines
# --------------------|---------|----------|---------|--------
# All files           |   85.23 |    78.12 |   82.45 |   84.67
# components/ui       |   90.12 |    85.34 |   88.90 |   89.45
# game/engine         |   82.45 |    75.23 |   80.12 |   81.67
```

#### Test 4: Verify CI Compatibility

```bash
npm run test:ci

# Should run without hanging
# Should generate coverage report
# Exit code 0 on success
```

### Definition of Done

- [ ] Jest configured and working
- [ ] React Native Testing Library installed
- [ ] Test utilities created
- [ ] Example tests passing
- [ ] Coverage reporting at 70%+
- [ ] All tests run in CI
- [ ] Mock files for native modules
- [ ] Documentation for writing tests
- [ ] Team trained on testing practices

### Common Issues & Solutions

**Issue 1:** "Tests timeout"
```javascript
// Solution: Increase timeout in jest.config.js
module.exports = {
  testTimeout: 10000, // 10 seconds
};
```

**Issue 2:** "Transform errors with node_modules"
```javascript
// Solution: Update transformIgnorePatterns in jest.config.js
// Include problematic packages in the pattern
```

**Issue 3:** "Coverage threshold not met"
```bash
# Solution: Write more tests or adjust threshold temporarily
# Lower threshold in jest.config.js if reasonable
```

### Estimated Time

- **Installation:** 20 minutes
- **Configuration:** 1 hour
- **Example tests:** 1 hour
- **Documentation:** 30 minutes
- **Total:** ~3 hours

### Notes

- Focus on testing business logic and game engine
- UI component tests should test behavior, not implementation
- Use snapshot tests sparingly (they can be brittle)
- Mock external dependencies (API calls, storage, etc.)
- Keep tests fast (<5 seconds per suite)

### Related Documents

- Architecture Document: Section 10 (Testing Strategy)
- Epic Breakdown: Epic 27 (Testing & QA)

---

## Story 1.4: Configure Build System

**Story ID:** 1.4  
**Story Points:** 5 SP  
**Priority:** High  
**Assignee:** Lead Developer  
**Sprint:** Sprint 1  
**Dependencies:** Story 1.1

### User Story

> **As a** developer  
> **I want** EAS Build configured  
> **So that** I can create iOS and Android builds for testing and distribution

### Detailed Description

Configure Expo Application Services (EAS) Build for creating production-ready builds. Setup build profiles for development, preview, and production. Configure app signing and provisioning profiles.

This enables creating builds for physical devices, TestFlight, and Google Play internal testing without needing local build tools.

### Acceptance Criteria

#### Must Have
- [ ] EAS CLI installed and authenticated
- [ ] eas.json configured with dev/preview/production profiles
- [ ] iOS build profile created and working
- [ ] Android build profile created and working
- [ ] First successful build completed for both platforms
- [ ] Build artifacts downloadable
- [ ] App installable on physical devices

#### Should Have
- [ ] Development build for internal testing
- [ ] App signing configured
- [ ] Build webhooks for notifications

#### Nice to Have
- [ ] Automatic version incrementing
- [ ] Build caching for faster builds

### Technical Implementation

#### Step 1: Install EAS CLI

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login to Expo account
eas login

# Verify authentication
eas whoami
```

#### Step 2: Initialize EAS in Project

```bash
# Navigate to project
cd golden-chariot-belintash

# Initialize EAS
eas build:configure

# This creates eas.json
```

#### Step 3: Configure eas.json

**File:** `eas.json`

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true,
        "bundleIdentifier": "com.goldenchariot.belintash.dev"
      },
      "android": {
        "buildType": "apk",
        "gradleCommand": ":app:assembleDebug"
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false,
        "bundleIdentifier": "com.goldenchariot.belintash.preview"
      },
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "ios": {
        "bundleIdentifier": "com.goldenchariot.belintash"
      },
      "android": {
        "buildType": "aab"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

#### Step 4: Update app.json for EAS

**Update `app.json`:**

```json
{
  "expo": {
    "name": "The Golden Chariot of Belintash",
    "slug": "golden-chariot-belintash",
    "version": "1.0.0",
    "orientation": "portrait",
    
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.goldenchariot.belintash",
      "buildNumber": "1.0.0",
      "infoPlist": {
        "NSPhotoLibraryUsageDescription": "Used for saving game screenshots",
        "NSCameraUsageDescription": "Used for game features"
      }
    },
    
    "android": {
      "package": "com.goldenchariot.belintash",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#1a1a1a"
      },
      "permissions": [
        "VIBRATE",
        "WRITE_EXTERNAL_STORAGE",
        "READ_EXTERNAL_STORAGE"
      ]
    },
    
    "extra": {
      "eas": {
        "projectId": "your-project-id-here"
      }
    }
  }
}
```

#### Step 5: Configure iOS Build

```bash
# Generate iOS credentials
eas credentials

# Select: iOS > Production > Generate new credentials
# This creates:
# - Distribution Certificate
# - Provisioning Profile
# - Push Notification Key (if needed)

# Verify credentials
eas credentials -p ios
```

**Important:** You need Apple Developer Account ($99/year) for production builds.

For development builds without account:
```bash
# Build for iOS Simulator (no Apple account needed)
eas build --profile development --platform ios
```

#### Step 6: Configure Android Build

```bash
# Generate Android keystore
eas credentials

# Select: Android > Production > Generate new keystore
# This creates:
# - Upload keystore
# - Key alias
# - Key password

# Verify credentials
eas credentials -p android
```

#### Step 7: Create First Development Build

```bash
# iOS Development Build (for simulator)
eas build --profile development --platform ios

# Android Development Build (APK for device)
eas build --profile development --platform android

# Wait for build to complete (~10-15 minutes)
```

#### Step 8: Download and Install Build

```bash
# After build completes, you'll get a URL
# Download the build artifact

# iOS: .tar.gz for simulator
# 1. Extract: tar -xzf ios-build.tar.gz
# 2. Drag to simulator

# Android: .apk
# 1. Transfer to device via ADB or direct download
# 2. Install: adb install app-release.apk
```

#### Step 9: Add Build Scripts to package.json

```json
{
  "scripts": {
    "build:dev:ios": "eas build --profile development --platform ios",
    "build:dev:android": "eas build --profile development --platform android",
    "build:preview:ios": "eas build --profile preview --platform ios",
    "build:preview:android": "eas build --profile preview --platform android",
    "build:prod:ios": "eas build --profile production --platform ios",
    "build:prod:android": "eas build --profile production --platform android",
    "build:all": "eas build --profile production --platform all"
  }
}
```

### Testing Steps

#### Test 1: Verify EAS Configuration

```bash
# Check configuration
eas build:configure

# Should show existing eas.json
```

#### Test 2: Build for iOS Simulator

```bash
npm run build:dev:ios

# Wait for build
# Download .tar.gz
# Extract and test in simulator
```

#### Test 3: Build for Android Device

```bash
npm run build:dev:android

# Wait for build
# Download .apk
# Install on physical Android device
# Test app functionality
```

#### Test 4: Verify App Signing

```bash
# Check iOS credentials
eas credentials -p ios

# Check Android credentials
eas credentials -p android

# Verify all credentials present
```

### Definition of Done

- [ ] EAS Build configured
- [ ] Development builds work for iOS
- [ ] Development builds work for Android
- [ ] App signing credentials generated
- [ ] Builds installable on devices
- [ ] Build scripts in package.json
- [ ] Build process documented
- [ ] Team trained on build process

### Common Issues & Solutions

**Issue 1:** "Build failed - missing credentials"
```bash
# Solution: Generate credentials
eas credentials
# Follow prompts to create certificates/keystore
```

**Issue 2:** "iOS build requires Apple Developer account"
```bash
# Solution: Use simulator builds for development
eas build --profile development --platform ios
# Simulator builds don't require paid account
```

**Issue 3:** "Android build failed - Gradle error"
```bash
# Solution: Check Android build configuration in eas.json
# Ensure correct buildType and gradleCommand
```

### Estimated Time

- **Setup:** 30 minutes
- **iOS configuration:** 1 hour
- **Android configuration:** 1 hour
- **First builds:** 30 minutes (waiting)
- **Testing:** 1 hour
- **Total:** ~4 hours

### Notes

- EAS Build runs on Expo's servers (no local Xcode/Android Studio needed)
- Free plan: limited builds per month
- Paid plan: unlimited builds + priority queue
- First build takes longer (installing dependencies)
- Subsequent builds are faster (caching)

### Related Documents

- EAS Build Documentation: https://docs.expo.dev/build/introduction/
- Architecture Document: Section 11 (Deployment)

---

## Story 1.5: Setup CI/CD Pipeline

**Story ID:** 1.5  
**Story Points:** 5 SP  
**Priority:** Medium  
**Assignee:** Lead Developer  
**Sprint:** Sprint 1  
**Dependencies:** Story 1.3, Story 1.4

### User Story

> **As a** developer  
> **I want** automated CI/CD so that tests run on every commit and builds are automated

### Detailed Description

Setup GitHub Actions workflow to automatically run tests, linting, and type checking on every pull request. Configure automatic builds on merge to main branch. Add code quality checks and deployment automation.

This ensures code quality is maintained and reduces manual work for testing and building.

### Acceptance Criteria

#### Must Have
- [ ] GitHub Actions workflow created
- [ ] Automated testing on PR
- [ ] Automated linting on PR
- [ ] Automated type checking on PR
- [ ] Automated builds on merge to main
- [ ] Build artifacts uploaded
- [ ] Workflow status badges added to README

#### Should Have
- [ ] Code coverage reporting
- [ ] Slack/Discord notifications on build failure
- [ ] Automatic version bumping

#### Nice to Have
- [ ] Deploy to TestFlight/Play Store (internal)
- [ ] Automated changelog generation

### Technical Implementation

#### Step 1: Create GitHub Actions Workflow Directory

```bash
mkdir -p .github/workflows
```

#### Step 2: Create Test Workflow

**File:** `.github/workflows/test.yml`

```yaml
name: Test

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main, develop]

jobs:
  test:
    name: Test
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run type check
        run: npm run type-check
      
      - name: Run tests
        run: npm run test:ci
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: unittests
          fail_ci_if_error: false
```

#### Step 3: Create Build Workflow

**File:** `.github/workflows/build.yml`

```yaml
name: Build

on:
  push:
    branches: [main]
    tags:
      - 'v*'

jobs:
  build-ios:
    name: Build iOS
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build iOS (Preview)
        run: eas build --profile preview --platform ios --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
      
      - name: Upload build artifact
        uses: actions/upload-artifact@v3
        with:
          name: ios-build
          path: '*.tar.gz'

  build-android:
    name: Build Android
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build Android (Preview)
        run: eas build --profile preview --platform android --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
      
      - name: Upload build artifact
        uses: actions/upload-artifact@v3
        with:
          name: android-build
          path: '*.apk'
```

#### Step 4: Create Code Quality Workflow

**File:** `.github/workflows/code-quality.yml`

```yaml
name: Code Quality

on:
  pull_request:
    branches: [main, develop]

jobs:
  quality:
    name: Code Quality Checks
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Check formatting
        run: npm run format:check
      
      - name: Run ESLint
        run: npm run lint -- --max-warnings 0
      
      - name: Check for TODO/FIXME
        run: |
          if git grep -n "TODO\|FIXME" -- "*.ts" "*.tsx" ":(exclude)node_modules"; then
            echo "Found TODO/FIXME comments. Please resolve before merging."
            exit 1
          fi
      
      - name: Check bundle size
        run: |
          npm run build
          # Add bundle size check logic here
```

#### Step 5: Add GitHub Secrets

In GitHub repository settings → Secrets and variables → Actions:

1. **EXPO_TOKEN:**
   ```bash
   # Get Expo token
   expo login
   expo whoami
   eas token:create
   
   # Copy token and add to GitHub secrets
   ```

2. **CODECOV_TOKEN:** (optional, for coverage reporting)
   - Sign up at codecov.io
   - Add repository
   - Copy token

#### Step 6: Add Status Badges to README

**Update `README.md`:**

```markdown
# The Golden Chariot of Belintash

![Test](https://github.com/your-org/golden-chariot-belintash/workflows/Test/badge.svg)
![Build](https://github.com/your-org/golden-chariot-belintash/workflows/Build/badge.svg)
![Code Quality](https://github.com/your-org/golden-chariot-belintash/workflows/Code%20Quality/badge.svg)
[![codecov](https://codecov.io/gh/your-org/golden-chariot-belintash/branch/main/graph/badge.svg)](https://codecov.io/gh/your-org/golden-chariot-belintash)

A historical text-based RPG set in 1221 Bulgaria...
```

#### Step 7: Create Pull Request Template

**File:** `.github/pull_request_template.md`

```markdown
## Description
<!-- Describe your changes in detail -->

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
<!-- Link to related issues: Fixes #123 -->

## Testing
- [ ] Tests pass locally
- [ ] Added new tests
- [ ] Updated existing tests

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
```

#### Step 8: Configure Branch Protection

In GitHub repository settings → Branches → Add rule:

- Branch name pattern: `main`
- ✅ Require pull request before merging
- ✅ Require status checks to pass before merging
  - Select: Test, Code Quality
- ✅ Require branches to be up to date before merging
- ✅ Do not allow bypassing the above settings

### Testing Steps

#### Test 1: Test Workflow Locally

```bash
# Install act (GitHub Actions local runner)
brew install act  # macOS
# or
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Run test workflow
act pull_request
```

#### Test 2: Create Test PR

```bash
# Create test branch
git checkout -b test/ci-pipeline

# Make small change
echo "# Test" >> test.txt
git add test.txt
git commit -m "Test CI pipeline"

# Push and create PR
git push origin test/ci-pipeline

# On GitHub: Create PR
# Verify workflows run automatically
```

#### Test 3: Verify Test Workflow

- Check test workflow runs
- All tests pass
- Linting passes
- Type checking passes
- Coverage report generated

#### Test 4: Verify Build Workflow

```bash
# Merge test PR to main
# Verify build workflow triggers
# Check builds complete successfully
# Download artifacts from workflow run
```

### Definition of Done

- [ ] GitHub Actions workflows created
- [ ] Test workflow runs on PR
- [ ] Build workflow runs on merge
- [ ] Code quality checks automated
- [ ] Branch protection configured
- [ ] Status badges in README
- [ ] PR template created
- [ ] Team trained on CI/CD process

### Common Issues & Solutions

**Issue 1:** "Workflow not triggering"
```yaml
# Solution: Check workflow file syntax
# Validate with: https://rhysd.github.io/actionlint/
```

**Issue 2:** "Build fails on GitHub but works locally"
```bash
# Solution: Check environment differences
# Ensure all secrets are set
# Check Node.js version matches
```

**Issue 3:** "Expo token invalid"
```bash
# Solution: Regenerate token
eas token:create
# Update GitHub secret
```

### Estimated Time

- **Workflow creation:** 2 hours
- **Configuration:** 1 hour
- **Testing:** 1 hour
- **Documentation:** 30 minutes
- **Total:** ~4.5 hours

### Notes

- Free GitHub Actions: 2,000 minutes/month
- EAS Build: Free tier has limits
- Keep workflows fast (< 10 minutes)
- Use caching to speed up installs
- Monitor workflow costs

### Related Documents

- GitHub Actions Documentation: https://docs.github.com/actions
- EAS Build with GitHub Actions: https://docs.expo.dev/build/automate-builds/

---

## Story 1.6: Create Development Documentation

**Story ID:** 1.6  
**Story Points:** 3 SP  
**Priority:** Medium  
**Assignee:** Lead Developer  
**Sprint:** Sprint 1  
**Dependencies:** Story 1.1, Story 1.2, Story 1.3

### User Story

> **As a** new developer  
> **I want** comprehensive setup documentation  
> **So that** I can get started quickly without blockers

### Detailed Description

Create comprehensive documentation covering project setup, development workflow, coding standards, testing practices, and troubleshooting. This documentation should enable any new developer to clone the repository and start contributing within 30 minutes.

### Acceptance Criteria

#### Must Have
- [ ] CONTRIBUTING.md created with contribution guidelines
- [ ] Development setup guide written
- [ ] Code style guide documented
- [ ] Testing guidelines documented
- [ ] Troubleshooting section added
- [ ] Architecture overview included

#### Should Have
- [ ] Onboarding checklist for new developers
- [ ] Common workflows documented
- [ ] Git workflow explained

#### Nice to Have
- [ ] Video walkthrough of setup
- [ ] Interactive setup script

### Technical Implementation

#### Step 1: Create CONTRIBUTING.md

**File:** `CONTRIBUTING.md`

```markdown
# Contributing to The Golden Chariot of Belintash

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Getting Started

### Prerequisites

- Node.js 18+ (LTS)
- npm 9+
- Git
- iOS: Xcode 14+ (Mac only)
- Android: Android Studio with SDK 33+

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/golden-chariot-belintash.git
   cd golden-chariot-belintash
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup Husky hooks:**
   ```bash
   npx husky install
   ```

4. **Start development server:**
   ```bash
   npm start
   ```

5. **Run on device/simulator:**
   ```bash
   npm run ios     # iOS (Mac only)
   npm run android # Android
   ```

### Development Workflow

1. **Create a branch:**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

2. **Make your changes**
   - Write code following style guide
   - Add/update tests
   - Update documentation

3. **Test your changes:**
   ```bash
   npm run lint        # Check code style
   npm run type-check  # Check TypeScript
   npm test            # Run tests
   ```

4. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   # Commit messages follow Conventional Commits
   ```

5. **Push and create PR:**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create Pull Request on GitHub

## Code Style Guide

### TypeScript

- Use strict TypeScript (no `any` types unless absolutely necessary)
- Define interfaces for all data structures
- Use type inference where obvious
- Export types from `types/` folder

### React Native

- Use functional components with hooks
- Memo-ize expensive components
- Use StyleSheet.create for styles
- No inline styles in JSX (except dynamic values)

### File Organization

```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── game/         # Game-specific components
│   └── screens/      # Screen components
├── game/
│   ├── engine/       # Core game logic
│   ├── data/         # Game data (JSON)
│   └── types/        # TypeScript types
└── ...
```

### Naming Conventions

- **Components:** PascalCase (`ScenarioDisplay.tsx`)
- **Utilities:** camelCase (`formatCurrency.ts`)
- **Constants:** UPPER_SNAKE_CASE (`MAX_INVENTORY_SIZE`)
- **Types/Interfaces:** PascalCase (`PlayerCharacter`)

## Testing Guidelines

### Unit Tests

- Test business logic thoroughly
- Test edge cases
- Mock external dependencies
- Aim for 70%+ coverage

### Component Tests

- Test user interactions
- Test different states
- Use React Native Testing Library
- Avoid testing implementation details

### Example Test

```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button', () => {
  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Click" onPress={onPress} />
    );
    
    fireEvent.press(getByText('Click'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

## Commit Message Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style (formatting, no logic change)
- `refactor:` Code refactoring
- `test:` Adding/updating tests
- `chore:` Maintenance tasks

**Examples:**
```
feat: add scenario caching system
fix: resolve combat damage calculation bug
docs: update architecture documentation
test: add tests for character progression
```

## Pull Request Process

1. **Update documentation** if needed
2. **Add/update tests** for your changes
3. **Ensure all checks pass:**
   - Tests
   - Linting
   - Type checking
   - Code coverage
4. **Link related issues**
5. **Request review** from maintainers
6. **Address feedback** if any
7. **Squash commits** before merge (if requested)

## Troubleshooting

### Common Issues

**Metro bundler not starting:**
```bash
npm start -- --reset-cache
```

**iOS build fails:**
```bash
cd ios && pod install && cd ..
```

**Android build fails:**
```bash
cd android && ./gradlew clean && cd ..
```

**Tests failing locally:**
```bash
npm run test -- --clearCache
```

### Getting Help

- Check existing issues
- Read documentation in `.bmad/` folder
- Ask in team chat
- Create detailed issue if bug

## Code Review Guidelines

### For Authors

- Keep PRs focused and small
- Provide context in description
- Respond to feedback promptly
- Update PR based on feedback

### For Reviewers

- Be constructive and respectful
- Explain reasoning for suggestions
- Approve when ready
- Test changes locally if complex

## License

Copyright © 2026 Golden Chariot Development Team

---

**Questions?** Contact the team lead or create an issue.
```

#### Step 2: Create Quick Setup Script

**File:** `scripts/setup.sh`

```bash
#!/bin/bash

echo "🎮 The Golden Chariot of Belintash - Setup Script"
echo "=================================================="
echo ""

# Check Node.js
echo "Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d. -f1 | sed 's/v//')
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18+. Current: $(node -v)"
    exit 1
fi
echo "✅ Node.js $(node -v)"

# Check npm
echo "Checking npm..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found"
    exit 1
fi
echo "✅ npm $(npm -v)"

# Install dependencies
echo ""
echo "Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Dependency installation failed"
    exit 1
fi
echo "✅ Dependencies installed"

# Setup Husky
echo ""
echo "Setting up Husky hooks..."
npx husky install
echo "✅ Husky configured"

# Run type check
echo ""
echo "Running type check..."
npm run type-check
if [ $? -ne 0 ]; then
    echo "⚠️  TypeScript errors found (non-blocking)"
fi

# Run tests
echo ""
echo "Running tests..."
npm test
if [ $? -ne 0 ]; then
    echo "⚠️  Some tests failed (non-blocking)"
fi

echo ""
echo "=================================================="
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. npm start           # Start development server"
echo "  2. npm run ios         # Run on iOS (Mac only)"
echo "  3. npm run android     # Run on Android"
echo ""
echo "Documentation:"
echo "  - CONTRIBUTING.md      # Contribution guidelines"
echo "  - .bmad/               # Full project documentation"
echo ""
echo "Happy coding! 🚀"
```

```bash
# Make script executable
chmod +x scripts/setup.sh
```

#### Step 3: Add Architecture Overview

**File:** `docs/ARCHITECTURE-OVERVIEW.md`

```markdown
# Architecture Overview

Quick reference for project architecture. See `.bmad/ARCHITECTURE.md` for full details.

## Tech Stack

- **Framework:** React Native 0.73.x + Expo SDK 50.x
- **Language:** TypeScript 5.x
- **State Management:** Zustand 4.x
- **Navigation:** React Navigation 6.x
- **Storage:** AsyncStorage, SQLite, MMKV
- **Internationalization:** i18next
- **Testing:** Jest + React Native Testing Library

## Project Structure

```
src/
├── components/     # UI components
├── game/           # Game logic
├── store/          # State management
├── services/       # Business logic
├── navigation/     # Navigation setup
├── utils/          # Utilities
└── i18n/           # Translations
```

## Key Systems

### Game Engine
Location: `src/game/engine/`

Core game mechanics:
- Scenario loading and processing
- Choice evaluation
- Consequence application
- Skill checks
- Combat system

### State Management
Location: `src/store/`

Zustand stores:
- `gameStore` - Game state, flags, counters
- `characterStore` - Player character data
- `combatStore` - Combat state
- `questStore` - Quest tracking
- `npcStore` - NPC relationships

### Content Pipeline
Location: `tools/content-pipeline/`

Game Bible → Game Data:
1. Parse Markdown scenarios
2. Generate JSON data
3. Extract translations
4. Validate content

## Data Flow

```
Game Bible (Markdown)
    ↓
Content Parser
    ↓
JSON Data + Translations
    ↓
Game Engine
    ↓
UI Components
    ↓
Player
```

## Testing Strategy

- **Unit Tests:** Game logic, utilities
- **Integration Tests:** Store interactions, engine systems
- **Component Tests:** UI behavior
- **E2E Tests:** Critical user flows (optional)

Target: 70%+ code coverage

## Build & Deployment

- **Development:** Expo Dev Client
- **Preview:** EAS Build (internal testing)
- **Production:** App Store + Google Play

## Learn More

- [Full Architecture](.bmad/ARCHITECTURE.md)
- [Epic Breakdown](.bmad/EPIC-BREAKDOWN.md)
- [Implementation Guide](.bmad/IMPLEMENTATION-GUIDE.md)
```

#### Step 4: Update Main README

**Update `README.md` with troubleshooting section:**

```markdown
## Troubleshooting

### Metro Bundler Issues

**Clear cache:**
```bash
npm start -- --reset-cache
```

### iOS Build Issues

**Pod install:**
```bash
cd ios
pod install
cd ..
```

**Clean build:**
```bash
cd ios
xcodebuild clean
cd ..
```

### Android Build Issues

**Clean Gradle:**
```bash
cd android
./gradlew clean
cd ..
```

**Reset Android Studio cache:**
```bash
cd android
rm -rf .gradle
./gradlew clean
cd ..
```

### Test Issues

**Clear Jest cache:**
```bash
npm test -- --clearCache
```

**Reset node_modules:**
```bash
rm -rf node_modules
npm install
```

### General Issues

**Reset everything:**
```bash
rm -rf node_modules ios/Pods
npm install
cd ios && pod install && cd ..
npm start -- --reset-cache
```

## Getting Help

- **Documentation:** See `.bmad/` folder
- **Issues:** Create GitHub issue
- **Chat:** Team Slack/Discord

## License

Copyright © 2026 Golden Chariot Development Team
```

### Testing Steps

#### Test 1: Fresh Setup

```bash
# Clone to new directory
cd /tmp
git clone <repo-url> test-setup
cd test-setup

# Run setup script
./scripts/setup.sh

# Verify setup completes successfully
```

#### Test 2: Documentation Review

- [ ] Read CONTRIBUTING.md
- [ ] Follow setup instructions
- [ ] Verify all links work
- [ ] Check examples are correct

#### Test 3: Onboard New Developer

- Give CONTRIBUTING.md to team member
- Time how long setup takes
- Collect feedback
- Update documentation based on feedback

### Definition of Done

- [ ] CONTRIBUTING.md complete
- [ ] Setup script working
- [ ] Architecture overview created
- [ ] Troubleshooting section added
- [ ] All documentation reviewed
- [ ] Links verified
- [ ] Examples tested
- [ ] Team trained on docs

### Estimated Time

- **Writing:** 2 hours
- **Review:** 30 minutes
- **Testing:** 30 minutes
- **Revisions:** 30 minutes
- **Total:** ~3.5 hours

### Notes

- Keep documentation up-to-date as project evolves
- Add FAQ section as questions arise
- Consider video walkthrough for complex setup
- Update troubleshooting based on actual issues encountered

### Related Documents

- All documents in `.bmad/` folder
- README.md
- Architecture Overview

---

## Epic 1 Summary

**Total Story Points:** 21 SP  
**Estimated Time:** 3-5 days (1 sprint)  
**Completion Criteria:**

- [ ] All 6 stories completed
- [ ] Definition of Done met for each story
- [ ] Sprint demo prepared
- [ ] Documentation reviewed and approved

**Sprint Review Notes:**
- Demo working app with all tools configured
- Show CI/CD pipeline in action
- Walk through documentation
- Collect team feedback

**Next Epic:** Epic 2 - Core Game Engine (34 SP)

---

**END OF EPIC 1 USER STORIES**
