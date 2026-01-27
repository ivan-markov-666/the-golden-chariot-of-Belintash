---
stepsCompleted:
  - 1
  - 2
  - 3
inputDocuments:
  - planning-artifacts/foundation/PRD-Golden-Chariot-Belintash.md
  - planning-artifacts/foundation/ARCHITECTURE-Golden-Chariot-Belintash.md
  - planning-artifacts/ux-design-specification.md
---

# the-golden-chariot-of-Belintash - Epic Breakdown

## Overview
Този документ трансформира PRD, Architecture и UX design artefact-ите в user-value епики и stories с приключващи acceptance критерии (Given/When/Then), готови за разработка.

## Requirements Inventory

### Functional Requirements
FR1: Main Menu exposing New Game, Continue, Load Game, Settings, Credits, Quit, DLC access.  
FR2: Primary Game Screen with scrollable narrative, 3–4 choices, portrait, quick stats, menu access.  
FR3: Character Sheet displaying stats, skills, equipment slots, spells, buffs/debuffs.  
FR4: Inventory grid/list with filters, item detail panel, Use/Equip/Drop actions.  
FR5: Map Screen rendering world map, current position, travel options, quest markers.  
FR6: Journal tracking active/completed quests, notes, lore entries.  
FR7: Combat Screen with turn order, enemy status, action menu, combat log.  
FR8: Accessibility – high contrast, adjustable font size, one-handed play, minimal taps, loading indicators, confirmations, portrait-first.  
FR9: Scenario engine loading scenes, evaluating conditions, substituting variables, processing choices, branching.  
FR10: Content data structures for scenarios (MD), quests (JSON), items, NPCs, world state.  
FR11: Stat calculation system with equipment bonuses, skill checks, XP, leveling.  
FR12: Combat resolution with initiative, damage, status effects, victory/defeat.  
FR13: Magic system validating mana, applying effects, enforcing schools, relic dependencies.  
FR14: Economy management (currency conversion, pricing modifiers, inventory weight, barter).  
FR15: Quest tracking (objectives, rewards, chains, failures).  
FR16: Reputation calculations impacting factions, relationships, unlock thresholds.  
FR17: Save system operations (create/update/load/delete/export).  
FR18: Save payload contents (player, world, quests, timestamp/playtime, version).  
FR19: Storage implementation (AsyncStorage, SQLite, backup export).  
FR20: Data integrity (validation, migration, corruption recovery).  
FR21: Character progression (stats, multi-category skills, XP sources, level cap 20, paths).  
FR22: Leveling system (skill points per level, specializations).  
FR23: Equipment system (slots, requirements, upgrades, quest rewards).  
FR24: Companion system (recruitment, management, combat roles, quests, affinity/romance).  
FR25: Travel/exploration (navigation, travel time, encounters, rest, weather, discoveries).  
FR26: Save & persistence UX (auto-save, manual slots, indicators, New Game+).  
FR27: Scenario data format template (Markdown).  
FR28: State flag architecture (flags, counters, relationships, inventory, quests, player, location, timestamp).  
FR29: DLC modular architecture (packs, unlocks, namespacing, backward-compatible saves).  
FR30: Development phases with deliverables and success criteria.

