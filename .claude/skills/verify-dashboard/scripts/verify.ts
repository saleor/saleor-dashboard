#!/usr/bin/env node

/**
 * Runs the dashboard from this checkout against a Saleor and drives it like a user, for
 * verifying a change by hand or by an agent: `pnpm verify <command>`. The
 * `verify-dashboard` skill (`.claude/skills/verify-dashboard/SKILL.md`) documents it.
 *
 * Local is the default: a disposable Saleor from the E2E stack (`compose.yml`), seeded
 * from the suite's scenarios, under its own compose project and ports so a `pnpm e2e` run
 * and a verify run never share a database. `--target cloud` points the dev server at the
 * Cloud sandbox in `~/.config/verify-saleor/config.json` instead.
 *
 *   pnpm verify up [--target local|cloud] [--saleor stable|main] [--scenario <name>]
 *   pnpm verify doctor
 *   pnpm verify shot <path> [--as <actor>] [--all] [--name <label>]
 *   pnpm verify exec <snippet.mjs> [--as <actor>] [args...]
 *   pnpm verify gql '<query>' ['<variables json>'] [--as <actor>]
 *   pnpm verify sql '<statement>'              # local only
 *   pnpm verify reset [--scenario <name>]      # local only
 *   pnpm verify login [--check]                # cloud only
 *   pnpm verify down [--volumes]
 *
 * Executed directly by Node's TypeScript type stripping (Node >= 24).
 */
import { execFileSync, spawn } from "node:child_process";
import fs from "node:fs";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { type BrowserContext, chromium, type Page, selectors } from "@playwright/test";

import {
  e2eConfig,
  type E2eConfig,
  type Target as SaleorLine,
  TARGETS,
} from "../../../../e2e/config.ts";
import { type Actor, credentialsFor } from "../../../../e2e/lib/actors.ts";
import { compose, psql, pullImage, waitForHttp } from "../../../../e2e/lib/docker.ts";
import { signIn } from "../../../../e2e/lib/graphql.ts";
import { repoPath } from "../../../../e2e/lib/paths.ts";
import { log, step } from "../../../../e2e/lib/progress.ts";
import { ensureBaseline, ensureScenario, restoreScenario } from "../../../../e2e/lib/seed.ts";
import { SCENARIOS } from "../../../../e2e/scenarios/registry.ts";

type VerifyTarget = "local" | "cloud";

/**
 * Clear of the suite's 8200/9200 and 8300/9300 so both can run at once. Cloud uses 9000,
 * the dashboard's default dev port, because Saleor Cloud sign-in only returns to origins
 * it allowlists and the session lives in that origin's `localStorage`.
 */
const LOCAL_PORTS: Record<SaleorLine, { api: number; dashboard: number }> = {
  stable: { api: 8400, dashboard: 9400 },
  main: { api: 8500, dashboard: 9500 },
};
const CLOUD_DASHBOARD_PORT = 9000;

const RUN_ROOT = path.join(os.tmpdir(), "verify-dashboard");
const ACTIVE_LINK = path.join(RUN_ROOT, "active");
const CLOUD_PROFILE = path.join(os.homedir(), ".cache", "verify-dashboard", "cloud-profile");
const SHARED_CONFIG =
  process.env.VERIFY_SALEOR_CONFIG ??
  path.join(os.homedir(), ".config", "verify-saleor", "config.json");

const REFRESH_TOKEN_KEY = "_saleorRefreshToken";
const THEME_KEY = "activeMacawUITheme";
const WIDTHS = [1280, 1920];
const THEMES = ["light", "dark"] as const;

type Theme = (typeof THEMES)[number];

interface RunState {
  id: string;
  target: VerifyTarget;
  saleor: SaleorLine;
  scenario: string;
  worktree: string;
  revision: string;
  /** Compared by `doctor`: committing the same edits keeps it, any new edit changes it. */
  tree: string;
  apiUrl: string;
  dashboardUrl: string;
  dashboardPort: number;
  /** Local only: the compose project this run owns. */
  projectName?: string;
  apiPort?: number;
  devServerPid?: number;
  startedAt: string;
}

