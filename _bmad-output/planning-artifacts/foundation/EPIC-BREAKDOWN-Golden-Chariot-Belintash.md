---
status: ready
sourceWorkflow: create-epics-and-stories
archivedVersion: planning-artifacts/foundation/archive/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md
notes:
  - Rebuilt на 2026-01-27 след изпълнение на Step 2/3 от create-epics-and-stories
  - Подготвен за Implementation Readiness Step 3–5
---

# Epic Breakdown – UI/UX Delivery Track

Този документ описва дванадесет епика (A–L). Първите осем са user-value/UI епики, които реализират UX guardrails (Occam Overlay, Consequences Telegraph, Manual Override, Journey Tracker, GuardianShell/UX State Bus). Последните четири са системни епики, покриващи Scenario Engine, Content Data Backbone, Economy и Storage Integrity, за да постигнем 100% FR проследимост. Всички stories са в Given/When/Then формат и са готови за Implementation Readiness Step 3.

## Workflow Checklist
| Step | Description | Status |
|------|-------------|--------|
| 1 | Validate prerequisites & extract FR/NFR | ✅ (PRD анализ 2026-01-27) |
| 2 | Design new user-value epics | ✅ Completed (Epic A–H) |
| 3 | Create stories with G/W/T ACs | ✅ Completed (Stories A.1–H.3) |
| 4 | Final validation | ⏳ Pending |

## Traceability Overview

| Epic | User outcome | Основни FR/NFR | UX guardrails |
|------|--------------|----------------|---------------|
| A – Вход към хрониката | Играчът стартира хрониката и управлява save слотове | FR1, FR26 | Occam Overlay, Witness Voice onboarding |
| B – Прочети → избери → усети последствията | StoryTile + Choice Ribbon + Telegraph | FR2, FR8, FR27, FR28 | Consequences Telegraph, Manual Override, Journey KPIs |
| C – Управлявай героя си | Character Sheet, Inventory, Progression | FR3, FR4, FR11, FR21–23 | UX State Bus tokens, one-handed layouts |
| D – Първата битка и Manual Override | Combat UI, skill checks, companion support | FR7, FR12, FR13, FR24 | Manual Override ritual, dry seal fallback |
| E – Пътуване, карта и DLC сигили | Map screen, travel, DLC loader | FR5, FR25, FR29 | Celestial Dial, Journey tracker sigils |
| F – Мисии, репутации и Witness Voice | Journal, quest consequences, reputation | FR6, FR15, FR16, FR30 | Telegraph in journal, Witness Voice reminders |
| G – Запази и възстанови съдбата си | Save/Load UX, auto-save, corruption recovery | FR17–20, FR26 | GuardianShell alerts, global loading indicators |
| H – Допълнителни хроники (DLC) | DLC selection, namespaced state, KPIs | FR29, FR30 | Occam Overlay enforcement, KPI comparison |
| I – Сценарен енджин | Сцените се зареждат, валидират условия и насочват клони | FR9 | Scenario telemetry, Occam overlay adherence |
| J – Content Data Backbone | Markdown/JSON структури за всички ресурси | FR10 | Fact Spine schema validation, UX State Bus flags |
| K – Икономика и търговия | Играчът търгува, усеща тегло и бартер поведение | FR14 | Inventory weight cues, GuardianShell risk prompts |
| L – Съхранение и интегритет | AsyncStorage/SQLite/MMKV реализират storage split | FR19 | Global loading indicators, dry seal fallback |

Допълнителни изисквания: всички епики наследяват NFR1–NFR30 (performance, offline режим, high-contrast, font scaling, device matrix). Acceptance критериите адресират telemetry hooks `telemetry.*`, `manualOverride.*`, `journey.*`, `dlc.*`, осигурявайки проследимост към UX State Bus.

## Epic List (upcoming)
Следващата структура (A–L) е подготвена за изпълнение на Step 2/3 и ще бъде разширена със stories + ACs:

