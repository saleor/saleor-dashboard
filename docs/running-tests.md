# Running E2E tests

There are two Playwright suites.

| Suite         | Runs against                                  | Command           |
| ------------- | --------------------------------------------- | ----------------- |
| `e2e/`        | A disposable Saleor in docker, seeded locally | `pnpm e2e`        |
| `e2e-legacy/` | A provisioned Saleor Cloud instance           | `pnpm e2e:legacy` |

New tests belong in `e2e/`. See [`e2e/README.md`](../e2e/README.md) — it covers the two
Saleor targets (latest stable and unreleased main), how seeds are built and cached, and how
to port a spec across.

## Full descriptions against an existing local Core

Use the live Playwright configuration to check category and collection full descriptions
against a Core that is already running. The API must include `fullDescription` from Core
commit `0da8266192b80432b610ad86c66d56d45a822313`. Set `API_URL`, `BASE_URL`,
`E2E_USER_NAME`, and `E2E_USER_PASSWORD` in `.env`. The test user needs permission to
manage products and translations.

For example, with Core on port 8000 and Dashboard on port 9000:

```shell
pnpm run dev
# In another terminal:
pnpm exec playwright test --config e2e/live/playwright.config.ts
```

These tests create their own categories and collections and delete them after each test.
They do not restore a database or start Docker services. They check saving, single-field
translation, bulk translation, and clearing while preserving the other description.
Screenshots are saved under `e2e/test-results/live-full-descriptions/`. Browser traces
and videos are disabled to keep login data out of artifacts.

## The legacy suite

> [!NOTE]
> `e2e-legacy/` is frozen. It is kept running until its specs have been reviewed and ported
> to `e2e/`; it should not be extended or edited.

It is based on Saleor Cloud and uses snapshots with prepared data. To run it against your
own infrastructure you need to update the test data with your own created objects in
[`e2e-legacy/data/e2eTestData.ts`](../e2e-legacy/data/e2eTestData.ts) and create a snapshot.

Playwright-specific env variables for `.env`:

```
BASE_URL=
API_URL=

E2E_USER_NAME=
E2E_USER_PASSWORD=
E2E_PERMISSIONS_USERS_PASSWORD=

MAILPITURL=
```

Then:

```shell
pnpm run e2e:legacy
```

If you change `BASE_URL` to run against a different environment, clear the login data cached
in `e2e-legacy/.auth`:

```shell
pnpm run e2e:legacy:clean-auth
```
