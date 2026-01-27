# Code Style Guide

GuardianShell enforces a lightweight but strict set of guardrails so every story lands consistently.

## 1. Language & Syntax

- **TypeScript everywhere.** No `.js` in `src/`. Prefer `interface`/`type` definitions near usage or in `src/types` when shared.
- **Strict null checks.** Narrow types early and bail fast when optional data is missing.
- Prefer `const` over `let`; use `enum` only when string unions are insufficient.

## 2. React / React Native

- Functional components + hooks; no class components.
- Keep components small. Extract helpers into `components/` or `hooks/` folders when reused.
- Use `StyleSheet.create` and theme tokens from `src/theme/guardianShell.ts`.
- Accessibility: set `accessibilityRole`, `accessibilityState`, and `testID` for interactive elements.

## 3. State Management

- Zustand stores live under `src/state`. Each store exposes selectors (`(state) => state.foo`) to minimize re-renders.
- Reset helpers (e.g., `reset`) are required for tests.
- Avoid nested stores; if multiple stores are needed in a feature, compose them in a localized hook.

## 4. Theming & Localization

- Derive colors/spacing from `getGuardianShellTheme(highContrast)`.
- Text must come from localization files (`src/localization/**`). Add keys for BG/EN simultaneously.
- Use `t(locale, key)` within components; never hard-code copy.

## 5. File Organization

```
src/
├─ components/
│  ├─ menu/
│  ├─ save/
│  └─ shared UI
├─ screens/
├─ navigation/
├─ services/      # telemetry, haptics, etc.
├─ state/         # Zustand stores
├─ localization/
├─ theme/
└─ test-utils/
```

Group tests next to implementation under `__tests__` folders.

## 6. Naming

| Artifact | Example |
| --- | --- |
| Components | `MainMenuOccam.tsx` (PascalCase) |
| Hooks | `useSaveSlots.ts` |
| Zustand selectors | `useSaveSlots((state) => state.hasOccupied)` |
| Constants | `MENU_OPTIONS` (UPPER_SNAKE) |
| Types | `RootStackParamList` (PascalCase) |

## 7. Imports & Aliases

Alias usage (set in `tsconfig.json`):
- `@/navigation/*`
- `@/screens/*`
- `@/components/*`
- `@/state/*`
- `@/services/*`

Use relative imports only within the same folder depth when alias would be longer.

## 8. Telemetry & Analytics

- Whenever a user-visible action occurs, log via `src/services/telemetry/*` helpers first.
- Include contextual metadata (locale, entitlement, variant).

## 9. Error Handling

- Prefer guard clauses. Example:
  ```ts
  if (!hasSaves) {
    return;
  }
  ```
- In UI, disable interactions instead of throwing.
- For async flows, log to console for now (GuardianShell bus coming later).

## 10. Style Enforcement

- Run `npm test` before committing; ESLint/Prettier integration will arrive later but format manually using your IDE.
- Large diffs should include snapshots updated (`.snap`). Always inspect snapshot changes.

Remember: clarity > cleverness. If a block needs explanation, add a succinct comment.
