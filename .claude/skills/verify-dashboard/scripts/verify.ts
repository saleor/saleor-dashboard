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
 *   pnpm verify shot <path> [--as <actor>] [--all] [--name <label>] [--tag <before|after>] [--caption <text>]
 *   pnpm verify exec <snippet.mjs> [--as <actor>] [--headed] [args...]
 *   pnpm verify record <flow.mjs> [--as <actor>] [--name <label>] [--caption <text>] [--size 1280x800] [--theme light|dark] [--gif] [--headed] [args...]
 *   pnpm verify review [--port <port>] [--wait] [--no-open] [--dir <evidence-dir>]
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
import { fileURLToPath, pathToFileURL } from "node:url";

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
import { CURSOR_INIT_SCRIPT } from "./cursor.ts";
import { collectElementHitMap } from "./elements.ts";
import { type FlowRecordingControls, recordPageFlow } from "./record.ts";
import { writeReviewHtml } from "./review-html.ts";
import { parseRepoSlug, parseRepoUrl, type ReviewRunMeta } from "./review-model.ts";
import { startReviewServer } from "./review-server.ts";

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
  repo?: string;
  repoUrl?: string;
  branch?: string;
  prNumber?: number;
  prUrl?: string;
  /** Compared by `doctor`: committing the same edits keeps it, any new edit changes it. */
  tree: string;
  apiUrl: string;
  dashboardUrl: string;
  dashboardPort: number;
  /** Local only: the compose project this run owns. */
  projectName?: string;
  apiPort?: number;
  devServerPid?: number;
  reviewServerPid?: number;
  reviewUrl?: string;
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

const detectGitContext = (
  worktree: string,
  { lookupPr = false }: { lookupPr?: boolean } = {},
): Pick<ReviewRunMeta, "repo" | "repoUrl" | "branch" | "prNumber" | "prUrl"> => {
  const runGit = (...args: string[]): string | undefined => {
    try {
      return execFileSync("git", args, {
        cwd: worktree,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }).trim();
    } catch {
      return undefined;
    }
  };

  const remote = runGit("remote", "get-url", "origin");
  const repo = (remote ? parseRepoSlug(remote) : undefined) ?? path.basename(worktree);
  const repoUrl = remote ? parseRepoUrl(remote) : undefined;
  const rawBranch = runGit("rev-parse", "--abbrev-ref", "HEAD");
  const branch =
    rawBranch && rawBranch !== "HEAD" ? rawBranch : runGit("rev-parse", "--short", "HEAD");

  let prNumber: number | undefined;
  let prUrl: string | undefined;

  if (lookupPr && rawBranch && rawBranch !== "HEAD") {
    try {
      const out = execFileSync("gh", ["pr", "view", "--json", "number,url"], {
        cwd: worktree,
        encoding: "utf8",
        timeout: 2500,
        stdio: ["ignore", "pipe", "ignore"],
      }).trim();
      const parsed = JSON.parse(out) as { number?: number; url?: string };

      if (typeof parsed.number === "number") {
        prNumber = parsed.number;
      }

      if (typeof parsed.url === "string" && parsed.url) {
        prUrl = parsed.url;
      }
    } catch {
      // No open PR for this branch, gh unavailable, or offline.
    }
  }

  return {
    ...(repo ? { repo } : {}),
    ...(repoUrl ? { repoUrl } : {}),
    ...(branch ? { branch } : {}),
    ...(prNumber ? { prNumber } : {}),
    ...(prUrl ? { prUrl } : {}),
  };
};

const reviewMeta = (
  run: RunState,
  { lookupPr = false }: { lookupPr?: boolean } = {},
): ReviewRunMeta => {
  const ctx = detectGitContext(run.worktree || repoPath(), { lookupPr });

  return {
    id: run.id,
    target: run.target,
    saleor: run.saleor,
    scenario: run.scenario,
    revision: revision(),
    repo: ctx.repo ?? run.repo,
    repoUrl: ctx.repoUrl ?? run.repoUrl,
    branch: ctx.branch ?? run.branch,
    prNumber: ctx.prNumber ?? run.prNumber,
    prUrl: ctx.prUrl ?? run.prUrl,
    dashboardUrl: run.dashboardUrl,
    apiUrl: run.apiUrl,
    evidenceDir: evidenceDir(run),
  };
};

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

