# Session: Fix profile images + pinned-repo cards + weekly checker

**Branch:** fix/readme-images-pinned-cards
**Date:** 2026-07-22

## Prompts
1. "Can you fix https://github.com/Tatendaz some of the pictures are not
   redndering and can you cretae something that check every week and fixes
   any issues"
2. (screenshot of the "What I'm working on now" section) "lets update this
   section"
3. "remove Quant Backtest Platform — backtesting engine for trading
   strategies (Python — write-up) and add the projects I have pinned"
4. "📚 Learning: LangGraph multi-agent patterns + Solidity this also can go"
5. "update the images and add other projects there"

## Steps taken
- Curled all 10 image URLs in the profile README: only
  `github-readme-streak-stats.herokuapp.com` was dead (connection failure);
  swapped it for `streak-stats.demolab.com` (verified 200).
- Fetched the pinned repos via GraphQL (yapui, langchain-fde-curriculum,
  Vergance, claude-usage, promptups) and replaced the section's bullet list
  with pin cards for all five, matching the existing local-card pattern.
- Seeded the four new card SVGs by templating `pin-yapui.svg` (public Vercel
  instance is `DEPLOYMENT_PAUSED`, the same outage documented on 2026-07-13);
  extended `update-readme-cards.yml` to regenerate all of them daily and on
  push to main.
- Added `readme-health-check.yml`: weekly + on-README-push URL health check
  that opens/updates an issue with the broken URLs and closes it on recovery.
- Set up a weekly Claude routine that checks the profile and opens a fix PR
  when something is broken.

## Decisions
- Kept the streak card on the maintained demolab instance rather than
  dropping it; the health check now guards it.
- Cards-only section (no bullet list) — the cards already carry name,
  description, and language.
- Seed SVGs templated locally instead of fetched (host paused); accepted the
  one-time bot diff-commit after merge when canonical renders land.
