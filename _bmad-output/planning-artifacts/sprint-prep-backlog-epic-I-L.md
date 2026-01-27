# Sprint Prep Backlog – Epic I–L (27 Jan 2026)

Този документ съдържа детайлни backlog записи за 12-те stories от Epic I–L и служи като личен Kanban/чеклист, когато работиш без външен issue tracker. Всеки запис включва Source link, DoR/DoD, Instrumentation, QA/Test план и Dependencies.

## Как да използваш файла като личен workflow

1. **Статус чекбокси:** всяка story има ред `- **Status:** [ ] TODO`. Смени `[ ]` с `[x]` за `IN PROGRESS` или `DONE` (пример: `[x] IN PROGRESS`).
2. **Workflow Checklist:** маркирай под-подзадачите (Implementation, Telemetry, Tests, Docs) директно в Markdown. Това замества DoR/DoD отбелязването.
3. **Бележки:** ако имаш блокер, добави ред `> Blocked: ...` под съответната story.
4. **Ревю:** в края на деня прегледай списъка и актуализирай checkbox-ите, за да знаеш кое е готово преди да стартираш следващия workflow (например sprint-planning).

> **Бележка:** При нужда замени `Owner TBD`/`QA TBD` с твоето име (или „self“) и посочи датата на започване/приключване.

---

## Story I.1 – Scene Loader & Cache (Sprint 1)
- **Epic / FR:** Epic I – Scenario Engine / FR9
- **Source:** @/_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#92-101
- **Owner:** TBD • **QA:** TBD
- **Status:** [x] TODO / [ ] IN PROGRESS / [ ] DONE
- **Summary:** Зарежда Markdown сцени локално, кешира ги офлайн и гарантира <0.5 s latency дори без мрежа.
- **Acceptance Criteria:**
  1. Given offline режим → loader връща сцена <0.5 s и telemetry `scenario.loaded` се записва.
  2. When последователно се заредят две сцени → cache hit ratio ≥90% (телеметрия `scenario.cacheHit`).
  3. When loader не намира сцена → GuardianShell показва dry seal fallback и логва `scenario.missing`.
- **Instrumentation:** `scenario.loaded`, `scenario.cacheHit`, `scenario.missing`.
- **Dependencies:** Scene manifest, File adapter, GuardianShell Provider, Telemetry bus.
- **DoR Checklist:** Source link ✅ • Instrumentation подсекция ✅ • GuardianShell DoD attached ✅ • QA/Test reference ✅ (`BDD Scenario: loader latency <0.5 s; Detox StoryLoop navigation`) • Dependencies listed ✅.
- **DoD Checklist:** Occam overlay tests (StoryLoop ≤2 слоя); Telemetry verification (events emitted); Dry seal fallback snapshot; Storage hooks N/A; Test evidence (BDD log + Detox recording); EPIC doc updated.
- **QA/Test Plan:**
  - BDD: "Given scene ACT1-INTRO, When loader fetches offline, Then resolves <500 ms".
  - Detox: StoryLoop playback – зарежда две сцени, проверява cache telemetry и history запис в `player-data/runtime/history.full`.
- **Workflow Checklist:**
  - [ ] Имплементация + зависимости (Scene manifest, cache layer)
  - [ ] Телеметрични събития `scenario.loaded`/`scenario.cacheHit`/`scenario.missing`
  - [ ] QA тестове (BDD + Detox Script)
  - [ ] Документация/EPIC update

## Story I.2 – Condition Evaluator (Sprint 1)
- **Epic / FR:** Epic I / FR9
- **Source:** @/_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#92-108
- **Owner:** TBD • **QA:** TBD
- **Status:** [x] TODO / [ ] IN PROGRESS / [ ] DONE
- **Summary:** Валидира state флагове преди показване на избори, скрива опции и логва откази.
- **Acceptance Criteria:**
  1. Given flag == false → Choice не се визуализира и telemetry `scenario.conditionFailed` се логва.
  2. When flag се променя в сцената → Choice се появява без нарушаване на Occam overlay (≤2 слоя).
  3. Manual Override CTA се активира при три последователни провала.
