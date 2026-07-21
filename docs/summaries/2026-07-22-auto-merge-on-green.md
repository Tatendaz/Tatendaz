# Session: Auto-merge on green so the routine can self-verify

**Branch:** feat/auto-merge-on-green
**Date:** 2026-07-22

## Prompts
1. "merged" (PR #3)
2. "can you also allow aouto merge on green so an agent can check that changes
   it made are working"

## Steps taken
- Post-merge verification of PR #3: bot card-refresh commit landed, all asset
  URLs 200, health check green; found issues were disabled on the repo and
  enabled them (with Tatenda's confirmation) so the breakage-reporting flow
  works.
- Extended `readme-health-check.yml` to run on every PR as job `image-health`,
  failing red on broken images and validating repo-hosted assets from the
  checkout (raw/main would 404 for assets a PR adds).
- Enabled `allow_auto_merge` on the repo and created a ruleset requiring
  `image-health` on main, with bypass for the GitHub Actions app (daily bots
  push directly to main) and Repository admin.
- Used this branch's own PR as the empirical test: enabled auto-merge and
  confirmed it waited for image-health before merging.
- Updated the weekly Claude routine prompt: enable auto-merge on its fix PRs,
  wait for merge, re-verify the live profile, comment the outcome.

## Decisions
- Required check runs on all PRs (no paths filter) — a required context that
  never reports would block auto-merge forever.
- Non-strict status checks (branch need not be up to date) — avoids pointless
  re-runs on this low-traffic repo.
- Issue filing stays out of PR runs; a red check is the PR-side signal.