### NonFunctional Requirements
NFR1: UI animations sustain 60 FPS on 2020+ devices.  
NFR2: Scenario transitions load in <0.5s.  
NFR3: Battle turn calculations resolve in <0.1s.  
NFR4: Save/Load operations complete in <2s.  
NFR5: Cold start to main menu <3s.  
NFR6: Runtime memory usage <250MB.  
NFR7: Storage footprint <300MB base, <50MB per DLC, <5MB per save slot.  
NFR8: Battery consumption <10% per hour.  
NFR9: Efficient CPU utilization on mid-range 2018+ devices.  
NFR10: Support iOS 14+/Android API 23+.  
NFR11: Layouts support 4.7"–6.7" phones and 7"–13" tablets.  
NFR12: Portrait primary; landscape optional.  
NFR13: QA device matrix (iPhone SE/12–15, iPad lines, Galaxy S10+, Pixel 5–7, OnePlus 9, Redmi Note).  
NFR14: Crash rate <0.1% sessions.  
NFR15: Zero critical data-loss events.  
NFR16: Save corruption <0.01%.  
NFR17: Graceful error recovery.  
NFR18: Offline-first (zero network dependency).  
NFR19: No server calls/analytics/ads.  
NFR20: Background resume without data loss.  
NFR21: All data local; no personal data collection.  
NFR22: Optional save obfuscation.  
NFR23: Cheat-prevention measures (basic).  
NFR24: Launch languages BG + EN.  
NFR25: All copy externalized for localization.  
NFR26: Fonts support Cyrillic.  
NFR27: Regional date/time formats.  
NFR28: Planned locales RU/SR/RO/GR.  
NFR29: Accessibility features (font scaling 80–150%, high contrast, color-blind, dyslexia font).  
NFR30: VoiceOver/TalkBack, audio indicators, subtitles, reduced motion, large touch targets (≥44×44 pt), configurable buttons/gestures, auto-save safeguards.

### Additional Requirements
- Architecture mandates React Native + Expo, Zustand state, AsyncStorage + SQLite split, GuardianShell/UX State Bus layer.  
- UX design (Occult Scriptorium DS) enforces Occam Overlay Rule, Manual Override cadence, Journey tracker + telemetry KPIs, dry seal fallback.  
- DLC modules must be namespaced and lazily loaded; saves remain backward-compatible.  
- Performance guardrails (≤16 ms frame budget, <350 MB asset budget) and offline resilience are mandatory.  
- Accessibility requirements include high-contrast (Ascetic Runes), one-handed ergonomics, haptic/audio fallbacks, global loading indicators.

### FR Coverage Map
FR1: Epic A – Main Menu Occam Entry & Save Slots.  
FR2: Epic B – StoryTile accessibility.  
FR3: Epic C – Character Sheet Occult Grid.  
FR4: Epic C – Inventory Actions & Telemetry.  
FR5: Epic E – Map Screen & Travel CTA.  
FR6: Epic F – Journal One-Hand Mode.  
FR7: Epic D – Combat UI Docking.  
FR8: Epic B/C – High contrast, one-handed layouts, global indicators.  
FR9: Epic B – Consequences Telegraph orchestration.  
FR10: Epic C/F – Data structures surfaced in UI.  
FR11: Epic C – Progression Tracker.  
FR12: Epic D – Skill check visualization.  
FR13: Epic D – Manual Override cadence в combat.  
FR14: Epic C – Inventory telemetry (economy hooks).  
FR15: Epic F – Quest consequence telegraph.  
FR16: Epic F – Reputation dashboard.  
FR17: Epic G – Save/Load UI GWT.  
FR18: Epic G – Snapshot payload.  
FR19: Epic G/H – Storage/export + DLC namespacing.  
FR20: Epic G – Corruption recovery loop.  
FR21: Epic C – Character progression reminders.  
FR22: Epic C – Specialization Witness Voice.  
FR23: Epic C – Equipment telemetry.  
FR24: Epic D – Manual Override companion support.  
FR25: Epic E – Travel & Journey tracker.  
FR26: Epic A/G – Save UX + indicators.  
FR27: Epic B – Scenario template enforcement.  
FR28: Epic B – UX State Bus flag sync.  
FR29: Epic E/H – DLC loader & selector.  
FR30: Epic F/H – Roadmap hooks & KPI comparison.

## Epic List
- **Epic A – Вход към хрониката:** Играчът стартира, управлява save слотове и преминава storyteller onboarding с Occam guardrails.  
- **Epic B – Прочети → избери → усети последствията:** StoryTile, Choice Ribbon и Consequences Telegraph с висок достъп и telemetry.  
- **Epic C – Управлявай героя си:** Character Sheet, Inventory, Progression в Occult Grid с Witness Voice напомняния.  
- **Epic D – Първата битка и Manual Override:** Combat UI, skill checks и recovery loop без нарушаване на Occam Rule.  
- **Epic E – Пътуване, карта и DLC сигили:** Map, Journey tracker KPI sigils и DLC loader.  
- **Epic F – Мисии, репутации и Witness Voice:** Journal compact режим, последици и репутации.  
- **Epic G – Запази и възстанови съдбата си:** Save/Load, auto-save индикатори и corruption recovery.  
- **Epic H – Допълнителни хроники (DLC):** Selector, namespaced state, telemetry сравнения.

