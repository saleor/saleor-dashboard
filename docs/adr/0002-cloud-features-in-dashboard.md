# Saleor Cloud features come from a private submodule

Saleor Cloud features, starting with the environment switcher, are developed in the private
`saleor/dashboard-cloud-extensions` repository. It is checked out as a git submodule at
`src/cloud-extensions/src`. That code is Dashboard source: it imports `@dashboard/*` modules and the
Dashboard's dependencies, and it has no `package.json` of its own. Because it sits under `src/`,
type checks, oxlint, oxfmt, Jest, Storybook and knip treat it like any other Dashboard code.

`src/cloud-extensions/index.ts` is public. Its `CloudExtensions` interface is the contract, and it
exports each extension as a lazy component. It loads the submodule's `index.ts` through
`import.meta.glob`, which matches nothing when the submodule is absent; the components then render
nothing. No aliases or build configuration are involved. The private `index.ts` default-exports an
object typed as `CloudExtensions`, so a contract change fails its type check. Jest cannot parse
`import.meta.glob`, so it maps `@dashboard/cloud-extensions` to empty components in
`testUtils/__mocks__/cloudExtensions.ts`; the private code's own tests import it directly.

`MountingPoint` renders the switcher, and with it loads the private chunk, only when
`IS_CLOUD_INSTANCE` is set and the user signed in through `cloud_auth.CloudAuthorizationPlugin`. Other users never fetch the chunk.
An error boundary reports load or render failures to Sentry and renders nothing, so a broken
extension cannot take down the sidebar.

## Pinning

Every build uses the commit the submodule pointer pins, so every Dashboard tag stays buildable.
`.gitmodules` records `branch = main` only for `pnpm cloud:update` and the pre-dev check. A
Dashboard PR may pin a commit from an open private PR. The private repository allows merge
commits only, so that commit stays valid after its PR merges. On pull requests, CI fails until the
pinned commit is on the private `main`, which makes the private PR merge first.

## CI and leaks

CI checks out the submodule with the Vault-issued GitHub token. When the token is unavailable
(fork and Dependabot PRs), CI builds without it. Private file paths and code can appear in
public CI logs; that is accepted. Chromatic never checks out the submodule, and Jest and Storybook
coverage exclude it, because both are published.

Cloud Dashboards serve their `.map` files publicly, so `vite.config.js` drops the source text of
`src/cloud-extensions/src/` from the sourcemaps. The line mappings stay for Sentry. The deployed
minified chunk is still public, so endpoints and behavior remain observable.

## Translations

`extract-messages` skips `src/cloud-extensions/src/`. `extract-messages:cloud` writes the
extension's messages to `src/cloud-extensions/src/locale/defaultMessages.json`. Extensions ship
English only for now; a nested `IntlProvider` that loads the extension's own locale files can be
added when a second locale is needed.

## Considered options

**Copying a private checkout over `src/cloud` at build time.** The first version of this decision.
It needed a separate ref file, a copy step, `.gitignore` rules and a restore step after local
development, and the private code was not checked in CI outside deploys.

**A path alias with a fallback stub.** `@dashboard/cloud-extensions` resolving to the submodule or
to a stub elsewhere needed the same fallback in tsconfig, Vite, Storybook and Jest.

**Runtime remote via `@module-federation/vite`, hosted by Cloud.** Cloud could ship without a
Dashboard release. Rejected for now because it needs a hosted remote, an availability failure mode
and singleton sharing of React, macaw-ui and react-intl across separately built bundles.

**Private npm package.** A published package can't import `@dashboard/*` internals without the
Dashboard exposing a versioned API, and installing it only in Cloud builds would mutate
`package.json` and the lockfile in CI.

**Iframes.** A dropdown in the sidebar header doesn't fit in an iframe, and styling, focus
handling and sizing across the frame boundary are costly.

## Consequences

The extensions import Dashboard internals directly, so a Dashboard refactor can break them. With
the submodule checked out, the Dashboard's own CI catches that. Dashboard modules used only by the
extensions carry `@public` so knip does not report them as unused when the submodule is absent,
and knip lists the submodule's `index.ts` as an entry because it does not follow the glob.
Extensions can only use packages that the Dashboard already depends on.

Working on the extensions is described in
`.claude/skills/saleor-dashboard-cloud-extensions/SKILL.md`. Internals live in the private
repository's README.