- **Instrumentation:** `scenario.conditionFailed`, `scenario.conditionPassed`, `manualOverride.requested`.
- **Dependencies:** Story state machine, GuardianShell Manual Override, Telemetry bus.
- **DoR Checklist:** Source link ✅ • Instrumentation ✅ • GuardianShell DoD ✅ • QA/Test reference ✅ (BDD truth table + unit tests) • Dependencies ✅.
- **DoD Checklist:** Occam overlay tests; Telemetry assertions; Dry seal fallback (text, haptics); Storage hooks N/A; Test evidence (unit + Detox); Documentation updated.
- **QA/Test Plan:** BDD truth table за flag комбинации; Jest unit tests за evaluator; Detox scenario с блокирани избори.
- **Workflow Checklist:**
  - [ ] Имплементация на condition evaluator + Manual Override hook
  - [ ] Телеметрия `scenario.conditionFailed`/`scenario.conditionPassed`/`manualOverride.requested`
  - [ ] QA тестове (BDD truth table + Jest + Detox)
  - [ ] Документация/EPIC update

## Story I.3 – Choice Processor & History (Sprint 1)
- **Epic / FR:** Epic I / FR9
- **Source:** @/_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#99-108
- **Owner:** TBD • **QA:** TBD
- **Status:** [x] TODO / [ ] IN PROGRESS / [ ] DONE
- **Summary:** Обработва избори, записва историята в `player-data/runtime/history.full` и поддържа undo hooks.
- **Acceptance Criteria:**
  1. When играчът избере опция → history entry съдържа scene id, choice id, timestamp.
  2. When Manual Override активира „Върни ритуал“ → историята маркира revert event.
  3. Telemetry `journey.choiceTaken` и `history.writeSuccess` се логват.
- **Instrumentation:** `journey.choiceTaken`, `history.writeSuccess`, `manualOverride.revert`.
- **Dependencies:** History writer, Storage integrity hooks, GuardianShell Manual Override.
- **DoR:** Source link ✅ • Instrumentation ✅ • DoD attached ✅ • QA/Test reference ✅ (e2e StoryLoop history) • Dependencies ✅.
- **DoD:** Occam overlay unaffected; Telemetry verified; Dry seal fallback for offline history; Storage hooks ✅ (`storage.adapterUsage`); Test evidence (Detox + file diff); Documentation updated.
- **QA/Test Plan:** Detox test записва избор и проверява файла; Jest mock за history writer; e2e verifies revert flow.
- **Workflow Checklist:**
  - [ ] Имплементация на choice processor + history writer
  - [ ] Телеметрия `journey.choiceTaken`/`history.writeSuccess`/`manualOverride.revert`
  - [ ] QA тестове (Detox StoryLoop + Jest mocks)
  - [ ] Документация/EPIC update

---

## Story J.1 – Markdown Template Lint (Sprint 1)
- **Epic / FR:** Epic J / FR10
- **Source:** @/_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#100-105
- **Owner:** TBD • **QA:** TBD
- **Status:** [x] TODO / [ ] IN PROGRESS / [ ] DONE
- **Summary:** CLI lint (`yarn content:lint`) валидира StoryTile Markdown frontmatter/section order.
- **Acceptance Criteria:**
  1. When frontmatter липсва → CLI връща exit code ≠0 и telemetry `content.schemaError`.
  2. When template е валиден → CLI изкарва "✓" и записва `content.lintPass`.
  3. Docs: README секция описва lint usage.
- **Instrumentation:** `content.schemaError`, `content.lintPass`.
- **Dependencies:** Content parser, CLI scripts, Telemetry.
- **DoR:** Source link ✅ • Instrumentation ✅ • DoD attached ✅ • QA/Test reference ✅ (CLI integration test) • Dependencies ✅.
- **DoD:** Occam overlay N/A; Telemetry logs verified; Dry seal N/A; Storage hooks N/A; Test evidence (CI log); Documentation updated.
- **QA/Test Plan:** Jest/TS tests за parser; CI smoke run на CLI; snapshot на примерен failure output.
- **Workflow Checklist:**
  - [ ] Имплементация на CLI lint pipeline
  - [ ] Телеметрия `content.schemaError`/`content.lintPass`
  - [ ] QA/CI тестове (unit + CLI smoke)
  - [ ] Документация (README usage)

