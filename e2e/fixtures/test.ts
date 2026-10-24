import { test as base } from "@playwright/test";

import { e2eConfig, PARALLEL_TAG_PATTERN } from "../config.ts";
import type { Actor } from "../lib/actors.ts";
import { storageStatePath } from "../lib/auth.ts";
import { ensureScenario, restoreScenario } from "../lib/seed.ts";

interface E2eOptions {
  /**
   * Who the browser is signed in as. `anonymous` carries no session, for specs that sign
   * in through the UI themselves.
   */
  actor: Actor;
  /** The database state this spec starts from. See `scenarios/`. */
  scenario: string;
}

interface E2eFixtures {
  seed: void;
}

const config = e2eConfig();

export const test = base.extend<E2eOptions & E2eFixtures>({
  actor: ["admin", { option: true }],
  scenario: ["default", { option: true }],

  /**
   * Puts the database back before the test runs.
   *
   * `storageState` depends on this rather than it being an `auto` fixture, because the
   * ordering is the point: the reset has to finish before the browser context exists, or
   * the first page load races a truncated database.
   *
   * A test tagged `parallel()` skips the reset entirely - that is what lets those run in
   * parallel with each other. The database their group shares was restored once, by the
   * group's `restore:<scenario>` project.
   */
  seed: async ({ scenario }, provide, testInfo) => {
    /*
     * A tagged test runs on the database its group's restore project put in place, and
     * resetting here would pull it out from under the tests running alongside.
     */
    if (testInfo.tags.some(tag => PARALLEL_TAG_PATTERN.test(tag))) {
      await provide();

      return;
    }

    const dumpPath = await ensureScenario(config, scenario);

    restoreScenario(config, dumpPath);

    await provide();
  },

  storageState: async ({ actor, seed }, provide) => {
    void seed;

    if (actor === "anonymous") {
      await provide(undefined);

      return;
    }

    await provide(storageStatePath(config, actor));
  },
});

export { expect } from "@playwright/test";
