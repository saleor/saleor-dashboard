import { defineMessages, type IntlShape, type MessageDescriptor } from "react-intl";

import { type Ripple } from "./types";

const rippleContentMessages: Partial<Record<string, MessageDescriptor>> = defineMessages({
  "channel-create-setup-flow.oneLiner": {
    id: "tmH+j4",
    defaultMessage: "Faster channel setup",
  },
  "channel-create-setup-flow.contextual": {
    id: "3r7mVc",
    defaultMessage:
      "Create a channel—like a market—with name, country, and currency, then set up warehouses and shipping without leaving the page.",
  },
  "channel-create-setup-flow.global": {
    id: "uyr62m",
    defaultMessage:
      "Adding a channel is simpler: pick where you sell, we apply standard order defaults, then guide you to set up stock and shipping in place.",
  },
  "checkout-autocomplete-settings.oneLiner": {
    id: "ywC44O",
    defaultMessage: "Checkout autocomplete feature can be now configured in settings",
  },
  "checkout-autocomplete-settings.contextual": {
    id: "RdyYLj",
    defaultMessage: "You can configure checkouts to automatically complete when paid",
  },
  "checkout-autocomplete-settings.global": {
    id: "Nx3wNS",
    defaultMessage:
      "When checkouts are paid, but not completed by the customer, they can be automatically completed by Saleor. Visit settings to configure this behavior.",
  },
  "translation-detail-refresh.oneLiner": {
    id: "QAGO9M",
    defaultMessage: "Bulk Translation Editing",
  },
  "translation-detail-refresh.contextual": {
    id: "9sUHJu",
    defaultMessage:
      "Turn on bulk edit to translate several fields at once, then save everything with one click.",
  },
  "translation-detail-refresh.global": {
    id: "dh49li",
    defaultMessage:
      "Translation pages now show your progress and group fields into clear sections. Use bulk edit to update multiple fields in one pass, and see at a glance which fields still need a translation before you move on to the next item.",
  },
  "slug-translation.oneLiner": {
    id: "EijIiY",
    defaultMessage: "Slug translations",
  },
  "slug-translation.contextual": {
    id: "t3LO8M",
    defaultMessage:
      "Translate slugs for products, categories, collections, and pages in each supported language.",
  },
  "slug-translation.global": {
    id: "KhrG7p",
    defaultMessage:
      "Translation pages for products, categories, collections, and pages now include slug fields, so each supported language can have its own localized slug.",
  },
  "expandable-subcategories.oneLiner": {
    id: "MDRH3X",
    defaultMessage: "Expandable subcategories in category list",
  },
  "expandable-subcategories.contextual": {
    id: "Rvq/KH",
    defaultMessage:
      "Expand category rows to browse subcategories in place. Large category trees load more children as you go.",
  },
  "expandable-subcategories.global": {
    id: "eKVJoX",
    defaultMessage:
      "The categories list now supports expandable rows with lazy loading for child categories. You can review nested structures without leaving the list.",
  },
  "draft-order-metadata-header.oneLiner": {
    id: "ZvQOTe",
    defaultMessage: "Draft order metadata in header",
  },
  "draft-order-metadata-header.contextual": {
    id: "St9OID",
    defaultMessage:
      "Draft order metadata is now edited from this button, which opens a dedicated dialog.",
  },
  "draft-order-metadata-header.global": {
    id: "u90dIU",
    defaultMessage:
      "Draft order metadata is now available from a header button that opens a dedicated dialog, matching confirmed orders and other detail pages. Edit public and private metadata without leaving the draft order view.",
  },
  "order-line-matrix-default-view.oneLiner": {
    id: "XVfrcx",
    defaultMessage: "Work order lines in one view",
  },
  "order-line-price-breakdown.oneLiner": {
    id: "ag5NZp",
    defaultMessage: "See how a line price was calculated",
  },
  "order-line-price-breakdown.contextual": {
    id: "BILJJY",
    defaultMessage: "Click a discounted unit price or line total to open a step-by-step breakdown.",
  },
  "order-line-price-breakdown.global": {
    id: "nCarrl",
    defaultMessage:
      "On confirmed orders, click a discounted unit price or line total to see a read-only breakdown of how it was calculated — promotions, vouchers, and manual or order-wide discounts.",
  },
  "order-line-discount-discoverability.oneLiner": {
    id: "3GrSwn",
    defaultMessage: "Line discounts are easier to find",
  },
  "order-line-discount-discoverability.contextual": {
    id: "bTv3zn",
    defaultMessage:
      "Use this row menu to add or edit line discounts with one unified flow in Draft and Unconfirmed orders.",
  },
  "order-line-discount-discoverability.global": {
    id: "g9R0YI",
    defaultMessage:
      "Order-level and order-line discount flows now share the same UX in Draft and Unconfirmed orders. Access Add/Edit order line discount now also from the order row menu.",
  },
  "order-metadata.oneLiner": {
    id: "h/K/eJ",
    defaultMessage: "Order metadata in header",
  },
  "order-metadata.contextual": {
    id: "heCNUE",
    defaultMessage:
      "Order metadata is now edited from this button, which opens a dedicated dialog.",
  },
  "order-metadata.global": {
    id: "MlZQAi",
    defaultMessage:
      "Order metadata has moved from the order details page into a header button that opens a dedicated dialog. Public and private metadata are easier to find and edit.",
  },
  "order-channel-in-header.oneLiner": {
    id: "mUxf+3",
    defaultMessage: "Order Channel in Header",
  },
  "order-channel-in-header.contextual": {
    id: "1k/ZmV",
    defaultMessage:
      "Sales channel now appears in the order header. Click it to view other orders from the same channel.",
  },
  "order-channel-in-header.global": {
    id: "6tKYlp",
    defaultMessage:
      "Sales channel is now shown directly in the order header, next to the order date and status. Click the channel to open the orders list filtered to the same channel, instead of jumping to channel settings.",
  },
  "new-return-reasons.oneLiner": {
    id: "ohqgoI",
    defaultMessage: "Structured return reasons",
  },
  "new-return-reasons.contextual": {
    id: "s+aPOD",
    defaultMessage: "Return reasons are now more powerful with pre-defined choices",
  },
  "new-return-reasons.global": {
    id: "BIcMpW",
    defaultMessage:
      "Return reasons are now more powerful. You can add a reason to a return, both overall and per line. Additionally, you can configure returns to use structured data to enforce specific reasons to be provided.",
  },
  "new-refund-reasons.oneLiner": {
    id: "CvjddY",
    defaultMessage: "Structured refund reasons",
  },
  "new-refund-reasons.contextual": {
    id: "oMMMs1",
    defaultMessage: "Refund reasons are now more powerful with pre-defined choices",
  },
  "refreshed-order-sections.oneLiner": {
    id: "BvhbSc",
    defaultMessage: "Refreshed Order Sections",
  },
  "refreshed-order-sections.contextual": {
    id: "3rVIqM",
    defaultMessage: "We have refreshed Order Summary, Transactions and History sections.",
  },
  "refreshed-order-sections.global": {
    id: "OAwV3I",
    defaultMessage:
      "We redesigned the Order page look - welcome the refreshed Order Summary, Transactions, and History sections with improved data visualization and faster loading times.",
  },
  "staff-customer-profiles.oneLiner": {
    id: "LZu801",
    defaultMessage: "Staff Customer Profiles",
  },
  "staff-customer-profiles.contextual": {
    id: "MKUZi0",
    defaultMessage:
      "Staff members who have placed orders are now easier to spot from the staff list.",
  },
  "staff-customer-profiles.global": {
    id: "Om0O53",
    defaultMessage:
      "Staff members who have placed orders are now marked on the staff list. Their staff profile also links directly to the matching customer profile, so you can review order history and customer details faster.",
  },
  "navigation-pins.oneLiner": {
    id: "Ck2Lr8",
    defaultMessage: "Model types can be pinned to navigation",
  },
  "navigation-pins.contextual": {
    id: "r3HcxI",
    defaultMessage: "You can pin this model to navigation for quicker access.",
  },
  "navigation-pins.global": {
    id: "kX7OsX",
    defaultMessage:
      "Model types can be pinned to the sidebar as shortcuts that reopen the models list filtered to that type. Pins land in the Favorites section or an existing section, up to three per section. Your own pins can be managed in account settings, or removed by hovering the sidebar row; users with settings permission can also pin for the whole organization.",
  },
  "staff-order-alert-recipients.oneLiner": {
    id: "eMY0GB",
    defaultMessage: "New order alerts",
  },
  "staff-order-alert-recipients.contextual": {
    id: "OS1713",
    defaultMessage: "Choose which staff members get an email when a customer places an order.",
  },
  "staff-order-alert-recipients.global": {
    id: "lSJoEq",
    defaultMessage:
      "Staff emails now include a New order alerts list. Assign active staff members so they are emailed when a customer completes checkout. Draft orders you complete in the Dashboard are not included.",
  },
  "cloud-env-link-logo.oneLiner": {
    id: "HfHSzO",
    defaultMessage: "Saleor Cloud link moved to logo area",
  },
  "cloud-env-link-logo.contextual": {
    id: "G5b94M",
    defaultMessage: "The link to Saleor Cloud has moved here. Click the cloud icon to access it.",
  },
  "cloud-env-link-logo.global": {
    id: "qPFfgN",
    defaultMessage:
      "The Saleor Cloud environment link has been moved from the bottom of the navigation to the logo area at the top. Hover over the logo to reveal the cloud icon and access your environment.",
  },
  "global-feedback-button.oneLiner": {
    id: "erboqG",
    defaultMessage: "Send feedback from anywhere",
  },
  "global-feedback-button.contextual": {
    id: "Q+K8iP",
    defaultMessage: "Share feedback with us from anywhere in the Dashboard.",
  },
  "global-feedback-button.global": {
    id: "+d3Wwy",
    defaultMessage:
      "Use the new Send feedback button next to your account menu to share feedback from anywhere in the Dashboard.",
  },
  "type-page-create-attribute.oneLiner": {
    id: "wDgkMm",
    defaultMessage: "Create attributes on type pages",
  },
  "type-page-create-attribute.global": {
    id: "SJJXq7",
    defaultMessage:
      "On product and model type pages, open the menu beside Assign attribute and choose Create attribute. Complete the short wizard and the new attribute is created and linked to that type automatically—no trip to the Attributes section required.",
  },
  "attribute-values-search.oneLiner": {
    id: "IXeGu6",
    defaultMessage: "Search Attribute Values",
  },
  "attribute-values-search.contextual": {
    id: "DiU36I",
    defaultMessage: "Quickly find attribute values by name.",
  },
  "attribute-values-search.global": {
    id: "iDqxDQ",
    defaultMessage:
      "You can now search through attribute values directly from the attribute details page. Find any value instantly, even in attributes with hundreds of options.",
  },
  "attribute-list-group-by-type.oneLiner": {
    id: "8SCelI",
    defaultMessage: "Group attributes by type",
  },
  "attribute-list-group-by-type.global": {
    id: "9cyxYg",
    defaultMessage:
      "On product and model attribute lists, attributes are grouped by type with tabs for each type. Filters and search stay above the tabs. When a single type tab is active, you can unassign selected attributes from that type without deleting them shop-wide. Turn off Group by type in the view menu next to Create attribute if you prefer the flat list.",
  },
  "attribute-view-overhaul.oneLiner": {
    id: "AlOgsw",
    defaultMessage: "Attribute view overhaul for consistency",
  },
  "attribute-view-overhaul.contextual": {
    id: "Be7leT",
    defaultMessage:
      "Attribute metadata is now edited from this button, which opens a dedicated dialog.",
  },
  "attribute-view-overhaul.global": {
    id: "TJTeol",
    defaultMessage:
      "The attribute detail page now follows the same patterns as other entity views. Metadata is edited from the header, the attribute class appears beside the title, and layout is aligned for a more consistent experience.",
  },
  "app-problems.oneLiner": {
    id: "vuAJEP",
    defaultMessage: "App problems visibility",
  },
  "app-problems.contextual": {
    id: "emkhGK",
    defaultMessage: "You can now see issues with apps directly in the extensions list.",
  },
  "app-problems.global": {
    id: "yZZwK5",
    defaultMessage:
      "App problems are now visible in the installed extensions page. When an app has issues, you will see a badge indicating the number of problems and their severity.",
  },
  "introducing-ripples.oneLiner": {
    id: "IN5RFa",
    defaultMessage: "Introducing hints about latest changes",
  },
  "introducing-ripples.contextual": {
    id: "QENNoY",
    defaultMessage:
      "We are now notifying about new changes in Saleor. You can find all of them here.",
  },
  "pages-are-models.oneLiner": {
    id: "MZ77ap",
    defaultMessage: "Pages are now called Models",
  },
  "pages-are-models.contextual": {
    id: "MZ77ap",
    defaultMessage: "Pages are now called Models",
  },
  "pages-are-models.global": {
    id: "VE3U8O",
    defaultMessage:
      "We have renamed Pages to Models. API still uses the old naming, but it will change in the future.",
  },
  "model-metadata-header.oneLiner": {
    id: "aTQVwU",
    defaultMessage: "Model metadata in header",
  },
  "model-metadata-header.contextual": {
    id: "RmofY/",
    defaultMessage:
      "Model metadata is now edited from this button, which opens a dedicated dialog.",
  },
  "model-metadata-header.global": {
    id: "SScnjl",
    defaultMessage:
      "Model metadata has moved from the bottom of the model page into a header button that opens a dedicated dialog. Public and private metadata are easier to find and edit without scrolling past other sections.",
  },
  "grouped-model-type-tabs.oneLiner": {
    id: "7VlCMe",
    defaultMessage: "Model type tabs can group related types",
  },
  "model-type-tabs.oneLiner": {
    id: "wz4hd/",
    defaultMessage: "Model filters are exposed as tabs",
  },
  "model-type-tabs.contextual": {
    id: "YpDLr7",
    defaultMessage: "Filter by model type using the tabs above the list, for the quicker access.",
  },
  "model-type-tabs.global": {
    id: "nrh+dt",
    defaultMessage:
      "The Models list now organizes content by model type using tabs instead of a filter dropdown. 'Create' button creates model from the active context",
  },
  "shipping-rate-editor-refresh.oneLiner": {
    id: "mQ1TQ7",
    defaultMessage: "Shipping rates are easier to manage",
  },
  "shipping-rate-editor-refresh.contextual": {
    id: "TUbkzP",
    defaultMessage:
      "Each method shows which channels have pricing. Open one to set per-channel prices, availability, and postal codes.",
  },
  "shipping-rate-editor-refresh.global": {
    id: "rtbbfy",
    defaultMessage:
      "The shipping rate editor now shows per-channel pricing inline, a channel availability summary in the sidebar, and clearer postal code controls. Shipping method metadata is in the header, and shipping zones on channel settings are clickable links.",
  },
  "product-metadata-header.oneLiner": {
    id: "kf8d+6",
    defaultMessage: "Product metadata in header",
  },
  "product-metadata-header.contextual": {
    id: "dTGFXs",
    defaultMessage:
      "Product metadata is now edited from this button, which opens a dedicated dialog.",
  },
  "product-metadata-header.global": {
    id: "b7JzT0",
    defaultMessage:
      "Product metadata has moved from the bottom of the product page into a header button that opens a dedicated dialog. Public and private metadata are easier to find and edit without scrolling past other sections.",
  },
  "product-availability-diagnostics.oneLiner": {
    id: "qoXt8x",
    defaultMessage: "Redesigned Product Availability",
  },
  "product-availability-diagnostics.contextual": {
    id: "zIJ3qi",
    defaultMessage:
      "Redesigned publishing and purchasability management with new diagnostics to identify why products may not be purchasable.",
  },
  "product-availability-diagnostics.global": {
    id: "YEvzak",
    defaultMessage:
      "The Product Availability card has been completely redesigned for better UX. It now offers streamlined publishing and purchasability management, real-time diagnostics that detect issues preventing products from being purchased, public API verification, and actionable recommendations to fix configuration problems.",
  },
  "product-variant-metadata-header.oneLiner": {
    id: "8WFTrY",
    defaultMessage: "Variant metadata in header",
  },
  "product-variant-metadata-header.contextual": {
    id: "aiccwf",
    defaultMessage:
      "Variant metadata is now edited from this button, which opens a dedicated dialog.",
  },
  "product-variant-metadata-header.global": {
    id: "+Wp3YG",
    defaultMessage:
      "Variant metadata has moved from the variant details page into a header button that opens a dedicated dialog. You can manage public and private metadata without scrolling past inventory and attribute sections.",
  },
  "product-media-metadata-header.oneLiner": {
    id: "OIbajc",
    defaultMessage: "Media metadata in header",
  },
  "product-media-metadata-header.contextual": {
    id: "CP5Lju",
    defaultMessage:
      "Media metadata is now edited from this button, which opens a dedicated dialog.",
  },
  "product-media-metadata-header.global": {
    id: "ofkXTF",
    defaultMessage:
      "Product media items now have a header metadata button on the edit media page. You can manage public and private metadata for each image or video without leaving the preview.",
  },
  "bulk-variant-generator.oneLiner": {
    id: "/nkC2d",
    defaultMessage: "Bulk Variant Generator",
  },
  "bulk-variant-generator.contextual": {
    id: "G9per5",
    defaultMessage:
      "Quickly create all product variant combinations by selecting attribute values.",
  },
  "bulk-variant-generator.global": {
    id: "13cYH9",
    defaultMessage:
      "Quickly create all product variant combinations by selecting attribute values, with live preview, optional SKU/stock defaults, and automatic skipping of existing variants.",
  },
  "product-type-in-header.oneLiner": {
    id: "JnwHzA",
    defaultMessage: "Product type in header",
  },
  "product-type-in-header.contextual": {
    id: "JQh/NF",
    defaultMessage:
      "Product type is now next to the product name. Click it to see all products of this type, or use More actions for type settings.",
  },
  "product-type-in-header.global": {
    id: "1oTzyN",
    defaultMessage:
      "On the product details page, the product type appears in the header beside the product name—similar to how orders show their sales channel. Click the type to jump to your product list filtered to that type. To change attributes, variants, or other type options, choose Product type settings from the More actions menu at the top of the page.",
  },
  "warehouse-metadata.oneLiner": {
    id: "JJ4SyK",
    defaultMessage: "Warehouse metadata editing",
  },
  "warehouse-metadata.contextual": {
    id: "zYELfi",
    defaultMessage:
      "Warehouse metadata can now be edited via this button which opens a dedicated dialog",
  },
  "warehouse-metadata.global": {
    id: "HFTU0l",
    defaultMessage:
      "You can now edit warehouse metadata through a dedicated dialog, allowing you to manage both public and private metadata for your warehouses.",
  },
  "customer-types.oneLiner": {
    id: "X/5wRC",
    defaultMessage: "Customer types",
  },
  "customer-types.contextual": {
    id: "kRP0yT",
    defaultMessage:
      "Customers can now have a type, like B2B or Wholesale, with its own attributes. Set up types in Configuration → Customer types.",
  },
  "customer-types.global": {
    id: "bEFTj4",
    defaultMessage:
      "You can now group customers into types — B2B, Wholesale, VIP, whatever fits your business. Each type defines its own attributes, so you can record details like tax ID or account manager on the customer profile instead of keeping them in metadata or notes. Create and edit types in Configuration → Customer types, then pick a type on any customer profile. The customer list has a tab per type, and the type badge in the profile header opens that tab.",
  },
  "saleor-pulse.oneLiner": {
    id: "flTXt9",
    defaultMessage: "Saleor Pulse",
  },
  "saleor-pulse.contextual": {
    id: "vZ7uch",
    defaultMessage:
      "See real-time store analytics on your homepage — revenue, orders, and operations.",
  },
  "saleor-pulse.global": {
    id: "nuuKRi",
    defaultMessage:
      "Saleor Pulse brings real-time analytics into the Dashboard homepage: commercial performance, operational health, and product-level context without a separate BI project.",
  },
  "home-widgets.oneLiner": {
    id: "M7xhnf",
    defaultMessage: "Home Page overhauled",
  },
  "home-widgets.contextual": {
    id: "1IfSYp",
    defaultMessage: "New Home Page is now home for Apps.",
  },
  "home-widgets.global": {
    id: "lj95iG",
    defaultMessage:
      "Home Page now mounts Apps, either Saleor official ones or external. Apps can be mounted in fullscreen mode or a widgets grid.",
  },
  "new-customers-view.oneLiner": {
    id: "aaflOx",
    defaultMessage: "New Customers View",
  },
  "new-customers-view.contextual": {
    id: "A68crQ",
    defaultMessage:
      "Customer profiles have a refreshed view that makes key customer details easier to scan.",
  },
  "new-customers-view.global": {
    id: "dWsaoI",
    defaultMessage:
      "Customer profiles have a refreshed view that makes customer details easier to scan from the Customers section or directly from an order. Use it to review customer information, addresses, order context, and related customer data faster.",
  },
  "customer-overview.oneLiner": {
    id: "aldRM9",
    defaultMessage: "Customer Overview",
  },
  "customer-overview.contextual": {
    id: "XSEgwz",
    defaultMessage:
      "Customer profiles now start with channel-scoped order KPIs: net product sales, shipping and refunds shown separately, plus login history.",
  },
  "customer-overview.global": {
    id: "M0/qzp",
    defaultMessage:
      "Customer profiles now include a compact overview with total orders, last login, recent net sales, and average order value. Stats are scoped per channel — use the channel selector when a customer shops in multiple stores. Net sales exclude shipping and tax; hover the amount for shipping and refund details from the same orders.",
  },
});

/** Localize registered release hints only; keep their storage identities unchanged. */
export const localizeRippleContent = (ripple: Ripple, intl: IntlShape): Ripple["content"] => {
  const content = { ...ripple.content };

  for (const field of ["oneLiner", "contextual", "global"] as const) {
    const message = rippleContentMessages[`${ripple.ID}.${field}`];

    if (
      message &&
      typeof content[field] === "string" &&
      content[field] === message.defaultMessage
    ) {
      content[field] = intl.formatMessage(message);
    }
  }

  return content;
};
