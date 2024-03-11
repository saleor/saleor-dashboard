# Changelog

## 3.19.3

### Patch Changes

- 5592f674c: Fix: assigned category in voucher details is not visible
- a98053b3b: Improve condtions filtering in discount rules to prevent sending empty conditions
- 99d120b38: Add check if channel listing array is undefined before call filter on it to prevent Dashboard crash
- deed62ee0: Prevent unnecessary warehouses fetch in product variant details when variant has not channel assigned

## 3.19.2

### Patch Changes

- c7f9be3ae: Fix backup namespace for manual workflow
- e0967359e: Fix showing attribute config for use with only one permission
- e49642758: Fix flaky PW tests
- 5bd468633: "fix pt-BR locale"
- abd9a966e: fix cypress tests for managing visibility of static columns in order view
- e879c9e88: Fix obtaining version name in manual run workflow
- 380538936: Disable autocapture events
- 38c419104: Fix instance name for manual workflow
- c8e8762ad: Show promotion name in order summary, show - when no promotion name

## 3.19.1

### Patch Changes

- bb0b1a054: Fix showing empty price when value is zero
  Improve showing discount type in order payment details
- fda067f06: Add clarity to order cancel dialog
- fea94f677: Add product analytics on cloud
- a831b81d3: Previously we allowed user to select either flat rates or any tax app. To avoid problems if there are more tax apps installed this change adds ability to select tax app that will be used to calculated taxes per channel. User can also select tax app for country exception while configuring taxes. Related [RFC](https://github.com/saleor/saleor/issues/12942)
- 14091954b: Fix showing promotion discount type in order summary
- ad1fd3585: Set codeowners based on new GH groups
- cbd9c469e: Improve error color on datagrid
- 6e5528210: Show discount name for promotion discount type

## 3.19.0

### Minor Changes

- bb2232b24: Introduce gift reward to order discounts
- 951b18134: add tracking number, mark as paid and fulfill tests
- 703a93a75: Update variant information in existing product
- 01115afe6: Support mutliple condition types
- a210c06f4: Refactor Rule model
- f77c26836: Searching products on list view test
- a423387c7: Introduce discount context
- 987097918: Using pagination on product list view test
- 40f01b1e3: Delete single and bulk delete variants tests
- 698e2cd0c: Attributes critical test migrated to playwright
- f98fd6447: Add discount type to form
- 9c737a534: Update product test As an admin, I should be able to update a single product by uploading media, assigning channels, assigning tax, and adding a new variant
- d06043b21: Filter products by channel availability test
- 7c7c73ccd: Deleting shipping rate from it's details page
- bb1401beb: Create voucher with auto-generated codes and fixed amount discount
  Create voucher with manual code and percentage discount
  Edit voucher to have free shipping discount
  Edit voucher Usage Limits: used in total, per customer, staff only, code used once
  Create voucher with minimum value of order,
  Edit voucher minimum quantity of items
  Delete voucher
  Bulk delete voucher
  Edit voucher - assign voucher to specific product
  Edit voucher - assign voucher to specific collection
  Edit voucher - assign voucher to specific category
- b7f240f52: Create order with activated transaction flow in channel test
- 3b9f4eef3: Change assertion text within channels checkbox in e2e tests
- 97b05c9cf: Updated @saleor/app-sdk to 0.47.2. This change should not introduce any meaningful changes for the Dashboard.
- 2e22ba1cb: add env var LOCALE_CODE
- b7ed22f9f: fixes e2e tests which fails on nightly run orders, apps, vouchers
- 876d89b6d: Export products as csv test
- b841e52af: Migrated categories tests: Create basic category; Edit category;Bulk delete categories
- fe48a0138: Improve promotion ui aligments
- 976b34c5f: test bulk delete on product list
- 460f033b7: Migrated warehouses tests: Edit warehouse; Delete warehouse
  nightly workflow: do not trigger test complete job if testmo-report-preparation is skipped/failed
- 05dc81380: Collections tests: Create collection; Edit collection: assign product; Bulk delete collections
- c09ef4d43: Support order conditions in rule summary
- 8766b2176: Add Category and Collections columns to the product list datagrid.
- 016bb7c55: update home test assertion after removing UI elements from home
- 20d75b272: dot env update
- 50404fc2a: Handle complex condition in promotion rule
- d02dcf960: Fix waiting for dom load state in playwright e2e tests
- 28a8f1c1b: Tests migrated to playwright:
  - Create basic channel;
  - Edit channel settings to contain transaction flow, allow unpaid orders, authorize instead of charging, prio high stock;
  - Delete channel
- 90772446c: Grant & send refund in return & replace view
- 07d5f35d6: Delete single product test
  Refactor page class files to eliminate duplication of variables
- 7d59680a9: Mark order as fully paid and fulfill all variants test
  Manual capture transactions and fulfill order test
- 6f6e5ef8d: Migrated taxes tests:
  - Change taxes in channel to use tax app
  - Change taxes in channel: enter prices without tax, do not show gross price, add country exception
  - Add new country and tax rates to it
  - Add new class with metadata and set tax rate for single country
- bb2232b24: Introduce is gift column in order and draft order details datagrid
- 621c36835: Test for deleting a shipping method from a shipping zone details page
- 465aa7b28: Adding e2e tests for bulk deleting shipping zones and updating one
- a3b365be3: Use Combobox component instead of Select in promotion rule channel input
- d43a3c93c: Maintenance e2e tests:
  - Class unification - selector initiation moved to constructors
  - Adding navigation logs to specific products, channels, etc
  - Improved imports: using aliases in all files
- c23e8bc8b: e2e tests maintenance - removed duplicated cypress tests since we have coverage in playwright
- 50404fc2a: Add support for order promotion API
- 5546daa91: Shipping Adress change test
  Billing Adress change test
- bcbed0ddf: Draft orders bulk delete & Create draft order tests
- 92d02a34b: Tags and scripts for playwright, pr-automation workflow updated
- 0f056427b: Migrated gift cards tests:
  - Issue gift card
  - Issue gift card with specific customer and expiry date
  - Resend code
  - Deactivate gift card
  - Activate gift card
  - Edit gift card
  - Bulk delete gift cards

### Patch Changes

- 39711fee6: Show info text when no options to select in discount condtion, stop sending empty condtion
- a2bac68f5: Fix height of multiselect for filters/promotions
- 5165c5217: Fix loading service worker
- f768b2fb5: Update pull request template
- dc64404fa: Improvments for discount rules
- d712e65d7: Fix deleting draft orders
- 6473419ac: Fix variant availability
- 9fae33f04: Update MacawUI to version 1.0.0-pre.21
- a077f1c8c: Add dev deployment workflow
- d5d3c4399: Introduce filters to discount list page
- 9a4884135: Fix action that configures login to staging Saleor Cloud for CLI
- b606c3e6f: Add manual test run for e2e
- 1a32555ff: Make discount rules flag visible
- dd6f46fba: Fix apps colors, fix grid checkbox
- 488a4b48f: Amounts are now hidden on Transaction events list for `CHARGE_REQUST`, `CHARGE_SUCCESS` and `CHARGE_FAILURE` events.
  These events don't support providing amounts, and they were always displayed as 0.
- e610ca5af: Use composite actions in pr automation workflow
- 4d82f8fea: Add cron job for PW tests
- 5725e72e8: Fix workflow deployments for PR automation
- ce4eb488a: Fix redirect action in new context and relative urls
- 8e0e208fd: Fix dockerfile build error caused by deleted file and bash script
- 9208b3e5a: Fix discount hasEndDate selector in tests
- 9cd348f1f: Remove app version from app list view
- ca73a902e: Add permissions for push when cherry-pick
