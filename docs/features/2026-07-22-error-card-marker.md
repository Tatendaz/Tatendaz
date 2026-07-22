# Feature: Structural error-card marker + pinned transitive deps

**Branch:** fix/error-card-marker
**Date:** 2026-07-22

## Summary
Follow-up to PR #5 addressing its review: the error-card detection in both
workflows now matches the error card's structural `data-testid="message"`
node instead of the body text "Something went wrong", and the renderer's
three transitive dependencies are pinned to exact versions.

## Motivation
A legitimate repo description could contain "Something went wrong", which
would make the guard restore/delete a valid card and the health check report
a false `ERRCARD`. The `data-testid="message"` node only exists in
renderError output, never in real repo cards. Separately, pinning only the
core package left axios / emoji-name-map / github-username-regex to resolve
at install time; emoji-name-map in particular can affect rendered output.

## What changed
- `update-readme-cards.yml`: guard greps `data-testid="message"`; npm
  install pins axios@1.18.1 emoji-name-map@2.0.3 github-username-regex@1.0.0.
- `readme-health-check.yml`: ERRCARD content scan greps the same marker.

## Notes
None — behavior is otherwise unchanged.
