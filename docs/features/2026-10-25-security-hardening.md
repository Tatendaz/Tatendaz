# Feature: Dependabot cooldown, npm cooldown, zizmor CI job, least privilege

**Branch:** security/hardening-2026-10-25
**Date:** 2026-10-25

## Summary
Adds Dependabot for workflow actions and the card renderer (7-day cooldown),
an npm 7-day release-age floor for the renderer, a `zizmor` workflow that
fails on high-severity findings, and a CodeRabbit setting that skips
automatic reviews of Dependabot PRs. Workflow-level permissions are now
read-only everywhere; write scopes sit on the jobs that need them.

## Motivation
Phase 2 of the 2026-10-25 security sweep. Builds on the sweep PR (#12),
which added the renderer lockfile and the SHA pins; merge that one first.
2026's supply-chain worms shipped as brand-new versions of trusted
packages, so nothing new is taken in its first week.

## What changed
- `.github/dependabot.yml` (new): `github-actions` and `npm` (`/scripts/statsenv`),
  monthly, `cooldown.default-days: 7`, `open-pull-requests-limit: 3`, one
  minor + patch group per ecosystem.
- `scripts/statsenv/.npmrc` (new): `min-release-age=7`.
- `.github/workflows/zizmor.yml` (new): `zizmorcore/zizmor-action` v0.7.1
  (SHA-pinned), zizmor 1.31.1, `min-severity: high`, no SARIF upload.
- `.coderabbit.yaml` (new): `inheritance: true` and
  `reviews.auto_review.ignore_usernames: ["dependabot[bot]"]`.
- `dependabot-auto-merge.yml`, `readme-health-check.yml`: top-level
  `contents: read`; write scopes moved onto the job.
- `update-readme-cards.yml`: top-level `permissions: contents: read` added.

## Notes
Security updates ignore the Dependabot cooldown by design. The two push
workflows keep `persist-credentials: false`; they push with the deploy key.
