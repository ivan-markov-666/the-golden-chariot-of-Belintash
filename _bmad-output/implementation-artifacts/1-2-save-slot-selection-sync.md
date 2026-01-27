# Story 1.2: Save Slot Selection & Sync

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a хроникьор,
I want да избирам между три save слота + New Game+,
so that мога да продължа историята или да започна нова с увереност.

## Acceptance Criteria

1. **Details overlay** – При избор на слот се появява втори слой (≤ Occam Rule), който показва timestamp, playtime, DLC flags и GuardianShell Witness Voice текст.  
2. **Corruption recovery CTA** – Ако слотът е повреден, се показва „Възстанови“ бутон; при натискане се тригърва GuardianShell сигнал `manualOverride.requested` и се логва `save.recoveryAttempt`.  
3. **One-handed reach** – Всички действия (Select, Delete, New Game+, Recover) са в reach зона ≤48 px от десния палец (портрет).  
4. **Manual/Auto save indicators** – Слотът визуализира последния тип запис (manual/auto) и синхронизира иконите с UX State Bus тема.  
5. **Telemetry** – `save.slotSelected`, `save.slotDeleted`, `save.recoveryAttempt`, `save.newGamePlus` изпращат payload с slotId, DLC state, timestamp.  
6. **Dry seal fallback** – Ако glow/haptic не са достъпни (offline, accessibility), показва се текстов dry seal и double haptic (където е наличен) вместо ефектите.

## Tasks / Subtasks

- [ ] Task 1 – UI & layout (AC1, AC3)  
  - [ ] Създаване на список със слотове (3 + New Game+)  
  - [ ] Details overlay (≤2 слоя) с GuardianShell тема
- [ ] Task 2 – State & telemetry (AC4, AC5)  
  - [ ] Свързване със save manager (AsyncStorage/SQLite/MMKV)  
  - [ ] Telemetry hooks + unit tests за payload
- [ ] Task 3 – Recovery & dry seal поведение (AC2, AC6)  
  - [ ] Manual Override CTA при корупция  
  - [ ] Dry seal fallback (текст + двойна вибрация)
- [ ] Task 4 – QA/Automation  
  - [ ] Detox тест: избор на повреден слот → recover CTA  
  - [ ] Snapshot тест за reach зони

## Dev Notes

- Слоевете следват Occam Overlay (StoryTile dock + slot list + overlay).  
- Save данните идват от storage adapter (Epic L изисквания) и трябва да включват DLC flags.  
- New Game+ трябва да използва Witness Voice подсказки за reset.  
- UX State Bus: наследява тема/contrast/фонт; telemetry shared bus.  
- Manual Override CTA се логва и показва dry seal копие по UX spec.

### Project Structure Notes

- UI: `src/components/ui/save/`.  
- Storage interaction: `src/services/storage/saveManager`.  
- Telemetry: `src/services/telemetry/save.ts`.  
- GuardianShell hooks: `src/components/guardianShell/` (overlay counters, dry seal helper).

### References

- Story A.2 изисквания: `_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md#131-142`.  
- GuardianShell DoD: `_bmad-output/planning-artifacts/implementation-readiness-report-2026-01-27.md#213-293`.  
- Storage integrity: `_bmad-output/planning-artifacts/foundation/ARCHITECTURE-Golden-Chariot-Belintash.md#288-351`.

## Dev Agent Record

### Agent Model Used

_(за попълване при dev-story)_

### Debug Log References

### Completion Notes List

### File List
