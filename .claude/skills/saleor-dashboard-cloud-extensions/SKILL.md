---
name: saleor-dashboard-cloud-extensions
description: >
  Saleor Cloud extensions: the private submodule at src/cloud-extensions/src and its public
  contract in src/cloud-extensions/index.ts. Use when setting it up, changing extension code or
  the contract, or bumping the submodule pointer.
---

# Saleor Cloud extensions

The private `saleor/dashboard-cloud-extensions` repository is a submodule at
`src/cloud-extensions/src`. It is Dashboard source: same lint, types, tests and conventions as the
rest of `src/`. The public `src/cloud-extensions/index.ts` holds the contract and loads it. The
decision and its reasons are in `docs/adr/0002-cloud-features-in-dashboard.md`; extension
internals are in the private repo's `AGENTS.md`.

## Setup

Run `pnpm cloud:setup`. It needs read access to the private repo (Saleor team only); without it
the extensions render nothing. Each git worktree needs its own setup. `pnpm dev` prints the
checked-out commit and branch and warns when the checkout is stale, differs from the pinned commit,
or is dirty.

## Changing extension code

1. In `src/cloud-extensions/src`, create a branch from `origin/main`, commit there, push, and open a
   PR in the private repo.
2. In the Dashboard, stage the new pointer (`git add src/cloud-extensions/src`) and commit it on the
   Dashboard branch.
3. Link the two PRs to each other in their descriptions.
4. Merge the private PR first. The private repo allows merge commits only, so the pinned commit
   stays valid. Dashboard CI stays red until the pinned commit is on the private `main`.
5. Merge the Dashboard PR.

To take the latest private `main` without code changes, run `pnpm cloud:update` and commit the
pointer.

## Changing the contract

Edit both sides in one change: `CloudExtensions` and its lazy export in
`src/cloud-extensions/index.ts`, and the matching member of the `CloudExtensions` default export
in `src/cloud-extensions/src/index.ts`. Add the new export to
`testUtils/__mocks__/cloudExtensions.ts` too. Run `check-types:src` with the submodule checked out.

## Messages

After changing extension messages, run `pnpm extract-messages:cloud`. It writes
`src/cloud-extensions/src/locale/defaultMessages.json`. Extensions ship English only.

## Keeping private code private

Everything outside `src/cloud-extensions/src` is public: commits, PR descriptions, ADRs, changesets
and code comments in the Dashboard describe extensions only by their public contract. Extension
code, internal endpoints and auth details stay in the private repo. Dashboard modules imported
only by the extensions carry a `@public` JSDoc tag, so knip keeps them when the submodule is
absent.