const isListening = (port: number, host: string) =>
  new Promise<boolean>(resolve => {
    const socket = net.connect({ port, host });

    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("error", () => resolve(false));
  });

/** Both loopbacks: on macOS `localhost` dev servers often listen on `::1` only. */
const isPortFree = async (port: number) =>
  !(await isListening(port, "127.0.0.1")) && !(await isListening(port, "::1"));

const pickFreePort = (preferred: number): Promise<number> =>
  new Promise((resolve, reject) => {
    const probe = net.createServer();

    probe.once("error", () => {
      const fallback = net.createServer();

      fallback.once("error", reject);
      fallback.listen(0, "127.0.0.1", () => {
        const addr = fallback.address();
        const port = typeof addr === "object" && addr ? addr.port : 0;

        fallback.close(() => resolve(port));
      });
    });
    probe.listen(preferred, "127.0.0.1", () => {
      probe.close(() => resolve(preferred));
    });
  });

const openInBrowser = (url: string) => {
  const opener =
    process.platform === "darwin" ? "open" : process.platform === "win32" ? "cmd" : "xdg-open";
  const openArgs = process.platform === "win32" ? ["/c", "start", "", url] : [url];

  try {
    const child = spawn(opener, openArgs, { detached: true, stdio: "ignore" });

    child.unref();
  } catch {
    // Headless/CI environments may not have a browser opener; the URL is printed to stdout.
  }
};

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
  height?: number;
  theme?: Theme;
  headed?: boolean;
  deviceScaleFactor?: number;
  slowMo?: number;
  cursor?: boolean;
}

const openBrowser = async (
  run: RunState,
  {
    actor,
    width = WIDTHS[0],
    height = 900,
    theme = "light",
    headed = false,
    deviceScaleFactor,
    slowMo,
    cursor = false,
  }: OpenOptions,
): Promise<{ context: BrowserContext; page: Page }> => {
  const viewport = { width, height };
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
      ...(deviceScaleFactor ? { deviceScaleFactor } : {}),
      ...(slowMo ? { slowMo } : {}),
    });
  } else {
    const browser = await chromium.launch({
      headless: !headed,
      ...(slowMo ? { slowMo } : {}),
    });

    context = await browser.newContext({
      viewport,
      colorScheme,
      ...(deviceScaleFactor ? { deviceScaleFactor } : {}),
      storageState: actor === "anonymous" ? undefined : await ensureLocalSession(run, actor),
    });
    context.on("close", () => void browser.close());
  }

  await context.addInitScript(([key, value]) => window.localStorage.setItem(key, value), [
    THEME_KEY,
    theme === "dark" ? "defaultDark" : "defaultLight",
  ] as const);

  if (cursor) {
    await context.addInitScript(CURSOR_INIT_SCRIPT);
  }

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

  entries.push({
    ...entry,
    target: run.target,
    saleor: run.saleor,
    revision: revision(),
    createdAt: new Date().toISOString(),
  });
  fs.writeFileSync(index, JSON.stringify(entries, null, 2));
  writeReviewHtml(reviewMeta(run));
};

const readPageHeading = async (run: RunState, page: Page): Promise<string | undefined> => {
  const raw = await page
    .evaluate(() => {
      const dialogHeading = document.querySelector(
        '[role="dialog"] h1, [role="dialog"] h2, [role="dialog"] [data-test-id="dashboard-modal-title"]',
      );
      const primary = dialogHeading ?? document.querySelector("h1, [data-test-id='page-header']");
      const text = primary?.textContent?.replace(/\s+/g, " ").trim();

      return text ? text.slice(0, 120) : "";
    })
    .catch(() => "");

  const cleaned = raw ? redact(run, raw).trim() : "";

  return cleaned || undefined;
};

