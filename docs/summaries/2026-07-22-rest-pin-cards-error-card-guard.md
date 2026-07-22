# Session: REST-based pin cards + error-card guard

**Branch:** fix/no-error-cards-guard
**Date:** 2026-07-22

## Prompts
1. "fix github.com/tatendaz"
2. (screenshot) All five "What I'm working on now" cards showing "Something
   went wrong! file an issue at https://tinyurl.com/github-stats — User
   Repository Not found"
3. "why is it taking so long? fast fix it please"

## Steps taken
- Traced the breakage to commit 7a08c20 (15:47 UTC card refresh): all five
  pin SVGs committed as error cards; top-langs fine; repos public.
- Re-dispatched the workflow — still broken, so not transient.
- Probed GITHUB_TOKEN permission sets (contents read/write/all-read) — all
  fail identically; raw GraphQL probe from a runner showed FORBIDDEN
  "Resource not accessible by integration" on `stargazers` for repos outside
  the installation, while REST returns the same data fine (rate limit
  4988/5000, so not throttling).
- Wrote scripts/render_pin.mjs: REST payload → core `renderRepoCard`;
  verified all five cards render byte-identical to the last good versions.
- Replaced the five stats-action pin steps with one REST + renderer step;
  added the never-commit-error-cards guard; taught the health check to flag
  committed error-card content (ERRCARD); regenerated the five SVGs.

## Decisions
- REST + pinned core renderer over a PAT secret: needs no user action, no
  new credential, keeps PR #4's deploy-key/no-write-token hardening intact.
- Kept top-langs on the stats action (user-scoped GraphQL still permitted).
- Guard restores previous good SVGs and fails the run red rather than
  blocking refreshes of the cards that did generate correctly.
