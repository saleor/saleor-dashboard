---
name: verify-dashboard
description: "Run this checkout's Dashboard against a local Saleor (default) or a Saleor Cloud sandbox and drive it in a browser. Use to prove a UI change, reproduce a bug or review finding, capture screenshots or video recordings for a PR, collect visual feedback in an interactive review board, or see what a limited-permission staff user gets."
---

# Verify the Dashboard

`pnpm verify` ([`scripts/verify.ts`](scripts/verify.ts)) owns one run per machine: it serves the working tree with the vite dev server, points it at a Saleor, and writes every artifact to the run's evidence directory. Run every command from the checkout under test.

```
pnpm verify up [--target local|cloud] [--saleor stable|main] [--scenario <name>] - Start Saleor (local only) and the dev server pointed at it
pnpm verify doctor - Check the run serves this checkout, reaches its API, and is signed in
pnpm verify shot <route> [--as <actor>] [--all] [--name <label>] [--tag before|after] - Screenshot a route and save its ARIA snapshot and DOM hit-map
pnpm verify exec <snippet.mjs> [--as <actor>] [--headed] [args...] - Run a Playwright snippet in a signed-in browser
pnpm verify record <flow.mjs> [--as <actor>] [--name <label>] [--size 1280x800] [--theme light|dark] [--gif] [--headed] [args...] - Record a Retina MP4 (+ optional GIF) of a browser flow with cursor and step captions
pnpm verify review [--port <port>] [--wait] [--no-open] [--dir <evidence-dir>] - Open the interactive visual review page
pnpm verify gql '<query>' ['<variables json>'] [--as <actor>] - Send a GraphQL request as an actor
pnpm verify sql '<statement>' - Run SQL against the local database (local only)
pnpm verify reset [--scenario <name>] - Restore the local database to a seeded scenario (local only)
pnpm verify login [--check] - Sign in to the Cloud sandbox in a visible browser (cloud only)
pnpm verify down [--volumes] - Stop the run (and review server) and keep its evidence
```

## Run

1. **`up`, then `doctor`.** Done when `doctor` prints no `FAIL`. A `FAIL` is _harness blocked_: fix the harness, or report the scenario blocked, never as a product result. A revision mismatch means the checkout changed under the run: `down`, then `up`.
2. **Map the entry points.** List every place the changed behaviour appears: each page, dialog, command menu entry, and each actor it concerns.
3. **Drive and capture each one** (see Driving, Recording, and Proof). Done when every mapped entry point has evidence at the current revision, or is listed as unexercised. After any code change, recapture: evidence names carry the revision, and older evidence proves nothing—keep the earlier captures in the same run so the review page pairs Before and After automatically.
4. **Open the review page and report.** Run `pnpm verify review` so the user gets a clean browser presentation of the artifacts (video first, then Before/After comparisons, then plain screenshots with captions) with click-to-comment bug pinning and a one-click fix prompt. Report the review URL, run id, target, Saleor version, revision, actors, and each scenario as passed, failed or blocked, plus any unexercised entry points.
5. **Iterate, then `down`.** Leave `up` and the review server running while the user reviews—they can open live pages, reload the review page after fixes, and inspect Before/After diffs. When the user clicks **Copy fix prompt** (which also writes `feedback.json`, `feedback.md`, and cropped pin PNGs into the evidence directory) and pastes the prompt, fix the pinned items, recapture, and ask them to reload. Run `down` once the user approves or before switching worktrees; on cloud, first delete what the run created.

## Targets

**Local is the default.** `up` starts the E2E stack's Saleor (`e2e/compose.yml`) under its own compose project, restores a seeded scenario from `e2e/scenarios/`, and prints the Dashboard URL. Seed dumps are shared with `pnpm e2e`, so a warm machine is up in under a minute and a cold one takes a few minutes. Its ports are clear of `pnpm e2e`, so the suite can run alongside. `--saleor main` runs Saleor's unreleased main with the staging schema build (see `docs/multi-schema.md`). Change anything on local; `reset` restores the scenario. `sql` reaches state no mutation can set, for example `update account_user set date_joined = now() where email = 'admin@example.com'`.

**Cloud only when asked**, with `--target cloud`. Choose it when the change depends on Cloud: Cloud sign-in, Cloud permission groups, Cloud-only extensions (`src/cloud-extensions`), installed apps, or real merchant data. A local run reports those paths as _blocked on local_.

- The sandbox comes from the `cloud` block of `~/.config/verify-saleor/config.json`, shared with the app `verify-*` skills; that file's `target` is ignored: `{ "cloud": { "saleorApiUrl": "https://<env>.saleor.cloud/graphql/" } }`. When the file is missing, ask the user for the sandbox's GraphQL URL. Use only a sandbox the user names, never a production store.
- The Dashboard runs on `localhost:9000`, because Cloud sign-in returns only to allowlisted origins. That is the default `pnpm dev` port: when `up` names a holder, ask the user before stopping it.
- The user signs in once with `pnpm verify login`, in a visible browser with a persistent profile. When `login --check` fails, ask the user for that one step and keep setting up the rest.
- The actor is whoever signed in, so `--as`, `sql` and `reset` refuse. The user's name and email are masked in every artifact (screenshots, video frames, ARIA snapshots, and DOM hit-maps), and JWTs are redacted on both targets.

## Actors

On local, `--as` picks who the browser and `gql` sign in as. `admin` is the superuser and the default; `anonymous` has no session. Every other actor holds exactly one permission (`order`, `product`, `staff`, ...; see `e2e/lib/actors.ts`). The superuser hides permission bugs: when a change touches what a user may see or do, capture it as `admin` and as each permission actor it concerns.

