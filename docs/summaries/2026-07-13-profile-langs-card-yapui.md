# Session: Fix broken profile card + add yapui

**Branch:** fix/profile-langs-card-yapui
**Date:** 2026-07-13

## Prompts
1. "can you fix my github page one of the pictures does not render anymore."
   (with a screenshot of the Languages & activity section showing a
   broken-image icon next to the streak card)
2. "Can you also update my github page to show yapui as one of the repos I am
   working on?"
3. "https://github.com/Tatendaz"

## Steps taken
- Fetched the profile README and curl-tested both images in
  "Languages & activity": streak card healthy (200), top-langs card dead —
  `github-readme-stats.vercel.app` returns `503 DEPLOYMENT_PAUSED`.
- Checked upstream github-readme-stats guidance: public instance is
  best-effort; recommended path is generating static SVGs via GitHub Actions
  in the profile repo.
- Added `.github/workflows/update-top-langs.yml` (daily cron + dispatch),
  modeled on the existing `update-contributions.yml`, using
  `stats-organization/github-readme-stats-action@v2` with the exact same card
  options/theme as the old URL; commits `assets/top-langs.svg` when changed.
- Pointed the README `<img>` at the committed SVG.
- Verified `Tatendaz/yapui` is public (JavaScript) and added it as the first
  entry in "What I'm working on now" (most recently pushed of the listed
  repos).
- Ran the pre-push gate (no test runner in a README-only repo; docs entries
  added), local CodeRabbit review, pushed, dispatched the workflow on the
  branch to generate the initial SVG, opened a PR, and ran the CodeRabbit
  watcher loop.

## Decisions
- Chose Actions-generated static SVG over swapping to another public mirror:
  mirrors share the same failure mode (third-party deployment dies); a
  committed SVG regenerated daily has no runtime dependency.
- Used `@v2` major tag to match the repo's existing action-pinning style
  (`snk@v3`, `checkout@v4`).
- Kept the streak card URL unchanged — it is currently healthy.
- Placed yapui first in the list by push recency (Jul 10 vs Jul 4 / Jun 30).
