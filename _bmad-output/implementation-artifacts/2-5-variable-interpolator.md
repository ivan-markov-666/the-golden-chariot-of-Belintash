# Story 2.5: Variable Interpolation

Status: done

<!-- Note: Validation е препоръчителна; пусни validate-create-story преди dev-story, ако има време. -->

## Story

Като автор на съдържание,
искам динамичен текст с променливи,
за да мога да реферирам герой, ресурси и състояние на света без ръчно дублиране.

## Acceptance Criteria

1. [x] `VariableInterpolator.interpolate` заменя всички `{{variable}}` шаблони в низ с реални стойности от `GameState` и `PlayerCharacter`, като поддържа минимум `playerName`, `gold`, `level`, `health`, `maxHealth`, `location`, `day`, `gameTime.hour` и безопасно връща оригиналния placeholder за непознати ключове. @_bmad-output/planning-artifacts/epics/USER-STORIES-EPIC-02.md#2855-2968
2. [x] Поддържа филтри `|number`, `|upper`, `|lower` със съответното форматиране (локализирани числа с хилядни, промяна на регистъра) и позволява лесно разширяване с нови филтри. @_bmad-output/planning-artifacts/epics/USER-STORIES-EPIC-02.md#2881-2952
3. [x] Поддържа условни конструкции `{{flag:flag_name|text_if_true|text_if_false}}`, като използва булевите флагове в `gameState.flags` и дефолтно връща празен низ, ако липсва false текст. @_bmad-output/planning-artifacts/epics/USER-STORIES-EPIC-02.md#2901-2910
4. [x] Интерполаторът приема `i18n` helper (може да е mock) и гарантира, че всички резултати са string, няма JSON injection/undefined, и има 80%+ Jest покритие (unit тестове за всеки шаблон). @_bmad-output/planning-artifacts/epics/USER-STORIES-EPIC-02.md#2966-2968

## Tasks / Subtasks

- [x] Task 1 (AC: 1)
  - [x] Дефинирай `VariableInterpolator` под `app/src/game/services` с API `interpolate(text, gameState, character, i18n)` и regex за откриване на `{{...}}` placeholders.
  - [x] Имплементирай `getSimpleVariable`/helper-и, които връщат стойности от `GameState`/`PlayerCharacter`, с лог предупреждение за непознат ключ.
- [x] Task 2 (AC: 2,3)
  - [x] Добави поддръжка на форматери `|number|upper|lower` чрез отделен formatter map и guard-ове срещу невалидни данни.
  - [x] Реализирай условни `flag:` изрази с тримване на части и дефолт стойности.
- [x] Task 3 (AC: 4)
  - [x] Jest тестове в `app/src/game/services/__tests__/VariableInterpolator.test.ts`, покриващи happy-path, непознати променливи, форматери и флаг условности.
  - [x] Документирай примерна употреба и интеграция с бъдещия ChoiceProcessor/Scenario renderer.

### Dev Notes

- Имплементацията следва структурата на `ConditionEvaluator`/`ConsequenceApplicator` – новият файл е `app/src/game/services/VariableInterpolator.ts`. @app/src/game/services/VariableInterpolator.ts#1-138
- `PlayerCharacter` вече включва `name`, за да се покрие `{{playerName}}` placeholder (актуализирано в типовете + тестовите mock-ове). @app/src/game/types/character.ts#33-44 @app/src/game/services/__tests__/ConditionEvaluator.test.ts#184-207
- Интерполаторът поддържа conditional-и и форматери чрез отделни helper-и (`resolveFlagConditional`, `formatValue`), което улеснява бъдещата употреба в ChoiceProcessor. @app/src/game/services/VariableInterpolator.ts#35-134
- Локалното форматиране използва `Intl.NumberFormat('bg-BG')`, но може да бъде override-нато чрез подаден `i18n.formatNumber`. @app/src/game/services/VariableInterpolator.ts#8-131
- Jest тестовете покриват всички placeholder-и, форматери и edge-case-ове с 100% покритие за файла. Глобалният `npm test` пада на историческото 70% coverage изискване (всички останали файлове имат ~6%), но таргетираният суит минава зелено. @app/src/game/services/__tests__/VariableInterpolator.test.ts#1-85

### Project Structure Notes

- Файлът живее под `app/src/game/services/VariableInterpolator.ts`, редом с ConditionEvaluator и ConsequenceApplicator, за да се спазят слоевете от Architecture Overview. @docs/architecture-overview.md#16-58
- Тестовете са под `app/src/game/services/__tests__/VariableInterpolator.test.ts` и могат да споделят mock helper-и с `ConditionEvaluator.test.ts`.
- Експортирай helper-и (`resolveVariable`, `formatValue`) само ако са нужни за тестове; иначе ги пази private.

### References

- @_bmad-output/planning-artifacts/epics/USER-STORIES-EPIC-02.md#2855-2968 – Story 2.5 изисквания
- @docs/architecture-overview.md#5-58 – архитектурни насоки
- @app/src/game/services/ConditionEvaluator.ts – пример за service структура

## Dev Agent Record

### Agent Model Used

- Pending

### Debug Log References

- `npm test -- --runTestsByPath src/game/services/__tests__/VariableInterpolator.test.ts` (успешен суит; глобалният run пада на coverage threshold)

### Completion Notes List

1. ✅ Изграден е `VariableInterpolator` със статични helper-и за прости променливи, форматери и условни placeholder-и.
2. ✅ Написани са Jest тестове, които покриват всички AC (вкл. warning-и и default formatters); global coverage gate остава проблем на проекта.
3. ✅ Story файлът е обновен с learnings и статус – готово за review/dev-story handoff.

### File List

- [ ] `app/src/game/services/VariableInterpolator.ts`
- [ ] `app/src/game/services/__tests__/VariableInterpolator.test.ts`
- [ ] Допълнителни helper-и/типове при нужда

## Status

- Story: done
- Tests: completed (targeted Jest run green; global coverage gate pending separate initiative)
- Docs: up-to-date (epic reference)
