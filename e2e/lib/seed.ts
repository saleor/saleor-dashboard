import fs from "node:fs";
import path from "node:path";

import type { E2eConfig } from "../config.ts";
import { scenarioByName } from "../scenarios/registry.ts";
import { execPostgres, imageId, manage, pgDump, psql } from "./docker.ts";
import { adminToken } from "./graphql.ts";
import { e2ePath } from "./paths.ts";
import { log, step } from "./progress.ts";

/**
 * Dumps are cached per Saleor image content id, so a new `3.23` patch or a fresh
 * `unstable-main` finds no cache and rebuilds. Nothing here is ever hand-edited, which is
 * the whole reason the suite can follow a floating tag.
 */
export const cacheDir = (config: E2eConfig, id: string) => e2ePath(".cache", config.target, id);

/**
 * Empties every table Saleor owns. `session_replication_role = replica` drops the foreign
 * key triggers for the session, so the tables can be emptied and refilled in whatever order
 * they happen to appear in rather than in dependency order.
 *
 * `django_migrations` is left alone: the schema is not being rebuilt, only its contents.
 */
const TRUNCATE_ALL = `
SET session_replication_role = replica;
DO $$
DECLARE statement text;
BEGIN
  SELECT 'TRUNCATE TABLE ' || string_agg(format('%I.%I', schemaname, tablename), ', ') || ' CASCADE'
    INTO statement
    FROM pg_tables
   WHERE schemaname = 'public' AND tablename <> 'django_migrations';

  IF statement IS NOT NULL THEN
    EXECUTE statement;
  END IF;
END $$;
`;

/**
 * Saleor's data migrations seed rows of their own - the default customer type
 * (`account/migrations/0103_create_default_customer_type.py`) is one, and `populatedb`
 * fails outright without it. Those rows belong to the schema, not to the test data, so
 * "empty" means *migrated and empty*, not truncated.
 *
 * The baseline is what a freshly migrated database holds. It is captured once per image,
 * which is only correct on a database nothing has seeded yet - so if the cache is cold and
 * the database is not, the database is rebuilt rather than trusted.
 */
const baselinePath = (config: E2eConfig, id: string) =>
  path.join(cacheDir(config, id), "baseline.sql");

/**
 * `WITH (FORCE)` (Postgres 13+) disconnects whoever is still holding the database - the
 * api and worker containers keep pooled connections open.
 */
const recreateDatabase = (config: E2eConfig) => {
  execPostgres(config, "DROP DATABASE saleor WITH (FORCE);");
  execPostgres(config, "CREATE DATABASE saleor OWNER saleor;");
};

export const ensureBaseline = async (config: E2eConfig): Promise<string> => {
  const id = imageId(config);
  const target = baselinePath(config, id);

  if (fs.existsSync(target)) {
    await step("migrating Saleor", () => manage(config, ["migrate", "--noinput"]));

    return target;
  }

  /*
   * Unconditionally, rather than only when the database looks dirty: a baseline captured
   * from a database something has already seeded is wrong in a way that surfaces much
   * later, as a confusing `populatedb` failure. This costs one extra migration, once per
   * Saleor image.
   */
  await step("rebuilding the database for a clean baseline", () => {
    recreateDatabase(config);
    manage(config, ["migrate", "--noinput"]);
  });

  const dump = await step("capturing the migrated baseline", () => pgDump(config));

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${TRUNCATE_ALL}\n${dump}`);

  return target;
};

/** Back to a migrated, unseeded database - see `ensureBaseline`. */
const emptyDatabase = async (config: E2eConfig) => {
  const baseline = await ensureBaseline(config);

  psql(config, fs.readFileSync(baseline, "utf8"));
};

/**
 * Builds the scenario's dump if this image has not produced one yet, and returns the path
 * to a script that restores it. The script is the truncate preamble followed by the dump,
 * so restoring is a single `psql` invocation.
 *
 * Every scenario builds from an empty database. A scenario that wants to layer onto another
 * one's dump instead of rebuilding it wants a `restore the parent first` step here.
 */
export const ensureScenario = async (config: E2eConfig, name: string): Promise<string> => {
  const id = imageId(config);
  const dumpPath = path.join(cacheDir(config, id), `${name}.sql`);

  if (fs.existsSync(dumpPath)) {
    return dumpPath;
  }

  const scenario = scenarioByName(name);

  await emptyDatabase(config);
  await step(`building the "${name}" scenario`, () =>
    scenario.build(config, () => adminToken(config)),
  );

  const dump = await step(`capturing the "${name}" scenario`, () => pgDump(config));

  fs.mkdirSync(path.dirname(dumpPath), { recursive: true });
  fs.writeFileSync(dumpPath, `${TRUNCATE_ALL}\n${dump}`);
  log(`  cached at ${path.relative(process.cwd(), dumpPath)}`);

  return dumpPath;
};

/**
 * Puts the database back to the scenario. Run before every test: it is what makes a failing
 * test reproducible on its own, rather than a function of every test that ran before it.
 */
export const restoreScenario = (config: E2eConfig, dumpPath: string) => {
  psql(config, fs.readFileSync(dumpPath, "utf8"));
};