1. **Epic A – Вход към хрониката** (FR1, FR26)  
   *Играчът може да стартира играта, да управлява save-слотове и да получи storyteller onboarding.*  
   - Main Menu с DLC gating и Occam Overlay guardrails  
   - Save slot избор + Witness Voice синхронизация  
   - Onboarding сцена с Manual Override инструкции

2. **Epic B – Прочети → избери → усети последствията** (FR2, FR8, FR27, FR28)  
   *Играчът чете първата хроника, прави избори и вижда Consequences Telegraph.*  
   - StoryTile + Fact Spine с high-contrast режим  
   - Choice Ribbon с Manual Override cadence  
   - Base telemetry gauge (Journey hooks се развиват в Epic E)

3. **Epic C – Управлявай героя си** (FR3, FR4, FR11, FR21–23)  
   *Играчът разглежда Character Sheet, Inventory и Equipment в Occult Grid layout.*  
   - Character Sheet с UX State Bus tokens  
   - Inventory actions (Use/Equip/Drop) + minimal taps  
   - Equipment & progression telemetry (Witness Voice reminders)

4. **Epic D – Първата битка и Manual Override** (FR7, FR12, FR13, FR24)  
   *Играчът участва в битка, вижда skill checks, Manual Override и dry seal fallback.*  
   - Combat UI (turn order, action ribbon)  
   - Skill check визуализация + telemetry CTR  
   - Manual Override recovery loop + haptics

5. **Epic E – Пътуване, карта и DLC сигили** (FR5, FR25, FR29)  
   *Играчът използва картата, планира пътувания и вижда DLC куки в Journey tracker.*  
   - Map screen layout (Occult Grid)  
   - Travel CTA + Celestial Dial маршрути  
   - Journey tracker KPI sigils и DLC module loader

6. **Epic F – Мисии, репутации и Witness Voice** (FR6, FR15, FR16, FR30)  
   *Играчът управлява journal, последствия и репутации с storyteller guidance.*  
   - Journal + lore entries с едноръчен режим  
   - Quest consequence telegraph  
   - Reputation thresholds и KPI telemetry

7. **Epic G – Запази и възстанови съдбата си** (FR17–20, FR26)  
   *Играчът съхранява прогрес, възстановява го и получава сигнали при риск.*  
   - Save/Load UI с Given/When/Then ACs  
   - Auto-save checkpoints + global loading indicators  
   - Recovery CTA + integrity telemetry separation

8. **Epic H – Допълнителни хроники (DLC)** (FR29, FR30)  
   *Играчът отключва и играе DLC съдържание без да нарушава основната хроника.*  
   - DLC selector + entitlement checks  
   - Modular content loader (Occam Overlay съвместим)  
   - Namespaced save slots + telemetry сравнение

9. **Epic I – Сценарен енджин** (FR9)  
   *Сцените се зареждат, валидират условия и насочват клони без да нарушават UX guardrails.*  
   - Scene loader & cache  
   - Condition evaluator  
   - Choice processor & history

10. **Epic J – Content Data Backbone** (FR10)  
    *Авторите поддържат надеждни Markdown/JSON структури за всички ресурси.*  
    - Markdown template + lint правила  
    - Item/NPC/Quest схеми  
    - Authoring tooling и проверки

11. **Epic K – Икономика и търговия** (FR14)  
    *Играчът търгува, вижда конверсии и усеща теглото на товара.*  
    - Currency & pricing conversion  
    - Weight & encumbrance feedback  
    - Barter/vendor UX

12. **Epic L – Съхранение и интегритет** (FR19)  
    *Официалният storage стек гарантира интегритет, export и dry seal fallback.*  
    - AsyncStorage/SQLite/MMKV adapters  
    - Save export & backup  
    - Integrity monitor + GuardianShell alerts

## Epic A: Вход към хрониката (FR1, FR26)
*Играчът може да отвори главното меню, да избере save слот и да получи storyteller onboarding без да нарушава Occam Overlay guardrails.*

### Story A.1: Main Menu Occam Entry
As a returning player,
I want да виждам всички основни опции (New Game, Continue, Load, Settings, Credits, Quit, DLC),
So that мога да започна правилния ритуал без излишни екрани.

