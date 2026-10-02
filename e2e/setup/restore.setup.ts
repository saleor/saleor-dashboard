import { e2eConfig } from "../config.ts";
import { test as setup } from "../fixtures/test.ts";
import { ensureScenario, restoreScenario } from "../lib/seed.ts";

/**
 * Restores one scenario, once, ahead of the parallel group that runs on it.
 *
 * Parallel tests have no reset of their own - that is what lets them overlap - so the
 * database they share has to be put in place before any of them starts. Playwright's
 * project `dependencies` are the only thing that can guarantee "before", which is why this
 * is a project rather than a hook.
 *
 * Which scenario is decided by the project's `use`, so this one file serves every group.
 */
setup("restore the scenario", async ({ scenario }) => {
  const config = e2eConfig();

  restoreScenario(config, await ensureScenario(config, scenario));
});
