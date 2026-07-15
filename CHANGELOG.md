# Changelog

## 3.23.16

### Patch Changes

- [#6738](https://github.com/saleor/saleor-dashboard/pull/6738) [`0c43a5a`](https://github.com/saleor/saleor-dashboard/commit/0c43a5ad1777f3096479bdd8cb0b3cc988a34cbb) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Added a "Store details" section at the top of the Site Settings page where you can edit your store's name and description. The store name was previously not editable from the dashboard, and the description had no dedicated field.

## 3.23.15

### Patch Changes

- [#6714](https://github.com/saleor/saleor-dashboard/pull/6714) [`15463b9`](https://github.com/saleor/saleor-dashboard/commit/15463b9973fc242af8c8d9dee702745086b27867) Thanks [@mirekm](https://github.com/mirekm)! - Attributes list for model and product classes can optionally be grouped by type, with tabs, bulk unassign from a single type, and filters that stay above the tab strip. Attribute detail pages show a compact Usage summary of which types include the attribute.

- [#6709](https://github.com/saleor/saleor-dashboard/pull/6709) [`761e4b9`](https://github.com/saleor/saleor-dashboard/commit/761e4b925030d780e267a92e500ae164be6368c7) Thanks [@mirekm](https://github.com/mirekm)! - - Create attributes directly on product and model type pages. Open the menu next to Assign attribute, choose Create attribute, and the new attribute is added to that type automatically — no need to leave the page or set up the link separately.
  - Standardized dialog layouts across the dashboard. Forms, pickers, and confirmations now share consistent headers, content spacing, scrolling, and action buttons — replacing one-off layouts that varied by section.

- [#6721](https://github.com/saleor/saleor-dashboard/pull/6721) [`bde648b`](https://github.com/saleor/saleor-dashboard/commit/bde648bc3229ac2b6943e94d0a7f98c6b0502c0f) Thanks [@lkostrowski](https://github.com/lkostrowski)! - On the order details page, fulfillments with no lines no longer show an empty table with just column headers. The fulfillment card is now rendered without the empty product grid.

- [#6731](https://github.com/saleor/saleor-dashboard/pull/6731) [`a695985`](https://github.com/saleor/saleor-dashboard/commit/a695985dfa32a388cc80e5b33e44bf15e18ae8de) Thanks [@mirekm](https://github.com/mirekm)! - _Timeline_ now matches line matrix for day-to-day work: order-level refund callout, _Fulfill_ and _Return_ in the items section header, per-line row actions, and return/replace reasons on unfulfilled lines when present. _Return_ and _Fulfill_ on a timeline row apply only within that shipment's context — not on already returned, refunded, or replaced fulfillments.

  Reorganized the order details cog menu: extension actions and GraphiQL (with icons) first, _Cancel order_ last as the destructive action. _Return / Replace order_ is in the items section header only.

  Draft orders: deleting a draft no longer shows Internal Server Error notification. The _Select a channel_ confirm button in _Create order_ shows a loading state while the draft is created.

- [#6726](https://github.com/saleor/saleor-dashboard/pull/6726) [`fe2c0ef`](https://github.com/saleor/saleor-dashboard/commit/fe2c0ef4a78281a4fca77a920465fa039a251777) Thanks [@mirekm](https://github.com/mirekm)! - Fixed order fulfillment crashing when fulfilling a single line from a multi-line order. The fulfill page now uses consistent quantity and warehouse controls, disables warehouse selection for zero-quantity lines, pre-selects a warehouse from stock when no allocation exists, and truncates long variant details with a tooltip.

- [#6713](https://github.com/saleor/saleor-dashboard/pull/6713) [`5acf47e`](https://github.com/saleor/saleor-dashboard/commit/5acf47eb27a71f67b24444f026a3cb85c5098ace) Thanks [@mirekm](https://github.com/mirekm)! - Fixed product create and update requiring a second save after assigning a category when publishing to channels. Assigning a category and saving now succeeds on the first try.

- [#6727](https://github.com/saleor/saleor-dashboard/pull/6727) [`f2625e2`](https://github.com/saleor/saleor-dashboard/commit/f2625e238c0b92c607880707bc7f75d606436e0e) Thanks [@mirekm](https://github.com/mirekm)! - Align the add/edit reason modal with dashboard modal patterns: helper text in the header subtitle, inset body layout, and Back button for dismiss.

- [#6733](https://github.com/saleor/saleor-dashboard/pull/6733) [`b5e262e`](https://github.com/saleor/saleor-dashboard/commit/b5e262ef4713059b273a5103d1ba5e63ea072b67) Thanks [@mirekm](https://github.com/mirekm)! - Added expandable rows to the Category list with lazy loading of subcategories and improved nested selection logic.

- [#6705](https://github.com/saleor/saleor-dashboard/pull/6705) [`8300fe8`](https://github.com/saleor/saleor-dashboard/commit/8300fe8669de1d7fc89fac97086809553b8bc2d5) Thanks [@mirekm](https://github.com/mirekm)! - Swatch variant attributes now appear in the product variants grid with color previews, so merchants can edit color-style variant values alongside other variant columns.

- [#6725](https://github.com/saleor/saleor-dashboard/pull/6725) [`c272fc4`](https://github.com/saleor/saleor-dashboard/commit/c272fc4d66c10bea3446ba44b86af881bbb24eac) Thanks [@mirekm](https://github.com/mirekm)! - Product type and model type detail pages now match the refreshed layout used elsewhere in the dashboard: metadata is edited from a header button, attributes sit in the main column, and type settings (name, shipping, taxes, etc.) move to the sidebar.

## 3.23.14

### Patch Changes

- [#6703](https://github.com/saleor/saleor-dashboard/pull/6703) [`f26158a`](https://github.com/saleor/saleor-dashboard/commit/f26158a7e1a404f3b21e447c192353a44fc456a3) Thanks [@mirekm](https://github.com/mirekm)! - Customer profiles now show channel-scoped order statistics: total orders, recent net sales, and average order value. Net sales use product revenue after discounts and exclude shipping and tax; hover the amount for shipping and refund details from the same orders. The recent orders table shows net and gross amounts per order, with a hint explaining how net relates to the overview figures.

- [#6716](https://github.com/saleor/saleor-dashboard/pull/6716) [`ce87ab7`](https://github.com/saleor/saleor-dashboard/commit/ce87ab711dfa71f5ab8cc7f1350cb856d8eecfc1) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Removed the "Used by" column from the gift cards list and the "Used by" field from the gift card details page. These relied on the `GiftCard.usedBy` / `usedByEmail` API fields, which have been deprecated and no longer behave as intended since Saleor 3.14 — `usedBy` became mutable and points to the last usage rather than a reliable single user, so the displayed value was misleading. Filtering gift cards by the customer who used them is unaffected.

- [#6700](https://github.com/saleor/saleor-dashboard/pull/6700) [`260b3ab`](https://github.com/saleor/saleor-dashboard/commit/260b3ab37891d59443717d3b2306b0e848e6d893) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Fixed a flash on the homepage where an empty "Welcome" screen briefly appeared before the app extension tabs and widgets loaded on every page refresh. The homepage now caches the last-known extensions locally and renders their tabs immediately on load while refreshing in the background. On the very first load (before anything is cached) the page stays blank until extensions resolve, instead of flashing the "Welcome" message.

- [#6708](https://github.com/saleor/saleor-dashboard/pull/6708) [`b216b81`](https://github.com/saleor/saleor-dashboard/commit/b216b814a291a263fc846cfbf4d4b7c80021e829) Thanks [@mirekm](https://github.com/mirekm)! - Moved Model Types and Product Types to the bottom of their sidebar sections, separated by a dashed line from daily-use items. Both open the same settings views as Configuration, with a small settings icon and lighter label styling.

- [#6704](https://github.com/saleor/saleor-dashboard/pull/6704) [`4036943`](https://github.com/saleor/saleor-dashboard/commit/40369430a5e3d7cb91d966b1de623919f631ca1b) Thanks [@mirekm](https://github.com/mirekm)! - Added a **Net** column to the orders list showing post-discount product value (excluding tax and shipping), placed before the existing **Total** column. The Net column is shown by default for new layouts and can be enabled from the column picker for customized views.

- [#6712](https://github.com/saleor/saleor-dashboard/pull/6712) [`5b4f22d`](https://github.com/saleor/saleor-dashboard/commit/5b4f22db145c9e0b7d16ffa4345bc87804ce7097) Thanks [@mirekm](https://github.com/mirekm)! - Fixed saving a webhook from the create view incorrectly showing the "Leave without saving changes?" dialog instead of navigating to the new webhook.

## 3.23.13

### Patch Changes

- [#6677](https://github.com/saleor/saleor-dashboard/pull/6677) [`5e69e80`](https://github.com/saleor/saleor-dashboard/commit/5e69e808916da6a9186d5579e522546937409fdb) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Added shop announcements to the Dashboard. Announcements configured on your Saleor instance are now shown at the top of every page, grouped by severity (critical, warning and informational) with the most important ones first.

- [#6675](https://github.com/saleor/saleor-dashboard/pull/6675) [`7a5ed0b`](https://github.com/saleor/saleor-dashboard/commit/7a5ed0be45c71b2b72f6eea70f394a499c2ca8a2) Thanks [@lkostrowski](https://github.com/lkostrowski)! - On the order page, a transaction's Capture and Cancel actions are now disabled while a previous capture or cancel request for that transaction is still being processed by the payment app. The button shows a spinner and an "in progress" label, and becomes available again once the action succeeds or fails. Previously you could trigger the same action multiple times before the first one resolved.

- [#6692](https://github.com/saleor/saleor-dashboard/pull/6692) [`9bb132d`](https://github.com/saleor/saleor-dashboard/commit/9bb132d91efa20981c852535db1c9ad68e1b6b67) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Fixed scheduling future publication of CMS pages (models). Previously, setting an availability date on a page sent `isPublished: false` to the API, so the page stayed hidden from storefront visitors even after the scheduled date passed. Now setting a publication date sends `isPublished: true` together with the date, so the page automatically becomes visible once the scheduled time is reached. Pages waiting for a future publication date are now also correctly shown as "Hidden" with the scheduled date in the visibility card.

- [#6693](https://github.com/saleor/saleor-dashboard/pull/6693) [`26b080c`](https://github.com/saleor/saleor-dashboard/commit/26b080c518f67af90a29a0f5aee1c6e9abf63fc0) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Added an "Open in GraphiQL" action to the kebab menu on more entity detail pages — categories, collections, customers, vouchers, promotions, gift cards, models, model types and menus. Selecting it opens the Dev Mode panel pre-filled with a starter query and the record's ID, matching the existing behaviour on order and product pages.

- [#6675](https://github.com/saleor/saleor-dashboard/pull/6675) [`7a5ed0b`](https://github.com/saleor/saleor-dashboard/commit/7a5ed0be45c71b2b72f6eea70f394a499c2ca8a2) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Order details now updates automatically while an async transaction action (charge, refund or cancel requested through a payment app) is being processed. Previously you had to refresh the page to see whether the action succeeded or failed. A spinner next to the Transactions header indicates that an action is still in progress, and the amounts and events update on their own once the payment app responds.

## 3.23.12

### Patch Changes

- [#6672](https://github.com/saleor/saleor-dashboard/pull/6672) [`7f63506`](https://github.com/saleor/saleor-dashboard/commit/7f63506448a76907a31e0d92738a1534887f2993) Thanks [@mirekm](https://github.com/mirekm)! - Improve channels and shipping zones UX: clickable shipping zone links on channel details, redesigned countries sections, reworked shipping method page with inline channel pricing, and fixes for save/dirty-state, removing a channel while `channelId` is in the URL, and translation issues.

- [#6658](https://github.com/saleor/saleor-dashboard/pull/6658) [`0cfae4c`](https://github.com/saleor/saleor-dashboard/commit/0cfae4c9759c7a9eb03d097a902ddd3eda58946a) Thanks [@lkostrowski](https://github.com/lkostrowski)! - The dashboard now opens on the Home page with widgets by default. Visiting the root URL (`/`) redirects to `/home` instead of showing the welcome page.

## 3.23.11

### Patch Changes

- [#6644](https://github.com/saleor/saleor-dashboard/pull/6644) [`3550b36`](https://github.com/saleor/saleor-dashboard/commit/3550b3626933baaf7d522cf2bbdc1223b572f6a2) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Refund and return reasons can now be captured as structured data alongside free text.
  - Granted refunds now support a reason and a structured reason reference both for the whole refund and per refunded line.
  - Returns now support a reason and a structured reason reference both for the whole return and per returned line.
  - A new combined **Refunds & returns settings** screen (Configuration → Refunds & returns settings) lets you choose the Model Type whose Models are offered as refund reasons and as return reasons. When a type is configured, a structured reason picker appears in the refund and return flows; when none is configured, only free-text reasons are used.
  - Saved reasons are now shown on fulfillment cards (overall and per line) and next to granted refunds in the order's refund table.
  - When granting a refund automatically while returning items (the "Grant refund for returned items" option), you can now provide a reason note and a structured reason for that granted refund. The picker uses the refund reason type configured in Refunds & returns settings, and is hidden when none is set.

## 3.23.10

### Patch Changes

- [#6659](https://github.com/saleor/saleor-dashboard/pull/6659) [`a2b5196`](https://github.com/saleor/saleor-dashboard/commit/a2b51965a7a9e479a99f6e545c6c892e745d2e21) Thanks [@mirekm](https://github.com/mirekm)! - **Attribute detail page – Save fixes**
  - Saving an attribute no longer leaves the form in a "dirty" state, so the "you have unsaved changes" warning is no longer shown after a successful save.
  - The Save button now disables immediately on the first click, preventing accidental double submits.
  - The Save button keeps its primary appearance while saving and while showing the success checkmark (no more switching to the disabled/grey look on hover), and can no longer be clicked again until it returns to its idle state.

- [#6645](https://github.com/saleor/saleor-dashboard/pull/6645) [`30a7ddf`](https://github.com/saleor/saleor-dashboard/commit/30a7ddfcafef53226effa8ff7c8518fe58a02b45) Thanks [@mirekm](https://github.com/mirekm)! - **Attributes list**
  - New **Input type** and **Attribute class** columns with icons
  - Built-in filter presets for product and model attributes
  - Column order and widths are saved between visits

  **Attribute detail page**
  - Attribute class shown beside the title, with a link to the filtered list
  - Metadata edited from a header button and dialog
  - Clearer properties sidebar layout
  - Numeric attributes: working "Select unit" checkbox with helper text; ruler icon and unit name in tooltips when a unit is set

  **Configuration**
  - Separate **Product Settings** and **Model Settings** sections, each with its own attributes entry

  **Across the dashboard**
  - Input type icons in attribute pickers, assignment dialogs, product and model forms, and filters
  - Attribute rows show input type in a tooltip (and unit for numeric attributes)

- [#6664](https://github.com/saleor/saleor-dashboard/pull/6664) [`6747d7c`](https://github.com/saleor/saleor-dashboard/commit/6747d7c2a998fa12c1087ce2c58905b42008fb8f) Thanks [@mirekm](https://github.com/mirekm)! - Compact app widget chrome on detail pages and the home dashboard. Widget headers now show a single line with the app logo and extension name (instead of stacking the app name and extension label), and the header links to the app page. App name is available via tooltip on hover.

- [#6656](https://github.com/saleor/saleor-dashboard/pull/6656) [`28e8ba7`](https://github.com/saleor/saleor-dashboard/commit/28e8ba71d084decc60cd2f90bd92f1f320b5b196) Thanks [@mirekm](https://github.com/mirekm)! - Model type tabs can group related types by splitting names at configurable separators. The settings popover accepts a comma-separated list (default: `—`, `:`, and `-`), matches the leftmost separator, and ignores letter case when bucketing prefixes.

- [#6660](https://github.com/saleor/saleor-dashboard/pull/6660) [`345ca0c`](https://github.com/saleor/saleor-dashboard/commit/345ca0cee90769c40102c9f7e945196ff5500508) Thanks [@mirekm](https://github.com/mirekm)! - **Fix spurious "Leave without saving changes?" prompt when assigning reference attribute values**

  Assigning a value to a reference attribute (e.g. choosing a Collection, Category, Product or Model) on a detail page with unsaved changes no longer triggers the "Leave without saving changes?" exit prompt. Opening and closing URL-driven dialogs (such as the "Assign Collection" modal) is now correctly treated as part of editing the form rather than navigating away from it, so the modal closes cleanly and your changes stay ready to save. This also fixes the same prompt appearing for other URL-driven modals (metadata, remove confirmations, etc.) across Models, Products, Orders and similar detail pages.

## 3.23.9

### Patch Changes

- [#6637](https://github.com/saleor/saleor-dashboard/pull/6637) [`64211cc`](https://github.com/saleor/saleor-dashboard/commit/64211cc38d4cd1ec8dc6979b86c68bfc6dcfad05) Thanks [@NyanKiyoshi](https://github.com/NyanKiyoshi)! - Added `Referrer-Policy: origin-when-cross-origin` header to the
  NGINX config bundled inside the container image.

- [#6642](https://github.com/saleor/saleor-dashboard/pull/6642) [`b77ac26`](https://github.com/saleor/saleor-dashboard/commit/b77ac26c32323ffbc64a6bb356b1efb1e4057b5b) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Fixed an issue where the Return/Replace flow excluded order lines from the granted refund when their fulfillment was waiting for approval. Previously, only shipping costs were sent to the payment provider in such cases - now the refund correctly includes both the returned items and shipping.

- [#6636](https://github.com/saleor/saleor-dashboard/pull/6636) [`9452013`](https://github.com/saleor/saleor-dashboard/commit/945201346cba8ea1aff6f3ce48016422dc8310ae) Thanks [@mirekm](https://github.com/mirekm)! - Models list tabs now auto-group similar model types that share a name prefix:
  - **Grouped tabs** — types like "Storefront — Cart" and "Storefront — Checkout" appear under a single "Storefront" tab.
  - **Subtype picker** — use the dropdown on a grouped tab to switch between "All" and individual subtypes.
  - **Configurable grouping** — adjust the name separator or turn grouping on/off from the settings control next to the tabs.

- [#6631](https://github.com/saleor/saleor-dashboard/pull/6631) [`318c323`](https://github.com/saleor/saleor-dashboard/commit/318c32398f1fb90c66ed7b49ce7104843afd6b1d) Thanks [@mirekm](https://github.com/mirekm)! - Model detail pages now align with other detail views:
  - **Metadata** — edit public and private metadata from a header button instead of an inline section on saved models.
  - **Model type** — the model type appears in the header beside the title, with a link to browse other models of that type.
  - **Slug validation** — duplicate slug errors show once in the SEO section with a clearer message instead of also triggering a toast.

- [#6635](https://github.com/saleor/saleor-dashboard/pull/6635) [`abcfbde`](https://github.com/saleor/saleor-dashboard/commit/abcfbdee6a2708d9903fe5399b41b55d949d322b) Thanks [@mirekm](https://github.com/mirekm)! - Updated sidebar navigation icons for a more consistent look and weight across menu items and shortcuts.

- [#6646](https://github.com/saleor/saleor-dashboard/pull/6646) [`6f10050`](https://github.com/saleor/saleor-dashboard/commit/6f100505d53e948e3cd37ed52e767bfb53179d33) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Show product thumbnail on Order events, when lines are included

- [#6647](https://github.com/saleor/saleor-dashboard/pull/6647) [`231a298`](https://github.com/saleor/saleor-dashboard/commit/231a29846056344f90bb684a7d73b0c0eee0ca33) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Dashboard now responds to the `refreshEntity` app-bridge action. Apps embedded as widgets or popups on an entity detail page (orders, draft orders, products, gift cards, customers, collections, vouchers, categories, promotions, models, model types and menus) can request the host page to silently refetch its entity in the background, without a full page reload. The action is a fire-and-forget acknowledgement and refreshes whichever entity the page hosting the app is currently showing.

- [#6634](https://github.com/saleor/saleor-dashboard/pull/6634) [`dfe0c76`](https://github.com/saleor/saleor-dashboard/commit/dfe0c762b2faf1fbb78f032f1bc00088cbc160fd) Thanks [@mirekm](https://github.com/mirekm)! - Translation detail pages now make it easier to work through a language:
  - **Progress** — see how many fields are translated and what is still missing.
  - **Bulk edit** — turn on bulk edit to update several fields at once and save them together.
  - **Clearer layout** — fields are grouped into sections so names, descriptions, SEO, and attributes are easier to scan.

## 3.23.8

### Patch Changes

- [#6615](https://github.com/saleor/saleor-dashboard/pull/6615) [`cae12c7`](https://github.com/saleor/saleor-dashboard/commit/cae12c75dc5c49e571de6d2d73f0dde6bda46366) Thanks [@mirekm](https://github.com/mirekm)! - Fixed unconfirmed order details so confirming an order updates the page immediately instead of requiring a manual reload. Removed the unused save bar from confirmed order details, including the empty footer slot.

- [#6597](https://github.com/saleor/saleor-dashboard/pull/6597) [`428224e`](https://github.com/saleor/saleor-dashboard/commit/428224ea0d51b997ed074ad00cc09f93c1f0a4f0) Thanks [@mirekm](https://github.com/mirekm)! - Draft orders now open at `/orders/drafts/{id}` so the Drafts sidebar item stays highlighted. Older `/orders/{id}` links to drafts still work and update the address bar automatically.

- [#6613](https://github.com/saleor/saleor-dashboard/pull/6613) [`0693243`](https://github.com/saleor/saleor-dashboard/commit/069324333a77e9befdfc0c86c9abd62e87bf2d21) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Rich-text description editors now support tables. A new "Table" block is available in the editor toolbar across all rich-text fields (product, category, collection and page descriptions, discount and shipping rate descriptions, rich-text attribute values, and translations). Tables support a toggleable heading row, adding and removing rows and columns, and inline formatting (bold, italic, link, strikethrough) inside cells.

- [#6599](https://github.com/saleor/saleor-dashboard/pull/6599) [`2e9704f`](https://github.com/saleor/saleor-dashboard/commit/2e9704f1d2b2ea3bddf685091e04f7fe97b10e4d) Thanks [@mirekm](https://github.com/mirekm)! - Detail-page app widgets in the sidebar no longer sit in a fixed-height box. Apps report content height via the `widgetResize` App Bridge action (`actions.WidgetResize` in `@saleor/app-sdk` ≥ 1.9.0); the Dashboard resizes the iframe and responds with `ok`. GET widgets use `useAppActions`; POST widgets handle the same action in `useWidgetIframeAutoHeight`. App developers can adopt `useWidgetAutoResize` / `reportWidgetHeightFromElement` ([saleor/app-sdk#507](https://github.com/saleor/app-sdk/pull/507)). Apps that have not adopted this yet keep the previous default height.

  Bumps `@saleor/app-sdk` to `1.9.0`.

## 3.23.7

### Patch Changes

- [#6604](https://github.com/saleor/saleor-dashboard/pull/6604) [`3f7e21d`](https://github.com/saleor/saleor-dashboard/commit/3f7e21db9af16ec2e3acc2ca1d3510d9f3f128d1) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Added a deprecation banner in the sidebar that warns when the connected Saleor instance runs a deprecated version. When the connected version is the same or older than the configured `DEPRECATED_SALEOR_VERSION` (compared on major and minor), a banner appears below the Saleor logo informing users that the instance will be automatically upgraded on the date set in `DEPRECATED_SALEOR_VERSION_TIMESTAMP`. The banner is shown only when both environment variables are set and valid.

- [#6614](https://github.com/saleor/saleor-dashboard/pull/6614) [`6f3d073`](https://github.com/saleor/saleor-dashboard/commit/6f3d073320124b2f15e7bc7ee9b29964ca55d19c) Thanks [@mirekm](https://github.com/mirekm)! - Fixed the rich text editor (e.g. product description) duplicating its content on load and then becoming empty and non-editable. This happened in development due to the editor being initialized twice; it now mounts a single editor instance.

- [#6568](https://github.com/saleor/saleor-dashboard/pull/6568) [`2ae78ff`](https://github.com/saleor/saleor-dashboard/commit/2ae78ff3b0e21bd3e67de9a2d96366c01a1fa23c) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Models list now organizes content by model type using horizontal tabs. The previous filter UI and filter presets on this page were removed — the active tab is the type filter. Each tab shows a count badge (e.g. "5" or "20+" when more than one page is available).

- [#6608](https://github.com/saleor/saleor-dashboard/pull/6608) [`a927321`](https://github.com/saleor/saleor-dashboard/commit/a927321de8e4196ffd31886a7bd4990c374812f6) Thanks [@mirekm](https://github.com/mirekm)! - Product media edit page improvements: breadcrumb title with product name and media type, viewport-sized preview for images and embedded videos, and per-media metadata from a header button (same dialog pattern as product and variant). Metadata dialogs and other buttons using the shared save loader now show the Saleor throbber instead of a generic spinner.

- [#6608](https://github.com/saleor/saleor-dashboard/pull/6608) [`a927321`](https://github.com/saleor/saleor-dashboard/commit/a927321de8e4196ffd31886a7bd4990c374812f6) Thanks [@mirekm](https://github.com/mirekm)! - Improved product image gallery on the product details page:
  - Minimal drag-and-drop upload area when the gallery is empty, with a clear overlay when adding images to an existing gallery
  - Gallery order updates immediately after reordering images; a success notification confirms when the new order is saved
  - Success notification when images finish uploading
  - Confirmation step before deleting gallery media, with the removed image disappearing from the gallery right away

- [#6596](https://github.com/saleor/saleor-dashboard/pull/6596) [`8de98be`](https://github.com/saleor/saleor-dashboard/commit/8de98be8a6845128935b8c0a7711842e4e75a26a) Thanks [@mirekm](https://github.com/mirekm)! - Product, variant, and draft order detail pages now manage metadata from a header button that opens a dedicated dialog, matching customer and order details. Header action buttons on entity detail pages also use consistent spacing, with hints on the new metadata buttons.

- [#6595](https://github.com/saleor/saleor-dashboard/pull/6595) [`aff6526`](https://github.com/saleor/saleor-dashboard/commit/aff652625d1de13330be70a3291713087505067e) Thanks [@mirekm](https://github.com/mirekm)! - Product type now appears in the product page header, next to the product name. Click the type to open your catalog filtered to products of that type, or use More actions → Product type settings to edit the type itself. The type is no longer repeated in the organization panel on the right.

- [#6584](https://github.com/saleor/saleor-dashboard/pull/6584) [`d3e3f58`](https://github.com/saleor/saleor-dashboard/commit/d3e3f58de1f7a8c0959073239585ad6e2be7474e) Thanks [@mirekm](https://github.com/mirekm)! - Order details now show clearer, merchant-friendly dates in the header. Instead of an unlabeled timestamp, merchants will see labels like “Placed today at 10:30 AM” or “Created Jan 15 at 10:30 AM” for draft orders, with the exact timezone-aware timestamp available on hover.

- [#6598](https://github.com/saleor/saleor-dashboard/pull/6598) [`4469500`](https://github.com/saleor/saleor-dashboard/commit/446950052f240916bb492ba73b828d12a6b2ef4c) Thanks [@mirekm](https://github.com/mirekm)! - Drop product sidebar spacing between Taxes and app app widgets

## 3.23.6

### Patch Changes

- [#6579](https://github.com/saleor/saleor-dashboard/pull/6579) [`891afe0`](https://github.com/saleor/saleor-dashboard/commit/891afe0b4b015ff9ac67c6d9e7392caa8736d9ee) Thanks [@mirekm](https://github.com/mirekm)! - Redesign of customer details. Adds an Overview card at the top of the customer detail page showing Total orders (with the most recent order's date), Last login, and per-currency Recent orders total + Avg order value cards.

  The Recent orders total / Avg order value cards are aggregated over the customer's last 10 orders, broken down by currency — so a customer with orders in USD and EUR sees one card pair per currency rather than having the metric hidden.

- [#6583](https://github.com/saleor/saleor-dashboard/pull/6583) [`70bded2`](https://github.com/saleor/saleor-dashboard/commit/70bded2e9d149c2392347b9e70870c622304856b) Thanks [@mirekm](https://github.com/mirekm)! - Orders: the sales channel now appears next to the order date in the page header instead of a separate sidebar card. Click the channel name to see all orders for that channel.

- [#6587](https://github.com/saleor/saleor-dashboard/pull/6587) [`70c253a`](https://github.com/saleor/saleor-dashboard/commit/70c253adf5c786152868a5814dc00f3aaf7e6d27) Thanks [@mirekm](https://github.com/mirekm)! - Open the Customers section to read-only viewers with `MANAGE_ORDERS` or `MANAGE_STAFF`, matching the API's `Query.user` permission set (`MANAGE_USERS | MANAGE_ORDERS | MANAGE_STAFF`). Read-only viewers see customer details, addresses, and order history but have no editing affordances: the savebar swaps to a "Read-only" label, and the create button, bulk delete, address actions, account actions menu (activate/deactivate/delete), and metadata editor are hidden. The "View profile" link in Order details now follows the same broader gate. All write paths still require `MANAGE_USERS`, mirroring the server-side mutation permissions.

- [#6576](https://github.com/saleor/saleor-dashboard/pull/6576) [`821188c`](https://github.com/saleor/saleor-dashboard/commit/821188c47d1c761a05dee9011e38e1a04d727c5d) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Refactored TransactionEvents component. Made Typescript strict and removed legacy MaterialUI. Added storybook. No functional changes, slight visual changes may happen.

- [#6585](https://github.com/saleor/saleor-dashboard/pull/6585) [`60e81cc`](https://github.com/saleor/saleor-dashboard/commit/60e81cc0dc5fd41d0c5dc9dbd91396f28cad803d) Thanks [@mirekm](https://github.com/mirekm)! - Staff members who have placed orders are now marked on the staff list and their staff profile links directly to the matching customer profile.

- [#6564](https://github.com/saleor/saleor-dashboard/pull/6564) [`5579eeb`](https://github.com/saleor/saleor-dashboard/commit/5579eebb310a9dfc7213b15ce15651a94e643081) Thanks [@mirekm](https://github.com/mirekm)! - Adds a read-only price breakdown for order lines on confirmed orders. Click a discounted unit price or line total to see how it was calculated — promotions, vouchers, and manual or order-wide discounts. Voucher rows deep-link to the voucher detail page.

- [#6587](https://github.com/saleor/saleor-dashboard/pull/6587) [`70c253a`](https://github.com/saleor/saleor-dashboard/commit/70c253adf5c786152868a5814dc00f3aaf7e6d27) Thanks [@mirekm](https://github.com/mirekm)! - Order details now show clearer, merchant-friendly dates in the header. Instead of an unlabeled timestamp, merchants will see labels like “Placed today at 10:30 AM” or “Created Jan 15 at 10:30 AM” for draft orders, with the exact timezone-aware timestamp available on hover.

- [#6574](https://github.com/saleor/saleor-dashboard/pull/6574) [`9681b59`](https://github.com/saleor/saleor-dashboard/commit/9681b59e56a758baf3e73c235854266783c1976d) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Update dependencies to address known security advisories. The dependency bump removes 12 CVEs that were reported by `pnpm audit` on latest `main` branch:
  - `lodash` — Code Injection via `_.template` ([GHSA-r5fr-rjxr-66jc](https://github.com/advisories/GHSA-r5fr-rjxr-66jc))
  - `lodash` — Prototype Pollution via array ([GHSA-f23m-r3pf-42rh](https://github.com/advisories/GHSA-f23m-r3pf-42rh))
  - `vite` — `server.fs.deny` bypassed with queries ([GHSA-v2wj-q39q-566r](https://github.com/advisories/GHSA-v2wj-q39q-566r))
  - `vite` — Arbitrary File Read via Vite Dev Server ([GHSA-p9ff-h696-f583](https://github.com/advisories/GHSA-p9ff-h696-f583))
  - `vite` — Path Traversal in Optimized Deps ([GHSA-4w7w-66w2-5vf9](https://github.com/advisories/GHSA-4w7w-66w2-5vf9))
  - `protobufjs` — Code injection through bytes field ([GHSA-66ff-xgx4-vchm](https://github.com/advisories/GHSA-66ff-xgx4-vchm))
  - `protobufjs` — Code generation gadget after prototype ([GHSA-75px-5xx7-5xc7](https://github.com/advisories/GHSA-75px-5xx7-5xc7))
  - `protobufjs` — Process-wide denial of service ([GHSA-jvwf-75h9-cwgg](https://github.com/advisories/GHSA-jvwf-75h9-cwgg))
  - `protobufjs` — Denial of service through unbounded input ([GHSA-685m-2w69-288q](https://github.com/advisories/GHSA-685m-2w69-288q))
  - `protobufjs` — Denial of service from crafted field ([GHSA-2pr8-phx7-x9h3](https://github.com/advisories/GHSA-2pr8-phx7-x9h3))
  - `protobufjs` — Prototype injection in generated message ([GHSA-fx83-v9x8-x52w](https://github.com/advisories/GHSA-fx83-v9x8-x52w))
  - `@protobufjs/utf8` / `protobufjs` — Overlong UTF-8 decoding ([GHSA-q6x5-8v7m-xcrf](https://github.com/advisories/GHSA-q6x5-8v7m-xcrf))

- [#6548](https://github.com/saleor/saleor-dashboard/pull/6548) [`94487d7`](https://github.com/saleor/saleor-dashboard/commit/94487d7b73e7e8e9323155603ce0b2017071919b) Thanks [@mirekm](https://github.com/mirekm)! - Variant page: align channel-availability and stock copy with the Saleor 3.23 stock-availability modes.
  - The "Availability" card subtitle on the variant detail page now reads "Listed in N of M channels", so it isn't misread as a statement about whether customers can buy the variant. It counts channel listings, not stock availability.
  - The inventory section now shows a short footnote beneath the per-warehouse stock table explaining how the active stock-availability mode (legacy shipping-zone filtering vs. the new direct warehouse-channel link) determines whether a customer in a given channel actually sees this stock.

- [#6582](https://github.com/saleor/saleor-dashboard/pull/6582) [`345fe75`](https://github.com/saleor/saleor-dashboard/commit/345fe7556b60b0eaff1c2470c73edabbb790f4cb) Thanks [@mirekm](https://github.com/mirekm)! - Card and section headers across the dashboard now share a single, consistent typography style — eliminating the subtle weight/size differences that varied between pages like Orders, Products, and Variants.

## 3.23.5

### Patch Changes

- [#6542](https://github.com/saleor/saleor-dashboard/pull/6542) [`d4808cc`](https://github.com/saleor/saleor-dashboard/commit/d4808cc130c7a5d132e23a04c656fae222a38129) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Dashboard now validates the manifest and prevents `MANAGE_APPS` from being granted for apps (both app creation and installation from a manifest)

- [#6565](https://github.com/saleor/saleor-dashboard/pull/6565) [`845a104`](https://github.com/saleor/saleor-dashboard/commit/845a10414c17b84c35c69d5c7808587cc0031b03) Thanks [@MD-Mushfiqur123](https://github.com/MD-Mushfiqur123)! - Fixed `appBridge` redirects to treat different ports on the same domain as different origins (for example `localhost:3000` vs `localhost:8000`).

- [#6552](https://github.com/saleor/saleor-dashboard/pull/6552) [`d0f499c`](https://github.com/saleor/saleor-dashboard/commit/d0f499c017ab4feb65964681de5b6c94d25bc96f) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Fixed crashes and blank screens when third-party apps are installed without an `appUrl`. Apps that contribute only background functionality (webhooks) or extensions now show a manage screen with a clear "no configuration screen" notice instead of failing.

- [#6559](https://github.com/saleor/saleor-dashboard/pull/6559) [`69e04cb`](https://github.com/saleor/saleor-dashboard/commit/69e04cb5780bf768294182ca7721efbd0b433cdc) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Fixed Rich Text Editor in dark mode - now tex selection and toolbar is readable

- [#6567](https://github.com/saleor/saleor-dashboard/pull/6567) [`d477db8`](https://github.com/saleor/saleor-dashboard/commit/d477db802c323e443f317ed826e1ad18b0a2d3fe) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Rewrite NewPasswordPage to new MacawUI and modern form solution.

## 3.23.4

### Patch Changes

- [#6549](https://github.com/saleor/saleor-dashboard/pull/6549) [`53474a0`](https://github.com/saleor/saleor-dashboard/commit/53474a00566363d6164023201a70fb32aa2f7b19) Thanks [@mirekm](https://github.com/mirekm)! - Webhook event picker: warn admins about Saleor 3.23 channel-scoped stock events.

  The four `PRODUCT_VARIANT_BACK_IN_STOCK_*` / `PRODUCT_VARIANT_OUT_OF_STOCK_*` events introduced in Saleor 3.23 fire only when the shop has the legacy shipping-zone stock-availability setting disabled. They were already exposed in the picker (auto-derived from the schema), but admins on shops still in legacy mode could subscribe with no visual cue and silently never receive deliveries. Each of those four events now shows an advisory "Direct stock mode only" badge with a tooltip linking to the site-settings page where the flag is configured. Adds a regression test pinning the four events to the `PRODUCT_VARIANT` group, and a comment in `ExcludedDocumentKeys` documenting that the dry-run feature already covers them transitively via prefix matching.

- [#6546](https://github.com/saleor/saleor-dashboard/pull/6546) [`c305dd4`](https://github.com/saleor/saleor-dashboard/commit/c305dd4b93494312b2c60cfc26091ffda22a2153) Thanks [@mirekm](https://github.com/mirekm)! - ProductDoctor: Add mode-aware reassurance under public-API verification badge and tighten ambiguous diagnostic copy

- [#6557](https://github.com/saleor/saleor-dashboard/pull/6557) [`6589b54`](https://github.com/saleor/saleor-dashboard/commit/6589b54bc9a746d083da3185c9abe51ce0254122) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Removed deprecated @reach/auto-id dependency and replaced it with built-in React useId hook. This is purely technical change.

- [#6547](https://github.com/saleor/saleor-dashboard/pull/6547) [`764b4f9`](https://github.com/saleor/saleor-dashboard/commit/764b4f9f11ba2d87d82b6c35a97e9ebfc8bf68ce) Thanks [@mirekm](https://github.com/mirekm)! - ProductDoctor: Group channel issues by purchasability vs shipping to mirror Saleor 3.23 stock-availability semantics

- [#6545](https://github.com/saleor/saleor-dashboard/pull/6545) [`029f589`](https://github.com/saleor/saleor-dashboard/commit/029f589c0d10e3afd5e4879b862019e2868e3bad) Thanks [@mirekm](https://github.com/mirekm)! - ProductDoctor: Add support for new availability mode introduced in Saleor 3.23

## 3.23.3

### Patch Changes

- [#6536](https://github.com/saleor/saleor-dashboard/pull/6536) [`15eced3`](https://github.com/saleor/saleor-dashboard/commit/15eced3c88dd8aebfcf1dc5988b6c9a8dfae00f4) Thanks [@IKarbowiak](https://github.com/IKarbowiak)! - Added a "Stock availability" toggle in Site Settings to control `useLegacyShippingZoneStockAvailability`.

- [#6490](https://github.com/saleor/saleor-dashboard/pull/6490) [`a963af0`](https://github.com/saleor/saleor-dashboard/commit/a963af04519a25bd8b0f53bc942622f139d6e24a) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Set strict-typed Scalars: JSON and JSONString. Previously Codegen generated `any` types, making them insecure in the codebase. Now they are `unknown` and `string`. Now it's explicit that JSON must be narrowed (e.g. with Zod schema) and JSONString must be first parsed.

- [#6434](https://github.com/saleor/saleor-dashboard/pull/6434) [`71222e4`](https://github.com/saleor/saleor-dashboard/commit/71222e4cff7148b0ff8439a0af23b8cd123917fc) Thanks [@mirekm](https://github.com/mirekm)! - Order-level and order-line discount flows now share the same UX in Draft and Unconfirmed orders. Access Add/Edit order line discount now also from the order row menu.

## 3.23.2

### Patch Changes

- [#6522](https://github.com/saleor/saleor-dashboard/pull/6522) [`46384c3`](https://github.com/saleor/saleor-dashboard/commit/46384c3e2cc562a5132f3c841d4f958a34712a1e) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Fixed filtering by attributes of type boolean

## 3.23.1

### Patch Changes

- [#6499](https://github.com/saleor/saleor-dashboard/pull/6499) [`b652a58`](https://github.com/saleor/saleor-dashboard/commit/b652a58b497b401d57dbd74f781ecc382cf81fcd) Thanks [@IKarbowiak](https://github.com/IKarbowiak)! - Show a spinner instead of "no login method available" error message while the login page is loading authentication configuration.

- [#6504](https://github.com/saleor/saleor-dashboard/pull/6504) [`d0cb8ef`](https://github.com/saleor/saleor-dashboard/commit/d0cb8ef8afa25da3a79138394cb195467b3c1e02) Thanks [@mirekm](https://github.com/mirekm)! - Fix deleting saved, server-side Voucher codes

- [#6495](https://github.com/saleor/saleor-dashboard/pull/6495) [`cb8679d`](https://github.com/saleor/saleor-dashboard/commit/cb8679df28f82f2f8d2ae8f15ca2959781096ba2) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Fixed bug where arbitrary email couldn't be used to send giftcard to

- [#6453](https://github.com/saleor/saleor-dashboard/pull/6453) [`01c6fca`](https://github.com/saleor/saleor-dashboard/commit/01c6fca3a6c87824a65e45bb4ebb75bcc347a4ca) Thanks [@mirekm](https://github.com/mirekm)! - Clean up and update Promotions UI. Now rules are easier to understand with all the items that rule apply to clickable directly from the rule card, and improved Edit/Add rule modal.

- [#6513](https://github.com/saleor/saleor-dashboard/pull/6513) [`100df98`](https://github.com/saleor/saleor-dashboard/commit/100df98ffdfeed0687582d4d73336e658588b47f) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Updated Gift Card customer attachment to show a separate button for entering a custom value instead of using a combobox.

## 3.23.0

### Minor Changes

- [#6496](https://github.com/saleor/saleor-dashboard/pull/6496) [`aa31922`](https://github.com/saleor/saleor-dashboard/commit/aa31922521279029eb9803918f7dbb40d7918280) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Version bump for the 3.23 release

### Patch Changes

- [#6483](https://github.com/saleor/saleor-dashboard/pull/6483) [`fadf41c`](https://github.com/saleor/saleor-dashboard/commit/fadf41c4f94b8532a4d1ab2cf947994ce64d6559) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Improved performance of initial GraphQL queries on page load. Now user, shop and channels are parallelized

- [#6485](https://github.com/saleor/saleor-dashboard/pull/6485) [`94e85a4`](https://github.com/saleor/saleor-dashboard/commit/94e85a4817ca90d846e3de9adc859b6944dce663) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Show apps' Problems even for disabled apps

- [#6481](https://github.com/saleor/saleor-dashboard/pull/6481) [`d0a4ebd`](https://github.com/saleor/saleor-dashboard/commit/d0a4ebdfaa46af3ebedd633201ee0ee8c9e93536) Thanks [@IKarbowiak](https://github.com/IKarbowiak)! - Add tooltip for search inputs

- [#6487](https://github.com/saleor/saleor-dashboard/pull/6487) [`5fe6bd7`](https://github.com/saleor/saleor-dashboard/commit/5fe6bd709b282fea5402ab143d05e1e0fac4b7bc) Thanks [@NyanKiyoshi](https://github.com/NyanKiyoshi)! - Fixed a typo in channel deletion confirmation modal.

## 3.23.0-a.1

### Patch Changes

- [#6476](https://github.com/saleor/saleor-dashboard/pull/6476) [`465f952`](https://github.com/saleor/saleor-dashboard/commit/465f952416b1c331e76ade8484a9cc670a14acc1) Thanks [@wcislo-saleor](https://github.com/wcislo-saleor)! - Fix displaying gift card payment method details in order view.

- [#6396](https://github.com/saleor/saleor-dashboard/pull/6396) [`6cbec4c`](https://github.com/saleor/saleor-dashboard/commit/6cbec4c91366804303808421a0d350159979116b) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Added support for displaying transactions' payment method details - for gift cards. Now both Saleor built-in gift cards and apps that reported gift card payment will have dedicated display in order view

- [#6451](https://github.com/saleor/saleor-dashboard/pull/6451) [`6775911`](https://github.com/saleor/saleor-dashboard/commit/677591175850e34f81bd881ccf645e32c8ef3a2a) Thanks [@mirekm](https://github.com/mirekm)! - Fix discount content display in the order timeline

- [#6475](https://github.com/saleor/saleor-dashboard/pull/6475) [`53aac0b`](https://github.com/saleor/saleor-dashboard/commit/53aac0b2a9178f46adfb22e1a413072c25eab3ab) Thanks [@wcislo-saleor](https://github.com/wcislo-saleor)! - Tolerate checkoutSettings being undefined while the GraphQL query is still loading.

- [#6465](https://github.com/saleor/saleor-dashboard/pull/6465) [`5e4d040`](https://github.com/saleor/saleor-dashboard/commit/5e4d040ed94147afaae19469e4f50e7f4741260e) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Fixed re-ordering products causing 400 error

- [#6471](https://github.com/saleor/saleor-dashboard/pull/6471) [`7bf722f`](https://github.com/saleor/saleor-dashboard/commit/7bf722f63e4cbe17975b86a53d0554e0748a6f30) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Removed Ripples introduced in 3.22

## 3.23.0-a.0

TODO

## 3.22.36

### Patch Changes

- [#6406](https://github.com/saleor/saleor-dashboard/pull/6406) [`142b8cf`](https://github.com/saleor/saleor-dashboard/commit/142b8cfaa13d621b87849714289e548b9e666599) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Replaced a few instances of moment.js usage with native Intl API

- [#6409](https://github.com/saleor/saleor-dashboard/pull/6409) [`32d03dc`](https://github.com/saleor/saleor-dashboard/commit/32d03dce6e5655f73ca79b04b282c4d71fcd0977) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Gift cards filters now have option to filder by gift card code explicitly. Previously this was available only in search box, which uses `search` query, this however might not be available immediately after creating a gift card, due to indexing running in the background.

- [#6450](https://github.com/saleor/saleor-dashboard/pull/6450) [`3bfd607`](https://github.com/saleor/saleor-dashboard/commit/3bfd607d39edcd957ed5af68a528faf02d6dbe88) Thanks [@IKarbowiak](https://github.com/IKarbowiak)! - Fixed missing Product Variant webhook events group in the webhook creation UI.

- [#6421](https://github.com/saleor/saleor-dashboard/pull/6421) [`e7890fc`](https://github.com/saleor/saleor-dashboard/commit/e7890fceb028e2500db45b2b7e6e2401a36e3d3a) Thanks [@wcislo-saleor](https://github.com/wcislo-saleor)! - Added graceful fallback for product media images that fail to load, showing a placeholder icon and message instead of a broken image

- [#6438](https://github.com/saleor/saleor-dashboard/pull/6438) [`0e11960`](https://github.com/saleor/saleor-dashboard/commit/0e11960d577b7b55ec11d570f6c4549af094e742) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Bumped Node to v24 in Dockerfiles (Github Actions, Docker, Devcontainers)

- [#6405](https://github.com/saleor/saleor-dashboard/pull/6405) [`23a4ee7`](https://github.com/saleor/saleor-dashboard/commit/23a4ee721f51d11b0a886a6530d5b08abb92e08d) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Pull @saleor/sdk dependency into Dashboard codebase, to restore control of external dependencies like Apollo

- [#6426](https://github.com/saleor/saleor-dashboard/pull/6426) [`d280080`](https://github.com/saleor/saleor-dashboard/commit/d280080c82832cd7451847fc0e5677f019f617d5) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Store Dashboard hostname as Sentry user, for better aggregation of errors. No PII leak (user is not attached to people, but service)

- [#6427](https://github.com/saleor/saleor-dashboard/pull/6427) [`80ba3cf`](https://github.com/saleor/saleor-dashboard/commit/80ba3cfaafcd0cd042c097e1e2a782ce0bd4fecd) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Updated Vite bundler to 7.3.1 (from 6.4.1). This is a dev/build-time dependency update; no user-facing changes are expected.

- [#6404](https://github.com/saleor/saleor-dashboard/pull/6404) [`659142b`](https://github.com/saleor/saleor-dashboard/commit/659142bd5fe708e6e7edd883c347320f5b510446) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Replace a few moment.js invocations with native browser APIs

- [#6414](https://github.com/saleor/saleor-dashboard/pull/6414) [`bbc0cb1`](https://github.com/saleor/saleor-dashboard/commit/bbc0cb1390198d22b18bf8d0c173757715d5a939) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Updated Jotai package to 2.18.1

- [#6432](https://github.com/saleor/saleor-dashboard/pull/6432) [`dc53906`](https://github.com/saleor/saleor-dashboard/commit/dc53906f60482d4641eff5f11e308e4d47213a75) Thanks [@mirekm](https://github.com/mirekm)! - Fix datagrid header selection color (regression)

- [#6447](https://github.com/saleor/saleor-dashboard/pull/6447) [`f5c2172`](https://github.com/saleor/saleor-dashboard/commit/f5c217210640473a86d02ffdcfb0ec501b194478) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Fixed bug where extensions() query was executed multiple times

- [#6407](https://github.com/saleor/saleor-dashboard/pull/6407) [`65922df`](https://github.com/saleor/saleor-dashboard/commit/65922dfd77174e95d919a15e2701206072a09561) Thanks [@IKarbowiak](https://github.com/IKarbowiak)! - Add password login mode setting to Site Settings, allowing administrators to control whether password-based authentication is enabled, restricted to customers only, or fully disabled. The Sign In page now respects this setting — when password login is disabled or restricted to customers only, the email/password form is hidden and only external authentication methods (e.g. SSO) are shown.

- [#6437](https://github.com/saleor/saleor-dashboard/pull/6437) [`e5a6dbd`](https://github.com/saleor/saleor-dashboard/commit/e5a6dbde53e9632f202e11af873cf376b3ac5008) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Fixed dynamic fetching of categories (Combobox) in the Product Page (assign product to category)

- [#6419](https://github.com/saleor/saleor-dashboard/pull/6419) [`75b85d9`](https://github.com/saleor/saleor-dashboard/commit/75b85d90d6097164e3cde9698e3c537efc2928ff) Thanks [@IKarbowiak](https://github.com/IKarbowiak)! - Support REFUNDED_IN_ORDER event in gift card history

## 3.22.35

### Patch Changes

- [#6408](https://github.com/saleor/saleor-dashboard/pull/6408) [`ae326e8`](https://github.com/saleor/saleor-dashboard/commit/ae326e82e4305e412ee6213c2c0121a09265e112) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Fixed main e2e test suite failing due to using masking on shared job output

- [#6402](https://github.com/saleor/saleor-dashboard/pull/6402) [`75a5de8`](https://github.com/saleor/saleor-dashboard/commit/75a5de8e9a4428d0b60fa2d395405ec9bef404e1) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Update dependencies

- [#6399](https://github.com/saleor/saleor-dashboard/pull/6399) [`fbbafcb`](https://github.com/saleor/saleor-dashboard/commit/fbbafcb11eecec281098a81c6063bb2d6de20c07) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Replaced last remaining icons from MacawUI and replaced them with Lucide

- [#6391](https://github.com/saleor/saleor-dashboard/pull/6391) [`dced6da`](https://github.com/saleor/saleor-dashboard/commit/dced6da33662c850f60f8664d588793dabc1d9c5) Thanks [@lkostrowski](https://github.com/lkostrowski)! - When App Store is not configured (env variable not set), Dashboard will not longer crash. Instead it will load
  local catalog of apps and plugins to render them as a fallback

- [#6401](https://github.com/saleor/saleor-dashboard/pull/6401) [`41a3abb`](https://github.com/saleor/saleor-dashboard/commit/41a3abbfe75cd96b8ce79a03a76d1de78bab44fe) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Added Vite aliases so bare `react` and `react-dom` imports resolve from the project's node_modules. This allows using local linking of other React-based packages (like app-sdk or MacawUI) which normally break due to two React versions being installed.

- [#6395](https://github.com/saleor/saleor-dashboard/pull/6395) [`664d662`](https://github.com/saleor/saleor-dashboard/commit/664d6624c52cae0fc536f0645e3e4d16454efa15) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Hide Webhooks plugin on the extensions list

- [#6408](https://github.com/saleor/saleor-dashboard/pull/6408) [`ae326e8`](https://github.com/saleor/saleor-dashboard/commit/ae326e82e4305e412ee6213c2c0121a09265e112) Thanks [@witoszekdev](https://github.com/witoszekdev)! - `run pw-e2e` label on PRs will now also trigger a deployment. Previously e2e test failed due to a missing deployment without clear error.

- [#6393](https://github.com/saleor/saleor-dashboard/pull/6393) [`f587cfb`](https://github.com/saleor/saleor-dashboard/commit/f587cfb4f2d0d0f0aef6418e9ad9bbec7a15dc90) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Refund reasons are now sorted by name within Select

- [#6392](https://github.com/saleor/saleor-dashboard/pull/6392) [`7d74846`](https://github.com/saleor/saleor-dashboard/commit/7d748462fde9a1cc435e334b1dffab971db983a0) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Updated MacawUI to 1.4.2

## 3.22.34

### Patch Changes

- [#6360](https://github.com/saleor/saleor-dashboard/pull/6360) [`8a3c66d`](https://github.com/saleor/saleor-dashboard/commit/8a3c66d2ec8b5e735b68d48d171048879647b0a3) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Added filtering to "Assign Collection" modals based on collection query filter options (published status, metadata, channel), matching existing filters on the collection list page.

- [#6371](https://github.com/saleor/saleor-dashboard/pull/6371) [`ab46371`](https://github.com/saleor/saleor-dashboard/commit/ab463717010f780c74ef7472e5bb013a8a054926) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Updated minimal Node version to 22.15

- [#6372](https://github.com/saleor/saleor-dashboard/pull/6372) [`05d8ab2`](https://github.com/saleor/saleor-dashboard/commit/05d8ab248cd9dcf68460182aeb1796cddb93b71f) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Updated Storybook to 10.2.12

- [#6374](https://github.com/saleor/saleor-dashboard/pull/6374) [`053c6ca`](https://github.com/saleor/saleor-dashboard/commit/053c6ca47b912002647fdf95e5e742f8d2e96cf5) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Fixed path to payment methods assets

- [#6386](https://github.com/saleor/saleor-dashboard/pull/6386) [`5e22bb2`](https://github.com/saleor/saleor-dashboard/commit/5e22bb2384ea8909babdd64074b84e295778ee26) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Fixed customer selection component in Draft Order page, where custom email could not have been added.

- [#6371](https://github.com/saleor/saleor-dashboard/pull/6371) [`ab46371`](https://github.com/saleor/saleor-dashboard/commit/ab463717010f780c74ef7472e5bb013a8a054926) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Removed .nvmrc, in favor of pacakge.json engines filed

- [#6367](https://github.com/saleor/saleor-dashboard/pull/6367) [`be5c413`](https://github.com/saleor/saleor-dashboard/commit/be5c413fc436c24904cbbbc0b1cffa434d9f6aaa) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Added deployment of Storybook to Chromaitc via GitHub actions

- [#6360](https://github.com/saleor/saleor-dashboard/pull/6360) [`8a3c66d`](https://github.com/saleor/saleor-dashboard/commit/8a3c66d2ec8b5e735b68d48d171048879647b0a3) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Filtering in "Assign ..." modals is not available in all contexts. Previously filtering feature was available only in product update page.

- [#6377](https://github.com/saleor/saleor-dashboard/pull/6377) [`d310e49`](https://github.com/saleor/saleor-dashboard/commit/d310e499fb6e3e5c15942ee4a4d8ffdbe2eb7630) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Added breadcrumbs to Category Details page. Now entire category path will be visible, instead of only showing the current one (e.g. Apparel / Men / T-Shirts)

- [#6383](https://github.com/saleor/saleor-dashboard/pull/6383) [`f25222b`](https://github.com/saleor/saleor-dashboard/commit/f25222bea7243be7428d2bda744007e88b342a85) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Fixed filters that map to single-value fields (e.g. "Is published", boolean flags, date ranges) being added multiple times in the filter panel.
  Duplicate rows silently overwrote each other, with only the last value taking effect. Single-value filters are now correctly limited to one occurrence, meaning they cannot be selected when adding new filter line.

- [#6370](https://github.com/saleor/saleor-dashboard/pull/6370) [`271928b`](https://github.com/saleor/saleor-dashboard/commit/271928ba0e673d79cb85ae15e266e5b056cca78b) Thanks [@IKarbowiak](https://github.com/IKarbowiak)! - Extend search input width to prevent placeholder text from being cut off

- [#6384](https://github.com/saleor/saleor-dashboard/pull/6384) [`f820904`](https://github.com/saleor/saleor-dashboard/commit/f820904f754467cdb3ac3c85418ca0ea2fa03c00) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Fix product attribute filters for `CATEGORY` and `COLLECTION` reference types showing empty dropdown.
  Previously, filtering products by attributes that reference categories or collections would show no options in the value picker.

## 3.22.33

### Patch Changes

- [#6326](https://github.com/saleor/saleor-dashboard/pull/6326) [`4238398`](https://github.com/saleor/saleor-dashboard/commit/42383986648ce40c1d113a41aa191b6d62797a43) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Added filtering to "Assign Category" modals based on categories query filter options, similar to existing filters on category list page.

- [#6355](https://github.com/saleor/saleor-dashboard/pull/6355) [`80b93f6`](https://github.com/saleor/saleor-dashboard/commit/80b93f6d79fd7f54d46b0609d6bd927ce4e4a20d) Thanks [@IKarbowiak](https://github.com/IKarbowiak)! - Added "Address Validation" setting to the site settings page, allowing admins to preserve address fields that fall outside a country's standard format instead of having them removed during validation.

  Requires Saleor [3.22.38](https://github.com/saleor/saleor/releases/tag/3.22.38)

- [#6350](https://github.com/saleor/saleor-dashboard/pull/6350) [`51575d1`](https://github.com/saleor/saleor-dashboard/commit/51575d12910355e23c1982a7836bf15083d45a1a) Thanks [@IKarbowiak](https://github.com/IKarbowiak)! - Extend site settings with webhook emission section - allow changing `useLegacyUpdateWebhookEmission` flag

- [#6352](https://github.com/saleor/saleor-dashboard/pull/6352) [`3b4e59c`](https://github.com/saleor/saleor-dashboard/commit/3b4e59c737c52f9ab473e80e0b2fdb4ae594057a) Thanks [@IKarbowiak](https://github.com/IKarbowiak)! - Fix Gift Cards search to use `giftCards.search` query parameter instead of filtering by `code`. This enables searching gift cards by email, user name, and code rather than only by exact code match.

- [#6356](https://github.com/saleor/saleor-dashboard/pull/6356) [`8c5f075`](https://github.com/saleor/saleor-dashboard/commit/8c5f0754d863a7f4a25487982ea3fbc892bb822e) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Fix pnpm audit security vulnerabilities by adding dependency overrides for ajv, and bumping qs to a patched version. Suppress minimatch CVE-2026-26996 (ReDoS) via auditConfig since upgrading to minimatch 10.x breaks Jest coverage instrumentation.

- [#6348](https://github.com/saleor/saleor-dashboard/pull/6348) [`49308be`](https://github.com/saleor/saleor-dashboard/commit/49308be632e06e0d041087b1042fbc9a16296ffc) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Fix mapping VISA payment method in Transaction view. Now VISA logo is displayed correctly

- [#6349](https://github.com/saleor/saleor-dashboard/pull/6349) [`496f688`](https://github.com/saleor/saleor-dashboard/commit/496f6888e22d442a47f77c575c479d06717fbef5) Thanks [@chrislaai](https://github.com/chrislaai)! - Update the API_URL in .env.template

- [#6363](https://github.com/saleor/saleor-dashboard/pull/6363) [`1d78e48`](https://github.com/saleor/saleor-dashboard/commit/1d78e48300a47e832b37ba8be8b780ca053f13a0) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Added a hint (Ripple) on the installed extensions page to notify users about the new app problems feature, which shows issues with apps directly in the extensions list.

- [#6283](https://github.com/saleor/saleor-dashboard/pull/6283) [`fca0cbf`](https://github.com/saleor/saleor-dashboard/commit/fca0cbf41abc46b5f05da3d607bbfecc6cd62b00) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Added app problems display to the installed extensions list. Each app now shows reported problems with severity badges, timestamps, and dismissal support. The "Open the app" action link is only shown for third-party apps. Requires Saleor 3.22+.

  :::warning
  This release _requires_ Saleor core [`3.22.36`](https://github.com/saleor/saleor/releases/tag/3.22.36). Used with older version, Extensions page will break
  :::

## 3.22.32

### Patch Changes

- [#6340](https://github.com/saleor/saleor-dashboard/pull/6340) [`ccc005a`](https://github.com/saleor/saleor-dashboard/commit/ccc005a715c5834291630ad19c3808f30fa6593a) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Fixed debugging messages (warnings in browser console) where Dashboard confused actions from 3rd party, like browser extensions signals with AppBridge actions. Now warnings should only occur, when proper frame is sent, but with invalid events inside

- [#6323](https://github.com/saleor/saleor-dashboard/pull/6323) [`85e7f3f`](https://github.com/saleor/saleor-dashboard/commit/85e7f3f81e7f9c534ff7a8e9f87d9ed3a1d93cd4) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Added new e2e tests for Saleor apps deployed in staging environment (internal). They check if app loads correctly and displays its settings

- [#6254](https://github.com/saleor/saleor-dashboard/pull/6254) [`a0011cc`](https://github.com/saleor/saleor-dashboard/commit/a0011cc9bc7f23deca89df61eeaaffd358e495ab) Thanks [@iharshyadav](https://github.com/iharshyadav)! - Fix product export with "Current search" filter option. The export mutation now correctly includes filter parameters when exporting products with the "Current search" scope, allowing users to export only filtered products as intended.

- [#6339](https://github.com/saleor/saleor-dashboard/pull/6339) [`23d946c`](https://github.com/saleor/saleor-dashboard/commit/23d946c24465d85c254aaf863e692e9d296e281d) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Order Transaction will now display payment method details, like card brand or type.

- [#6327](https://github.com/saleor/saleor-dashboard/pull/6327) [`4f81c86`](https://github.com/saleor/saleor-dashboard/commit/4f81c86b5e244fedb3908bbce538cefbe454b498) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Added filtering UI to "Assign Model" dialogs.
  This allows filtering by "Model type" when assigning values to Model reference attributes in products and product variants.

- [#6311](https://github.com/saleor/saleor-dashboard/pull/6311) [`61a484d`](https://github.com/saleor/saleor-dashboard/commit/61a484db5ff9891eb5e23533fd1765a649e55e7e) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Fixed issue when filtering products by parameters depending on channel (e.g. price) - previously filters didn't work correctly and always returned an empty list. Now filters will work correctly by passing correct channel value.

- [#6318](https://github.com/saleor/saleor-dashboard/pull/6318) [`cf1c8aa`](https://github.com/saleor/saleor-dashboard/commit/cf1c8aa1b5db738b22415764b472bf448d1bb978) Thanks [@mirekm](https://github.com/mirekm)! - Product availability diagnostics now skip shipping zone warnings for non-shippable products (digital goods, activation codes, etc.). Products with isShippingRequired: false on their product type will no longer see false positive warnings about missing shipping zones or unreachable warehouses via shipping.

- [#6333](https://github.com/saleor/saleor-dashboard/pull/6333) [`1739498`](https://github.com/saleor/saleor-dashboard/commit/1739498df428d728395436230df197b88ad4ade3) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Fixed code splitting for `auth` and `configuration` chunks. Previously this code was included in the main bundle, skipping dynamic imports. Now it will only load when needed, which should improve performance.

- [#6324](https://github.com/saleor/saleor-dashboard/pull/6324) [`9ab34dc`](https://github.com/saleor/saleor-dashboard/commit/9ab34dcd90515abd1468fd55f62059693f1bd0e4) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Fixed icon in theme switcher not showing

- [#6317](https://github.com/saleor/saleor-dashboard/pull/6317) [`160511f`](https://github.com/saleor/saleor-dashboard/commit/160511f88fa381e54f26d85c093dd586e03bab45) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Updated to storybook v10

- [#6311](https://github.com/saleor/saleor-dashboard/pull/6311) [`61a484d`](https://github.com/saleor/saleor-dashboard/commit/61a484db5ff9891eb5e23533fd1765a649e55e7e) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Added filtering to "Assign Variant" modals based on products query `where` options, similar to existing filters on product list page.

- [#6334](https://github.com/saleor/saleor-dashboard/pull/6334) [`5669ef5`](https://github.com/saleor/saleor-dashboard/commit/5669ef5cdcc8ed86959a3e3677d2fac253623d1a) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Maintanance: Added stories for Assign attribute value modals and configuration for mocking GraphQL responses in Storybook.

- [#6341](https://github.com/saleor/saleor-dashboard/pull/6341) [`4a45b49`](https://github.com/saleor/saleor-dashboard/commit/4a45b494c655ddd0ebd8b9abd96ed4a34e5f8c21) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Added quick-paste of auth token to GraphQL Playground. Now to test queries as apps or specific users, you can paste bare token and full authorization header will be included.

## 3.22.31

### Patch Changes

- [#6310](https://github.com/saleor/saleor-dashboard/pull/6310) [`3693eb4`](https://github.com/saleor/saleor-dashboard/commit/3693eb47cfaaf03cce40208d6d3a6784d3c57ea3) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Updated @saleor/app-sdk and added support for `popupClose` action. Since this release, app will be able to close the popup via code

- [#6292](https://github.com/saleor/saleor-dashboard/pull/6292) [`0bdad3e`](https://github.com/saleor/saleor-dashboard/commit/0bdad3e686c7473eae5182336b0f49a910623e0e) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Fixed data-fetching in Order details page. Now when line items are changed, order summary (total, shipping price, etc.) are updated. Previously these values were not updated and displayed stale data.

- [#6292](https://github.com/saleor/saleor-dashboard/pull/6292) [`0bdad3e`](https://github.com/saleor/saleor-dashboard/commit/0bdad3e686c7473eae5182336b0f49a910623e0e) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Fixed e2e tests: updated assertions for notifications, datagrid, gift cards

## 3.22.30

### Patch Changes

- [#6305](https://github.com/saleor/saleor-dashboard/pull/6305) [`b53b0d7`](https://github.com/saleor/saleor-dashboard/commit/b53b0d7433eb423b6ba43d3e5dbc11d82cae3749) Thanks [@mirekm](https://github.com/mirekm)! - Fix broken pagination in simple product create mutation

- [#6306](https://github.com/saleor/saleor-dashboard/pull/6306) [`cf68ca5`](https://github.com/saleor/saleor-dashboard/commit/cf68ca54f43bae44749637a092d7792605420492) Thanks [@mirekm](https://github.com/mirekm)! - New products are now created unpublished, unavailable, and unlisted by default

## 3.22.29

### Patch Changes

- [#6284](https://github.com/saleor/saleor-dashboard/pull/6284) [`1a8279b`](https://github.com/saleor/saleor-dashboard/commit/1a8279b4f104220a6e0e79bcbccd8364cfa97831) Thanks [@xseignard](https://github.com/xseignard)! - Added metadata editing dialog for warehouses, allowing users to manage both public and private metadata through a dedicated modal accessible from the warehouse details page.

- [#6299](https://github.com/saleor/saleor-dashboard/pull/6299) [`cee423f`](https://github.com/saleor/saleor-dashboard/commit/cee423f98f59f76842482236e7d5bbab971222cf) Thanks [@mirekm](https://github.com/mirekm)! - Fix visibility of checkboxes (when focused) in DataGrid

- [#6300](https://github.com/saleor/saleor-dashboard/pull/6300) [`57e859a`](https://github.com/saleor/saleor-dashboard/commit/57e859a13b6b9e1670c358a9ad2291a63356c0f2) Thanks [@mirekm](https://github.com/mirekm)! - Fix variant form initialisation

- [#6285](https://github.com/saleor/saleor-dashboard/pull/6285) [`d65d066`](https://github.com/saleor/saleor-dashboard/commit/d65d06657d599c7a638c5b164acd3cb32fdee68f) Thanks [@mirekm](https://github.com/mirekm)! - Improved Variants Generator to support required non-selection attributes with a dedicated tab. Also added contextual tooltips explaining why generation is disabled.

- [#6301](https://github.com/saleor/saleor-dashboard/pull/6301) [`d097e37`](https://github.com/saleor/saleor-dashboard/commit/d097e370223d4088257994268409f4f863f8a09f) Thanks [@mirekm](https://github.com/mirekm)! - Attribute configuration: allow users to filter attribute values by slug or name when there are more than 5 values.

- [#6276](https://github.com/saleor/saleor-dashboard/pull/6276) [`d0f142e`](https://github.com/saleor/saleor-dashboard/commit/d0f142e077b11f44d18f8e7e40a621c2416d13cf) Thanks [@mirekm](https://github.com/mirekm)! - Improve table design consistency across the dashboard with unified styling for ResponsiveTable components, better loading states, and improved scroll behavior for variant navigation

## 3.22.28

### Patch Changes

- [#6266](https://github.com/saleor/saleor-dashboard/pull/6266) [`2983f07`](https://github.com/saleor/saleor-dashboard/commit/2983f07a934e00bdadfc535e6cf199f331a06b82) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Refactored filtering logic in Product selection modal, shouldn't introduce any changes for users

- [#6273](https://github.com/saleor/saleor-dashboard/pull/6273) [`c16e37a`](https://github.com/saleor/saleor-dashboard/commit/c16e37acfd15488b2b5be10d23dfc024021e9f92) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Update lodash version to `4.17.23`

- [#6257](https://github.com/saleor/saleor-dashboard/pull/6257) [`57cef53`](https://github.com/saleor/saleor-dashboard/commit/57cef5304ea96f4d178a790833998dd5d2e2ba8e) Thanks [@mirekm](https://github.com/mirekm)! - Added bulk variant generator - Quickly create all product variant combinations by selecting attribute values, with live preview, optional SKU/stock defaults, and automatic skipping of existing variants.

- [#6270](https://github.com/saleor/saleor-dashboard/pull/6270) [`a38274b`](https://github.com/saleor/saleor-dashboard/commit/a38274b84aca391954fef6eff3dea159ffa9a6a6) Thanks [@mirekm](https://github.com/mirekm)! - Improve variant attributes discoverability

  Added better messaging for variant attributes in both Product Type and Variant views.

- [#6278](https://github.com/saleor/saleor-dashboard/pull/6278) [`21eacd7`](https://github.com/saleor/saleor-dashboard/commit/21eacd7b71cc4a55db630b3a41d0d5fd9aaff719) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Fix combobox components in Attribute selection. "Add new value" option was added again for clear UX. New values are added when clicked "Save" in the form, like previously. Fixed fetching more items in the combobox: now when user enters a value in the input, we fetch options using input from user as `query` parameter.

- [#6274](https://github.com/saleor/saleor-dashboard/pull/6274) [`3b0ec28`](https://github.com/saleor/saleor-dashboard/commit/3b0ec2836a26c62bb4506da00e480059dee21e2f) Thanks [@mirekm](https://github.com/mirekm)! - Unify success notification messages
  - Pattern: {Entity} {action} - e.g., "Product updated", "Order cancelled"
  - Past tense - the action is complete
  - No filler words - avoid "successfully", "has been", "was"
  - Specific over generic - avoid commonMessages.savedChanges, use contextual messages
  - Compound actions use comma - "Products returned, refund granted"

- [#6277](https://github.com/saleor/saleor-dashboard/pull/6277) [`ace3e01`](https://github.com/saleor/saleor-dashboard/commit/ace3e019d06f3969963e9ffe5c5528258a630081) Thanks [@mirekm](https://github.com/mirekm)! - Redesigned product availability panel with built-in diagnostics. The new panel identifies configuration issues preventing purchase (missing prices, no stock, inactive channels) and includes a "Test" button to verify actual storefront visibility via the public API. Scheduling for publication and availability dates is now supported directly in the panel.

- [#6280](https://github.com/saleor/saleor-dashboard/pull/6280) [`b193657`](https://github.com/saleor/saleor-dashboard/commit/b193657a7314069805724da28ff5bcfbd4cfde70) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Remove intrusive error on app invalid action and rely on console logs for better debugging.

## 3.22.27

### Patch Changes

- [#6268](https://github.com/saleor/saleor-dashboard/pull/6268) [`6c31454`](https://github.com/saleor/saleor-dashboard/commit/6c31454b9433ac9dd040472e1fa911e30c98407d) Thanks [@mirekm](https://github.com/mirekm)! - Fix accidental exiting of GraphQL Playground by pressing Esc

- [#6267](https://github.com/saleor/saleor-dashboard/pull/6267) [`7eb3eaf`](https://github.com/saleor/saleor-dashboard/commit/7eb3eafb8731f90092df758809c2cad4d668eeb5) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Replaced custom Combobox component with one provided by MacawUI library. This solves bug with incorrect value rendering in Chromium 144

- [#6250](https://github.com/saleor/saleor-dashboard/pull/6250) [`472d0cd`](https://github.com/saleor/saleor-dashboard/commit/472d0cda9657aae75f017f4c0284d9e2b3473327) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Improved display of Links. Now they inherit size of the parent element, usually paragraph. Links should no longer looks strange within text blocks

- [#6265](https://github.com/saleor/saleor-dashboard/pull/6265) [`813da60`](https://github.com/saleor/saleor-dashboard/commit/813da6060d72e1a03cd3c832bc0c31568e32c0d0) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Updated pnpm settings to be more strict about installed packages: minimum age 24h, cannot use downgraded security (e.g. trusted publisher -> untrusted), dependencies resolving to git repo or tarball

- [#6207](https://github.com/saleor/saleor-dashboard/pull/6207) [`6b89f21`](https://github.com/saleor/saleor-dashboard/commit/6b89f217e19167b2e39befe11c3cf0990b5f6f79) Thanks [@mirekm](https://github.com/mirekm)! - Redesigned toast notifications for better user experience:
  - **Notifications now stack compactly** instead of flooding the screen
  - **Refined visual design** that's less disruptive and better aligned with the dashboard aesthetic
  - **Long messages expand on hover** with "Show more/less" toggle instead of being truncated
  - **Error notifications persist** until manually dismissed

  **Next up:** Refining notification message copy for clarity and consistency across the dashboard.

## 3.22.26

### Patch Changes

- [#6256](https://github.com/saleor/saleor-dashboard/pull/6256) [`8bed1a4`](https://github.com/saleor/saleor-dashboard/commit/8bed1a4f9ae61019b30eb3d4eae902a3de59f402) Thanks [@lkostrowski](https://github.com/lkostrowski)! - When reference-type attribute is being selected in product variant page, selected references should now properly display label instead of ID

- [#6262](https://github.com/saleor/saleor-dashboard/pull/6262) [`2934387`](https://github.com/saleor/saleor-dashboard/commit/2934387578c62d563a0c769b6c5a9716975f80ad) Thanks [@mirekm](https://github.com/mirekm)! - Fixed bug introduced in Chromium 144, where some of custom Comboboxes were broken and their value was reset to empty. Components were replaced with Combobox from Macaw UI

## 3.22.25

### Patch Changes

- [#6243](https://github.com/saleor/saleor-dashboard/pull/6243) [`1a04311`](https://github.com/saleor/saleor-dashboard/commit/1a043114383f657839a441e7a40b9c5f3a1e0965) Thanks [@NyanKiyoshi](https://github.com/NyanKiyoshi)! - Added support for [devcontainers] to facilitate local development.

  [devcontainers]: https://containers.dev/

- [#6226](https://github.com/saleor/saleor-dashboard/pull/6226) [`1486e12`](https://github.com/saleor/saleor-dashboard/commit/1486e1207176b6cf571a22c0c8b7c7146c9755c6) Thanks [@mirekm](https://github.com/mirekm)! - Prevent accidental variant metadata edits from order context

  Previously, users could edit product variant metadata directly from the Order Line Metadata dialog. This could be misleading because variant metadata is shared across all orders—changes made here would affect the variant globally, not just this order.

  Variant metadata is now displayed as read-only in the order context, with a direct link to the variant page for intentional edits.

- [#6242](https://github.com/saleor/saleor-dashboard/pull/6242) [`8a48470`](https://github.com/saleor/saleor-dashboard/commit/8a484705dbc85d93cc9aa05ba6924865c8b203cb) Thanks [@mirekm](https://github.com/mirekm)! - Redesigned "What's New" modal with timeline layout, type badges, and improved visual hierarchy for better readability.

- [#6255](https://github.com/saleor/saleor-dashboard/pull/6255) [`02197fd`](https://github.com/saleor/saleor-dashboard/commit/02197fd8a0eb6d9efbd0c904cb93c0a87ee0a557) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Fixed a bug that prevented creating refunds when clicked "Set maximal quantities" button on Order Return & replace page

- [#6251](https://github.com/saleor/saleor-dashboard/pull/6251) [`ce04007`](https://github.com/saleor/saleor-dashboard/commit/ce040077c57bf067e67132048d23387cde2a4d6d) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Fixed bold border in configuration page cards

- [#6200](https://github.com/saleor/saleor-dashboard/pull/6200) [`f824411`](https://github.com/saleor/saleor-dashboard/commit/f8244119445e5c969c91480893559cc19fe65cba) Thanks [@mirekm](https://github.com/mirekm)! - New capture dialog for capturing payments with support for:
  - Full and partial authorization status indicators
  - Custom capture amount input with currency-aware decimal validation
  - Order balance and transaction-level capture tracking
  - Outcome prediction showing resulting order status

- [#6245](https://github.com/saleor/saleor-dashboard/pull/6245) [`bc27812`](https://github.com/saleor/saleor-dashboard/commit/bc278122cb81f6303cdee816e35c929043209254) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Updated `qs`, and patched `posthog` to use packages without security warnings

## 3.22.24

### Patch Changes

- [#6238](https://github.com/saleor/saleor-dashboard/pull/6238) [`2b2311e`](https://github.com/saleor/saleor-dashboard/commit/2b2311eb2a0a98567efbbe5eef5c3daf66eeeb92) Thanks [@mirekm](https://github.com/mirekm)! - - Fixed broken question mark icons in Product Type variant attributes view

- [#6233](https://github.com/saleor/saleor-dashboard/pull/6233) [`e5b2c3c`](https://github.com/saleor/saleor-dashboard/commit/e5b2c3c634c2ea46a31b31d5291e03231e7ade1e) Thanks [@mirekm](https://github.com/mirekm)! - Fixed info icon sizing and alignment in Product details view attributes. Info icons are now consistently small (16px) and properly aligned with text labels.

- [#6225](https://github.com/saleor/saleor-dashboard/pull/6225) [`f7ef997`](https://github.com/saleor/saleor-dashboard/commit/f7ef9972d9f9ca69681aee68a4967ec5450958b7) Thanks [@mirekm](https://github.com/mirekm)! - Move Cloud env link to the Saleor Dashboard top-left logo hover state

- [#6165](https://github.com/saleor/saleor-dashboard/pull/6165) [`f5d17f8`](https://github.com/saleor/saleor-dashboard/commit/f5d17f8dc869e4925bd804a7c2ab8fae2e95f96c) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Modals for assigning Products will now show Filter button.
  This means that list in the modal can now be filtered based on the same conditions available on the Product list page.
  This new UI will also display constraints based on context (e.g. limited Product type filter, based on Reference Types config when assigning attribute).

## 3.22.23

### Patch Changes

- [#6227](https://github.com/saleor/saleor-dashboard/pull/6227) [`2db65da`](https://github.com/saleor/saleor-dashboard/commit/2db65da3b027e7736388fa60490532dbff4301e0) Thanks [@mirekm](https://github.com/mirekm)! - Added confirmation dialog ("Leave without saving changes?") to prevent accidental data loss when closing metadata dialogs with unsaved changes:
  - Order metadata dialog
  - Order fulfillment metadata dialog
  - Order line metadata dialog

- [#6224](https://github.com/saleor/saleor-dashboard/pull/6224) [`adb6abe`](https://github.com/saleor/saleor-dashboard/commit/adb6abe535a2967a191bac76c0940c6090e2e0dc) Thanks [@mirekm](https://github.com/mirekm)! - Use Tooltip component for info icon and dates in timeline

- [#6223](https://github.com/saleor/saleor-dashboard/pull/6223) [`974e327`](https://github.com/saleor/saleor-dashboard/commit/974e327f1ee52dacddd67b719b7f10007200d0b3) Thanks [@mirekm](https://github.com/mirekm)! - Fix removing saved filters

- [#6222](https://github.com/saleor/saleor-dashboard/pull/6222) [`f21cadf`](https://github.com/saleor/saleor-dashboard/commit/f21cadf38995c9901aa40bc4f654167c037e180b) Thanks [@mirekm](https://github.com/mirekm)! - Remove redundant elements in the main titles

## 3.22.22

### Patch Changes

- [#6217](https://github.com/saleor/saleor-dashboard/pull/6217) [`9670756`](https://github.com/saleor/saleor-dashboard/commit/967075601bedbd199715c746f3e953288d4965a8) Thanks [@mirekm](https://github.com/mirekm)! - Transaction actions: The Capture button is now directly visible on transaction cards for quicker access, while destructive actions like Cancel remain safely tucked in the menu.

- [#6178](https://github.com/saleor/saleor-dashboard/pull/6178) [`33d7143`](https://github.com/saleor/saleor-dashboard/commit/33d71430997daeef3b408c9f75e2d8dfa1567f12) Thanks [@mirekm](https://github.com/mirekm)! - Update order Transactions cards

- [#6189](https://github.com/saleor/saleor-dashboard/pull/6189) [`0e6e5a3`](https://github.com/saleor/saleor-dashboard/commit/0e6e5a3f7e0da47415d79a17f1423c9939d6f42c) Thanks [@mirekm](https://github.com/mirekm)! - Introduced a redesigned "Order summary" section that unifies order details and payment information across all order types, including Drafts and Unconfirmed orders. The updated "Order value" breakdown now clearly separates subtotal, taxes, discounts, and shipping. Additionally, a new "Payments summary" section has been added, featuring a dedicated "no data" state when no payments are present.

- [#6213](https://github.com/saleor/saleor-dashboard/pull/6213) [`e2ca67b`](https://github.com/saleor/saleor-dashboard/commit/e2ca67b92745fedc62ad704fd66b0f3702a3d8dd) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Fixed redirection between Customer Details -> See all orders to Orders List (which this customer selected). Now filter is properly set on the URL and only relevant orders are displayed

## 3.22.21

### Patch Changes

- [#6196](https://github.com/saleor/saleor-dashboard/pull/6196) [`5f22cde`](https://github.com/saleor/saleor-dashboard/commit/5f22cded76c3736447dae769b6564fe6fd05e4d9) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Invalid event sent from app to dashboard will not throw anymore, but gracefully show notification

- [#6150](https://github.com/saleor/saleor-dashboard/pull/6150) [`e0f798c`](https://github.com/saleor/saleor-dashboard/commit/e0f798cf09b7fb761febdc57b653155644fe6329) Thanks [@mirekm](https://github.com/mirekm)! - Fix and redesign Order history

- [#6205](https://github.com/saleor/saleor-dashboard/pull/6205) [`fb40e57`](https://github.com/saleor/saleor-dashboard/commit/fb40e57ab0c6a5842c87fbfe03c3e2486019e3b9) Thanks [@mirekm](https://github.com/mirekm)! - Fix main title overflow

- [#6168](https://github.com/saleor/saleor-dashboard/pull/6168) [`c366f94`](https://github.com/saleor/saleor-dashboard/commit/c366f9487affa218ab04ff0b9c0ebfae54a585ed) Thanks [@mirekm](https://github.com/mirekm)! - Cleanup order's Customer Details and Addresses sections

- [#6204](https://github.com/saleor/saleor-dashboard/pull/6204) [`dacee7d`](https://github.com/saleor/saleor-dashboard/commit/dacee7de926a45c8c8ee91284882e18fcdb35fae) Thanks [@mirekm](https://github.com/mirekm)! - New label for ConfirmButton error state

- [#6196](https://github.com/saleor/saleor-dashboard/pull/6196) [`5f22cde`](https://github.com/saleor/saleor-dashboard/commit/5f22cded76c3736447dae769b6564fe6fd05e4d9) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Clipboard operations no longer crash the website if browser permissions are not enabled

- [#6206](https://github.com/saleor/saleor-dashboard/pull/6206) [`a0893de`](https://github.com/saleor/saleor-dashboard/commit/a0893deb0a4b78ba4c69a6a220d48049ac4af78c) Thanks [@mirekm](https://github.com/mirekm)! - Improve icons color consistency with timeline

- [#6208](https://github.com/saleor/saleor-dashboard/pull/6208) [`bcb4854`](https://github.com/saleor/saleor-dashboard/commit/bcb485469a0327a518deb3d91dfb68b8501c8e61) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Added UI to control "automatic checkout completion" from the dashboard settings page. What previously was allowed only via graphQL, now can be controlled easily by staff.

## 3.22.20

### Patch Changes

- [#6195](https://github.com/saleor/saleor-dashboard/pull/6195) [`c9ed5f7`](https://github.com/saleor/saleor-dashboard/commit/c9ed5f7d2ac75658218fc860ef4886bd9de95fe1) Thanks [@wcislo-saleor](https://github.com/wcislo-saleor)! - Added "Allow legacy gift card use" flag to Channel configuration

- [#6188](https://github.com/saleor/saleor-dashboard/pull/6188) [`7833de8`](https://github.com/saleor/saleor-dashboard/commit/7833de81a816fc4298fd73be58d5377de2b98a00) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Updated `@saleor/macaw-ui-next` to `1.4.1`. This version should resolve potential issues with React 18+ timing crashes

## 3.22.19

### Patch Changes

- [#6172](https://github.com/saleor/saleor-dashboard/pull/6172) [`5373ccd`](https://github.com/saleor/saleor-dashboard/commit/5373ccdb3571e1294008224cf911bcd79f1b56b7) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Update app-sdk package to 1.4.0

- [#6177](https://github.com/saleor/saleor-dashboard/pull/6177) [`cdf694d`](https://github.com/saleor/saleor-dashboard/commit/cdf694dd083de4a12ebbe67b86ba56ed50f7d79a) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Changed Address component to use modern MacawUI text inputs

- [#6174](https://github.com/saleor/saleor-dashboard/pull/6174) [`dbe7709`](https://github.com/saleor/saleor-dashboard/commit/dbe7709d27287a9280119073f1d4217c15a39210) Thanks [@witoszekdev](https://github.com/witoszekdev)! - Updated `@saleor/app-sdk` to `1.5.0`.
  `next` should no longer be automatically installed with Saleor Dashboard. Previously this package installed into `node_modules`, even though it wasn't used.

- [#6185](https://github.com/saleor/saleor-dashboard/pull/6185) [`995c330`](https://github.com/saleor/saleor-dashboard/commit/995c330af5564c110d6226239289ece3281a8b43) Thanks [@mirekm](https://github.com/mirekm)! - Improve replaced icons visual consistency

- [#6180](https://github.com/saleor/saleor-dashboard/pull/6180) [`4de2650`](https://github.com/saleor/saleor-dashboard/commit/4de265041e98106868c79b2b86113fdbf517704e) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Fixed attribute tooltip icon size

- [#6179](https://github.com/saleor/saleor-dashboard/pull/6179) [`8584e5f`](https://github.com/saleor/saleor-dashboard/commit/8584e5fee1adff5efb930dc1ebc9a9c3fb967c4d) Thanks [@lkostrowski](https://github.com/lkostrowski)! - Icons overhaul part 1: Removed some old icons with fresh Lucide icons

- [#6186](https://github.com/saleor/saleor-dashboard/pull/6186) [`adddfde`](https://github.com/saleor/saleor-dashboard/commit/adddfde2b97f31e7a7b0b0f63fd4a684dcbdcd47) Thanks [@mirekm](https://github.com/mirekm)! - Fix sizing of the main datagrid based views

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
