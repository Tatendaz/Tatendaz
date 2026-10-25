# Session: Lock the card renderer and pin workflow actions

**Branch:** security/sweep-2026-10-25
**Date:** 2026-10-25

## Prompts
1. "You are worker sec-w4 in the 2026-10-25 security sweep. Read BRIEF.md
   and follow it exactly."
2. "Pick old, safe versions, never latest: bump only the named package, to
   the lowest fixing version, published on or before 2026-10-18."

## Steps taken
- IOC grep, commit-author review, deploy keys, webhooks, secret names,
  branch protection, Dependabot alerts: nothing unexpected.
- gitleaks (history + tree), osv-scanner, actionlint, zizmor.
- Built a lockfile for the renderer with `--before=2026-10-18`; osv-scanner
  flagged axios 1.18.1; bumped it to 1.20.0 and confirmed only axios changed.
- Installed from the lockfile and rendered two pin cards: byte-identical.
- Pinned actions to SHAs.

## Decisions
- Lockfile over splitting the job in two (generate, then push in a job with
  no third-party code). With the lockfile and SHA pins every piece of code
  in the job is fixed by hash, which closes the drift path with a smaller
  change.
