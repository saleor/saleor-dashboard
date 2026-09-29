# Contributing to Saleor Dashboard

Read our [Code of Conduct](CODE_OF_CONDUCT.md) and [Saleor contribution guidelines](https://docs.saleor.io/developer/community/contributing).

Issues and PRs that do not follow their templates may be automatically rejected.

## Before you start

Bug fixes and small chores, such as typo and translation corrections, do not need prior approval or a GitHub issue. For a new feature, open a GitHub issue and get maintainer approval before implementing it.

## Development

Follow the [README](../README.md) to set up the project. Use the Node.js and pnpm versions specified in [package.json](../package.json). See [AGENTS.md](../AGENTS.md) for code conventions and checks.

For changes to source messages, run `pnpm run extract-messages`. For GraphQL changes, run `pnpm run generate`. Do not edit generated files by hand.

## Pull requests

Enable [maintainer edits](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/allowing-changes-to-a-pull-request-branch-created-from-a-fork) if you want maintainers to update your branch.

#### One significant change per PR

A PR should contain **one** significant change: a single bug fix, a single refactor,
or a single functional change. If your branch mixes several (for example a bug fix,
a refactor it needed, and a new feature), split it into separate PRs. Land
prerequisites first (for example the refactor) and stack the rest on top.

Small changes that exist only to support the main change (a renamed helper, a
tightened type, a test for the fixed path) can stay. Anything a reviewer would need
to evaluate on its own merits belongs in its own PR.

How strictly to split depends on how the changes relate:

- **Unrelated changes never ship in the same PR.** Hiding changes is prohibited,
  for example a functional change inside a refactor commit.
- **Connected changes** should preferably be split too, but combining them is
  acceptable at some point. For example, a refactor commit followed by the bug fix
  it enables can share one PR, as long as each commit contains only its own change.

For user-facing features, enhancements, and bug fixes, add a `patch` changeset with `pnpm run change:add`. Minor version bumps are handled during releases. Internal refactors, style, tests, CI/CD, and internal documentation do not need a changeset. The CI check requires one unless a maintainer adds the `skip changeset` label.
