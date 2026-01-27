# 🎯 Практично Ръководство: Как да Започнеш с BMAD + WindSurf

## 📋 Кратък Отговор:

**ДА, corrections трябва да се приложат!** Но не чрез преработване на файлове - просто ще следваш **CORRECTIONS-APPLICATION-GUIDE.md** когато създаваш проекта.

Ето пълния план! 👇

---

## 📁 Част 1: Организация на Документацията

### **Как да организираш файловете:**

```
📁 golden-chariot-docs/
│
├── 📁 01-foundation/
│   ├── PRD-v1.1.md
│   ├── ARCHITECTURE-v1.1.md
│   ├── EPIC-BREAKDOWN-v1.1.md
│   ├── LOCALIZATION-ARCHITECTURE.md
│   └── IMPLEMENTATION-GUIDE.md
│
├── 📁 02-user-stories/
│   ├── USER-STORIES-EPIC-01.md
│   ├── USER-STORIES-EPIC-02.md
│   ├── USER-STORIES-EPIC-03.md
│   ├── USER-STORIES-EPIC-04.md
│   └── USER-STORIES-EPIC-05.md
│
├── 📁 03-corrections/
│   ├── REVIEW-EPIC-01-02.md          (за reference)
│   ├── CORRECTIONS-BUNDLE.md          (за reference)
│   ├── CORRECTIONS-APPLICATION-GUIDE.md  ⭐ (ЩЕ ИЗПОЛЗВАШ!)
│   └── CORRECTIONS-SUMMARY.md         (за reference)
│
├── 📁 04-summaries/
│   ├── EPIC-03-SUMMARY.md
│   ├── EPIC-04-SUMMARY.md
│   ├── PROGRESS-SUMMARY-EPICS-1-3.md
│   └── FOUNDATION-COMPLETE.md         ⭐ (прочети го!)
│
└── 📁 05-guides/
    ├── QUICK-REFERENCE.md             (полезен по време на dev)
    └── SAMPLE-IMPLEMENTATION.md       (reference)
```

---

## 🎯 Част 2: Какво да Направиш с Corrections

### **НЕ преработвай USER-STORIES файловете!**

Corrections файловете са отделни **защото**:
1. USER-STORIES епиците са **теоретична документация** (reference)
2. CORRECTIONS-APPLICATION-GUIDE.md е **практическо ръководство** за implementation

### **Ето какво да направиш:**

```
❌ НЕ: Merge corrections into USER-STORIES файлове
✅ ДА: Използвай CORRECTIONS-APPLICATION-GUIDE.md когато създаваш проекта
```

**Защо?**
- USER-STORIES = Reference документация (четеш я за разбиране)
- CORRECTIONS-APPLICATION-GUIDE = Action checklist (следваш го стъпка-по-стъпка)

---

## 🚀 Част 3: Как да Започнеш с BMAD + WindSurf

### **Step-by-Step Plan:**

---

## 📝 СТЪПКА 1: Подготовка (15 минути)

### **1.1 Инсталирай необходимите tools:**

```bash
# Провери Node.js версия
node -v
# Трябва да е v18 или v20 (LTS)

# Ако нямаш Node 20:
# Отиди на https://nodejs.org и инсталирай LTS version

# Провери npm
npm -v
# Трябва да е 9+ или 10+

# Провери git
git --version
```

### **1.2 Създай project папка:**

```bash
# Навигирай къде искаш проекта
cd ~/Projects  # или където искаш

# Създай основна папка
mkdir golden-chariot-project
cd golden-chariot-project

# Структура:
# golden-chariot-project/
#   ├── docs/              (копирай документацията тук)
#   └── golden-chariot-belintash/  (кодът ще бъде тук - ще го създадеш)
```

### **1.3 Копирай документацията:**

```bash
# Създай docs папка
mkdir docs
cd docs

# Копирай всички .md файлове от outputs/ тук
# Организирай ги според структурата горе (01-foundation, 02-user-stories, etc.)

# Важни файлове за reference:
# - FOUNDATION-COMPLETE.md (overview)
# - CORRECTIONS-APPLICATION-GUIDE.md (ЩЕ ИЗПОЛЗВАШ!)
# - USER-STORIES-EPIC-*.md (reference)
# - QUICK-REFERENCE.md (за troubleshooting)
```

---

## 💻 СТЪПКА 2: Създай React Native Проекта (10 минути)

### **2.1 Инициализирай проекта:**

```bash
# Върни се в project root
cd ~/Projects/golden-chariot-project

# Създай Expo проект с TypeScript
npx create-expo-app@latest golden-chariot-belintash --template expo-template-blank-typescript

# Навигирай в проекта
cd golden-chariot-belintash

# Провери структурата
ls -la
# Трябва да видиш: App.tsx, package.json, tsconfig.json

# Test run
npm start
# Натисни 'i' за iOS simulator или 'a' за Android
# Трябва да видиш белият екран с "Open up App.tsx to start working..."
```

