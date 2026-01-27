# Common Workflows

This document explains day-to-day flows so contributors can mirror the BMAD methodology used in this repo.

## 1. Dev Story Cycle (BMAD Quick-Dev)

Each user story is executed via four steps:

1. **Step 01 – Mode Detection:** confirm scope, dependencies, branch name.
2. **Step 02 – Context Gathering:** read specs, inspect code, capture notes.
3. **Step 03 – Execute:** implement changes + tests.
4. **Step 04 – Self-check & Report:** run tests, summarize, request review.

Document each step in the PR description or comments.

## 2. Branching & Git Flow

1. Sync `main`:
   ```bash
   git checkout main
   git pull origin main
   ```
2. Create feature branch: `git checkout -b feat/story-<story-id>-<slug>`.
3. After completing the story:
   ```bash
   git status -sb
   git add <files>
   git commit -m "feat: summary (story X.Y)"
   git push -u origin feat/story-...
   ```
4. Create PR targeting `main`. Include:
   - Story ID + checklist of BMAD steps.
   - Test results (command + output). 
   - Screens/videos for UI updates.
5. After approval, squash/merge via GitHub UI; delete branch.

## 3. Testing Workflow

1. `npm test -- --runInBand` before every push.
2. Update/inspect snapshots.
3. If coverage dips, add tests immediately; do not rely on reviewers.

## 4. Release / Sprint Workflow

1. At story completion update `_bmad-output/implementation-artifacts/sprint-status.yaml` with status.
2. Notify PM via `/pm` workflow (see `.windsurf/workflows`).
3. For builds (future stories) use EAS: `eas build -p ios|android`.

## 5. Documentation Workflow

- When new capabilities arrive, update relevant `docs/*.md` plus `CONTRIBUTING.md`.
- Mention doc changes in commit message (`docs:`) if no code modifications.

## 6. Support & Escalation

- Discuss blockers in `#guardian-shell-dev` Slack channel.
- File GitHub Issues for bugs discovered outside current story.

Reference `.windsurf/workflows/*.md` for automation macros (e.g., `/dev`, `/code-review`).