## Story J.2 – Schema Definitions (Items/NPC/Quest) (Sprint 1)
- **Epic / FR:** Epic J / FR10
- **Source:** @/_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#100-105
- **Owner:** TBD • **QA:** TBD
- **Status:** [x] TODO / [ ] IN PROGRESS / [ ] DONE
- **Summary:** Дефинира JSON/TS схеми и валидация за основните content структури.
- **Acceptance Criteria:**
  1. При mismatch между JSON и схема → build проваля и telemetry `content.schemaMismatch` се логва.
  2. Схемите поддържат локализация (BG/EN) и DLC namespaces.
  3. Документация описва schema fields.
- **Instrumentation:** `content.schemaMismatch`, `content.schemaValidated`.
- **Dependencies:** Zod/JSON Schema libs, Lint CLI, Localization resources.
- **DoR:** Source link ✅ • Instrumentation ✅ • DoD attached ✅ • QA/Test reference ✅ (schema unit tests) • Dependencies ✅.
- **DoD:** Occam overlay N/A; Telemetry verified; Dry seal N/A; Storage hooks N/A; Test evidence (unit + CI); Docs updated.
- **QA/Test Plan:** Jest schema tests; CLI pipeline with sample data; negative test dataset.
- **Workflow Checklist:**
  - [ ] Имплементация на схеми + validation pipeline
  - [ ] Телеметрия `content.schemaMismatch`/`content.schemaValidated`
  - [ ] QA тестове (schema unit + CLI)
  - [ ] Документация (schema fields)

## Story J.3 – Authoring Tooling Preview (Sprint 1)
- **Epic / FR:** Epic J / FR10
- **Source:** @/_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#100-105
- **Owner:** TBD • **QA:** TBD
- **Status:** [x] TODO / [ ] IN PROGRESS / [ ] DONE
- **Summary:** Preview компонент визуализира Markdown StoryTile + Fact Spine със snapshot тестове.
- **Acceptance Criteria:**
  1. Preview зарежда сцена, показва Fact Spine/Choices според UX спецификацията.
  2. Snapshot тест гарантира, че Occam overlay (≤2 слоя) се спазва.
  3. Telemetry `preview.render` и `preview.error` се логват.
- **Instrumentation:** `preview.render`, `preview.error`.
- **Dependencies:** React preview tool, UX design tokens, GuardianShell DoD.
- **DoR:** Source link ✅ • Instrumentation ✅ • DoD attached ✅ • QA/Test reference ✅ (Jest snapshot) • Dependencies ✅.
- **DoD:** Occam overlay snapshot; Telemetry verified; Dry seal fallback for offline preview; Storage hooks N/A; Test evidence; Docs updated.
- **QA/Test Plan:** Jest snapshot; Cypress/Playwright optional preview check; Visual regression diff.
- **Workflow Checklist:**
  - [ ] Имплементация на preview tooling
  - [ ] Телеметрия `preview.render`/`preview.error`
  - [ ] QA тестове (snapshot + e2e preview)
  - [ ] Документация/EPIC update

---

## Story K.1 – Currency & Pricing Conversion (Sprint 2)
- **Epic / FR:** Epic K / FR14
- **Source:** @/_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#104-109
- **Owner:** TBD • **QA:** TBD
- **Status:** [x] TODO / [ ] IN PROGRESS / [ ] DONE
- **Summary:** Конвертира валути, отчита reputation modifiers и показва резултата в UI.
- **Acceptance Criteria:**
  1. Given 10 ducats и rep +15 → output 11.5 tokens (unit тест).
  2. Telemetry `economy.conversion` съдържа вход/изход.
  3. Occam overlay ≤2 слоя при показване на conversion overlay.
