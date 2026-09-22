/**
 * Every value the suite needs that depends on which Saleor it is running against.
 *
 * The dashboard supports two API generations at once: the latest stable release and
 * Saleor's unreleased main branch, selected at *build time* by FF_USE_STAGING_SCHEMA
 * (see vite.config.js - it lands in `define`, so the inactive schema tree is dropped
 * from the bundle). A target is therefore a Saleor image *and* a dashboard build; the
 * two cannot be mixed at runtime.
 *
 * One target runs at a time. Ports differ per target anyway so a leftover stack from
 * the other one cannot answer by accident.
 */
export type Target = "stable" | "main";

export const TARGETS: Target[] = ["stable", "main"];

const isTarget = (value: string): value is Target => TARGETS.includes(value as Target);

interface TargetConfig {
  /**
   * Floating on purpose: `3.23` tracks the latest patch of the stable line, so a Saleor
   * bugfix release is picked up by the next `--fresh` run instead of by a version-bump PR.
   * `unstable-main` is the image Saleor publishes from its main branch.
   *
   * When Saleor releases 3.24, this is the one line to change: stable becomes `3.24`.
   */
  image: string;
  /** Build the dashboard against the staging (unreleased) GraphQL schema. */
  stagingSchema: boolean;
  apiPort: number;
  dashboardPort: number;
}

const TARGET_CONFIG: Record<Target, TargetConfig> = {
  stable: { image: "3.23", stagingSchema: false, apiPort: 8200, dashboardPort: 9200 },
  main: { image: "unstable-main", stagingSchema: true, apiPort: 8300, dashboardPort: 9300 },
};

/**
 * The admin the suite drives the API with. Created by `populatedb --createsuperuser`,
 * so the password is a constant rather than a secret - the stack is local and disposable.
 */
export const ADMIN = { email: "admin@example.com", password: "admin" };

/** Every staff user `populatedb` mints gets this password (`--staff_password`). */
export const STAFF_PASSWORD = "password";

/**
 * Opts a block into the parallel phase for a scenario: `{ tag: parallel() }` on a
 * `describe`, or on a single test. Untagged is the default and means serial.
 *
 * A tagged test gets no reset of its own. Its whole group shares one database, restored
 * once before the group starts, so every test in it must leave nothing behind that another
 * test in the group - or a later one - could notice.
 *
 * The argument names the database state the group runs on, which is a scenario, so the
 * group and the scenario are the same thing and cannot disagree.
 *
 * Tests tagged for the same scenario are one group however far apart they are written, so
 * seven tests - 1-3 tagged, 4 untagged, 5-7 tagged - run as:
 *
 *   restore, then 1 2 3 5 6 7 together   <- one group, one restore
 *   restore, then 4                      <- serial, its own restore
 *
 * Two restores. The tagged tests do not run in two sittings around test 4, because the
 * order between independent tests carries no meaning and splitting them would cost a third
 * restore for nothing. What is guaranteed is the part that matters: a serial test never
 * overlaps a parallel one, and never shares a database with anything.
 *
 * Tagging 5-7 as `parallel("other")` instead does split them - into a second group with a
 * second restore, because they asked for a different database state. Groups run one after
 * another, each after its own restore; ungrouped tests run last, one at a time.
 */
export const parallel = (scenario = "default"): string => `@parallel:${scenario}`;

/** Matches any parallel tag - used to route the remaining tests to the serial phase. */
export const PARALLEL_TAG_PATTERN = /@parallel:/;

/**
 * The single place a target name is validated. `run.ts` puts `--target` into the environment
 * rather than parsing it itself, so a typo is rejected the same way from either direction.
 */
export const targetFromEnv = (): Target => {
  const value = process.env.E2E_TARGET ?? "stable";

  if (!isTarget(value)) {
    throw new Error(`target must be one of ${TARGETS.join(", ")} - got "${value}"`);
  }

  return value;
};

export const e2eConfig = (target: Target = targetFromEnv()) => {
  const { image, stagingSchema, apiPort, dashboardPort } = TARGET_CONFIG[target];

  return {
    target,
    image: `ghcr.io/saleor/saleor:${image}`,
    stagingSchema,
    /** Compose project name - keeps the two targets' containers and volumes apart. */
    projectName: `dashboard-e2e-${target}`,
    apiPort,
    dashboardPort,
    apiUrl: `http://localhost:${apiPort}/graphql/`,
    dashboardUrl: `http://localhost:${dashboardPort}/`,
    /** Kept out of `build/` so a running `pnpm dev` is unaffected by a suite run. */
    buildDir: `build-e2e-${target}`,
  };
};

export type E2eConfig = ReturnType<typeof e2eConfig>;
