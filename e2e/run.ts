#!/usr/bin/env node

/**
 * One command for a local run: `pnpm e2e`.
 *
 * Everything a run needs - the stack, the seed, the dashboard build - is arranged by the
 * suite's own global setup, so this is deliberately thin. It exists to pick a target, to
 * pass anything else through to Playwright, and to own the two lifecycle operations that
 * have nothing to do with running tests: tearing the stack down and dropping its volumes.
 *
 *   pnpm e2e                          # the stable target
 *   pnpm e2e:main                     # Saleor's unreleased main branch
 *   pnpm e2e --ui                     # ...and anything else Playwright understands
 *   pnpm e2e tests/login.spec.ts
 *   pnpm e2e:all                      # both targets, one after the other
 *   pnpm e2e:fresh                    # drop the database volume first
 *   pnpm e2e:down                     # stop the stack, keep the volume
 *
 * Executed directly by Node's TypeScript type stripping (Node >= 24).
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";

import { e2eConfig } from "./config.ts";
import { compose } from "./lib/docker.ts";
import { e2ePath, repoPath } from "./lib/paths.ts";
import { log } from "./lib/progress.ts";

const args = process.argv.slice(2);

const takeFlag = (name: string) => {
  const index = args.indexOf(name);

  if (index === -1) {
    return false;
  }

  args.splice(index, 1);

  return true;
};

const takeOption = (name: string) => {
  const index = args.findIndex(arg => arg.startsWith(`${name}=`));

  if (index === -1) {
    return undefined;
  }

  const [value] = args.splice(index, 1);

  return value.slice(name.length + 1);
};

const down = takeFlag("--down");
const fresh = takeFlag("--fresh");
const requested = takeOption("--target");

if (requested) {
  process.env.E2E_TARGET = requested;
}

// Validates whatever arrived, from the flag or from the environment.
const config = e2eConfig();
const { target } = config;

if (down) {
  log(`stopping the "${target}" stack`);
  compose(config, ["down"]);
  process.exit(0);
}

if (fresh) {
  /*
   * `-v` drops the database, so the next run migrates and seeds from nothing. The cached
   * dumps and sessions go with it - they describe a database that no longer exists.
   */
  log(`dropping the "${target}" stack and its volumes`);
  compose(config, ["down", "-v"]);
  fs.rmSync(e2ePath(".cache", target), { recursive: true, force: true });
}

execFileSync(
  "pnpm",
  ["exec", "playwright", "test", "--config", e2ePath("playwright.config.ts"), ...args],
  {
    cwd: repoPath(),
    stdio: "inherit",
    env: { ...process.env, E2E_TARGET: target },
  },
);
