# Implementation Guide
## Using BMAD Method with Game Bible in Windsurf

**Version:** 1.0  
**Date:** January 12, 2026  
**Document Owner:** Development Team  
**Status:** Implementation Guide  
**Related Documents:** PRD, Architecture, Epic Breakdown, Localization Architecture

---

## Executive Summary

This guide explains **how to implement** The Golden Chariot of Belintash using the BMAD (Breakthrough Method for Agile AI Driven Development) with Windsurf IDE. It covers:

1. **Setting up Windsurf** with BMAD workflow
2. **Using Game Bible content** in development
3. **Sprint execution** with AI assistance
4. **Content-to-code pipeline**
5. **Best practices** for AI-assisted development

---

## Table of Contents

1. [Windsurf + BMAD Setup](#windsurf-bmad-setup)
2. [Project Initialization](#project-initialization)
3. [Working with Game Bible](#working-with-game-bible)
4. [Sprint Execution](#sprint-execution)
5. [Content Implementation Flow](#content-implementation-flow)
6. [AI Prompting Best Practices](#ai-prompting-best-practices)
7. [Common Workflows](#common-workflows)
8. [Troubleshooting](#troubleshooting)

---

## 1. Windsurf + BMAD Setup

### 1.1 Install Windsurf IDE

**Download:**
- Visit: https://codeium.com/windsurf
- Download for your OS (Windows, Mac, Linux)
- Install following instructions

**First Launch:**
```bash
# Windows
windsurf.exe

# Mac
open -a Windsurf

# Linux
./windsurf
```

### 1.2 Configure Windsurf for BMAD

**Step 1: Open Settings**
- Press `Ctrl+,` (Windows/Linux) or `Cmd+,` (Mac)
- Go to "Extensions" → "BMAD"

**Step 2: Enable BMAD Workflow**
```json
// settings.json
{
  "bmad.enabled": true,
  "bmad.track": "enterprise",
  "bmad.projectType": "mobile-game",
  "bmad.aiModel": "cascade", // Windsurf's AI model
  "bmad.contextWindow": "large",
  "bmad.autoSaveStories": true
}
```

**Step 3: Install BMAD Extension** (if not bundled)
```bash
# In Windsurf terminal
windsurf --install-extension bmad-method.bmad-enterprise
```

### 1.3 Import BMAD Documents

**Step 1: Create Project Folder**
```bash
mkdir golden-chariot-belintash
cd golden-chariot-belintash

# Open in Windsurf
windsurf .
```

**Step 2: Create BMAD Documents Folder**
```
golden-chariot-belintash/
├── .bmad/
│   ├── PRD.md                        # Product Requirements
│   ├── ARCHITECTURE.md               # Technical Architecture
│   ├── EPIC-BREAKDOWN.md             # Epics & Stories
│   ├── LOCALIZATION-ARCHITECTURE.md  # Multi-language system
│   └── sprint-plans/                 # Sprint planning docs
├── game-bible/                       # Game content (your existing files)
│   ├── scenarios/
│   ├── side-quests/
│   ├── WORLD-BIBLE.md
│   ├── CHARACTERS.md
│   └── ...
└── src/                              # Source code (will be generated)
```

**Step 3: Copy BMAD Documents**
```bash
# Copy your 3 BMAD documents
cp PRD-Golden-Chariot-Belintash.md .bmad/PRD.md
cp ARCHITECTURE-Golden-Chariot-Belintash.md .bmad/ARCHITECTURE.md
cp EPIC-BREAKDOWN-Golden-Chariot-Belintash.md .bmad/EPIC-BREAKDOWN.md
cp LOCALIZATION-ARCHITECTURE.md .bmad/LOCALIZATION-ARCHITECTURE.md
```

**Step 4: Initialize BMAD Project**
```bash
# In Windsurf terminal
bmad init --track enterprise

# Output:
# ✅ BMAD project initialized
# ✅ Found PRD.md
# ✅ Found ARCHITECTURE.md  
# ✅ Found EPIC-BREAKDOWN.md
# 📊 Project: 28 Epics, 145 Stories, 620 SP
# 🎯 Track: Enterprise
# ⏱️  Estimated: 18-24 sprints
```

### 1.4 Configure Game Bible Path

**Tell Windsurf where game content is:**
```json
// .bmad/config.json (auto-generated)
{
  "project": {
    "name": "The Golden Chariot of Belintash",
    "type": "mobile-game",
    "track": "enterprise"
  },
  "content": {
    "gameBiblePath": "./game-bible",
    "scenariosPath": "./game-bible/scenarios",
    "sideQuestsPath": "./game-bible/side-quests",
    "itemsPath": "./game-bible/ITEMS.md",
    "npcsPath": "./game-bible/CHARACTERS.md",
    "locationsPath": "./game-bible/LOCATIONS.md"
  },
  "output": {
    "dataPath": "./src/game/data",
    "i18nPath": "./src/i18n/locales"
  },
  "localization": {
    "sourceLanguage": "bg",
    "targetLanguages": ["en", "ru"],
    "namespaces": ["common", "scenarios", "quests", "items", "npcs"]
  }
}
```

---

## 2. Project Initialization

### 2.1 Create Initial Project Structure

**Use Windsurf AI to generate from Architecture:**

**Prompt to Cascade:**
```
Using the ARCHITECTURE.md document in .bmad/, create the initial React Native + Expo project structure with TypeScript.

Follow these specifications:
1. Expo managed workflow (SDK 50)
2. TypeScript strict mode
3. Folder structure from Architecture doc Section "Appendix A"
4. Install all dependencies from Architecture doc Section 2

After creation, show me the generated folder structure.
```

**Cascade will:**
1. Read ARCHITECTURE.md
2. Run `expo init` with TypeScript template
3. Install dependencies
4. Create folder structure
5. Configure TypeScript, ESLint, Prettier
6. Show result

**Expected Output:**
```
✅ Created React Native project
✅ Installed 47 dependencies
✅ Created folder structure (12 folders, 8 files)
✅ Configured TypeScript (strict mode)
✅ Configured ESLint + Prettier

📁 Project structure:
src/
├── components/
│   ├── ui/
│   ├── game/
│   └── screens/
├── game/
│   ├── engine/
│   ├── data/
│   └── types/
├── store/
├── services/
├── navigation/
├── utils/
└── i18n/

Ready to start Epic 1!
```

### 2.2 Initialize Git

```bash
git init
git add .
git commit -m "Initial project setup with BMAD structure"

# Create .gitignore (Cascade can generate)
```

### 2.3 Verify Setup

```bash
# Test that app runs
npm run ios     # iOS
npm run android # Android
npm run web     # Web (for testing)

# Should see Expo splash screen
```

---

## 3. Working with Game Bible

### 3.1 Understanding Game Bible Structure

Your game bible contains **all game content** in Markdown format:

```
game-bible/
├── scenarios/              # Main quest scenarios
│   ├── prologue/
│   │   ├── 01-sabuzhdane.md
│   │   ├── 02-kaminata.md
│   │   ├── 03-stoyan.md
│   │   └── 04-dnevnik.md
│   ├── act-i/
│   ├── act-ii/
│   ├── act-iii/
│   ├── act-iv/
│   └── act-v/
├── side-quests/            # Side quests by location
│   ├── kamenitsa/
│   ├── stanimaka/
│   ├── philippopolis/
│   └── ...
├── WORLD-BIBLE.md          # Lore & setting
├── CHARACTERS.md           # All NPCs
├── COMPANIONS.md           # Companion details
├── ITEMS.md                # All items
├── BESTIARY.md             # All enemies
├── MAGIC-SPELLS.md         # All spells
├── LOCATIONS.md            # All locations
└── ...
```

### 3.2 Linking Game Bible to Implementation

**Each Epic/Story references game bible files:**

**Example from Epic 16 (Main Quest Content):**
```markdown
## Epic 16: Main Quest Content (Acts I-II)

### Story 16.1: Create Prologue Scenarios

**Content Source:**
- game-bible/scenarios/prologue/01-sabuzhdane.md
- game-bible/scenarios/prologue/02-kaminata.md
- game-bible/scenarios/prologue/03-stoyan.md
- game-bible/scenarios/prologue/04-dnevnik.md

**Implementation Steps:**
1. Read scenario markdown files
2. Parse content using ContentParser (from Localization doc)
3. Generate JSON files in src/game/data/scenarios/
4. Extract translations to src/i18n/locales/bg/scenarios.json
5. Test in ScenarioDisplay component
```

### 3.3 Content Import Workflow

**3-Step Process:**

```
Game Bible (Markdown) → Content Pipeline → Game Data (JSON)
                              ↓
                    Translation Files (JSON)
```

**Step 1: Parse Game Bible**
```bash
# Run content pipeline (from Localization Architecture doc)
cd tools/content-pipeline
npm run build
./run-pipeline.sh

# Output:
# 📖 Parsing 120 scenario files...
# 🌍 Extracting Bulgarian translations...
# 📝 Generating JSON files...
# ✅ Created 120 scenario JSON files
# ✅ Created translation files (bg/)
# ✅ Pipeline complete!
```

**Step 2: Verify Generated Files**
```bash
ls -la src/game/data/scenarios/
# prologue-01.json
# prologue-02.json
# act1-scene1.json
# ...

ls -la src/i18n/locales/bg/
# scenarios.json
# quests.json
# items.json
# npcs.json
```

**Step 3: Use in Game**
```typescript
// src/services/ScenarioLoader.ts
import prologue01 from '../game/data/scenarios/prologue-01.json';

const scenario = await ScenarioLoader.load('prologue-01');
// Returns structured scenario with translation keys
```

---

## 4. Sprint Execution

### 4.1 Starting a Sprint

**Step 1: Select Epic from EPIC-BREAKDOWN.md**

Example: **Epic 1: Project Setup & Infrastructure**

**Step 2: Open Sprint in Windsurf**
```bash
# In Windsurf terminal
bmad sprint start --epic 1

# Output:
# 🚀 Starting Sprint 1
# 📋 Epic 1: Project Setup & Infrastructure
# 📊 6 stories, 21 Story Points
# ⏱️  Estimated: 3-5 days
# 
# Stories:
# ✅ 1.1 Initialize React Native Project (2 SP)
# ⏳ 1.2 Configure Development Tools (3 SP)
# ⏳ 1.3 Setup Testing Framework (3 SP)
# ⏳ 1.4 Configure Build System (5 SP)
# ⏳ 1.5 Setup CI/CD Pipeline (5 SP)
# ⏳ 1.6 Create Development Documentation (3 SP)
```

**Step 3: Work on Stories in Order**

Windsurf shows **current story** in sidebar with:
- Story description
- Acceptance criteria checklist
- Technical notes
- Dependencies

### 4.2 Implementing a Story with AI

**Example: Story 1.2 - Configure Development Tools**

**Prompt to Cascade:**
```
I'm working on Story 1.2 from Epic 1: Configure Development Tools.

From EPIC-BREAKDOWN.md, the requirements are:
- ESLint configured with React Native + TypeScript rules
- Prettier configured and integrated with ESLint
- Husky pre-commit hooks setup
- VS Code workspace settings created
- EditorConfig file created

Please implement this by:
1. Installing necessary packages
2. Creating config files
3. Setting up pre-commit hooks
4. Testing the setup

Use the Architecture document for reference.
```

**Cascade Response:**
```typescript
// Cascade will:
// 1. Read EPIC-BREAKDOWN.md Story 1.2
// 2. Read ARCHITECTURE.md for tech stack
// 3. Execute:

// Install packages
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier
npm install --save-dev husky lint-staged

// Create .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  // ... full config
};

// Create .prettierrc
{
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100
}

// Setup Husky
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"

// Create lint-staged config in package.json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
  }
}

// Create .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}

// Create .editorconfig
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8

// ✅ All tasks complete!
// ✅ Ran test commit - hooks working
```

**Step 4: Verify Acceptance Criteria**
```bash
# In Windsurf, check off items:
☑ ESLint configured
☑ Prettier configured  
☑ Husky pre-commit hooks
☑ VS Code settings
☑ EditorConfig file

# Mark story as complete
bmad story complete 1.2

# Output:
# ✅ Story 1.2 complete (3 SP)
# 📊 Sprint progress: 5/21 SP (24%)
```

### 4.3 Working with Content Stories

**Example: Story 16.1 - Create Prologue Scenarios**

**Prompt to Cascade:**
```
I'm working on Story 16.1: Create Prologue Scenarios.

Game Bible location:
- game-bible/scenarios/prologue/01-sabuzhdane.md
- game-bible/scenarios/prologue/02-kaminata.md
- game-bible/scenarios/prologue/03-stoyan.md
- game-bible/scenarios/prologue/04-dnevnik.md

Steps:
1. Read these 4 scenario markdown files
2. Use ContentParser from LOCALIZATION-ARCHITECTURE.md to parse them
3. Generate JSON files in src/game/data/scenarios/
4. Extract Bulgarian translations to src/i18n/locales/bg/scenarios.json
5. Create ScenarioDisplay component that loads and displays prologue-01
6. Test in app

Show me the parsed JSON for prologue-01 first, then implement the rest.
```

**Cascade Response:**
```typescript
// Cascade will:

// 1. Read game-bible/scenarios/prologue/01-sabuzhdane.md
const fileContent = fs.readFileSync('game-bible/scenarios/prologue/01-sabuzhdane.md', 'utf-8');

// 2. Parse using ContentParser
const parsed = ContentParser.parseScenario(fileContent);

// 3. Show parsed JSON:
{
  "id": "prologue-01",
  "titleKey": "scenarios.prologue_01.title",
  "textKey": "scenarios.prologue_01.narrative",
  "act": 0,
  "scene": 1,
  "locationId": "kamenitsa_home",
  "choices": [
    {
      "id": "a",
      "textKey": "scenarios.prologue_01.choice_a",
      "nextScenario": "prologue-02"
    },
    {
      "id": "b",
      "textKey": "scenarios.prologue_01.choice_b",
      "nextScenario": "prologue-02-alt"
    },
    {
      "id": "c",
      "textKey": "scenarios.prologue_01.choice_c",
      "nextScenario": "prologue-03"
    }
  ]
}

// 4. Generate translations:
// src/i18n/locales/bg/scenarios.json
{
  "scenarios": {
    "prologue_01": {
      "title": "Пробуждане",
      "narrative": "Събуждаш се рано сутринта...",
      "choice_a": "Огледай стаята внимателно",
      "choice_b": "Излез навън да подишаш свеж въздух",
      "choice_c": "Отиди в работилницата на дядо си"
    }
  }
}

// 5. Create ScenarioDisplay component
// src/components/game/ScenarioDisplay.tsx
import { useTranslation } from 'react-i18next';

export const ScenarioDisplay = ({ scenario }) => {
  const { t } = useTranslation('scenarios');
  
  const title = t(scenario.titleKey);
  const narrative = t(scenario.textKey);
  
  return (
    <ScrollView>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.narrative}>{narrative}</Text>
      {scenario.choices.map(choice => (
        <ChoiceButton
          key={choice.id}
          text={t(choice.textKey)}
          onPress={() => handleChoice(choice.id)}
        />
      ))}
    </ScrollView>
  );
};

// 6. Test in app - created test screen
// Run: npm run ios
// Navigate to: Game → Prologue → Scene 1
// ✅ Scenario displays correctly in Bulgarian
```

### 4.4 Sprint Review & Retrospective

**At End of Sprint:**
```bash
bmad sprint complete

# Output:
# 📊 Sprint 1 Summary
# ✅ 6/6 stories complete (100%)
# ✅ 21/21 SP complete (100%)
# ⏱️  Duration: 4 days (within estimate)
# 
# Velocity: 5.25 SP/day
# 
# Next Sprint: Epic 2 (Game Engine Core)
# Estimated: 34 SP, 6-7 days
```

---

## 5. Content Implementation Flow

### 5.1 Standard Content Implementation Pattern

**For ANY content story (scenarios, quests, items, NPCs):**

```
1. Read Game Bible File(s)
       ↓
2. Parse with ContentParser
       ↓
3. Generate JSON Data
       ↓
4. Extract Translations
       ↓
5. Create/Update Components
       ↓
6. Test in App
       ↓
7. Mark Story Complete
```

### 5.2 Scenario Implementation (Detailed)

**Input:** Scenario markdown file from game-bible/

**Example: act1-scene3.md**
```markdown
# Act I, Scene 3: Работилницата на Стоян

## Metadata
- ID: act1-scene3
- Act: 1
- Scene: 3
- Location: Kamenitsa
- NPCs: Stoyan

## Narrative
Влизаш в работилницата на Стоян. Миризмата на желязо и въглища те среща като стара позната...

## Choices
A) Питаш за оръжия (Persuasion DC 11)
B) Предлагаш помощ (Strength DC 12)
C) Излизаш спокойно

## Consequences
### Choice A (Success)
- Set flag: asked_about_weapons = true
- Relationship: stoyan +5
- Next: act1-scene4

### Choice A (Failure)
- Relationship: stoyan -5
- Next: act1-scene3b

### Choice B (Success)
- Set flag: helped_stoyan = true
- Relationship: stoyan +10
- Next: act1-scene4

### Choice B (Failure)
- Health: -5
- Next: act1-scene3c

### Choice C
- Next: act1-scene5
```

**Windsurf Prompt:**
```
Parse game-bible/scenarios/act-i/03-stoyan-workshop.md and:

1. Generate src/game/data/scenarios/act1-scene3.json with:
   - All metadata
   - Translation keys for narrative and choices
   - Skill checks with success/failure consequences
   - Next scenario links

2. Add translations to src/i18n/locales/bg/scenarios.json under "act1_scene3"

3. Update ScenarioEngine to handle skill checks with DC

4. Show me the generated files

Use ContentParser from LOCALIZATION-ARCHITECTURE.md as reference.
```

**Output:**
```json
// src/game/data/scenarios/act1-scene3.json
{
  "id": "act1-scene3",
  "titleKey": "scenarios.act1_scene3.title",
  "textKey": "scenarios.act1_scene3.narrative",
  "act": 1,
  "scene": 3,
  "locationId": "kamenitsa",
  "npcsPresent": ["stoyan"],
  
  "choices": [
    {
      "id": "a",
      "textKey": "scenarios.act1_scene3.choice_a",
      "skillChecks": [
        {
          "skill": "persuasion",
          "dc": 11,
          "onSuccess": [
            { "type": "flag", "target": "asked_about_weapons", "value": true },
            { "type": "relationship", "target": "stoyan", "value": 5 }
          ],
          "onFailure": [
            { "type": "relationship", "target": "stoyan", "value": -5 }
          ]
        }
      ],
      "nextScenario": "act1-scene4",
      "nextScenarioOnFailure": "act1-scene3b"
    },
    // ... other choices
  ]
}
```

```json
// src/i18n/locales/bg/scenarios.json (appended)
{
  "scenarios": {
    "act1_scene3": {
      "title": "Работилницата на Стоян",
      "narrative": "Влизаш в работилницата на Стоян. Миризмата на желязо и въглища те среща като стара позната...",
      "choice_a": "Питаш за оръжия (Убеждаване DC 11)",
      "choice_b": "Предлагаш помощ (Сила DC 12)",
      "choice_c": "Излизаш спокойно"
    }
  }
}
```

### 5.3 Quest Implementation

**Input:** Quest markdown from game-bible/side-quests/

**Windsurf Prompt:**
```
Implement side quest from game-bible/side-quests/kamenitsa/HELP.md - Quest #1 "Mice in Cellar"

1. Parse quest markdown
2. Generate src/game/data/quests/kamenitsa-help-01.json
3. Extract translations to src/i18n/locales/bg/quests.json
4. Update QuestSystem to support this quest type (help/simple)
5. Add quest to NPC Baba Pena's quest offerings
6. Test: Accept quest → Complete objective → Get reward
```

### 5.4 Item Implementation

**Input:** ITEMS.md from game-bible

**Windsurf Prompt:**
```
From game-bible/ITEMS.md, implement all weapons (15+ items):

1. Parse weapons section
2. Generate src/game/data/items/weapons.json with:
   - Item IDs, names, descriptions
   - Stats (damage, weight, value, requirements)
   - Translation keys
3. Extract translations to src/i18n/locales/bg/items.json
4. Update InventorySystem to handle weapons
5. Add first weapon to player inventory for testing
6. Test: View in inventory, equip weapon, see stats change
```

---

## 6. AI Prompting Best Practices

### 6.1 Effective Prompts Structure

**Good Prompt Template:**
```
I'm working on [Story ID + Name] from [Epic].

Context:
- Related documents: [PRD Section / Architecture Section / Game Bible file]
- Dependencies: [Previous stories or systems]

Requirements from EPIC-BREAKDOWN.md:
[Copy acceptance criteria]

Please implement by:
1. [Specific step]
2. [Specific step]
3. [Specific step]

Show me [what to show first] before continuing.

Reference [specific document section] for [technical details].
```

**Example Good Prompt:**
```
I'm working on Story 8.3: Implement Turn Processing from Epic 8 (Combat System).

Context:
- Combat system initialized (Story 8.1)
- Combat UI created (Story 8.2)
- Architecture doc Section 6.2 has CombatEngine spec

Requirements:
- Process player and enemy turns
- Calculate damage based on stats
- Apply status effects
- Check victory conditions after each turn
- Update combat log

Please implement by:
1. Create CombatEngine.processTurn() method
2. Add turn advancement logic
3. Integrate with CombatUI to show turn indicator
4. Add unit tests for turn processing

Show me the CombatEngine.processTurn() method signature and logic first.

Reference ARCHITECTURE.md Section 6.2 for damage calculation formulas.
```

### 6.2 Bad Prompts to Avoid

**❌ Too Vague:**
```
Make the combat system work
```

**❌ No Context:**
```
Implement Story 8.3
```

**❌ No Reference to Docs:**
```
Create a combat engine with turn-based battles
```

**❌ Too Many Steps:**
```
Implement stories 1-10 from Epic 1
```

### 6.3 Prompting for Game Bible Content

**Template:**
```
Parse content from game-bible/[path/to/file.md]:

File: [exact filepath]
Content type: [scenario/quest/item/npc]
Target: [where to generate output]

Steps:
1. Read and parse markdown
2. Extract [specific sections]
3. Generate JSON in [target path]
4. Extract translations to [i18n path]
5. [Integration step]

Use [ContentParser/QuestParser/ItemParser] from LOCALIZATION-ARCHITECTURE.md.

Show parsed structure before generating files.
```

### 6.4 Iterative Refinement

**If output isn't perfect:**

```
The generated JSON is missing [specific field]. 

From game-bible file, I see this information:
[paste relevant excerpt]

Please update the JSON to include:
- [field 1]: [expected value/format]
- [field 2]: [expected value/format]

Regenerate the file.
```

---

## 7. Common Workflows

### 7.1 Adding a New Scenario

```bash
# Workflow:
# 1. Write scenario in game-bible (or it's already there)
# 2. Parse with content pipeline
# 3. Test in app

# Step 1: Run content pipeline for single file
cd tools/content-pipeline
npm run parse:single -- ../../game-bible/scenarios/act-ii/05-market-scene.md

# Step 2: Verify generated files
ls src/game/data/scenarios/ | grep act2-scene5
ls src/i18n/locales/bg/ | grep scenarios

# Step 3: Test in app
npm run dev

# In app, navigate to Act II and trigger scene 5
# Verify text displays, choices work, transitions correct
```

### 7.2 Adding a New Item

```bash
# Workflow:
# 1. Add item to game-bible/ITEMS.md
# 2. Re-run item parser
# 3. Test in inventory

# Step 1: Edit ITEMS.md
vim game-bible/ITEMS.md
# Add new weapon/armor/consumable

# Step 2: Parse items
cd tools/content-pipeline
npm run parse:items

# Step 3: Give item to player for testing
# In dev console (Expo Dev Menu → "Add Test Item")
addTestItem('new-sword-id')

# Step 4: Check inventory
# Open Inventory screen, see new item, equip it, check stats
```

### 7.3 Adding a New NPC

```bash
# Workflow:
# 1. Add NPC to game-bible/CHARACTERS.md
# 2. Parse NPCs
# 3. Add dialogue
# 4. Place in scenario

# Step 1: Edit CHARACTERS.md
vim game-bible/CHARACTERS.md
# Add NPC: name, role, faction, affinity, quests

# Step 2: Parse NPCs
cd tools/content-pipeline
npm run parse:npcs

# Step 3: Add dialogue file
vim game-bible/dialogues/new-npc-dialogue.md

# Step 4: Reference NPC in scenario
# Edit scenario markdown, add NPC to "NPCs Present" metadata

# Step 5: Test
npm run dev
# Navigate to scenario, see NPC, initiate dialogue
```

### 7.4 Translating Content

```bash
# Workflow:
# 1. Bulgarian content exists (source)
# 2. Export for translation
# 3. Translate
# 4. Import
# 5. Test

# Step 1: Bulgarian content complete
# (Already done via content pipeline)

# Step 2: Export for English translation
npm run translation:export -- --language en
# Output: translations/export/en-translation-pack.xlsx

# Step 3: Translate (manually or via service)
# Edit Excel file or use Lokalise/Crowdin

# Step 4: Import completed translations
npm run translation:import -- --language en --file translations/import/en-completed.xlsx

# Step 5: Test English version
npm run dev -- --language en
# Play through prologue in English, verify quality
```

### 7.5 Adding a New Language

```bash
# Workflow:
# 1. Add language to config
# 2. Create translation files structure
# 3. Translate
# 4. Test

# Step 1: Add to supported languages
vim src/i18n/config.ts
# Add 'ru' to resources

vim src/services/LanguageService.ts
# Add { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' }

# Step 2: Create file structure
mkdir -p src/i18n/locales/ru
touch src/i18n/locales/ru/common.json
touch src/i18n/locales/ru/scenarios.json
touch src/i18n/locales/ru/quests.json
# ... other namespaces

# Step 3: Copy Bulgarian structure and translate
cp src/i18n/locales/bg/common.json src/i18n/locales/ru/common.json
# Edit Russian file, translate all strings

# Step 4: Test
npm run dev -- --language ru
```

---

## 8. Troubleshooting

### 8.1 Content Pipeline Issues

**Problem:** Pipeline fails to parse scenario

**Solution:**
```bash
# Check scenario markdown format
cat game-bible/scenarios/problematic-scene.md

# Common issues:
# - Missing metadata section
# - Incorrect choice format (must be "A) Text")
# - Malformed markdown headers

# Fix markdown, then re-run:
npm run parse:single -- game-bible/scenarios/problematic-scene.md
```

**Problem:** Translation keys don't match

**Solution:**
```bash
# Validate translations
npm run translation:validate -- --language bg

# Fix reported issues:
# - Missing keys
# - Duplicate keys
# - Mismatched variables {{playerName}}
```

### 8.2 Windsurf AI Issues

**Problem:** Cascade doesn't understand game bible format

**Solution:**
```
In your prompt, explicitly reference LOCALIZATION-ARCHITECTURE.md:

"Use the ContentParser from LOCALIZATION-ARCHITECTURE.md Section 3.2 to parse this game bible scenario. The format is:

# Title
## Metadata
## Narrative  
## Choices
## Consequences

Parse following this structure."
```

**Problem:** AI generates code that doesn't match architecture

**Solution:**
```
"STOP. Refer to ARCHITECTURE.md Section [X] for the correct [system/component] structure. 

I need [component name] to follow the architecture spec exactly:
[paste relevant architecture section]

Please regenerate following this specification."
```

### 8.3 BMAD Workflow Issues

**Problem:** Sprint progress not tracking

**Solution:**
```bash
# Reinitialize BMAD
bmad init --force

# Manually mark stories complete
bmad story complete 1.1
bmad story complete 1.2

# Check sprint status
bmad sprint status
```

**Problem:** Can't find Epic/Story references

**Solution:**
```bash
# Search EPIC-BREAKDOWN.md
grep -n "Story 8.3" .bmad/EPIC-BREAKDOWN.md

# Or use Windsurf search (Ctrl+Shift+F)
# Search in .bmad/ folder for story ID
```

---

## 9. Development Best Practices

### 9.1 Always Reference Documentation

**Before coding ANY feature:**
1. Check **Epic Breakdown** for story requirements
2. Check **Architecture** for technical specs
3. Check **Game Bible** for content
4. Check **Localization Architecture** for i18n

**In Windsurf:**
```
Open files in split view:
- Left: .bmad/EPIC-BREAKDOWN.md (current story)
- Center: Source code file
- Right: game-bible or Architecture doc
```

### 9.2 Incremental Implementation

**Don't implement entire Epic at once:**

❌ "Implement all of Epic 8 (Combat System)"

✅ "Implement Story 8.1 (Combat Initiation), then Story 8.2 (Combat UI), then..."

**Test after EACH story:**
```bash
# After Story 8.1
npm test src/game/engine/CombatEngine.test.ts
npm run dev # Manual test

# After Story 8.2  
npm run dev # Test combat UI

# Continue...
```

### 9.3 Version Control Strategy

**Commit after each story:**
```bash
git add .
git commit -m "feat(combat): Implement Story 8.1 - Combat Initiation

- Created CombatEngine.initiateCombat()
- Initialize combat state with player and enemies
- Calculate initiative order
- Created unit tests

Story: Epic 8, Story 8.1 (3 SP)
Status: Complete ✅"

git push
```

### 9.4 Documentation Updates

**When implementing stories that change architecture:**

1. Update **ARCHITECTURE.md** if adding new components/systems
2. Update **LOCALIZATION-ARCHITECTURE.md** if changing content pipeline
3. Add comments in code referencing docs:

```typescript
/**
 * Combat Engine
 * 
 * Implements turn-based combat system as specified in:
 * - ARCHITECTURE.md Section 6.2
 * - EPIC-BREAKDOWN.md Epic 8
 * 
 * @see .bmad/ARCHITECTURE.md#combat-engine-architecture
 */
export class CombatEngine {
  // ...
}
```

---

## 10. Quick Reference

### BMAD Commands Cheat Sheet

```bash
# Initialize project
bmad init --track enterprise

# Sprint management
bmad sprint start --epic 1
bmad sprint status
bmad sprint complete

# Story management
bmad story list
bmad story show 8.3
bmad story complete 8.3

# Reporting
bmad report velocity
bmad report progress

# Content pipeline
cd tools/content-pipeline
npm run parse              # Parse all
npm run parse:scenarios    # Scenarios only
npm run parse:quests       # Quests only
npm run parse:items        # Items only
npm run parse:npcs         # NPCs only

# Translation
npm run translation:export -- --language en
npm run translation:import -- --language en --file translations.xlsx
npm run translation:validate -- --language en
npm run translation:pretranslate -- --language en
```

### Document Quick Links

**When working on...**
- **Project setup** → ARCHITECTURE.md Section 1-2
- **Game engine** → ARCHITECTURE.md Section 6
- **Combat** → ARCHITECTURE.md Section 6.2, Epic 8
- **Magic** → MAGIC-SPELLS.md, Epic 9
- **Scenarios** → LOCALIZATION-ARCHITECTURE.md Section 3, Epic 16-17
- **Quests** → Epic 11, Epic 18-19
- **Localization** → LOCALIZATION-ARCHITECTURE.md (entire doc)
- **DLC** → ARCHITECTURE.md Section 7, Epic 21-24

---

**END OF IMPLEMENTATION GUIDE**

**Summary:**
- ✅ Windsurf + BMAD setup complete
- ✅ Game Bible integration explained
- ✅ Sprint execution workflow documented
- ✅ Content-to-code pipeline detailed
- ✅ AI prompting best practices provided
- ✅ Common workflows and troubleshooting covered

**You're ready to start implementation!** 🚀

Start with Epic 1, Story 1.1 and work through the Sprint 1 plan.