✅ **Checkpoint:** Ако виждаш app-а в симулатора, готов си за следващата стъпка!

---

## 🔧 СТЪПКА 3: Приложи Corrections (30-45 минути)

### **3.1 Отвори CORRECTIONS-APPLICATION-GUIDE.md:**

```bash
# В отделен терминал/window, отвори guide-а
cd ~/Projects/golden-chariot-project/docs/03-corrections
open CORRECTIONS-APPLICATION-GUIDE.md
# или
code CORRECTIONS-APPLICATION-GUIDE.md  # ако използваш VS Code
```

### **3.2 Следвай стъпка-по-стъпка:**

**Corrections Application Guide съдържа:**
- ✅ Part 1: Prerequisites (backup, Node check)
- ✅ Part 2: Add 7 New Files (copy-paste ready)
- ✅ Part 3: Update 5 Existing Files (exact changes)
- ✅ Part 4: Install Dependencies
- ✅ Part 5: Verification & Testing
- ✅ Part 6: Commit Changes

**ВАЖНО:** Следвай guide-а **точно** - той е тестван и работи!

### **3.3 Key files от corrections (бърз reference):**

```
Нови файлове (7):
1. src/global.d.ts
2. src/game/types/character.ts
3. docs/QUICK-REFERENCE.md
4. tools/validate-scenarios.ts
5. .vscode/settings.json
6. .vscode/extensions.json
7. src/services/__tests__/integration/CompleteFlow.test.ts

Обновени файлове (5):
1. tsconfig.json (path aliases)
2. babel.config.js (module resolver)
3. jest.setup.js (enhanced mocks)
4. package.json (new script)
5. .github/workflows/test.yml (Node 20)
```

---

## 🎨 СТЪПКА 4: Setup BMAD в WindSurf (20 минути)

### **4.1 Инсталирай WindSurf:**

Ако нямаш WindSurf:
- Отиди на https://codeium.com/windsurf
- Свали и инсталирай
- Отвори проекта в WindSurf

### **4.2 Създай BMAD Context File:**

**File:** `golden-chariot-belintash/.windsurfcontext`

```markdown
# BMAD Context for The Golden Chariot of Belintash

## Project Overview
Historical text-based RPG set in 1221 Bulgaria. React Native + Expo + TypeScript.

## Foundation Status
✅ Epics 1-5 (Foundation) - 100% documented
⏳ Implementation starting

## Key Documentation
- Foundation: ../docs/01-foundation/
- User Stories: ../docs/02-user-stories/
- Quick Reference: ../docs/05-guides/QUICK-REFERENCE.md

## Current Phase
Sprint 1: Implementing Epic 1 (Project Setup)

## Architecture
- Engine: src/game/engine/
- State: src/store/ (Zustand)
- UI: src/components/ui/ (themed components)
- Screens: src/screens/
- Types: src/game/types/

## Code Style
- TypeScript strict mode
- ESLint + Prettier
- 85-90% test coverage
- Path aliases: @/, @types/, @services/, @components/

## Testing
- Jest + React Native Testing Library
- Run: npm test
- Watch: npm run test:watch

## Common Commands
npm start           # Metro bundler
npm run ios         # iOS simulator
npm run android     # Android emulator
npm test            # Run tests
npm run lint        # Check code style
npm run type-check  # TypeScript check

## Next Tasks
1. Complete Epic 1 implementation
2. Build game engine (Epic 2)
3. Setup state management (Epic 3)

## Documentation Links
[Epic 1](../docs/02-user-stories/USER-STORIES-EPIC-01.md)
[Epic 2](../docs/02-user-stories/USER-STORIES-EPIC-02.md)
[Architecture](../docs/01-foundation/ARCHITECTURE-v1.1.md)
```

### **4.3 Създай Session Context за Sprint 1:**

**File:** `golden-chariot-belintash/.cascade/sprint-1-epic-1.md`

```markdown
# Sprint 1: Epic 1 - Project Setup & Infrastructure

## Goal
Complete project setup with all tools configured.

## Stories (6 total)
- [x] 1.1: Initialize React Native Project
- [ ] 1.2: Configure Development Tools
- [ ] 1.3: Setup Testing Framework
- [ ] 1.4: Configure Build System
- [ ] 1.5: Setup CI/CD Pipeline
- [ ] 1.6: Create Development Documentation

## Current Story: 1.2
Configure ESLint, Prettier, Husky.

## Reference
See: USER-STORIES-EPIC-01.md Story 1.2

## Tasks
1. Install ESLint + plugins
2. Configure .eslintrc.js
3. Install Prettier
4. Configure .prettierrc
5. Setup Husky git hooks
6. Test everything works

## Commands
npm run lint
npm run lint:fix
```

