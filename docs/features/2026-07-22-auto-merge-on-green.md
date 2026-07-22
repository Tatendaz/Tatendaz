# Feature: Auto-merge on green for README fix PRs

**Branch:** feat/auto-merge-on-green
**Date:** 2026-07-22

## Summary
Makes the README health check a meaningful PR gate so fix PRs (including the
weekly Claude routine's) can auto-merge once it passes: the check now runs on
every PR, fails red on broken images, and validates repo-hosted assets from
the PR's own checkout. Repo-side, auto-merge is enabled and a ruleset on main
requires the `image-health` check, with a bypass for the GitHub Actions app so
the daily card/contribution bots can keep pushing directly to main.

## Motivation
Tatenda wants the weekly fix routine to merge its own verified PRs and then
confirm the live profile is healthy, without a human in the loop. Auto-merge
"on green" only works if a required status check exists and runs on every PR —
previously no workflow ran on PRs at all.

## What changed
- `.github/workflows/readme-health-check.yml`:
  - New `pull_request` trigger (no paths filter — a required check must
    produce a result on every PR or auto-merge would wait forever).
  - Job renamed `check` → `image-health` (the required-check context).
  - `raw.githubusercontent.com/Tatendaz/Tatendaz/main/...` URLs are now
    validated against the checked-out file instead of curled, so a PR adding a
    new asset isn't failed for the asset not being on main yet.
  - On PRs, broken images fail the job (red check); the issue-filing and
    issue-closing steps only run for schedule/push/dispatch events.
  - Concurrency group is per-ref so PR runs don't queue behind main runs.
  - Runtime hard-bounded for a required check: `timeout-minutes: 25` on the
    job, 12s per curl attempt under a 45s per-URL ceiling, local paths guarded
    against traversal outside the checkout (regular files only), and a
    fail-closed cap of 25 URLs — overflow marks the check broken rather than
    silently skipping URLs (25 × 45s ≈ 19 min worst case fits the budget).
- `update-readme-cards.yml` / `update-contributions.yml`: the daily bots now
  push via a write deploy key (`ACTIONS_DEPLOY_KEY` secret) instead of
  `GITHUB_TOKEN` — GitHub rejects the Actions app as a ruleset bypass actor on
  personal repos, and deploy keys are the supported bypass class, so this is
  what lets the bots keep pushing to main under the required check. The key is
  scoped to the push step only (written under `umask 077`, used via
  `GIT_SSH_COMMAND`, removed after) — checkout stays credential-free so the
  third-party card actions never see it, and both workflows' `GITHUB_TOKEN`
  drops to `contents: read`.
- Repo settings (not in git): `allow_auto_merge` enabled; ruleset
  "main: require image-health" targeting the default branch with a
  `required_status_checks` rule (context `image-health`, non-strict) and
  bypass actors: GitHub Actions app (for the daily bots' direct pushes) and
  Repository admin (for Tatenda's own direct pushes).
- The weekly routine's prompt now tells it to enable auto-merge on its fix PR
  (`gh pr merge --auto --squash`), wait for the merge, then re-verify the
  live README and comment the result on the PR.

## Notes
- Auto-merge waits for the required check even for admin-authored PRs; admin
  bypass only applies when explicitly chosen in the UI (verified empirically
  on this PR — enabling auto-merge did not merge until image-health passed).
- Issues were enabled on the repo (2026-07-22) so the non-PR issue flow works.
- If a future workflow renames the `image-health` job, the ruleset context
  must be updated in the same change or every PR will block.
