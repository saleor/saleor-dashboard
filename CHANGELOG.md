# Changelog

## 3.20.13

### Patch Changes

- 04d16fc37: Add e2e for managing products on draft order. Add e2e for placing draft order for non-existing customer.
- 8ea94af11: Enable by default feature flag for discount rules. Remove feature flags for product and order expression filters, so that expression filter will always show. Cleanup dead code after remove feature flags.
- 1ff350a22: Assigning product to shipping method weight rate no more cause error
- be5d5e65e: Modals in the Dashboard have been aligned, so that all contains close button
- fc80e34ef: Knip was added to the codebase and workflow triggered on pull request. This means developers will now be informed about unused exports and files.

## 3.20.12

### Patch Changes

- 8db152e60: Clicking a select channel on a product list and then click close button clear filter state, so when you click again select button, only one channel filter will be selected
- 3f74d5cb2: You can now see app's webhooks' event delivery attempts in app settings. These include last 6 failed or pending deliveries with their details: payload, status and date.
- c330adeb7: You can now provide 0 variant price value during product creation
- 350194c3d: Removing not required dropdown attribue value no longer cause error

## 3.20.11

### Patch Changes

- 9fb5665f1: Test for readonly access to apps are more table, so that should not check anything before content load.
- 858439dd7: You can now see a new card in home page that can redirect you to Saleor solution engineers contact information if you need technical advice.
- e831f9b95: Selecting channel from product list does not trigger URL change, so that clicking "Select channel" button without selecting channel will not be saved in URL.
- cce3b2cba: Adds conditional logic to the Merge Playwright Reports workflow, ensuring that the merge and upload steps are only triggered when the pull request has the run pw-e2e label applied.
- a5b84712a: Implementing timeouts ensures the workflow automatically terminates jobs taking too long, improving resource utilization and avoiding potential workflow hangs.
- 7e1e6a10d: Some end-to-end Playwright tests now have extended timeouts for UI elements to load. This means that automation tests should fail less. Playwright retires value has been set to 0.
- bd54e6b54: Fix a group of errors caused by reading property of undefined

## 3.20.10

### Patch Changes

- 73387c130: History timeline sections now have a bolded, dark header without a line separating them from the events.
- e91e592f7: E2E tests are no longer executed on every commit, this means performing e2e tests happens only when you add a label "run pw-e2e"
- 660f6c119: Users with "MANAGE_STAFF" permission no longer get an error when entering order details. This means that to access `privateMetadata` in variant "MANAGE_PRODUCTS" permission is required.
- 55d5a5f44: Shipping destination alert when creating a new order now has a correct link to shipping settings.
- 3dc1c6d9b: Grid no longer crashes when removing row.

## 3.20.9

### Patch Changes

- 069e6cc2c: You can now make a refund with shipping costs or custom shipping amount. This means you can make a refund without selecting line items.

## 3.20.8

### Patch Changes

- 640d5f6f5: SALEOR_119 now has increased timeouts for app instalation. This means the test should fail less.
- 09cf2adaf: SALEOR_191 now waits for the refund page to fully load
- 0eb90df03: Menu item dialog now use components form new Macaw
- bef2cbde2: Docker images will be automatically tag with with both the full version and just the minor
- 331af3943: You can now see draft order alert messages when channel is inactive or has no products
- ba5d47e8e: Modals for adding discounts and confirming deletion now use new MacawUI styles
- 942bb01db: Now you can set proper attribute value when editting content page.
- 762463819: Dashboard now scrolls the product list page to the top when you click on "Select channel" so that you can see the filter window
- ece769a9a: The gift card modals now use new macaw-ui components.
- 330012e11: MacawUI in Dashboard is now the newest available version. Dashboard no longer shows an error while installing packages. Price in shipping method select component now aligns to the right.
- f1b06f8e8: Remove skip from installing app tests and update workflow to run it only on releases or manual
- c052612f6: Now manual tests and tests on release can run on multiple projects

## 3.20.7

### Patch Changes

