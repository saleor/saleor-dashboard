---
name: verify-dashboard
description: "Run this checkout's Dashboard against a local Saleor (default) or a Saleor Cloud sandbox and drive it in a browser. Use to prove a UI change, reproduce a bug or review finding, capture screenshots for a PR, or see what a limited-permission staff user gets."
---

# Verify the Dashboard

`pnpm verify` ([`scripts/verify.ts`](scripts/verify.ts)) owns one run per machine: it serves the working tree with the vite dev server, points it at a Saleor, and writes every artifact to the run's evidence directory. Run every command from the checkout under test.

```
pnpm verify up [--target local|cloud] [--saleor stable|main] [--scenario <name>] - Start Saleor (local only) and the dev server pointed at it
pnpm verify doctor - Check the run serves this checkout, reaches its API, and is signed in
pnpm verify shot <route> [--as <actor>] [--all] [--name <label>] - Screenshot a route and save its ARIA snapshot
pnpm verify exec <snippet.mjs> [--as <actor>] [--headed] [args...] - Run a Playwright snippet in a signed-in browser
pnpm verify gql '<query>' ['<variables json>'] [--as <actor>] - Send a GraphQL request as an actor
pnpm verify sql '<statement>' - Run SQL against the local database (local only)
pnpm verify reset [--scenario <name>] - Restore the local database to a seeded scenario (local only)
pnpm verify login [--check] - Sign in to the Cloud sandbox in a visible browser (cloud only)
pnpm verify down [--volumes] - Stop the run and keep its evidence
```

## Run

1. **`up`, then `doctor`.** Done when `doctor` prints no `FAIL`. A `FAIL` is _harness blocked_: fix the harness, or report the scenario blocked, never as a product result. A revision mismatch means the checkout changed under the run: `down`, then `up`.
2. **Map the entry points.** List every place the changed behaviour appears: each page, dialog, command menu entry, and each actor it concerns.
3. **Drive and capture each one** (see Driving and Proof). Done when every mapped entry point has evidence at the current revision, or is listed as unexercised. After any code change, recapture: evidence names carry the revision, and older evidence proves nothing.
4. **Report** the run id, target, Saleor version, revision, actors, and each scenario as passed, failed or blocked, plus the entry points you didn't exercise.
5. **`down`.** On cloud, first delete what the run created.

## Targets

**Local is the default.** `up` starts the E2E stack's Saleor (`e2e/compose.yml`) under its own compose project, restores a seeded scenario from `e2e/scenarios/`, and prints the Dashboard URL. Seed dumps are shared with `pnpm e2e`, so a warm machine is up in under a minute and a cold one takes a few minutes. Its ports are clear of `pnpm e2e`, so the suite can run alongside. `--saleor main` runs Saleor's unreleased main with the staging schema build (see `docs/multi-schema.md`). Change anything on local; `reset` restores the scenario. `sql` reaches state no mutation can set, for example `update account_user set date_joined = now() where email = 'admin@example.com'`.

**Cloud only when asked**, with `--target cloud`. Choose it when the change depends on Cloud: Cloud sign-in, Cloud permission groups, Cloud-only extensions (`src/cloud-extensions`), installed apps, or real merchant data. A local run reports those paths as _blocked on local_.

- The sandbox comes from the `cloud` block of `~/.config/verify-saleor/config.json`, shared with the app `verify-*` skills; that file's `target` is ignored: `{ "cloud": { "saleorApiUrl": "https://<env>.saleor.cloud/graphql/" } }`. When the file is missing, ask the user for the sandbox's GraphQL URL. Use only a sandbox the user names, never a production store.
- The Dashboard runs on `localhost:9000`, because Cloud sign-in returns only to allowlisted origins. That is the default `pnpm dev` port: when `up` names a holder, ask the user before stopping it.
- The user signs in once with `pnpm verify login`, in a visible browser with a persistent profile. When `login --check` fails, ask the user for that one step and keep setting up the rest.
- The actor is whoever signed in, so `--as`, `sql` and `reset` refuse. The user's name and email are masked in every artifact, and JWTs are redacted on both targets.

## Actors

On local, `--as` picks who the browser and `gql` sign in as. `admin` is the superuser and the default; `anonymous` has no session. Every other actor holds exactly one permission (`order`, `product`, `staff`, ...; see `e2e/lib/actors.ts`). The superuser hides permission bugs: when a change touches what a user may see or do, capture it as `admin` and as each permission actor it concerns.

## Driving

- **`shot`** opens a route, waits until the page has made no API request for a second, and saves a full-page screenshot and an ARIA snapshot. `--all` captures 1280 and 1920 px in light and dark.
- **`exec`** runs a snippet for anything beyond a route: clicking, filling forms, opening dialogs. The file default-exports `async (ctx) => result`, where `ctx` holds `page` (Playwright; `getByTestId` reads `data-test-id`), `goto(route)`, `capture(label)`, `gql(query, variables)`, `actor`, `run` and `args`. A thrown error saves `failure-*.png`. Keep snippets in the run directory.

  ```js
  export default async ({ page, goto, capture, gql }) => {
    await goto("/products/");
    await page.getByRole("button", { name: "Create Product" }).click();
    await capture("create-product-dialog");
    return (await gql("{ products(first: 1) { totalCount } }")).data;
  };
  ```

- **`gql`** and **`sql`** arrange state and read side effects.

## Proof

- **Drive the user path.** Do every action in the browser. A step that fails in the UI fails the scenario, with its `failure-*.png`, even when the API could finish it.
- **A toast is a claim.** After a save, reload the page and read the object back with `gql`.
- **Red, then green.** For a bug, reproduce it on the base revision, then show the fix, on the same target and data; `reset` between the two.

## Evidence

`doctor` prints the evidence directory, and `down` keeps it. `index.json` records each artifact's label, actor, route, width, theme, target and revision; `dev-server.log` holds the dev server's output. Show screenshots inline to the user, and put them in a PR through the PR workflow as uploaded images.

## Gotchas

- **One run per machine.** `up` names a live run in another worktree; run `down` there. A dead run is reclaimed.
- **Ripples.** Feature hints and the Saleor Pulse video can show for the seeded admin and cover the capture. Dismiss them in a snippet, or capture them when they are the change.
- **Dev server, not the production build.** Confirm a dev-only symptom (hot reload, slow first compile) with `pnpm e2e`, which serves the production bundle, before blaming app code.
- **When `down` fails:** stop the process on the Dashboard port, run `docker compose -p dashboard-verify-stable down` (or `-main`), and delete the `verify-dashboard/active` link under the system temp directory.
