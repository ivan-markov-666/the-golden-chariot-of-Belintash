# Story 2.7: Scenario Cache

Status: in-progress

## Story

Като играч,
искам сценариите да се зареждат бързо,
за да няма видими паузи между изборите ми.

## Acceptance Criteria

1. [ ] Създаден е `ScenarioCache` service с LRU логика (макс. 20 сценария, последно ползваните остават).
2. [ ] Кешът съхранява мета-данни (addedAt, lastAccess, hits) и ги обновява при `get`/`set`.
3. [ ] ScenarioLoader използва кеша за `loadScenario`, `isLoaded`, `clearCache`, `getCacheStats`.
4. [ ] Предоставени са helper-и за бъдещи analytics (`getStats`, `delete`, `has`).
5. [ ] Jest тестове покриват ≥85% от ScenarioCache (LRU, eviction, stats, integration със ScenarioLoader), `npm run test -- --coverage` е зелен.

## Tasks / Subtasks

- [ ] Task 1 – API & Implementation
  - [ ] Създай `app/src/services/ScenarioCache.ts` с публични методи `get`, `set`, `has`, `delete`, `clear`, `size`, `getStats`.
  - [ ] Имплементирай LRU (масив за access order, евикция при над лимит, възможност за custom размер за тестове).
  - [ ] Поддържай мета-данни за всеки entry (timestamps, hits) и ги обновявай при достъп.
- [ ] Task 2 – Интеграция
  - [ ] ScenarioLoader да използва ScenarioCache вместо директни Map-ове (`loadedScenarios`).
  - [ ] Добави helper функции `clearScenarioCache`, `getScenarioCacheStats`, reuse singleton cache.
- [ ] Task 3 – Тестове и документи
  - [ ] Напиши `ScenarioCache` unit тестове (LRU eviction, access order, stats, delete/clear, custom capacity).
  - [ ] Адаптирай ScenarioLoader тестовете за новата логика (кеш хитове, clear, stats).
  - [ ] Обнови story файла (този) със статус и референции, прикачи резултати в sprint-status при нужда.

## Dev Notes

- Capacity: по подразбиране 20, но позволи override за тестове (напр. 3).
- Използвай чисти структури (Map + массив) – не прибягвай до външни библиотеки.
- За analytics – `getStats` може да връща агрегирана информация (`entries`, `capacity`, `size`).
- ScenarioLoader остава single source за зареждане; кешът не прави I/O.

## References

- @_bmad-output/planning-artifacts/epics/USER-STORIES-EPIC-02.md#3058-3139 – Story 2.7 описание
- @_bmad-output/planning-artifacts/foundation/FOUNDATION-COMPLETE.md – резюме на епиците
- @app/src/services/scenarioLoader.ts – текущо зареждане и in-memory кеш
