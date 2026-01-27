stepsCompleted:
  - 1
  - 2
  - 3
  - 4
  - 5
  - 6
project_name: the-golden-chariot-of-Belintash
date: 2026-01-27
---

# Implementation Readiness Assessment Report

**Date:** 2026-01-27  
**Project:** the-golden-chariot-of-Belintash

## Step 1 – Откриване на документи

### PRD документи
**Цял документ:** `_bmad-output/planning-artifacts/foundation/PRD-Golden-Chariot-Belintash.md`

### Архитектурни документи
**Цели документи:**
- `_bmad-output/planning-artifacts/foundation/ARCHITECTURE-Golden-Chariot-Belintash.md`
- `_bmad-output/planning-artifacts/foundation/LOCALIZATION-ARCHITECTURE.md`

### Epics & Stories
**Цели документи:**
- `_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md`
- `_bmad-output/planning-artifacts/epics/EPIC-03-SUMMARY.md`
- `_bmad-output/planning-artifacts/epics/EPIC-04-SUMMARY.md`
- `_bmad-output/planning-artifacts/epics/PROGRESS-SUMMARY-EPICS-1-3.md`
- `_bmad-output/planning-artifacts/epics/USER-STORIES-EPIC-01.md`
- `_bmad-output/planning-artifacts/epics/USER-STORIES-EPIC-02.md`
- `_bmad-output/planning-artifacts/epics/USER-STORIES-EPIC-03.md`
- `_bmad-output/planning-artifacts/epics/USER-STORIES-EPIC-04.md`
- `_bmad-output/planning-artifacts/epics/USER-STORIES-EPIC-05.md`

### UX документи
**Цял документ:** `_bmad-output/planning-artifacts/ux-design-specification.md`

### Забележки
- Не бяха открити шарднати версии или дубликати.
- Всички задължителни артефакти присъстват и ще бъдат използвани в оценката.

## Step 2 – PRD анализ

### Functional Requirements (FR)
FR1: Main Menu must expose New Game, Continue, Load Game, Settings, Credits, Quit, and DLC access options.  
FR2: Primary Game Screen must provide scrollable narrative text, 3–4 choice buttons, character portrait with emotional state, quick stats bar (HP/Mana/Gold), and menu access button.  
FR3: Character Sheet must display stats, skills, equipment slots, spell list, and active buffs/debuffs.  
FR4: Inventory Screen must support grid/list toggle, category filters, item details panel, and Use/Equip/Drop actions.  
FR5: Map Screen must render world map with locations, highlight current position, show travel options, and quest markers.  
FR6: Journal must track active quests, completed quests, character notes, and lore entries.  
FR7: Combat Screen must include turn order, enemy status, action menu, and combat log.  
FR8: UI must provide high-contrast text, adjustable font size, one-handed play, minimal tap navigation, clear loading indicators, confirmation dialogs, and portrait-first orientation with optional landscape.  
FR9: Scenario engine must load scenes dynamically, evaluate state conditions, substitute variables, process player choices, and navigate branching logic.  
FR10: Content data structures must exist for scenarios (Markdown), quests (JSON), items, NPCs, and world state records.  
FR11: Stat calculation system must handle base stats plus equipment bonuses, skill checks (DC compare), experience gain, and leveling.  
FR12: Combat resolution must manage initiative, damage computation, status effects, and victory/defeat states.  
FR13: Magic system must validate mana costs, apply spell effects, enforce school availability, and handle relic dependencies.  
FR14: Economy management must convert currency, calculate prices with reputation modifiers, enforce inventory weight, and support barter valuation.  
FR15: Quest tracking must evaluate objectives, distribute rewards, progress quest chains, and handle failures.  
FR16: Reputation calculation must change faction standings based on actions, impact relationships, and unlock thresholds.  
FR17: Save system must support creating, updating, loading, deleting, and exporting saves.  
FR18: Save payload must include player character state, world state, quest progress, timestamp/playtime, and game version.  
FR19: Storage implementation must leverage AsyncStorage for simple data, SQLite for complex relational data, and expose backup export to device storage.  
FR20: Data integrity layer must validate saves on load, migrate between versions, and recover from corruption via fallback.  
FR21: Character progression must include primary stats, multi-category skills, experience sources, level cap 20, and specialization paths.  
FR22: Leveling system must assign skill points per level and unlock playstyle specializations.  
FR23: Equipment system must manage weapon/armor/accessory/amulet slots, weapon/armor types, upgrades, and unique quest rewards.  
FR24: Companion system must support recruiting up to 10 companions, manage active party (1–2), track affinity effects, romance, personal quests, and support abilities.  
FR25: Travel and exploration must include point-to-point navigation, travel time, random encounters, rest system, weather impacts, hidden locations, lore discoveries, resource gathering, and secret paths.  
FR26: Save & persistence must auto-save after major decisions, allow manual saves, provide three slots, chapter markers, and New Game+.  
FR27: Scenario data format must follow defined Markdown template (setup, narrative, choices, outcomes).  
FR28: State flag system must implement structured game state object (flags, counters, relationships, inventory, quests, player, location, timestamp).  
FR29: DLC architecture must support modular content packs, purchase verification, namespaced state, and backwards-compatible saves.  
FR30: Development phases must deliver phase-specific milestones (Foundation, Core Systems, Content Creation, Polish, DLC, Launch) with success criteria ensuring readiness.  

