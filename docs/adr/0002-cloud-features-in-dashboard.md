# Saleor Cloud features are copied in from a private repository at build time

Saleor Cloud features, starting with the environment switcher, are developed in the private
`saleor/cloud-console` repository under `dashboard-extensions/`. That code is written as Dashboard
source. It imports `@dashboard/*` modules and the Dashboard's dependencies, and it has no
`package.json` of its own.

In this repository, `src/cloud/index.ts` lists the exports the Dashboard mounts, as components
that render nothing. Only `src/components/Sidebar/MountingPoint.tsx` imports from it. Cloud
deploy workflows check out `cloud-console` at the commit pinned in `.github/cloud-extensions.ref`
and replace `src/cloud/` with `dashboard-extensions/`, whose `index.ts` must provide the same
exports (`.github/actions/checkout-cloud-extensions`). The build then compiles that code like any
other Dashboard source, with one copy of React, macaw-ui and react-intl.

Cloud Dashboards serve their `.map` files publicly, so `vite.config.js` drops the source text of
`src/cloud/` from the sourcemaps. The line mappings stay for Sentry.

`MountingPoint` loads the switcher with `React.lazy` only when `IS_CLOUD_INSTANCE` is set and the
user signed in through `cloud_auth.CloudAuthorizationPlugin`. Other users never fetch the chunk.
An error boundary reports load or render failures to Sentry and renders nothing, so a broken
extension cannot take down the sidebar.

## Considered options

**Runtime remote via `@module-federation/vite`, hosted by Cloud.** Cloud could ship without a
Dashboard release. Rejected for now because it needs a hosted remote, an availability failure
mode and singleton sharing of React, macaw-ui and react-intl across separately built bundles.

**An alias to a checkout outside `src/`.** It keeps the working tree clean, but it needs the
alias in Vite, TypeScript and Jest, and a Vite plugin that resolves the extension's bare imports
from the Dashboard. Copying into `src/` gets that resolution for free, and type checks and Jest
cover the real extension whenever it is present.

**Private npm package.** A published package can't import `@dashboard/*` internals without the
Dashboard exposing a versioned API, and installing it only in Cloud builds would mutate
`package.json` and the lockfile in CI.

**Iframes.** A dropdown in the sidebar header doesn't fit in an iframe, and styling, focus
handling and sizing across the frame boundary are costly.

## Consequences

**Coupling to Dashboard internals.** The extensions import Dashboard modules directly, so a
Dashboard refactor can break the Cloud build without breaking the open-source one. Pinning the
`cloud-console` commit per Dashboard commit keeps every Dashboard tag buildable. Bumping
`.github/cloud-extensions.ref` is the integration point, and Dashboard modules used by the
extensions carry `@public` so knip does not report them as unused. Extensions can only use
packages that the Dashboard already depends on.

**The code is still public once deployed.** Keeping the source private hides it from the
repository and the sourcemaps. The minified chunk is still served by every Cloud Dashboard, so
endpoints and behavior remain observable.

**Translations.** `extract-messages` skips `src/cloud/`, so extension messages fall back to their
English `defaultMessage`.

**Token source.** `cloud-api` accepts the raw Keycloak access token as `Authorization: Bearer`.
The Dashboard reads that token from the `oauth_access_key` claim of the core access token. The
multitenant `cloud_auth` plugin builds that claim (`tenants/plugins/cloud_auth/cloud.py`,
`create_jwt_token`). This is an implementation detail of the plugin, not a published contract.
When the claim is missing, the switcher reports the failure to Sentry, hides the environment list,
and still offers the "Manage in Saleor Cloud" link.

**CORS on `cloud-api`.** The browser calls `cloud-api` directly from each environment's
Dashboard origin, so `cloud-api` must allow those origins. That needs origin regexes that match
environment Dashboard domains, not a fixed list.

**Configuration.** The `cloud-api` base URL comes from the runtime `CLOUD_API_URL` value, which
includes `/platform/api`. The deploy workflows set it per tier: prod
(`https://cloud.saleor.io/platform/api`), staging (`https://cloud.staging.saleor.io/platform/api`)
and dev (`https://cloud.dev.saleor.io/platform/api`).

**Local testing.** Check `cloud-console` out at `.cloud-extensions/` and copy it over
`src/cloud/` the way CI does:
`git clone --sparse git@github.com:saleor/cloud-console.git .cloud-extensions && git -C .cloud-extensions sparse-checkout set dashboard-extensions && rm -rf src/cloud && cp -R .cloud-extensions/dashboard-extensions src/cloud`.
Run `pnpm run dev --port 3000` with `API_URL` pointing at a dev or staging environment,
`IS_CLOUD_INSTANCE=true` and the matching `CLOUD_API_URL`. Jest and `check-types:src` now cover
the extension too. `.gitignore` keeps the copied files out of commits, and `extract-messages`
skips `src/cloud/`. The copied `index.ts` still shows as modified, so restore it with
`git checkout src/cloud/index.ts` before committing.

## Open topics

- `cloud-api` CORS: add the origin regex for environment Dashboard domains.
- Multitenant: add a test that locks in the `oauth_access_key` claim, so the switcher does not
  break silently.
- Keycloak: confirm that the access token's `aud` includes `cloud-dashboard`.
- Cloud console: fix the refresh-token leak in the `/api/token` endpoint.
