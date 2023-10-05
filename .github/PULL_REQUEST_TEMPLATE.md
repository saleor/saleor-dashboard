closes #...

### Screenshots

<!-- If your changes affect the UI, providing "before" and "after" screenshots will
greatly reduce the amount of work needed to review your work. -->

### Pull Request Checklist

<!-- Please keep this section. It will make maintainer's life easier. -->

1. [ ] This code contains UI changes
2. [ ] All visible strings are translated with proper context including data-formatting
3. [ ] Attributes `data-test-id` are added for new elements
4. [ ] The changes are tested in Chrome/Firefox/Safari browsers and in light/dark mode
5. [ ] Your code works with the latest stable version of the core
6. [ ] I added changesets file (instructions in [contribution guide](https://github.com/saleor/saleor-dashboard/blob/main/.github/CONTRIBUTING.md)

### Test environment config

<!-- Do not remove this section. It is required to properly setup test deployment instance.
Modify API_URI if you want test instance to use custom backend. CYPRESS_API_URI is optional, use when necessary. -->

API_URI=https://automation-dashboard.staging.saleor.cloud/graphql/
APPS_MARKETPLACE_API_URI=https://apps.staging.saleor.io/api/v2/saleor-apps

### Do you want to run more stable tests?

To run all tests, just select the stable checkbox. To speed up tests, increase the number of containers. Tests will be re-run only when the "run e2e" label is added.

1. [ ] stable
2. [ ] app
3. [ ] attribute
4. [ ] category
5. [ ] collection
6. [ ] customer
7. [ ] giftCard
8. [ ] homePage
9. [ ] login
10. [ ] menuNavigation
11. [ ] navigation
12. [ ] orders
13. [ ] pages
14. [ ] payments
15. [ ] permissions
16. [ ] plugins
17. [ ] productType
18. [ ] products
19. [ ] sales
20. [ ] shipping
21. [ ] translations
22. [ ] variants
23. [ ] vouchers

CONTAINERS=2
