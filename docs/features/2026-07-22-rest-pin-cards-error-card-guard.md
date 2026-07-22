# Feature: REST-based pin cards + error-card guard

**Branch:** fix/no-error-cards-guard
**Date:** 2026-07-22

## Summary
Restores the five pin cards on the profile (they were all rendering as
"Something went wrong / User Repository Not found" error cards) and makes the
pipeline unable to ship an error card again. Pin cards are now generated from
the GitHub REST API through the same core renderer the stats action uses;
output is byte-identical to the last good cards.

## Motivation
On 2026-07-22 (between 06:09 and 15:47 UTC) GitHub started returning
FORBIDDEN — "Resource not accessible by integration" — for the GraphQL
`stargazers` field on repositories outside the Actions token's installation.
That nulls the whole `repository` object in github-readme-stats' pin query,
so every pin card generated as an error card. The workflow exited 0 and
committed them, and the health check only validates HTTP status, so a
200-OK error card counted as healthy. Verified by probing all token
permission sets (contents read/write/all-read all fail) and the raw GraphQL
query from a runner; REST returns the same fields fine.

## What changed
- `assets/pin-*.svg`: regenerated as real cards (byte-identical to the last
  good versions apart from live counts).
- `scripts/render_pin.mjs` (new): renders a pin card from
  `GET /repos/{owner}/{repo}` JSON via
  `@stats-organization/github-readme-stats-core`'s `renderRepoCard`.
  Includes a linguist color map because REST has no language-color field.
- `update-readme-cards.yml`: the five stats-action pin steps are replaced by
  one REST + renderer step (core pinned at 2.1.3). Top-langs stays on the
  stats action (user-scoped query, unaffected).
- `update-readme-cards.yml`: new "Never commit error cards" step — any
  generated SVG containing "Something went wrong" is restored to its previous
  good version (or deleted if new), and a final step fails the run so the
  breakage is visible instead of silently shipped.
- `readme-health-check.yml`: repo-hosted assets are now content-checked too;
  a committed error card reports as `ERRCARD` and fails the check / files
  the health issue.

## Notes
- If GitHub later restricts the user-scoped GraphQL queries too, top-langs
  will be caught by the guard (kept stale-good + red run) — swap it to a
  REST/local path then.
- The renderer imports `build/cards/repo.js` by file path because the core's
  export map doesn't expose it; the version is pinned so this stays stable.
