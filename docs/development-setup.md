# Development Setup Guide

This guide walks a new developer from clone to running the Expo app within ~30 minutes.

## 1. Clone & Install

```bash
git clone git@github.com:ivan-markov-666/the-golden-chariot-of-Belintash.git
cd the-golden-chariot-of-Belintash/app
npm install
```

> If you use HTTPS, replace the SSH URL accordingly. Configure your SSH key before pushing.

## 2. Environment Requirements

| Component | Version | Notes |
| --- | --- | --- |
| Node.js | 18.x or 20.x LTS | Use `nvm`/`fnm` to switch quickly |
| npm | 9.x+ | Bundled with Node installers |
| Expo CLI | Latest | `npm install -g expo` |
| Java JDK | 17+ | Needed for Android builds |
| Android Studio | Flamingo or newer | Install SDK 33 & HAXM/Hypervisor |
| Xcode | 15+ (macOS) | Accept licenses via `sudo xcodebuild -license` |

## 3. Project Structure

```
/ (repo root)
├─ app/                # Expo workspace (all code lives here)
├─ docs/               # Developer docs (this guide, style, tests, etc.)
├─ game-bible/         # Narrative & lore artifacts
├─ _bmad-output/       # Planning + BMAD deliverables
└─ .windsurf/workflows # BMAD automation steps
```

Work inside `app/` for all commands.

## 4. Running the App

```bash
cd app
npm start              # Opens Expo CLI
# press "i" for iOS simulator (macOS)
# press "a" for Android emulator
```

### Device Tips
- **Android:** launch Android Studio → Virtual Device Manager → start emulator before `npm start`.
- **iOS:** open Simulator via Xcode → `Xcode > Open Developer Tool > Simulator`.

## 5. Useful Scripts

| Command | Description |
| --- | --- |
| `npm start` | Metro bundler + Expo DevTools |
| `npm run ios` | Shortcut to `expo start --ios` |
| `npm run android` | Shortcut to `expo start --android` |
| `npm test` | Jest suite (runs in-band in CI) |

Add `--clear` when testing flaky mocks locally.

## 6. Editor Setup

- Install the **ESLint**, **Prettier**, and **TypeScript** extensions.
- Enable "Format on Save" to keep styles aligned with repo defaults.
- Consider using WindSurf’s `.windsurf/workflows` for BMAD guidance.

## 7. Secrets & Config

- No secrets are required locally; telemetry is mocked.
- Future GuardianShell APIs will use `.env`; do *not* commit `.env` files.

## 8. Next Steps

1. Read `docs/onboarding-checklist.md` to verify toolchain.
2. Review `docs/code-style.md` and `docs/testing.md` prior to submitting code.
3. Follow `docs/workflows.md` for branching, BMAD steps, and release cadence.