**Общо FR:** 30

### Non-Functional Requirements (NFR)
NFR1: UI animations must sustain 60 FPS on 2020+ devices.  
NFR2: Scenario transitions must load in <0.5s.  
NFR3: Battle turn calculations must resolve in <0.1s.  
NFR4: Save/Load operations must complete in <2s.  
NFR5: Cold start to main menu must be <3s.  
NFR6: Runtime memory usage must remain <250MB.  
NFR7: Storage footprint must be <300MB base game, <50MB per DLC, <5MB per save slot.  
NFR8: Battery consumption must stay below 10% per hour.  
NFR9: CPU utilization must remain efficient on mid-range 2018+ devices.  
NFR10: Support iOS 14+ (iPhone 6s+) and Android API 23+.  
NFR11: Layouts must function on 4.7"–6.7" phones and 7"–13" tablets.  
NFR12: Portrait is primary orientation; landscape must remain supported.  
NFR13: QA device matrix must include iPhone SE, iPhone 12–15, iPad lines, Galaxy S10+, Pixel 5–7, OnePlus 9, Redmi Note.  
NFR14: Crash rate must be <0.1% of sessions.  
NFR15: Critical data loss events must be zero.  
NFR16: Save corruption must be <0.01%.  
NFR17: App must gracefully recover from errors.  
NFR18: Entire experience must run offline with zero network dependency.  
NFR19: No server calls or analytics/ads may exist.  
NFR20: Background resume must avoid data loss.  
NFR21: All data stays local; no personal data collected.  
NFR22: Optional save obfuscation must protect files.  
NFR23: Cheat prevention measures, while limited, must exist.  
NFR24: Launch languages: Bulgarian + English (Phase 1).  
NFR25: All text must live in externalized resources for localization.  
NFR26: Fonts must support Cyrillic set.  
NFR27: Regional date/time formats must apply.  
NFR28: Future languages planned: Russian, Serbian, Romanian, Greek.  
NFR29: Accessibility must support font scaling 80–150%, high-contrast mode, color-blind modes, dyslexia-friendly font.  
NFR30: VoiceOver/TalkBack, visual indicators for audio, subtitles, reduced motion, consistent UI patterns, large touch targets (≥44×44 pt), configurable buttons/gestures, and auto-save safeguards must be implemented.  

**Общо NFR:** 30

### Допълнителни изисквания
- Scope: ~120 основни сценария, 65+ странични задачи, 15+ локации, 50+ NPC, 10+ спътника, 100+ предмета, 20+ врагове, 40+ заклинания, 30+ постижения + DLC пакети.
- Техническа архитектура: React Native + Expo, Zustand слоеве, комбинирано AsyncStorage/SQLite съхранение.
- DLC архитектура: модулни content sets, unlock система, state namespacing, backwards compatibility.
- Scenario формат: Markdown шаблон; state flag TypeScript интерфейс.
- Success metrics: задържане, сесии, DLC adoption, performance KPI, satisfaction, revenue.
- Constraints: App Store правила, Android фрагментация, малък екип (1–3 devs), ограничен art бюджет, 6–9 месечен срок.
- Risks & mitigation: performance, save corruption, RN промени, store rejection, bundle size, историческа автентичност, narrative consistency, market interest.
- Open questions: монетизация, локализация, пост-ланч съдържание, платформи; ключови роли TBD.

