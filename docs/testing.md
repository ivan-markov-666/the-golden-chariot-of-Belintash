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

## Running Tests

```bash
cd app
npm test                 # single pass
npm test -- --watch      # rerun on file changes
npm test -- --runInBand  # stable CI mode
npm run test -- --coverage  # full suite w/ coverage (≈89% lines as of Jan 31, 2026)
```

Add `--clearCache` if encountering stale transforms. For coverage runs, keep the console output (or HTML report under `coverage/`) attached to story hand-offs.

## Coverage Expectations

- **Global CI gate:** ≥70% statements/branches/lines/functions (currently ~88/70/89/96%).
- **Core services goal:** ≥90% coverage for engine + store layers (Game/Character/Quest/UI + telemetry services). Re-run `npm run test -- --coverage` before handing off to confirm.
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

## Performance & Telemetry

When a component logs telemetry or perf events (e.g., `logMenuOpened`), assert that the event is emitted. Subscribe via helper functions (`subscribeToMenuTelemetry`) and unsubscribe after the test.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `NativeAnimatedHelper` module not found | Ensure `jest.setup.js` mocks remain intact. Re-run `npm test -- --clearCache`. |
| `act(...)` warnings | Wrap all store mutations or async calls inside `act`. |
| Metro vs Jest conflicts | Run tests from a clean terminal (no Metro) to prevent port collisions. |

Document additional findings in `docs/troubleshooting.md` to keep knowledge centralized.
