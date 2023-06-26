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
6. [ ] I added changesets and [read good practices](/.changeset/README.md)

### Test environment config

<!-- Do not remove this section. It is required to properly setup test deployment instance.
Modify API_URI if you want test instance to use custom backend. CYPRESS_API_URI is optional, use when necessary. -->

API_URI=https://automation-dashboard.staging.saleor.cloud/graphql/
APPS_MARKETPLACE_API_URI=https://apps.staging.saleor.io/api/v2/saleor-apps

### Do you want to run more stable tests?

To run all tests, just select the stable checkbox. To speed up tests, increase the number of containers. Tests will be re-run only when the "run e2e" label is added.

1. [ ] stable
2. [ ] giftCard
3. [ ] category
4. [ ] collection
5. [ ] attribute
6. [ ] productType
7. [ ] shipping
8. [ ] customer
9. [ ] permissions
10. [ ] menuNavigation
11. [ ] pages
12. [ ] sales
13. [ ] vouchers
14. [ ] homePage
15. [ ] login
16. [ ] orders
17. [ ] products
18. [ ] app
19. [ ] plugins
20. [ ] translations
21. [ ] navigation
22. [ ] variants
23. [ ] payments

CONTAINERS=1
