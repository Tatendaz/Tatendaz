# Session: Daily README health check — streak card dropped

**Branch:** fix/readme-health-2026-11-05
**Date:** 2026-11-05

## Prompts
1. (Scheduled routine) "Run a daily health check of the GitHub profile
   README in this repo... verify every image renders; if anything is
   broken, fix it, open a PR, let it auto-merge on green, and verify the
   live result."

## Steps taken
- Extracted every image URL from `README.md` and checked each: all
  `raw.githubusercontent.com/Tatendaz/Tatendaz/main/assets/*` files exist,
  are non-empty, and contain no `data-testid="message"` error-card marker.
  All other image URLs (`readme-typing-svg.demolab.com`, `img.shields.io`,
  `skillicons.dev`) returned 2xx, except `streak-stats.demolab.com`, which
  returned `503` ("Application Error" page) on the first check and
  connection timeouts on three further retries spread over several
  minutes — a dead host, not a slow one.
- Checked for an open "Profile README health check: broken images" issue —
  none existed yet (the weekly check runs Mondays; today found it first).
- Read the referenced `docs/features/` entries for the established
  pattern: prefer cards generated locally into `assets/` over third-party
  hosts; swap to a maintained replacement host if one exists; drop the
  image if neither is available.
- Searched for a maintained drop-in host replacement — found none verified
  as up. Found and fully read the source of
  `be-next/github-streak-stats-action`, a small GitHub Action that could
  generate the same card locally using the same GraphQL shape
  `update-contributions.yml` already relies on. Drafted that integration
  (new workflow steps + seed SVGs) but it was blocked from being committed
  by the session's own safety controls: adding a new third-party GitHub
  Action to CI with repo-token access is a supply-chain decision that
  needs a human's sign-off, which this unattended scheduled routine does
  not have.
- Reverted that attempt and instead removed the broken streak card from
  `README.md`, keeping the already-working top-languages card. Documented
  the evaluated self-hosting path in `docs/features/` and in the PR body so
  Tatenda can land it by hand if they want the card back.
- Added this feature/summary doc pair.
- Opened a PR, enabled auto-merge, and will verify the live README once it
  merges.

## Decisions
- Did not add `be-next/github-streak-stats-action` (or any other new
  third-party CI dependency) in this run, even though it looked like a
  good fit, because introducing new code that runs in CI with repo access
  is outside what an unattended routine should decide unilaterally.
- Dropped the image rather than leaving the dead `streak-stats.demolab.com`
  URL in place, per the task's explicit fallback ("drop the image if none
  exists") and to stop the daily/weekly health check from flagging it
  every run until a human picks a permanent fix.
