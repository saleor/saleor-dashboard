# Welcome to dashboard contribution guide

Thank you for investing your time in contributing to our project!

Read our [Code of Conduct](./CODE_OF_CONDUCT.md) to keep our community approachable and respectable.

In this guide you will get an overview of the contribution workflow from opening an issue, creating a PR, reviewing, and merging the PR.

## New contributor guide

To get an overview of the project, read the [README](../README.md). Here are some resources to help you get started with open source contributions:

- [Finding ways to contribute to open source on GitHub](https://docs.github.com/en/get-started/exploring-projects-on-github/finding-ways-to-contribute-to-open-source-on-github)
- [Set up Git](https://docs.github.com/en/get-started/quickstart/set-up-git)
- [Collaborating with pull requests](https://docs.github.com/en/github/collaborating-with-pull-requests)

## Getting started

### Issues

#### Create a new issue

If you spot a problem with the docs, search if an issue already exists. If a related issue doesn't exist, you can open a new issue using a relevant issue form.

#### Solve an issue

Scan through our existing issues to find one that interests you. You can narrow down the search using labels as filters. If you find an issue to work on, you are welcome to open a PR with a fix.

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

### Continuous Integration

We run a series of automated checks on your PR to ensure that it meets our standards. If you are not sure why your PR is failing, please reach out to us. Common problems include:

- Translations messages check is failing - run `npm run extract-messages` to update them
- UI tests are pending - reach out to maintainers to approve them
- MacawUI migration check is failing - we are on the way to migrate to new MacawUI components, use imports from `@saleor/macaw-ui/next` instead of `@saleor/macaw-ui` in your changes

### Your PR is merged!

Congratulations 🎉🎉 Thank you for contribution to dashboard ✨.
