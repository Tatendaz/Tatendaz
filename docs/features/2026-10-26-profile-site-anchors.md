# Feature: Workshop and talk links point to the site sections

**Branch:** fix/profile-site-anchors
**Date:** 2026-10-26

## Summary
The "Workshops" and "Podcasts and talks" links in the profile bio open
https://tatendaz.github.io/#workshops and https://tatendaz.github.io/#talks
instead of an email draft.

## Motivation
PR #11 pointed both links at email because the live site had no such sections
yet (CodeRabbit finding on #11). Site PR Tatendaz/Tatendaz.github.io#12 merged
and both anchors are live (checked with curl on 2026-10-26).

## What changed
- `README.md`: two link targets.

## Notes
The Email badge under the header still gives a direct mailto.