## Driving

- **`shot`** opens a route, waits until the page has made no API request for a second, and saves a full-page screenshot, an ARIA snapshot, and a DOM element hit-map (`*.elements.json`). `--all` captures 1280 and 1920 px in light and dark. Always pass `--caption "<what the reviewer is looking at>"` so each image explains its context in plain English. Pass `--tag before` and `--tag after` to explicitly pair Before/After views (captures of the same route/actor/viewport/theme across different revisions also pair automatically).
- **`exec`** runs a snippet for anything beyond a route: clicking, filling forms, opening dialogs. The file default-exports `async (ctx) => result`, where `ctx` holds `page` (Playwright; `getByTestId` reads `data-test-id`), `goto(route)`, `capture(label, { tag?, caption? })`, `gql(query, variables)`, `actor`, `run` and `args`. A thrown error saves `failure-*.png`. Keep snippets in the run directory.

  ```js
  export default async ({ page, goto, capture, gql }) => {
    await goto("/products/");
    await page.getByRole("button", { name: "Create Product" }).click();
    await capture("create-product-dialog");
    return (await gql("{ products(first: 1) { totalCount } }")).data;
  };
  ```

- **`gql`** and **`sql`** arrange state and read side effects.

## Recording

Use **`record`** (with `--caption "<what the flow shows>"`) whenever a change is interactive (forms, dialogs, bulk actions, drag-and-drop, state transitions, PR proof); use **`shot`** for static layout/theme/width states and Before/After pixel diffs. Requires `ffmpeg` (`brew install ffmpeg`).

A flow module default-exports `async (ctx) => result` and gets everything `exec` receives plus `step(caption)`, `pause(ms)`, `hide()`, and `show()`:

```js
export default async ({ page, goto, step, pause, hide }) => {
  await goto("/products/"); // setup: cut from the video
  await page.getByRole("button", { name: "Create Product" }).waitFor();
  await step("Open Create Product dialog"); // video starts here
  await page.getByRole("button", { name: "Create Product" }).click();
  await page.getByRole("dialog").waitFor();
  await step("Dialog ready");
  await pause(1500);
};
```

- **Trimming:** The video starts at the first `step()` or `show()`, so sign-in, navigation, and initial loading are cut automatically. Call `hide()` before slow waits (>2s spinners) and `step()`/`show()` when the result is ready; cut time never shows up as a frozen frame. A failing flow keeps every frame and saves `*-failed.png`.
- **Quality & cursor:** Renders at 2× pixel density (`VERIFY_VIDEO_SCALE=1` for smaller files), injects a smooth visible cursor with click ripples, and encodes H.264 `.mp4` (CRF 18) plus the final frame `.png`. Pass `--gif` to also produce a GitHub-safe (<10 MB) `.gif`.
- **Check the cut:** Before putting a video in a PR, verify the first frame shows the feature with its caption (no blank page or spinner)—for example with `ffmpeg -i <video>.mp4 -vf "fps=1/3,scale=720:-1,tile=3x3" -frames:v 1 sheet.png`—and fix setup placement if needed.

## Proof

- **Drive the user path.** Do every action in the browser. A step that fails in the UI fails the scenario, with its `failure-*.png`, even when the API could finish it.
- **A toast is a claim.** After a save, reload the page and read the object back with `gql`.
- **Red, then green.** For a bug, reproduce it on the base revision (or with `--tag before`), then show the fix on the same target and data (`reset` between the two) so the review page shows Before, After, Slider, and Pixel Diff side by side.

## Evidence & Review

`doctor` prints the evidence directory, and `down` keeps it. Every capture updates `index.json` and writes a self-contained `review.html` alongside it (`dev-server.log` holds the dev server's output).

- **`pnpm verify review`** starts a detached localhost server (stopped automatically on `down`), opens the review page in the user's browser, and prints `{ url, reviewHtml, feedbackJson, feedbackMd }`. Pass `--wait` to block until the user clicks **Copy fix prompt**, `--no-open` to skip launching the browser, or `--dir <evidence-dir>` to inspect a stopped run's evidence.
- **Artifact presentation order:**
  1. **Recorded videos** first (with clickable `step()` timestamps and **Pin frame**).
  2. **Before / After comparisons** when paired screenshots exist (**Side by side**, **Slider**, or **Diff** with `% changed`).
  3. **Plain screenshots with captions** for remaining captures.
- **Commenting & fix prompt:**
  - Click anywhere on an image (or drag a box) to leave a note on a bug. Hovering and pinning automatically resolves the DOM element (`data-test-id`, ARIA role, text) from `*.elements.json`.
  - Once at least one note is added, click **Copy fix prompt**—it copies a ready-to-paste markdown fix prompt to the clipboard and, when served via `pnpm verify review`, also saves `feedback.json`, `feedback.md`, and cropped pin PNGs in `feedback-crops/`. Also works directly via `file://` after `down`.
- **PRs:** Put screenshots or MP4 recordings in a PR through the PR workflow as uploaded attachments.

## Gotchas

- **One run per machine.** `up` names a live run in another worktree; run `down` there. A dead run is reclaimed.
- **Ripples.** Feature hints and the Saleor Pulse video can show for the seeded admin and cover the capture. Dismiss them in a snippet, or capture them when they are the change.
- **Dev server, not the production build.** Confirm a dev-only symptom (hot reload, slow first compile) with `pnpm e2e`, which serves the production bundle, before blaming app code.
- **When `down` fails:** stop the process on the Dashboard port, run `docker compose -p dashboard-verify-stable down` (or `-main`), and delete the `verify-dashboard/active` link under the system temp directory.