## Epic A: Вход към хрониката (FR1, FR26)
Играчът може да отвори главното меню, да избере save слот и да получи storyteller onboarding без да нарушава Occam Overlay guardrails.

### Story A.1: Main Menu Occam Entry
As a returning player,
I want да виждам всички основни опции (New Game, Continue, Load, Settings, Credits, Quit, DLC),
So that мога да започна правилния ритуал без излишни екрани.

**Acceptance Criteria:**
**Given** приложението е стартирано и UX State Bus има `overlaysVisible = 0`
**When** отворя главното меню
**Then** се показват точно два слоя (Occam Rule)
**And** всяка опция има storyteller tooltip
**And** DLC опциите се заключват при липсващ entitlement (telemetry `menu.dlcLocked`)

### Story A.2: Save Slot Selection & Sync
As a хроникьор,
I want да избирам между три save слота + New Game+,
So that управлявам прогреса безопасно.

**Acceptance Criteria:**
**Given** имам ≥1 save
**When** избера слот
**Then** overlay показва timestamp/playtime/DLC flags без Occam нарушение
**And** при повреден слот dry seal fallback + GuardianShell `manualOverride.requested`
**And** save/auto-save индикаторите остават в one-handed reach (≤48 px)

### Story A.3: Storyteller Onboarding
As a нов играч,
I want ритуалът да ми покаже Manual Override, Journey tracker и Witness Voice,
So that разбирам guardrails от първата сцена.

**Acceptance Criteria:**
**Given** започвам New Game
**When** завърша първия параграф
**Then** Consequences Telegraph показва интерактивно обяснение (≤2 s glow)
**And** Journey tracker подсказва KPI sigil + dry seal fallback
**And** при две пропуски GuardianShell записва `witnessVoice.reminder`

## Epic B: Прочети → избери → усети последствията (FR2, FR8, FR9, FR27, FR28)
Играчът чете първата хроника, прави избори и вижда Consequences Telegraph със всички UX guardrails.

### Story B.1: StoryTile & Fact Spine Accessibility
As a story-driven player,
I want high-contrast StoryTile и Fact Spine с adjustable fonts,
So that чета без усилие.

**Acceptance Criteria:**
**Given** активирам high-contrast
**When** StoryTile се рендерира
**Then** Ascetic Runes тема се прилага и GuardianShell изпраща `accessibility.changed`
**And** 150% font запазва ≤420 px ширина (one-handed)
**And** Fact Spine се свива/разгъва с long-press без нарушение на Occam Rule

### Story B.2: Choice Ribbon с Manual Override
As a играч,
I want изборите да показват skill checks и Manual Override предупреждения,
So that усещам последствията.

**Acceptance Criteria:**
**Given** имам избори A–D
**When** задържа опция
**Then** micro overlay (≤2 слоя) + telemetry `choice.preview`
**And** при достигнат threshold CTA „Върни ритуала“ се активира с dry seal вибрация
**And** skill check визуализация записва roll + модификатор + outcome

### Story B.3: Consequences Telegraph & Journey Tracker Sync
As a telemetry guardian,
I want Telegraph и Journey tracker да работят синхронно,
So that последствията и DLC куки са ясни.

**Acceptance Criteria:**
**Given** CTR < 60%
**When** следващият избор се появи
**Then** GuardianShell активира glow pulse и telemetry `telemetry.gaugeLow`
**And** Journey tracker показва condensed recap CTA (one-handed)
**And** offline режим → dry seal текст + `telegraph.drySeal`

