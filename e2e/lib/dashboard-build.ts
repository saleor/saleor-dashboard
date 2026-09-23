import { execFileSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import type { E2eConfig } from "../config.ts";
import { repoPath } from "./paths.ts";
import { log } from "./progress.ts";

/**
 * A marker beside the build recording what it was built from, so a run rebuilds when the
 * bundle's inputs changed and skips when they did not. A full `vite build` is by a wide
 * margin the most expensive thing in a run; editing a spec must not trigger one.
 *
 * The fingerprint is a walk of everything the bundle is built out of - size and mtime per
 * file, not contents, which keeps it at well under a second for ~4,800 files - plus the
 * build-time environment, since the same sources produce a different bundle per target.
 */
const BUILD_INPUTS = ["src", "locale", ".featureFlags", "vite.config.js", "package.json"];

const fingerprint = (config: E2eConfig) => {
  const hash = crypto.createHash("sha256");

  hash.update(`${config.apiUrl}|${config.stagingSchema}`);

  const visit = (entry: string) => {
    const stats = fs.statSync(entry);

    if (stats.isDirectory()) {
      for (const child of fs.readdirSync(entry).sort()) {
        visit(path.join(entry, child));
      }

      return;
    }

    hash.update(`${entry}:${stats.size}:${stats.mtimeMs}`);
  };

  for (const input of BUILD_INPUTS) {
    visit(repoPath(input));
  }

  return hash.digest("hex");
};

const markerPath = (config: E2eConfig) => repoPath(config.buildDir, ".fingerprint");

/**
 * Builds the dashboard for a target.
 *
 * `API_URL` and `FF_USE_STAGING_SCHEMA` are baked in here rather than substituted at
 * serve time: the schema flag reaches the bundle through vite's `define`, which decides
 * which generated GraphQL tree survives tree-shaking. There is no runtime equivalent.
 */
export const buildDashboard = (config: E2eConfig) => {
  const marker = markerPath(config);
  const current = fingerprint(config);

  if (fs.existsSync(marker) && fs.readFileSync(marker, "utf8") === current) {
    log(`. dashboard build for "${config.target}" is current - skipping`);

    return;
  }

  execFileSync(
    "pnpm",
    [
      "exec",
      "vite",
      "build",
      // Relative to vite's `root`, which is `src`.
      "--outDir",
      path.join("..", config.buildDir, "dashboard"),
    ],
    {
      cwd: repoPath(),
      stdio: "inherit",
      env: {
        ...process.env,
        NODE_OPTIONS: "--max-old-space-size=8192",
        API_URL: config.apiUrl,
        APP_MOUNT_URI: "/",
        STATIC_URL: "/",
        SKIP_SOURCEMAPS: "true",
        FF_USE_STAGING_SCHEMA: String(config.stagingSchema),
      },
      timeout: 30 * 60_000,
    },
  );

  fs.mkdirSync(path.dirname(marker), { recursive: true });
  fs.writeFileSync(marker, current);
};