**Acceptance Criteria:**
**Given** приложението е стартирано и UX State Bus има `overlaysVisible = 0`
**When** отворя главното меню
**Then** се показват точно две нива: главно платно + един контекстен панел (Occam Overlay Rule)
**And** всяка опция има storyteller tooltip (Witness Voice)
**And** DLC опциите се заключват, ако entitlement липсва, с telemetry event `menu.dlcLocked`

### Story A.2: Save Slot Selection & Sync
As a хроникьор,
I want да избирам между три save слота + New Game+,
So that мога да продължа историята или да започна нова с увереност.

**Acceptance Criteria:**
**Given** съм в менюто и имам ≥1 съществуващ save
**When** избера слот
**Then** се показва details overlay (timestamp, playtime, DLC flags) без да нарушава Occam Rule
**And** **Given** слотът е повреден **When** натисна „Възстанови“ **Then** dry seal fallback се активира и GuardianShell изпраща `manualOverride.requested`
**And** Manual save/auto-save индикаторите покриват one-handed reach (≤48px от десния палец)

### Story A.3: Storyteller Onboarding
As a нов играч,
I want storyteller ритуалът да ми покаже Manual Override, Journey tracker и Witness Voice,
So that разбирам guardrails от първата сцена.

**Acceptance Criteria:**
**Given** започвам New Game
**When** завърша първия параграф
**Then** Consequences Telegraph показва интерактивно обяснение (≤2 s glow)
**And** Journey tracker подсказва KPI sigil + dry seal fallback за Low Ember
**And** ако пропусна инструкциите два пъти, GuardianShell записва `witnessVoice.reminder` и показва tooltip в Save UI

## Epic B: Прочети → избери → усети последствията (FR2, FR8, FR27, FR28)
*Играчът чете първата хроника, прави избори и вижда Consequences Telegraph с всички UX guardrails (high contrast, one-handed, telemetry KPIs).* 

### Story B.1: StoryTile & Fact Spine Accessibility
As a story-driven player,
I want да чета StoryTile с high-contrast, adjustable fonts и Fact Spine подсказки,
So that мога да следя хрониката и фактите без усилие.

**Acceptance Criteria:**
**Given** съм в Narrative режима
**When** активирам high-contrast от Settings или системно изискване
**Then** StoryTile автоматично превключва към Ascetic Runes тема и GuardianShell изпраща `accessibility.changed`
**And** **Given** увелича текста до 150% **When** се върна към играта **Then** layout остава едноръчен (≤420 px ширина, scroll reachable с палец)
**And** Fact Spine може да се свива/разгъва с long-press без да нарушава Occam Overlay Rule

### Story B.2: Choice Ribbon с Manual Override
As a играч,
I want да правя избори с яснота, skill checks и Manual Override предупреждения,
So that усещам тежестта на решенията.

**Acceptance Criteria:**
**Given** имам избори A–D
**When** задържа опция със Consequences Telegraph cue
**Then** се показва micro overlay за ≤2 слоя, telemetry event `choice.preview`
**And** **Given** Manual Override threshold е достигнат **When** опитам да прескоча ритуала **Then** CTA „Върни ритуала“ се активира с dry seal вибрация
**And** skill check (DC) се визуализира с Given/When/Then pattern за QA: *Given* актьорът има skill 5 *When* хвърли d20 *Then* системата записва roll + модификатор + outcome

### Story B.3: Consequences Telegraph & Journey Tracker Sync
As a telemetry guardian,
I want Telegraph и Journey tracker да работят синхронно и да уважават Occam Rule,
So that играчът вижда последствията и DLC куки без претоварване.

**Acceptance Criteria:**
**Given** Telegraph CTR падне под 60%
**When** следващият избор се появи
**Then** GuardianShell активира glow pulse за ≤2 s и записва `telemetry.gaugeLow`
**And** Journey tracker показва condensed recap CTA, достъпен с един палец
**And** **Given** offline режим **When** Telegraph трябва да покаже светлина **Then** dry seal текст замества glow и telemetry event `telegraph.drySeal` се логва

