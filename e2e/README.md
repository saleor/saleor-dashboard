# E2E against a local Saleor

A disposable Saleor in docker, the dashboard built from your working tree, and a database
restored to a known state before every test. No Saleor Cloud, no shared snapshot, no
hand-maintained fixture ids.

```bash
pnpm e2e            # the stable target (latest 3.23 patch)
pnpm e2e:main       # Saleor's unreleased main branch
pnpm e2e:all        # both, one after the other
pnpm e2e --ui       # ...and anything else Playwright understands
pnpm e2e:fresh      # drop the database volume and the caches first
pnpm e2e:down       # stop both stacks, keep the volumes
```

A first run pulls the image, migrates, seeds and builds the dashboard: about **2.5 minutes**
before the first test. A warm run reaches it in **13 seconds**. Every phase announces itself
with its elapsed time (`[e2e 1m59s] > running populatedb`), so a slow run is visibly a slow
run rather than a hang.

Measured on an M-series laptop: baseline migration 1m16s and `populatedb` 20s (both once per
Saleor image), the dump 0.4 MB, and **1.5-2.5s to restore it before each test**.

## The two targets

The dashboard supports two API generations at once: the latest stable Saleor and the
unreleased main branch. Which one a build speaks to is decided by `FF_USE_STAGING_SCHEMA`,
and that flag is **build-time** — it reaches the bundle through vite's `define`
(`vite.config.js`), which decides which generated GraphQL tree survives tree-shaking. There
is no runtime switch, so a target is a Saleor image _and_ a dashboard build.

| Target   | Image                                 | Schema  | API  | Dashboard |
| -------- | ------------------------------------- | ------- | ---- | --------- |
| `stable` | `ghcr.io/saleor/saleor:3.23`          | main    | 8200 | 9200      |
| `main`   | `ghcr.io/saleor/saleor:unstable-main` | staging | 8300 | 9300      |

`3.23` is floating on purpose, and the suite re-resolves both tags itself before starting
anything (`pullImage`): a Saleor patch release is picked up by the next run rather than by a
version-bump PR. When 3.24 ships, `config.ts` is the one file to edit — stable becomes
`3.24`, and main keeps tracking whatever is unreleased.

The ports differ per target so a stack left running from the other one cannot answer by
accident, and the two compose projects keep their containers and volumes apart.

## What a run does

1. **Builds the dashboard** into `build-e2e-<target>/`, skipped when nothing it is built
   from has changed. Kept out of `build/` so a running `pnpm dev` is unaffected.
2. **Brings the stack up** — Postgres, Valkey, Saleor api + worker, and an nginx serving
   that build through the repository's own `nginx/default.conf`.
3. **Ensures the seed** for the scenario (below), building it if this Saleor image has not
   produced one yet.
4. **Signs every actor in** over the API, caching one `localStorage` entry per actor.
5. **Restores the database before every test.**

## Seeds are built, not written

A scenario is a named database state. It is _built_ once per Saleor image — slowly, through
`populatedb` and the GraphQL API — and captured as a `pg_dump --data-only`. Tests never run
a build; they restore the dump, which is a truncate and a `COPY`.

The base scenario is Saleor's own `populatedb`: 32 products, two channels, categories,
collections, pages, menus, vouchers, gift cards, orders, customers, promotions, shipping
zones, warehouses, tax classes — and one staff user per permission, which is what the suite
signs in as. It is used instead of a bootstrap of our own because Saleor core maintains it,
so it follows schema changes for free.

**Dumps are cached under the Saleor image's content id.** A new `3.23` patch or a fresh
`unstable-main` finds no cache and rebuilds, which is what makes following a floating tag
safe. Cached logins share the key, so a rebuilt seed can never be paired with a token minted
against the users it replaced.

Write scenario builds against the **GraphQL API**. Raw SQL is the escape hatch for states
the API cannot express (a row shaped by an older migration, a stock no mutation leaves
behind) — the dump captures both identically, but SQL is the part that rots when Saleor's
tables change, and this suite deliberately tracks a moving image.

To add one: a file in `scenarios/`, registered in `scenarios/registry.ts`, and
`test.use({ scenario: "..." })` in the spec. Every scenario builds from an empty database.

## Isolation, and opting into parallel

By default the database is restored **before every test**, and those tests run one at a
time. That single property is what the suite is for: a failing test reproduces on its own,
rather than as a function of the tests that ran before it. Specs need no cleanup
discipline and no unique names, and nothing in the seed is ever consumed.

Serial is the default because a restore empties every table for a second or two — a test
running alongside one would see a shop with no products and no users in it.

A block that leaves nothing behind can opt out of the reset, and then run in parallel:

```ts
import { parallel } from "../config.ts";

test.describe("Catalogue list", { tag: parallel() }, () => { ... });      // default scenario
test.describe("Refunds", { tag: parallel("refunded-orders") }, () => { ... });
```

The tag takes a **scenario name**, so the group and the database state it runs on are the
same thing and cannot drift apart. A run is then:

```
restore:default          one restore, alone
parallel:default         every test tagged parallel(),          all at once
restore:refunded-orders  one restore, alone
parallel:refunded-orders every test tagged parallel("refunded-orders"), all at once
stable                   everything untagged, one at a time, each from its own reset
```