- ce05ffba2: Order details page now displays the name of the applied voucher.
- f8e6049fe: Now staging environments have changed domain, that means "staging-cloud.saleor.io" is no longer referenced in our pipelines
- b428bcd9f: Legacy Dialog component is no longer used
- e5bfa1218: You can now navigate on dropdown list. Dropdown stays close on focus.
- bbba0d2dc: You can now see permission edit list use default list color instead of accent blue color.
- 642e9f7cb: Showing negative amount in order details has been aligned
- efbca2b00: Now, missing translations are properly added to the order details.
- 037c67cb2: The stock settings no longer show a message that you need to create a warehouse when warehouses are already configured.
- f879d525a: App install error page now uses macaw-ui-next styles meaning that MaterialUI is no longer used in this view.

## 3.20.6

### Patch Changes

- c8a6d86d0: Login, password reset and error pages now use new Macaw buttons, text and styles.
- 5e3cc3fa0: You can now see a message instead of a loading animation when there are no categories, collections, products or variants assigned in Discounts
- 48b4146a0: You can now add and remove tags for gift cards without any application crash
- edaf42b95: Gift card details page and customer details page no longer crash when you have only some required permissions. This means that you can now view gift card details page if you have only gift card permissions and customer details page if you have only customer permissions.
- e73034386: You can click save button on voucher creation page to trigger validation
- 6289fbde4: You can now delete draft voucher codes during creation of new voucher
- 061412866: You can now update quantity per checkout in site settings
- 9434aea16: Make MenuItems' container scrollable in navigation section

## 3.20.5

### Patch Changes

- 0b9296f1c: You can now replace all environment variables instead of only API_URL in Docker and nginx
- d29c3f89d: Tests for shipping methods now wait to content load to start test
- fd29d47cb: Now developer can see the traces within Sentry
- f89484cc4: Plugin details view now displays channel list with proper padding and text with proper size.
- b464ee243: Now sentry sample rate sents only 10% of the traffic
- cfe015ab2: You can now see errors when required attributes are empty during product or page edition
- a1420b2c4: Page type page now displays section description in multiple lines.
- 8b345e605: Transaction capture modal no longer shows "Error" text when API error occurs. This means that the modal closes when mutation finishes so that result is visible.
- cf2eb131f: Now you can see initials in your account details when there is no avatar image set for your account.
- ef1c9cba5: Subscription query editor no longer shows incorrect required permissions for inserted query.
- 5098f2674: You can now assign more than 22 attribute for product and page type
- 508e53e6f: Category input in product page is no longer collapsed when empty

## 3.20.4

### Patch Changes

- 55d49ee01: You can now run all e2e tests without attributes.spec interference
- e094fa61e: The migrated dropdown components and there types no longer exist within the codebase
- e14df76d8: You can now run E2E tests locally with no issues
- 54b212460: Rich text editor errors related to 'holder' no longer are sent to Sentry.
- 4a593993c: You can run order e2e tests with updated test data
- e635bc153: You can now view channel and product details pages on tablets
- f29141acc: You can now search by order number in Navigator search.
- a711406f2: Components that show app token now display text in multiple lines instead of one.

## 3.20.3

### Patch Changes

- bd8fc8757: You can run e2e test for an order type discount in a draft order
- b39b04c50: Text in Dashboard now is aligned and is displayed correctly

## 3.20.2

### Patch Changes

- fd36e8e08: From now dashboard will be deployed to load test services in dev cloud
- 6f45d4435: Drop legacy Dialog and replace it with new macaw Dialog component in action dialogs,
  order change warehouse dialog, order payment dialog, add staff member dialog,
  staff user password restart dialog, tax select country dialog.
- 5b8262d72: Button for adding new refund now has a shorter label
- a565113e6: Fix custom ref checkout in dev deployment CI workflow
- 9f10e1bdb: Dashboard no longer uses Typography and Skeleton from Material. These components were replaced with MacawUI ones
- 088842b70: You can run E2E tests for inline discounts in draft orders
- a77ff9f9e: You can now see tax dropdown taking full width
- 15d5b8747: Saleor Dashboard no longer uses MUI Card component, it uses DashboardCard instead.
- 5a1025570: Add new service to dev deployment CI workflow

## 3.20.1

### Patch Changes

- 81d909bd1: You can now see macaw ui migration progress
- 125883658: Product variant forms now show missing price and name errors when these fields are empty.
- 55e72b855: Edit refund view no longer display title with typo when edit refund with line items
- 27a47265a: The legacy selects are no longer present within the codebase, this means you should use the ones from new macaw when developing the UI
- d4e284996: You can run e2e for updating order with non-manual refunds in status draft/failure

