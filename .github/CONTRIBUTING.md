# Welcome to dashboard contribution guide

> [!IMPORTANT]
> We value your contributions to Saleor and want to ensure they meet our project's needs. To help us maintain quality and consistency, we ask that you follow the process described in our [Contribution Guidelines](http://docs.saleor.io/developer/community/contributing). We welcome issues, new features, documentation improvements, community support, and more.

Read our [Code of Conduct](./CODE_OF_CONDUCT.md) to keep our community approachable and respectable.

## New contributor guide

To get an overview of the project, read the [README](../README.md). Here are some resources to help you get started with open source contributions:

- [Finding ways to contribute to open source on GitHub](https://docs.github.com/en/get-started/exploring-projects-on-github/finding-ways-to-contribute-to-open-source-on-github)
- [Set up Git](https://docs.github.com/en/get-started/quickstart/set-up-git)
- [Collaborating with pull requests](https://docs.github.com/en/github/collaborating-with-pull-requests)

## Getting started

We love your contributions and do our best to provide you with mentorship and support. If you are looking for an issue to tackle, take a look at issues labeled [`Good first issue`](https://github.com/saleor/saleor-dashboard/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22+) and [`Help wanted`](https://github.com/saleor/saleor-dashboard/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22).

If nothing grabs your attention, check [our roadmap](https://saleor.io/roadmap) or [start a Discord discussion](https://saleor.io/discord) about a feature you'd like to see. Make sure to read our [Contribution Guidelines](http://docs.saleor.io/developer/community/contributing) before opening a PR or issue.

### Make changes locally

1. Fork the repository.
2. Install `Node.js` at the version specified in `.nvmrc` file.
3. Create a working branch and start with your changes!

### Commit your update

Commit the changes once you are happy with them.

### Pull Request

When you're finished with the changes, create a pull request, also known as a PR.

- Fill the template so that we can review your PR. This template helps reviewers understand your changes as well as the purpose of your pull request.
- Don't forget to [link PR](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue) to issue if you are solving one.
- Enable the checkbox to [allow maintainer edits](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/allowing-changes-to-a-pull-request-branch-created-from-a-fork) so the branch can be updated for a merge. Once you submit your PR, a MacawUI team member will review your proposal. We may ask questions or request additional information.
- We may ask for changes to be made before a PR can be merged, either using [suggested changes](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/incorporating-feedback-in-your-pull-request) or pull request comments. You can apply suggested changes directly through the UI. You can make any other changes in your fork, then commit them to your branch.
- As you update your PR and apply changes, mark each conversation as [resolved](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/commenting-on-a-pull-request#resolving-conversations).
- If you run into any merge issues, checkout this [git tutorial](https://github.com/skills/resolve-merge-conflicts) to help you resolve merge conflicts and other issues.
- **Respect TypeScript** and further strict mode. We are on the way to migration into strict TypeScript, treat your code as if it was already strict.
- If it’s possible, **leave the code a better place** - you can do simple refactoring such as moving some repeatable code to separated functions, breaking down bigger components into smaller units, and so on
- **We expect you to write unit tests** for the new code you create. Please use _Arrange-Act-Assert_ comments to divide test blocks
- Try to respect **SOLID** rules.

### Changesets

Remember to add changeset file by running `pnpm run change:add` command.
The prompt will ask you what kind of change you have made. Please pick the one according to the following guide:

- `minor` - any breaking changes, UI updates, new features, anything that changes behavior of the app, and can be considered as minor change
- `patch` - all bugfixes, insignificant UI updates (color of a button, margins, paddings, borders etc.), text typos, translation amends, CI scripts

### Continuous Integration

We run a series of automated checks on your PR to ensure that it meets our standards. If you are not sure why your PR is failing, please reach out to us. Common problems include:

- Translations messages check is failing - run `pnpm run extract-messages` to update them
- UI tests are pending - reach out to maintainers to approve them
- MacawUI migration check is failing - we are on the way to migrate to new MacawUI components, use imports from `@saleor/macaw-ui-next` instead of `@saleor/macaw-ui` in your changes

### Your PR is merged

Congratulations 🎉🎉 Thank you for contribution to dashboard ✨.
