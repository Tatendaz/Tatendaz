#!/usr/bin/env node
// Render a pin card from a GitHub REST `GET /repos/{owner}/{repo}` JSON
// payload on stdin, using the exact same renderer the stats action uses
// (@stats-organization/github-readme-stats-core's renderRepoCard).
//
// Why REST instead of the action: on 2026-07-22 GitHub started returning
// FORBIDDEN ("Resource not accessible by integration") for the GraphQL
// `stargazers` field on repositories outside the Actions token's
// installation, so the action's GraphQL fetch nulls out and every pin card
// renders as a "User Repository Not found" error card. The REST API still
// serves the same fields to the same token, so we fetch via REST and feed
// the core renderer directly — the SVG output is byte-identical.
//
// STATS_CORE_DIR must point at an installed
// @stats-organization/github-readme-stats-core package (pinned in the
// workflow). renderRepoCard is not in the package's export map, so it is
// imported by file path.
//
// Usage:
//   cp scripts/statsenv/package*.json "$tmp/" && npm ci --prefix "$tmp" --ignore-scripts
//   export STATS_CORE_DIR="$tmp/node_modules/@stats-organization/github-readme-stats-core"
//   gh api repos/Tatendaz/yapui | node scripts/render_pin.mjs dark > assets/pin-yapui.svg
//   gh api repos/Tatendaz/yapui | node scripts/render_pin.mjs light > assets/pin-yapui-light.svg
//
// The palette argument picks colors for GitHub's dark or light theme; the
// README serves both through <picture> + prefers-color-scheme. Colors match
// tatendaz.github.io (assets/site.css there).

import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { join } from "node:path";

const coreDir = process.env.STATS_CORE_DIR;
if (!coreDir) {
  console.error("STATS_CORE_DIR is not set");
  process.exit(1);
}
const { renderRepoCard } = await import(
  pathToFileURL(join(coreDir, "build", "cards", "repo.js")).href
);

// Full linguist language→color map (vendored from ozh/github-colors, which
// mirrors github-linguist). GraphQL used to supply the color alongside
// primaryLanguage; REST has no color field. Unknown languages fall back to
// the renderer's default.
const LANG_COLORS = JSON.parse(
  readFileSync(new URL("./linguist-colors.json", import.meta.url), "utf8"),
);

const PALETTES = {
  dark: {
    title_color: "E07A52",
    icon_color: "E07A52",
    text_color: "ECECEE",
    bg_color: "1D1D1F",
    border_color: "292A2C",
  },
  light: {
    title_color: "B0502E",
    icon_color: "B0502E",
    text_color: "1A1613",
    bg_color: "FCFBF7",
    border_color: "E5DECF",
  },
};
const paletteName = process.argv[2] ?? "dark";
const palette = PALETTES[paletteName];
if (!palette) {
  console.error(`unknown palette "${paletteName}" (expected: ${Object.keys(PALETTES).join(", ")})`);
  process.exit(1);
}

const rest = JSON.parse(readFileSync(0, "utf8"));
for (const field of ["name", "full_name"]) {
  if (typeof rest[field] !== "string" || rest[field] === "") {
    console.error(`REST payload is missing ${field} — refusing to render`);
    process.exit(1);
  }
}
for (const field of ["private", "archived", "is_template"]) {
  if (typeof rest[field] !== "boolean") {
    console.error(`REST payload field ${field} is not a boolean — refusing to render`);
    process.exit(1);
  }
}
for (const field of ["stargazers_count", "forks_count"]) {
  if (!Number.isInteger(rest[field]) || rest[field] < 0) {
    console.error(`REST payload field ${field} is not a non-negative integer — refusing to render`);
    process.exit(1);
  }
}
if (rest.description != null && typeof rest.description !== "string") {
  console.error("REST payload field description is not a string — refusing to render");
  process.exit(1);
}
if (rest.language != null && typeof rest.language !== "string") {
  console.error("REST payload field language is not a string — refusing to render");
  process.exit(1);
}

const svg = renderRepoCard(
  {
    name: rest.name,
    nameWithOwner: rest.full_name,
    description: rest.description,
    isPrivate: rest.private,
    isArchived: rest.archived,
    isTemplate: rest.is_template,
    primaryLanguage: rest.language
      ? { name: rest.language, color: LANG_COLORS[rest.language] ?? null }
      : null,
    starCount: rest.stargazers_count,
    forkCount: rest.forks_count,
  },
  { hide_border: false, border_radius: 6, ...palette },
);

process.stdout.write(svg);
