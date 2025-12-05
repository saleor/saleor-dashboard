# Changelog

## 3.22.18

### Patch Changes

- [#6170](https://github.com/saleor/saleor-dashboard/pull/6170) [`03fc5a0`](https://github.com/saleor/saleor-dashboard/commit/03fc5a018d2376191015798a188fe66f7a61ba75) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Configured build to minify built code. This change should increase overall performance and loading speed.

- [#6166](https://github.com/saleor/saleor-dashboard/pull/6166) [`10d1d92`](https://github.com/saleor/saleor-dashboard/commit/10d1d925058bd99f386f46ffde4bed373003b9a6) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Enabled React Strict mode for development

## 3.22.17

### Patch Changes

- [#6154](https://github.com/saleor/saleor-dashboard/pull/6154) [`52b7665`](https://github.com/saleor/saleor-dashboard/commit/52b76653848d0aa7a3ab6ca2c51ef99c8d92637f) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Fix bug where TRANSLATION_MORE_ACTIONS extension mount didn't send event if translation was empty

## 3.22.16

### Patch Changes

- [#6155](https://github.com/saleor/saleor-dashboard/pull/6155) [`2cac4ef`](https://github.com/saleor/saleor-dashboard/commit/2cac4ef453a847335aaf88d8419b88cf49e218ce) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Fixed broken permissions on product edit page, if user did not have MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES permission. It was caused by "Attribute" object being fetched with privateMetadata on every page, not only "attribute edit" page

## 3.22.15

### Patch Changes

- [#6149](https://github.com/saleor/saleor-dashboard/pull/6149) [`746184a`](https://github.com/saleor/saleor-dashboard/commit/746184a14578a4072343ad96200770094a337ec4) Thanks [@mirekm](https://github.com/mirekm)! - Fix typo in Delete Draft Order view

- [#6144](https://github.com/saleor/saleor-dashboard/pull/6144) [`4d0d1dc`](https://github.com/saleor/saleor-dashboard/commit/4d0d1dc01936298dfca1158787f79b2e253bdd9c) Thanks [@mirekm](https://github.com/mirekm)! - Fix "Payments summary" pill colors in dark mode

- [#6148](https://github.com/saleor/saleor-dashboard/pull/6148) [`0b242e4`](https://github.com/saleor/saleor-dashboard/commit/0b242e4caad7011cc1d146e8a7a19a6e73a12bde) Thanks [@mirekm](https://github.com/mirekm)! - Fix order related pills consistency and semantics

- [#6145](https://github.com/saleor/saleor-dashboard/pull/6145) [`e28787f`](https://github.com/saleor/saleor-dashboard/commit/e28787f536b24606f2ec3d1dbd8abc792d224ff1) Thanks [@mirekm](https://github.com/mirekm)! - Until we have better support for skeletons, replace the spinning throbber with a dash-based animation.

- [#6139](https://github.com/saleor/saleor-dashboard/pull/6139) [`0cccea0`](https://github.com/saleor/saleor-dashboard/commit/0cccea01da34f99a416cf1e63b4c2a2a803bca4b) Thanks [@kzuraw](https://github.com/kzuraw)! - Fix order fulfillment page - don't require quantity to be set if warehouse is not selected

- [#6014](https://github.com/saleor/saleor-dashboard/pull/6014) [`9ee100d`](https://github.com/saleor/saleor-dashboard/commit/9ee100d3710c475ec39fb6a40f9c831ce688e5ee) Thanks [@mariobrgomes](https://github.com/mariobrgomes)! - Fixed shipping weight field not appearing when editing simple products. The weight field now displays correctly on the product edit page and updates are properly saved to the backend. Users can now also clear the weight by setting it to an empty string, which sends null to the backend. Weight handling is now consistent across product creation, product updates, and variant updates.

- [#6136](https://github.com/saleor/saleor-dashboard/pull/6136) [`84cac1e`](https://github.com/saleor/saleor-dashboard/commit/84cac1e6b1eb541da9132efd45ba85ac30e367f8) Thanks [@kzuraw](https://github.com/kzuraw)! - Refactor PaymentsSummary component to simplify rendering logic and remove unused OrderDetailsViewModel methods

- [#6137](https://github.com/saleor/saleor-dashboard/pull/6137) [`cce1339`](https://github.com/saleor/saleor-dashboard/commit/cce1339a9af15fbcfb18acb801d28299451d38a3) Thanks [@kzuraw](https://github.com/kzuraw)! - Fixes order value for tax

- [#6142](https://github.com/saleor/saleor-dashboard/pull/6142) [`f52e048`](https://github.com/saleor/saleor-dashboard/commit/f52e048970fbe1048567aff09aba47bb19be777e) Thanks [@IKarbowiak](https://github.com/IKarbowiak)! - Adjust the `CustomerDetailsPage` component to trigger a single mutation when metadata changes. This update ensures that only one `customerMetadataUpdated` webhook is generated, preventing duplication.

- [#6146](https://github.com/saleor/saleor-dashboard/pull/6146) [`0cddff8`](https://github.com/saleor/saleor-dashboard/commit/0cddff8c8fe2f10d7ddca3ec88af439dc74d486c) Thanks [@mirekm](https://github.com/mirekm)! - Add `Go to/Create Product Type` entry to the Cmd+K menu

- [#6147](https://github.com/saleor/saleor-dashboard/pull/6147) [`62f5706`](https://github.com/saleor/saleor-dashboard/commit/62f5706dee0bc0dbb68c6017272c051b24b7ef56) Thanks [@mirekm](https://github.com/mirekm)! - Improve additional info that we provide for fulfillment groups

## 3.22.14

### Patch Changes

- [#6122](https://github.com/saleor/saleor-dashboard/pull/6122) [`62f2911`](https://github.com/saleor/saleor-dashboard/commit/62f29118a7e2cf315d609a42c8575cfa6385c011) Thanks [@krzysztofzuraw](https://github.com/krzysztofzuraw)! - Redesign order details payments and transactions section

  Introduced new `OrderSummary` component that consolidates order value and payments information into a unified, two-column layout. The new design provides:
  - **Order Value column**: Displays subtotal, shipping, taxes, discounts, and gift cards with clear itemization
  - **Payments Summary column**: Shows payment status, authorized/captured/refunded amounts, and transaction state
  - **Improved visual hierarchy**: Card-based layout with clear separation between order value and payment status
  - **Better payment flow handling**: Distinct UI for legacy payments API vs. transactions API
  - **Enhanced transaction display**: Consolidated view of all payment transactions with status pills

  This redesign improves clarity when reviewing order financial information and payment states.

- [#6128](https://github.com/saleor/saleor-dashboard/pull/6128) [`787c5fa`](https://github.com/saleor/saleor-dashboard/commit/787c5fab9a58d0b28705601eff53496d9f2aa701) Thanks [@krzysztofzuraw](https://github.com/krzysztofzuraw)! - Remove focus border from datagrid cells while preserving header click highlight

  Previously, clicking on datagrid cells displayed a visible focus border around the cell. The border has been removed by setting `drawFocusRing={false}` on the DataEditor component, while maintaining the header selection color functionality.

- [#6132](https://github.com/saleor/saleor-dashboard/pull/6132) [`75826b1`](https://github.com/saleor/saleor-dashboard/commit/75826b104369678982b28ef057c26053d950a516) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Fixed bug with App (with extensions) installation - now validation on the frontend checks new API fields properly

## 3.22.13

### Patch Changes

- [#6090](https://github.com/saleor/saleor-dashboard/pull/6090) [`4c24b50`](https://github.com/saleor/saleor-dashboard/commit/4c24b508a69276fb6d7dabb30009a61c7a556796) Thanks [@krzysztofzuraw](https://github.com/krzysztofzuraw)! - Fix visual regressions introduced in 3.22.12: missing sort arrow on datagrid when column is focused and changing order of buttons on order metadata / order line metadata dialogs to match other places in dashboard.

- [#6081](https://github.com/saleor/saleor-dashboard/pull/6081) [`7b2d6d2`](https://github.com/saleor/saleor-dashboard/commit/7b2d6d24688d77bde321b89d98a8b02dbd69874a) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Dashboard now uses new API to filter appExtensions query - `mountName` instead `mount`

- [#6097](https://github.com/saleor/saleor-dashboard/pull/6097) [`989aa1d`](https://github.com/saleor/saleor-dashboard/commit/989aa1d66dea035a1b7fc57447b2cb7a0a1a11ac) Thanks [@krzysztofzuraw](https://github.com/krzysztofzuraw)! - Fix row checkbox visibility in DataGrid by overriding rowMarkerTheme accentColor. Previously, checked row checkboxes had light gray background with white checkmark, making them invisible. Now they use dark text color for background, matching header checkbox appearance.

- [#6093](https://github.com/saleor/saleor-dashboard/pull/6093) [`77ce8c2`](https://github.com/saleor/saleor-dashboard/commit/77ce8c23bc863d0da6eedf5219b61a9f34699308) Thanks [@krzysztofzuraw](https://github.com/krzysztofzuraw)! - Add fulfillment metadata editing with button and modal dialog. Replace cancel fulfillment trash icon with dropdown menu. Improve tracking number copy button to show only on hover.

- [#6100](https://github.com/saleor/saleor-dashboard/pull/6100) [`90e5db9`](https://github.com/saleor/saleor-dashboard/commit/90e5db90272170e8b1584c378d02a21df999589d) Thanks [@krzysztofzuraw](https://github.com/krzysztofzuraw)! - Improve order details datagrid visual polish

  Enhanced the visual appearance of order details datagrids with the following improvements:
  - Refined column selection styling to use a more subtle hover color, creating a cleaner visual experience when selecting columns
  - Improved fulfillment card spacing by making the last card's bottom border white, providing better visual separation from surrounding content
  - Fixed visual clutter by hiding the drag handle icon on the empty spacing column
  - Added left padding and adjusted spacing for better content alignment
  - Enhanced draft order cards with subtle shadows for improved depth perception
  - Refined font sizing for better readability

  These changes improve the overall visual consistency and polish of the order management interface.

- [#6098](https://github.com/saleor/saleor-dashboard/pull/6098) [`b7b0ed1`](https://github.com/saleor/saleor-dashboard/commit/b7b0ed1c69cce94eeaffae6184b99d82f9116184) Thanks [@krzysztofzuraw](https://github.com/krzysztofzuraw)! - Improve draft order line item management with quick actions

  Order draft line items now feature a row action bar for faster access to common operations. Metadata can be viewed via the metadata icon button, while additional actions (product details, remove item) are available through the menu dropdown.

- [#6082](https://github.com/saleor/saleor-dashboard/pull/6082) [`290c67e`](https://github.com/saleor/saleor-dashboard/commit/290c67ed7f4e1e9d447ee3c872c9be5c044a908d) Thanks [@krzysztofzuraw](https://github.com/krzysztofzuraw)! - Improved order fulfillment cards with better keyboard accessibility - tracking number copy buttons now work with keyboard navigation. Enhanced screen reader support with proper labels for order status indicators.

- [#6121](https://github.com/saleor/saleor-dashboard/pull/6121) [`2632bf0`](https://github.com/saleor/saleor-dashboard/commit/2632bf0741d87d3790481283d117fae9a6b8a26d) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Fixed error when bulk operations on large number of items (over 20) caused runtime error - for example selecting 100 items to be unassigned from collecton, caused page to crash. Now limit is set to 100

## 3.22.12

### Patch Changes

- [#6042](https://github.com/saleor/saleor-dashboard/pull/6042) [`e78b4a1`](https://github.com/saleor/saleor-dashboard/commit/e78b4a14b1ceb4282431300a6f06b30184f8e0f5) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Metadata filters will now omit `value` if none is provided for filters that are using `WHERE` API (Products, Orders, etc.). This way users can filter for metadata key existence instead of key:value pairs.

- [#6074](https://github.com/saleor/saleor-dashboard/pull/6074) [`2aa042d`](https://github.com/saleor/saleor-dashboard/commit/2aa042ddab5f26e8b11e0b73dc473ee0f2927638) Thanks [@krzysztofzuraw](https://github.com/krzysztofzuraw)! - Improve datagrid UI styling:
  - Add drag indicator icon to selected column headers
  - Change header icons (sorting arrows and grip) to black for better visibility
  - Add white background to row action sections
  - Add left border to row actions and column picker
  - Remove shadow from row action bar
  - Make backgrounds transparent where needed for cleaner appearance

- [#6065](https://github.com/saleor/saleor-dashboard/pull/6065) [`c1cb87f`](https://github.com/saleor/saleor-dashboard/commit/c1cb87fce895707756859afe668ca4e7804ec0ca) Thanks [@krzysztofzuraw](https://github.com/krzysztofzuraw)! - Increase extension name display width in InstalledExtensionsList from 200px to 400px to improve readability for extensions with longer names

- [#6083](https://github.com/saleor/saleor-dashboard/pull/6083) [`fa7aab9`](https://github.com/saleor/saleor-dashboard/commit/fa7aab97244388967cbe77c7bea13d32002321cc) Thanks [@krzysztofzuraw](https://github.com/krzysztofzuraw)! - Updated dependencies to fix security vulnerabilities in js-yaml (GHSA-mh29-5h37-fv8m, moderate severity) and glob (GHSA-5j98-mcp5-4vw2, high severity). Added pnpm overrides for defense-in-depth protection against these vulnerabilities.

- [#6042](https://github.com/saleor/saleor-dashboard/pull/6042) [`e78b4a1`](https://github.com/saleor/saleor-dashboard/commit/e78b4a14b1ceb4282431300a6f06b30184f8e0f5) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Metadata filter fields will now validate if `key` is provided. Previously users were able to enter data without `key` which resulted in an error. `value` is optional.

- [#6009](https://github.com/saleor/saleor-dashboard/pull/6009) [`f519aa3`](https://github.com/saleor/saleor-dashboard/commit/f519aa3f61f8a1d03c19fc3cd19a7f43e587d4cf) Thanks [@krzysztofzuraw](https://github.com/krzysztofzuraw)! - Add metadata button to order line datagrid for quick access to line item metadata

- [#6066](https://github.com/saleor/saleor-dashboard/pull/6066) [`0c83a47`](https://github.com/saleor/saleor-dashboard/commit/0c83a477cc08cebdd9c2d473adade22165d16e6d) Thanks [@krzysztofzuraw](https://github.com/krzysztofzuraw)! - Add order metadata dialog with Code icon button in order details page. Users can now view and edit order metadata (public and private) directly from the order page by clicking the new Code icon button in the top navigation bar next to the settings menu.

- [#6030](https://github.com/saleor/saleor-dashboard/pull/6030) [`ccc854d`](https://github.com/saleor/saleor-dashboard/commit/ccc854d9bdb81d17497c0c65e85317731c9047dd) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Add support for Translation extensions (popup only) to establish bi-directional communication to update form state.

- [#6079](https://github.com/saleor/saleor-dashboard/pull/6079) [`7834e01`](https://github.com/saleor/saleor-dashboard/commit/7834e01c6d3c5011dbcde7f78c33e020e1b1b417) Thanks [@krzysztofzuraw](https://github.com/krzysztofzuraw)! - Update unfulfilled order card title and move fulfill button to toolbar for better UX

## 3.22.11

### Patch Changes

- [#6048](https://github.com/saleor/saleor-dashboard/pull/6048) [`6f099dd`](https://github.com/saleor/saleor-dashboard/commit/6f099ddc52c600a98fa6fbef55ff7691b3fbf1f1) Thanks [@krzysztofzuraw](https://github.com/krzysztofzuraw)! - Fixed broken sidebar app alert url to installed extension page

- [#6033](https://github.com/saleor/saleor-dashboard/pull/6033) [`b1a048a`](https://github.com/saleor/saleor-dashboard/commit/b1a048ab34fbae0b907dc8e86f82fac30c88017a) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Dropped support for node 18. Migrated npm to pnpm

## 3.22.10

### Patch Changes

- [#5992](https://github.com/saleor/saleor-dashboard/pull/5992) [`7465a3a`](https://github.com/saleor/saleor-dashboard/commit/7465a3a707f5100c4133b498913ab8f81fc7369d) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Added a new extension mount point: TRANSLATIONS_MORE_ACTIONS that will render app extension on translation pages

- [#6032](https://github.com/saleor/saleor-dashboard/pull/6032) [`ccdfdec`](https://github.com/saleor/saleor-dashboard/commit/ccdfdec1973adde8e1e4f7c633efdcbc618cefb4) Thanks [@krzysztofzuraw](https://github.com/krzysztofzuraw)! - Fix warehouse assignment modal: prevent duplicates and enable proper deselection. Previously, when selecting warehouses in the assignment modal, deselecting an option would still add it to the list, resulting in duplicate entries on submit.

- [#5990](https://github.com/saleor/saleor-dashboard/pull/5990) [`db8fc50`](https://github.com/saleor/saleor-dashboard/commit/db8fc508864b13702988dd4e3a209e6dedf57c67) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Added new API for communication between App and Dashboard. Now Dashboard will send form state (only Product Update page) to opened app (only POPUP). App will be able to send form fields back to the Dashboard, which will update the form. See docs [todo]

## 3.22.9

### Patch Changes

- [#6016](https://github.com/saleor/saleor-dashboard/pull/6016) [`595e1ee`](https://github.com/saleor/saleor-dashboard/commit/595e1ee42de0ebe71da0bc7a7ab4b47057044269) Thanks [@xseignard](https://github.com/xseignard)! - Add email field on warehouse details page

- [#6015](https://github.com/saleor/saleor-dashboard/pull/6015) [`04b419a`](https://github.com/saleor/saleor-dashboard/commit/04b419af2c19bb50b5a8a25a170519a70d8aa007) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Switched to the new AppExtension fields introduced in 3.22 patch (mount -> mountName, target -> targetName, options -> settings). This does not introduce a functional change, but is a part of the larger extension logic overhaul.

## 3.22.8

### Patch Changes

- [#6019](https://github.com/saleor/saleor-dashboard/pull/6019) [`78c8d64`](https://github.com/saleor/saleor-dashboard/commit/78c8d64f592dcbd9c36788f38febb12c7bbb2550) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Fix error with invalid extension manifest validation, cause by invalid permissions schema

## 3.22.7

### Patch Changes

- [#6011](https://github.com/saleor/saleor-dashboard/pull/6011) [`8aca1b7`](https://github.com/saleor/saleor-dashboard/commit/8aca1b775a8365f01c28d92e9a31b27b07940549) Thanks [@lkostrowski](https://github.com/lkostrowski)! - During app installation, Dashboard prevents installation in case errors occur. This mimics the behavior of API-side validation.

- [#6010](https://github.com/saleor/saleor-dashboard/pull/6010) [`73f1ab6`](https://github.com/saleor/saleor-dashboard/commit/73f1ab66e2229c99b366d71b6db104c766be6427) Thanks [@lkostrowski](https://github.com/lkostrowski)! - AppExtension validation on installation page now properly validates relative extension URL.

- [#6007](https://github.com/saleor/saleor-dashboard/pull/6007) [`abb3edc`](https://github.com/saleor/saleor-dashboard/commit/abb3edc8bc6c9b00f2ba54ab7f83f55f8033e351) Thanks [@krzysztofzuraw](https://github.com/krzysztofzuraw)! - Add missing logic for handling product variant metadata when accessed from order line modal (on order details page).

## 3.22.6

### Patch Changes

- [#6002](https://github.com/saleor/saleor-dashboard/pull/6002) [`770e1b1`](https://github.com/saleor/saleor-dashboard/commit/770e1b1a5c621b00e7c8696009dfb6a8d13e6028) Thanks [@lkostrowski](https://github.com/lkostrowski)! - App <iframe>s now enable pop-ups (`"allow-popups"`) which means App can use native links to open new tab, instead using AppBridge action. In the nutshell `<a target="_blank"` is now working. It's still recommended to use `rel="noreferrer"` due to security reasons.

- [#6003](https://github.com/saleor/saleor-dashboard/pull/6003) [`727c049`](https://github.com/saleor/saleor-dashboard/commit/727c049ad39a91a8e1377426f1811ae21bbddefc) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Fixed cmd/ctrl + click on Datagrid rows. Now they will properly open row in the new tab as expected

## 3.22.5

### Patch Changes

- [#5997](https://github.com/saleor/saleor-dashboard/pull/5997) [`0e45316`](https://github.com/saleor/saleor-dashboard/commit/0e453168b70f9c8bbebea8904df53ce9b7484abe) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Added local-frontend validation of a subset of App Manifest fields during installation. Installing apps will be now more liberal, some errors initially thrown on the API level will be now warnings that don't block app installation.

- [#5987](https://github.com/saleor/saleor-dashboard/pull/5987) [`457fb84`](https://github.com/saleor/saleor-dashboard/commit/457fb8450daff51e23aff7cc5276f5565e93de18) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Fixed redirection from Apps Widgets (app name) to app page.

- [#5999](https://github.com/saleor/saleor-dashboard/pull/5999) [`a1eec49`](https://github.com/saleor/saleor-dashboard/commit/a1eec4902e1e9849efa76b2a780126761c943e54) Thanks [@krzysztofzuraw](https://github.com/krzysztofzuraw)! - Update Saleor logo on login page

- [#5901](https://github.com/saleor/saleor-dashboard/pull/5901) [`af290ca`](https://github.com/saleor/saleor-dashboard/commit/af290ca104bb65c90207d482e83c500aa72f7d8a) Thanks [@krzysztofzuraw](https://github.com/krzysztofzuraw)! - Improved handling of long reference attribute lists in the Product Create, the Product Edit, and the Page Details views:
  - Reference attributes (such as product references or page references) with more than 5 items now display a "Show more" button when collapsed and a "Show less" button when expanded
  - Users can toggle between collapsed view (showing first 5 items) and expanded view (showing all items)
  - Makes working with products and pages that have many reference attributes more manageable

## 3.22.4

### Patch Changes

- [#5980](https://github.com/saleor/saleor-dashboard/pull/5980) [`6b4219e`](https://github.com/saleor/saleor-dashboard/commit/6b4219e2706fdadbd674f45000e1929915e37762) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Added another bunch of refactors around apps and extensions. Less code, no functional changes

- [#5980](https://github.com/saleor/saleor-dashboard/pull/5980) [`6b4219e`](https://github.com/saleor/saleor-dashboard/commit/6b4219e2706fdadbd674f45000e1929915e37762) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Remove batch of unused graphql operations. This is a cleanup only

- [#5980](https://github.com/saleor/saleor-dashboard/pull/5980) [`6b4219e`](https://github.com/saleor/saleor-dashboard/commit/6b4219e2706fdadbd674f45000e1929915e37762) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Remove Content Attributes from `All Products` column picker on product list page. These attributes were never showing values if chosen.

- [#5980](https://github.com/saleor/saleor-dashboard/pull/5980) [`6b4219e`](https://github.com/saleor/saleor-dashboard/commit/6b4219e2706fdadbd674f45000e1929915e37762) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Remove apps/ directory, which ends the refactor that moves apps/ to extensions/. This is not a functional change.

## 3.22.3

### Patch Changes

- [#5969](https://github.com/saleor/saleor-dashboard/pull/5969) [`7adf04b`](https://github.com/saleor/saleor-dashboard/commit/7adf04bcaa5ad193785f19d1637ce7a484231714) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Some dead code from src/apps was removed. This should not introduce any visible change and is only cleanup/refactor

- [#5970](https://github.com/saleor/saleor-dashboard/pull/5970) [`65025c2`](https://github.com/saleor/saleor-dashboard/commit/65025c2add2cab24a2b03b38298eb07d72f6bf99) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Removed another bunch of legacy apps/ code. This is only a refactor with no functional change

- [#5971](https://github.com/saleor/saleor-dashboard/pull/5971) [`6dedfec`](https://github.com/saleor/saleor-dashboard/commit/6dedfec6f55bfc1ba53bc7d8cb07066ed594f02c) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Refactored another batch of apps/ directory - mainly moved components to extensions/. This is non-functional change

- [#5965](https://github.com/saleor/saleor-dashboard/pull/5965) [`f85daef`](https://github.com/saleor/saleor-dashboard/commit/f85daefa4c3218d49ae30dcdb8dde74c7aab71ec) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Fixed copy for Ripples ripple

## 3.22.2

### Patch Changes

- [#5962](https://github.com/saleor/saleor-dashboard/pull/5962) [`62c8d59`](https://github.com/saleor/saleor-dashboard/commit/62c8d595952ae69c5edb2322df4676f87640c6c9) Thanks [@krzysztofzuraw](https://github.com/krzysztofzuraw)! - Retrigger workflow & remove changeset tag

## 3.22.1

### Patch Changes

- [#5951](https://github.com/saleor/saleor-dashboard/pull/5951) [`7e2ac0a`](https://github.com/saleor/saleor-dashboard/commit/7e2ac0a54cab9dd0f29ac8cc94e2501cbc75c2ba) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Fixed layout of Granted refund page. Transactions details box will no longer have overlayed text on top of each other and will instead add proper scrollbar on small viewport sizes. This page will now also switch to smaller sidebar sooner than other pages in order to show more details on smaller viewport sizes.

- [#5956](https://github.com/saleor/saleor-dashboard/pull/5956) [`99a4948`](https://github.com/saleor/saleor-dashboard/commit/99a4948c8d4d504ca44ed7890eb613b866d790d4) Thanks [@krzysztofzuraw](https://github.com/krzysztofzuraw)! - Migrated sidebar icons to Lucide React for better consistency. Replaced custom SVG icons (Cloud, Graphql, Gift) with Lucide equivalents and refactored TerminalIcon to match Lucide conventions.

## 3.22.0

### Minor Changes

- [#5862](https://github.com/saleor/saleor-dashboard/pull/5862) [`241b9eb`](https://github.com/saleor/saleor-dashboard/commit/241b9eb75dcd0c9712ab5ac49db06d16ef30193b) Thanks [@IKarbowiak](https://github.com/IKarbowiak)! - Narrow down reference attribute choices.

  Now you can narrow down reference attribute options by providing:
  - Product types for product and product variant references
  - Model types for model references

  If reference types are defined, then when specifying a value for a reference (product, product variant, or page view), only objects that match the allowed reference types will be available as selectable options.

- [#5172](https://github.com/saleor/saleor-dashboard/pull/5172) [`c665bb8`](https://github.com/saleor/saleor-dashboard/commit/c665bb827b22b31aa8e312075ea50dc3658f6d87) Thanks [@karola312](https://github.com/karola312)! - Comment from tests results will now be displayed for cloud-deployments CORE release PRs

- [#5653](https://github.com/saleor/saleor-dashboard/pull/5653) [`cf2c07a`](https://github.com/saleor/saleor-dashboard/commit/cf2c07ad7c28db296d22f86f1719d7c970f50f1b) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Added now mounting points for app extensions. See [docs](https://docs.saleor.io/developer/extending/apps/extending-dashboard-with-apps).

  Mount point for product-details page now attached "productSlug" to the context

- [#5195](https://github.com/saleor/saleor-dashboard/pull/5195) [`c8661c5`](https://github.com/saleor/saleor-dashboard/commit/c8661c5d4f52ab25fdfd946d457044e9924d281c) Thanks [@karola312](https://github.com/karola312)! - Always add comment after tests to CORE release PR, even if previous job fails.

- [#5698](https://github.com/saleor/saleor-dashboard/pull/5698) [`ffc6c3c`](https://github.com/saleor/saleor-dashboard/commit/ffc6c3c2ad6864887115d53353f13279427bff6c) Thanks [@IKarbowiak](https://github.com/IKarbowiak)! - Allow defining category and collection as a reference attribute

- [#5096](https://github.com/saleor/saleor-dashboard/pull/5096) [`8e91df3`](https://github.com/saleor/saleor-dashboard/commit/8e91df337bcb1b8c26e3aebacefb29c699831267) Thanks [@karola312](https://github.com/karola312)! - Do not open cloud deployment release PR after automation tests for CORE

- [#5170](https://github.com/saleor/saleor-dashboard/pull/5170) [`5da872a`](https://github.com/saleor/saleor-dashboard/commit/5da872afc1b9b972fd2551bd67fe665d8dab52d0) Thanks [@karola312](https://github.com/karola312)! - Tests results slack message now show detailed version of saleor

- [#5040](https://github.com/saleor/saleor-dashboard/pull/5040) [`08b447c`](https://github.com/saleor/saleor-dashboard/commit/08b447c4950ffdb135cd56c3b6a6987246a4ded3) Thanks [@karola312](https://github.com/karola312)! - Add checkout to workflow creating release PR in cloud deployments

- [#5854](https://github.com/saleor/saleor-dashboard/pull/5854) [`d90e986`](https://github.com/saleor/saleor-dashboard/commit/d90e986e277b16865978210ee9f1d84b64a71a9a) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Added support for `SINGLE_REFERENCE` attribute types.

  When creating new attributes "Single reference" option can be now selected along with entity types (i.e. Product, Product variant, Model, etc.).

  Assigning values to `SINGLE_REFERENCE` works similar to `REFERENCE` attributes, except the UI allows to select only a single item.

- [#5061](https://github.com/saleor/saleor-dashboard/pull/5061) [`4a50cf9`](https://github.com/saleor/saleor-dashboard/commit/4a50cf9c6b169584c4ee6843250981372a4edd06) Thanks [@karola312](https://github.com/karola312)! - Create CORE release PR even if automation tests fail

- [#5048](https://github.com/saleor/saleor-dashboard/pull/5048) [`39671b7`](https://github.com/saleor/saleor-dashboard/commit/39671b7b928882222ec8fa7f48cf81d2d97adf3a) Thanks [@karola312](https://github.com/karola312)! - Release PRs in cloud deployments for CORE releases will be created even if tests fail

- [#5792](https://github.com/saleor/saleor-dashboard/pull/5792) [`fbbb49d`](https://github.com/saleor/saleor-dashboard/commit/fbbb49d003e47666f6ba74fe69679e58136c7b5c) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Added Refund Reasons. Now, this feature can be configured in settings, after that refund (manual and grant) will require a static list of refund reasons that are also configurable. [See announcement post](todo)

### Patch Changes

- [#5523](https://github.com/saleor/saleor-dashboard/pull/5523) [`9ac320a`](https://github.com/saleor/saleor-dashboard/commit/9ac320a14a98fbff753b71c6d1e0d7495e5c472a) Thanks [@Cloud11PL](https://github.com/Cloud11PL)! - You can now apply specific variants to Vouchers, alongside products, collections and categories. This means variants are now assignable in Voucher edit and create forms.

- [#5601](https://github.com/saleor/saleor-dashboard/pull/5601) [`0664dbc`](https://github.com/saleor/saleor-dashboard/commit/0664dbce8097156796b20295e1a63d9a332c33e1) Thanks [@andrzejewsky](https://github.com/andrzejewsky)! - Now return&replace flow has a transaction selector. This means whenever using grant refund, you need to select desired transaction.

- [#5739](https://github.com/saleor/saleor-dashboard/pull/5739) [`6637b0b`](https://github.com/saleor/saleor-dashboard/commit/6637b0bc018488c9677ddfe7259ebb89962b437e) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Fixed a bug when user tried to use redirect from legacy routes (e.g. /pages -> /models) subpaths were not preserved. Now when user navigates to a deeply nested path, e.g. `/pages/<id>` they'll be redirected to `/models/<id>`.

- [#5823](https://github.com/saleor/saleor-dashboard/pull/5823) [`c203014`](https://github.com/saleor/saleor-dashboard/commit/c203014da49aec0deb8bcfccf6eb0eb8701b3171) Thanks [@krzysztofzuraw](https://github.com/krzysztofzuraw)! - Improve order refund UI for orders that uses Payments API. After this change `Automatic Refund` will be avaiable when `Refund products` option is selected. Miscellaneous refund will require providing `Manual Amount` as this is what Saleor API requires.

- [#5606](https://github.com/saleor/saleor-dashboard/pull/5606) [`f78e6d9`](https://github.com/saleor/saleor-dashboard/commit/f78e6d92fab5b175fa87546a234948c935be338a) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Updated custom app views to use refreshed look (new UI components)

- [#5572](https://github.com/saleor/saleor-dashboard/pull/5572) [`fc75f66`](https://github.com/saleor/saleor-dashboard/commit/fc75f66ddbbe4c733cfa13d68d1d2ad3078b681c) Thanks [@andrzejewsky](https://github.com/andrzejewsky)! - Setting unsed and false values for the boolean attributes are displaying properly.

- [#5881](https://github.com/saleor/saleor-dashboard/pull/5881) [`cee2ff1`](https://github.com/saleor/saleor-dashboard/commit/cee2ff1abd18c7e1ff7048fcf4c409d7766ac514) Thanks [@krzysztofzuraw](https://github.com/krzysztofzuraw)! - Removed demo mode code.

- [#5833](https://github.com/saleor/saleor-dashboard/pull/5833) [`d7351ac`](https://github.com/saleor/saleor-dashboard/commit/d7351ac5f9d2fb108ca0971c9d3f0af247cfdd34) Thanks [@krzysztofzuraw](https://github.com/krzysztofzuraw)! - Voucher detail page: fixed how we calculate minimal requirements state. After this change we won't take selected channel into consideration for checking if requirement is `minimal order value` - instead we will use channel listing `minSpent` amount. Thanks to that UI should now properly display requirement.

- [#5522](https://github.com/saleor/saleor-dashboard/pull/5522) [`92ef408`](https://github.com/saleor/saleor-dashboard/commit/92ef408b68db9f23d26a1e23f129c3c5f74d6a31) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Added new Extension install page at `/extensions/install`, it's meant to replace current App install page in upcoming releases.

- [#5558](https://github.com/saleor/saleor-dashboard/pull/5558) [`e2355cf`](https://github.com/saleor/saleor-dashboard/commit/e2355cfabd78680f9bbd3fb47fe4b1e9938ab577) Thanks [@Cloud11PL](https://github.com/Cloud11PL)! - You can now see a loading animation when you click "Finalize" when finalizing a draft order. It prevents from submitting the form more than once.

- [#5737](https://github.com/saleor/saleor-dashboard/pull/5737) [`a92fdd4`](https://github.com/saleor/saleor-dashboard/commit/a92fdd459f114795a5589841d2eb2129f6f23c6c) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Improved UI for translations. Now pickers are refreshed and languages are cached locally, so recent languages are on top of the picker. Additionally translatable entities like products or categories have contextual link/button that redirects to translations

- [#5937](https://github.com/saleor/saleor-dashboard/pull/5937) [`bd3d8e3`](https://github.com/saleor/saleor-dashboard/commit/bd3d8e3c51659ae50f7546dfe771560778de78c7) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Removed "Plugins and Webhook Events have been moved to the "Extensions" page" message on configuration page

- [#5491](https://github.com/saleor/saleor-dashboard/pull/5491) [`641af14`](https://github.com/saleor/saleor-dashboard/commit/641af143aa25e28165feed13624ccc460aef12ab) Thanks [@Cloud11PL](https://github.com/Cloud11PL)! - Webhooks in app details section now are sorted based on which attempt is latest

- [#5381](https://github.com/saleor/saleor-dashboard/pull/5381) [`1743872`](https://github.com/saleor/saleor-dashboard/commit/174387200d0b9fef072d7239c7e65790edeb6173) Thanks [@poulch](https://github.com/poulch)! - Opening item in new tab using cmd key on datagrid now takes into account mounting point

- [#5847](https://github.com/saleor/saleor-dashboard/pull/5847) [`0b28def`](https://github.com/saleor/saleor-dashboard/commit/0b28defd926e41da4cb7d8949267780412d4d55e) Thanks [@krzysztofzuraw](https://github.com/krzysztofzuraw)! - Fixed null safety issues in OrderPayment component when handling gift card amounts and improved variable naming consistency. This prevents potential runtime errors when order data is not fully loaded.

- [#5534](https://github.com/saleor/saleor-dashboard/pull/5534) [`14e7ee1`](https://github.com/saleor/saleor-dashboard/commit/14e7ee13d02df9ae4b153d507016979b2e6dcd78) Thanks [@andrzejewsky](https://github.com/andrzejewsky)! - Adding new tile to the home about upcoming live update

- [#5648](https://github.com/saleor/saleor-dashboard/pull/5648) [`8f7a493`](https://github.com/saleor/saleor-dashboard/commit/8f7a4935d84e578c4a960575f25f4ba9ef0fd2f1) Thanks [@krzysztofzuraw](https://github.com/krzysztofzuraw)! - New app mounting points are available:
  - Category list under `Create category` button
  - Category list under additional actions (cog icon)
  - Category details under additional actions (cog icon)
  - Collection list under `Create collection` button
  - Collection list under additional actions (cog icon)
  - Collection details under additional actions (cog icon)
  - Gift card list under `Issue card` button
  - Gift card list under additional actions (cog icon)
  - Gift card details under additional actions (cog icon)
  - Draft order list under `Create order` button
  - Draft order list under additional actions (cog icon)
  - Draft order details under additional actions (cog icon)
  - Promotions list under `Create discount` button
  - Promotions list under additional actions (cog icon)
  - Promotions details under additional actions (cog icon)
  - Voucher list under `Create voucher` button
  - Voucher list under additional actions (cog icon)
  - Voucher details under additional actions (cog icon)
  - Model list under `Create model` button
  - Model list under additional actions (cog icon)
  - Model details under additional actions (cog icon)
  - Model type list under `Create model type` button
  - Model type list under additional actions (cog icon)
  - Model type details under additional actions (cog icon)
  - Structure list under `Create structure` button
  - Structure list under additional actions (cog icon)
  - Structure details under additional actions (cog icon)

- [#5942](https://github.com/saleor/saleor-dashboard/pull/5942) [`9acc950`](https://github.com/saleor/saleor-dashboard/commit/9acc9508000b6f67c14558e6a63fb4c89a6a4ad7) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Ripples copy are improved (grammar)

- [#5327](https://github.com/saleor/saleor-dashboard/pull/5327) [`d01a207`](https://github.com/saleor/saleor-dashboard/commit/d01a2077fcbb1c3969b1558c1dc7a32d430e9b89) Thanks [@andrzejewsky](https://github.com/andrzejewsky)! - Now you can re-order products within the collection.

- [#5908](https://github.com/saleor/saleor-dashboard/pull/5908) [`d0f5095`](https://github.com/saleor/saleor-dashboard/commit/d0f509524fcb5f6dfa06164522a5aeb97773a68d) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Removed "extensions" flag that was showing new unified UI for all extension types (apps, plugins, webhooks). The flag was always enable for a while, but after this change, it will not be possible to revert to the old view

- [#5518](https://github.com/saleor/saleor-dashboard/pull/5518) [`e7f1c4c`](https://github.com/saleor/saleor-dashboard/commit/e7f1c4caef08c43d55421e7c8c71922af4bc90de) Thanks [@Cloud11PL](https://github.com/Cloud11PL)! - Some false-positive errors are no longer reported to Sentry.

- [#5366](https://github.com/saleor/saleor-dashboard/pull/5366) [`8694fb7`](https://github.com/saleor/saleor-dashboard/commit/8694fb70418f2f7a4f481555809ee70ef8886506) Thanks [@poulch](https://github.com/poulch)! - Order transaction list now displays the name of a transaction

- [#5590](https://github.com/saleor/saleor-dashboard/pull/5590) [`a2e4a6b`](https://github.com/saleor/saleor-dashboard/commit/a2e4a6bebbea635fdc6a03d65eb78da740bee3e2) Thanks [@Cloud11PL](https://github.com/Cloud11PL)! - You can now see radio group with updated UI in channel allocation

- [#5654](https://github.com/saleor/saleor-dashboard/pull/5654) [`56bb3c8`](https://github.com/saleor/saleor-dashboard/commit/56bb3c8b247bd7bf8b9fa01563ff5faf5667c58e) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Fixed navigation in Saleor Apps causing polluted browser's window history, now navigating to another page adds a single entry in history stack.

- [#5807](https://github.com/saleor/saleor-dashboard/pull/5807) [`b7e10f7`](https://github.com/saleor/saleor-dashboard/commit/b7e10f77e85fe941a8b59f17b5bb2e0aff079799) Thanks [@krzysztofzuraw](https://github.com/krzysztofzuraw)! - Fix links to old Saleor docs

- [#5573](https://github.com/saleor/saleor-dashboard/pull/5573) [`92f8383`](https://github.com/saleor/saleor-dashboard/commit/92f83830f5de1dd610d6310bce77385fa9b289f6) Thanks [@Cloud11PL](https://github.com/Cloud11PL)! - You can now see updated radio buttons in warehouse edit view.

- [#5600](https://github.com/saleor/saleor-dashboard/pull/5600) [`2d841f0`](https://github.com/saleor/saleor-dashboard/commit/2d841f04514ba8352742312861f7afcc802a3901) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Improved error messages when installing extension from URL.
  Error messages will now point to Saleor Docs and display error code from GraphQL response

- [#5526](https://github.com/saleor/saleor-dashboard/pull/5526) [`b2acd12`](https://github.com/saleor/saleor-dashboard/commit/b2acd121325cd9c9a1c3d937260c3f64dc93de9a) Thanks [@Cloud11PL](https://github.com/Cloud11PL)! - Now you can see an updated label for gift card list in customer details - it now clearly states that the list shows gift cards that have been used by the customer, avoiding the confusion.

- [#5516](https://github.com/saleor/saleor-dashboard/pull/5516) [`5a11423`](https://github.com/saleor/saleor-dashboard/commit/5a114237d8f6e3af109de49b0f452836baed8c2a) Thanks [@Cloud11PL](https://github.com/Cloud11PL)! - Warehouse and tracking number in fulfilled order section are now displayed in two separate lines improving readability.

- [#5822](https://github.com/saleor/saleor-dashboard/pull/5822) [`9520c2f`](https://github.com/saleor/saleor-dashboard/commit/9520c2fd7748c55068d98aa41871aaf0557e3b28) Thanks [@krzysztofzuraw](https://github.com/krzysztofzuraw)! - Hide voucher usage limit and usage count on voucher details page when voucher doesn't have limit set.

- [#5562](https://github.com/saleor/saleor-dashboard/pull/5562) [`dce09da`](https://github.com/saleor/saleor-dashboard/commit/dce09dae4b2876bbd483373f22e4e266e87a620e) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Added views for managing custom extensions (aka custom apps) to `/extensions` route:
  - `/extensions/custom/<id>` - details view
  - `/extensions/custom/<id>/webhook` - webhook create view
  - `/extensions/custom/<id>/webhook/<webhook_id>` - webhook edit view

- [#5370](https://github.com/saleor/saleor-dashboard/pull/5370) [`c0a78f7`](https://github.com/saleor/saleor-dashboard/commit/c0a78f790f92a0f6425ec065dd0b30734a6b6953) Thanks [@andrzejewsky](https://github.com/andrzejewsky)! - Now you can see pageviews in the posthog.

- [#5888](https://github.com/saleor/saleor-dashboard/pull/5888) [`414a2ec`](https://github.com/saleor/saleor-dashboard/commit/414a2ec5e7beec40846b3a635e70a23c54adb5b7) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Added "ripples" indicating new features added to the dashboard, directly for staff users

- [#5643](https://github.com/saleor/saleor-dashboard/pull/5643) [`9aa0a69`](https://github.com/saleor/saleor-dashboard/commit/9aa0a696ee48b348e1832e7fbe30fb3a4d5ae42b) Thanks [@witoszekdev](https://github.com/witoszekdev)! - When creating new channels, Transaction flow will be selected as default for "mark as paid" strategy.

- [#5719](https://github.com/saleor/saleor-dashboard/pull/5719) [`e87f5e0`](https://github.com/saleor/saleor-dashboard/commit/e87f5e0857ee97a8771c3c727256194ae9d7329f) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Updated draggable attribute value list design:
  - it now uses `@dnd-kit` library instead of `react-sortable-hoc`
  - it uses horizontal layout instead of vertical to minimize space usage
  - reference attribute values on the list now are clickable and point to a page with referenced object details.

- [#5553](https://github.com/saleor/saleor-dashboard/pull/5553) [`7af826e`](https://github.com/saleor/saleor-dashboard/commit/7af826e3cb58390b8bb1ab62d1579c141b3c1520) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Added new "Add Custom Extension" view (`/extensions/custom/add`) for creating custom apps (type: `LOCAL`) that's meant to replace configuration page in Webhook & Events

- [#5907](https://github.com/saleor/saleor-dashboard/pull/5907) [`f940531`](https://github.com/saleor/saleor-dashboard/commit/f94053188aa834f9b7fa1daaeb3bf6c022fe9393) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Removed "discount rules" feature flag, that was enabled for quite a long time. Now reverting this feature is not possible

- [#5914](https://github.com/saleor/saleor-dashboard/pull/5914) [`ac446a7`](https://github.com/saleor/saleor-dashboard/commit/ac446a77796c757f52e0dde48b38f5a0fb3f33c8) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Added link to Model type (previously Page type) on the Model details page.

- [#5542](https://github.com/saleor/saleor-dashboard/pull/5542) [`e9c7c58`](https://github.com/saleor/saleor-dashboard/commit/e9c7c58b2e48d76f8ea6cf57bd7dc67681efeed4) Thanks [@poulch](https://github.com/poulch)! - Plugin details now display pill next to each channel to show whenever plugin is active or not in a given channel

- [#5561](https://github.com/saleor/saleor-dashboard/pull/5561) [`4f00787`](https://github.com/saleor/saleor-dashboard/commit/4f007878f248748b52b862e4feb1aea07e2e1155) Thanks [@Cloud11PL](https://github.com/Cloud11PL)! - You can now see the unified look and behavior of pagination action buttons across all list views, including products, customers, orders, and other sections.

- [#5846](https://github.com/saleor/saleor-dashboard/pull/5846) [`3df3c9f`](https://github.com/saleor/saleor-dashboard/commit/3df3c9f5719a9f7ada12ea89c52c32800450beab) Thanks [@krzysztofzuraw](https://github.com/krzysztofzuraw)! - Migrate Saleor docs links to one file

- [#5559](https://github.com/saleor/saleor-dashboard/pull/5559) [`97ae393`](https://github.com/saleor/saleor-dashboard/commit/97ae393f030131ca9d0a4efed7e40a815d714ccd) Thanks [@Cloud11PL](https://github.com/Cloud11PL)! - You can now successfully save transaction refunds as drafts when using the latest version of Saleor Core.

- [#5582](https://github.com/saleor/saleor-dashboard/pull/5582) [`f2a4105`](https://github.com/saleor/saleor-dashboard/commit/f2a410518d0e4301bb48e55f16ca5493751c5caf) Thanks [@andrzejewsky](https://github.com/andrzejewsky)! - Now create webhook button works properly, leading you to the form"

- [#5799](https://github.com/saleor/saleor-dashboard/pull/5799) [`7011033`](https://github.com/saleor/saleor-dashboard/commit/701103328e69cd720f0a30e6ef0ce8d0a0178693) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Fixed `AppWidgets` breaking back-navigation . Now users can normally use browser navigation without page crashing.

- [#5543](https://github.com/saleor/saleor-dashboard/pull/5543) [`21fc883`](https://github.com/saleor/saleor-dashboard/commit/21fc8839f12a4f3934ffa735dac5bd027f53f983) Thanks [@andrzejewsky](https://github.com/andrzejewsky)! - Now navigating to the installed extension, shows the list instantly, this means list is being cached while fetching happens in the background.

- [#5646](https://github.com/saleor/saleor-dashboard/pull/5646) [`cdc2bda`](https://github.com/saleor/saleor-dashboard/commit/cdc2bdad018fdd2fd90530d80b3c52a392c01a03) Thanks [@krzysztofzuraw](https://github.com/krzysztofzuraw)! - Change how dashboard fetches GraphQL schema. After this change GraphQL schema is fetched from Saleor repository instead of Saleor API. If you wants the old behavior use `npm run fetch-local-schema`.

- [#5689](https://github.com/saleor/saleor-dashboard/pull/5689) [`1c20dd8`](https://github.com/saleor/saleor-dashboard/commit/1c20dd8a1f95101bd5b59d4b563a74b700c49edf) Thanks [@NyanKiyoshi](https://github.com/NyanKiyoshi)! - fix: typo in image upload error message

- [#5584](https://github.com/saleor/saleor-dashboard/pull/5584) [`6f4d330`](https://github.com/saleor/saleor-dashboard/commit/6f4d330e0353b386fb794b0a80ba17f3e4c257d5) Thanks [@Cloud11PL](https://github.com/Cloud11PL)! - You can now see updated checkboxes and toggle component in attribute edit form.

- [#5371](https://github.com/saleor/saleor-dashboard/pull/5371) [`0e3109c`](https://github.com/saleor/saleor-dashboard/commit/0e3109cb1c0fc0a0617727213745aa2b11aef2a0) Thanks [@poulch](https://github.com/poulch)! - You can now edit note in order details. Notes in order details now show id of note, id of related note and type of note "added" or "updated"

- [#5574](https://github.com/saleor/saleor-dashboard/pull/5574) [`38ead73`](https://github.com/saleor/saleor-dashboard/commit/38ead736fd5379772e1f52b8afedd3b37f7c702d) Thanks [@andrzejewsky](https://github.com/andrzejewsky)! - Now order-relaed buttons for refund, capture, mark as paid, adding products and fulfill are aligned with the others.

- [#5533](https://github.com/saleor/saleor-dashboard/pull/5533) [`d84d9e6`](https://github.com/saleor/saleor-dashboard/commit/d84d9e6b4b9609088077846ecf01ed8c49bd2fe5) Thanks [@michalina-graczyk](https://github.com/michalina-graczyk)! - Remove testMo from workflows and add CTRF report

- [#5702](https://github.com/saleor/saleor-dashboard/pull/5702) [`e436f79`](https://github.com/saleor/saleor-dashboard/commit/e436f79e15ad875a6994b887d4a4fce35b314190) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Products list can now be filtered based on Product's attribute value, when the attribute's `inputType` is `REFERENCE`.
  Users will be able to search through all possible values (e.g. Products, Product variants, Pages) using input with search.
  Previously REFERENCE attributes couldn't be selected for filtering products.

- [#5778](https://github.com/saleor/saleor-dashboard/pull/5778) [`94ab61d`](https://github.com/saleor/saleor-dashboard/commit/94ab61df39df68475961636fd5bf53aae36f1557) Thanks [@lkostrowski](https://github.com/lkostrowski)! - React was upgraded from 17 to 18

- [#5378](https://github.com/saleor/saleor-dashboard/pull/5378) [`8032935`](https://github.com/saleor/saleor-dashboard/commit/8032935af4bb022cffad420baf4f43c683786d9a) Thanks [@poulch](https://github.com/poulch)! - You can now open datagrid list item in new tab using cmd/ctrl button

- [#5527](https://github.com/saleor/saleor-dashboard/pull/5527) [`cc48fe4`](https://github.com/saleor/saleor-dashboard/commit/cc48fe48b1152e1a55e0d8c21dc4b023a0b72800) Thanks [@Cloud11PL](https://github.com/Cloud11PL)! - You can now filter customers in customers list by metadata.

- [#5593](https://github.com/saleor/saleor-dashboard/pull/5593) [`b6970f7`](https://github.com/saleor/saleor-dashboard/commit/b6970f7f0246fd1acfe3c61b76afc5e50bcce3f5) Thanks [@Cloud11PL](https://github.com/Cloud11PL)! - You can now see udpated UI components in product type details view.

- [#5884](https://github.com/saleor/saleor-dashboard/pull/5884) [`03e02aa`](https://github.com/saleor/saleor-dashboard/commit/03e02aae341386f63d08c290a6462901189fb2ab) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Order details page now uses different link for "View orders" link for signed-in customers. Previously we displayed all orders made using that customer's email address. Now we will show only orders made when the user was signed-in.

- [#5610](https://github.com/saleor/saleor-dashboard/pull/5610) [`c09991c`](https://github.com/saleor/saleor-dashboard/commit/c09991c1d40933c0fbeba141448a14266d26f5dd) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Updated plugin extension details page to use fresh look (new macaw-ui components). Added text when plugin has no configuration.

- [#5634](https://github.com/saleor/saleor-dashboard/pull/5634) [`2411628`](https://github.com/saleor/saleor-dashboard/commit/24116282e4796bd080904e8be1c4d35db06beb70) Thanks [@krzysztofzuraw](https://github.com/krzysztofzuraw)! - Fixed create button extensions on Customers, Products, and Orders lists. Apps can now add custom actions alongside the main action (e.g., creating an order) when mounted as extensions.

- [#5603](https://github.com/saleor/saleor-dashboard/pull/5603) [`2dd687d`](https://github.com/saleor/saleor-dashboard/commit/2dd687d2e9dc84142a1bc25cc30dd1e77b377b46) Thanks [@andrzejewsky](https://github.com/andrzejewsky)! - Now the warning when edditing permissions for the app is more readable in the dark mode"

- [#5650](https://github.com/saleor/saleor-dashboard/pull/5650) [`e45abf9`](https://github.com/saleor/saleor-dashboard/commit/e45abf98b3a8c106b623ade8f30e95644f87d5db) Thanks [@krzysztofzuraw](https://github.com/krzysztofzuraw)! - Changed how dashboard fetches app extensions. After this change user without `MANAGE_APPS` permission will see app extensions.

- [#5589](https://github.com/saleor/saleor-dashboard/pull/5589) [`35a8c3b`](https://github.com/saleor/saleor-dashboard/commit/35a8c3b46270d90e0737aa03d425551fa1c37b8e) Thanks [@andrzejewsky](https://github.com/andrzejewsky)! - Now references to "content" translation referencing to model.

- [#5385](https://github.com/saleor/saleor-dashboard/pull/5385) [`ad7c179`](https://github.com/saleor/saleor-dashboard/commit/ad7c17975bd94cc65df59317a909390b11213552) Thanks [@andrzejewsky](https://github.com/andrzejewsky)! - Now product links on the collection points to the correct url.

- [#5579](https://github.com/saleor/saleor-dashboard/pull/5579) [`d24deb8`](https://github.com/saleor/saleor-dashboard/commit/d24deb86b58c92d214b918539fcd629260aae29b) Thanks [@Cloud11PL](https://github.com/Cloud11PL)! - You can now see updated buttons, inputs and checkboxes in fulfillment refund view

- [#5546](https://github.com/saleor/saleor-dashboard/pull/5546) [`ac41590`](https://github.com/saleor/saleor-dashboard/commit/ac41590048f9d8b37e402c61e81b46efbbd7bb1c) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Added "Not found" page when navigating to non-existing route in `/extensions/*`. Previously a blank page was displayed.

- [#5909](https://github.com/saleor/saleor-dashboard/pull/5909) [`89d4881`](https://github.com/saleor/saleor-dashboard/commit/89d488136a5ca4b74690f1448f9977d232093d08) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Removed "app alerts" feature flag. It was enabled for a while, but now it will not be possible to revert this feature.

- [#5608](https://github.com/saleor/saleor-dashboard/pull/5608) [`eee64c7`](https://github.com/saleor/saleor-dashboard/commit/eee64c7e90c2c44c1add701ae50b30176b4b2e33) Thanks [@andrzejewsky](https://github.com/andrzejewsky)! - Now model types view was migrated to the the same layout as on the other pages.

- [#5576](https://github.com/saleor/saleor-dashboard/pull/5576) [`dacfa49`](https://github.com/saleor/saleor-dashboard/commit/dacfa49fec9d8ffa2dda116b3589b6732f8ffad6) Thanks [@andrzejewsky](https://github.com/andrzejewsky)! - Now the action that runs on release no longer fails due to fetching recent version.

- [#5617](https://github.com/saleor/saleor-dashboard/pull/5617) [`8d71b60`](https://github.com/saleor/saleor-dashboard/commit/8d71b609b82c01493602927aa865b22482530d67) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Added success indicator when token / headers in "Create token" modal in custom app details page are successfully copied to clipboard

- [#5821](https://github.com/saleor/saleor-dashboard/pull/5821) [`f21defe`](https://github.com/saleor/saleor-dashboard/commit/f21defe5fdcb068a93bcc372f05cf0d9983ff203) Thanks [@krzysztofzuraw](https://github.com/krzysztofzuraw)! - Improved stock section when editing product variant. After this change `Assign Warehouse` button will open modal with warehouse select instead of opening dropdown with the list.

- [#5376](https://github.com/saleor/saleor-dashboard/pull/5376) [`6e46436`](https://github.com/saleor/saleor-dashboard/commit/6e464360f0e30af90ea9a2d60f699f64fc319df7) Thanks [@poulch](https://github.com/poulch)! - After creating a new collection, you should see a list of assigned channels

- [#5834](https://github.com/saleor/saleor-dashboard/pull/5834) [`1e0a3f6`](https://github.com/saleor/saleor-dashboard/commit/1e0a3f6a953c5ec89c9695b187d26c7037b6d68e) Thanks [@krzysztofzuraw](https://github.com/krzysztofzuraw)! - Unify Category organization options for product create and update. After this change all comboboxes will use the same `parent / children` pattern of displaying options

- [#5373](https://github.com/saleor/saleor-dashboard/pull/5373) [`1b8d964`](https://github.com/saleor/saleor-dashboard/commit/1b8d9641af219a1d863817236a6ac7ef3e4d2283) Thanks [@poulch](https://github.com/poulch)! - Modals in the Dashboard are now aligned, all have the same max height. Loading items on scroll works when the dialog is displayed in large screen.

- [#5819](https://github.com/saleor/saleor-dashboard/pull/5819) [`25a3fb1`](https://github.com/saleor/saleor-dashboard/commit/25a3fb1a2e08b7b69af0e22311b5893465b442af) Thanks [@IKarbowiak](https://github.com/IKarbowiak)! - Improved order fulfillment cancel dialog: in case the fulfillment is in waiting for approval state, providing a warehouse will be no longer required.

- [#5759](https://github.com/saleor/saleor-dashboard/pull/5759) [`d7b994b`](https://github.com/saleor/saleor-dashboard/commit/d7b994b5c4941228526da2c21e8cf5c24dc8e9f7) Thanks [@krzysztofzuraw](https://github.com/krzysztofzuraw)! - Remove `Preview` chips from channel configuration form for settings:
  - `Use Transaction flow when marking order as paid`
  - `Allow unpaid orders`
  - `Authorize transactions instead of charging`

- [#5636](https://github.com/saleor/saleor-dashboard/pull/5636) [`4b3934c`](https://github.com/saleor/saleor-dashboard/commit/4b3934cc4d1765c851ee775b80a5597423337103) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Fixed exception that happened when voucher details page was opened / refreshed with modal open for selecting collections and variants. Now page loads correctly.

- [#5654](https://github.com/saleor/saleor-dashboard/pull/5654) [`56bb3c8`](https://github.com/saleor/saleor-dashboard/commit/56bb3c8b247bd7bf8b9fa01563ff5faf5667c58e) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Added Back button when viewing Extension (App) details page.

- [#5719](https://github.com/saleor/saleor-dashboard/pull/5719) [`e87f5e0`](https://github.com/saleor/saleor-dashboard/commit/e87f5e0857ee97a8771c3c727256194ae9d7329f) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Changed Product Variant details URL from `/products/<productId>/variant/<variantId>` to `/products/variant/<variantId`.

  Old URL will still work and redirect to new one for backwards compatibility, it will be removed in next minor release.

- [#5569](https://github.com/saleor/saleor-dashboard/pull/5569) [`6df03a0`](https://github.com/saleor/saleor-dashboard/commit/6df03a0adab679bcf36a0dcc81a56d63735d991f) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Moved Extensions installed page URL from `/extensions` to `/extensions/installed`

- [#5471](https://github.com/saleor/saleor-dashboard/pull/5471) [`0727bd0`](https://github.com/saleor/saleor-dashboard/commit/0727bd0e473a7fc1dec1718c5620043ab7b4227e) Thanks [@Cloud11PL](https://github.com/Cloud11PL)! - Login page now doesn't reload after submitting the login form. This means that email and password input remain filled after unsuccessful login attempt.

- [#5598](https://github.com/saleor/saleor-dashboard/pull/5598) [`4439a36`](https://github.com/saleor/saleor-dashboard/commit/4439a3665143b57cef18b1469f311743bbf39c6a) Thanks [@Cloud11PL](https://github.com/Cloud11PL)! - You can now see channel name in fulfillments lists

- [#5877](https://github.com/saleor/saleor-dashboard/pull/5877) [`1c8db15`](https://github.com/saleor/saleor-dashboard/commit/1c8db1560c5a78def49f345e17e0824048c18783) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Feature flag "improved_refunds" is deleted, only new UI is available now

- [#5551](https://github.com/saleor/saleor-dashboard/pull/5551) [`f9921ff`](https://github.com/saleor/saleor-dashboard/commit/f9921fffcca87bfd8ba055fc1e2cc18ae7472ab1) Thanks [@andrzejewsky](https://github.com/andrzejewsky)! - Now you can use download links within the applications.

- [#5566](https://github.com/saleor/saleor-dashboard/pull/5566) [`6616ab4`](https://github.com/saleor/saleor-dashboard/commit/6616ab4fa9ed8812897aea72864db91192857e0f) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Moved app related views from `/apps/` to `/extensions/app/...`

- [#5872](https://github.com/saleor/saleor-dashboard/pull/5872) [`f8b0942`](https://github.com/saleor/saleor-dashboard/commit/f8b0942e8e27893370e9f1dfdf223688d81a1a5e) Thanks [@krzysztofzuraw](https://github.com/krzysztofzuraw)! - Remove `Preview` status from:
  - Channel settings - channel allocation strategy section
  - Customer details - gift cards section
  - Product variant details - checkout limits section
  - Product type details - gift card type
  - Tax settings
  - Warehouse settings - pickup section

- [#5567](https://github.com/saleor/saleor-dashboard/pull/5567) [`db3bc09`](https://github.com/saleor/saleor-dashboard/commit/db3bc092d69d1c4d76c299210ef9ff9db2a59641) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Added new onboarding step when "Extensions" feature flag is enabled: "Discover extension capabilities" that shows users the new installed extensions page.
  It will be marked as uncompleted even if user previously completed "View webhooks" step.

- [#5632](https://github.com/saleor/saleor-dashboard/pull/5632) [`5d95764`](https://github.com/saleor/saleor-dashboard/commit/5d95764878d9568c275555ba5243246ba3d7c264) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Fixed Pills color not updating after rerender (previously for example when changing plugin from active to inactive color didn't change from red to green).

- [#5587](https://github.com/saleor/saleor-dashboard/pull/5587) [`5ae3088`](https://github.com/saleor/saleor-dashboard/commit/5ae30882ef821d8b24b0eaaf33527697c9243462) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Released changes to Extensions previously behind dev feature flag:
  - **Unified "Installed Extensions" view**: Apps, plugins and custom apps (aka "local" apps) are now listed together on a single "Installed Extensions" page.
  - **Plugins in "Explore Extensions"**: Legacy plugins are now discoverable in the "Explore Extensions" section.
  - **Redesigned "Add Custom App" Workflow**: Creating custom apps is now a multi-step process, starting with name and permissions, followed by webhook and token configuration.
  - **Streamlined "Install from Manifest"**: Providing a manifest URL and accepting app permissions are now combined into a single page.
  - **Improved error handling**: Error messages now include direct links to Saleor Documentation for easier troubleshooting.
  - **Removed old views**: Separate list views for plugins and custom apps have been removed.

- [#5511](https://github.com/saleor/saleor-dashboard/pull/5511) [`3cd92e1`](https://github.com/saleor/saleor-dashboard/commit/3cd92e13050e320edcb65bbc9df94791e3f4320d) Thanks [@Cloud11PL](https://github.com/Cloud11PL)! - The library used in variant edit page to change variant order has been changed.
  This means that grabbed variant no longer sticks to the cursor after mouse button has been lifted.

- [#5538](https://github.com/saleor/saleor-dashboard/pull/5538) [`d643828`](https://github.com/saleor/saleor-dashboard/commit/d643828bf08c37e5e901753384580581984df4e1) Thanks [@JannikZed](https://github.com/JannikZed)! - making the DevModePanel use the generic getApiUrl as well to allow the dynamic update in docker containers

- [#5684](https://github.com/saleor/saleor-dashboard/pull/5684) [`f7ef6b8`](https://github.com/saleor/saleor-dashboard/commit/f7ef6b8d02c2331657141f55e0ae5b34abb5b207) Thanks [@krzysztofzuraw](https://github.com/krzysztofzuraw)! - Remove plugin replacements for deprecated plugins. Deprecated plugins are not visible in appstore anymore.

- [#5578](https://github.com/saleor/saleor-dashboard/pull/5578) [`957d7ea`](https://github.com/saleor/saleor-dashboard/commit/957d7ea33d63b9c0f780d309e83f7e0915c101d4) Thanks [@andrzejewsky](https://github.com/andrzejewsky)! - Now orders becomes fulfilment as category name within the sidebar.

- [#5591](https://github.com/saleor/saleor-dashboard/pull/5591) [`7d2d773`](https://github.com/saleor/saleor-dashboard/commit/7d2d773ad873c41c9416dbc0f69ea04d82c73030) Thanks [@andrzejewsky](https://github.com/andrzejewsky)! - Now it is possible to send the nullish value when editing dropdown attributes

- [#5568](https://github.com/saleor/saleor-dashboard/pull/5568) [`74e620d`](https://github.com/saleor/saleor-dashboard/commit/74e620de72a50ecc2cefecc3877d2c4ee2990573) Thanks [@Cloud11PL](https://github.com/Cloud11PL)! - You can now see updated buttons and icons in tables across Dashboard.

- [#5544](https://github.com/saleor/saleor-dashboard/pull/5544) [`9b342f1`](https://github.com/saleor/saleor-dashboard/commit/9b342f12cf14c38eef8e730e3613aa021846cca9) Thanks [@andrzejewsky](https://github.com/andrzejewsky)! - Now sidebar has new section "modeling" that reffers to "content" and "navigation".

- [#5537](https://github.com/saleor/saleor-dashboard/pull/5537) [`4e970c2`](https://github.com/saleor/saleor-dashboard/commit/4e970c266cb39a059655d41f0ac3d46f84bebf3f) Thanks [@andrzejewsky](https://github.com/andrzejewsky)! - Now community banner displays porperly in dark mode

- [#5457](https://github.com/saleor/saleor-dashboard/pull/5457) [`c63e150`](https://github.com/saleor/saleor-dashboard/commit/c63e1507790781271d471009bb84a038600f870f) Thanks [@poulch](https://github.com/poulch)! - You can now select specific products, collections aand categories during voucher creation

- [#5910](https://github.com/saleor/saleor-dashboard/pull/5910) [`4d2ce49`](https://github.com/saleor/saleor-dashboard/commit/4d2ce494158a579f61c64468ae8975fa3a36fbc2) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Removed new_filters flag. The new filters behavior was enabled for a while, so this flag only prevents reverting to the legacy behavior

- [#5739](https://github.com/saleor/saleor-dashboard/pull/5739) [`6637b0b`](https://github.com/saleor/saleor-dashboard/commit/6637b0bc018488c9677ddfe7259ebb89962b437e) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Maintanance: Saleor Dashboard now uses ESLint v9 with flatconfig.

- [#5560](https://github.com/saleor/saleor-dashboard/pull/5560) [`80ec78d`](https://github.com/saleor/saleor-dashboard/commit/80ec78d98aea3c5bf04db4c603c03c798afef414) Thanks [@karola312](https://github.com/karola312)! - Test reports are send on slack in message

- [#5600](https://github.com/saleor/saleor-dashboard/pull/5600) [`2d841f0`](https://github.com/saleor/saleor-dashboard/commit/2d841f04514ba8352742312861f7afcc802a3901) Thanks [@witoszekdev](https://github.com/witoszekdev)! - When installing extension from URL (e.g. by clicking "Install" on Explore Extensions), `manifestUrl` input will no longer be displayed

- [#5529](https://github.com/saleor/saleor-dashboard/pull/5529) [`ba82908`](https://github.com/saleor/saleor-dashboard/commit/ba829086e04c726d8968edac00d55b54186acdbc) Thanks [@poulch](https://github.com/poulch)! - You can now see new installed extensions page with list of all installd apps and search above

- [#5613](https://github.com/saleor/saleor-dashboard/pull/5613) [`7d04c19`](https://github.com/saleor/saleor-dashboard/commit/7d04c19e3e4f213830fd48d0eb59034c4118cd04) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Improved search element across dashboard: now clicking on search icon or near the search border will focus the input.

- [#5797](https://github.com/saleor/saleor-dashboard/pull/5797) [`33fea4e`](https://github.com/saleor/saleor-dashboard/commit/33fea4e443e55d80be0273f2d310c7e4fd0ca0ff) Thanks [@mirekm](https://github.com/mirekm)! - Enhancement: Added new Command Menu actions:
  - Vouchers: Go to / Create
  - Promotions: Go to / Create
  - Customers: Go to / Create
  - Users & Staff: Go to / Invite
  - Extensions: Install from manifest, Go to installed, Explore marketplace
  - Webhooks: Create manually

- [#5670](https://github.com/saleor/saleor-dashboard/pull/5670) [`9ef0833`](https://github.com/saleor/saleor-dashboard/commit/9ef0833cd908c496f12a238179987655deb386ee) Thanks [@andrzejewsky](https://github.com/andrzejewsky)! - The overlap is no longer visible when using text editor.

- [#5565](https://github.com/saleor/saleor-dashboard/pull/5565) [`b19c6e1`](https://github.com/saleor/saleor-dashboard/commit/b19c6e10dae831f8bee76b96e5ce280fdfab327e) Thanks [@witoszekdev](https://github.com/witoszekdev)! - View for managing plugins was added to `/extensions` route, it can be accessed by `/extensions/plugin/<id>` which is used in the list of installed extensions.

- [#5664](https://github.com/saleor/saleor-dashboard/pull/5664) [`8c27403`](https://github.com/saleor/saleor-dashboard/commit/8c27403f65a681a4189ef111231376c40bd20d24) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Product filters now include explicit "Attribute" search option to search for product attributes. Previously this feature was hidden by entering attribute name in the first input element, which made it hard to discover.

- [#5864](https://github.com/saleor/saleor-dashboard/pull/5864) [`13c3fa6`](https://github.com/saleor/saleor-dashboard/commit/13c3fa6bf3214eb74a292185a26d423b6bafc41d) Thanks [@krzysztofzuraw](https://github.com/krzysztofzuraw)! - Fix ProductCreatePage form showing "Leave without saving changes" dialog on successful submission.

  The form was incorrectly marking itself as dirty after successful submission, causing the exit dialog to appear even when the form was successfully saved. This change clears the dirty state when submission succeeds and removes the automatic dirty state setting in the useEffect hook.

- [#5305](https://github.com/saleor/saleor-dashboard/pull/5305) [`10fc24c`](https://github.com/saleor/saleor-dashboard/commit/10fc24cd820359ab07053ba119674d57d2515a72) Thanks [@poulch](https://github.com/poulch)! - Dashboard now sends source header to API, when ENABLED_SERVICE_NAME_HEADER=true. Requires core >=3.20.68.

- [#5730](https://github.com/saleor/saleor-dashboard/pull/5730) [`a8709e2`](https://github.com/saleor/saleor-dashboard/commit/a8709e248316a8d4e7d04d9f15404c23356c5671) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Added "Translate" button in Product page, it links to translations page for selected product. Language is taken from current Dashboard locale

- [#5160](https://github.com/saleor/saleor-dashboard/pull/5160) [`fe252cb`](https://github.com/saleor/saleor-dashboard/commit/fe252cbe63cf482b6d127987476c3b89747a5b22) Thanks [@Cloud11PL](https://github.com/Cloud11PL)! - Fix dockerfile build error caused by deleted file and bash script

- [#5940](https://github.com/saleor/saleor-dashboard/pull/5940) [`4915a19`](https://github.com/saleor/saleor-dashboard/commit/4915a194f9a5a7f79c67e589dd7f18b483b2a275) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Fixed resolving Saleor absolute API URL. It was broken for some setups when extensions received a partial (incomplete) URL.

- [#5377](https://github.com/saleor/saleor-dashboard/pull/5377) [`b1af6f2`](https://github.com/saleor/saleor-dashboard/commit/b1af6f25deb975e72dcb3f05f0d5f9d44a5a4548) Thanks [@poulch](https://github.com/poulch)! - Activates list items on the welcome page no longer implies that they are clickable

- [#5557](https://github.com/saleor/saleor-dashboard/pull/5557) [`7cd7594`](https://github.com/saleor/saleor-dashboard/commit/7cd75942e9739639a693eedd783eee81bdac4f0e) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Fixed Jest tests being flakey (randomly faling) due to not clearing fake timers

- [#5913](https://github.com/saleor/saleor-dashboard/pull/5913) [`becc31e`](https://github.com/saleor/saleor-dashboard/commit/becc31e7cd6d762077afd1bc50699e862bc00132) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Added "Model type" column to the Models list page.

- [#5644](https://github.com/saleor/saleor-dashboard/pull/5644) [`e525950`](https://github.com/saleor/saleor-dashboard/commit/e525950238f6846cee5f325842adad896e84e21e) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Renamed modeling related pages:
  - `/pages` -> `/models`
  - `/page-types` -> `/model-types`
  - `/navigation` -> `/structures`

- [#5791](https://github.com/saleor/saleor-dashboard/pull/5791) [`0fb5b71`](https://github.com/saleor/saleor-dashboard/commit/0fb5b7161e4b5fd249aea17c79eb4e2c9fff25e0) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Order list view now uses new `where` API for filtering. This means that additional new filter options were added:

  Payment filters:
  - `authorizeStatus` - Authorization status (replaces part of old paymentStatus)
  - `chargeStatus` - Charge status (replaces part of old paymentStatus)
  - `totalGross` - Total gross amount with range support
  - `totalNet` - Total net amount with range support
  - `transactions.transactionsPaymentType` - Payment type used in transactions
  - `transactions.transactionsCardBrand` - Card brand used in transactions

  Order content filters:
  - `hasInvoices` - Boolean filter for orders with invoices
  - `hasFulfillments` - Boolean filter for orders with fulfillments
  - `invoices.createdAt` - Invoice creation date with datetime range
  - `number` - Order number (exact match or range)
  - `linesCount` - Number of order lines (exact or range)
  - `checkoutId` - Checkout ID (exact match)
  - `voucherCode` - Voucher code used
  - `fulfilments.warehouse` - Warehouse from which fulfillment was made

  Customer details filters:
  - `userEmail` - Customer email (more specific than old customer)
  - `billingPhoneNumber` - Billing phone number
  - `billingCountry` - Billing country
  - `shippingPhoneNumber` - Shipping phone number
  - `shippingCountry` - Shipping country

  Metadata filters:
  - `lines.metadata` - Order lines metadata
  - `transactions.metadata` - Transactions metadata
  - `fulfillments.metadata` - Fulfillments metadata

  Modified Filters:
  - `giftCard` was split into:
    - `isGiftCardBought` - Boolean for gift card purchases inside order
    - `isGiftCardUsed` - Boolean for gift card usage
  - `status` - Now "Order Status" (previously named "Fulfillment Status"), has options for order statuses (e.g. Cancelled, Draft, etc.)
  - `fulfilments.status` (previously `fulfillmentStatus`) - Separate fulfillment status filter (e.g. Fulfilled, Partially Fulfilled, Refunded, etc.)

  Due to migration to `where` API, following filters were removed:
  - `preorder` - Preorder filter completely removed
  - `paymentStatus` - Replaced by more specific payment status filters

- [#5369](https://github.com/saleor/saleor-dashboard/pull/5369) [`d1c02d1`](https://github.com/saleor/saleor-dashboard/commit/d1c02d107043a7d5ae6981cdd34c19a4c56a50a1) Thanks [@szczecha](https://github.com/szczecha)! - Editor.js no more cause error during saving

- [#5367](https://github.com/saleor/saleor-dashboard/pull/5367) [`70dbf11`](https://github.com/saleor/saleor-dashboard/commit/70dbf119cc84e377965aa3b01feb049505337a5c) Thanks [@poulch](https://github.com/poulch)! - You can now navigate back from collection details to collection list

- [#5629](https://github.com/saleor/saleor-dashboard/pull/5629) [`8185085`](https://github.com/saleor/saleor-dashboard/commit/81850851e0ea313f76a2f98397b2062eb09aae88) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Extension details page now hides webhook deliveries that have no attempt (e.g. deleted after some time by Saleor) and if no delivery has an attempt is shows a message with explanation.