const routeFromUrl = (url: string): string | undefined => {
  try {
    const parsed = new URL(url);

    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return undefined;
  }
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
  const elementsPath = path.join(evidenceDir(run), `${base}.elements.json`);
  const mask = identityToMask(run).map(text => page.getByText(text, { exact: false }));

  await page.screenshot({ path: png, fullPage: true, mask });
  fs.writeFileSync(aria, redact(run, await page.locator("body").ariaSnapshot()));

  const hitMap = await collectElementHitMap(page, text => redact(run, text)).catch(() => undefined);

  if (hitMap) {
    fs.writeFileSync(elementsPath, JSON.stringify(hitMap));
  }

  const viewport = page.viewportSize();
  const heading = await readPageHeading(run, page);

  recordEvidence(run, {
    kind: "screenshot",
    file: path.basename(png),
    ariaFile: path.basename(aria),
    ...(hitMap ? { elementsFile: path.basename(elementsPath) } : {}),
    label,
    ...(heading ? { heading } : {}),
    url: page.url(),
    route: routeFromUrl(page.url()),
    ...(viewport ? { width: viewport.width, height: viewport.height } : {}),
    ...extra,
  });
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

let cloudRefreshToken: string | undefined;

/**
 * Read once per process and kept: the Cloud profile can only be open in one browser at a
 * time, so `exec`/`record` read it before opening their own and snippets' `gql` reuses it.
 */
const readCloudRefreshToken = async (run: RunState): Promise<string> => {
  if (cloudRefreshToken) {
    return cloudRefreshToken;
  }

  const { context, page } = await openBrowser(run, { actor: "admin" });

  try {
    await page.goto(run.dashboardUrl);

    const refreshToken = await page.evaluate(key => localStorage.getItem(key), REFRESH_TOKEN_KEY);

    if (!refreshToken) {
      fail("the Cloud profile is signed out - ask the user to run `pnpm verify login`");
    }

    cloudRefreshToken = refreshToken;

    return refreshToken;
  } finally {
    await context.close();
  }
};

/** An access token for the actor: signed in on local, refreshed from the Cloud profile. */
const accessToken = async (run: RunState, actor: Actor): Promise<string> => {
  if (run.target === "local") {
    const { email, password } = credentialsFor(actor);

    return (await signIn(localConfig(run), email, password)).token;
  }

  if (actor !== "admin") {
    fail("on cloud `gql` runs as whoever signed in with `login`; --as is local only");
  }

  const refreshToken = await readCloudRefreshToken(run);
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
};

/** `anonymous` sends no token, so the query sees what an unauthenticated caller can. */
const gqlAs = async (run: RunState, actor: Actor, query: string, variables: unknown = {}) =>
  postGraphql(
    run.apiUrl,
    query,
    variables,
    actor === "anonymous" ? undefined : await accessToken(run, actor),
  );

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
// Dev server & managed process groups

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

  // Without this, a server that exits (a port taken after the check) would leave
  // `waitForHttp` to time out, or to succeed against whoever holds the port.
  const exited = new Promise<never>((_, reject) =>
    child.once("exit", code =>
      reject(new Error(`the dev server exited with code ${code} - see ${logFile}`)),
    ),
  );

  await Promise.race([waitForHttp(run.dashboardUrl), exited]);

  return child.pid;
};

/** Detached, so the pid leads its own group: vite and its esbuild children go together. */
const signalGroup = (pid: number, signal: NodeJS.Signals | 0): boolean => {
  try {
    process.kill(-pid, signal);

    return true;
  } catch {
    return false;
  }
};

/** Returns once the whole group is gone, so a following `up` finds the port free. */
const stopProcessGroup = async (pid: number | undefined) => {
  if (!pid || !signalGroup(pid, 0)) {
    return;
  }

  signalGroup(pid, "SIGTERM");

  const deadline = Date.now() + 10_000;

  while (signalGroup(pid, 0) && Date.now() < deadline) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  signalGroup(pid, "SIGKILL");
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
    await stopProcessGroup(active.reviewServerPid);
    await stopProcessGroup(active.devServerPid);

    if (active.target === "local") {
      compose(localConfig(active), ["down"]);
    }
  }

  // Also clears a link whose run dir is gone, which `readActiveRun` reports as no run.
  fs.rmSync(ACTIVE_LINK, { force: true });

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

  if (run.reviewUrl && isAlive(run.reviewServerPid)) {
    console.log(`info review ${run.reviewUrl}`);
  }

  process.exit(failed ? 1 : 0);
};

