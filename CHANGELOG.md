# Changelog

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
