# Changesets

This folder contains [changesets](https://github.com/changesets/changesets) — one
file per user-facing change, used to generate the changelog and version bump on
release.

Add one with:

```bash
pnpm run change:add
```

## Only `patch` changesets are allowed

A custom linter (`scripts/check-changesets.mjs`) runs in pre-commit and in the
`lint` CI job. It rejects any changeset whose bump type is not `patch`.

Why: **minor** (and major) version bumps are part of the **release process** and
are performed **manually** by the release owner when cutting a minor release —
they must not be declared in a changeset added in a feature PR. Every changeset
that ships between minor releases is a `patch`.

So your changeset frontmatter should always look like:

```md
---
"saleor-dashboard": patch
---

Description of the change.
```