### **4.4 Конфигурирай WindSurf BMAD Settings:**

1. **Отвори WindSurf Settings** (Cmd/Ctrl + ,)
2. **Намери BMAD/Cascade Settings**
3. **Enable:**
   - ✅ Auto-load context from .windsurfcontext
   - ✅ Session management
   - ✅ Documentation awareness
   - ✅ Code generation from specs

---

## 🎯 СТЪПКА 5: Първа Разработка с BMAD (30 минути)

### **5.1 Стартирай BMAD Chat в WindSurf:**

```
1. Натисни Cmd+Shift+P (Mac) или Ctrl+Shift+P (Windows)
2. Type: "BMAD: Start Session"
3. Select: "sprint-1-epic-1.md"
```

### **5.2 Пример за първи задачи с BMAD:**

**Task 1: Configure ESLint**

```
💬 Prompt за BMAD:

"Искам да setup-на ESLint за проекта според Epic 1 Story 1.2.

Reference документ: ../docs/02-user-stories/USER-STORIES-EPIC-01.md

Моля:
1. Инсталирай необходимите пакети
2. Създай .eslintrc.js според спецификацията
3. Добави lint scripts в package.json
4. Test че работи

Използвай TypeScript strict mode и React Native best practices."
```

**BMAD ще:**
- Прочете USER-STORIES-EPIC-01.md
- Извлече конфигурацията за ESLint
- Генерира .eslintrc.js файла
- Създаде командите
- Провери че работи

**Task 2: Setup Prettier**

```
💬 Prompt за BMAD:

"Setup Prettier integration с ESLint.

Reference: USER-STORIES-EPIC-01.md Story 1.2

Създай .prettierrc файла с конфигурацията от документа и интегрирай с ESLint."
```

---

## 📚 СТЪПКА 6: Best Practices за BMAD + User Stories (ВАЖНО!)

### **6.1 Как да работиш ефективно с BMAD:**

#### **Pattern 1: Reference-Based Development**

```
✅ ДОБРЕ:
"Implement ScenarioLoader service according to Epic 2 Story 2.2.
Reference: ../docs/02-user-stories/USER-STORIES-EPIC-02.md
Include all methods, validation, and caching as specified."

❌ ЛОШО:
"Create a scenario loader"
(Няма достатъчно контекст)
```

#### **Pattern 2: Incremental Implementation**

```
✅ ДОБРЕ - Стъпка по стъпка:

Session 1: "Create type definitions from Epic 2 Story 2.1"
Session 2: "Create ScenarioLoader from Epic 2 Story 2.2"
Session 3: "Add tests for ScenarioLoader"

❌ ЛОШО - Всичко наведнъж:
"Create entire game engine from Epic 2"
```

#### **Pattern 3: Test-Driven with Docs**

```
✅ ДОБРЕ:
"Create tests for ScenarioLoader according to Epic 2 Story 2.2 testing steps.
Then implement the service to pass the tests."
```

### **6.2 Template за BMAD Prompts:**

```markdown
**Context:**
[Кой epic/story/file]

**Reference:**
[Link към USER-STORIES документ]

**Goal:**
[Какво искаш да постигнеш]

**Specific Requirements:**
[Конкретни изисквания от документа]

**Acceptance Criteria:**
[Copy от story acceptance criteria]

**Please:**
1. [Action 1]
2. [Action 2]
3. Test that it works
```

---

## 🎓 СТЪПКА 7: Работен Процес (Daily Workflow)

### **7.1 Утринен Setup (5 минути):**

```bash
# 1. Отвори проекта
cd ~/Projects/golden-chariot-project/golden-chariot-belintash

# 2. Update dependencies
npm install

# 3. Провери статус
git status
npm test

# 4. Отвори WindSurf
code .  # or windsurf .

# 5. Стартирай Metro
npm start
```

### **7.2 Работен Цикъл за Story (2-4 часа):**

```
1. Прочети Story документа (15 мин)
   - Разбери acceptance criteria
   - Прегледай code examples
   - Note testing requirements

2. План в BMAD (10 мин)
   - Създай task list
   - Define implementation steps
   - Reference documents

3. Implement със BMAD (60-120 мин)
   - Генерирай code step-by-step
   - Test след всяка стъпка
   - Refactor ако трябва

4. Testing (30 мин)
   - Write tests
   - Run test suite
   - Fix issues

5. Review & Commit (15 мин)
   - Code review
   - Git commit
   - Update session notes
```

### **7.3 End of Day (10 минути):**

