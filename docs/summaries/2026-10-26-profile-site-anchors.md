# Session: Workshop and talk links point to the site sections

**Branch:** fix/profile-site-anchors
**Date:** 2026-10-26

## Prompts
1. (from the team lead) "After site PR #12 merges and its #talks / #workshops
   anchors are live (check them with curl), open one small follow-up PR. It
   points those 2 links back to the site sections."
2. (from the team lead) "I merged PR #11 (a8bdc97) and site PR #12 (893c6ac)
   ... Now do the small follow-up PR: point the 2 email links on the profile to
   those site sections. Use the same gates."

## Steps taken
- Checked with curl that the live site has `id="workshops"` and `id="talks"`.
- Changed the two link targets in README.md.

## Decisions
- Kept the change to the two links only.
