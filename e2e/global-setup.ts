import { e2eConfig } from "./config.ts";
import { permissionActors } from "./lib/actors.ts";
import { writeStorageState } from "./lib/auth.ts";
import { buildDashboard } from "./lib/dashboard-build.ts";
import { compose, pullImage, waitForHttp } from "./lib/docker.ts";
import { log, step } from "./lib/progress.ts";
import { ensureBaseline, ensureScenario } from "./lib/seed.ts";
import { SCENARIOS } from "./scenarios/registry.ts";

/**
 * Brings the target's stack up, makes sure its seed exists, and signs every actor in.
 *
 * Everything here is idempotent and cached: a warm machine skips the image pull, the
 * migrations, the dashboard build and the seed build, and reaches the first test in
 * seconds. A cold one - or a new Saleor image - pays for all four.
 */
export default async function globalSetup() {
  const config = e2eConfig();

  log(`target "${config.target}": ${config.image}`);
  log("a first run pulls images, migrates and seeds - expect minutes");

  // Before anything else: the image's content id keys the seed and session caches.
  await step(`pulling ${config.image}`, () => pullImage(config));

  // Before compose, which bind-mounts the build directory into the nginx container.
  await step("building the dashboard", () => buildDashboard(config));

  // Only these two: migrations have to land before the API starts serving.
  await step("starting the database and cache", () =>
    compose(config, ["up", "-d", "--wait", "db", "cache"]),
  );

  // Also before anything else touches the database - this may have to rebuild it, which no
  // container can be holding.
  await ensureBaseline(config);

  await step("starting the API, worker and dashboard", () =>
    compose(config, ["up", "-d", "--wait"]),
  );
  await waitForHttp(config.apiUrl);
  await waitForHttp(config.dashboardUrl);

  /*
   * Every scenario's dump is built here rather than on first use: building one empties the
   * database, which is safe now and is not once tests are running.
   */
  for (const scenario of Object.keys(SCENARIOS)) {
    await ensureScenario(config, scenario);
  }

  await step("signing the actors in", async () => {
    for (const actor of ["admin", ...permissionActors]) {
      await writeStorageState(config, actor);
    }
  });
}
