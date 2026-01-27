# Contributing to The Golden Chariot of Belintash

Thank you for helping build the GuardianShell experience. This document summarizes everything you need to get productive within the first 30 minutes.

## 1. Prerequisites

| Tool | Required Version | Notes |
| --- | --- | --- |
| Node.js | 18.x or 20.x LTS | Match Expo SDK 54 requirements |
| npm | 9.x+ | Ships with Node LTS installers |
| Git | Latest stable | Configure SSH keys for pushes |
| Expo CLI | Installed via `npm install -g expo` | Optional but recommended |
| iOS toolchain | Xcode 15+ (macOS only) | Needed for iOS simulator |
| Android toolchain | Android Studio Flamingo+, SDK 33+ | Enable virtual device |

## 2. Repository Setup

```bash
# clone and enter workspace
git clone git@github.com:ivan-markov-666/the-golden-chariot-of-Belintash.git
cd the-golden-chariot-of-Belintash/app

# install dependencies
npm install

# launch Metro bundler (choose platform in Expo UI)
npm start
```

> **Tip:** keep the project root open in your editor so docs (`_bmad-output/`, `game-bible/`) stay one click away.

## 3. Branching & Commit Convention

1. Always branch off `main` using the story identifier:
   ```bash
   git checkout main
   git pull
   git checkout -b feat/story-1.6-dev-docs
   ```
2. Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` new gameplay feature
   - `fix:` bugfix
   - `docs:` documentation only
   - `test:` testing-only updates
3. Keep commits scoped to a single BMAD Story step (Mode Detection, Context, Execute, Self-check).

## 4. Coding Expectations

- TypeScript strict mode is enabled; avoid `any` unless documented.
- Prefer functional React components with hooks and memoization where needed.
- Use `StyleSheet.create` for styles; reserve inline styles for dynamic overrides only.
- Guard asynchronous flows with telemetry logging hooks (see `src/services/telemetry`).
- Localization strings live under `src/localization`; never hard-code display text.

Refer to `docs/code-style.md` for a deeper breakdown.

## 5. Testing Requirements

Before pushing, run:

```bash
npm test            # Jest + React Native Testing Library
npm run ios|android # if UI change needs manual validation
```

GuardianShell DoD requires ≥70 % coverage globally; keep `jest --coverage` green. Add regression tests in `src/**/__tests__` matching the file being touched.

## 6. Pull Request Checklist

- [ ] Story BMAD steps documented in PR description.
- [ ] Screenshots/videos attached for UI changes (use Expo Go or simulator).
- [ ] Tests added or updated; `npm test` passes locally.
- [ ] Localization keys added for new UI strings.
- [ ] Telemetry events reviewed to ensure analytics parity.
- [ ] Updated docs referenced in the PR summary.

## 7. Reporting Issues

1. Search existing GitHub Issues.
2. If new, include reproduction steps, expected vs actual, device/platform, and logs.
3. Tag `guardian-shell` label for any UX/performance regressions.

## 8. Getting Help

- **Architecture & lore:** see `_bmad-output/planning-artifacts/` and `game-bible/`.
- **Implementation guide:** `docs/development-setup.md` (created in Story 1.6).
- **BMAD methodology:** `practical-guid.md` plus `.windsurf/workflows/` definitions.

Welcome aboard! Review the onboarding checklist under `docs/onboarding-checklist.md` to make sure your environment matches the GuardianShell baseline.