// ---------------------------------------------------------------------------------------
// Arguments

const argv = process.argv.slice(2);
const command = argv.shift();

const takeOption = (name: string): string | undefined => {
  const index = argv.indexOf(name);

  if (index === -1) {
    return undefined;
  }

  const [, value] = argv.splice(index, 2);

  if (value === undefined) {
    fail(`${name} needs a value`);
  }

  return value;
};

const takeFlag = (name: string): boolean => {
  const index = argv.indexOf(name);

  if (index === -1) {
    return false;
  }

  argv.splice(index, 1);

  return true;
};

function fail(message: string): never {
  console.error(`verify: ${message}`);
  process.exit(1);
}

// ---------------------------------------------------------------------------------------
// Run state

const runDir = (id: string) => path.join(RUN_ROOT, id);
const stateDir = (run: RunState) => path.join(runDir(run.id), "state");
const evidenceDir = (run: RunState) => path.join(runDir(run.id), "evidence");

const isAlive = (pid: number | undefined): boolean => {
  if (!pid) {
    return false;
  }

  try {
    process.kill(pid, 0);

    return true;
  } catch {
    return false;
  }
};

const readActiveRun = (): RunState | undefined => {
  try {
    return JSON.parse(fs.readFileSync(path.join(ACTIVE_LINK, "run.json"), "utf8")) as RunState;
  } catch {
    return undefined;
  }
};

const requireRun = (): RunState =>
  readActiveRun() ?? fail("no active run - `pnpm verify up` first");

const writeRun = (run: RunState) =>
  fs.writeFileSync(path.join(runDir(run.id), "run.json"), JSON.stringify(run, null, 2));

const git = (...args: string[]) =>
  execFileSync("git", args, { cwd: repoPath(), encoding: "utf8" }).trim();

/** The hash of the working tree's content, uncommitted edits included. */
const contentTree = (): string => {
  const index = path.join(os.tmpdir(), `verify-dashboard-index-${process.pid}`);
  const env = { ...process.env, GIT_INDEX_FILE: index };
  const inTemporaryIndex = (...args: string[]) =>
    execFileSync("git", args, { cwd: repoPath(), encoding: "utf8", env }).trim();

  try {
    inTemporaryIndex("read-tree", "HEAD");
    inTemporaryIndex("add", "-A");

    return inTemporaryIndex("write-tree");
  } finally {
    fs.rmSync(index, { force: true });
  }
};

/** The commit, plus the content hash when the working tree differs from it. */
const revision = (): string => {
  const head = git("rev-parse", "--short", "HEAD");
  const tree = contentTree();

  return tree === git("rev-parse", "HEAD^{tree}") ? head : `${head}+${tree.slice(0, 7)}`;
};

/** The local stack's config: the suite's, under this run's own project name and ports. */
const localConfig = (run: Pick<RunState, "saleor">): E2eConfig => {
  const base = e2eConfig(run.saleor);
  const ports = LOCAL_PORTS[run.saleor];

  return {
    ...base,
    projectName: `dashboard-verify-${run.saleor}`,
    apiPort: ports.api,
    apiUrl: `http://localhost:${ports.api}/graphql/`,
    dashboardPort: ports.dashboard,
    dashboardUrl: `http://localhost:${ports.dashboard}/`,
  };
};

const requireLocal = (run: RunState, what: string): E2eConfig => {
  if (run.target !== "local") {
    fail(`${what} only runs on a local target - the Cloud sandbox keeps its data`);
  }

  return localConfig(run);
};

interface CloudConfig {
  saleorApiUrl: string;
  dashboardUrl?: string;
  cloudSso?: string;
}

