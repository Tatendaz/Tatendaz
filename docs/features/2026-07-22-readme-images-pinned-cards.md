# Feature: Fix broken streak card, pin cards for all pinned repos, weekly health check

**Branch:** fix/readme-images-pinned-cards
**Date:** 2026-07-22

## Summary
Fixes the one broken image on the profile (the streak card, whose
`github-readme-streak-stats.herokuapp.com` host is dead), replaces the
"What I'm working on now" list with locally generated pin cards for all five
pinned repos, and adds a weekly health-check workflow that files an issue
whenever any README image URL stops resolving.

## Motivation
The profile showed a broken-image icon for the streak card: the shared Heroku
instance no longer exists (Heroku ended free dynos; the maintained instance is
`streak-stats.demolab.com`). This is the second third-party card host to die
(see 2026-07-13-profile-langs-card-yapui.md for the Vercel one), so beyond the
one-line fix this change extends the local-generation pattern to all pin cards
and adds monitoring so the next dead host is caught by automation instead of a
visitor.

## What changed
- `README.md`: streak card now points at `streak-stats.demolab.com` (working
  maintained instance) instead of the dead Heroku host.
- `README.md`: "What I'm working on now" now shows pin cards for all five
  pinned repos (yapui, langchain-fde-curriculum, Vergance, claude-usage,
  promptups); the stale bullet list (Quant Backtest Platform, Learning line)
  is removed per Tatenda's request.
- `assets/pin-{langchain-fde-curriculum,vergance,claude-usage,promptups}.svg`:
  seed renders templated from `pin-yapui.svg` (the public Vercel instance is
  paused, so cards can't be fetched); `update-readme-cards.yml` regenerates
  canonical renders on merge to main via its `push` trigger.
- `.github/workflows/update-readme-cards.yml`: generates the four new pin
  cards alongside yapui and top-langs; commit step now covers `assets/`
  instead of a hardcoded file list.
- `.github/workflows/readme-health-check.yml` (new): Mondays 07:00 UTC, on
  README pushes to main, and on manual dispatch — curls every image URL in
  README.md (with retries) and opens/updates a
  "Profile README health check: broken images" issue listing failures;
  auto-closes it when everything is healthy again.

## Notes
- Seed SVGs are near-identical to canonical renders (same template/theme);
  the first workflow run after merge replaces them, so a diff-commit from the
  bot right after merge is expected.
- The health check treats any non-2xx/3xx final status as broken; transient
  slowness is absorbed by `--retry 3` with a 60s cap per attempt, under a hard
  300s `timeout` ceiling per URL (`streak-stats.demolab.com` routinely takes
  ~6s).
- A weekly Claude routine complements this: it picks up the health-check
  issue (or finds breakage itself) and opens a fix PR.