const shot = async () => {
  const run = requireRun();

  await ensureIdentity(run);
  const actor = takeOption("--as") ?? "admin";
  const label = takeOption("--name");
  const tag = takeOption("--tag");
  const caption = takeOption("--caption");
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
          ...(tag ? { tag } : {}),
          ...(caption ? { caption } : {}),
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

  if (run.target === "cloud") {
    await readCloudRefreshToken(run);
  }

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
      capture: (label: string, extra?: { tag?: string; caption?: string }) =>
        capture(run, page, `${label}-${actor}`, {
          actor,
          ...(extra?.tag ? { tag: extra.tag } : {}),
          ...(extra?.caption ? { caption: extra.caption } : {}),
        }),
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
  capture: (label: string, extra?: { tag?: string; caption?: string }) => Promise<string>;
  gql: (query: string, variables?: unknown) => Promise<GraphqlResult>;
}

/** What a `record` flow snippet's default export receives. */
export interface RecordContext extends SnippetContext, FlowRecordingControls {}

const parseSize = (raw: string): { width: number; height: number } => {
  const match = /^(\d+)x(\d+)$/.exec(raw);

  if (!match) {
    fail(`--size must be WxH (for example 1280x800) - got "${raw}"`);
  }

  return { width: Number(match[1]), height: Number(match[2]) };
};

const record = async () => {
  const run = requireRun();

  await ensureIdentity(run);
  const actor = takeOption("--as") ?? "admin";
  const label = takeOption("--name");
  const caption = takeOption("--caption");
  const theme = (takeOption("--theme") ?? "light") as Theme;
  const size = parseSize(takeOption("--size") ?? "1280x800");
  const gif = takeFlag("--gif");
  const headed = takeFlag("--headed");
  const file = argv.shift() ?? fail("record needs a flow snippet file");

  if (!THEMES.includes(theme)) {
    fail(`--theme must be light or dark - got "${theme}"`);
  }

  const { default: flow } = (await import(pathToFileURL(path.resolve(file)).href)) as {
    default: (context: RecordContext) => Promise<unknown>;
  };

  if (run.target === "cloud") {
    await readCloudRefreshToken(run);
  }

  const scale = Number(process.env.VERIFY_VIDEO_SCALE ?? 2);
  const { context, page } = await openBrowser(run, {
    actor,
    width: size.width,
    height: size.height,
    theme,
    headed,
    deviceScaleFactor: scale,
    slowMo: 250,
    cursor: true,
  });

  const cleanLabel = label ?? path.basename(file, path.extname(file));
  const baseName = `${stamp()}-${revision()}-${`${cleanLabel}-${actor}`.replace(/[^\w.-]+/g, "_")}`;
  const mask = identityToMask(run).map(text => page.getByText(text, { exact: false }));

  try {
    const { result, video, failure } = await recordPageFlow({
      page,
      outDir: evidenceDir(run),
      baseName,
      mask,
      gif,
      runFlow: controls =>
        flow({
          page,
          run,
          actor,
          args: argv,
          goto: async (route: string) => {
            await page.goto(new URL(route, run.dashboardUrl).toString());
            await settle(page);
          },
          capture: (shotLabel: string, extra?: { tag?: string; caption?: string }) =>
            capture(run, page, `${shotLabel}-${actor}`, {
              actor,
              theme,
              ...(extra?.tag ? { tag: extra.tag } : {}),
              ...(extra?.caption ? { caption: extra.caption } : {}),
            }),
          gql: (query: string, variables?: unknown) => gqlAs(run, actor, query, variables),
          ...controls,
        }),
    });

    recordEvidence(run, {
      kind: "video",
      file: path.basename(video.mp4),
      posterFile: path.basename(video.poster),
      ...(video.gif ? { gifFile: path.basename(video.gif) } : {}),
      label: cleanLabel,
      ...(caption ? { caption } : {}),
      url: page.url(),
      route: routeFromUrl(page.url()),
      actor,
      width: size.width,
      height: size.height,
      theme,
      durationMs: video.durationMs,
      steps: video.steps,
      ...(failure ? { error: String(failure) } : {}),
    });

    console.log(`evidence: ${video.mp4}`);
    console.log(`evidence: ${video.poster}`);

    if (video.gif) {
      console.log(`evidence: ${video.gif}`);
    }

    if (failure) {
      throw failure;
    }

    console.log(redact(run, JSON.stringify(result ?? null, null, 2)));
  } finally {
    await context.close();
  }
};