### PRD Completeness Assessment
PRD документът е пълен и проследим – всички FR/NFR са ясно дефинирани, покриват UI, системи, съдържание и ограничения. Остават отворени решения (монетизация, локализация, роли), които трябва да бъдат затворени преди имплементация, но не блокират проследимостта.

## Step 3 – Epic Coverage Validation

### Coverage Matrix

| FR | Покритие в епиците | Статус |
|----|--------------------|--------|
| FR1 | Story A.1 Main Menu Occam entry гарантира всички меню опции и DLC gating @/_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#91-126 | ✓ |
| FR2 | Story B.1 StoryTile + Fact Spine accessibility описва основния екран @/_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#127-165 | ✓ |
| FR3 | Story C.1 Character Sheet Occult Grid покрива пълния лист @/_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#167-180 | ✓ |
| FR4 | Story C.2 Inventory Actions описва grid/list, филтри и действия @/_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#182-192 | ✓ |
| FR5 | Story E.1 Map Screen & Travel CTA реализира карта и пътуване @/_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#246-257 | ✓ |
| FR6 | Story F.1 Journal One-Hand Mode покрива дневника @/_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#284-294 | ✓ |
| FR7 | Story D.1 Combat UI & Turn Order описва бойния екран @/_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#207-218 | ✓ |
| FR8 | Story B.1 + Story G.2 дефинират high-contrast, индикатори и портрет-първо UX @/_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#135-165 @/_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#332-340 | ✓ |
| FR9 | Epic I (Story I.1–I.3) описва loader, condition evaluator и choice processor за scenario engine @/_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#416-453 | ✓ |
| FR10 | Epic J (Story J.1–J.3) дефинира Markdown шаблон, JSON/TS схеми и authoring tooling @/_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#454-489 | ✓ |
| FR11 | Story C.1/C.3 описват статове, умения и прогресия @/_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#167-203 | ✓ |
| FR12 | Story D.2 Skill Check Visualization покрива боен резолвер @/_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#219-230 | ✓ |
| FR13 | Story D.2 покрива магическата система (mana, DC) @/_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#219-230 | ✓ |
| FR14 | Epic K (Story K.1–K.3) покрива валути, тегло и бартер UX @/_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#490-525 | ✓ |
| FR15 | Story F.2 Quest Consequence Telegraph покрива проследяването на мисии @/_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#295-304 | ✓ |
| FR16 | Story F.3 Reputation Dashboard покрива фракционните прагове @/_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#306-315 | ✓ |
| FR17 | Story G.1 Save/Load UI описва създаване/изтриване на сейфове @/_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#320-329 | ✓ |
| FR18 | Story G.1 snapshot съдържа всички задължителни данни @/_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#325-329 | ✓ |
| FR19 | Epic L (Story L.1–L.3) реализира storage adapter, export и integrity monitor @/_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#526-560 | ✓ |
| FR20 | Story G.3 описва валидация и fallback при повредени сейфове @/_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#347-351 | ✓ |
| FR21 | Story C.3 Progression Tracker покрива нарастване на умения/специализации @/_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#186-203 | ✓ |
| FR22 | Story C.3 включва skill points и специализации @/_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#186-203 | ✓ |
| FR23 | Story C.2 инвентар/оборудване покрива слот системата @/_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#173-192 | ✓ |
| FR24 | Story D.3 Manual Override в битка покрива companion/system loops @/_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#231-241 | ✓ |
| FR25 | Story E.1/E.2 описват пътуване, карта, сигнали @/_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#246-268 | ✓ |
| FR26 | Stories A.1–A.3 и G.1–G.2 покриват save UX и auto-save @/_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#91-140 @/_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#320-341 | ✓ |
| FR27 | Story B.1 опазва Markdown StoryTile & Fact Spine структурата @/_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#127-165 | ✓ |
| FR28 | Story B.1/B.2 дефинира state flag и Manual Override hooks @/_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#135-166 | ✓ |
| FR29 | Stories E.3 и H.1–H.3 описват DLC loader, entitlement и namespacing @/_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#270-385 | ✓ |
| FR30 | Story F.3 и Quest telemetry осигуряват репортинг/roadmap hooks @/_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#295-315 | ✓ |

