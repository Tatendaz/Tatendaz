# Session: builtby link on the profile

**Branch:** docs/builtby-link
**Date:** 2026-10-25

## Prompts
1. "Can you submit builtby to Google Search Console and make it findable by agents who search the web?"
2. "Bing is now logged in."
3. "Put builtby.page in your GitHub profile and repo READMEs, go ahead where applicable."

## Steps taken
- Added builtby.page to Google Search Console and Bing Webmaster Tools and sent the sitemap to both.
- Checked Bing and Brave: neither listed builtby.page.
- Added the badge and the "About me" line to README.md.

## Decisions
- One badge plus one text link. A text link is easier for crawlers to read than a badge image.
- Only the profile README and the showcase README, not every project README. Each repo needs its own PR and review, and two links give crawlers the same path in.