## Epic C: Управлявай героя си (FR3, FR4, FR11, FR21–23)
*Играчът преглежда Character Sheet, Inventory и Equipment в Occult Grid layout, като UX State Bus гарантира едноръчен контрол и telemetry guardrails.*

### Story C.1: Character Sheet Occult Grid
As a strategist,
I want да виждам всички stats, buffs и Fact Spine връзки в Occult Grid layout,
So that мога да коригирам героя без да губя контекст.

**Acceptance Criteria:**
**Given** UX State Bus отбелязва `overlaysVisible = 1`
**When** отворя Character Sheet
**Then** StoryTile остава docked и листът се показва в втория слой (Occam Rule)
**And** high-contrast режим се наследява автоматично (Ascetic Runes theme)
**And** telemetry event `characterSheet.opened` записва използваната палитра/шрифт (за FR8 мониторинг)

### Story C.2: Inventory Actions & Telemetry
As a scavenger,
I want да управлявам инвентара (Use/Equip/Drop) с минимални стъпки и Witness Voice подсказки,
So that решенията ми са проследими.

**Acceptance Criteria:**
**Given** държа оръжието в списъка
**When** избера Equip
**Then** GuardianShell проверява weight/requirements и изпраща `telemetry.inventoryChange`
**And** **Given** екранът е в one-handed режим **When** превключа към Grid view **Then** CTA бутоните остават в reach зона (<48 px от десния палец)
**And** Manual Override се активира, ако теглото надвиши лимита – dry seal + tooltip

### Story C.3: Progression Tracker & Witness Voice
As a lore fan,
I want Witness Voice да ми напомня за следващи специализации и companion реакции,
So that progression решението ми е информирано.

**Acceptance Criteria:**
**Given** достигна 5 ниво
**When** отворя Progression таба
**Then** Witness Voice карта показва „следващ ритуал“ + telemetry KPI (CTR ≥45%)
**And** **Given** companion affinity threshold е достигнат **When** избера специализация **Then** Journey tracker записва „Companion reacted“ и GuardianShell изпраща `telemetry.gaugeLow` ако CTA се игнорира два пъти

## Epic D: Първата битка и Manual Override (FR7, FR12, FR13, FR24)
*Играчът участва в битка, вижда skill checks, Manual Override и dry seal fallback, без да нарушава Occam Overlay Rule.*

### Story D.1: Combat UI & Turn Order Docking
As a tactician,
I want turn order, quick stats и action ribbon да са достъпни без да скриват StoryTile,
So that битките останат четими.

**Acceptance Criteria:**
**Given** влизам в combat state
**When** combat UI се зареди
**Then** StoryTile се свива до 40% ширина, combat панелът заема втория слой (Occam)
**And** turn order е swipeable, но уважава one-handed gestures
**And** telemetry `combat.turnStart` съдържа reference към Journey tracker CTA

### Story D.2: Skill Check Visualization
As a player,
I want да виждам skill check ролките и DC сравненията,
So that усещам справедливостта на битката.

**Acceptance Criteria:**
**Given** бойното действие изисква skill check
**When** натисна съответния бутон
**Then** d20 анимация се изпълнява (<2 s), показва roll + modifier + DC, GuardianShell записва `combat.skillCheck`
**And** при critical (nat 1/20) Witness Voice картата дава storyteller copy
**And** high-contrast режим добавя outline вместо glow

### Story D.3: Manual Override Recovery Loop
As a ritual keeper,
I want Manual Override да ми позволява да върна пропуснат ритуал в битката,
So that не губя прогрес при грешка.

**Acceptance Criteria:**
**Given** пропускам ритуал (напр. companion support)
**When** GuardianShell засече нарушението
**Then** CTA „Върни ритуала“ се появява под action ribbon (<1 слой)
**And** **Given** потребителят откаже три пъти **When** combat завърши **Then** Journey tracker записва „Жрецът настоява да напишеш нова хроника“ + telemetry `manualOverride.failed` се логва
**And** в offline режим glow се заменя с dry seal текст + двоен хаптик

