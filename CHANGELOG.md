# Changelog

## 3.21.0

### Minor Changes

- c665bb8: Comment from tests results will now be displayed for cloud-deployments CORE release PRs
- c8661c5: Always add comment after tests to CORE release PR, even if previous job fails.
- 8e91df3: Do not open cloud deployment release PR after automation tests for CORE
- 5da872a: Tests results slack message now show detailed version of saleor
- 08b447c: Add checkout to workflow creating release PR in cloud deployments
- 4a50cf9: Create CORE release PR even if automation tests fail
- 39671b7: Release PRs in cloud deployments for CORE releases will be created even if tests fail

### Patch Changes

- 9ac320a: You can now apply specific variants to Vouchers, alongside products, collections and categories. This means variants are now assignable in Voucher edit and create forms.
- 06623af: Now return&replace flow has a transaction selector. This means whenever using grant refund, you need to select desired transaction.
- fc75f66: Setting unsed and false values for the boolean attributes are displaying properly.
- 92ef408: Added new Extension install page at `/extensions/install`, it's meant to replace current App install page in upcoming releases.
- e2355cf: You can now see a loading animation when you click "Finalize" when finalizing a draft order. It prevents from submitting the form more than once.
- 641af14: Webhooks in app details section now are sorted based on which attempt is latest
- 1743872: Opening item in new tab using cmd key on datagrid now takes into account mounting point
- 14e7ee1: Adding new tile to the home about upcoming live update
- d01a207: Now you can re-order products within the collection.
- e7f1c4c: Some false-positive errors are no longer reported to Sentry.
- 8694fb7: Order transaction list now displays the name of a transaction
- 92f8383: You can now see updated radio buttons in warehouse edit view.
- b2acd12: Now you can see an updated label for gift card list in customer details - it now clearly states that the list shows gift cards that have been used by the customer, avoiding the confusion.
- 5a11423: Warehouse and tracking number in fulfilled order section are now displayed in two separate lines improving readability.
- dce09da: Added views for managing custom extensions (aka custom apps) to `/extensions` route:

  - `/extensions/custom/<id>` - details view
  - `/extensions/custom/<id>/webhook` - webhook create view
  - `/extensions/custom/<id>/webhook/<webhook_id>` - webhook edit view

- c0a78f7: Now you can see pageviews in the posthog.
- 7af826e: Added new "Add Custom Extension" view (`/extensions/custom/add`) for creating custom apps (type: `LOCAL`) that's meant to replace configuration page in Webhook & Events
- e9c7c58: Plugin details now display pill next to each channel to show whenever plugin is active or not in a given channel
- 4f00787: You can now see the unified look and behavior of pagination action buttons across all list views, including products, customers, orders, and other sections.
- 97ae393: You can now successfully save transaction refunds as drafts when using the latest version of Saleor Core.
- f2a4105: Now create webhook button works properly, leading you to the form"
- 21fc883: Now navigating to the installed extension, shows the list instantly, this means list is being cached while fetching happens in the background.
- 0e3109c: You can now edit note in order details. Notes in order details now show id of note, id of related note and type of note "added" or "updated"
- 38ead73: Now order-relaed buttons for refund, capture, mark as paid, adding products and fulfill are aligned with the others.
- d84d9e6: Remove testMo from workflows and add CTRF report
- 8032935: You can now open datagrid list item in new tab using cmd/ctrl button
- cc48fe4: You can now filter customers in customers list by metadata.
- 9029519: Now the warning when edditing permissions for the app is more readable in the dark mode"
- 35a8c3b: Now references to "content" translation referencing to model.
- ad7c179: Now product links on the collection points to the correct url.
- ac41590: Added "Not found" page when navigating to non-existing route in `/extensions/*`. Previously a blank page was displayed.
- dacfa49: Now the action that runs on release no longer fails due to fetching recent version.
- 6e46436: After creating a new collection, you should see a list of assigned channels
- 1b8d964: Modals in the Dashboard are now aligned, all have the same max height. Loading items on scroll works when the dialog is displayed in large screen.
- 6df03a0: Moved Extensions installed page URL from `/extensions` to `/extensions/installed`
- 0727bd0: Login page now doesn't reload after submitting the login form. This means that email and password input remain filled after unsuccessful login attempt.
- f9921ff: Now you can use download links within the applications.
- 6616ab4: Moved app related views from `/apps/` to `/extensions/app/...`
- db3bc09: Added new onboarding step when "Extensions" feature flag is enabled: "Discover extension capabilities" that shows users the new installed extensions page.
  It will be marked as uncompleted even if user previously completed "View webhooks" step.
- 3cd92e1: The library used in variant edit page to change variant order has been changed.
  This means that grabbed variant no longer sticks to the cursor after mouse button has been lifted.
- d643828: making the DevModePanel use the generic getApiUrl as well to allow the dynamic update in docker containers
- 957d7ea: Now orders becomes fulfilment as category name within the sidebar.
- 7d2d773: Now it is possible to send the nullish value when editing dropdown attributes
- 74e620d: You can now see updated buttons and icons in tables across Dashboard.
- 9b342f1: Now sidebar has new section "modeling" that reffers to "content" and "navigation".
- 4e970c2: Now community banner displays porperly in dark mode
- c63e150: You can now select specific products, collections aand categories during voucher creation
- 80ec78d: Test reports are send on slack in message
- ba82908: You can now see new installed extensions page with list of all installd apps and search above
- b19c6e1: View for managing plugins was added to `/extensions` route, it can be accessed by `/extensions/plugin/<id>` which is used in the list of installed extensions.
- 10fc24c: Dashboard now sends source header to API, when ENABLED_SERVICE_NAME_HEADER=true. Requires core >=3.20.68.
- fe252cb: Fix dockerfile build error caused by deleted file and bash script
- b1af6f2: Activates list items on the welcome page no longer implies that they are clickable
- 7cd7594: Fixed Jest tests being flakey (randomly faling) due to not clearing fake timers
- d1c02d1: Editor.js no more cause error during saving
- 70dbf11: You can now navigate back from collection details to collection list
