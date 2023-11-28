closes #...

### Screenshots

<!-- If your changes affect the UI, providing "before" and "after" screenshots will
greatly reduce the amount of work needed to review your work. -->

### Pull Request Checklist

<!-- Please keep this section. It will make maintainer's life easier. -->

1. [ ] All visible strings are translated with proper context including data-formatting
2. [ ] Attributes `data-test-id` are added for new elements
3. [ ] The changes are tested in Chrome/Firefox/Safari browsers and in light/dark mode
4. [ ] Your code works with the latest stable version of the core
5. [ ] I added changesets file (instructions in [contribution guide](https://github.com/saleor/saleor-dashboard/blob/main/.github/CONTRIBUTING.md)

### Test environment config

<!-- Do not remove this section. It is required to properly setup test deployment instance.
Modify API_URI if you want test instance to use custom backend. CYPRESS_API_URI is optional, use when necessary. -->

API_URI=https://automation-dashboard.staging.saleor.cloud/graphql/
APPS_MARKETPLACE_API_URI=https://apps.staging.saleor.io/api/v2/saleor-apps
