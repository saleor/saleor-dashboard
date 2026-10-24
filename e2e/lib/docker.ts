import { execFileSync } from "node:child_process";

import type { E2eConfig } from "../config.ts";
import { e2ePath, repoPath } from "./paths.ts";
import { poll } from "./progress.ts";

/**
 * Compose is always invoked with an explicit project name so the two targets keep
 * separate containers and volumes, and with the environment the compose file
 * interpolates (image tag, published ports, dashboard build directory).
 */
const composeArgs = (config: E2eConfig, args: string[]) => [
  "compose",
  "--project-name",
  config.projectName,
  "-f",
  e2ePath("compose.yml"),
  ...args,
];

const composeEnv = (config: E2eConfig) => ({
  ...process.env,
  SALEOR_IMAGE: config.image,
  SALEOR_API_PORT: String(config.apiPort),
  DASHBOARD_PORT: String(config.dashboardPort),
  DASHBOARD_BUILD_DIR: repoPath(config.buildDir, "dashboard"),
  DASHBOARD_NGINX_CONF: repoPath("nginx", "default.conf"),
  SALEOR_CACHE_URL: process.env.SALEOR_CACHE_URL ?? "redis://cache:6379/0",
});

export const compose = (config: E2eConfig, args: string[]) =>
  execFileSync("docker", composeArgs(config, args), {
    stdio: "inherit",
    env: composeEnv(config),
    // A cold run pulls images and runs Saleor's migrations.
    timeout: 20 * 60_000,
  });

/** `docker compose run` on the api image, for Django management commands. */
export const manage = (config: E2eConfig, args: string[], env: Record<string, string> = {}) =>
  compose(config, [
    "run",
    "--rm",
    ...Object.entries(env).flatMap(([key, value]) => ["-e", `${key}=${value}`]),
    "api",
    "python3",
    "manage.py",
    ...args,
  ]);

/**
 * Runs a binary in the database container. One shape for every database operation: they
 * differ only in the argv and in whether they carry a script on stdin.
 *
 * A seed dump is megabytes of `COPY` rows in either direction, hence the buffer.
 */
const dbExec = (config: E2eConfig, argv: string[], input?: string) =>
  execFileSync("docker", composeArgs(config, ["exec", "-T", "db", ...argv]), {
    input,
    encoding: "utf8",
    env: composeEnv(config),
    maxBuffer: 512 * 1024 * 1024,
    timeout: 10 * 60_000,
  });

const PSQL = ["psql", "-U", "saleor", "-v", "ON_ERROR_STOP=1"];

/**
 * Runs a SQL script against the target database. `-f -` reads from stdin so a script can
 * carry `COPY ... FROM stdin` blocks inline, exactly as `pg_dump` writes them.
 */
export const psql = (config: E2eConfig, sql: string) =>
  dbExec(config, [...PSQL, "-d", "saleor", "-f", "-"], sql);

/**
 * Runs a statement against the `postgres` maintenance database - for the few operations
 * that cannot run while connected to the database they act on.
 */
export const execPostgres = (config: E2eConfig, sql: string) =>
  dbExec(config, [...PSQL, "-d", "postgres", "-c", sql]);

/** Captures a data-only dump of the seeded database. */
export const pgDump = (config: E2eConfig) =>
  dbExec(config, [
    "pg_dump",
    "-U",
    "saleor",
    "-d",
    "saleor",
    "--data-only",
    "--no-owner",
    "--exclude-table-data=django_migrations",
  ]);

/**
 * Re-resolves the target's tag. Both tags float - `3.23` moves with every patch release
 * and `unstable-main` with every merge to Saleor's main - so a run that did not pull would
 * silently keep testing against whatever it first downloaded.
 *
 * Explicit rather than compose's `pull_policy`, because the image's content id keys the
 * seed and session caches and has to be resolvable before anything is started.
 */
export const pullImage = (config: E2eConfig) =>
  execFileSync("docker", ["pull", "--quiet", config.image], { stdio: "inherit" });

/**
 * The content id of the pulled Saleor image. Everything derived from a running Saleor -
 * the seed dumps, the cached logins - is cached under this, so a new `3.23` patch or a
 * fresh `unstable-main` silently rebuilds instead of being served stale.
 *
 * Memoised: every test reads it twice (its dump path and its session path) and the pull
 * that could change it has already happened, so the answer is fixed for the process.
 */
const imageIds = new Map<string, string>();

export const imageId = (config: E2eConfig): string => {
  let id = imageIds.get(config.image);

  if (!id) {
    id = execFileSync("docker", ["image", "inspect", "--format", "{{.Id}}", config.image], {
      encoding: "utf8",
    })
      .trim()
      .replace("sha256:", "")
      .slice(0, 12);
    imageIds.set(config.image, id);
  }

  return id;
};

export const waitForHttp = async (url: string, timeoutMs = 180_000) =>
  poll(
    `waiting for ${url}`,
    async () => {
      try {
        const response = await fetch(url);

        return response.status < 500 ? true : `status ${response.status}`;
      } catch (error) {
        return error instanceof Error ? error.message : String(error);
      }
    },
    { timeoutMs },
  );