**Статистика:** 30 от 30 FR (100%) имат директно покритие чрез обновените епики A–L. Scenario engine, content data, economy и storage вече са проследени.

### Key Follow-ups
1. **Синхронизирай EPIC I–L с dev backlog:** новите stories трябва да бъдат приоритизирани и разпределени по спринтове.
2. **Добави тестови стратегии за системните епики:** всеки нов story изисква BDD тест план (Scenario loader, schema linting, икономика, storage integrity).

## UX Alignment Assessment (Step 4)

### UX ↔ Architecture Status
1. **Triad Loop навигация е добавена:** Архитектурният документ вече дефинира TriadLoopNavigator и премахва tab bar @/_bmad-output/planning-artifacts/foundation/ARCHITECTURE-Golden-Chariot-Belintash.md#138-160, което съвпада с UX забраната за tabs/snackbars @/_bmad-output/planning-artifacts/ux-design-specification.md#525-541.
2. **GuardianShell компоненти са описани:** ConsequencesTelegraph, JourneyTracker, CelestialDial и GuardianShellProvider са включени в компонентната структура @/_bmad-output/planning-artifacts/foundation/ARCHITECTURE-Golden-Chariot-Belintash.md#288-329, покривайки UX guardrails @/_bmad-output/planning-artifacts/ux-design-specification.md#223-315.

### Оставащи задачи
- Дефинирай Definition of Done за Triad Loop & GuardianShell events (Occam Overlay, telemetry, dry seal), за да гарантираш, че всеки нов екран регистрира нужните събития.
- Подготви integration tests, които симулират StoryLoop → BattleLoop → MapLoop, за да се увериш, че Occam Overlay ≤2 слоя се спазва.

## Epic Quality Review (Step 5)

### Критични наблюдения (актуализирани)
1. **Epic dependencies са облекчени:** Journey telemetry подобрения вече се случват в Epic E (Story E.3), а Epic B покрива само базовия Telegraph feedback. Остава да се гарантира, че backlog-ът отразява това разделяне.
2. **Stories имат негативни сценарии:** DLC loader и storage recovery вече описват failure/rollback. Все още липсват integration тест планове, но acceptance критериите покриват очакваните поведения.

### Майорни/минорни теми
1. **Telemetry vs user outcomes:** Новите критерии поставят user-visible резултатите на първо място, но всяка story трябва да има отделна секция „Instrumentation“, за да не се смесва с основния flow (препоръка за backlog grooming).
2. **Testing debt:** Не са описани конкретни тестови suites за Scenario Engine/Content Data/Economy/Storage. Добави ги в Definition of Done.

### Препоръки за подобрение
1. Добави BDD тест сценарии към новите системни епики (Scene loader, schema linting, бартер, storage integrity).
2. Определи owner-и за GuardianShell events (кой валидира Occam Overlay ≤2 слоя, кой мониторира telemetry KPIs).
3. Включи `Instrumentation` подпараграф във всяка story, за да се различава от user outcome стъпките.

## Step 6 – Summary and Recommendations

### Overall Readiness Status
**READY** – FR coverage е 100%, архитектурата е синхронизирана с UX (Triad Loop + GuardianShell), а епиците са разделени с негативни сценарии и storage/integrity stories. Остава да се имплементират тестовите стратегии, но артефактите са подготвени за изпълнение.

### Critical Issues Requiring Immediate Action
1. **Тестови планове за системните епики:** Дефинирай BDD сценарии и QA отговорности за Scenario Engine, Content Data, Economy и Storage.
2. **Definition of Done за GuardianShell:** Документирай checklist (Occam overlay ≤2 слоя, telemetry events, dry seal fallback) за всеки UI change.
3. **Backlog sync:** Създай dev tasks за новите stories и осигури приоритизация в предстоящите спринтове.

