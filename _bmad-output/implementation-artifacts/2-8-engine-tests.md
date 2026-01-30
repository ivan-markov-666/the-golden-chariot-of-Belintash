# Story 2.8: Engine Tests

Status: in-progress

## Story

Като разработчик,
искам изчерпателни тестове за ядрото,
за да мога уверено да рефакторирам и надграждам механиките.

## Acceptance Criteria

1. [ ] Покритие ≥90% за ядрени услуги (ScenarioLoader, ConditionEvaluator, ConsequenceApplicator, VariableInterpolator, ChoiceProcessor, ScenarioCache).
2. [ ] Интеграционен тест покрива пълния изборен поток (skill check → consequences → зареждане на следващ сценарий).
3. [ ] Тестове за edge кейсове: липсващ сценарий, невалидни условия, провален ConsequenceApplicator, смърт на героя, cache eviction.
4. [ ] `npm run test -- --coverage` е зелен и публикуваните отчети показват покритието.
5. [ ] Story файлът и sprint-status са обновени с резултата.

## Tasks / Subtasks

- [ ] Task 1 – Аудит и планиране
  - [ ] Прегледай текущото покритие и идентифицирай липсващи кейсове.
  - [ ] Обнови story файла с план и dependencies.
- [ ] Task 2 – Unit тестове
  - [ ] ScenarioLoader/ScenarioCache: хитове, евикция, preload, helpers.
  - [ ] ConditionEvaluator: всички условни типове + explainFailure.
  - [ ] ConsequenceApplicator: всички consequence типове, rollback, warnings.
  - [ ] VariableInterpolator: formatter-и, conditional-и, грешки.
  - [ ] ChoiceProcessor: success/failure/death/errors/histories.
- [ ] Task 3 – Integration + Edge
  - [ ] Създай интеграционен тест за целия поток.
  - [ ] Покрий edge сценарии (missing scenario, invalid data, cache limits).
- [ ] Task 4 – Финализация
  - [ ] Пусни `npm run test -- --coverage` и провери че таргетите са изпълнени.
  - [ ] Обнови story статуса и sprint-status.

## Dev Notes

- Може да използваме тестови manifest-и и mock-ове за ускоряване.
- За интеграционния тест използвай real services с mock skill check.
- Следи за deterministic таймери (Date.now spy) за history/caching assertions.

## References

- @_bmad-output/planning-artifacts/epics/USER-STORIES-EPIC-02.md#3143-3207 – Story 2.8 описание
- @app/src/services/ScenarioCache.ts, @app/src/services/scenarioLoader.ts – кеш и loader
- @app/src/game/services/* – ядрени услуги