## Epic C: Управлявай героя си (FR3, FR4, FR11, FR21–23)
Играчът разглежда Character Sheet, Inventory и Progression в Occult Grid layout.

### Story C.1: Character Sheet Occult Grid
As a strategist,
I want всички stats/buffs във втори слой,
So that StoryTile остава docked.

**Acceptance Criteria:**
**Given** UX State Bus `overlaysVisible = 1`
**When** отворя Character Sheet
**Then** Occam Rule се спазва, high-contrast се наследява, telemetry `characterSheet.opened` записва тема/шрифт.

### Story C.2: Inventory Actions & Telemetry
As a scavenger,
I want Use/Equip/Drop с minimal taps,
So that решенията са проследими.

**Acceptance Criteria:**
**Given** държа предмет
**When** избера Equip
**Then** GuardianShell валидира weight/requirements и изпраща `telemetry.inventoryChange`
**And** grid view запазва one-handed reach
**And** Manual Override предупреждава при overweight (dry seal + tooltip)

### Story C.3: Progression Tracker & Witness Voice
As a lore fan,
I want Witness Voice напомняния за специализации и companion реакции,
So that планирам развитието.

**Acceptance Criteria:**
**Given** достигна 5 ниво
**When** отворя progression таба
**Then** Witness Voice карта показва следващ ритуал + KPI (CTR ≥45%)
**And** при companion affinity Journey tracker записва „Companion reacted“ + GuardianShell `telemetry.gaugeLow` ако CTA се игнорира два пъти

## Epic D: Първата битка и Manual Override (FR7, FR12, FR13, FR24)
Играчът участва в битка с skill checks, Manual Override и dry seal fallback.

### Story D.1: Combat UI & Turn Order Docking
As a tactician,
I want turn order/action ribbon без да скриват StoryTile.

**Acceptance Criteria:**
**Given** combat state
**When** UI се зареди
**Then** StoryTile се свива до 40%, combat панелът е втория слой, telemetry `combat.turnStart` включва Journey CTA.

### Story D.2: Skill Check Visualization
As a player,
I want d20 анимация + DC сравнение,
So that битката е прозрачна.

**Acceptance Criteria:**
**Given** skill check
**When** действието се изпълни
**Then** показва roll+modifier+DC (<2 s), GuardianShell `combat.skillCheck`, critical → Witness Voice copy, high-contrast → outline вместо glow.

### Story D.3: Manual Override Recovery Loop
As a ritual keeper,
I want CTA „Върни ритуала“ в combat,
So that поправям грешки.

**Acceptance Criteria:**
**Given** пропусна ритуал
**When** GuardianShell засече нарушението
**Then** CTA се появява под action ribbon (<1 слой)
**And** при три отказа Journey tracker записва „Жрецът настоява…" + telemetry `manualOverride.failed`
**And** offline → dry seal текст + двоен хаптик

## Epic E: Пътуване, карта и DLC сигили (FR5, FR25, FR29)
Играчът използва карта, пътува между локации и вижда DLC куки.

### Story E.1: Map Screen & Travel CTA
As a wanderer,
I want интерактивна карта с one-tap travel,
So that пътуванията са ясни.

**Acceptance Criteria:**
**Given** map overlay
**When** избера локация
**Then** Celestial Dial показва маршрут (≤1 слой) + telemetry `map.travelSelected`
**And** трансitions >0.5 s → global loading indicator

### Story E.2: Journey Tracker KPI Sigils
As a storyteller analyst,
I want KPI sigils и DLC hook-ове,
So that проследявам CTR/engagement.

**Acceptance Criteria:**
**Given** CTR <45%
**When** tracker се обнови
**Then** KPI pulse (≤2 s) + telemetry `journey.sigils`
**And** DLC hook остава в one-handed reach; offline → dry seal tooltip

### Story E.3: DLC Module Loader
As a DLC curator,
I want модули да се зареждат namespaced,
So that основната хроника остава стабилна.

**Acceptance Criteria:**
**Given** избран DLC
**When** entitlement е валиден
**Then** loader инжектира сцени в namespaced state + telemetry `dlc.loaded`
**And** липса на entitlement → storyteller copy „Ритуалът предстои“ + `dlc.locked`

