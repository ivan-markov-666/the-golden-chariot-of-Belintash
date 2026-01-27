# Story 1.1: Main Menu Occam Entry

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a returning player,
I want да виждам всички основни опции (New Game, Continue, Load, Settings, Credits, Quit, DLC),
so that мога да започна правилния ритуал без излишни екрани.

## Acceptance Criteria

1. **Occam Overlay правило** – Main Menu + максимум още един контекстен панел се визуализират едновременно (дву-слоев лимит), без допълнителни слоеве за tooltips.  
2. **Storyteller tooltips** – Всяка основна опция има Witness Voice tooltip, които се показват/скриват без да нарушават Occam Overlay.  
3. **DLC gating** – DLC опциите са достъпни само при entitlement; без entitlement се показва заключено състояние + telemetry `menu.dlcLocked`.  
4. **Localization readiness** – Менюто наследява high-contrast тема и локализация от UX State Bus (Bulgarian/English), като layout остава центриран и четим.  
5. **Performance guardrail** – Зареждане на менюто и tooltips няма да добавя нови рендер цикли над 16 ms на mid-range устройство (референция FR8).  
6. **QA hooks** – Telemetry събитията `menu.opened`, `menu.optionSelected`, `menu.dlcLocked` се логват с идентификатор на избрания елемент.

## Tasks / Subtasks

- [ ] Task 1 – Изграждане на двуслоен Occam layout (AC1)  
  - [ ] Имплементиране на базов контейнер (StoryTile dock + втори слой)  
  - [ ] Snapshot тест, потвърждаващ максимум 2 слоя
- [ ] Task 2 – Witness Voice tooltips & локализация (AC2, AC4)  
  - [ ] Добавяне на tooltip компонент, наследяващ UX State Bus тема  
  - [ ] Покритие с i18n тест за BG/EN копия
- [ ] Task 3 – DLC gating & telemetry (AC3, AC6)  
  - [ ] Свързване към entitlement стор  
  - [ ] Логика за заключен state + dry seal копие  
  - [ ] Telemetry hooks за всяко действие
- [ ] Task 4 – Performance & QA automation (AC5)  
  - [ ] React Profiler или RN Performance test (<16 ms)  
  - [ ] Jest тест, валидиращ telemetry payload формата

## Dev Notes

- **Layout**: следва Occult Grid/GuardianShell описанието в ARCHITECTURE файла (Triad Loop – StoryTile dock + Occam overlay).  
- **State**: използвай UX State Bus за теми, high-contrast и overlaysVisible counter.  
- **Telemetry**: всички събития минават през GuardianShell telemetry bus `telemetry.menu.*`.  
- **Accessibility**: бутони ≥44×44 pt; tooltips достъпни чрез screen readers (VoiceOver/TalkBack).  
- **Testing**: snapshot за layout, unit тестове за entitlement gating, e2e (Detox) сценарий: отваряне на меню → избор на DLC без entitlement → проверка за dry seal текст.

### Project Structure Notes

- UI компонентите живеят под `src/components/ui/menu/`.  
- Telemetry helperите – `src/services/telemetry/menu.ts`.  
- Entitlement state – `src/store/dlc`.  
- Споделените теми идват от `src/theme/guardianShell`.

### References

- EPIC / Stories: `_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#116-142`.  
- UX Guardrails: `_bmad-output/planning-artifacts/ux-design-specification.md#223-315`.  
- Architecture Triad Loop: `_bmad-output/planning-artifacts/foundation/ARCHITECTURE-Golden-Chariot-Belintash.md#138-203`.

## Dev Agent Record

### Agent Model Used

_(за попълване по време на dev-story)_

### Debug Log References

### Completion Notes List

### File List
