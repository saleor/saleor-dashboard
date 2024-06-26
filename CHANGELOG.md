# Changelog

## 3.15.8

### Patch Changes

- 19875bcd1: An error is no longer raised and visible to the user when focus combobox input
- 17fc34f7f: An error is no longer raised and visible to the user when saving translations
- bf6a856d0: Fix error related to can not read property of undefined in metadata and reading search page info
- c83972888: An error is no longer raised and visible to the user when saving credential is not supported

## 3.15.7

### Patch Changes

- e688404a2: Add manual workflow for cypress tests
- 7d9a959ce: Run cypress or playwright tests on release
- 78d4279dc: update old versions and new home page e2e test - cypress
- 6e27ae57f: Add Cypress split to run tests in parallel
- a781c90b2: Dashboard no longer crashes when assigning reference attribute while creating content.

## 3.15.5

### Patch Changes

- f8ce7932b: Use version from package.json to trigger deployment

## 3.15.4

### Patch Changes

- 49a0fb20d: Fix address form keeps country state from prev address provided
- a33266ef5: Fix blocked scroll in fullscreen datagrid
- 1d414609d: Fix externall app crash due to feature flag provider
- 3fa88275c: Fix prepare release workflow dependency
- bc81e3138: Update workflow to be compatible with changesets

## 3.15.3

### Patch Changes

- df6480de4: Increate memory for vite sourcemaps (sentry)
- 121c9bac3: Fix layouts for translation pages
- 5378f0c46: Update changesets based deployments
- 6c640d267: Fix rendering of top products on home, when attributes does not have value
- 36a125adc: Update vite sentry library and handle legacy uploading
- 4e029c64b: Use sentry CLI instead of vite plugin
- 3d3be4334: Fix attribute creation when we change input type

## 3.15.2

### Patch Changes

- c33134957: Fix assign warehouses in variant page

## 3.15.1

### Patch Changes

- f452c6540: Fix user can not reach all warehouses in dropdown
- e292059b8: Fix showing only first 50 warehouses at variant page
- fdc7bc99a: Fix docker build with feature flags

## 3.15.0

### Minor Changes

- c0909f325: Added apps webhooks status to "Manage app" page. Now the page displays a list of all registered webhooks and information if its enabled or disabled. If Webhook has any pending or failed delivery attempt, they will be listed with a timestamp and status.

  The Manage App page was refreshed with borders to match layout of other Dashboard pages

- f14ba5bcf: Introduce datagrid on staff members list view
- 7309c736b: Clean up FilterElement type
- 093388c46: Add rowHeight prop to Datagrid component
- 23a580aa4: Manage App view will now refresh pending/failed webhook deliveries every 5 seconds
- a25a8db3d: Added information in Plugins Page about the App Store. Now plugins page informs that Apps will replace plugins in the future. Also every plugin that is "active" will display an inline message to visit the App Store for the app replacement
- 66976d547: Drop dynamic column toggles in column picker
- 3093be1b7: Drop deprecated fields in transactionsAPI
- b86bb025a: Introduce new column picker in Categories list
- dac77169a: Add channel setting which allows unpaid orders
- 4ad8c1536: Introduce datagrid in collection list view
- 8592c6a4d: Introduce new column picker on order details datagrids
- a333adbb4: Introduce datagrid on customer list view
- b386cf060: Add order exipration TTL field to channel settings
- 158b22d1e: Introduce two new hook to handle datagrid, useFilterPresets to handle CRUD operation on filter presets and useRowSelection to handle datagrid row selection
- 9037c9cfd: Introduce datagrid on attributes list view
- 207491505: Transfer filter state to query params
- 391b429fc: Introduce new column picker in Order Draft list datagrid
- 97e440189: Implement url management for filters, clean up types
- 2ab11bb40: Fix clear row selection and show delete button after bulk deletion in categories, cllections and order drafts list
- 198341cb4: Prototype of the new filters for product listing page
- 52f58eb00: Introduct datagrid on discounts list page
- a7d39d7f1: Add all static fields for product filtering
- 8dd453d6d: Introduce common bulk delete button and improve bulk deletion copy
- 1cb6e8b5f: Add possibility to manually edit permissions of the app. Now every user with MANAGE_APPS permission can grant any permission to the app via App -> Manage App view or remove permissions previously assigned.
- 4e8942f90: Cover attributes based on input type
- fa6e46979: Now App can use app-sdk (with 0.43.0 version) to request new permissions from the dashboard user
- b66af9947: Migrate Home page to new macaw components
- fec476b7e: Add API handlers to expermiental filters
- 23bb5976c: Constrains implementation for filter rows
- 41fde64fc: Introduce datagrid on voucher list view
- 440f5e667: Add datagrid support in vouchers e2e tests
- 0995b02df: Introduce read-only datagrid on content view
- b4f11eff6: Introduce datagrid on category listing page
- e37c8ce44: Refactor product list datagrid to use useFilterPresets and useRowSelection hooks
- 07fa3bc0c: Properly type event handler for experimental filters
- a63af3ab7: Assign channel permission to permission group
- 4652f5653: Refactor initial index for filters
- 09c9024e0: Introduce datagrid on order draft list
- d282769fd: Refactor order list datagrid to use useFilterPresets and useRowSelection hooks
- a43c9254b: Removed "go back" arrow in App view, where app is mounted.

  This arrow caused a confusion between Dashboard navigation and App internal navigation.
  Now, to go back to the Apps List, the side navigation must be used.

  The "Manage App" view was not changed - arrow is still displayed to navigate back to the App Page.

