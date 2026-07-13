# Feature: Feature yapui as a pin card + remove dead snake workflow

**Branch:** chore/profile-polish
**Date:** 2026-07-13

## Summary
Promotes yapui from a text bullet to a self-hosted visual pin card at the top
of "What I'm working on now", and removes the unused snake-animation workflow.

## Motivation
yapui is the current launch focus and deserves a visual, linkable card rather
than a plain bullet. The card is generated the same self-hosted way as the
languages card (static SVG via GitHub Actions) so it can't break the way the
old public-instance card did. Separately, `snake.yml` generated a
contribution-snake SVG daily to the `output` branch but the README never
embedded it — it was invisible and already `disabled_manually` in Actions, so
it was pure dead maintenance.

## What changed
- Renamed `.github/workflows/update-top-langs.yml` →
  `update-readme-cards.yml` and added a second step generating the yapui pin
  card (`card: pin`, `username=Tatendaz&repo=yapui`, `hide_border=true`,
  `theme=tokyonight`) to `assets/pin-yapui.svg`; the commit step now stages and
  refreshes both cards. Same SHA-pinned action (v2.0.1), same `main`-only
  guard, same rebase-before-push race guard as before.
- `README.md`: yapui is now a centered pin card (linking to the repo) at the
  top of "What I'm working on now"; its former bullet was removed to avoid
  duplication. Vergance / QBT / langchain-fde-curriculum stay as bullets.
- `assets/pin-yapui.svg`: initial render seeded so the card shows on merge.
- Deleted `.github/workflows/snake.yml`. The orphaned `output` branch (which
  only held generated snake SVGs; no GitHub Pages serves from it) is deleted
  separately.

## Notes
- Public-repo stats only (built-in `GITHUB_TOKEN`), same as the languages card.
- Removing the snake workflow leaves two active workflows: the daily
  contribution-count updater and the README-cards updater.