- **Instrumentation:** `economy.conversion`, `journey.economyWarning`.
- **Dependencies:** Economy utils, Telemetry, GuardianShell overlay.
- **DoR:** Source link ✅ • Instrumentation ✅ • DoD attached ✅ • QA/Test reference ✅ (unit tests + Detox vendor flow) • Dependencies ✅.
- **DoD:** Occam overlay tests; Telemetry verified; Dry seal fallback for offline pricing; Storage hooks (if using inventory) ✅; Test evidence; Docs updated.
- **QA/Test Plan:** Unit tests for conversions; Detox scenario „Vendor bargain“; BDD for rep modifiers.
- **Workflow Checklist:**
  - [ ] Имплементация на conversion util + UI
  - [ ] Телеметрия `economy.conversion`/`journey.economyWarning`
  - [ ] QA тестове (unit + Detox + BDD)
  - [ ] Документация/EPIC update

## Story K.2 – Weight & Encumbrance Feedback (Sprint 2)
- **Epic / FR:** Epic K / FR14
- **Source:** @/_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#104-109
- **Owner:** TBD • **QA:** TBD
- **Status:** [x] TODO / [ ] IN PROGRESS / [ ] DONE
- **Summary:** Покрива overweight предупреждения, disables CTA и активира Manual Override, когато лимитът е превишен.
- **Acceptance Criteria:**
  1. Overweight → CTA се disable-ва, telemetry `economy.overweight`.
  2. Manual Override + dry seal текст се появяват.
  3. Accessibility: предупредителният текст спазва high-contrast режим.
- **Instrumentation:** `economy.overweight`, `manualOverride.requested`, `telegraph.drySeal`.
- **Dependencies:** Inventory UI, GuardianShell Manual Override, Telemetry.
- **DoR/DoD:** Аналогично на K.1 (Occam overlay, instrumentation, QA references).
- **QA/Test Plan:** Detox „Vendor bargain“ flow; Snapshot for high-contrast warning; Unit tests for threshold logic.
- **Workflow Checklist:**
  - [ ] Имплементация на overweight logic + UI предупреждения
  - [ ] Телеметрия `economy.overweight`/`manualOverride.requested`/`telegraph.drySeal`
  - [ ] QA тестове (Detox + snapshot + unit)
  - [ ] Документация/EPIC update

## Story K.3 – Barter / Vendor UX (Sprint 2)
- **Epic / FR:** Epic K / FR14
- **Source:** @/_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#104-109
- **Owner:** TBD • **QA:** TBD
- **Status:** [x] TODO / [ ] IN PROGRESS / [ ] DONE
- **Summary:** Добавя Manual Override при опит за злоупотреба, telemetry за бартер изходите и dry seal fallback.
- **Acceptance Criteria:**
  1. When barter е несправедлив → Manual Override CTA задължително.
  2. Telemetry `economy.barterOutcome` (win/lose) и `manualOverride.failed` при отказ.
  3. UI спазва One-Handed reach (<48 px CTA).
- **Instrumentation:** `economy.barterOutcome`, `manualOverride.failed`, `telemetry.choicePreview`.
- **Dependencies:** Vendor UI, Manual Override, Telemetry, GuardianShell overlay.
- **QA/Test Plan:** Detox flow negotiating barter; Accessibility screenshot verification; Unit tests for fairness formula.
- **Workflow Checklist:**
  - [ ] Имплементация на barter UX + Manual Override
  - [ ] Телеметрия `economy.barterOutcome`/`manualOverride.failed`/`telemetry.choicePreview`
  - [ ] QA тестове (Detox + accessibility + unit)
  - [ ] Документация/EPIC update

---

## Story L.1 – Adapter Routing (Sprint 1)
- **Epic / FR:** Epic L / FR19
- **Source:** @/_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#110-114
- **Owner:** TBD • **QA:** TBD
- **Status:** [x] TODO / [ ] IN PROGRESS / [ ] DONE
- **Summary:** Рутират save данни към SQLite, volatile state към MMKV, preferences към AsyncStorage.
- **Acceptance Criteria:**
  1. Telemetry `storage.adapterUsage` показва правилния адаптер според payload.
  2. Unit tests с Jest mocks гарантират routing.
  3. Failure fallbacks логват `storage.adapterFallback`.