/**
 * Only the `cloud` block is read. The shared file's `target` is the default for the app
 * `verify-*` skills; the dashboard defaults to local and switches only on `--target cloud`.
 */
const readCloudConfig = (): CloudConfig => {
  let parsed: { cloud?: CloudConfig };

  try {
    parsed = JSON.parse(fs.readFileSync(SHARED_CONFIG, "utf8"));
  } catch {
    fail(
      `no Cloud sandbox configured - ask the user for the sandbox's GraphQL URL and write ` +
        `{ "cloud": { "saleorApiUrl": "https://<env>.saleor.cloud/graphql/" } } to ${SHARED_CONFIG}`,
    );
  }

  if (!parsed.cloud?.saleorApiUrl) {
    fail(`${SHARED_CONFIG} has no cloud.saleorApiUrl`);
  }

  return parsed.cloud;
};

const portOwner = (port: number): string => {
  try {
    return execFileSync("lsof", ["-nP", `-iTCP:${port}`, "-sTCP:LISTEN"], { encoding: "utf8" })
      .split("\n")
      .slice(1, 2)
      .join("")
      .replace(/\s+/g, " ")
      .trim();
  } catch {
    return "unknown process";
  }
};

const isPortFree = (port: number) =>
  new Promise<boolean>(resolve => {
    const socket = net.connect({ port, host: "127.0.0.1" });

    socket.once("connect", () => {
      socket.destroy();
      resolve(false);
    });
    socket.once("error", () => resolve(true));
  });

// ---------------------------------------------------------------------------------------
// Browser

/**
 * Local sessions are one `localStorage` entry, exactly as the suite's (see `lib/auth.ts`),
 * but written into the run dir: the suite's cache is keyed by image, not origin, so sharing
 * it would sign one of the two out.
 */
const localStatePath = (run: RunState, actor: Actor) =>
  path.join(stateDir(run), "auth", `${actor}.json`);

const ensureLocalSession = async (run: RunState, actor: Actor): Promise<string> => {
  const target = localStatePath(run, actor);

  if (fs.existsSync(target)) {
    return target;
  }

  const { email, password } = credentialsFor(actor);
  const { refreshToken } = await signIn(localConfig(run), email, password);

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(
    target,
    JSON.stringify({
      cookies: [],
      origins: [
        {
          origin: new URL(run.dashboardUrl).origin,
          localStorage: [{ name: REFRESH_TOKEN_KEY, value: refreshToken }],
        },
      ],
    }),
  );

  return target;
};

interface OpenOptions {
  actor: Actor;
  width?: number;
  theme?: Theme;
  headed?: boolean;
}

const openBrowser = async (
  run: RunState,
  { actor, width = WIDTHS[0], theme = "light", headed = false }: OpenOptions,
): Promise<{ context: BrowserContext; page: Page }> => {
  const viewport = { width, height: 900 };
  const colorScheme = theme;
  let context: BrowserContext;

  if (run.target === "cloud") {
    if (actor !== "admin") {
      fail("on cloud the browser is whoever signed in with `login`; --as is local only");
    }

    fs.mkdirSync(CLOUD_PROFILE, { recursive: true });
    context = await chromium.launchPersistentContext(CLOUD_PROFILE, {
      headless: !headed,
      viewport,
      colorScheme,
    });
  } else {
    const browser = await chromium.launch({ headless: !headed });

    context = await browser.newContext({
      viewport,
      colorScheme,
      storageState: actor === "anonymous" ? undefined : await ensureLocalSession(run, actor),
    });
    context.on("close", () => void browser.close());
  }

  await context.addInitScript(([key, value]) => window.localStorage.setItem(key, value), [
    THEME_KEY,
    theme === "dark" ? "defaultDark" : "defaultLight",
  ] as const);

  const page = context.pages()[0] ?? (await context.newPage());

  trackApi(page, run.apiUrl);

  return { context, page };
};