const reviewMetaFromDir = (dir: string): ReviewRunMeta => {
  const resolved = path.resolve(dir);

  if (!fs.existsSync(resolved)) {
    fail(`evidence directory not found: ${resolved}`);
  }

  const parentRun = path.join(path.dirname(resolved), "run.json");

  if (fs.existsSync(parentRun)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(parentRun, "utf8")) as RunState;

      return {
        id: parsed.id,
        target: parsed.target,
        saleor: parsed.saleor,
        scenario: parsed.scenario,
        revision: parsed.revision,
        ...(parsed.repo ? { repo: parsed.repo } : {}),
        ...(parsed.repoUrl ? { repoUrl: parsed.repoUrl } : {}),
        ...(parsed.branch ? { branch: parsed.branch } : {}),
        ...(parsed.prNumber ? { prNumber: parsed.prNumber } : {}),
        ...(parsed.prUrl ? { prUrl: parsed.prUrl } : {}),
        dashboardUrl: parsed.dashboardUrl,
        apiUrl: parsed.apiUrl,
        evidenceDir: resolved,
      };
    } catch {
      // Fall through to synthetic metadata.
    }
  }

  return {
    id: path.basename(path.dirname(resolved)) || "evidence",
    target: "local",
    saleor: "stable",
    scenario: "default",
    revision: "unknown",
    dashboardUrl: "",
    apiUrl: "",
    evidenceDir: resolved,
  };
};

const review = async () => {
  const explicitPort = takeOption("--port");
  const explicitDir = takeOption("--dir");
  const wait = takeFlag("--wait");
  const noOpen = takeFlag("--no-open");

  const active = explicitDir ? undefined : requireRun();
  const meta = explicitDir
    ? reviewMetaFromDir(explicitDir)
    : reviewMeta(active as RunState, { lookupPr: true });

  if (active) {
    active.repo = meta.repo;
    active.repoUrl = meta.repoUrl;
    active.branch = meta.branch;
    active.prNumber = meta.prNumber;
    active.prUrl = meta.prUrl;
    writeRun(active);
  }
  const reviewHtml = writeReviewHtml(meta);

  if (wait || explicitDir) {
    const port = explicitPort ? Number(explicitPort) : 0;

    if (Number.isNaN(port) || port < 0) {
      fail(`invalid --port "${explicitPort}"`);
    }

    let resolveSubmitted: (() => void) | undefined;
    const submitted = new Promise<void>(resolve => {
      resolveSubmitted = resolve;
    });

    const handle = await startReviewServer({
      run: meta,
      port,
      onFeedback: saved => {
        console.log(`\nfeedback saved: ${saved.feedbackJson}`);
        console.log(`prompt saved:   ${saved.feedbackMd}\n`);
        console.log(saved.markdown);

        if (wait) {
          resolveSubmitted?.();
        }
      },
    });

    console.log(
      JSON.stringify(
        {
          url: handle.url,
          reviewHtml,
          feedbackJson: path.join(meta.evidenceDir, "feedback.json"),
          feedbackMd: path.join(meta.evidenceDir, "feedback.md"),
          mode: wait ? "wait" : "foreground",
        },
        null,
        2,
      ),
    );

    if (!noOpen) {
      openInBrowser(handle.url);
    }

    if (wait) {
      log(`waiting for feedback at ${handle.url} (click "Copy fix prompt" in the browser)`);
      await submitted;
      await handle.close();

      return;
    }

    log(`serving review board at ${handle.url} (Ctrl+C to stop)`);
    await new Promise<void>(resolve => {
      process.once("SIGINT", resolve);
      process.once("SIGTERM", resolve);
    });
    await handle.close();

    return;
  }

  const run = active as RunState;

  if (run.reviewUrl && isAlive(run.reviewServerPid)) {
    console.log(
      JSON.stringify(
        {
          url: run.reviewUrl,
          reviewHtml,
          feedbackJson: path.join(meta.evidenceDir, "feedback.json"),
          feedbackMd: path.join(meta.evidenceDir, "feedback.md"),
          reused: true,
        },
        null,
        2,
      ),
    );

    if (!noOpen) {
      openInBrowser(run.reviewUrl);
    }

    return;
  }

  const preferredPort = explicitPort ? Number(explicitPort) : run.dashboardPort + 1;

  if (Number.isNaN(preferredPort) || preferredPort <= 0) {
    fail(`invalid --port "${explicitPort}"`);
  }

  const port = explicitPort ? preferredPort : await pickFreePort(preferredPort);
  const logFile = path.join(meta.evidenceDir, "review-server.log");
  const out = fs.openSync(logFile, "a");
  const scriptPath = fileURLToPath(import.meta.url);
  const child = spawn(
    process.execPath,
    [
      "--disable-warning=MODULE_TYPELESS_PACKAGE_JSON",
      scriptPath,
      "__review-serve",
      "--port",
      String(port),
    ],
    {
      cwd: repoPath(),
      detached: true,
      stdio: ["ignore", out, out],
    },
  );

  child.unref();

  if (!child.pid) {
    fail(`review server did not start - see ${logFile}`);
  }

  const url = `http://127.0.0.1:${port}/`;
  const exited = new Promise<never>((_, reject) =>
    child.once("exit", code =>
      reject(new Error(`review server exited with code ${code} - see ${logFile}`)),
    ),
  );

  await Promise.race([waitForHttp(`${url}api/health`), exited]);

  run.reviewServerPid = child.pid;
  run.reviewUrl = url;
  writeRun(run);

  console.log(
    JSON.stringify(
      {
        url,
        reviewHtml,
        feedbackJson: path.join(meta.evidenceDir, "feedback.json"),
        feedbackMd: path.join(meta.evidenceDir, "feedback.md"),
      },
      null,
      2,
    ),
  );

  if (!noOpen) {
    openInBrowser(url);
  }
};

