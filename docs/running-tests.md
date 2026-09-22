# Running E2E tests

There are two Playwright suites.

| Suite         | Runs against                                  | Command           |
| ------------- | --------------------------------------------- | ----------------- |
| `e2e/`        | A disposable Saleor in docker, seeded locally | `pnpm e2e`        |
| `e2e-legacy/` | A provisioned Saleor Cloud instance           | `pnpm e2e:legacy` |

New tests belong in `e2e/`. See [`e2e/README.md`](../e2e/README.md) — it covers the two
Saleor targets (latest stable and unreleased main), how seeds are built and cached, and how
to port a spec across.

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
