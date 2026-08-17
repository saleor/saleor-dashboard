# Navigation pins are stored in public metadata

User pins live in public metadata on `me`; organization pins live in a single key of public
metadata on `Shop`. Both are written as one JSON value holding model type IDs and their pin
target.

## Considered options

**Private metadata on the staff user — rejected, not implementable.** Saleor Core's
`private_user_permissions` (`saleor/graphql/meta/permissions.py:74-87`) has no owner exemption:
a staff user needs `MANAGE_STAFF` to read _or_ write even their own `privateMetadata`. The
`public_user_permissions` equivalent (`:44-71`) does return `[]` for the owner, and
`accountUpdate` deliberately exposes only `metadata` — no `privateMetadata` input, and
`support_private_meta_field` defaults to false. So private metadata would restrict user pins to
`MANAGE_STAFF` holders, which is nobody we're building this for.

**Fanning organization pins out across every staff record — rejected.** It is a one-time
broadcast, so staff hired afterwards would never receive existing pins. It is also non-atomic
across N mutations, requires a second fan-out over a drifted population to unpin, and pages at
100 (`GRAPHQL_PAGINATION_LIMIT`). Since no staff member may remove an organization pin, every
copy would be identical and read-only — N copies of one immutable value.

**Private metadata on `Shop` — rejected.** Reading it requires `MANAGE_SETTINGS`
(`site_permissions`), so ordinary staff could not see organization pins at all. Same trap as the
staff-user case.

## Consequences

`Query.shop` is unauthenticated and public metadata is resolved without any permission check, so
organization pins are readable anonymously. This is acceptable because `pageTypes` is _also_
unauthenticated — every model type ID and name is already public. We store IDs only, never
labels, so the marginal disclosure is which model types the store considers important.

Writing organization pins is gated on `MANAGE_SETTINGS` rather than the `MANAGE_STAFF` originally
proposed. `MANAGE_SETTINGS` is the better fit — sidebar layout is store configuration, not staff
account management — and `MANAGE_STAFF` on metadata mutations carries no out-of-scope-user guard.
