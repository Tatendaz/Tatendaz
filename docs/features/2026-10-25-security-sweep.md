# Feature: Lock the card renderer and pin workflow actions

**Branch:** security/sweep-2026-10-25
**Date:** 2026-10-25

## Summary
The card renderer now installs from a committed lockfile, axios moves to
1.20.0, and every first-party action is pinned to a full commit SHA.

## Motivation
`update-readme-cards.yml` ran `npm install` with no lockfile. The four
top-level packages were pinned, but their transitive dependencies floated on
`^` ranges, so each run could pull a release published minutes earlier. That
job later loads `ACTIONS_DEPLOY_KEY`, which can push to `main` past the
image-health ruleset. Code that runs earlier in the same job can read job
secrets (the tj-actions incident showed this), so a poisoned transitive
release could steal the key. `--ignore-scripts` does not help when the code
runs on import.

axios 1.18.1 also has 12 open advisories (GHSA-mghh-pgcx-3jjj,
GHSA-x97p-jq2g-jp4f and others), all fixed in 1.20.0.

## What changed
- `scripts/statsenv/package.json` + `package-lock.json` (new): exact versions
  and integrity hashes for the renderer and its 26 transitive dependencies.
  Resolved with `--before=2026-10-18`.
- `update-readme-cards.yml`: `npm ci --ignore-scripts` from that lockfile.
- axios 1.18.1 -> 1.20.0 (lowest fixing version). No other package changed.
- `actions/checkout` and `actions/dependency-review-action` pinned to SHAs;
  `dependency-review.yml` checkout no longer persists credentials.

## Notes
Pin cards rendered from the lockfile install are byte-identical to the
committed `assets/pin-yapui.svg` and `assets/pin-claude-usage.svg`.
