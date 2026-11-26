import { expect, type Page, type Request, type Response, test as base } from "@playwright/test";

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

interface GraphqlErrors {
  /**
   * Fails with everything collected since the previous call, then starts over. Call it at
   * the end of each step so a failure names the page that caused it.
   */
  expectNone: () => Promise<void>;
}

interface E2eFixtures {
  seed: void;
  /**
   * Opt-in by asking for it: collects every top-level GraphQL error, every non-empty
   * mutation payload `errors`, every uncaught page exception and the dashboard's crash
   * screen, and fails the test on any of them - after each `expectNone()` and once more at
   * the end of the test. The failures are soft: the test runs on and reports every one.
   */
  graphqlErrors: GraphqlErrors;
}

interface GraphqlResponse {
  errors?: Array<{ message: string; path?: Array<string | number> }>;
  data?: Record<string, { errors?: unknown[] } | null> | null;
}

const describeErrors = async (response: Response): Promise<string[]> => {
  const operation = response.request().postDataJSON()?.operationName ?? response.url();

  if (!response.ok()) {
    return [`${operation}: HTTP ${response.status()}`];
  }

  const body: GraphqlResponse = await response.json();
  const topLevel = (body.errors ?? []).map(
    ({ message, path }) => `${operation}: ${message}${path ? ` (at ${path.join(".")})` : ""}`,
  );
  const payloads = Object.entries(body.data ?? {}).flatMap(([field, payload]) =>
    payload?.errors?.length ? [`${operation}: ${field} → ${JSON.stringify(payload.errors)}`] : [],
  );

  return [...topLevel, ...payloads];
};

const QUIET_MS = 500;

const collectGraphqlErrors = (page: Page): GraphqlErrors => {
  const errors: string[] = [];
  const reads = new Set<Promise<void>>();
  const inFlight = new Set<Request>();
  let lastActivity = 0;

  const isApi = (url: string): boolean => url.startsWith(config.apiUrl);

  const settle = (request: Request): void => {
    if (inFlight.delete(request)) {
      lastActivity = Date.now();
    }
  };

  page.on("request", request => {
    if (isApi(request.url())) {
      inFlight.add(request);
      lastActivity = Date.now();
    }
  });
  page.on("requestfinished", settle);
  page.on("requestfailed", request => {
    settle(request);

    const reason = request.failure()?.errorText;

    /* Apollo cancels a page's queries when the user navigates away from it. */
    if (isApi(request.url()) && reason !== "net::ERR_ABORTED") {
      errors.push(`${request.postDataJSON()?.operationName}: ${reason}`);
    }
  });
  page.on("response", response => {
    if (!isApi(response.url())) {
      return;
    }

    const read = describeErrors(response)
      .then(found => {
        errors.push(...found);
      })
      /* The body of a request cancelled mid-flight is gone; the cancel is not an error. */
      .catch(() => {})
      .finally(() => reads.delete(read));

    reads.add(read);
  });
  page.on("pageerror", error => errors.push(`page error: ${error.message}`));

  return {
    expectNone: async () => {
      const calledAt = Date.now();

      /*
       * Quiet for a moment, not merely idle: a page fires its queries as it mounts, which
       * can be just after the navigation that led here resolved.
       */
      await expect
        .poll(
          () => inFlight.size === 0 && Date.now() - Math.max(lastActivity, calledAt) > QUIET_MS,
          {
            message: "the API never went quiet",
          },
        )
        .toBe(true);
      await Promise.all(reads);
      await expect(page.getByText("We’ve encountered an unexpected error")).toHaveCount(0);
      /* Soft, so one leaking page does not hide the ones after it. */
      expect.soft(errors.splice(0), "GraphQL or page errors").toEqual([]);
    },
  };
};

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

  graphqlErrors: async ({ page }, provide) => {
    const graphqlErrors = collectGraphqlErrors(page);

    await provide(graphqlErrors);
    await graphqlErrors.expectNone();
  },
});

export { expect } from "@playwright/test";
