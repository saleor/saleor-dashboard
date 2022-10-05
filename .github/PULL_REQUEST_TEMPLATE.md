I want to merge this change because...

<!-- Please mention all relevant issue numbers. -->

**PR intended to be tested with API branch:** <!-- For example: feature/warehouses  -->

### Screenshots

<!-- If your changes affect the UI, providing "before" and "after" screenshots will
greatly reduce the amount of work needed to review your work. -->

### Pull Request Checklist

<!-- Please keep this section. It will make maintainer's life easier. -->

1. [ ] This code contains UI changes
2. [ ] All visible strings are translated with proper context including data-formatting
3. [ ] Attributes `[data-test-id]` are added for new elements
4. [ ] Changes are mentioned in the changelog
5. [ ] The changes are tested in different browsers and in light/dark mode

### Test environment config

<!-- Do not remove this section. It is required to properly setup test deployment instance.
Modify API_URI if you want test instance to use custom backend. CYPRESS_API_URI is optional, use when necessary. -->

API_URI=https://automation-dashboard.staging.saleor.cloud/graphql/
MARKETPLACE_URL=https://marketplace-gray.vercel.app/

### Do you want to run more stable tests?
Tests will be re-run only when the "run e2e" label is added.

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

CONTAINERS=1