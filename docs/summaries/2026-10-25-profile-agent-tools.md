# Session: Profile README leads with agent tools, workshops, and follow buttons

**Branch:** feat/profile-agent-tools
**Date:** 2026-10-25

## Prompts
1. (from the team lead) "Update the owner's GitHub profile README ... Feature the
   7 projects with pages: link each page and repo. Reuse the repo's existing
   pin-card system ... Link https://tatendaz.github.io prominently. Make X and
   LinkedIn the lead buttons. Cards and header must read well in GitHub light
   AND dark themes ... Keep the auto-updated contributions counter markers
   intact."
2. (from the team lead) "New owner facts. Add a short speaking line to the profile
   README. 1. Podcast guest: Koshelek Team YouTube channel, episode 'From
   Zimbabwe to Russia: how a foreigner built a successful IT career' ... 2. Former
   club president of a Toastmasters club in Saint Petersburg. Do not add a club
   name or dates."

## Steps taken
- Read the positioning and contact memories, the current README, the pin-card
  renderer and the three workflows; looked at current profile README advice
  (one screen, a few featured projects, few badges).
- Added a palette argument to `scripts/render_pin.mjs` and rendered dark and
  light cards for 8 repos from the REST API, the same path the workflow uses.
- Wrote static dark/light header SVGs in the tatendaz.github.io palette and
  seeded `top-langs-light.svg` by recoloring the dark card.
- Rewrote README.md and updated the card and health-check workflows.
- Ran the health check's URL extraction locally: 29 image URLs, 9 remote, all
  200; all 20 local assets present and not error cards.

## Decisions
- Cards link to the project page (the place a visitor can follow or book), with
  "Project page · Repo" under each card.
- Kept claude-usage as the 8th card (most stars of the older repos, has a page)
  so the grid is even; other older repos became one text line.
- Dropped the "Open to Work" badge: the positioning lists workshops, podcasts
  and talks as the offer.
- Health-check budget counts remote URLs only, instead of raising the cap.
