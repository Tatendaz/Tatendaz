# Feature: Self-hosted top-languages card + yapui in "working on now"

**Branch:** fix/profile-langs-card-yapui
**Date:** 2026-07-13

## Summary
Replaces the broken top-languages card (served by the paused public
`github-readme-stats.vercel.app` instance) with a static SVG generated daily by
GitHub Actions and committed to this repo, and adds **yapui** to the
"What I'm working on now" section.

## Motivation
The profile README's Languages & activity section showed a broken-image icon:
the shared github-readme-stats Vercel deployment returns
`503 DEPLOYMENT_PAUSED`. Upstream now recommends generating cards as static
SVGs via GitHub Actions in the profile repo — no external runtime dependency,
so the card can't break this way again. yapui (public, JavaScript) is the most
recently active project and belongs in the working-on list.

## What changed
- New workflow `.github/workflows/update-top-langs.yml`: daily (03:31 UTC),
  manual dispatch, and on push to `main` (so the card refreshes on merge);
  renders the top-langs card with the same options/theme as before
  (`layout=compact`, `hide_border=true`, `langs_count=8`, `hide=html,css`,
  `theme=tokyonight`) via `stats-organization/github-readme-stats-action`
  (SHA-pinned to v2.0.1) and commits `assets/top-langs.svg` when it changes.
- `README.md`: top-langs `<img>` now points at
  `raw.githubusercontent.com/Tatendaz/Tatendaz/main/assets/top-langs.svg`.
- `README.md`: added yapui (first entry) to "What I'm working on now".
- `assets/top-langs.svg`: initial render committed by the workflow run on this
  branch.

## Notes
- Uses the built-in `GITHUB_TOKEN` → public-repo language stats only (same as
  the old public instance; private-repo stats would need a PAT secret).
- The streak card still uses `github-readme-streak-stats.herokuapp.com`
  (currently healthy). If it ever dies the same fix pattern applies.