/**
 * In-flight API requests per page. `networkidle` alone fires between the dev server's
 * module loads and the first queries, which captured lists still showing their loader.
 */
const inFlight = new WeakMap<Page, Set<unknown>>();

const trackApi = (page: Page, apiUrl: string) => {
  const pending = new Set<unknown>();
  const origin = new URL(apiUrl).origin;
  const isApi = (url: string) => url.startsWith(origin);

  inFlight.set(page, pending);
  page.on("request", request => {
    if (isApi(request.url())) {
      pending.add(request);
    }
  });
  page.on("requestfinished", request => pending.delete(request));
  page.on("requestfailed", request => pending.delete(request));
};

/** Waits until the page has made no API request for a quiet second, up to 30 seconds. */
const settle = async (page: Page) => {
  await page.waitForLoadState("networkidle", { timeout: 30_000 }).catch(() => undefined);

  const pending = inFlight.get(page);
  const deadline = Date.now() + 30_000;
  let quietSince = Date.now();

  while (pending && Date.now() < deadline) {
    if (pending.size > 0) {
      quietSince = Date.now();
    } else if (Date.now() - quietSince >= 1000) {
      break;
    }

    await page.waitForTimeout(100);
  }
};

// ---------------------------------------------------------------------------------------
// Evidence

/** The signed-in Cloud user's identity, masked out of every artifact. */
const identityToMask = (run: RunState): string[] => {
  if (run.target !== "cloud") {
    return [];
  }

  try {
    const identity = JSON.parse(
      fs.readFileSync(path.join(stateDir(run), "identity.json"), "utf8"),
    ) as { email?: string; firstName?: string; lastName?: string };

    return [identity.email, identity.firstName, identity.lastName].filter(
      (value): value is string => Boolean(value),
    );
  } catch {
    return [];
  }
};

const redact = (run: RunState, text: string): string =>
  identityToMask(run).reduce(
    (result, secret) => result.split(secret).join("<masked>"),
    text.replace(/eyJ[\w-]+\.[\w-]+\.[\w-]+/g, "<jwt>"),
  );

const stamp = () => new Date().toISOString().replace(/[:.]/g, "-");

const recordEvidence = (run: RunState, entry: Record<string, unknown>) => {
  const index = path.join(evidenceDir(run), "index.json");
  const entries = fs.existsSync(index) ? JSON.parse(fs.readFileSync(index, "utf8")) : [];

  entries.push({ ...entry, target: run.target, saleor: run.saleor, revision: revision() });
  fs.writeFileSync(index, JSON.stringify(entries, null, 2));
};

const capture = async (
  run: RunState,
  page: Page,
  label: string,
  extra: Record<string, unknown> = {},
) => {
  const base = `${stamp()}-${revision()}-${label.replace(/[^\w.-]+/g, "_")}`;
  const png = path.join(evidenceDir(run), `${base}.png`);
  const aria = path.join(evidenceDir(run), `${base}.aria.txt`);
  const mask = identityToMask(run).map(text => page.getByText(text, { exact: false }));

  await page.screenshot({ path: png, fullPage: true, mask });
  fs.writeFileSync(aria, redact(run, await page.locator("body").ariaSnapshot()));
  recordEvidence(run, { file: path.basename(png), label, url: page.url(), ...extra });
  console.log(`evidence: ${png}`);
  console.log(`evidence: ${aria}`);

  return png;
};

// ---------------------------------------------------------------------------------------
// GraphQL

interface GraphqlResult {
  data?: Record<string, unknown>;
  errors?: unknown[];
}

const postGraphql = async (
  url: string,
  query: string,
  variables: unknown,
  token?: string,
): Promise<GraphqlResult> => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });

  return (await response.json()) as GraphqlResult;
};

