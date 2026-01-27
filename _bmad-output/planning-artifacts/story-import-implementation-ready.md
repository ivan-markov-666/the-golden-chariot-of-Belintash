# Story Import Pack – Implementation Readiness (Epic I–L)

Използвай следните описания при създаване на задачи в issue tracker-а. Всяка секция включва Source, FR, Instrumentation, GuardianShell DoD чеклист и QA/Test reference.

---

## Story I.1 – Scene Loader & Cache
- **Source:** `_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#416-429`
- **FR:** FR9 @ `_bmad-output/planning-artifacts/implementation-readiness-report-2026-01-27.md#129-150`

**Description**  
As a game engineer, build loader + LRU cache (50 сцени) с валидирана Markdown структура.

**Acceptance Criteria**
1. Given сцена ID When loader я зареди Then валидира header/narrative/choices и я връща на ScenarioDisplay.  
2. LRU cache пази 50 сцени; telemetry `scenario.cacheHit`/`scenario.cacheMiss` се логват.

**Instrumentation:** `scenario.cacheHit`, `scenario.cacheMiss`, `scenario.loaderError`

**GuardianShell DoD:**
- [ ] Occam Overlay ≤ 2 слоя  
- [ ] Triad Loop signals  
- [ ] Telemetry contracts  
- [ ] Dry Seal fallback  
- [ ] Accessibility mirror  
- [ ] Storage safety hooks (history write)

**QA/Test Reference:** Scenario Engine track – Jest BDD latency + Detox “StoryLoop navigation” @ `_bmad-output/planning-artifacts/implementation-readiness-report-2026-01-27.md#237-242`

**Evidence Needed:** Jest log (<0.5 s latency), Detox recording, history.full snapshot.

---

## Story I.2 – Condition Evaluator
- **Source:** `_bmad-output/...#430-441`
- **FR:** FR9

**Description**  
Evaluate flag/counter/relationship условия с рекурсивни AND/OR правила, логвайки скритите избори.

**Acceptance Criteria**
1. Evaluator връща true/false според текущия state обект.  
2. Complex AND/OR условия се изпълняват рекурсивно.  
3. Скрит избор логва `scenario.conditionFailed`.

**Instrumentation:** `scenario.conditionEvaluated`, `scenario.conditionFailed`

**GuardianShell DoD:** всички 6 точки.

**QA/Test Reference:** Scenario Engine track – Jest truth-table + Detox скрит избор @ `_...#237-242`

**Evidence:** Jest таблица, Detox log, telemetry export.

---

## Story I.3 – Choice Processor & History
- **Source:** `_bmad-output/...#442-453`
- **FR:** FR9

**Description**  
Process избори, изпълни skill checks/последствия, запиши история в `player-data/runtime/history.full` без да нарушиш Occam Overlay.

**Acceptance Criteria**
1. Processor изпълнява skill checks и насочва към следваща сцена.  
2. Историята се записва в `history.full`.  
3. По време на анимации няма >2 слоя.

**Instrumentation:** `scenario.choiceLogged`, `scenario.historyWriteFailed`, `manualOverride.requested`

**GuardianShell DoD:** 6/6 точки (storage hooks задължителни).

**QA/Test Reference:** Scenario Engine track – Detox StoryLoop run + Jest verification @ `_...#237-242`

**Evidence:** Detox recording, history diff, telemetry лог.

---

## Story J.1 – Markdown Template & Lint Rules
- **Source:** `_...#457-467`
- **FR:** FR10

**Description**  
Дефинирай официален Markdown шаблон за сцени + линтер с задължителни секции.

**Acceptance Criteria**
1. Линтерът проверява секциите и спира pipeline-а при липси.  
2. Грешките съдържат ред/колона и препратка към PRD §4.2.

**Instrumentation:** `content.schemaError`, `content.schemaValid`

**GuardianShell DoD:** 6/6 (preview наследява UX State Bus).

**QA/Test Reference:** Content Data track – CLI lint + snapshot viewer @ `_...#243-247`

**Evidence:** CI lint отчет, snapshot capture.

---

## Story J.2 – Item/NPC/Quest Schemas
- **Source:** `_...#468-478`
- **FR:** FR10

**Description**  
Създай TypeScript/JSON схеми за items/NPC/quests и автоматизирай build валидацията.

**Acceptance Criteria**
1. Build спира при schema mismatch и логва `content.schemaError`.  
2. Успех → генерирани типове за editors/engine.

**Instrumentation:** `content.schemaError`, `content.schemaGenerated`

**GuardianShell DoD:** 6/6

**QA/Test Reference:** Content Data track – CLI lint + schema suite.

**Evidence:** Schema build лог, генерирани типове, failing пример.

---

