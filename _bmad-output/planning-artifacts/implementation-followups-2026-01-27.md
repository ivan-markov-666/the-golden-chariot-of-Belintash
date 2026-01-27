# Implementation Follow-ups – 27 Jan 2026

Този документ описва конкретните действия за завършване на трите критични задачи от Implementation Readiness, за да преминем към `/bmad:bmm:workflows:sprint-planning`.

---

## 1. Импорт на Epic I–L Stories в Issue Tracker

| Epic | Story | FR | Резюме | Acceptance Criteria (кратко) |
|------|-------|----|--------|-------------------------------|
| I – Scenario Engine | I.1 Scene Loader & Cache | FR9 | Зарежда Markdown сцени, кешира ги офлайн. | Given offline mode → loader връща сцена <0.5 s, telemetry `scenario.loaded`. |
|  | I.2 Condition Evaluator | FR9 | Валидира state флагове преди показване на избор. | Given flag false → Choice се скрива и логва `scenario.conditionFailed`. |
|  | I.3 Choice Processor & History | FR9 | Обработва избори и записва history. | When player вземе Choice → history се записва в `player-data/runtime/history.full`. |
| J – Content Data | J.1 Markdown Template Lint | FR10 | Генерира lint CLI за StoryTile шаблона. | `yarn content:lint` проваля се при счупен frontmatter. |
|  | J.2 Schema Definitions (Items/NPC/Quest) | FR10 | JSON/TS схеми за съдържание. | Validation pipeline спира при schema mismatch. |
|  | J.3 Authoring Tooling Preview | FR10 | Preview компонент за сцени. | Jest snapshot валидира Fact Spine/Choices. |
| K – Economy & Trade | K.1 Currency & Pricing Conversion | FR14 | Конвертира валута с reputation modifier. | Unit test: 10 ducats @ +15 rep → 11.5 tokens. |
|  | K.2 Weight & Encumbrance Feedback | FR14 | Показва overweight предупреждения. | Detox flow „Vendor bargain“ блокира CTA при overweight. |
|  | K.3 Barter / Vendor UX | FR14 | Manual Override при злоупотреба. | Manual Override CTA се активира и dry seal текст се показва. |
| L – Storage & Integrity | L.1 Adapter Routing (AsyncStorage/SQLite/MMKV) | FR19 | Правилно рутиране на save/volatile state. | Jest mock проверява `storageAdapter`. |
|  | L.2 Save Export & Backup | FR19 | Export pipeline + backup в player-data. | `save.exported` event + файл в `player-data/backups/`. |
|  | L.3 Integrity Monitor & Recovery | FR19 | Открива повредени save-ове. | e2e smoke "Corrupt save → Recovery CTA" възстановява успешно. |

**Инструкции:**
1. Създай 12 тикета (Story I.1–L.3) в тракера.
2. В описанието включи: линк към @/_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md (точните редове), FR номера и пълните acceptance критерии.
3. Задай спринт: Scenario/Content/Storage (Epic I/J/L) → Sprint 1; Economy/DLC → Sprint 2.

---

## 2. GuardianShell Definition of Ready / Done (шаблон)

### Definition of Ready (всяка задача трябва да има):
1. **Source Link** – линк към конкретната story + FR.
2. **Instrumentation** – подсекция със събития (пример: `telemetry.inventoryChange`, `journey.ctaTapped`, `storage.adapterUsage`, `telegraph.drySeal`).
3. **GuardianShell DoD Attached** – препратка към таблицата @/_bmad-output/planning-artifacts/implementation-readiness-report-2026-01-27.md#213-223.
4. **QA/Test Reference** – линк към релевантния тест план (виж секция 3).
5. **Dependencies Listed** – компоненти като JourneyTracker, GuardianShellProvider, storage adapters.

### Definition of Done (за отметка при приключване):
1. Occam Overlay tests – доказателство, че `overlaysVisible ≤ 2` (unit/Detox).
2. Telemetry verification – логовете за описаните събития са проверени.
3. Dry Seal & Accessibility – snapshot/автотестите за high-contrast и dry seal fallback са актуализирани.
4. Storage hooks (ако е приложимо) – `storage.adapterUsage` и integrity monitor са задействани.
5. Test evidence – приложени BDD/Detox/CLI резултати.
6. Documentation update – EPIC файлът е маркиран (напр. бележка „Implemented in Sprint 1“).

> **Препоръка:** В тракера създай template „GuardianShell Story“ с горните чеклист позиции за да избегнеш ръчно копиране.

---

## 3. QA / Test Charter Assignments

| Track | Stories | QA Owner | План за тестове |
|-------|---------|----------|------------------|
| Scenario Engine (Epic I) | I.1–I.3 | _(owner TBC)_ | BDD: „Given scene ACT1…“; Detox: StoryLoop навигация, history запис. |
| Content Data (Epic J) | J.1–J.3 | _(owner TBC)_ | CLI `yarn content:lint`; Jest snapshot за preview компонента. |
| Economy & Trade (Epic K) | K.1–K.3 | _(owner TBC)_ | Unit tests за conversion utils; Detox „Vendor bargain“ flow; edge case overweight. |
| Storage Integrity (Epic L) | L.1–L.3 | _(owner TBC)_ | Jest mocks за adapters; e2e „Corrupt save → Recovery CTA“; backup export проверка. |
| Triad Loop UX | Impact върху A–F stories | _(owner TBC)_ | Detox „Journey CTA → Battle → Map“; GuardianShell event assertions. |
| DLC & Namespacing | H stories + J.3 зависимост | _(owner TBC)_ | Unit tests за namespace helper; integration „DLC load → KPI chart“; rollback тест. |

**Стъпки:**
1. За всеки track назначи QA (може да е разработчик + QA pairing). Запиши имената в тракера и тук (замени `_(owner TBC)_`).
2. Добави в тикета секция „QA/Test Plan“ с линк към съответните BDD/Detox/CLI сценарии.
3. Прикачвай резултатите като коментари/артефакти при затваряне на задачата.

---

## 4. Следващи действия
1. Използвай този документ като чеклист при създаване на тикети.
2. Когато всички 12 задачи имат DoR/DoD и QA owners, отбележи критичните follow-ups като изпълнени.
3. Стартирай `/bmad:bmm:workflows:sprint-planning`, зареди agent `sm` и използвай тикетите за формиране на Sprint 1/2.