## Epic E: Пътуване, карта и DLC сигили (FR5, FR25, FR29)
*Играчът използва карта, пътува между локации и вижда DLC куки в Journey tracker.*

### Story E.1: Map Screen & Travel CTA
As a wanderer,
I want да виждам интерактивната карта и да тръгвам към локации с едно докосване,
So that пътуванията са бързи и проследими.

**Acceptance Criteria:**
**Given** Map overlay е активиран
**When** избера локация
**Then** Celestial Dial показва предложен маршрут (≤1 допълнителен слой)
**And** telemetry `map.travelSelected` записва дистанция, време, DLC flags
**And** loading indicator (global) се показва при transition > 0.5 s (FR8)

### Story E.2: Journey Tracker KPI Sigils
As a storyteller analyst,
I want Journey tracker да визуализира KPI sigils и DLC hook-ове,
So that виждам прогреса и предложенията.

**Acceptance Criteria:**
**Given** CTR падне под 45%
**When** Journey tracker се обнови
**Then** KPI sigil pulse (≤2 s) и telemetry event `journey.sigils`
**And** DLC куки остават в reach зона (one-handed), показвайки namespaced state
**And** offline режим показва dry seal tooltip вместо glow

### Story E.3: DLC Module Loader
As a DLC curator,
I want модулите да се зареждат динамично, без да нарушават основната хроника,
So that играчът чувства seamless разширение.

**Acceptance Criteria:**
**Given** играчът избере DLC карта
**When** entitlement е потвърден (локално)
**Then** module loader инжектира сцени под namespaced state и GuardianShell записва `dlc.loaded`
**And** **Given** entitlement липсва **When** играчът отвори DLC **Then** се показва storyteller copy „Ритуалът предстои“ + telemetry `dlc.locked`

## Epic F: Мисии, репутации и Witness Voice (FR6, FR15, FR16, FR30)
*Играчът управлява journal, последствия и репутации с помощта на Witness Voice.*

### Story F.1: Journal One-Hand Mode
As a quest tracker,
I want journal-ът да работи в compact режим,
So that мога да търся мисии с една ръка.

**Acceptance Criteria:**
**Given** активирам compact режим
**When** отворя Journal
**Then** списъкът е вертикален (<420 px), филтрите са swipeable, telemetry `journal.view`
**And** high-contrast режим се наследява автоматично

### Story F.2: Quest Consequence Telegraph
As a consequence guardian,
I want Telegraph да показва последствията в Journal,
So that разбирам кого докосва мисията.

**Acceptance Criteria:**
**Given** мисия е завършена
**When** отворя Journal entry
**Then** Telegraph показва NPC/фракции + KPI sigil, telemetry `journal.telegraph`
**And** Manual Override CTA се появява, ако критична мисия е пропусната (dry seal уведомление)

### Story F.3: Reputation Dashboard
As a faction diplomat,
I want да виждам репутациите и праговете,
So that планирам действията си.

**Acceptance Criteria:**
**Given** репутация се промени
**When** отворя dashboard
**Then** GuardianShell показва storyteller copy, Journey tracker записва „Factions shift“
**And** telemetry `reputation.threshold` се логва при всяка граница (FR16)

## Epic G: Запази и възстанови съдбата си (FR17–20, FR26)
*Играчът управлява save/load, auto-save и recovery, спазвайки Occam Overlay rule.*

### Story G.1: Save/Load UI GWT
As a meticulous player,
I want save/load действията да имат ясни Given/When/Then acceptance условия,
So that QA може да валидира всички случаи.

**Acceptance Criteria:**
**Given** играчът избере Save
**When** потвърди
**Then** системата записва snapshot (player, world, quests, timestamp) и GuardianShell изпраща `save.completed`
**And** **Given** storage е пълен **When** запазването се провали **Then** dry seal предупреждение + Manual Override CTA (изтрий стар слот)

### Story G.2: Auto-Save & Loading Indicators
As a UX guardian,
I want глобален индикатор и telemetry при auto-save,
So that играчът знае, че прогресът е защитен.