- 1cb6e8b5f: App's "about" section will be rendered as a plain text, instead of a markdown
- ce1854b2c: Introduce datagrid on gift card list page
- b0214c645: Apps: Fixed problem with Permissions Modal that was clipped on smaller screens. Now long permissions list is scrollable.

### Patch Changes

- 0ea8f3237: Replace all old Accordion components with new from macaw-ui
- 05175c7bd: Add 1px bottom padding to datagrid
- f8c9317ed: Experimental filters: fix types and refactor initial api state
- 5a6c25500: Experimental filters: add support for constrains in MacawUI
- 58a3c26f7: Applied refactors on "apps" module. Renamed some "marketplace" symbols to "appstore". Replaced some "Default" exports to named ones. Didn't introduce any visual or functional changes.
- c99fa1c5a: Run chromatic on main after PR is merged
- d38abfb16: Experimental filters: warning banner for legacy filter presets
- a8babc425: Changed rendered apps' thumbnails to be bigger. They are sharper now.
- be6adb28d: Experimental filters: fix small issues
- a08d034e7: Fix unability to save attribute value when the attribute value is invalid (attribute value should be only send when attribute input type is swatch)
- 03d9e92c9: Run prettier against source folder
- d9c600452: Experimental filters: adjusts UI and fix types errors
- df1459949: Experimental filters: add search params to query and unit tests
- 423858e86: Experimental filters: fix providers issues
- 52bac3b8f: Update ExpressionValue for fitlers
- de098fd52: Order page adjustments
- 59497d411: Experimental filters: before & after query params in filters
- 8fbf0d4a8: Set custom version within the workflow of deployments from main
- e033d6bf9: Experimental filters: filter presets & date fixes
- 33b4199ce: Experimental filters: fetch product list based on selected filters
- 9a3c9de81: Fix throw error when there is not description data in product list datagrid
- 6cf3ab325: Make titles font stronger
- 8d16513ea: Enable method signature style ESLint rule
- 1c7486818: Once app installation failed, error page redirected to Dashboard root. Now it's fixed - failed installation redirects to the Apps page.
- 50cb7a14b: Update UI library version
- c4d8fe1bb: Refactor to use common method to delete filter presets
- ad01400ab: Fix security deps in github workflows
- 6cc8f7874: Turn off ESLint rules with small benefit-to-effort ratio
- bb1f78d4e: Fix couple of eslint rules connected to display name and no-case declarations
- 4c4397627: Remove constraint for given filter when there is no depepdent element
- fcd64f65e: Experimental filters: use context for data providers
- 80ef369f8: Make views with list full width
- a1482cc45: Refactored Manage App screen to use Macaw/next. Added missing empty-state messages, like missing permissions or app description.
- 4433a9463: Refactoring FilterContainer in filter feature
- 5e6794fa9: Experimental filters: adjust popover UI
- 6d6d1588b: Start mapping selected filters to query variables
- cc0e0e58f: Experimental filters: refactor API hooks.

  This PR refactors API hooks used to fetch data. Right now they return the provider which then is used by the filter container to update options coming from API.

- f71e0b762: Fix customer is not present in order list view
- 1c9291932: Enable no-console ESLint rule
- 436c2af00: Handle oudside click for filters popover
- c9fcaa124: Experimental filters: update ui library to fix multiselect
- 72d4df482: Fix unable to select value in simple autocomplete field
- ae813a406: Experimental filters: add unit tests and bump UI library
- 50011f86f: Make Dashboard full width
- eba9ee660: Fix sending available for purchase date on product update mutation
- f6fa90969: Fix can not edit non-required attribute on a variant that has other required attributes
- 32d1a5b8c: Experimental filters: add unit tests and fix wrong data send to core
- 05ff53373: Fix null-cheks for filters
- b6e6a1a53: Update npm dependencies to fix security issues
- dd50f95b5: Experimental filters: add empty state and adjust popover ui
- 922c9fb4c: Fix Chrome browser crash when user click logout button
- 753b9f0c3: Add horizontal scrollbar on datagrid
- 664029407: Dashboard is sending Saleor and Dashboard versions with Handshake event to apps, via AppBridge. To achieve that, @saleor/app-sdk was updated to 0.41.0
- fa0e14282: Fix symbol-description ESLint rule
- 3123f04c6: Update to ESLint 8 & use standard-with-typescript ruleset
- 8a22109f5: Fix eslint rule no-case-declarations
- d2074f482: Experimental filters: add clear function and bumps UI to support ranges
- f3a52d2e0: Experimental filters: additional empty values & full support for ranges
- 504cfaac6: Experimental filters: add unit tests for left operands and container state
- a8794d41a: Fix `react/jsx-key` eslint rule
