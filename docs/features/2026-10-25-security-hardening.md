# Feature: Dependabot cooldown, npm cooldown, zizmor CI job, least privilege

**Branch:** security/hardening-2026-10-25
**Date:** 2026-10-25

## Summary
Adds Dependabot for workflow actions and the card renderer (7-day cooldown),
an npm 7-day release-age floor for the renderer, a `zizmor` workflow that
fails on high-severity findings, and the owner's merge-when-clean job. Workflow-level permissions are now
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
- `.github/workflows/merge-when-clean.yml` (new, owner's template, unchanged):
  merges Dependabot PRs and the owner's `security/*` or `automerge` PRs once CI
  is green, a real review ran and 0 threads are open. A merge made with
  GITHUB_TOKEN starts no workflows, so `update-readme-cards.yml` (on push to
  `main`) waits for its daily schedule or a manual dispatch after such a merge.
- npm Dependabot PRs carry the `needs-owner` label, which merge-when-clean skips.
- `dependabot-auto-merge.yml`, `readme-health-check.yml`: top-level
  `contents: read`; write scopes moved onto the job.
- `update-readme-cards.yml`: top-level `permissions: contents: read` added.
- `dependabot-auto-merge.yml`: only GitHub Actions patch/minor bumps merge
  unattended, and never the stats action. npm bumps of the renderer wait for a
  human, because that code runs in the job that loads the deploy key.

## Notes
Security updates ignore the Dependabot cooldown by design. The two push
workflows keep `persist-credentials: false`; they push with the deploy key.