## 3.20.0

### Minor Changes

- 618bb01aa: E2E Fixing flaky navigation tests
- f9d1b2b7c: Adding CodeInspector plugin
- 8943ae241: Now you can see columns and their ordering that you previously selected when swtich betetween listing pages.
- 563b86557: Add tests for thirdparty apps
- 1fc4c348d: Swap new refund with with old one when feature flag toggle
- cb5988f38: E2E tests for customer CRUD
- 8856e2f03: You can now see Marketplace app list on automation deployment.
- 1dcb956f4: Adding e2e tests for promotion CRUD
- bdfb5e8e3: Now selected columns on the product list are being saved when browsing order details.
- 12622c182: Migrate dashboard to new font tokens
- 6c5be6662: Fix flaky test - TC: SALEOR_3 Create basic product with variant
- 5c30c8d46: Replace back icon with cloud one in sidebar return to cloud link, update copy to just Saleor Cloud
- 2111f9305: Now, the developer can access sidebar components on each page directly.
- e08dd6420: Introduces new refund flow for orders that allow users to refund items base on transactions. Grant refund and send refund is a single flow. User first has to create draft refund and then can transfer funds in one flow.
- bed0fa3b5: The list of transactions is now placed under the new section called "Transactions" when you visit order details page
- 93f5dcebf: You can now run e2e test for a manual refund type
- f1e716e86: Order Refund views no longer display duplicated errors or no errors at all when submitting the form.
- c14402c4a: You can now run E2E Playwright tests for staff members CRUD
- 687b1346e: You can now browse listing pages without additional reloadings
- e02050a43: This change adds a reusable GridTable component for ephemeral data edition.
- a9745e492: Remove brackets next to each order status title due to cause confusing for the clients
- 66f565d24: Adding tests for promotion rules CRUD
- ca23d8547: You can now create refund with lines even if all lines have been previously refunded.
- f7bb80cbe: The API_URI is no longer used across the codebase. API_URI stays in workflows for backward compatibility
- 0589970ef: Always show charge and authorized amount in payment section of order details
- d9bc7544e: Cypress tests are no longer possible to be executed
- 9c5e78652: This change disallows creating refund for orders created in transaction flow channels that have no transactions, as well as orders that have no refundable transactions
- 92ed22708: Allow to manually override number of shards to use during manual re-runs
- 68eb5cd62: Refund add dialog no longer allows proceeding to refund with lines view when all lines have been refunded and manual refund view when user doesn't have payment permissions.
- 9b87e78d4: You can now select created at column in product list
- 202b18fb5: Refactoring playwright setup file and moving auth specs
- 1c01b463a: Modal for refund reason now has an improved copy
- 4c919c106: Grid peersistance implementation
- 172bbe089: Adding prettier for code formatting
- be40ffd78: Fixing flaky tests - TC: SALEOR_32 and TC: SALEOR_33
- 4603cc532: Refund with lines view no longer allows creating/editing a refund with amount exceeding charged amount for selected transaction
- ceada3108: Changed trigger to workflow_dispatch and switched from issues to pr as a source of metrics
- d65766193: Warning message on manual refund view is no longer unreadable on dark mode
- b3a87cd5e: Implement refund add modal
- 1c8df0f59: Refund table now displays user initials on the avatar and full name on hover instead of an email.
- f25bf71fc: Adding e2e tests for permission groups
- 06678d0bd: Fixing flaky test - TC: SALEOR_106 Issue gift card with specific customer and expiry date
- e2e5c716c: Add playwright tests for edit and remove product types
- dbfe9b7f7: Rewritten tests for setting balance and exporting gift cards
- f84515021: E2E Test for adding promotion rules
- 08b55d409: Fixing flaky e2e tests
- d46265dfe: Introduce view for manual refund transaction
- b41583432: E2E Playwright tests: SALEOR_187, SALEOR_205, SALEOR_59, SALEOR_198, SALEOR_106 are no longer flaky
- 6597aaaef: Fixes incorrect button label for adding or editing refund reason
- ae560bf9d: Fixing assertions in flaky Playwright tests
- 1a3748728: Adding the new variant as a row is no longer possible from the product details. This means "add new variant" button now leads you to the variant creation page
- 04ca14958: For old verions tests with "old release" tag will be executing. Additionally adds more detailed title to results on slack and testmo"
- c0031af37: Amount input in refund form no longer displays incorrectly formatted prices after recalculation
- 1bfc3f5ab: Transaction refund related views no longer display confusing descriptions.
- c3ca12283: You can now toggle improved refund flow in features preview
- 3af5ac04c: Filters for orders now allow filtering by ID. This means its form handles one or multiple ID that you can attach by using comma, space, or enter for separation.
- ca83d3acb: Manual refund form no longer allows values greater than charged amount for selected transaction and now allows positive values lower than 1
- 88138bef4: Fixing another batch of flaky E2E tests
- d6c03b077: QA Adding back tests-nightly workflow
- 2c84b7aee: You can now open channel selection by clicking "Select channel" within any price cell on the product list. This means the dash "-" sign is no longer displayed there
- 5faad9ee3: Introduce menu items with sortcuts for GraphQL playground and search actions in sidebar.
  Move "Go to Saleor Cloud" button at bottom of sidebar