/** An access token for the actor: signed in on local, refreshed from the Cloud profile. */
const accessToken = async (run: RunState, actor: Actor): Promise<string> => {
  if (run.target === "local") {
    const { email, password } = credentialsFor(actor);

    return (await signIn(localConfig(run), email, password)).token;
  }

  const { context, page } = await openBrowser(run, { actor });

  try {
    await page.goto(run.dashboardUrl);

    const refreshToken = await page.evaluate(key => localStorage.getItem(key), REFRESH_TOKEN_KEY);

    if (!refreshToken) {
      fail("the Cloud profile is signed out - ask the user to run `pnpm verify login`");
    }

    const result = await postGraphql(
      run.apiUrl,
      "mutation($refreshToken: String!) { tokenRefresh(refreshToken: $refreshToken) { token errors { message } } }",
      { refreshToken },
    );
    const token = (result.data?.tokenRefresh as { token?: string } | undefined)?.token;

    if (!token) {
      fail("the Cloud session expired - ask the user to run `pnpm verify login`");
    }

    return token;
  } finally {
    await context.close();
  }
};

const gqlAs = async (run: RunState, actor: Actor, query: string, variables: unknown = {}) =>
  postGraphql(run.apiUrl, query, variables, await accessToken(run, actor));

const ME_QUERY = `{ me { email firstName lastName isStaff dateJoined
  permissionGroups { name } userPermissions { code } } shop { version } }`;

/**
 * Cloud captures mask the signed-in user, so their identity has to be known before the
 * first capture, not only after `doctor` has run.
 */
const ensureIdentity = async (run: RunState): Promise<void> => {
  const file = path.join(stateDir(run), "identity.json");

  if (run.target !== "cloud" || fs.existsSync(file)) {
    return;
  }

  const me = (await gqlAs(run, "admin", ME_QUERY)).data?.me;

  if (!me) {
    fail("could not read the signed-in user - run `pnpm verify login --check`");
  }

  fs.writeFileSync(file, JSON.stringify(me));
};

// ---------------------------------------------------------------------------------------
// Dev server

const startDevServer = async (run: RunState): Promise<number> => {
  const logFile = path.join(evidenceDir(run), "dev-server.log");
  const out = fs.openSync(logFile, "a");
  const port = String(run.dashboardPort);
  const child = spawn("pnpm", ["exec", "vite", "--port", port, "--strictPort"], {
    cwd: repoPath(),
    detached: true,
    stdio: ["ignore", out, out],
    env: {
      ...process.env,
      // Wins over `.env`: vite's loadEnv lets the process environment take priority.
      API_URL: run.apiUrl,
      PORT: port,
      FF_USE_STAGING_SCHEMA: String(run.saleor === "main"),
    },
  });

  child.unref();

  if (!child.pid) {
    fail(`the dev server did not start - see ${logFile}`);
  }

  await waitForHttp(run.dashboardUrl);

  return child.pid;
};

const stopDevServer = (run: RunState) => {
  if (!isAlive(run.devServerPid)) {
    return;
  }

  try {
    // Detached, so the pid leads its own group: vite and its esbuild children go together.
    process.kill(-(run.devServerPid as number), "SIGTERM");
  } catch {
    process.kill(run.devServerPid as number, "SIGTERM");
  }
};

// ---------------------------------------------------------------------------------------
// Commands

