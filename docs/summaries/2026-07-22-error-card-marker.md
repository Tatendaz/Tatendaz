# Session: Structural error-card marker + pinned transitive deps

**Branch:** fix/error-card-marker
**Date:** 2026-07-22

## Prompts
Continuation of the "fix github.com/tatendaz" session — this branch addresses
CodeRabbit's review of PR #5 after it merged.

## Steps taken
- Verified `data-testid="message"` appears only in error cards (checked the
  bad cards at 7a08c20 vs good cards at HEAD).
- Swapped both workflows' greps to the structural marker.
- Resolved the exact transitive versions from a local install of
  @stats-organization/github-readme-stats-core@2.1.3 and pinned them in the
  npm install step.

## Decisions
- Fixed rather than skipped the minor finding: cheap, and the false-positive
  scenario (description containing the marker text) is real for body text.
- Pinned transitives instead of a lockfile: no package.json in this repo,
  and a 4-package exact install line is simpler than committing one.
