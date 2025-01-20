# Changelog

## 3.18.4

### Patch Changes

- 28a942055: Now CI workflows use updated action to upload and download artifacts
- 25165ff8c: Now CI workflows use updated action to upload and download artifacts

## 3.18.3

### Patch Changes

- ad6c8b7c0: Fixed flaky Cypress tests related to Discounts
- cb22186e8: fixes e2e tests which fails on nightly run orders, apps, vouchers
- deb6c1ea6: Add manual workflow for cypress tests
- 6de7e067b: An error is no longer raised and visible to the user when saving translations
- 28383b26a: Run cypress or playwright tests on release
- 79a2c6d11: Fix action that configures login to staging Saleor Cloud for CLI
- 8780d35e3: An error is no longer raised and visible to the user when saving credential is not supported

## 3.18.2

### Patch Changes

- e165eed62: Show info text when no options to select in discount condtion, stop sending empty condtion
- 6ba106f16: Fix height of multiselect for filters/promotions
- 3018ed8d9: Fix loading service worker
- 53ca848ba: Improvments for discount rules
- b353cebd9: Fix deleting draft orders
- 27d2a6032: Introduce filters to discount list page
- 3cbfa647e: Make discount rules flag visible
- f95e90f28: Amounts are now hidden on Transaction events list for `CHARGE_REQUST`, `CHARGE_SUCCESS` and `CHARGE_FAILURE` events.
  These events don't support providing amounts, and they were always displayed as 0.
- 1637e1213: Fix dockerfile build error caused by deleted file and bash script

## 3.18.1

### Patch Changes

- ca6bec2a2: Introduce component for promotion create and edit page
- 684a357d5: Introduce discount list page
- ecac44925: Fix sentry upload and custom version scripts
- 684dcc3dd: Auto cherry pick workflow by labels
- fa38078b8: Use new promotion API to create and update discounts
- d4f396d6c: Introduce intial component for catalog discounts
- 620ec9a61: Add exemption labels to ignore stale issues
- 1a7b05523: Fix duplicates when assigning reference attributes & eligible entities for vouchers and products
- ee824f2e8: Rename env link to cloud
- dd1d1db19: Add prices in grant refund view
- e518ef0f7: Proceed with TS migration
- e70720c63: update old versions and new home page e2e test - cypress
- fbc1a922f: Use stale action instead of stalebot
- 529362a42: Changing target of production deployments
- a2549a064: Fix cancelled and ENVIRONMENT variable availability in workflow
- 2d4c49c6b: Proceed with TS migration, decrease to 692
- a0a24ba35: Fix categories cannot read property of undefined
- 5a51e2b5e: fix pt-BR translactions
- a95ae0e12: Refactor code smell many mon null assertions
- 7781eba93: Implement fixture for handling grid events in Playwright
- ea2b6c536: Emit release for sentry from workflow
- 06fbb696d: Fix drag and drop in navigation configuration
- 36b265a39: Fix loading shipping information
- 0ed13e89b: Updated translation messages (english) for Apps content. Now "coming soon" apps are displayed as "upcoming"
- f26a2e56a: Remove enum implicit value code smell
- 629d900fb: Improve channel delete dialogs
- 7cf51e639: Remove demo link from readme
- 4a28f119d: Fix missing union types
- ba106e24f: Add missing units for attributes
- 33098f2e3: Bump @adobe/css-tools from 4.3.1 to 4.3.2
- d40b45af7: Changing target of STAGING deployments
- 815f1a112: Stop deploying dashboard to demos
- e21cba5bf: Migrate box shadow to new tokens & fix selects overflow isssue for new filters
- 909d43fa5: Bump macaw to pre.14
- b8303e64b: Add link to the cloud environment
- 09ccb0cd4: Fix sentry release. Using SENTRY_RELEASE variable to determine correct releasing for sourcemaps
- 58ecc5a51: Create instance when it has been not created yet
- 8d0c8c9eb: Fix changing channel in rule details form
- 9f5e14e52: Proceed with TS migration, remove bunch of TS strict comments
- 1da247690: Display warning for long branch names
- eb1506427: Remove certain home screen statistics
- 95d3274f4: Fix typing for form events
- 6e3704eb6: Fix discount hasEndDate selector in tests
- 2f27f6b35: Prevent empty subscription query for new webhooks
- cf56dc303: Migrate to new MacawUI color tokens
- 1b90e48b9: Fix base page fixture in playwright

## 3.18.0

### Minor Changes

- 28dafdc8c: Send order lines in orderGrantRefundCreate mutation
- 774990e13: fixes failing test: product visible in shop SALEOR_2506
- 308e5790c: Attributes critical test migrated to playwright
- 9f83d904f: Delay home queries to be non-blocking for the UI
- c8040ff4d: Implement the e2e instance managing
- f39cc6986: Use macaw-ui alias to 1.0.0 versions
- e090f1766: Introduce voucher codes datagrid
- e2975ef5c: Migrated "TC: SALEOR_26 Create basic info variant - via edit variant page" to playwright
- ae0b8dab3: Home page critical test migration to playwright
- 7329f2cdd: migrated navigation tests to playwright
- dcb3ebbda: Removed unused get info request
- 81fcd035a: Migrated warehouse creat test to playwright
- dc5ecf6c4: Migrated Create basic order test to playwright
- 2e5370ece: Migrated shipping methods tests to playwright
- 926a74bb9: Integrate voucher codes with API

### Patch Changes

- 5dffd6e71: Fix sending attibutes on variant create/update in datagrid on product details page
- 4c37703be: Fix sending too many request on line item update
- 3d28c9858: Fix changeset action for forks, block automation on contributions
- b488e850b: Updates data-test-id for variant name input on variant page
- c3f7721fe: Add 'feature' as extempt label for stalebot
- ad9fd1218: Use changes files to detect if changeset file is present
- 6b91eef72: Fix pasting data into page create type picker
- 3b48cca2b: Fix input placeholder text in the tax classes section
- 2ae9491db: Remove flaky product update page test
- be2a9b6b3: Fix form blink in customer edition for orders
- 9856c765a: update e2e voucher code creation tests
- 5de703973: Fix GHA worflow that runs chromatic on main branch
- 3d68e7bf5: Fix saving previously removed country exceptions
- 85770f680: Add new issue request templates
- 59c673b1c: removed redundant if statement in nightly workflow blocking e2e tests
- c4b60851f: fix pt-br locale
- b7c2a96f2: Fix incorrect indexing in concurrent variant datagrid bulk mutations
- 601d2364c: Fix error related to can not read property of undefined in metadata and reading search page info
- 873954f21: Fix assign attribute value dialogs showing previous search results
- a994b7e7a: Update graphql schema
- e9334e025: Change e2e default browser to electron
- 226b6030b: Fix assigning products to collection
- 3f6dcfa0e: Fix pasting float number into datagrid
- 466914f3e: Update selector for orders tests in cypress
- 060935a57: Fix clear datagrid added variants after submit
- b792f9876: Fix language switcher
- 53cef3d35: Fix copy on back button when failure during apo installation
- 205a4f210: Fix disappearing labels of reference attributes
