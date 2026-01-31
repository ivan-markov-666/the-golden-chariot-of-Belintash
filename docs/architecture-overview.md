# Architecture Overview

This document summarizes the implementation-facing view distilled from the BMAD architecture package. For full detail read `_bmad-output/planning-artifacts/foundation/ARCHITECTURE-Golden-Chariot-Belintash.md`.

## Tech Stack

| Area | Choice |
| --- | --- |
| UI | Expo + React Native 0.81 + TypeScript |
| State | Zustand stores per domain (uxState, saveSlots, entitlements, perf) |
| Navigation | `@react-navigation/native-stack` with SafeArea integration |
| Styling | GuardianShell palette + `StyleSheet.create` |
| Telemetry | Local logging via `src/services/telemetry/*` (GuardianShell bus later) |
| Haptics | `expo-haptics` fallback service `drySeal.ts` |

## Layering

```
app/
├─ src/
│  ├─ components/      # Occam layout pieces (menus, save slots)
│  ├─ screens/         # Screen wrappers (MainMenuScreen, LoadGameScreen)
│  ├─ navigation/      # Stack navigator definitions
│  ├─ services/        # Telemetry, haptics, guardian shell bridges
│  ├─ state/           # Zustand stores
│  ├─ localization/    # BG/EN strings
│  ├─ theme/           # GuardianShell palette + helpers
│  └─ test-utils/      # Shared testing helpers
├─ assets/             # Backgrounds, icons
├─ jest.setup.js       # Testing bootstrap
└─ App.tsx             # Root entry (SafeAreaProvider + AppNavigator)
```

## Data Flow

1. **Screens** compose Occam components and orchestrate navigation + background effects.
2. **Occam components** handle UI logic, states (active option), telemetry logging, and read-only data from Zustand stores.
3. **State stores** (`useSaveSlots`, `useUXState`, etc.) encapsulate domain data and expose derived selectors.
4. **Telemetry services** abstract logging so future GuardianShell bus integration is centralized.
5. **Theme/localization** functions supply color/copy tokens down the tree.

## Relationship System (Story 3.5)

- **GameState payload** – `relationships: Record<string, number>` за актуалните стойности (-100 до +100), `relationshipMetadata` за история/етапи и `factionReputation` за репутация по региони.
- **RelationshipService** – централен helper (`app/src/game/services/RelationshipService.ts`) с:
  1. `getRelationshipLevel` – картографира афинитета към нива (enemy…close);
  2. `adjustWithDecay` – дрейф към неутрално (0.5 точки/ден) преди нова делта;
  3. `applyDelta` – комбинира decay, clamp, записва history (timestamp, reason, location) и обновява `lastInteractionDay`/milestones;
  4. `meetsRelationshipRequirement` – удобна проверка за gating.
- **ConsequenceApplicator integration** – `relationship` последствията вече използват `RelationshipService.applyDelta`, което гарантира decay + попълване на метаданните и генериране на `relationship_change` event.
- **ConditionEvaluator** продължава да чете `gameState.relationships`, така че новата система е прозрачно съвместима със съществуващите условни проверки.

## Build & Deployment

- Expo-managed workflow for development; EAS Build to ship platform binaries (to be configured in future stories).
- Testing executed via Jest; CI will run `npm test -- --runInBand` (Story 1.3 already added configuration).

## Upcoming Work

- Story 1.5/1.6 extend main menu + documentation.
- Story 1.2 will introduce Save Slot sync Occam components.
- Future epics add GuardianShell Manual Override, scenario runner, and telemetry backends.

## References

- `_bmad-output/planning-artifacts/foundation/IMPLEMENTATION-GUIDE.md`
- `_bmad-output/planning-artifacts/foundation/ARCHITECTURE-Golden-Chariot-Belintash.md`
- `game-bible/` for lore-driven copy.

Keep this doc updated when the architecture evolves (new state stores, services, or navigation shells).