**Acceptance Criteria:**
**Given** auto-save тригър се активира
**When** записът започне
**Then** се показва глобален loading индикатор (FR8) и telemetry `autosave.start`
**And** индикаторът изчезва < 2 s след успех, или показва dry seal fallback при грешка

### Story G.3: Corruption Recovery Loop
As a ritual restorer,
I want системата да възстановява save файлове и да документра Manual Override опитите.

**Acceptance Criteria:**
**Given** save е повреден
**When** избера „Възстанови“
**Then** GuardianShell зарежда последния auto-save snapshot, записва `manualOverride.requested`
**And** ако recovery се провали, Journey tracker показва „Жрецът настоява да напишеш нова хроника“ + telemetry `save.recoveryFailed`

## Epic H: Допълнителни хроники (DLC) (FR29, FR30)
*Играчът отключва и играе DLC съдържание без да нарушава основната хроника.*

### Story H.1: DLC Selector & Entitlements
As a collector,
I want selectorът да ми показва наличните DLC и състоянието им,
So that знам кои хроники са достъпни.

**Acceptance Criteria:**
**Given** отворя DLC selector
**When** entitlement липсва
**Then** показва storyteller copy „Ритуалът предстои“ + CTA „Научи повече“ (без покупки) и telemetry `dlc.locked`
**And** наличните DLC се зареждат namespaced, Occam Overlay правило се спазва (основен + един панел)

### Story H.2: DLC State Namespacing
As a developer,
I want DLC state да е отделно namespaced,
So that основната хроника не се поврежда.

**Acceptance Criteria:**
**Given** играчът стартира DLC
**When** събитие променя state
**Then** записът отива в `state.dlc.{module}` и telemetry `dlc.stateChange`
**And** save/export включват ясно разграничение (FR19/FR29)

### Story H.3: DLC Telemetry Comparison
As a product owner,
I want сравнение между основни и DLC KPI,
So that знам дали новите хроники се възприемат.

**Acceptance Criteria:**
**Given** играчът завърши DLC сцена
**When** Journey tracker се обнови
**Then** KPI sigils сравняват CTR/Completion с основната кампания, telemetry `dlc.kpi`
**And** Witness Voice записва storyteller бележка „Нов извор бе овладян“

## Epic I: Сценарен енджин (FR9)
*Сцените се зареждат, валидират условия и насочват клони без да нарушават UX guardrails.*

### Story I.1: Scene Loader & Cache
As a game engineer,
I want loader, който зарежда Markdown сцени и кешира последните 50,
So that преходите са под 0.5 s.

**Acceptance Criteria:**
**Given** сцена ID е заявен
**When** loader я прочете
**Then** валидира структурата (header, narrative, choices) и я връща към ScenarioDisplay
**And** LRU cache пази последните 50 сцени; telemetry `scenario.cacheHit` се записва при попадение

### Story I.2: Condition Evaluator
As a narrative designer,
I want условностите да се оценяват последователно,
So that изборите показват правилните опции.

**Acceptance Criteria:**
**Given** сцена съдържа flag/counter/relationship условия
**When** evaluator ги прегледа
**Then** връща true/false на база текущия state обект
**And** сложните условия (AND/OR) се изпълняват рекурсивно
**And** telemetry `scenario.conditionFailed` регистрира кога избор е скрит

### Story I.3: Choice Processor & History
As a storyteller,
I want изборите да се процесват и логват,
So that историята на решенията е достъпна за Journey tracker.

**Acceptance Criteria:**
**Given** играчът направи избор
**When** processor-a го приеме
**Then** изпълнява skill checks/последствия и насочва към следващата сцена
**And** историята се записва в `player-data/runtime/history.full`
**And** Occam Overlay не позволява повече от два слоя по време на анимацията

## Epic J: Content Data Backbone (FR10)
*Авторите поддържат надеждни Markdown/JSON структури за всички ресурси и tooling за валидация.*

### Story J.1: Markdown Template & Lint Rules
As a content author,
I want официален Markdown шаблон и линтер,
So that всички сцени следват една структура.

