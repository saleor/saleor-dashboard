# Changelog

## 3.21.0

### Minor Changes

- d4e284996: You can run e2e for updating order with non-manual refunds in status draft/failure

### Patch Changes

- 81d909bd1: You can now see macaw ui migration progress
- 125883658: Product variant forms now show missing price and name errors when these fields are empty.
- 55e72b855: Edit refund view no longer display title with typo when edit refund with line items
- 27a47265a: The legacy selects are no longer present within the codebase, this means you should use the ones from new macaw when developing the UI

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
