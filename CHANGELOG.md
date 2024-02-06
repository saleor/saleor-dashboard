# Changelog

## 3.17.2

### Patch Changes

- 32eec2827: Update tests-nightly.yml - our e2e suite was skipped. Had to change chrome to electron in condition to trigger suite
- 5025ac306: Change e2e default browser to electron

## 3.17.1

### Patch Changes

- 8b63ab1c1: Fix webhook create button

## 3.17.0

### Minor Changes

- 29b87408d: Migrate product variant page to new macaw
- 5b4cf7de9: New column picker for variant datagrid
- fd942793a: Add visible checkbox in datagrids
- 72ed64630: Add metadata column to order details datagrid
- d92452366: add bulgarian translation
- 795b2083d: Enable new filters by default
- e71633a52: migrated create products tests to Playwright
- 646e72f53: Add datagrid on shipping zones view

### Patch Changes

- 8957582a3: Fix contribution guide link in PR template
- 6f6641724: Fix reading null variable autocomplete
- 69a77eeff: Add changesets status workflow that fails when there is no changeset file
- 3ba325565: Change gql codegen config to typescript and reflect env vars
- 35d6094e9: Fix group of error caused by reading property of undefined
- 2ba563ea7: Fix loading channels in order creation after publishing the new channel
- 292c51d92: add email confirmation to customer registration e2e test
- c31dfefe5: Remove attributes error, pill reference, editor js error
- cc2ecb566: Due to UI changes - staff members and variants tests fixes
- 8b57cd785: Update e2e scenarios for new filters
- 0af083f46: bring back CYPRESS_baseUrl as env var which is needed for backward compatibility
- 327008a2d: Capitalised the "Export products" button
- a6a61525b: Update usage of defaultTransactionFlowStrategy after migrating it to paymentSettings
- 6d6462888: Stop creating issues with test results
- f733c6052: Move condional filters UI to dashboard
- addfae86a: Update graphql schema
- bd3290b93: Set data-test-id for filters
- 2a202d42b: Fix fetching private metadata for Order only when staff userr
- fdc49f52d: change env var name CYPRESS_baseurl to BASE_URL
- 11feabba0: Add back buttons in webhooks and taxes views
- d42076f8b: removed force click on category selection