```bash
# 1. Commit работата
git add .
git commit -m "Epic 1 Story 1.2: ESLint & Prettier setup complete"

# 2. Update session file
# Отбележи какво е done, какво остава

# 3. Push to remote
git push origin main

# 4. Close cleanly
npm test  # final check
```

---

## 📖 СТЪПКА 8: Специфични BMAD Техники

### **8.1 За TypeScript Types (Epic 2):**

```
"Create TypeScript types for Scenario from Epic 2 Story 2.1.

Reference: USER-STORIES-EPIC-02.md

Include:
- All interfaces from the document
- Zod validation schemas
- Type guards
- JSDoc comments

Use strict TypeScript mode."
```

### **8.2 За UI Components (Epic 4):**

```
"Create Button component according to Epic 4 Story 4.1.

Reference: USER-STORIES-EPIC-04.md

Requirements:
- Theme integration
- 4 variants (primary, secondary, ghost, danger)
- 3 sizes (sm, md, lg)
- Loading state
- Disabled state
- Accessibility labels
- TypeScript types

Use the theme system from the same document."
```

### **8.3 За Services (Epic 2-3):**

```
"Implement SaveLoadService according to Epic 3 Story 3.2.

Reference: USER-STORIES-EPIC-03.md

Must include:
- Multiple save slots (3)
- Auto-save functionality
- Validation
- Error handling
- AsyncStorage integration
- Tests with 95%+ coverage

Use Zustand stores from Epic 3 Story 3.1."
```

---

## 🎯 СТЪПКА 9: Sprint 1 Roadmap (Твоята следваща седмица)

### **Day 1-2: Epic 1 Stories 1.1-1.3**
```
✅ 1.1: Project initialized (already done + corrections applied)
⏳ 1.2: ESLint + Prettier + Husky
⏳ 1.3: Jest + Testing Library

BMAD Focus: Configuration files
```

### **Day 3-4: Epic 1 Stories 1.4-1.5**
```
⏳ 1.4: EAS Build setup
⏳ 1.5: GitHub Actions workflows

BMAD Focus: Build configs + CI/CD
```

### **Day 5: Epic 1 Story 1.6 + Polish**
```
⏳ 1.6: Documentation
✅ Test everything
✅ Sprint 1 review

BMAD Focus: Docs + verification
```

### **Day 6-7: Sprint Planning + Start Sprint 2**
```
✅ Review Sprint 1
📝 Plan Sprint 2 (Epics 2-3)
🚀 Start Epic 2 Story 2.1 (Types)
```

---

## 📋 CHECKLIST: Ready to Start?

Провери всичко преди да започнеш:

### **Environment:**
- [ ] Node.js 18/20 installed
- [ ] npm 9/10 installed
- [ ] Git installed
- [ ] Xcode installed (Mac only, for iOS)
- [ ] Android Studio installed (for Android)

### **Project:**
- [ ] Expo project created
- [ ] App runs in simulator
- [ ] Documentation organized in docs/
- [ ] CORRECTIONS-APPLICATION-GUIDE.md ready

### **WindSurf:**
- [ ] WindSurf installed
- [ ] Project opened in WindSurf
- [ ] .windsurfcontext created
- [ ] Session file created (.cascade/)
- [ ] BMAD enabled in settings

### **Knowledge:**
- [ ] Read FOUNDATION-COMPLETE.md
- [ ] Skimmed USER-STORIES-EPIC-01.md
- [ ] Understand Epic 1 goals
- [ ] Know where to find references

---

## 🎊 Готов Си!

Ако всички checkboxes са ✅, можеш да започнеш!

### **Твоят Първи BMAD Command:**

```
Отвори WindSurf Chat и напиши:

"Hi BMAD! I'm starting Sprint 1 for The Golden Chariot of Belintash.

Current Status:
- Epic 1 Story 1.1: Complete (project initialized + corrections applied)
- Next: Story 1.2 (ESLint + Prettier + Husky setup)

Reference: ../docs/02-user-stories/USER-STORIES-EPIC-01.md

Let's configure ESLint according to Story 1.2. 
Please review the story requirements and create the .eslintrc.js file with all necessary rules."
```

**BMAD ще прочете документа и ще започне setup!** 🚀

---

## 💡 Pro Tips

1. **Commit Often:** След всяка working feature
2. **Test Often:** npm test след промени
3. **Reference Docs:** Винаги посочвай USER-STORIES файла
4. **Small Steps:** По-добре 5 малки commits от 1 голям
5. **Use QUICK-REFERENCE.md:** За troubleshooting
6. **Update Session Files:** Track твоя progress

---

## 📞 Ако Нещо Не Работи:

1. Провери QUICK-REFERENCE.md
2. Погледни CORRECTIONS-APPLICATION-GUIDE.md
3. Попитай в chat! 😊

---