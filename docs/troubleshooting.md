# Troubleshooting Guide

Collective knowledge base for the Expo/React Native workspace. Update this file whenever you solve a recurring issue.

## Install & Setup

| Problem | Resolution |
| --- | --- |
| `node-gyp` failures on Windows | Install Windows Build Tools (`npm install --global windows-build-tools`) or enable "Desktop development with C++" in Visual Studio Installer. Ensure Python 3.11 is on PATH. |
| Expo CLI asks to install pods on macOS | Run `npx pod-install` from `app/ios`. Requires CocoaPods (`sudo gem install cocoapods`). |
| Android emulator fails to boot | Enable hardware virtualization in BIOS; for AMD CPUs use Android Emulator Hypervisor Driver. |

## Running the App

| Problem | Resolution |
| --- | --- |
| Blank screen after Metro reload | Clear Expo cache: `expo start -c`. If persists, delete `.expo` and `node_modules`, reinstall. |
| `adb` device not found | Run `adb kill-server && adb start-server`, then `adb devices`. Ensure emulator or physical device is connected and authorized. |
| iOS bundler stuck on “Waiting for connection” | Close Simulator, run `xcrun simctl erase all`, relaunch via `npm run ios`. |

## Testing

| Problem | Resolution |
| --- | --- |
| Jest cannot find NativeAnimatedHelper | `app/jest.setup.js` mocks three module paths—verify they exist. Clear cache: `npm test -- --clearCache`. |
| `act(...)` warning spam | Wrap Zustand store mutations inside `act(() => store.setState(...))`. Render helpers in `src/test-utils` already handle SafeArea. |
| Coverage below threshold | Add unit tests for new branches; exclude navigation shell with `/* istanbul ignore file */` only when logic-free. |

## Git & Workflow

| Problem | Resolution |
| --- | --- |
| `LF will be replaced by CRLF` warnings | Configure git autocrlf: `git config core.autocrlf input` (recommended) or `false`. |
| Need to resync with `main` | `git fetch origin`, `git checkout main`, `git pull`, `git checkout feat/...`, `git rebase main`. Resolve conflicts, rerun tests. |

## BMAD / Workflow Automation

| Problem | Resolution |
| --- | --- |
| Missing workflow instructions | Open `.windsurf/workflows` for definitions (e.g., `/dev`, `/code-review`). Use `Cmd+P` → "windsurf workflows". |
| Unsure which Story is active | Check `_bmad-output/implementation-artifacts/sprint-status.yaml`. Update after each story. |

## Support

- **GuardianShell Systems:** ping the architecture channel on Slack (`#guardian-shell-dev`).
- **Expo issues:** search https://forums.expo.dev first.
- **BMAD operations:** refer to `practical-guid.md` and `docs/workflows.md` (same repo).

Log new discoveries below the relevant table to keep future developers unblocked.
