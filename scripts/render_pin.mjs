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
//   npm i --prefix "$tmp" @stats-organization/github-readme-stats-core@2.1.3
//   export STATS_CORE_DIR="$tmp/node_modules/@stats-organization/github-readme-stats-core"
//   gh api repos/Tatendaz/yapui | node scripts/render_pin.mjs > assets/pin-yapui.svg

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

// Linguist colors for the languages GraphQL used to supply alongside
// primaryLanguage. REST has no color field, so map the common ones here;
// unknown languages fall back to the renderer's default.
const LANG_COLORS = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Swift: "#F05138",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#663399",
  Go: "#00ADD8",
  Rust: "#dea584",
  C: "#555555",
  "C++": "#f34b7d",
  Java: "#b07219",
  Kotlin: "#A97BFF",
  Ruby: "#701516",
};

const rest = JSON.parse(readFileSync(0, "utf8"));
for (const field of ["name", "full_name"]) {
  if (typeof rest[field] !== "string" || rest[field] === "") {
    console.error(`REST payload is missing ${field} — refusing to render`);
    process.exit(1);
  }
}

const svg = renderRepoCard(
  {
    name: rest.name,
    nameWithOwner: rest.full_name,
    description: rest.description,
    isPrivate: Boolean(rest.private),
    isArchived: Boolean(rest.archived),
    isTemplate: Boolean(rest.is_template),
    primaryLanguage: rest.language
      ? { name: rest.language, color: LANG_COLORS[rest.language] ?? null }
      : null,
    starCount: rest.stargazers_count ?? 0,
    forkCount: rest.forks_count ?? 0,
  },
  { hide_border: true, theme: "tokyonight" },
);

process.stdout.write(svg);