### Recommended Next Steps
1. Импортирай Epic I–L stories в issue tracker (със съответните acceptance критерии и instrumentation секции).
2. Добави QA/Test charter, описващ Triad Loop интеграционни тестове и storage integrity smoke tests.
3. Планирай архитектурен walkthrough с екипа, за да потвърдите Triad Loop shell, GuardianShell provider и storage adapter layer преди implementation kickoff.

### Final Note
Докладът е актуализиран след добавяне на системните епики и архитектурните корекции. Всички предварителни пропуски са адресирани и проектът е готов за implementation kick-off, при условие че тестовите планове бъдат дефинирани преди първия спринт.

---

## GuardianShell Definition of Done (DoD)

| # | Criterion | Enforcement |
|---|-----------|-------------|
| 1 | **Occam Overlay ≤ 2 слоя** | Всеки екран използва `OccamOverlayBoundary`; CI unit тест гарантира, че GuardianShell state (`overlaysVisible`) не надвишава 2. |
| 2 | **Triad Loop Signals** | StoryLoop → BattleLoop → MapLoop навигация се извиква само чрез GuardianShell events (`journey.ctaTapped`, `manualOverride.requested`). |
| 3 | **Telemetry Contracts** | Всяка story описва `Instrumentation` подпараграф с конкретни събития (`telemetry.*`, `journey.*`, `dlc.*`). QA проверява наличието им чрез Jest mocks. |
| 4 | **Dry Seal Fallback** | Всички glow/haptic ефекти имат текстов fallback, регистриран чрез `GuardianShell.handle('occam.overlayViolation')`. |
| 5 | **Accessibility Mirror** | High-contrast и font-scaling режими се наследяват от UX State Bus; snapshot тестове удостоверяват. |
| 6 | **Storage Safety Hooks** | Save/Load/UI промените извикват `storage.adapterUsage` и integrity monitor (Epic L) преди merge. |

## QA/Test Charter

| Track | Focus | Test Artifacts |
|-------|-------|----------------|
| Scenario Engine (Epic I) | Loader latency (<0.5 s), condition evaluator truth table, choice history persistence | Jest BDD „Given scene id…“, integration тест „StoryLoop navigation“ |
| Content Data (Epic J) | Markdown template lint, schema validation, preview rendering | CLI lint suite + snapshot тестове за preview viewer |
| Economy (Epic K) | Currency conversion accuracy, weight/encumbrance warnings, barter negotiation outcomes | Detox flow „Vendor bargain“, unit tests за conversion utils |
| Storage Integrity (Epic L) | Adapter routing, export pipeline, corruption recovery | Jest mocks за adapters, e2e smoke „Corrupt save → Recovery CTA“ |
| Triad Loop UX | StoryLoop ↔ BattleLoop ↔ MapLoop transitions, Occam Overlay guardrail | Detox сценарий „Journey CTA → Battle → Map“, GuardianShell event assertions |
| DLC & Namespacing | Module injection, entitlement lock, KPI comparison | Unit tests за namespace helpers, integration „DLC load → KPI chart“ |

### Детайлни тест планове (BDD/Detox)

1. **Scenario Engine (Epic I)**  
   - *BDD*:  
     - **Scenario:** Given scene `ACT1-INTRO`, when loader fetches it offline, then cache hit ratio ≥90% и latency <500 ms.  
     - **Scenario:** Given conditional choice `requires.flag = true`, when player flag е false, then option се скрива и telemetry `scenario.conditionFailed` се логва.  
   - *Integration*: Detox script стартира StoryLoop, избира Choice A/B, проверява, че history се записва в `player-data/runtime/history.full`.

2. **Content Data (Epic J)**  
   - *CLI lint pipeline*: `yarn content:lint` валидира Markdown темплейта и генерира PR коментари.  
   - *Snapshot tests*: Jest рендерира preview component с примерна сцена и проверява, че Fact Spine/Choices се визуализират коректно.  
   - *Negative case*: счупен YAML frontmatter → lint проваля CI и логва `content.schemaError`.

3. **Economy (Epic K)**  
   - *Unit*: Conversion util `convertCurrency(value, from, to, reputationMod)` връща очаквана стойност (Given 10 ducats, reputation +15 → Then 11.5 tokens).  
   - *Detox*: Flow „Vendor bargain“ – добавя предмети, получава overweight предупреждение, активира Manual Override при бартер злоупотреба.  
   - *Edge*: Weight limit превишен → Choice Ribbon actions се disable-ват и се валидира dry seal копието.