const up = async () => {
  const target = (takeOption("--target") ?? "local") as VerifyTarget;
  const saleor = (takeOption("--saleor") ?? "stable") as SaleorLine;
  const scenario = takeOption("--scenario") ?? "default";

  if (!["local", "cloud"].includes(target)) {
    fail(`--target must be local or cloud - got "${target}"`);
  }

  if (!TARGETS.includes(saleor)) {
    fail(`--saleor must be one of ${TARGETS.join(", ")} - got "${saleor}"`);
  }

  if (!SCENARIOS[scenario]) {
    fail(`unknown scenario "${scenario}" - known: ${Object.keys(SCENARIOS).join(", ")}`);
  }

  const active = readActiveRun();

  if (active && isAlive(active.devServerPid)) {
    fail(
      `run ${active.id} is active, started from ${active.worktree} - \`pnpm verify down\` there first`,
    );
  }

  if (active) {
    log(`reclaiming the dead run ${active.id}`);
    fs.rmSync(ACTIVE_LINK, { force: true });
  }

  const cloud = target === "cloud" ? readCloudConfig() : undefined;
  const local = target === "local" ? localConfig({ saleor }) : undefined;
  const dashboardPort = local?.dashboardPort ?? CLOUD_DASHBOARD_PORT;

  for (const port of [dashboardPort, ...(local ? [local.apiPort] : [])]) {
    if (!(await isPortFree(port))) {
      fail(`port ${port} is taken by ${portOwner(port)} - ask the user before stopping it`);
    }
  }

  const id = process.env.RUN_ID ?? `${stamp()}-${target}`;
  const run: RunState = {
    id,
    target,
    saleor,
    scenario,
    worktree: repoPath(),
    revision: revision(),
    tree: contentTree(),
    apiUrl: local?.apiUrl ?? (cloud as CloudConfig).saleorApiUrl,
    dashboardUrl: `http://localhost:${dashboardPort}/`,
    dashboardPort,
    projectName: local?.projectName,
    apiPort: local?.apiPort,
    startedAt: new Date().toISOString(),
  };

  fs.mkdirSync(path.join(runDir(id), "state"), { recursive: true });
  fs.mkdirSync(path.join(runDir(id), "evidence"), { recursive: true });
  fs.symlinkSync(runDir(id), ACTIVE_LINK);
  writeRun(run);
  log(`run ${id}: ${target}${local ? ` (${local.image})` : ` (${new URL(run.apiUrl).host})`}`);

  if (local) {
    await step(`pulling ${local.image}`, () => pullImage(local));
    await step("starting the database and cache", () =>
      compose(local, ["up", "-d", "--wait", "db", "cache"]),
    );
    await ensureBaseline(local);
    await step("starting the API and worker", () =>
      compose(local, ["up", "-d", "--wait", "api", "worker"]),
    );
    await waitForHttp(local.apiUrl);

    const dump = await ensureScenario(local, scenario);

    await step(`restoring the "${scenario}" scenario`, () => restoreScenario(local, dump));
  }

  run.devServerPid = await step(`starting the dev server on :${dashboardPort}`, () =>
    startDevServer(run),
  );
  writeRun(run);

  console.log(
    JSON.stringify(
      {
        ready: true,
        run: id,
        target,
        dashboardUrl: run.dashboardUrl,
        api: new URL(run.apiUrl).host,
      },
      null,
      2,
    ),
  );

  if (target === "cloud") {
    console.log("next: `pnpm verify login --check`, then `pnpm verify doctor`");
  } else {
    console.log("next: `pnpm verify doctor`");
  }
};

