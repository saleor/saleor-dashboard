# Contributing to Saleor Dashboard

Read our [Code of Conduct](CODE_OF_CONDUCT.md) and [Saleor contribution guidelines](https://docs.saleor.io/developer/community/contributing).

Issues and PRs that do not follow their templates may be automatically rejected.

## Before you start

Bug fixes and small chores, including typo and translation corrections, need no approval or issue. For new features, get maintainer approval on a GitHub issue before implementation.

## Development

Follow the [README](../README.md) for setup, [package.json](../package.json) for Node.js and pnpm versions, and [AGENTS.md](../AGENTS.md) for conventions and checks.

Run `pnpm run extract-messages` after source message changes and `pnpm run generate` after GraphQL changes. Do not hand-edit generated files.

## Pull requests

Follow the [PR template](PULL_REQUEST_TEMPLATE.md). Enable [maintainer edits](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/allowing-changes-to-a-pull-request-branch-created-from-a-fork) to let maintainers update your branch.

### Scope

Keep each PR to one significant change: a bug fix, refactor, or behavior change. Supporting edits can stay; changes requiring independent review should be split. Land prerequisites first and stack dependent PRs on them.

- Never combine unrelated changes or hide behavior changes inside refactor commits.
- Prefer splitting connected changes. They can share a PR if each commit contains only its own change, such as a refactor followed by the fix it enables.

### Changesets

For user-facing features, enhancements, and bug fixes, add a `patch` changeset with `pnpm run change:add`. Minor bumps happen during releases. Internal refactors, style, tests, CI/CD, and internal docs need no changeset. CI requires one unless a maintainer adds `skip changeset`.