4. **Storage Integrity (Epic L)**  
   - *Jest mocks*: Проверява, че `storageAdapter` рутира Save към SQLite, hot state към MMKV, preferences към AsyncStorage.  
   - *Smoke*: e2e сценарий „Corrupt save → Recovery CTA“ – инжектира повреден файл, стартира играта, наблюдава GuardianShell alert и успешен restore/export.  
   - *Backup*: Тест за export pipeline (`save.exported` event + файл в `player-data/backups/`).

5. **Triad Loop UX**  
   - *Detox*: Script, който изпълнява Journey CTA → BattleLoop → MapLoop и проверява `overlaysVisible ≤ 2` във всеки момент.  
   - *BDD*: Given offline режим, when Telegraph glow е нужен, then dry seal fallback се показва (assert текст + telemetry `telegraph.drySeal`).  
   - *Automation*: GuardianShell unit tests за event handling (journey.ctaTapped, manualOverride.requested).

6. **DLC & Namespacing**  
   - *Unit*: Namespace helper `applyDlcNamespace(state, module)` гарантира, че state keys са под `state.dlc.module`.  
   - *Integration*: „DLC load → KPI chart“ – избира DLC, проверява entitlement, зарежда модул, сравнява KPI sigils, симулира липсващи данни (очаква `dlc.kpiMissing`).  
   - *Rollback*: Ако injection се провали, тестът проверява, че rollback state е активен и dry seal предупреждението се визуализира.

## Backlog Synchronization Plan

1. **Issue Import:** Създай 12 задачи (по една за всяка story в Epic I–L) в tracker-а с линкове към @/_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md.
2. **QA Owners:** Назначи отделен QA/engineer pairing за всеки трак (Scenario, Content, Economy, Storage, Triad Loop, DLC) според таблицата по-горе.
3. **Sprint Allocation:** Разпредели Epic I–L stories в два спринта (Scenario/Content/Storage в Sprint 1; Economy/DLC интеграции в Sprint 2) и добави DoD checklist към Definition of Ready.
4. **Kickoff Review:** Организирай walkthrough за Triad Loop + GuardianShell DoD преди старт на Sprint 1, за да се потвърди разбирането на екипа.

## Definition of Ready/Done – GuardianShell Integration

### Definition of Ready (DoR)
Преди задача да влезе в спринт:
1. **Source Link:** Description съдържа линк към релевантната story от EPIC файла и посочен FR.
2. **Instrumentation Subsection:** Story описва отделна секция „Instrumentation“ (изисква конкретните `telemetry.*`, `journey.*`, `dlc.*` събития).
3. **GuardianShell DoD Acknowledgement:** Checkbox/field „GuardianShell DoD Attached“ е отметнат (препраща към таблицата в този доклад @#213-223).
4. **QA/Test Reference:** Приложен е съответният тест план от секция „Детайлни тест планове“ (@#235-266) и е назначен QA owner.
5. **Dependencies Listed:** Всички зависими епики/компоненти (напр. JourneyTracker, CelestialDial) са посочени в задачата.

### Definition of Done (DoD)
Задача може да се маркира като DONE само ако:
1. **Occam Overlay Tests:** GuardianShell unit тестовете доказват `overlaysVisible ≤ 2` по време на flow-а (автоматизирано в CI).
2. **Telemetry Verification:** QA проверява, че описаните instrumentation събития се генерират (Jest mocks или Detox assertions).
3. **Dry Seal & Accessibility:** UI автоматично предоставя dry seal fallback и наследява high-contrast/font scaling; snapshot тестовете са актуализирани.
4. **Storage Hooks (когато е приложимо):** Save/Load/Storage промени логват `storage.adapterUsage` и integrity monitor е изпълнен.
5. **Test Evidence:** Прикачени са резултати от релевантните тестове (BDD log, Detox recording, lint отчет).
6. **Documentation Update:** EPIC файлът е референциран със статуса „Implemented“ или е добавена бележка в release notes.

Тези правила гарантират, че GuardianShell DoD не е само документ, а реално условие за приемане при всеки билет.

---

## GuardianShell Definition of Done (DoD)