const doctor = async () => {
  const run = requireRun();
  let failed = false;
  const report = (ok: boolean, message: string) => {
    failed ||= !ok;
    console.log(`${ok ? "ok  " : "FAIL"} ${message}`);
  };

  report(
    run.tree === contentTree(),
    `revision ${revision()} serves the same code as up (${run.revision})`,
  );
  report(run.worktree === repoPath(), `worktree ${run.worktree}`);
  report(isAlive(run.devServerPid), `dev server pid ${run.devServerPid} on :${run.dashboardPort}`);

  // Cloud exposes no `/health/`, so ask the API itself.
  const shop = await postGraphql(run.apiUrl, "{ shop { name } }", {}).catch(() => undefined);

  report(Boolean(shop?.data?.shop), `Saleor API ${new URL(run.apiUrl).host} answers`);

  // Which API the served page actually calls - `.env` could still point elsewhere.
  const { context, page } = await openBrowser(run, { actor: "admin" });
  const origins = new Set<string>();

  page.on("request", request => {
    if (request.method() === "POST" && request.url().includes("/graphql")) {
      origins.add(new URL(request.url()).origin);
    }
  });
  await page.goto(run.dashboardUrl);
  await settle(page);
  await context.close();

  const expected = new URL(run.apiUrl).origin;

  report(
    origins.size === 1 && origins.has(expected),
    `page calls ${[...origins].join(", ") || "no API"} (expected ${expected})`,
  );

  const me = await gqlAs(run, "admin", ME_QUERY).catch((error: unknown): GraphqlResult => ({
    errors: [String(error)],
  }));
  const user = me.data?.me as
    | {
        email: string;
        firstName: string;
        lastName: string;
        dateJoined: string;
        permissionGroups: { name: string }[];
        userPermissions: { code: string }[];
      }
    | undefined;

  report(Boolean(user), user ? "signed in" : `not signed in: ${JSON.stringify(me.errors)}`);

  if (user) {
    fs.writeFileSync(path.join(stateDir(run), "identity.json"), JSON.stringify(user));

    const groups = user.permissionGroups.map(group => group.name);

    console.log(
      `info Saleor ${(me.data?.shop as { version?: string } | undefined)?.version}, user ${redact(run, user.email)}, ` +
        `joined ${user.dateJoined}, groups: ${groups.join(", ") || "none"}, ` +
        `${user.userPermissions.length} permissions`,
    );

    if (groups.length > 1) {
      console.log(
        "warn several groups hide permission bugs - also check as a single-permission actor",
      );
    }
  }

  console.log(`info target ${run.target}, Saleor line ${run.saleor}, scenario ${run.scenario}`);
  console.log(`info evidence ${evidenceDir(run)}`);
  process.exit(failed ? 1 : 0);
};

const shot = async () => {
  const run = requireRun();

  await ensureIdentity(run);
  const actor = takeOption("--as") ?? "admin";
  const label = takeOption("--name");
  const all = takeFlag("--all");
  const route = argv.shift() ?? "/";
  const variants = all
    ? WIDTHS.flatMap(width => THEMES.map(theme => ({ width, theme })))
    : [{ width: WIDTHS[0], theme: "light" as Theme }];

  for (const { width, theme } of variants) {
    const { context, page } = await openBrowser(run, { actor, width, theme });

    try {
      await page.goto(new URL(route, run.dashboardUrl).toString());
      await settle(page);
      await capture(
        run,
        page,
        `${label ?? (route.replace(/\W+/g, "-") || "home")}-${actor}-${width}-${theme}`,
        {
          actor,
          route,
          width,
          theme,
        },
      );
    } finally {
      await context.close();
    }
  }
};

const exec = async () => {
  const run = requireRun();

  await ensureIdentity(run);
  const actor = takeOption("--as") ?? "admin";
  const headed = takeFlag("--headed");
  const file = argv.shift() ?? fail("exec needs a snippet file");
  const { default: snippet } = (await import(pathToFileURL(path.resolve(file)).href)) as {
    default: (context: SnippetContext) => Promise<unknown>;
  };
  const { context, page } = await openBrowser(run, { actor, headed });

  try {
    const result = await snippet({
      page,
      run,
      actor,
      args: argv,
      goto: async (route: string) => {
        await page.goto(new URL(route, run.dashboardUrl).toString());
        await settle(page);
      },
      capture: (label: string) => capture(run, page, `${label}-${actor}`, { actor }),
      gql: (query: string, variables?: unknown) => gqlAs(run, actor, query, variables),
    });

    console.log(redact(run, JSON.stringify(result ?? null, null, 2)));
  } catch (error) {
    await capture(run, page, `failure-${path.basename(file)}`, { actor, error: String(error) });
    throw error;
  } finally {
    await context.close();
  }
};