- bde2fe886: Changed e2e test case ids to remove duplicate case ids and fix inconsistencies between repo and Testmo. Thanks to this, our QA reports will be more accurate
- 31e4575df: add playwright test for translations
- d61fdb0b6: Add site settings e2e test
- 16b47e2bf: Fix duplicate validations on refund view
- 634265976: Show all transaction in manual refund view, disabled those that are not refundable
- a6ed4570f: Removing skips from e2e tests
- 2a091894f: This change replaces refund datagrid on order details view with GridTable for better clarity and UX.
- 024f2d012: # Optimizing playwright setup and playwright.config.ts files

  -Adding a conditioning to auth.setup.ts file to use existing auth json file if it's applicable
  -Added some optimizations to playwright config file
  -Cleaned up gh action for playwright tests (removed Cypress references)
  -Updating gh workflow for PR automation with extra test sharding
  -General cleanup of redundant code

- 488c8e409: Implement refunds datagrid on order details
- fb4d33a5c: Orders: In order list view you can now use new, easy to use and improved filters.
- 855a97419: You can now run E2E tests for refunds
- f95fcc447: Vertical lines are no longer visible for read-only grid tables
- 151f42b3d: E2E fixing flaky gift cards tests
- 2b0f7602f: Adding e2e navigation tests
- 7a7f0e447: Run tests from other repo
- bb16de58e: You can now see pending manual refunds on order details view.
- 70b2c40d0: Fixing still flaky test - TC: SALEOR_205 Bulk delete customers
- 434b169ab: Fixing flaky test - TC: SALEOR_205 Bulk delete customers
- 6a2c4a0a4: This change replaces the datagrid on refund create & edit views with GridTable component
- b048a5090: Introduce new icons for menu, remove not used icons
- 005713e8e: Now savebar is aligned with the rest of layout
- a47581e31: Adding e2e tests for attributes
- 99a9c2837: Fixing flaky e2e tests
- dd8d60a4e: Fixing flaky test: TC: SALEOR_87 Edit voucher Usage Limits: used in total, per customer, staff only, code used once
- 12d7b9021: Open release PR after automation tests for core releases passes
- fd8368fd4: Fixes button font weights
- ec21ae379: Add playwright tests for page types
- 7d7fd4e12: New github action gathering repo metrics
- 18492763f: Now you can see the updated appearance of the bottom bar that holds save and back actions. This means functionality has not be changed
- c956f3543: Fixing flaky E2E test for gift cards
- 251e206f3: Remove branch name warning from pre-push
- 7077d6a55: Use dummy app in delete app test
- 99d1c6f83: Fix typo in postTestsResults.js
- b8bd24297: Refund views have now more consistent UI

### Patch Changes

