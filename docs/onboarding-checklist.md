# Onboarding Checklist

Follow this checklist to ensure your environment is GuardianShell-ready before touching code.

## Accounts & Access

- [ ] GitHub access confirmed (`ivan-markov-666/the-golden-chariot-of-Belintash`)
- [ ] SSH key added to GitHub profile
- [ ] Expo account created (optional but recommended for device builds)

## Toolchain

- [ ] Node.js 18.x or 20.x installed (`node -v`)
- [ ] npm 9.x+ installed (`npm -v`)
- [ ] Expo CLI installed globally (`npm install -g expo`)
- [ ] Android Studio installed with SDK 33 & emulator
- [ ] (macOS) Xcode 15+ installed and licenses accepted
- [ ] VS Code / WindSurf configured with ESLint + Prettier extensions

## Repository

- [ ] Repository cloned locally
- [ ] `npm install` succeeds inside `app/`
- [ ] `npm start` launches Expo DevTools without errors
- [ ] Android and/or iOS simulator launches the app splash screen

## Documentation Review

- [ ] Read `CONTRIBUTING.md`
- [ ] Read `docs/development-setup.md`
- [ ] Read `docs/code-style.md`
- [ ] Read `docs/testing.md`
- [ ] Read `docs/troubleshooting.md`
- [ ] Skim `docs/architecture-overview.md`

## BMAD Workflow Familiarity

- [ ] Reviewed `practical-guid.md` for BMAD expectations
- [ ] Opened `.windsurf/workflows` and inspected `/dev`, `/code-review`, `/pm`
- [ ] Located `_bmad-output/implementation-artifacts/sprint-status.yaml`

## Verification

- [ ] `npm test` passes locally
- [ ] Git configured with user name/email (`git config user.name`)
- [ ] Default branch tracked (`git remote -v`)

Keep this checklist updated if new prerequisites are introduced.
