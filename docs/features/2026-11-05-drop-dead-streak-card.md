# Feature: Drop the dead streak stats card

**Branch:** fix/readme-health-2026-11-05
**Date:** 2026-11-05

## Summary
Removes the streak stats card from the profile README. Its host,
`streak-stats.demolab.com`, is down (503 "Application Error", then
connection timeouts on repeated checks over several minutes) — the third
third-party card host to die (after the Vercel top-langs instance on
2026-07-13 and the original Heroku streak host before it moved to demolab
on 2026-07-22.

## Motivation
The daily README health-check routine caught the broken image before a
visitor would. No verified-maintained replacement host for this exact card
exists to swap in (unlike the earlier Heroku→demolab move). The repo's own
policy also prefers generating cards locally into `assets/` over depending
on another third-party host — but wiring up a new generator here means
adding a new third-party GitHub Action to CI with repo-token access, which
is a supply-chain decision this automated routine is not authorized to make
on its own. So this fix takes the other explicitly allowed fallback: drop
the image rather than ship a broken one or a new unreviewed CI dependency.

## What changed
- `README.md`: removed the streak card's `<picture>` block from the
  "Languages and activity" section; the top-languages card (already
  self-hosted) stays.

## Notes
- A good self-hosted path exists and is ready for Tatenda to review and
  land by hand: `be-next/github-streak-stats-action` (small, MIT-licensed,
  minimal deps — `@actions/core` + `@actions/github`) generates the same
  card locally from `user(login:).contributionsCollection`, the same root
  path `update-contributions.yml` already uses successfully (so
  it isn't affected by the 2026-07-22 `repository`-field FORBIDDEN
  restriction), and it exposes the same custom color inputs
  (`background`, `ring`, `fire`, `currStreakLabel`, `sideLabels`,
  `currStreakNum`, `sideNums`, `dates`, `stroke`) the demolab query string
  used, so the existing visual design would carry over unchanged. Pin it to
  commit `681434bed24fb0f179e819bb6bae31029baa4796` (`v1.1.0`) if adopted,
  add two steps to `update-readme-cards.yml` next to the top-langs steps,
  and point `README.md` at `assets/streak-stats{,-light}.svg` the same way
  top-langs already does.
- See the health-check issue/PR comment for the same recommendation.