- 7ff18ac1e: Product edition no longer change the others work when changing different fields simultaneously. This means UI sends only form fields that were changed.
- dfb19e5e2: The legacy multiselect are not longer present within the codebase. this means you should use the ones from new macaw when developing the UI
- 9d8a21f51: Login via API in order to setup playwright tests is working in serial mode
- f53973f2d: Manual transaction modal has now improved design that matches other modals.
- 345eeb041: You can now run e2e tests without flakiness
- f99fc51cd: Fix building docker image after move service worker to assets dir
- a9c750a01: You can no longer see a duplicated cancel button when canceling the transaction. This means you now can go back to edition by using "back" button and "cancel" to continue your intention
- 31a73ea21: Fixes a bug where order and gift card details views show incorrect avatar in history component. Notes added by apps will now show app's name and avatar. All events will now use the same date format to improve consistency.
- 2952fe571: The selected value is no longer filtering the options when using any select list with autocomplete
- a246798df: Fix showing empty tooltip when no content by bumping macaw-ui to newest
- 7f729f2d2: Dashboard will now allow to set publication date and availability date with time. This change also replaces deprecated date fileds with datetime fields.
- 97c0c844d: Read-only metadata keys and values will now be displayed as regular inputs, making them easier to read and preventing them from looking disabled.
- ea3c28809: Transaction titles in order details now include its ordinal number and creation date. This means that all titles now follow the same format.
- 9226dc965: Fix showing empty price when value is zero
  Improve showing discount type in order payment details
- d0ef1f3d8: App and User avatars in order details now all have the same color.
- 1028d48d8: You can now open issue gift card modal without any flickering
- 4eaa036cc: Fix product list crash when description contains empty object
  Improve description by removing html tags and &nbsp;
- f6d44a902: Manipulating timeouts of Playwright tests
- ad3ad6d84: The boolean attribute has been changed from a toggle to a select. This change helps visualize when the attribute has not been set.
- 3231bb525: You can now properly edit permission groups when you have full access
- 528fef012: Product details view will not show product categories with its ancestors. It will make it easier to choose product's category.
- c10dd8a6a: Add clarity to order cancel dialog
- b475eb8b5: Add product analytics on cloud
- 0fb6777c4: History component's texts will now have unified colors
- 18cb0ec76: Adding tests for readonly access to Apps
- db8b2d9b9: Flow settings in channel creation will now persist after channel is created
- 56eb4d649: Searching for countries and other items is now more efficient, making it easier to find what you need. Additionally, the Dashboard Navigator UI has been improved to match the rest of the application, providing a more consistent experience.
- 232cd2a12: Previously we allowed user to select either flat rates or any tax app. To avoid problems if there are more tax apps installed this change adds ability to select tax app that will be used to calculated taxes per channel. User can also select tax app for country exception while configuring taxes. Related [RFC](https://github.com/saleor/saleor/issues/12942)
- e7e639b79: Addedd support for the BrokerProperties webhook header
- 9edf2eabc: Products in a list of products to be excluded from shipping will no longer be selectable if not available in chosen channels.
- e234ddc0f: Fix showing promotion discount type in order summary
- ddd28ecf1: Increase playwright maxFailures to 10 (how many allowed failures, if exceeding skip remaining tests)
- 290104119: Waits if editorjs is ready before it's destroyed. This change aims to lower number of alerts caused by editorjs
- c8f4b0ad3: Set codeowners based on new GH groups
- f82600a16: Fixes an issue that prevented users from pasting values smaller than 10 into datagrid cells
- d1430ea40: Avatars in transaction events no longer show broken image instead of initials.
- 4bd369b09: Now you can see the reason why shipping methods are incorrect when creating draft orders. This means creating new draft orders will pop up an error with the details of incorrect shipping.
- 217cb106d: The selected value is no longer filtering the options when using any select list in product variant table
- 69d2c6bec: This change replaces old service worker with a noop service worker. Saleor Dashboard will no longer actively use service worker for caching and registering fonts.
- 51a360f2a: Improve error color on datagrid
- dfedc1010: The action buttons in the transaction section of the order view are now unified with the other buttons in that view.
- dfe8e1d20: Fixes an issue where product export threw an error due to invalid input data
- 9edf2eabc: Show info and disable checkbox in AssignProductDialog when product does have channels overlap with selected channels
- 2830c9cfe: Fix release workflow
- 8e0e208fd9: Fix dockerfile build error caused by deleted file and bash script
- 80b8c785e: Show all gift card used in order details
- 756681f46: Show discount name for promotion discount type
