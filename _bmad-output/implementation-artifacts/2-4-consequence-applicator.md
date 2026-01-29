# Story 2.4: Имплементиране на Consequence Applicator

Status: ready-for-dev

<!-- Note: Validation е препоръчителна; пусни validate-create-story преди dev-story, ако има време. -->

## Story

Като разработчик на игра,
искам последователни и атомарни последствия,
за да може игровото състояние да се променя надеждно и да се връща назад при грешка.

## Acceptance Criteria

1. [ ] Атомарно прилага всички consequence типове (flag, counter, stat, skill, item, experience, health, mana, gold, relationship, unlock*, trigger_event, set_location) с единна транзакция и връща `ApplyResult`. @/_bmad-output/planning-artifacts/epics/USER-STORIES-EPIC-02.md#2741-2834
2. [ ] Създава snapshot на `GameState` и `PlayerCharacter` и изпълнява пълно rollback при грешка. @/_bmad-output/planning-artifacts/epics/USER-STORIES-EPIC-02.md#2764-2786
3. [ ] Обработва странични ефекти (level-up, смърт, специални събития) и изстрелва уведомления/събития за UI. @/_bmad-output/planning-artifacts/epics/USER-STORIES-EPIC-02.md#2778-2843
4. [ ] Поддържа гранични проверки (негативно здраве, relationship кап, inventory overflow) и логва предупреждения при невъзможни последствия. @/_bmad-output/planning-artifacts/epics/USER-STORIES-EPIC-02.md#2845-2849
5. [ ] Осигурява 95%+ unit тестово покритие, покриващо всеки consequence тип, rollback сценарии, side-effect логика и edge case-ове. @/_bmad-output/planning-artifacts/epics/USER-STORIES-EPIC-02.md#2845-2851

## Tasks / Subtasks

- [ ] Task 1 (AC: 1,2)
  - [ ] Дефиниране на `ConsequenceApplicator.apply`, snapshot/rollback помощници и транзакционна рамка.
  - [ ] Имплементиране на `applyConsequence` разклонения за всички consequence типове и споделени валидатори.
- [ ] Task 2 (AC: 3,4)
  - [ ] Side-effect hook-и (level-up, смърт, event notifications) и метрики/логове.
  - [ ] Guard логика за крайни стойности (health, relationships, inventory) и предупреждения за невалидни конфигурации.
- [ ] Task 3 (AC: 1,4,5)
  - [ ] Jest суит (unit + transactional) с покритие за всеки тип и rollback.
  - [ ] Edge-case тестове: отрицателно здраве, item overflow, неуспешен side-effect.

## Dev Notes

- Използвай вече дефинираните типове (`app/src/game/types/consequence.ts`, `gameState.ts`, `character.ts`) без дублиране. @app/src/game/types/consequence.ts#1-144
- Snapshot-ите трябва да са евтини (структурно клониране на shallow обекти + дълбоки колекции при нужда). Когато е възможно, използвай helper-и от `ConditionEvaluator` за споделена диагностика.
- Логването следва съществуващата конвенция (`console.debug`/`warn` + telemetry, без нови зависимости). @docs/architecture-overview.md#5-34
- Event известията може да използват наличния event bus (ако липсва, върни структура за бъдещо интегриране – напр. `ConsequenceEvents` enum).
- Числовите корекции винаги clamp-ват според домейн (health ≥ 0, relationships [-100,100], mana ≥ 0, inventory ≥ 0).

### Project Structure Notes

- Сервисът се намира под `app/src/game/services/ConsequenceApplicator.ts`, редом с ConditionEvaluator/ScenarioLoader. @docs/architecture-overview.md#16-58
- Тестовете се поставят в `app/src/game/services/__tests__/ConsequenceApplicator.test.ts` и използват mock състояния от `test-utils` (ако липсва, създай локални helper-и).
- Публичният API включва `apply`, `applyConsequence` (internal), `createSnapshot`, `rollback`, както и тип `ApplyResult` за error reporting.

### References

- @_bmad-output/planning-artifacts/epics/USER-STORIES-EPIC-02.md#2741-2851 – Story 2.4 пълно описание
- @docs/architecture-overview.md#5-58 – архитектурни ограничения
- @app/src/game/types/consequence.ts#1-144 – consequence типове и schema

## Dev Agent Record

### Agent Model Used

- Pending

### Debug Log References

- Pending

### Completion Notes List

1. _Pending_

### File List

- [ ] `app/src/game/services/ConsequenceApplicator.ts`
- [ ] `app/src/game/services/__tests__/ConsequenceApplicator.test.ts`
- [ ] `app/src/game/types/consequence.ts`
- [ ] Други съпътстващи файлове (документация/utility) – ще се конкретизират при нужда

## Status

- Story: ready-for-dev
- Tests: not-started
- Docs: up-to-date (epic reference)