/** Internal foreground entrypoint spawned detached by `pnpm verify review`. */
const reviewServeInternal = async () => {
  const run = requireRun();
  const port = Number(takeOption("--port") ?? run.dashboardPort + 1);
  const handle = await startReviewServer({ run: reviewMeta(run, { lookupPr: true }), port });

  log(`review server listening on ${handle.url}`);
  await new Promise<void>(resolve => {
    process.once("SIGINT", resolve);
    process.once("SIGTERM", resolve);
  });
  await handle.close();
};

const gqlCommand = async () => {
  const run = requireRun();

  await ensureIdentity(run);
  const actor = takeOption("--as") ?? "admin";
  const query = argv.shift() ?? fail("gql needs a query");
  const variables = argv[0] ? JSON.parse(argv[0]) : {};
  const result = await gqlAs(run, actor, query, variables);
  const file = path.join(evidenceDir(run), `${stamp()}-${revision()}-gql-${actor}.json`);

  fs.writeFileSync(file, redact(run, JSON.stringify({ actor, query, variables, result }, null, 2)));
  recordEvidence(run, { kind: "gql", file: path.basename(file), label: "gql", actor });
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

const down = async () => {
  const run = readActiveRun();
  const volumes = takeFlag("--volumes");

  if (!run) {
    fs.rmSync(ACTIVE_LINK, { force: true });
    log("no active run");

    return;
  }

  await stopProcessGroup(run.reviewServerPid);
  await stopProcessGroup(run.devServerPid);

  if (run.target === "local") {
    compose(localConfig(run), ["down", ...(volumes ? ["-v"] : [])]);
  }

  fs.rmSync(stateDir(run), { recursive: true, force: true });
  fs.rmSync(ACTIVE_LINK, { force: true });

  const reviewHtml = path.join(evidenceDir(run), "review.html");

  console.log(`run ${run.id} stopped; evidence kept in ${evidenceDir(run)}`);

  if (fs.existsSync(reviewHtml)) {
    console.log(`review board kept at ${reviewHtml}`);
  }
};

const PUBLIC_COMMANDS: Record<string, () => unknown> = {
  up,
  doctor,
  shot,
  exec,
  record,
  review,
  gql: gqlCommand,
  sql,
  reset,
  login,
  down,
};

const ALL_COMMANDS: Record<string, () => unknown> = {
  ...PUBLIC_COMMANDS,
  "__review-serve": reviewServeInternal,
};

const handler = command ? ALL_COMMANDS[command] : undefined;

if (!handler) {
  fail(
    `usage: pnpm verify <${Object.keys(PUBLIC_COMMANDS).join("|")}> - see .claude/skills/verify-dashboard/SKILL.md`,
  );
}

fs.mkdirSync(RUN_ROOT, { recursive: true });
// The dashboard's test ids, as in `playwright.config.ts`, so snippets can use `getByTestId`.
selectors.setTestIdAttribute("data-test-id");
await handler();
