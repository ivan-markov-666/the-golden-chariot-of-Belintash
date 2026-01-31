# Testing Guidelines

GuardianShell mandates reliable tests across unit, component, and integration layers. This document summarizes expectations and commands.

## Tooling

- **Runner:** Jest 29.x
- **Renderer:** React Native Testing Library 13.x
- **Snapshots:** Jest diff viewer; keep minimal and review carefully.
- **Mocks:** See `app/jest.setup.js` for AsyncStorage, NativeAnimatedHelper, and SafeArea helpers.

## Test Types

| Type | Location | Notes |
| --- | --- | --- |
| Component tests | `src/components/**/__tests__` | Use `@testing-library/react-native` render helpers |
| Screen tests | `src/screens/__tests__` | Include navigation mocks where needed |
| Store tests | `src/store/__tests__` | Reset Zustand stores between tests |
| Services tests | `src/services/**/__tests__` | Mock network/telemetry clients |
| Hooks tests | `src/hooks/__tests__` | Render via `renderHook`, assert notification state |

## Running Tests

```bash
cd app
npm test                     # single pass
npm test -- --watch          # rerun on file changes
npm test -- --runInBand      # stable CI mode
npm test -- --runInBand --coverage  # full suite w/ coverage (≈97.6/95.6/93.5/85.7 lines/statements/functions/branches – Jan 31 2026)
```

Add `--clearCache` if encountering stale transforms. For coverage runs, keep the console output (or HTML report under `coverage/`) attached to story hand-offs.

## Coverage Expectations

- **Global CI gate:** ≥70% statements/branches/lines/functions (latest run: 95.6% statements / 85.7% branches / 93.5% functions / 97.6% lines from `temp-coverage/coverage-summary.json`).
- **Core services goal:** ≥90% coverage for engine + store layers (Game/Character/Quest/UI + telemetry services). Re-run `npm test -- --runInBand --coverage` before handing off to confirm.
- **Feature:** touch every new branch or state in the feature under test.
- Exclude pure boilerplate (navigation container) via `/* istanbul ignore file */` where justified (see `AppNavigator.tsx`).

## Writing Reliable Tests

1. **Reset stores:** wrap `store.reset()` calls inside `act()` when using Zustand.
2. **Avoid timers:** prefer synchronous updates or `await waitFor` with tight timeouts.
3. **Use accessibility labels/testIDs** defined in the component for querying.
4. **Snapshot discipline:** snapshot only the minimal tree (e.g., Occam layout) and update intentionally.

## Example Pattern

```ts
import { render, fireEvent } from '@testing-library/react-native';
import { MainMenuScreen } from '../MainMenuScreen';

describe('MainMenuScreen', () => {
  it('navigates to LoadGame when Continue is selected', () => {
    const { getByTestId } = render(<MainMenuScreen />);
    fireEvent.press(getByTestId('menu-option-load'));
    expect(mockNavigate).toHaveBeenCalledWith('LoadGame');
  });
});
```

## Нови тестови пакети (Jan 31 2026)

- **ChoiceProcessor** (`app/src/services/__tests__/ChoiceProcessor.test.ts`): покрива skill-check пътищата (успех/неуспех, fallback при липсващи failure consequences, атрибутни бонуси) и пропагиране на ConsequenceApplicator warnings/events до резултата.
- **gameStore** (`app/src/store/__tests__/gameStore.test.ts`): нови сценарии за multi-day `advanceTime`, положителен clamp на `set/adjustRelationship` и персистентност на `loadGameState` през AsyncStorage слоя.
- **useSaveLoad hook** (`app/src/hooks/__tests__/useSaveLoad.test.ts`): покритие за success/error пътищата на `loadFromSlot`, `deleteSlot`, `recoverSlot`, с проверки за уведомления и error state.
- **SaveSlotOccam / perfStore / UX stores**: интеграционни тестове за perf guardrails (<16ms), telemetry за select/delete/recover/NG+, и guard-логика при липсващи визуални ефекти.

## Мокване и изчакване

- **AsyncStorage** – Jest setup вече предоставя mock; за интеграции (пример `gameStore`) изчакайте `await new Promise((resolve) => setTimeout(resolve, 0))`, за да се флашне persist слоя преди `getItem` проверки.
- **Zustand stores** – винаги ресетвайте чрез `act(() => store.getState().reset())`; за hook-ове (напр. `useSaveLoad`) използвайте `renderHook` и `waitFor` за стабилизиране на `loading` преди асерции.
- **Telemetry** – използвайте `jest.fn()` за `log*` методите и/или `subscribeToMenuTelemetry`, като отписвате слушателите след теста, за да се избегнат утечки.
- **Perf events** – mock-нете `useUXPerfEvents` или измерете чрез `performance.now` spies (виж `SaveSlotOccam` теста) и проверявайте, че последното събитие е в очаквания праг.
- **Async hooks** – при `useSaveLoad` всички публични методи минават през вътрешния `run` helper; проверявайте и `actionState`, и `useUIStore` нотификациите след `await act(...)`.

## Performance & Telemetry

Когато компонент логва telemetry или perf events (напр. `logMenuOpened`, `logSaveSlotSelected`), тествайте, че събитията се емитират. Използвайте helper-и като `subscribeToMenuTelemetry`, `useUXPerfEvents.getState()` и `waitFor`, за да уловите асинхронните ъпдейти.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `NativeAnimatedHelper` module not found | Ensure `jest.setup.js` mocks remain intact. Re-run `npm test -- --clearCache`. |
| `act(...)` warnings | Wrap all store mutations or async calls inside `act`. |
| Metro vs Jest conflicts | Run tests from a clean terminal (no Metro) to prevent port collisions. |

Document additional findings in `docs/troubleshooting.md` to keep knowledge centralized.