**Acceptance Criteria:**
**Given** нов файл се създава
**When** линтерът се стартира
**Then** проверява задължителните секции (Metadata, Narrative, Choices, Outcomes)
**And** грешки се описват с ред/колона и препратка към PRD §4.2

### Story J.2: Item/NPC/Quest Schemas
As a systems designer,
I want TypeScript/JSON схеми за items, NPCs и QUEST-ове,
So that данните са съвместими с енджина.

**Acceptance Criteria:**
**Given** schema се промени
**When** content build се изпълни
**Then** валидацията спира pipeline-а при несъответствие и логва `content.schemaError`
**And** успешните билдове генерират типове за редактори и game engine

### Story J.3: Authoring Tooling & Previews
As a narrative lead,
I want tooling, което визуализира сцена/quest преди commit,
So that откриваме грешки рано.

**Acceptance Criteria:**
**Given** автор зарежда сцена в viewer
**When** натисна „Preview“
**Then** инструментът рендерира StoryTile/Choices и показва липсващи полета
**And** telemetry `content.preview` записва файловия път и резултата

## Epic K: Икономика и търговия (FR14)
*Играчът търгува, усеща конверсиите и бартер правилата с едноръчен UX.*

### Story K.1: Currency & Pricing Conversion
As a merchant,
I want валутите да се конвертират автоматично и да показват репутационни модификатори,
So that цените са ясни.

**Acceptance Criteria:**
**Given** отворя търговец
**When** избера предмет
**Then** UI показва цена в текущата валута + конверсия към други
**And** репутационният модификатор се визуализира с Witness Voice tooltip

### Story K.2: Weight & Encumbrance Feedback
As a scavenger,
I want да усещам теглото и ограниченията,
So that преценявам какво да нося.

**Acceptance Criteria:**
**Given** инвентарът надвиши лимита
**When** добавя предмет
**Then** GuardianShell показва dry seal предупреждение и `telemetry.inventoryOverweight`
**And** Choice Ribbon disable-ва действия, които изискват бързи движения, докато теглото е високо

### Story K.3: Barter & Vendor UX
As a trader,
I want диалогът с търговците да поддържа бартер и пакети,
So that икономиката се усеща автентична.

**Acceptance Criteria:**
**Given** говоря с търговец
**When** предложа бартер
**Then** UI показва сравнение между офертата и изискуемата стойност, както и шанс за успех
**And** Manual Override се активира, ако играчът се опита да злоупотреби (напр. отрицателни стойности)

## Epic L: Съхранение и интегритет (FR19)
*Официалният storage стек гарантира разделение между AsyncStorage/SQLite/MMKV, export и dry seal fallback.*

### Story L.1: Storage Adapter Layer
As a platform engineer,
I want слой, който абстрахира AsyncStorage/SQLite/MMKV,
So that бизнес логиката използва единен интерфейс.

**Acceptance Criteria:**
**Given** модул поиска достъп до storage
**When** adapter-ът го обслужи
**Then** избира правилната технология (AsyncStorage: прости данни, SQLite: сложни, MMKV: hot state)
**And** telemetry `storage.adapterUsage` записва статистика

### Story L.2: Save Export & Backup Pipeline
As a cautious player,
I want възможност да експортирам сейфовете си,
So that мога да ги архивирам.

**Acceptance Criteria:**
**Given** избера „Export Save“
**When** процесът завърши
**Then** получавам файл в `player-data/backups/` и GuardianShell записва `save.exported`
**And** при грешка се показва dry seal fallback и `save.exportFailed`

### Story L.3: Integrity Monitor & Dry Seal Alerts
As a guardian engineer,
I want автоматичен мониторинг на storage интегритета,
So that корупциите се улавят навреме.

**Acceptance Criteria:**
**Given** приложение стартира
**When** integrity job се изпълни
**Then** проверява checksums/версии, логва резултата и при отклонение показва dry seal банер
**And** telemetry `storage.integrityFailed` включва препратка към последния backup

## Notes
- Пълният архив се намира в `planning-artifacts/foundation/archive/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md`.
- След завършване на Step 2/3 този файл ще бъде обновен според шаблона `epics-template.md`.