## Epic F: Мисии, репутации и Witness Voice (FR6, FR15, FR16, FR30)
Играчът управлява journal, последствия и репутации с storyteller guidance.

### Story F.1: Journal One-Hand Mode
As a quest tracker,
I want компактно journal UI,
So that browsвам с една ръка.

**Acceptance Criteria:**
**Given** compact режим
**When** отворя Journal
**Then** списъкът е ≤420 px, филтрите swipeable, telemetry `journal.view`, high-contrast се наследява.

### Story F.2: Quest Consequence Telegraph
As a consequence guardian,
I want Telegraph в journal entries,
So that виждам кого докосва мисията.

**Acceptance Criteria:**
**Given** мисия завърши
**When** отворя entry
**Then** Telegraph показва NPC/фракции + KPI sigil, telemetry `journal.telegraph`
**And** критична мисия – Manual Override CTA + dry seal предупреждение

### Story F.3: Reputation Dashboard
As a faction diplomat,
I want да виждам репутации и прагове,
So that планирам действията си.

**Acceptance Criteria:**
**Given** репутация се промени
**When** отворя dashboard
**Then** Journey tracker записва „Factions shift“, GuardianShell показва storyteller copy, telemetry `reputation.threshold`

## Epic G: Запази и възстанови съдбата си (FR17–20, FR26)
Играчът управлява save/load, auto-save индикатори и corruption recovery.

### Story G.1: Save/Load UI GWT
As a meticulous player,
I want ясни acceptance стъпки,
So that QA валидира процеса.

**Acceptance Criteria:**
**Given** избера Save
**When** потвърдя
**Then** snapshot включва player/world/quests/timestamp + telemetry `save.completed`
**And** storage full → dry seal предупреждение + Manual Override CTA

### Story G.2: Auto-Save & Loading Indicators
As a UX guardian,
I want глобален индикатор при auto-save,
So that играчът знае, че прогресът е защитен.

**Acceptance Criteria:**
**Given** auto-save trigger
**When** записът стартира
**Then** глобален loading indicator + telemetry `autosave.start`
**And** успех → indicator off <2s; failure → dry seal fallback

### Story G.3: Corruption Recovery Loop
As a ritual restorer,
I want системата да възстановява save файлове,
So that не губим прогрес.

**Acceptance Criteria:**
**Given** save е повреден
**When** избера „Възстанови“
**Then** GuardianShell зарежда последния auto-save + `manualOverride.requested`
**And** провал → Journey tracker „Жрецът настоява...“ + telemetry `save.recoveryFailed`

## Epic H: Допълнителни хроники (DLC) (FR29, FR30)
Играчът отключва и играе DLC съдържание без да нарушава основната хроника.

### Story H.1: DLC Selector & Entitlements
As a collector,
I want да виждам кои DLC са налични и заключени,
So that планирам приключенията си.

**Acceptance Criteria:**
**Given** отворя selector
**When** entitlement липсва
**Then** storyteller copy „Ритуалът предстои“ + CTA „Научи повече“ (без покупки) + telemetry `dlc.locked`
**And** наличните DLC зареждат съдържание в namespaced state (Occam Rule)

### Story H.2: DLC State Namespacing
As a developer,
I want DLC state да е изолиран,
So that основната хроника не се поврежда.

**Acceptance Criteria:**
**Given** стартирал DLC
**When** събитие променя state
**Then** записът се записва в `state.dlc.{module}` + telemetry `dlc.stateChange`
**And** save/export показват явна граница

### Story H.3: DLC Telemetry Comparison
As a product owner,
I want да сравня KPI между основната кампания и DLC,
So that измервам Adoption.

**Acceptance Criteria:**
**Given** играчът завърши DLC сцена
**When** Journey tracker се обнови
**Then** KPI sigils сравняват CTR/Completion + telemetry `dlc.kpi`
**And** Witness Voice записва storyteller бележка „Нов извор бе овладян"
