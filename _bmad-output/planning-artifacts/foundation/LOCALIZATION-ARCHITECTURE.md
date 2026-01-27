# Localization Architecture & Content Pipeline
## The Golden Chariot of Belintash

**Version:** 1.0  
**Date:** January 12, 2026  
**Document Owner:** Technical Architecture & Content Team  
**Status:** Implementation Guide  
**Related Documents:** PRD v1.0, Architecture v1.0, Epic Breakdown v1.0

---

## Executive Summary

This document provides a comprehensive localization architecture and content pipeline strategy for **The Golden Chariot of Belintash**. It covers:

1. **Multi-language support** for UI, scenarios, and game data
2. **Content import pipeline** from Game Bible to game data
3. **Translation workflow** for professional and community translations
4. **Content management** for 150+ scenarios across multiple languages

### Key Features

- Support for unlimited languages (starting with BG, EN)
- Separation of code, content, and translations
- Hot-reloadable content for rapid iteration
- Translation memory and terminology management
- Community translation support
- Professional translation integration

---

## Table of Contents

1. [Localization Architecture](#localization-architecture)
2. [Multi-Language System](#multi-language-system)
3. [Content Import Pipeline](#content-import-pipeline)
4. [Translation Workflow](#translation-workflow)
5. [File Structure](#file-structure)
6. [Implementation Guide](#implementation-guide)
7. [Translation Tools](#translation-tools)
8. [Quality Assurance](#quality-assurance)

---

## 1. Localization Architecture

### 1.1 Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                     Localization System                       │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Game Bible (Source)                     │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │    │
│  │  │  Scenarios   │  │    Quests    │  │  Items   │  │    │
│  │  │   (.md)      │  │   (.md)      │  │  (.md)   │  │    │
│  │  └──────────────┘  └──────────────┘  └──────────┘  │    │
│  └─────────────────────────────────────────────────────┘    │
│                          ↓                                    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │           Content Import Pipeline                    │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │    │
│  │  │  Parser  │→│Extractor │→│  JSON Generator  │  │    │
│  │  └──────────┘  └──────────┘  └──────────────────┘  │    │
│  └─────────────────────────────────────────────────────┘    │
│                          ↓                                    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │           Structured Game Data                       │    │
│  │  ┌──────────────────────────────────────────────┐   │    │
│  │  │  scenarios/                                   │   │    │
│  │  │    bg/                                        │   │    │
│  │  │      prologue-01.json                         │   │    │
│  │  │      act-i-scene-01.json                      │   │    │
│  │  │    en/                                        │   │    │
│  │  │      prologue-01.json                         │   │    │
│  │  │    ru/  (future)                              │   │    │
│  │  │    ...                                        │   │    │
│  │  └──────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────┘    │
│                          ↓                                    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              i18next Runtime                         │    │
│  │  ┌──────────────────────────────────────────────┐   │    │
│  │  │  Language Detection                           │   │    │
│  │  │  Translation Loading                          │   │    │
│  │  │  Fallback Handling                            │   │    │
│  │  │  Interpolation                                │   │    │
│  │  └──────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────┘    │
│                          ↓                                    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                 Game UI                              │    │
│  │  Displays content in selected language              │    │
│  └─────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

### 1.2 Core Principles

#### Separation of Concerns
```
Code (Logic)        ←→  Content (Data)        ←→  Translations
  TypeScript             JSON/Markdown             i18next files
  Components             Scenarios                 UI strings
  Game Engine            Quests/Items              In-game text
```

**Benefits:**
- Translators work independently of developers
- Content updates don't require code changes
- Multiple languages supported without code duplication
- Easy to add new languages

#### Content as Data
All game content (scenarios, quests, items, NPCs) stored as **structured data** (JSON), not hardcoded in code.

**Example:**
```typescript
// ❌ BAD: Hardcoded content
const scenario = {
  text: "Влизаш в работилницата на Стоян...",
  choices: [
    { text: "Питаш за оръжия", action: "ask_weapons" },
    { text: "Предлагаш помощ", action: "offer_help" }
  ]
};

// ✅ GOOD: Content as data with i18n keys
const scenario = {
  textKey: "scenarios.act1.scene3.text",
  choices: [
    { textKey: "scenarios.act1.scene3.choice_a", action: "ask_weapons" },
    { textKey: "scenarios.act1.scene3.choice_b", action: "offer_help" }
  ]
};
```

---

## 2. Multi-Language System

### 2.1 Language Support Strategy

#### Phase 1: Launch Languages
1. **Bulgarian (bg)** - Primary language, 100% complete
2. **English (en)** - Secondary language for international audience

#### Phase 2: Additional Languages (Post-Launch)
3. **Russian (ru)** - Large Slavic market
4. **Serbian (sr)** - Regional interest
5. **Romanian (ro)** - Neighboring country
6. **Greek (el)** - Historical connection

#### Phase 3: Community Languages (Optional)
7. **German (de)**
8. **French (fr)**
9. **Spanish (es)**
10. **Turkish (tr)**

### 2.2 i18next Configuration

```typescript
// src/i18n/config.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translations
import bg from './locales/bg/translation.json';
import en from './locales/en/translation.json';

const LANGUAGE_STORAGE_KEY = '@golden_chariot:language';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      bg: {
        translation: bg,
        // Namespace structure:
        // - common: UI elements, buttons, menus
        // - scenarios: All scenario text
        // - quests: Quest names and descriptions
        // - items: Item names and descriptions
        // - npcs: NPC names and dialogues
        // - errors: Error messages
      },
      en: {
        translation: en,
      },
    },
    lng: 'bg', // Default language
    fallbackLng: 'en', // Fallback if translation missing
    debug: __DEV__, // Enable debug in development
    
    interpolation: {
      escapeValue: false, // React already escapes
    },
    
    // Namespaces for organization
    ns: ['common', 'scenarios', 'quests', 'items', 'npcs', 'errors'],
    defaultNS: 'common',
    
    // Load language from storage
    react: {
      useSuspense: false, // Don't use suspense (mobile)
    },
  });

// Load saved language preference
AsyncStorage.getItem(LANGUAGE_STORAGE_KEY).then((savedLanguage) => {
  if (savedLanguage) {
    i18n.changeLanguage(savedLanguage);
  }
});

export default i18n;
```

### 2.3 Language Switching

```typescript
// src/services/LanguageService.ts
import i18n from '../i18n/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGE_STORAGE_KEY = '@golden_chariot:language';

export class LanguageService {
  static async changeLanguage(languageCode: string): Promise<void> {
    await i18n.changeLanguage(languageCode);
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
    
    // Optionally reload scenarios in new language
    // await ScenarioLoader.reloadCurrentScenario();
  }
  
  static getCurrentLanguage(): string {
    return i18n.language;
  }
  
  static getSupportedLanguages(): LanguageInfo[] {
    return [
      { code: 'bg', name: 'Български', nativeName: 'Български', flag: '🇧🇬' },
      { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
      // Add more as available
    ];
  }
  
  static isLanguageSupported(languageCode: string): boolean {
    return ['bg', 'en'].includes(languageCode);
  }
}

interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}
```

### 2.4 Translation Usage in Components

#### UI Components
```typescript
// src/components/GameScreen.tsx
import { useTranslation } from 'react-i18next';

const GameScreen = () => {
  const { t } = useTranslation(); // Default namespace: 'common'
  
  return (
    <View>
      <Text>{t('game.continue')}</Text>
      <Button title={t('game.save')} onPress={handleSave} />
      <Button title={t('game.settings')} onPress={openSettings} />
    </View>
  );
};
```

#### Scenario Display
```typescript
// src/components/ScenarioDisplay.tsx
import { useTranslation } from 'react-i18next';

const ScenarioDisplay = ({ scenario }: Props) => {
  const { t } = useTranslation('scenarios');
  
  // Scenario structure with translation keys
  const narrativeText = t(scenario.textKey, {
    // Interpolation variables
    playerName: player.name,
    location: t(`locations.${scenario.locationId}`),
  });
  
  return (
    <ScrollView>
      <Text>{narrativeText}</Text>
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
```

#### Dynamic Content with Pluralization
```typescript
const { t } = useTranslation();

// Pluralization support
const itemCount = 5;
const message = t('inventory.items', { count: itemCount });
// bg: "5 предмета"
// en: "5 items"

// Gender support (Bulgarian has gendered nouns)
const npcName = t('npcs.stoyan.name'); // "Стоян" (masculine)
const greeting = t('npcs.stoyan.greeting', { 
  context: 'male' 
});
```

### 2.5 Pluralization Rules (BG Example)

```json
// src/i18n/locales/bg/translation.json
{
  "inventory": {
    "items_one": "{{count}} предмет",
    "items_few": "{{count}} предмета",
    "items_other": "{{count}} предмети"
  },
  "apple": {
    "one": "{{count}} ябълка",
    "few": "{{count}} ябълки",
    "other": "{{count}} ябълки"
  }
}
```

```typescript
// Pluralization-aware i18next config
i18n.init({
  pluralSeparator: '_',
  compatibilityJSON: 'v4',
  returnObjects: true,
  interpolation: { escapeValue: false },
  pluralization: {
    bg: function (count) {
      // Bulgarian plural rules:
      // 1 → one; 2-4 (except 12-14) → few; everything else → other
      const n = Math.abs(count);
      if (n === 1) return 'one';
      if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14)) return 'few';
      return 'other';
    },
  },
});

// Usage
const swordCount = 3;
const swordLabel = t('inventory.items', { count: swordCount });
```

---

## 3. Content Import Pipeline

### 3.1 Pipeline Overview

```
Game Bible (Markdown)
    ↓
Content Parser
    ↓
Translation Extractor
    ↓
JSON Generator
    ↓
Game Data (JSON) + Translation Files (JSON)
```

### 3.2 Content Parser

```typescript
// tools/content-pipeline/parser.ts
import fs from 'fs';
import matter from 'gray-matter'; // Parse frontmatter
import marked from 'marked'; // Parse markdown

export class ContentParser {
  /**
   * Parse scenario markdown file from game bible
   */
  static parseScenario(filePath: string): ParsedScenario {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    // Parse frontmatter (metadata) and content
    const { data: metadata, content } = matter(fileContent);
    
    // Extract sections
    const sections = this.extractSections(content);
    
    return {
      metadata: {
        id: metadata.id || this.generateId(filePath),
        title: metadata.title,
        act: metadata.act,
        scene: metadata.scene,
        location: metadata.location,
      },
      narrative: sections.narrative,
      choices: this.parseChoices(sections.choices),
      prerequisites: this.parsePrerequisites(sections.prerequisites),
      npcsPresent: metadata.npcs || [],
    };
  }
  
  /**
   * Extract sections from markdown content
   * Example sections: ## Narrative, ## Choices, ## Prerequisites
   */
  private static extractSections(content: string): Record<string, string> {
    const sections: Record<string, string> = {};
    const lines = content.split('\n');
    let currentSection = '';
    let currentContent: string[] = [];
    
    for (const line of lines) {
      if (line.startsWith('## ')) {
        // Save previous section
        if (currentSection) {
          sections[currentSection] = currentContent.join('\n').trim();
        }
        // Start new section
        currentSection = line.replace('## ', '').toLowerCase();
        currentContent = [];
      } else {
        currentContent.push(line);
      }
    }
    
    // Save last section
    if (currentSection) {
      sections[currentSection] = currentContent.join('\n').trim();
    }
    
    return sections;
  }
  
  /**
   * Parse choices from markdown
   * Example:
   * A) Ask about weapons (Persuasion DC 11)
   * B) Offer to help (Strength DC 12)
   */
  private static parseChoices(choicesText: string): ParsedChoice[] {
    const choices: ParsedChoice[] = [];
    const choiceRegex = /^([A-D])\)\s+(.+?)(?:\s*\((.*?)\))?$/gm;
    
    let match;
    while ((match = choiceRegex.exec(choicesText)) !== null) {
      const [, letter, text, requirements] = match;
      
      choices.push({
        id: letter.toLowerCase(),
        text: text.trim(),
        requirements: requirements ? this.parseRequirements(requirements) : [],
      });
    }
    
    return choices;
  }
  
  /**
   * Parse requirements (skill checks, conditions)
   */
  private static parseRequirements(reqText: string): Requirement[] {
    const requirements: Requirement[] = [];
    
    // Skill check: "Persuasion DC 11"
    const skillCheckRegex = /(\w+)\s+DC\s+(\d+)/gi;
    let match;
    while ((match = skillCheckRegex.exec(reqText)) !== null) {
      const [, skill, dc] = match;
      requirements.push({
        type: 'skill_check',
        skill: skill.toLowerCase(),
        dc: parseInt(dc),
      });
    }
    
    // Conditions: "if completed_prologue = true"
    const conditionRegex = /if\s+(\w+)\s*=\s*(\w+)/gi;
    while ((match = conditionRegex.exec(reqText)) !== null) {
      const [, flag, value] = match;
      requirements.push({
        type: 'condition',
        flag,
        value: value === 'true',
      });
    }
    
    return requirements;
  }
}

interface ParsedScenario {
  metadata: {
    id: string;
    title: string;
    act: number;
    scene: number;
    location: string;
  };
  narrative: string;
  choices: ParsedChoice[];
  prerequisites: Condition[];
  npcsPresent: string[];
}

interface ParsedChoice {
  id: string;
  text: string;
  requirements: Requirement[];
}
```

### 3.3 Translation Extractor

```typescript
// tools/content-pipeline/extractor.ts
export class TranslationExtractor {
  /**
   * Extract all translatable text from parsed scenario
   * and generate translation keys
   */
  static extractTranslations(
    scenario: ParsedScenario,
    sourceLanguage: string
  ): TranslationExtraction {
    const translations: Record<string, string> = {};
    const scenarioId = scenario.metadata.id;
    
    // Extract narrative text
    const narrativeKey = `scenarios.${scenarioId}.narrative`;
    translations[narrativeKey] = scenario.narrative;
    
    // Extract choice texts
    scenario.choices.forEach(choice => {
      const choiceKey = `scenarios.${scenarioId}.choice_${choice.id}`;
      translations[choiceKey] = choice.text;
    });
    
    // Extract title
    const titleKey = `scenarios.${scenarioId}.title`;
    translations[titleKey] = scenario.metadata.title;
    
    return {
      language: sourceLanguage,
      translations,
      scenarioId,
    };
  }
  
  /**
   * Extract translations from all game bible files
   */
  static extractAllTranslations(
    gameBiblePath: string,
    sourceLanguage: string
  ): AllTranslations {
    const allTranslations: AllTranslations = {
      scenarios: {},
      quests: {},
      items: {},
      npcs: {},
    };
    
    // Extract scenario translations
    const scenarioFiles = this.getScenarioFiles(gameBiblePath);
    scenarioFiles.forEach(file => {
      const parsed = ContentParser.parseScenario(file);
      const extracted = this.extractTranslations(parsed, sourceLanguage);
      Object.assign(allTranslations.scenarios, extracted.translations);
    });
    
    // Extract quest translations
    const questFiles = this.getQuestFiles(gameBiblePath);
    questFiles.forEach(file => {
      const extracted = this.extractQuestTranslations(file, sourceLanguage);
      Object.assign(allTranslations.quests, extracted);
    });
    
    // Extract item translations
    const itemFiles = this.getItemFiles(gameBiblePath);
    itemFiles.forEach(file => {
      const extracted = this.extractItemTranslations(file, sourceLanguage);
      Object.assign(allTranslations.items, extracted);
    });
    
    // Extract NPC translations
    const npcFiles = this.getNPCFiles(gameBiblePath);
    npcFiles.forEach(file => {
      const extracted = this.extractNPCTranslations(file, sourceLanguage);
      Object.assign(allTranslations.npcs, extracted);
    });
    
    return allTranslations;
  }
}

interface AllTranslations {
  scenarios: Record<string, string>;
  quests: Record<string, string>;
  items: Record<string, string>;
  npcs: Record<string, string>;
}
```

### 3.4 JSON Generator

```typescript
// tools/content-pipeline/generator.ts
export class JSONGenerator {
  /**
   * Generate game data JSON files from parsed content
   */
  static generateScenarioJSON(
    parsed: ParsedScenario,
    outputPath: string
  ): void {
    const scenarioData: ScenarioData = {
      id: parsed.metadata.id,
      titleKey: `scenarios.${parsed.metadata.id}.title`,
      textKey: `scenarios.${parsed.metadata.id}.narrative`,
      act: parsed.metadata.act,
      scene: parsed.metadata.scene,
      locationId: parsed.metadata.location,
      
      choices: parsed.choices.map(choice => ({
        id: choice.id,
        textKey: `scenarios.${parsed.metadata.id}.choice_${choice.id}`,
        conditions: this.convertRequirementsToConditions(choice.requirements),
        consequences: [], // Parsed separately
        nextScenario: null, // Linked separately
      })),
      
      prerequisites: parsed.prerequisites,
      npcsPresent: parsed.npcsPresent,
    };
    
    // Write to file
    const fileName = `${parsed.metadata.id}.json`;
    fs.writeFileSync(
      path.join(outputPath, fileName),
      JSON.stringify(scenarioData, null, 2)
    );
  }
  
  /**
   * Generate translation JSON files
   */
  static generateTranslationJSON(
    translations: AllTranslations,
    language: string,
    outputPath: string
  ): void {
    // Separate by namespace
    const namespaces = {
      scenarios: translations.scenarios,
      quests: translations.quests,
      items: translations.items,
      npcs: translations.npcs,
    };
    
    // Write each namespace to separate file
    Object.entries(namespaces).forEach(([namespace, content]) => {
      const fileName = `${namespace}.json`;
      const filePath = path.join(outputPath, language, fileName);
      
      // Ensure directory exists
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      
      // Write file
      fs.writeFileSync(
        filePath,
        JSON.stringify(content, null, 2)
      );
    });
  }
}
```

### 3.5 Complete Pipeline Script

```bash
#!/bin/bash
# tools/content-pipeline/run-pipeline.sh

# Content Import Pipeline
# Converts Game Bible (Markdown) to Game Data (JSON) + Translations (JSON)

echo "🚀 Starting Content Import Pipeline..."

# Configuration
GAME_BIBLE_PATH="../../game-bible"
OUTPUT_DATA_PATH="../../src/game/data"
OUTPUT_I18N_PATH="../../src/i18n/locales"
SOURCE_LANGUAGE="bg"

# Step 1: Parse all content from Game Bible
echo "📖 Step 1: Parsing Game Bible..."
node dist/parser.js \
  --input "$GAME_BIBLE_PATH" \
  --output "./temp/parsed"

# Step 2: Extract translations
echo "🌍 Step 2: Extracting translations..."
node dist/extractor.js \
  --input "./temp/parsed" \
  --language "$SOURCE_LANGUAGE" \
  --output "./temp/translations"

# Step 3: Generate JSON files
echo "📝 Step 3: Generating JSON files..."
node dist/generator.js \
  --parsed "./temp/parsed" \
  --translations "./temp/translations" \
  --output-data "$OUTPUT_DATA_PATH" \
  --output-i18n "$OUTPUT_I18N_PATH"

# Step 4: Validate generated files
echo "✅ Step 4: Validating generated files..."
node dist/validator.js \
  --data "$OUTPUT_DATA_PATH" \
  --i18n "$OUTPUT_I18N_PATH"

echo "✨ Pipeline complete!"
echo "📊 Statistics:"
node dist/stats.js --data "$OUTPUT_DATA_PATH"
```

### 3.6 Running the Pipeline

```bash
# From project root
cd tools/content-pipeline

# Install dependencies
npm install

# Build TypeScript tools
npm run build

# Run full pipeline
./run-pipeline.sh

# Or run individual steps
npm run parse      # Parse game bible
npm run extract    # Extract translations
npm run generate   # Generate JSON files
npm run validate   # Validate output
```

---

## 4. Translation Workflow

### 4.1 Translation Process Overview

```
Bulgarian Content (Source)
    ↓
Extract to Translation Files (bg.json)
    ↓
Send to Translators (en.json, ru.json, etc.)
    ↓
Review & QA
    ↓
Import Translated Files
    ↓
Test in Game
    ↓
Release
```

### 4.2 Translation File Format

```json
// src/i18n/locales/bg/scenarios.json
{
  "scenarios": {
    "prologue_01": {
      "title": "Пробуждане",
      "narrative": "Събуждаш се рано сутринта. Светлината на изгряващото слънце прониква през прозореца на стаята ти. Дядо ти вече не е тук...",
      "choice_a": "Огледай стаята внимателно",
      "choice_b": "Излез навън да подишаш свеж въздух",
      "choice_c": "Отиди в работилницата на дядо си"
    },
    "act1_scene1": {
      "title": "Работилницата на Стоян",
      "narrative": "Влизаш в работилницата. Миризмата на желязо и въглища те среща като стара позната. Стоян те поглежда изпод веждите си.",
      "choice_a": "Питаш за оръжия (Убеждаване DC 11)",
      "choice_b": "Предлагаш помощ (Сила DC 12)",
      "choice_c": "Излизаш спокойно"
    }
  }
}
```

```json
// src/i18n/locales/en/scenarios.json
{
  "scenarios": {
    "prologue_01": {
      "title": "Awakening",
      "narrative": "You wake up early in the morning. The light of the rising sun penetrates through your room's window. Your grandfather is no longer here...",
      "choice_a": "Examine the room carefully",
      "choice_b": "Go outside to breathe fresh air",
      "choice_c": "Go to your grandfather's workshop"
    },
    "act1_scene1": {
      "title": "Stoyan's Workshop",
      "narrative": "You enter the workshop. The smell of iron and coal greets you like an old friend. Stoyan glances at you from under his brows.",
      "choice_a": "Ask about weapons (Persuasion DC 11)",
      "choice_b": "Offer to help (Strength DC 12)",
      "choice_c": "Leave quietly"
    }
  }
}
```

### 4.3 Professional Translation Workflow

#### Step 1: Export for Translation
```bash
# Export all untranslated content to Excel/CSV for translators
npm run translation:export --language en

# Output: translations/export/en-translation-pack.xlsx
# Contains:
# - Key | Bulgarian Text | English Translation (empty) | Context | Character Limit
```

#### Step 2: Send to Translators
- **Platform:** Use Lokalise, Crowdin, or POEditor
- **Format:** XLIFF, JSON, or Excel
- **Instructions:** Provide context, character limits, terminology

**Translation Brief:**
```markdown
# Translation Brief: The Golden Chariot of Belintash

## Context
Historical fantasy RPG set in 13th century Bulgaria (1221 AD).
Inspired by Bulgarian folklore and Thracian mythology.

## Tone
- Descriptive and literary (inspired by Aleko Konstantinov)
- Serious with occasional humor
- Historically accurate terminology

## Key Terms (Do NOT translate)
- Белинташ (Belintash) - Sacred rock name
- Златна колесница (Golden Chariot) - Keep as is
- Самодива (Samodiva) - Mythological creature
- Баяне (Bayane) - Folk magic ritual

## Character Names (Keep Bulgarian)
- Стоян (Stoyan)
- Калина (Kalina)
- Елена (Elena)
- Теофил (Teofil)

## Historical Terms
- Перпера (Perpera) - Byzantine gold coin
- Трахея (Trachea) - Byzantine silver coin
- Болярин (Bolyarin) - Nobleman

## Constraints
- Scenario text: Maintain literary quality
- Choices: Keep concise (max 80 characters)
- Item names: Keep short (max 30 characters)
- UI text: Match tone of original
```

#### Step 3: Import Translated Content
```bash
# Import translated content from Excel/CSV
npm run translation:import --language en --file translations/import/en-completed.xlsx

# Validate translations
npm run translation:validate --language en

# Test in game
npm run dev -- --language en
```

#### Option C: Weblate (Self-Hosted or Cloud)

1. **Infrastructure**
   ```bash
   # docker-compose.yml (excerpt)
   version: '3'
   services:
     weblate:
       image: weblate/weblate
       restart: always
       env_file: .env.weblate
       volumes:
         - weblate-data:/app/data
       ports:
         - "8080:8080"
     database:
       image: postgres:14
       environment:
         POSTGRES_DB: weblate
         POSTGRES_USER: weblate
         POSTGRES_PASSWORD: change-me
   volumes:
     weblate-data:
   ```
   - **Hosted alternative:** weblate.org cloud (~$19–49/month) for small teams.

2. **Project Setup**
   - Create component per namespace (`common`, `scenarios`, `quests`, etc.).
   - Set source branch to `main`, translation branch to `translations`.
   - Enable automatic `git pull/push` hooks to sync with repo.

3. **Workflow**
   - Invite translators via Weblate UI (`Users → Invite`).
   - Define glossary/terminology project for lore names.
   - Enable translation memory + quality checks (placeholders, punctuation).
   - Require reviewer approval for `scenarios/*` components.

4. **Sync Script**
   ```bash
   # tools/localization/weblate-sync.sh
   git fetch origin translations
   git checkout translations
   git pull weblate translations
   git checkout main
   git merge translations --no-ff -m "Merge translations from Weblate"
   npm run lint:i18n
   git push origin main
   ```

5. **Cost/Time Planning**
   - Self-hosted: ~$15/month (VPS) + maintenance.
   - Cloud: $20–50/month, no maintenance.
   - Recommended for 2+ translators or >50K words backlog.

### 4.4 Community Translation Workflow

#### Option A: GitHub-Based
```bash
git clone https://github.com/studio/golden-chariot.git
# Edit translation files directly
# Submit pull request

# File structure:
src/i18n/locales/
  bg/              # Original (locked)
  en/              # Professional
  ru/              # Community
    scenarios.json # Translators edit here
    quests.json
    items.json
    common.json
```

#### Option B: Web-Based Platform
- Use **Weblate** (open source, self-hosted)
- Translators access web interface
- No technical knowledge required
- Automatic pull requests
- Translation memory across languages

**Setup Weblate:**
```yaml
# .weblate
[weblate]
url = https://translations.goldenchariot.app
project = golden-chariot-belintash

[component "scenarios"]
file_format = json
filemask = src/i18n/locales/*/scenarios.json
new_base = src/i18n/locales/bg/scenarios.json

[component "quests"]
file_format = json
filemask = src/i18n/locales/*/quests.json
new_base = src/i18n/locales/bg/quests.json
```

### 4.5 Translation Memory & Terminology

#### Translation Memory Database
```typescript
// tools/translation/memory.ts
interface TranslationMemory {
  sourceText: string;
  targetText: string;
  sourceLanguage: string;
  targetLanguage: string;
  context: string;
  lastUsed: Date;
  approved: boolean;
}

class TranslationMemoryService {
  /**
   * Find similar translations
   */
  static findSimilar(
    text: string,
    sourceLanguage: string,
    targetLanguage: string,
    threshold: number = 0.8
  ): TranslationMemory[] {
    // Use fuzzy matching to find similar source texts
    // Return their translations as suggestions
  }
  
  /**
   * Save translation to memory
   */
  static save(entry: TranslationMemory): void {
    // Save to database for future reference
  }
}
```

#### Terminology Glossary
```json
// tools/translation/glossary.json
{
  "terms": [
    {
      "bg": "Белинташ",
      "en": "Belintash",
      "ru": "Белинташ",
      "context": "Sacred Thracian rock sanctuary",
      "doNotTranslate": true
    },
    {
      "bg": "самодива",
      "en": "samodiva",
      "ru": "самодива",
      "context": "Mythological forest nymph",
      "doNotTranslate": true,
      "note": "Use transliteration, add explanation in parentheses on first use"
    },
    {
      "bg": "баяне",
      "en": "bayane (folk chant)",
      "ru": "баяние",
      "context": "Traditional Bulgarian healing ritual",
      "doNotTranslate": false,
      "note": "Can translate but provide context"
    }
  ]
}
```

---

## 5. File Structure

### 5.1 Source Files (Game Bible)

```
game-bible/
├── scenarios/
│   ├── prologue/
│   │   ├── 01-sabuzhdane.md
│   │   ├── 02-kaminata.md
│   │   ├── 03-stoyan.md
│   │   └── 04-dnevnik.md
│   ├── act-i/
│   │   ├── 01-kamenitsa-intro.md
│   │   ├── 02-stoyan-workshop.md
│   │   └── ...
│   ├── act-ii/
│   ├── act-iii/
│   ├── act-iv/
│   └── act-v/
├── side-quests/
│   ├── kamenitsa/
│   │   ├── HELP.md
│   │   ├── COMBAT.md
│   │   ├── MYSTERY.md
│   │   └── GATHERING.md
│   ├── stanimaka/
│   ├── philippopolis/
│   └── ...
├── items/
│   ├── weapons.md
│   ├── armor.md
│   ├── consumables.md
│   └── ...
├── npcs/
│   ├── stoyan.md
│   ├── kalina.md
│   ├── elena.md
│   └── ...
└── ...
```

### 5.2 Generated Game Data

```
src/game/data/
├── scenarios/
│   ├── prologue-01.json
│   ├── prologue-02.json
│   ├── act1-scene1.json
│   ├── act1-scene2.json
│   └── ...
├── quests/
│   ├── kamenitsa-help-01.json
│   ├── kamenitsa-combat-01.json
│   └── ...
├── items/
│   ├── weapons.json
│   ├── armor.json
│   └── consumables.json
├── npcs/
│   └── npcs.json
├── enemies/
│   └── enemies.json
└── metadata/
    ├── scenario-index.json
    ├── quest-index.json
    └── item-index.json
```

### 5.3 Translation Files

```
src/i18n/locales/
├── bg/
│   ├── common.json        # UI strings
│   ├── scenarios.json     # All scenario text
│   ├── quests.json        # Quest names/descriptions
│   ├── items.json         # Item names/descriptions
│   ├── npcs.json          # NPC names/dialogues
│   └── errors.json        # Error messages
├── en/
│   ├── common.json
│   ├── scenarios.json
│   ├── quests.json
│   ├── items.json
│   ├── npcs.json
│   └── errors.json
└── ru/  (future)
    ├── common.json
    └── ...
```

### 5.4 Example Files

#### Scenario Data (JSON)
```json
// src/game/data/scenarios/act1-scene1.json
{
  "id": "act1-scene1",
  "titleKey": "scenarios.act1_scene1.title",
  "textKey": "scenarios.act1_scene1.narrative",
  "act": 1,
  "scene": 1,
  "locationId": "kamenitsa",
  
  "choices": [
    {
      "id": "a",
      "textKey": "scenarios.act1_scene1.choice_a",
      "conditions": [],
      "skillChecks": [
        {
          "skill": "persuasion",
          "dc": 11,
          "onSuccess": [
            { "type": "flag", "target": "asked_about_weapons", "value": true }
          ],
          "onFailure": [
            { "type": "relationship", "target": "stoyan", "value": -5 }
          ]
        }
      ],
      "consequences": [],
      "nextScenario": "act1-scene2a"
    },
    {
      "id": "b",
      "textKey": "scenarios.act1_scene1.choice_b",
      "conditions": [],
      "skillChecks": [
        {
          "skill": "strength",
          "dc": 12,
          "onSuccess": [
            { "type": "relationship", "target": "stoyan", "value": 10 }
          ],
          "onFailure": []
        }
      ],
      "nextScenario": "act1-scene2b"
    }
  ],
  
  "prerequisites": [
    { "type": "flag", "target": "completed_prologue", "value": true }
  ],
  
  "npcsPresent": ["stoyan"]
}
```

#### Translation File (JSON)
```json
// src/i18n/locales/bg/common.json
{
  "common": {
    "continue": "Продължи",
    "save": "Запази",
    "load": "Зареди",
    "settings": "Настройки",
    "quit": "Изход",
    "yes": "Да",
    "no": "Не",
    "cancel": "Отказ",
    "ok": "ОК"
  },
  "game": {
    "new_game": "Нова игра",
    "continue_game": "Продължи",
    "load_game": "Зареди игра",
    "settings": "Настройки",
    "credits": "Надписи",
    "quit": "Изход"
  },
  "character": {
    "level": "Ниво",
    "experience": "Опит",
    "health": "Здраве",
    "mana": "Мана",
    "gold": "Злато"
  },
  "notifications": {
    "game_saved": "Играта е запазена",
    "game_loaded": "Играта е заредена",
    "quest_completed": "Задача завършена: {{questName}}",
    "level_up": "Ниво повишено! Сега си на ниво {{level}}",
    "item_gained": "Получихте: {{itemName}}",
    "item_lost": "Загубихте: {{itemName}}"
  }
}
```

---

## 6. Implementation Guide

### 6.1 Step-by-Step Implementation

#### Phase 1: Setup i18next (Sprint 27, Story 25.1)

**Step 1: Install dependencies**
```bash
npm install i18next react-i18next
npm install --save-dev @types/i18next
```

**Step 2: Create i18n configuration**
```typescript
// src/i18n/config.ts
// (See Section 2.2 for full code)
```

**Step 3: Initialize in App**
```typescript
// App.tsx
import './i18n/config'; // Import before other components
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/config';

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      {/* Rest of app */}
    </I18nextProvider>
  );
}
```

#### Phase 2: Create Content Pipeline (Sprint 27, Story 25.2)

**Step 1: Create parser tool**
```bash
cd tools
mkdir content-pipeline
cd content-pipeline
npm init -y
npm install typescript @types/node gray-matter marked
```

**Step 2: Implement parser** (See Section 3.2)

**Step 3: Implement extractor** (See Section 3.3)

**Step 4: Implement generator** (See Section 3.4)

**Step 5: Create run script** (See Section 3.5)

#### Phase 3: Extract Bulgarian Content (Sprint 27, Story 25.3)

**Step 1: Run pipeline on game bible**
```bash
cd tools/content-pipeline
./run-pipeline.sh
```

**Step 2: Verify output**
```bash
# Check generated files
ls -la ../../src/game/data/scenarios/
ls -la ../../src/i18n/locales/bg/

# Validate JSON
npm run validate
```

**Step 3: Test in game**
```bash
cd ../..
npm run dev
```

#### Phase 4: Translate to English (Sprint 27, Story 25.3)

**Step 1: Export for translation**
```bash
npm run translation:export --language en
# Output: translations/export/en-translation-pack.xlsx
```

**Step 2: Send to translator**
- Upload to Lokalise/Crowdin OR
- Email Excel file to translator

**Step 3: Import completed translations**
```bash
npm run translation:import \
  --language en \
  --file translations/import/en-completed.xlsx
```

**Step 4: Test English version**
```bash
npm run dev -- --language en
```

#### Phase 5: Add Language Selector (Sprint 27, Story 25.2)

```typescript
// src/components/SettingsScreen.tsx
import { LanguageService } from '../services/LanguageService';

const SettingsScreen = () => {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  
  const languages = LanguageService.getSupportedLanguages();
  
  const handleLanguageChange = async (languageCode: string) => {
    await LanguageService.changeLanguage(languageCode);
    setSelectedLanguage(languageCode);
    
    // Show notification
    Alert.alert(
      t('settings.language_changed'),
      t('settings.language_changed_message')
    );
  };
  
  return (
    <View>
      <Text style={styles.header}>{t('settings.language')}</Text>
      {languages.map(lang => (
        <TouchableOpacity
          key={lang.code}
          style={styles.languageOption}
          onPress={() => handleLanguageChange(lang.code)}
        >
          <Text style={styles.flag}>{lang.flag}</Text>
          <Text style={styles.languageName}>{lang.nativeName}</Text>
          {selectedLanguage === lang.code && (
            <Icon name="check" size={20} color="green" />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};
```

### 6.2 Content Update Workflow

**When content changes in Game Bible:**

```bash
# 1. Re-run content pipeline
cd tools/content-pipeline
./run-pipeline.sh

# 2. Check what changed
git diff src/i18n/locales/bg/

# 3. Export changed translations for other languages
npm run translation:export-changes --language en

# 4. Send to translators

# 5. Import updated translations
npm run translation:import --language en --file updates.xlsx

# 6. Test
npm run dev
```

### 6.3 Hot-Reload Content (Development)

```typescript
// src/services/ContentHotReload.ts
// For development only - reload content without app restart

export class ContentHotReload {
  static async reloadScenarios(): Promise<void> {
    if (!__DEV__) return; // Only in development
    
    // Re-run content pipeline
    await this.runPipeline();
    
    // Clear scenario cache
    ScenarioLoader.clearCache();
    
    // Reload translations
    await i18n.reloadResources();
    
    // Refresh current scenario
    const currentScenarioId = useGameStore.getState().currentScenario?.id;
    if (currentScenarioId) {
      await useGameStore.getState().loadScenario(currentScenarioId);
    }
    
    console.log('✅ Content reloaded');
  }
}

// Use in dev menu
if (__DEV__) {
  DevMenu.addItem('Reload Content', () => {
    ContentHotReload.reloadScenarios();
  });
}
```

---

## 7. Translation Tools

### 7.1 Translation Validator

```typescript
// tools/translation/validator.ts
export class TranslationValidator {
  /**
   * Validate translation completeness
   */
  static validateCompleteness(
    sourceLanguage: string,
    targetLanguage: string
  ): ValidationReport {
    const sourceTranslations = this.loadTranslations(sourceLanguage);
    const targetTranslations = this.loadTranslations(targetLanguage);
    
    const missing: string[] = [];
    const sourceKeys = this.getAllKeys(sourceTranslations);
    
    sourceKeys.forEach(key => {
      const targetValue = this.getNestedValue(targetTranslations, key);
      if (!targetValue || targetValue === '') {
        missing.push(key);
      }
    });
    
    return {
      language: targetLanguage,
      total: sourceKeys.length,
      translated: sourceKeys.length - missing.length,
      missing,
      completeness: ((sourceKeys.length - missing.length) / sourceKeys.length * 100).toFixed(2) + '%'
    };
  }
  
  /**
   * Validate variable consistency
   * Ensure {{variables}} match between source and target
   */
  static validateVariables(
    sourceLanguage: string,
    targetLanguage: string
  ): VariableIssue[] {
    const issues: VariableIssue[] = [];
    const sourceTranslations = this.loadTranslations(sourceLanguage);
    const targetTranslations = this.loadTranslations(targetLanguage);
    
    const allKeys = this.getAllKeys(sourceTranslations);
    
    allKeys.forEach(key => {
      const sourceText = this.getNestedValue(sourceTranslations, key);
      const targetText = this.getNestedValue(targetTranslations, key);
      
      if (!sourceText || !targetText) return;
      
      const sourceVars = this.extractVariables(sourceText);
      const targetVars = this.extractVariables(targetText);
      
      // Check if variables match
      const missingInTarget = sourceVars.filter(v => !targetVars.includes(v));
      const extraInTarget = targetVars.filter(v => !sourceVars.includes(v));
      
      if (missingInTarget.length > 0 || extraInTarget.length > 0) {
        issues.push({
          key,
          sourceText,
          targetText,
          missingVariables: missingInTarget,
          extraVariables: extraInTarget,
        });
      }
    });
    
    return issues;
  }
  
  /**
   * Extract {{variables}} from text
   */
  private static extractVariables(text: string): string[] {
    const regex = /\{\{(\w+)\}\}/g;
    const matches = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      matches.push(match[1]);
    }
    return matches;
  }
}

// CLI usage
// npm run translation:validate -- --language en
```

### 7.2 Translation Statistics

```typescript
// tools/translation/stats.ts
export class TranslationStats {
  static generateReport(language: string): StatsReport {
    const translations = TranslationValidator.loadTranslations(language);
    
    return {
      language,
      namespaces: {
        common: this.countKeys(translations.common),
        scenarios: this.countKeys(translations.scenarios),
        quests: this.countKeys(translations.quests),
        items: this.countKeys(translations.items),
        npcs: this.countKeys(translations.npcs),
      },
      totalKeys: this.countAllKeys(translations),
      totalWords: this.countWords(translations),
      totalCharacters: this.countCharacters(translations),
      estimatedTranslationTime: this.estimateTime(translations), // words / 300 words per hour
    };
  }
}

// Output example:
// Translation Statistics for English
// ===================================
// Common UI:        250 keys,    500 words
// Scenarios:      1,200 keys, 80,000 words
// Quests:           300 keys,  6,000 words
// Items:            150 keys,  1,500 words
// NPCs:             100 keys,  3,000 words
// ===================================
// Total:          2,000 keys, 91,000 words
// Estimated time: 303 hours (professional translator)
```

### 7.3 Translation Memory Tool

```typescript
// tools/translation/memory-tool.ts
export class TranslationMemoryTool {
  /**
   * Find translation suggestions from memory
   */
  static async suggestTranslation(
    sourceText: string,
    sourceLanguage: string,
    targetLanguage: string
  ): Promise<TranslationSuggestion[]> {
    // Search translation memory for similar source texts
    const similar = await TranslationMemoryService.findSimilar(
      sourceText,
      sourceLanguage,
      targetLanguage,
      0.7 // 70% similarity threshold
    );
    
    // Sort by similarity score
    return similar.map(entry => ({
      sourceText: entry.sourceText,
      targetText: entry.targetText,
      similarity: this.calculateSimilarity(sourceText, entry.sourceText),
      context: entry.context,
    })).sort((a, b) => b.similarity - a.similarity);
  }
  
  /**
   * Pre-translate using translation memory
   * Automatically fill translations for exact matches
   */
  static async pretranslate(
    sourceLanguage: string,
    targetLanguage: string
  ): Promise<PretranslationReport> {
    const sourceTranslations = TranslationValidator.loadTranslations(sourceLanguage);
    const targetTranslations = TranslationValidator.loadTranslations(targetLanguage);
    
    let exactMatches = 0;
    let fuzzyMatches = 0;
    
    const allKeys = TranslationValidator.getAllKeys(sourceTranslations);
    
    for (const key of allKeys) {
      const sourceText = TranslationValidator.getNestedValue(sourceTranslations, key);
      const targetText = TranslationValidator.getNestedValue(targetTranslations, key);
      
      // Skip if already translated
      if (targetText && targetText !== '') continue;
      
      // Search memory
      const suggestions = await this.suggestTranslation(sourceText, sourceLanguage, targetLanguage);
      
      if (suggestions.length > 0) {
        const best = suggestions[0];
        
        if (best.similarity === 1.0) {
          // Exact match - auto-fill
          TranslationValidator.setNestedValue(targetTranslations, key, best.targetText);
          exactMatches++;
        } else if (best.similarity >= 0.9) {
          // Fuzzy match - mark for review
          TranslationValidator.setNestedValue(
            targetTranslations,
            key,
            `[REVIEW: ${best.similarity}] ${best.targetText}`
          );
          fuzzyMatches++;
        }
      }
    }
    
    // Save updated translations
    TranslationValidator.saveTranslations(targetLanguage, targetTranslations);
    
    return {
      language: targetLanguage,
      exactMatches,
      fuzzyMatches,
      totalKeys: allKeys.length,
    };
  }
}

// CLI usage
// npm run translation:pretranslate -- --language en
// Output: 450 exact matches, 120 fuzzy matches (review needed)
```

---

## 8. Quality Assurance

### 8.1 Translation QA Checklist

**Before Release:**

- [ ] All keys translated (100% completeness)
- [ ] Variables validated ({{playerName}} matches)
- [ ] No untranslated text in UI
- [ ] No placeholder text like "TODO" or "[Translation needed]"
- [ ] Terminology consistency (checked against glossary)
- [ ] Cultural adaptation (dates, measurements, idioms)
- [ ] Gender agreement (important for Bulgarian/Russian)
- [ ] Pluralization rules correct
- [ ] Text fits UI (no overflow)
- [ ] Special characters display correctly (Cyrillic, etc.)
- [ ] Line breaks appropriate
- [ ] Testing on device (not just simulator)
- [ ] Native speaker review

### 8.2 Automated QA Tests

```typescript
// __tests__/translations/qa.test.ts
describe('Translation QA', () => {
  const languages = ['bg', 'en'];
  
  languages.forEach(lang => {
    describe(`Language: ${lang}`, () => {
      test('should have all required namespaces', () => {
        const requiredNamespaces = ['common', 'scenarios', 'quests', 'items', 'npcs'];
        requiredNamespaces.forEach(ns => {
          const translations = require(`../../src/i18n/locales/${lang}/${ns}.json`);
          expect(translations).toBeDefined();
          expect(Object.keys(translations).length).toBeGreaterThan(0);
        });
      });
      
      test('should have matching variables in all translations', () => {
        const issues = TranslationValidator.validateVariables('bg', lang);
        
        if (issues.length > 0) {
          console.error(`Variable issues found in ${lang}:`);
          issues.forEach(issue => {
            console.error(`  ${issue.key}:`);
            console.error(`    Missing: ${issue.missingVariables.join(', ')}`);
            console.error(`    Extra: ${issue.extraVariables.join(', ')}`);
          });
        }
        
        expect(issues).toHaveLength(0);
      });
      
      test('should not have placeholder text', () => {
        const translations = TranslationValidator.loadTranslations(lang);
        const placeholders = ['TODO', 'Translation needed', 'FIXME', '[TBD]'];
        
        const found = TranslationValidator.searchForPatterns(translations, placeholders);
        
        if (found.length > 0) {
          console.error(`Placeholder text found in ${lang}:`);
          found.forEach(f => console.error(`  ${f.key}: ${f.value}`));
        }
        
        expect(found).toHaveLength(0);
      });
      
      test('should have reasonable text length', () => {
        const translations = TranslationValidator.loadTranslations(lang);
        const longTexts = TranslationValidator.findLongTexts(translations, 500); // 500 char limit for choices
        
        if (longTexts.length > 0) {
          console.warn(`Long texts found in ${lang} (may cause UI issues):`);
          longTexts.forEach(t => console.warn(`  ${t.key}: ${t.length} chars`));
        }
        
        // Warning only, not failing test
      });
    });
  });
});
```

### 8.3 Manual QA Process

**Step 1: Completeness Check**
```bash
npm run translation:validate -- --language en
# Expected output: 100% completeness
```

**Step 2: In-Game Testing**
```bash
# Test each language
npm run dev -- --language bg
npm run dev -- --language en

# Checklist:
# - Main menu displays correctly
# - Character creation works
# - Prologue plays without errors
# - All UI elements visible
# - No text overflow
# - Choices fit in buttons
# - Notifications display correctly
```

**Step 3: Edge Cases**
- Very long player names (20 characters)
- Special characters in input (Cyrillic, Greek, etc.)
- Different screen sizes (phone vs tablet)
- Different text sizes (accessibility settings)

**Step 4: Native Speaker Review**
- Hire/ask native speaker to play first 30 minutes
- Collect feedback on:
  - Naturalness of translation
  - Grammar and spelling errors
  - Cultural appropriateness
  - Terminology consistency

---

## Appendix A: Complete Example - Prologue Scene 1

### Source (Game Bible)
```markdown
# Пролог, Сцена 1: Пробуждане

## Метаданни
- **ID:** prologue-01
- **Акт:** Пролог
- **Сцена:** 1
- **Локация:** Стаята на героя (Каменица)
- **NPC:** Няма

## Наратив

Събуждаш се рано сутринта. Светлината на изгряващото слънце прониква през прозореца на стаята ти. Въздухът е тежък от мълчание — дядо ти вече не е тук. Преди седмица той си отиде, оставяйки те сам с купища спомени и една тайна, която не успя да ти разкаже докрай.

Огледаш се наоколо. Старата къща скърца познато под стъпките ти. Всичко е така, както го е оставил — сякаш всеки миг ще влезе през вратата с усмивката си и ще каже: "Ела, момче, имам да ти разкажа нещо важно."

Но той няма да се върне.

## Избори

**А)** Огледай стаята внимателно  
**Б)** Излез навън да подишаш свеж въздух  
**В)** Отиди в работилницата на дядо си

## Последствия

### Избор А → Сцена 2 (Камината)
- Установяваш флаг: `examined_room = true`

### Избор Б → Сцена 2 (навън, алтернативен вход)
- Установяваш флаг: `went_outside_first = true`

### Избор В → Сцена 3 (работилницата)
- Установяваш флаг: `visited_workshop_first = true`
```

### Generated JSON (Structured Data)
```json
// src/game/data/scenarios/prologue-01.json
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
      "conditions": [],
      "consequences": [
        {
          "type": "flag",
          "action": "set",
          "target": "examined_room",
          "value": true
        }
      ],
      "nextScenario": "prologue-02"
    },
    {
      "id": "b",
      "textKey": "scenarios.prologue_01.choice_b",
      "conditions": [],
      "consequences": [
        {
          "type": "flag",
          "action": "set",
          "target": "went_outside_first",
          "value": true
        }
      ],
      "nextScenario": "prologue-02-alt"
    },
    {
      "id": "c",
      "textKey": "scenarios.prologue_01.choice_c",
      "conditions": [],
      "consequences": [
        {
          "type": "flag",
          "action": "set",
          "target": "visited_workshop_first",
          "value": true
        }
      ],
      "nextScenario": "prologue-03"
    }
  ],
  
  "prerequisites": [],
  "npcsPresent": []
}
```

### Bulgarian Translation
```json
// src/i18n/locales/bg/scenarios.json
{
  "scenarios": {
    "prologue_01": {
      "title": "Пробуждане",
      "narrative": "Събуждаш се рано сутринта. Светлината на изгряващото слънце прониква през прозореца на стаята ти. Въздухът е тежък от мълчание — дядо ти вече не е тук. Преди седмица той си отиде, оставяйки те сам с купища спомени и една тайна, която не успя да ти разкаже докрай.\n\nОгледаш се наоколо. Старата къща скърца познато под стъпките ти. Всичко е така, както го е оставил — сякаш всеки миг ще влезе през вратата с усмивката си и ще каже: \"Ела, момче, имам да ти разкажа нещо важно.\"\n\nНо той няма да се върне.",
      "choice_a": "Огледай стаята внимателно",
      "choice_b": "Излез навън да подишаш свеж въздух",
      "choice_c": "Отиди в работилницата на дядо си"
    }
  }
}
```

### English Translation
```json
// src/i18n/locales/en/scenarios.json
{
  "scenarios": {
    "prologue_01": {
      "title": "Awakening",
      "narrative": "You wake up early in the morning. The light of the rising sun penetrates through your room's window. The air is heavy with silence—your grandfather is no longer here. A week ago he passed away, leaving you alone with a pile of memories and a secret he never got to fully reveal.\n\nYou look around. The old house creaks familiarly beneath your steps. Everything is just as he left it—as if any moment he'll walk through the door with his smile and say: \"Come, boy, I have something important to tell you.\"\n\nBut he will not return.",
      "choice_a": "Examine the room carefully",
      "choice_b": "Go outside to breathe fresh air",
      "choice_c": "Go to your grandfather's workshop"
    }
  }
}
```

### In-Game Usage
```typescript
// src/components/ScenarioDisplay.tsx
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../store/gameStore';
import { useCharacterStore } from '../store/characterStore';

const ScenarioDisplay = () => {
  const { t } = useTranslation('scenarios');
  const scenario = useGameStore(state => state.currentScenario);
  const player = useCharacterStore(state => state.player);
  
  if (!scenario) return <LoadingScreen />;
  
  // Get translated text with variable interpolation
  const title = t(scenario.titleKey);
  const narrative = t(scenario.textKey, {
    playerName: player.name,
    // Add more variables as needed
  });
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.narrative}>{narrative}</Text>
      
      <View style={styles.choicesContainer}>
        {scenario.choices.map(choice => {
          const choiceText = t(choice.textKey);
          return (
            <ChoiceButton
              key={choice.id}
              text={choiceText}
              onPress={() => handleChoice(choice.id)}
            />
          );
        })}
      </View>
    </ScrollView>
  );
};
```

---

## Appendix B: Translation Workflow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Content Creation                      │
│                                                          │
│  Game Designer writes scenario in Game Bible (Bulgarian)│
│  Format: Markdown (.md)                                 │
└─────────────────────┬───────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│               Content Import Pipeline                    │
│                                                          │
│  1. Parse markdown → Extract structure                  │
│  2. Generate JSON → Structured game data                │
│  3. Extract text → Translation keys                     │
└─────────────────────┬───────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│           Bulgarian Translation Files (Source)           │
│                                                          │
│  bg/scenarios.json (100% complete)                      │
└─────────────────────┬───────────────────────────────────┘
                      ↓
              ┌───────┴────────┐
              ↓                ↓
┌─────────────────────┐  ┌──────────────────────┐
│  Professional        │  │  Community          │
│  Translation         │  │  Translation        │
│                      │  │                     │
│  - Export to Excel   │  │  - GitHub/Weblate   │
│  - Send to agency    │  │  - Volunteers edit  │
│  - Review & QA       │  │  - Pull requests    │
│  - Import completed  │  │  - Auto-import      │
└─────────┬────────────┘  └──────────┬───────────┘
          ↓                          ↓
┌─────────────────────────────────────────────────────────┐
│          Target Language Translation Files               │
│                                                          │
│  en/scenarios.json (100% complete)                      │
│  ru/scenarios.json (in progress)                        │
│  sr/scenarios.json (planned)                            │
└─────────────────────┬───────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│                  Quality Assurance                       │
│                                                          │
│  1. Automated validation (variables, completeness)      │
│  2. In-game testing                                     │
│  3. Native speaker review                               │
│  4. Edge case testing                                   │
└─────────────────────┬───────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│                     Release                              │
│                                                          │
│  App with multiple language support                     │
│  Users can switch languages in Settings                 │
└─────────────────────────────────────────────────────────┘
```

---

**END OF LOCALIZATION ARCHITECTURE DOCUMENT**

**Summary:**
- ✅ Multi-language support with i18next
- ✅ Content pipeline from Game Bible to JSON
- ✅ Professional and community translation workflows
- ✅ Translation memory and terminology management
- ✅ Automated QA and validation
- ✅ Complete implementation guide

**Next Documents:**
1. Implementation Guide (BMAD + Windsurf)
2. Content Creation Guide
3. Review & Corrections
