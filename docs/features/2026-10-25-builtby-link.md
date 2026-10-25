# Feature: builtby link on the profile

**Branch:** docs/builtby-link
**Date:** 2026-10-25

## Summary
Adds a builtby badge to the contact row and one "About me" line that link to
https://builtby.page/tatendaz, the page that lists every project.

## Motivation
builtby.page is new and search engines barely know it. Bing and Brave did not
list it on 2026-10-25. A link from the profile helps crawlers find it and gives
visitors one page with every project.

## What changed
- README.md: a shields.io badge "builtby / All my projects" after the X badge.
- README.md: a new "About me" bullet with a text link to builtby.page/tatendaz.

## Notes
The badge adds one image URL to the README health check (well under its cap of 25).