Groups run one after another and all of them before the serial phase, rather than
interleaved in declaration order. That is deliberate, and it is also the cheaper
arrangement: this costs one restore per group plus one per serial test, where interleaving
would add a restore at every boundary and buy nothing — tests are independent by
construction, so the order between groups carries no meaning.

Playwright's project `dependencies` are what enforce it; they are the only ordering
primitive that spans workers, which is also why a group's restore is a project rather than
a hook. A scenario with no tagged tests still pays for its restore project (a second or
two) — whether a group has members is not knowable when the config is read.

`E2E_WORKERS` (default 4) sets how wide the parallel phase runs. Each test is a browser
context, so the ceiling is memory rather than cores.

Because arrangement cannot be done as an admin at test time, **a state a spec needs is a
scenario**, named and built, not something the spec creates on the way past.

### What cannot be tagged: signing in

Saleor blocks an IP for a second before _every_ login attempt — deliberately, "to prevent
concurrent requests" (`saleor/account/throttling.py`), unconditionally in `tokenCreate`,
with no setting to disable it. Every test here comes from the same address, so parallel
UI logins mostly fail with `LOGIN_ATTEMPT_DELAYED`. `tests/login.spec.ts` therefore stays
in the serial phase.

Specs that arrive **already signed in** are unaffected: a stored session refreshes its
token, and nothing throttles that. Those are the ones worth tagging.

There is no setting for it. `authenticate_with_throttling` is called unconditionally from
`CreateToken.get_user` (`saleor/graphql/account/mutations/authentication/create_token.py:53`),
nothing in `settings.py` guards it, and the delays are module constants rather than settings
(`MIN_DELAY`/`MAX_DELAY` in `saleor/account/throttling.py:14-16`). The image exposes no env
var to turn it off.

What it does use is the default Django cache (`throttling.py:5`), which Saleor builds from
`CACHE_URL` (`settings.py:987-992`). Pointing that at a dummy backend therefore removes the
block — `cache.add` always succeeds and stores nothing — so `SALEOR_CACHE_URL=dummy://` makes
the login spec pass 15-wide in 35s rather than 1.2m. It is offered as a lever, not a default,
because it disables Saleor's cache _everywhere_ — app dataloaders, the webhook circuit
breaker, observability — and a suite whose Saleor is configured unlike production can
mislead about exactly the features that depend on those.

## Actors

`test.use({ actor: "order" })` signs the whole spec in as
`order.manager@example.com` — one of the single-permission staff users `populatedb` mints
(`create_staffs` in Saleor's `saleor/core/utils/random_data.py`), which is what makes
missing-permission flows testable. `admin` is the superuser; `anonymous` carries no session,
for specs that sign in through the UI themselves. A scenario that seeds its own staff member
can name it by email.

## Porting from `e2e-legacy/`

`e2e-legacy/` is the Cloud-snapshot suite. **It is frozen — do not edit it.** Its results
cannot be observed without provisioning a Cloud instance, so a change there is a change
nobody can verify.

Port by copying: bring the page objects a spec needs into `pages/`, reviewing them on the
way in. The locators are `data-test-id`s and carry over unchanged; what does not carry is
`@data/e2eTestData`, the 780 lines of snapshot ids. Point the spec at the seed instead, or
at a scenario built for it.

## Deferred

Real shortcuts, taken knowingly, with what would undo them:

- **The serial phase is serial.** One database per worker (`saleor_w0`, `saleor_w1`, …)
  restored from the same dump would parallelise the resetting tests too. Do it when serial
  run time, not the reseed itself, is what hurts — note it also needs one Saleor API per
  database, and the dashboard bundle bakes its `API_URL` at build time.
- **Reset per test.** Batch to per-file for specs that demonstrably do not need it — but
  only against a measurement, since it trades back the reproducibility above.
- **No parallel group has members yet.** `tests/login.spec.ts` cannot be tagged (above).
  The first ported spec that reads without writing should be.
- **Only the superuser signs in through the UI.** The flow is shared code for every user,
  so the other actors are covered by global setup signing them in over the API.
- **A full `vite build` per target.** Currently skipped only when the fingerprint of `src/`,
  `locale/`, `.featureFlags/`, `vite.config.js` and `package.json` is unchanged. A finer
  fingerprint, or a shared build cache in CI, would cut a cold run substantially.
- **`nginx/replace-env-vars.sh` is not exercised.** The bundle is mounted read-only and its
  environment is baked at build time (it has to be, for the schema flag). The shipped
  image's runtime substitution therefore has no coverage here; it wants a smoke test of the
  actual Docker image, which is a different suite.
- **Dispatch-only CI.** `.github/workflows/e2e-local.yml` runs on demand. Putting it on pull
  requests is a one-line change once the suite is broad enough to be worth the minutes.
- **One proof spec.** `tests/login.spec.ts`. The next port worth making is a
  single-permission spec — it is the part of the actor model most likely to be subtly wrong,
  and the first place a `populatedb` difference between `3.23` and `unstable-main` would
  show.
- **No multi-actor test helper.** One actor per test. Two actors in one test needs a second
  `browser.newContext({ storageState })`; four lines, written when a spec needs it.
- **Every scenario builds from an empty database.** Layering one onto another's dump - a
  handful of extra objects on top of `populatedb` rather than a rebuild - is a `restore the
parent first` step in `ensureScenario`. Added with the first scenario that wants it.
- **Product images are skipped** (`populatedb --withoutimages`) — minutes off the build and
  megabytes off every restore. A spec asserting on media needs its own scenario.