/** What an `exec` snippet's default export receives. */
export interface SnippetContext {
  page: Page;
  run: RunState;
  actor: Actor;
  args: string[];
  goto: (route: string) => Promise<void>;
  capture: (label: string) => Promise<string>;
  gql: (query: string, variables?: unknown) => Promise<GraphqlResult>;
}

const gqlCommand = async () => {
  const run = requireRun();

  await ensureIdentity(run);
  const actor = takeOption("--as") ?? "admin";
  const query = argv.shift() ?? fail("gql needs a query");
  const variables = argv[0] ? JSON.parse(argv[0]) : {};
  const result = await gqlAs(run, actor, query, variables);
  const file = path.join(evidenceDir(run), `${stamp()}-${revision()}-gql-${actor}.json`);

  fs.writeFileSync(file, redact(run, JSON.stringify({ actor, query, variables, result }, null, 2)));
  recordEvidence(run, { file: path.basename(file), label: "gql", actor });
  console.log(redact(run, JSON.stringify(result, null, 2)));
  console.log(`evidence: ${file}`);
};

const sql = () => {
  const run = requireRun();
  const config = requireLocal(run, "sql");
  const statement = argv.shift() ?? fail("sql needs a statement");

  process.stdout.write(psql(config, statement));
};

const reset = async () => {
  const run = requireRun();
  const config = requireLocal(run, "reset");
  const scenario = takeOption("--scenario") ?? run.scenario;
  const dump = await ensureScenario(config, scenario);

  await step(`restoring the "${scenario}" scenario`, () => restoreScenario(config, dump));
  writeRun({ ...run, scenario });
};

const login = async () => {
  const run = requireRun();

  if (run.target !== "cloud") {
    fail("login is for --target cloud; local runs sign actors in themselves");
  }

  const check = takeFlag("--check");
  const { context, page } = await openBrowser(run, { actor: "admin", headed: !check });

  try {
    await page.goto(run.dashboardUrl);

    const deadline = Date.now() + (check ? 15_000 : 10 * 60_000);

    if (!check) {
      log("sign in to the sandbox in the browser window - waiting up to 10 minutes");
    }

    while (Date.now() < deadline) {
      const token = await page
        .evaluate(key => localStorage.getItem(key), REFRESH_TOKEN_KEY)
        .catch(() => null);

      if (token && new URL(page.url()).origin === new URL(run.dashboardUrl).origin) {
        console.log(`signed in to ${new URL(run.apiUrl).host}`);

        return;
      }

      await page.waitForTimeout(1000);
    }

    fail(
      check
        ? "not signed in - ask the user to run `pnpm verify login`"
        : "timed out waiting for sign-in",
    );
  } finally {
    await context.close();
  }
};

const down = () => {
  const run = readActiveRun();
  const volumes = takeFlag("--volumes");

  if (!run) {
    log("no active run");

    return;
  }

  stopDevServer(run);

  if (run.target === "local") {
    compose(localConfig(run), ["down", ...(volumes ? ["-v"] : [])]);
  }

  fs.rmSync(stateDir(run), { recursive: true, force: true });
  fs.rmSync(ACTIVE_LINK, { force: true });
  console.log(`run ${run.id} stopped; evidence kept in ${evidenceDir(run)}`);
};

const COMMANDS: Record<string, () => unknown> = {
  up,
  doctor,
  shot,
  exec,
  gql: gqlCommand,
  sql,
  reset,
  login,
  down,
};

const handler = command ? COMMANDS[command] : undefined;

if (!handler) {
  fail(
    `usage: pnpm verify <${Object.keys(COMMANDS).join("|")}> - see .claude/skills/verify-dashboard/SKILL.md`,
  );
}

fs.mkdirSync(RUN_ROOT, { recursive: true });
// The dashboard's test ids, as in `playwright.config.ts`, so snippets can use `getByTestId`.
selectors.setTestIdAttribute("data-test-id");
await handler();