## Story J.3 – Authoring Tooling & Previews
- **Source:** `_...#479-488`
- **FR:** FR10

**Description**  
Preview tooling визуализира StoryTile/Choices и маркира липсващи полета преди commit.

**Acceptance Criteria**
1. Preview рендерира сцената и показва липсващи полета.  
2. Telemetry `content.preview` записва пътя и резултата.

**Instrumentation:** `content.preview`, `content.previewFailed`

**GuardianShell DoD:** 6/6

**QA/Test Reference:** Content Data track – snapshot tests + lint negative case.

**Evidence:** Jest snapshot, CLI лог, telemetry export.

---

## Story K.1 – Currency & Pricing Conversion
- **Source:** `_...#493-503`
- **FR:** FR14

**Description**  
UI трябва да показва цена в текущата валута, конверсия към други и репутационен модификатор.

**Acceptance Criteria**
1. Виждаш цена в текуща + други валути.  
2. Witness Voice tooltip показва reputation modifier.

**Instrumentation:** `economy.conversionShown`, `economy.reputationModifier`

**GuardianShell DoD:** 6/6 (Occam overlays, dry seal, accessibility).

**QA/Test Reference:** Economy track – unit `convertCurrency` + Detox “Vendor bargain” @ `_...#248-252`

**Evidence:** Unit отчет, Detox recording, telemetry лог.

---

## Story K.2 – Weight & Encumbrance Feedback
- **Source:** `_...#504-514`
- **FR:** FR14

**Description**  
Покажи dry seal предупреждение и disable действия, когато теглото надхвърли лимита.

**Acceptance Criteria**
1. Превишен лимит → dry seal + `telemetry.inventoryOverweight`.  
2. Choice Ribbon disable-ва рискови действия.

**Instrumentation:** `telemetry.inventoryOverweight`, `manualOverride.requested`

**GuardianShell DoD:** 6/6

**QA/Test Reference:** Economy track – Detox overweight сценарий + unit tests.

**Evidence:** Detox log, telemetry export.

---

## Story K.3 – Barter & Vendor UX
- **Source:** `_...#515-524`
- **FR:** FR14

**Description**  
Бартер диалог с сравнение на оферти, шанс за успех и Manual Override защита.

**Acceptance Criteria**
1. UI показва сравнение и шанс за успех.  
2. Злоупотреби → Manual Override + dry seal.

**Instrumentation:** `economy.barterAttempt`, `manualOverride.requested`, `telemetry.barterOutcome`

**GuardianShell DoD:** 6/6

**QA/Test Reference:** Economy track – Detox “Vendor bargain” + unit barter logic.

**Evidence:** Detox recording, telemetry лог.

---

## Story L.1 – Storage Adapter Layer
- **Source:** `_...#529-539`
- **FR:** FR19

**Description**  
Абстрахирай AsyncStorage/SQLite/MMKV; логвай `storage.adapterUsage`.

**Acceptance Criteria**
1. Adapter избира правилната технология за всяка заявка.  
2. Telemetry `storage.adapterUsage` записва статистика.

**Instrumentation:** `storage.adapterUsage`, `storage.adapterError`

**GuardianShell DoD:** 6/6

**QA/Test Reference:** Storage track – Jest mocks за routing @ `_...#253-257`

**Evidence:** Jest log, telemetry export.

---

## Story L.2 – Save Export & Backup Pipeline
- **Source:** `_...#540-549`
- **FR:** FR19

**Description**  
Активирай "Export Save" → файл в `player-data/backups/`, dry seal fallback при грешка.

**Acceptance Criteria**
1. Успешен export → файл + `save.exported`.  
2. Грешка → dry seal + `save.exportFailed`.

**Instrumentation:** `save.exported`, `save.exportFailed`, `storage.adapterUsage`

**GuardianShell DoD:** 6/6

**QA/Test Reference:** Storage track – e2e smoke “Corrupt save → Recovery CTA” + backup тест.

**Evidence:** Export файл, telemetry лог, smoke recording.

---

## Story L.3 – Integrity Monitor & Dry Seal Alerts
- **Source:** `_...#550-560`
- **FR:** FR19

**Description**  
Автоматичен integrity job (checksums/версии) + dry seal банер при отклонение.

**Acceptance Criteria**
1. При старт job проверява checksums/версии и логва резултат.  
2. Отклонение → dry seal банер + `storage.integrityFailed` с препратка към последния backup.

**Instrumentation:** `storage.integrityPassed`, `storage.integrityFailed`, `save.recoverySuggestion`

**GuardianShell DoD:** 6/6

**QA/Test Reference:** Storage track – unit tests за monitor + smoke “Corrupt save → Recovery CTA”.

**Evidence:** CI лог, screenshot на dry seal банер, telemetry export.
