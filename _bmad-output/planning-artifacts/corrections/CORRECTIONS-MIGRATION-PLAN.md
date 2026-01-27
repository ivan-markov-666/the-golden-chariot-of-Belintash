# План за миграция на BMAD документацията

## Цел
Да приложим всички корекции от пакета `claude-BMAD-files` върху основните документи, без да смесваме reference (user stories) с практическите ръководства. Планът следва указанията от `practical-guid.md` и документите `CONTENT-GUIDE-AND-REVIEW.md`, `CORRECTIONS-APPLICATION-GUIDE.md`, `CORRECTIONS-APPLIED.md`.

## Стратегия
1. **Запазваме структурата по папки** (`01-foundation`, `02-user-stories`, `03-corrections`, `04-summaries`, `05-guides`) — корекциите остават отделни от user stories.
2. **Приоритети**: първо „Important (Should Fix)“ от Content Guide, после „Nice to Have“.
3. **Винаги реферираме** `CORRECTIONS-APPLIED.md`, за да валидираме как трябва да изглежда крайната версия.
4. **След завършване** актуализираме съответните summary документи, за да показват, че корекциите са приложени.

## Последователност на файловете
1. **PRD-Golden-Chariot-Belintash.md** – добавяне на Section 11 (Monetization) и Section 5.6 (Accessibility).
2. **ARCHITECTURE-Golden-Chariot-Belintash.md** – MMKV за combat state, липсващ DB индекс, уточнена critical hit/miss логика, DLC compatibility.
3. **EPIC-BREAKDOWN-Golden-Chariot-Belintash.md** – Story 25.3 = 8 SP, 2 buffer спринта, dependency за Epic 20.
4. **LOCALIZATION-ARCHITECTURE.md** – pluralization rules + Weblate setup (optional, но препоръчително).
5. **FOUNDATION-COMPLETE.md / PROGRESS-SUMMARY-EPICS-1-3.md / EPIC-03-SUMMARY.md / EPIC-04-SUMMARY.md** – синхронизират новите решения (pricing, accessibility, timeline, dependencies).
6. **CORRECTIONS-BUNDLE.md / CORRECTIONS-SUMMARY.md / CORRECTIONS-APPLIED.md** – актуализирани бележки, версии и статус „Applied v1.1“.
7. **CONTENT-GUIDE-AND-REVIEW.md** – отбелязваме, че всички корекции са приложени.

## Чеклист
- [ ] Потвърдена структура на `golden-chariot-docs/` (user stories ≠ corrections).
- [ ] PRD: добавени монетизация и accessibility секции според `CORRECTIONS-APPLIED.md`.
- [ ] Architecture: включени MMKV, DB индекс, critical hit/miss уточнение, DLC compatibility.
- [ ] Epic Breakdown: Story 25.3 обновена, добавени 2 buffer спринта, dependency за Epic 20.
- [ ] Localization Architecture: pluralization + Weblate инструкции (ако са нужни за текущия езиков обхват).
- [ ] Summaries/Progress файлове: отразяват новите решения и статуса „corrections applied“.
- [ ] Corrections документи: `CORRECTIONS-BUNDLE`, `CORRECTIONS-SUMMARY`, `CORRECTIONS-APPLIED` имат актуални описания, дати и статуси.
- [ ] Content Guide: добавена бележка „All corrections applied (v1.1)“.
- [ ] Финален преглед срещу checklist-а от `CORRECTIONS-APPLICATION-GUIDE.md` (TypeScript/тестове/документация) – маркирано като изпълнено.

## Бележки
- Не прехвърляме съдържание от corrections директно в user stories; използваме ги като практическо ръководство.
- След всяка промяна правим кратко резюме в съответния summary документ, за да следим историята на корекциите.
- Ако възникнат нови препоръки, добавяме ги като отделни точки под „Optional Improvements“ в `CONTENT-GUIDE-AND-REVIEW.md`.
