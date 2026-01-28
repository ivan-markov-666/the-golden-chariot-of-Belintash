# the-golden-chariot-of-Belintash
A text-based RPG with a focus on real stories, places and events.

Настоящото репо съдържа пълния **BMAD** планиращ пакет и game bible-a, което означава, че проектът официално е готов за старт на имплементацията.

## Какво е готово
- **Game Bible** – сценарии, герои и лор (директория `game-bible/`).
- **PRD** – `_bmad-output/planning-artifacts/foundation/PRD-Golden-Chariot-Belintash.md`.
- **UX Design Spec** – `_bmad-output/planning-artifacts/ux-design-specification.md`.
- **Architecture** – `_bmad-output/planning-artifacts/foundation/ARCHITECTURE-Golden-Chariot-Belintash.md`.
- **Epic Breakdown + Stories** – `_bmad-output/planning-artifacts/foundation/EPIC-BREAKDOWN-Golden-Chariot-Belintash.md` + `epics/`.
- **Implementation Readiness Report** – `_bmad-output/planning-artifacts/implementation-readiness-report-2026-01-27.md` (Steps 1–6 завършени).
- **Workflow Status** – `_bmad-output/planning-artifacts/bmm-workflow-status.yaml` (всички Solutioning етапи приключени, текуща фаза: Implementation).
- **Sprint Tracking** – `_bmad-output/implementation-artifacts/sprint-status.yaml` (Epic 1 е *in-progress*, stories 1-1 и 1-2 са готови за разработка).

## Старт на имплементацията
1. Изпълни `/bmad:bmm:workflows:dev-story` за story `1-1-main-menu-occam-entry` или `1-2-save-slot-selection-sync`.
2. Кодът на UI частта все още трябва да бъде инициализиран (Next.js/React Native според архитектурата); тази стъпка е част от първите stories.
3. След приключване на story → обнови `sprint-status.yaml` и пусни code-review workflows.

## Следващи стъпки
- Работещи dev-story цикли за Epic 2.

## Developer Documentation
- [`CONTRIBUTING.md`](./CONTRIBUTING.md)
- [`docs/development-setup.md`](./docs/development-setup.md)
- [`docs/code-style.md`](./docs/code-style.md)
- [`docs/testing.md`](./docs/testing.md)
- [`docs/troubleshooting.md`](./docs/troubleshooting.md)
- [`docs/architecture-overview.md`](./docs/architecture-overview.md)
- [`docs/onboarding-checklist.md`](./docs/onboarding-checklist.md)
- [`docs/common-workflows.md`](./docs/common-workflows.md)