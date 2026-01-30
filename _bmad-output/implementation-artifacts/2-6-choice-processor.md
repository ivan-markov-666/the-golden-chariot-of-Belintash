# Story 2.6: Choice Processor

Status: done

## Story

Като играч,
искам правилно обработване на изборите ми,
за да може играта да реагира коректно на решенията ми.

## Acceptance Criteria

1. [x] `ChoiceProcessor.processChoice` валидира, че изборът е достъпен (ConditionEvaluator), изпълнява skill check при нужда и прилага съответните consequences (успех/провал) чрез ConsequenceApplicator. @app/src/services/ChoiceProcessor.ts#1-138
2. [x] Услугата зарежда следващия сценарий чрез ScenarioLoader (success/failure пътища), обновява `gameState.currentScenario` и логва запис в `scenarioHistory` със skill check резултат. @app/src/services/ChoiceProcessor.ts#140-170
3. [x] Смъртни случаи и други критични състояния (health ≤ 0, липсващ сценарий) се хендълват с ясни резултати (`death`, `error` и т.н.), а всички операции са атомарни (rollback при грешка). @app/src/services/ChoiceProcessor.ts#70-96
4. [x] Jest тестове покриват ≥90% от ChoiceProcessor (happy path success, failure, skill check, недостъпен избор, death, loader/ConsequenceApplicator грешки), и `npm run test` остава зелен. @app/src/services/__tests__/ChoiceProcessor.test.ts#1-220

## Tasks / Subtasks

- [x] Task 1 – API и основна логика
  - [x] Създай `app/src/services/ChoiceProcessor.ts` с публичен метод `processChoice` и helper-и за валидация, skill check, history logging. @app/src/services/ChoiceProcessor.ts#1-170
  - [x] Интегрирай ConditionEvaluator, ConsequenceApplicator и ScenarioLoader; добави guards за null сценарии и invalid вход.
- [x] Task 2 – Събития и телеметрия
  - [x] Добави запис в `gameState.scenarioHistory` (choice, timestamp, skill check резултат).
  - [ ] Подготви hook за telemetry/event emitter (може да е stub) за бъдещ UI feedback. *(deferred – не изисква промяна за AC, telemetry ще дойде с UI интеграция.)*
- [x] Task 3 – Тестове и документация
  - [x] Създай `app/src/services/__tests__/ChoiceProcessor.test.ts` с mock-ове на зависимостите и ≥90% coverage. @app/src/services/__tests__/ChoiceProcessor.test.ts#1-220
  - [x] Обнови story файла след изпълнение, TODO лист и sprint-status при нужда.

## Dev Notes

- При грешки по време на ConsequenceApplicator или ScenarioLoader трябва да хвърлим детайлна грешка и да оставим `gameState` в последователно състояние (разчитаме на атомарността на ConsequenceApplicator).
- Skill check helper може да се мокне; за сега използваме прост deterministic mock, докато нямаме реална dice логика.
- В сценарии без failure последствия използваме success последователността (fallback).

## References

- @_bmad-output/planning-artifacts/epics/USER-STORIES-EPIC-02.md#2971-3055 – Story 2.6 изисквания
- @app/src/game/services/ConsequenceApplicator.ts – Atomарни последствия
- @app/src/game/services/ConditionEvaluator.ts – Проверка на условия
- @app/src/services/ScenarioLoader.ts – Зареждане на сценарии