- **Instrumentation:** `storage.adapterUsage`, `storage.adapterFallback`.
- **Dependencies:** Storage adapters, Integrity monitor, Telemetry.
- **QA/Test Plan:** Jest mocks; e2e check via save/load; Monitoring of telemetry payloads.
- **Workflow Checklist:**
  - [ ] Имплементация на adapter routing + fallbacks
  - [ ] Телеметрия `storage.adapterUsage`/`storage.adapterFallback`
  - [ ] QA тестове (Jest mocks + e2e save/load)
  - [ ] Документация/EPIC update

## Story L.2 – Save Export & Backup (Sprint 1)
- **Epic / FR:** Epic L / FR19
- **Source:** @/_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#110-114
- **Owner:** TBD • **QA:** TBD
- **Status:** [x] TODO / [ ] IN PROGRESS / [ ] DONE
- **Summary:** Export pipeline, backup в `player-data/backups/`, telemetry за успешен export.
- **Acceptance Criteria:**
  1. `save.exported` event + файл в backups.
  2. UI CTA показва статус без нарушаване на Occam overlay (≤2 слоя).
  3. Error path логва `storage.exportFailed` и dry seal текст.
- **Instrumentation:** `save.exported`, `storage.exportFailed`.
- **Dependencies:** File I/O, GuardianShell overlay, Telemetry.
- **QA/Test Plan:** Jest for export util; e2e smoke „Export → verify file“; Detox verifying CTA states.
- **Workflow Checklist:**
  - [ ] Имплементация на export pipeline + UI CTA
  - [ ] Телеметрия `save.exported`/`storage.exportFailed`
  - [ ] QA тестове (Jest + e2e + Detox)
  - [ ] Документация/EPIC update

## Story L.3 – Integrity Monitor & Recovery (Sprint 1)
- **Epic / FR:** Epic L / FR19
- **Source:** @/_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#110-114
- **Owner:** TBD • **QA:** TBD
- **Status:** [x] TODO / [ ] IN PROGRESS / [ ] DONE
- **Summary:** Засича повредени сейфове, активира Recovery CTA и dry seal fallback.
- **Acceptance Criteria:**
  1. When corrupt save се зареди → GuardianShell alert + CTA „Възстанови“ + telemetry `storage.integrityFail`.
  2. Recovery flow възстановява от последен backup и логва `storage.recovered`.
  3. Offline режим показва текстов fallback, Occam overlays ≤2.
- **Instrumentation:** `storage.integrityFail`, `storage.recovered`, `manualOverride.requested`.
- **Dependencies:** Integrity monitor, Backup pipeline, GuardianShell, Telemetry.
- **QA/Test Plan:** e2e smoke „Corrupt save → Recovery CTA“ (описан в readiness отчета); Unit tests for checksum logic; Detox verifying alert UX.
- **Workflow Checklist:**
  - [ ] Имплементация на integrity монитор + Recovery CTA
  - [ ] Телеметрия `storage.integrityFail`/`storage.recovered`/`manualOverride.requested`
  - [ ] QA тестове (e2e smoke + unit + Detox)
  - [ ] Документация/EPIC update

---

## QA / Test Assignment Matrix (copy/paste в тракера)

| Track | Stories | QA Owner | Test Assets |
|-------|---------|----------|-------------|
| Scenario Engine | I.1–I.3 | TBD | BDD + Detox (StoryLoop navigation).
| Content Data | J.1–J.3 | TBD | CLI lint, schema unit tests, snapshot preview.
| Economy & Trade | K.1–K.3 | TBD | Unit conversion suite, Detox "Vendor bargain".
| Storage Integrity | L.1–L.3 | TBD | Jest adapter mocks, e2e "Corrupt save".
| Triad Loop UX | Cross-cutting | TBD | Detox Journey CTA/Battle/Map, Occam overlay unit tests.
| DLC & Namespacing | Depends (K/H) | TBD | Namespace unit tests, integration "DLC load".

---

## Как да използваш този файл
1. Копирай всяка секция в issue тракера (или директно използвай `Markdown -> таск`).
2. Замени `Owner TBD`/`QA TBD` с реални имена.
3. Отбележи DoR/DoD чеклистите при готовност.
4. След като всички задачи са създадени и асоциирани с QA планове, стартирай `/bmad:bmm:workflows:sprint-planning`.
