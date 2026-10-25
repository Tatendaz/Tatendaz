# Feature: Profile README leads with agent tools, workshops, and follow buttons

**Branch:** feat/profile-agent-tools
**Date:** 2026-10-25

## Summary
The profile now features the seven open-source projects that got GitHub Pages
on 2026-10-19, each card linking to its page with the repo link under it. The
bio and typing lines move to the current positioning: tools for AI coding
agents, coding-agent workshops for engineering teams, podcasts and talks. X and
LinkedIn are the lead buttons. Every card and the header have a dark and a
light variant.

## Motivation
The profile still listed Web3, crypto infra and executive workshops, and showed
older repos (yapui, langchain-fde-curriculum, Vergance, claude-usage,
promptups). None of the seven project pages were linked. The owner's goal for
the profile is follows on X and LinkedIn, then workshop, podcast and talk
enquiries, matching tatendaz.github.io.

## What changed
- `README.md`: new header, typing lines, bio, and button order (X, LinkedIn,
  website, email). The "Open to Work" badge, Web3, crypto and the Solidity skill
  icon are gone. The podcasts and talks line links the owner's guest episode on the
  Koshelek Team YouTube channel and notes the Toastmasters club presidency. A 2-column table shows 8 pin cards: the 7 projects with pages
  (coderabbit-failover, codeandconfirm, mission-control, model-picker, T-mods,
  QuotaSignal, herdr-launcher) plus claude-usage. yapui, Vergance, promptups,
  langchain-fde-curriculum and showcase move to one text line.
- Every image that sets its own background ships in two variants, served with
  `<picture>` + `prefers-color-scheme`: header, pin cards, top languages
  (`assets/<card>.svg` dark, `assets/<card>-light.svg` light), plus the typing
  SVG and streak card by URL parameters. Colors come from tatendaz.github.io
  `assets/site.css`.
- `scripts/render_pin.mjs`: takes a palette argument (`dark`, default, or
  `light`) instead of the hardcoded `tokyonight` theme.
- `update-readme-cards.yml`: renders both palettes for the 8 featured repos and
  a light top-languages card; stops rendering the dropped repos. The
  top-languages cards also hide Solidity.
- `readme-health-check.yml`: also checks `srcset=` URLs (the dark/light
  sources), and the 25-URL budget now counts only remote URLs, since
  repo-hosted assets are checked from the checkout in no time.
- `assets/`: new header-dark/light and pin cards; removed the old headers
  (their text said Web3) and the cards for repos no longer shown.

## Notes
- `top-langs-light.svg` in this PR is a recolor of the current dark card; the
  card workflow regenerates both on merge, so a bot commit right after merge is
  expected.
- The `<!--CONTRIB_START-->...<!--CONTRIB_END-->` markers are unchanged, so
  `update-contributions.yml` keeps working.
