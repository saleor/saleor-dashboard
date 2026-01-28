import { defineMessages } from "react-intl";

export const messages = defineMessages({
  // Card title
  title: {
    id: "O6C2jX",
    defaultMessage: "Availability Doctor",
    description: "Product doctor card title",
  },
  noIssues: {
    id: "3fBg0U",
    defaultMessage: "No availability issues detected",
    description: "Message when no issues found",
  },
  issuesFound: {
    id: "aecovk",
    defaultMessage:
      "{errorCount, plural, =0 {} one {# error} other {# errors}}{hasWarnings, select, true {, } other {}}{warningCount, plural, =0 {} one {# warning} other {# warnings}}",
    description: "Summary of issues found",
  },

  // Channel inactive
  channelInactive: {
    id: "pCjZEC",
    defaultMessage: 'Channel "{channelName}" is inactive',
    description: "Error when channel is not active",
  },
  channelInactiveDescription: {
    id: "gKary4",
    defaultMessage:
      "This channel is not active. Products cannot be purchased until the channel is activated.",
    description: "Description for inactive channel error",
  },

  // No variants (global - product level)
  noVariants: {
    id: "nfgSR+",
    defaultMessage: "No variants created",
    description: "Error when product has no variants",
  },
  noVariantsDescription: {
    id: "i0ou1B",
    defaultMessage:
      "This product has no variants. Create at least one variant before customers can purchase.",
    description: "Description for no variants error",
  },

  // No variant in channel (channel-specific)
  noVariantInChannel: {
    id: "msbMCT",
    defaultMessage: "No variant listed in this channel",
    description: "Error when no variant is in channel",
  },
  noVariantInChannelDescription: {
    id: "5wktck",
    defaultMessage:
      "Variants exist but none are available in this channel. Add variant channel listings.",
    description: "Description for no variant in channel error",
  },

  // No variant priced
  noVariantPriced: {
    id: "6KqwHF",
    defaultMessage: 'No variant has a price in "{channelName}"',
    description: "Error when no variant has price set",
  },
  noVariantPricedDescription: {
    id: "45MmHa",
    defaultMessage:
      "Set a price for at least one variant in this channel. Price can be 0 for free products.",
    description: "Description for no variant priced error",
  },

  // No warehouses
  noWarehouses: {
    id: "gmU4T7",
    defaultMessage: 'No warehouses assigned to "{channelName}"',
    description: "Warning when channel has no warehouses",
  },
  noWarehousesDescription: {
    id: "T7r26L",
    defaultMessage: "Products in this channel cannot be fulfilled without warehouses.",
    description: "Description for no warehouses warning",
  },

  // No shipping zones
  noShippingZones: {
    id: "8W1v0N",
    defaultMessage: 'No shipping zones for "{channelName}"',
    description: "Warning when channel has no shipping zones",
  },
  noShippingZonesDescription: {
    id: "EAKKtg",
    defaultMessage:
      "Customers cannot checkout without shipping methods. Add shipping zones to this channel.",
    description: "Description for no shipping zones warning",
  },

  // No stock
  noStock: {
    id: "lgateT",
    defaultMessage: 'No stock in warehouses for "{channelName}"',
    description: "Warning when no stock in channel warehouses",
  },
  noStockDescription: {
    id: "n51nG4",
    defaultMessage: "Add stock to at least one warehouse assigned to this channel.",
    description: "Description for no stock warning",
  },

  // Warehouse not in shipping zone
  warehouseNotInZone: {
    id: "ESft7g",
    defaultMessage: 'Stock unreachable in "{channelName}"',
    description: "Warning when warehouse with stock not in shipping zone",
  },
  warehouseNotInZoneDescription: {
    id: "QfK+5Q",
    defaultMessage: "Warehouses with stock are not assigned to any shipping zone in this channel.",
    description: "Description for warehouse not in zone warning",
  },

  // Actions
  configureChannel: {
    id: "zhG4HQ",
    defaultMessage: "Configure channel",
    description: "Action to configure channel",
  },

  // Summary section
  summaryTitle: {
    id: "aAhfh6",
    defaultMessage: "Configuration Summary",
    description: "Title for configuration summary section",
  },
  warehousesCount: {
    id: "MOQWz8",
    defaultMessage: "{count, plural, =0 {No warehouses} one {# warehouse} other {# warehouses}}",
    description: "Number of warehouses",
  },
  shippingZonesCount: {
    id: "gG4YAW",
    defaultMessage:
      "{count, plural, =0 {No shipping zones} one {# shipping zone} other {# shipping zones}}",
    description: "Number of shipping zones",
  },
  countriesCovered: {
    id: "gHB1Wx",
    defaultMessage: "{count, plural, one {# country} other {# countries}} covered",
    description: "Number of countries covered by shipping",
  },
  countriesAndTerritoriesCovered: {
    id: "qLaeSH",
    defaultMessage: "{count} countries/territories covered",
    description: "Number of countries and territories covered by shipping",
  },
  allCountriesCovered: {
    id: "0QE6RR",
    defaultMessage: "All countries covered",
    description: "Message when all countries are covered",
  },
  noWarehousesConfigured: {
    id: "1ncKJy",
    defaultMessage: "No warehouses",
    description: "Warning when no warehouses configured",
  },
  noShippingZonesConfigured: {
    id: "oEFc87",
    defaultMessage: "No shipping zones",
    description: "Warning when no shipping zones configured",
  },
  noCountriesCovered: {
    id: "Qhb89u",
    defaultMessage: "No countries covered",
    description: "Warning when no countries covered",
  },

  // Visible in listings descriptions
  visibleInListingsOnDescription: {
    id: "mvDujQ",
    defaultMessage: "Appears in category pages, collections, and search results.",
    description: "Description when product is visible in listings",
  },
  visibleInListingsOffTitle: {
    id: "N1Z/Er",
    defaultMessage: "Hidden from browsing.",
    description: "Title when product is not visible in listings",
  },
  visibleInListingsOffDescription: {
    id: "roQH8c",
    defaultMessage: "Customers can still access it via direct link.",
    description: "Description when product is not visible in listings",
  },

  // Permission-related messages
  limitedDiagnostics: {
    id: "LWc61W",
    defaultMessage: "Limited diagnostics",
    description: "Title when diagnostics are limited due to permissions",
  },
  limitedDiagnosticsDescription: {
    id: "Ur9yW3",
    defaultMessage: "Full availability diagnostics require additional permissions: {permissions}",
    description: "Description explaining which permissions are needed",
  },
  unknownValue: {
    id: "pMAlSC",
    defaultMessage: "Unknown",
    description: "Shown when a value cannot be determined due to permissions",
  },
  warehousesUnknown: {
    id: "cErw9O",
    defaultMessage: "Warehouses: Unknown",
    description: "Shown when warehouse count cannot be determined",
  },
  shippingZonesUnknown: {
    id: "j/shmR",
    defaultMessage: "Shipping zones: Unknown",
    description: "Shown when shipping zone count cannot be determined",
  },
  countriesUnknown: {
    id: "EQjp7M",
    defaultMessage: "Countries: Unknown",
    description: "Shown when country count cannot be determined",
  },

  // Public API verification messages
  verifyFromPublicApi: {
    id: "kBCNfL",
    defaultMessage: "Verify via public API",
    description: "Button to verify product availability via public API",
  },
  verifyingPublicApi: {
    id: "t4hWFu",
    defaultMessage: "Verifying...",
    description: "Shown while verification is in progress",
  },
  publicApiVerified: {
    id: "WUKB5Z",
    defaultMessage: "Verified {time}",
    description: "Shown after verification with relative time",
  },
  publicApiPurchasable: {
    id: "ADvpV/",
    defaultMessage: "Purchasable",
    description: "Product can be purchased by customers",
  },
  publicApiNotPurchasable: {
    id: "Cmu1M8",
    defaultMessage: "Not purchasable",
    description: "Product cannot be purchased by customers",
  },
  publicApiNotVisible: {
    id: "6fAGSm",
    defaultMessage: "Not visible",
    description: "Product is not visible via public API",
  },
  publicApiVariantsInStock: {
    id: "7G7tg3",
    defaultMessage: "{count, plural, one {# variant in stock} other {# variants in stock}}",
    description: "Number of variants that have stock available",
  },
  publicApiNoVariantsInStock: {
    id: "7yfkyB",
    defaultMessage: "No variants in stock",
    description: "No variants have stock available",
  },
  publicApiVerificationError: {
    id: "JsLWyc",
    defaultMessage: "Verification failed",
    description: "Error occurred during public API verification",
  },
  publicApiVerificationDescription: {
    id: "La3xKC",
    defaultMessage: "Check if customers can actually purchase this product",
    description: "Description of public API verification feature",
  },
  publicApiVerificationTitle: {
    id: "vLc9Td",
    defaultMessage: "Public API verification",
    description: "Title for public API verification section",
  },
  testButton: {
    defaultMessage: "Test",
    id: "YpnjMB",
    description: "Button to test public API availability",
  },
  availabilityTitle: {
    id: "XQfBeC",
    defaultMessage: "Availability",
    description: "Availability card title",
  },
  availabilitySubtitle: {
    id: "h0mEWF",
    defaultMessage: "In {listed} of {total} channels",
    description: "Availability card subtitle showing channel count",
  },
  manageButton: {
    id: "E3SyRJ",
    defaultMessage: "Manage",
    description: "Button to manage channel availability",
  },
  noChannelsListed: {
    id: "eB6oHa",
    defaultMessage: "Product is not listed in any channel",
    description: "Message when product is not in any channel",
  },
  status_live: {
    id: "F0BhK/",
    defaultMessage: "Live",
    description: "Status when product is visible and purchasable",
  },
  statusDescription_live: {
    id: "IcTtTE",
    defaultMessage: "Visible and purchasable",
    description: "Description for live status",
  },
  statusDescription_liveNotPurchasable: {
    id: "+ZwF+1",
    defaultMessage: "Visible but not purchasable",
    description: "Description for live status when product is visible but purchase is scheduled",
  },
  status_scheduled: {
    id: "qYukJi",
    defaultMessage: "Scheduled",
    description: "Status when product is partially configured",
  },
  statusDescription_scheduled: {
    id: "UcrXYE",
    defaultMessage: "Publication scheduled",
    description: "Description for scheduled status when publication date is in the future",
  },
  status_hidden: {
    id: "w4ZVcj",
    defaultMessage: "Hidden",
    description: "Status when product is not visible",
  },
  statusDescription_hidden: {
    id: "ZBzfHn",
    defaultMessage: "Not visible to customers",
    description: "Description for hidden status",
  },
  status_issues: {
    id: "PF7Zsp",
    defaultMessage: "Issues",
    description: "Status when product has availability issues",
  },
  statusDescription_issues: {
    id: "vsSdHA",
    defaultMessage: "Has availability issues",
    description: "Description for status when product has availability issues",
  },
  channelControlsPlaceholder: {
    id: "KE/G/G",
    defaultMessage: "Channel controls will be displayed here",
    description: "Placeholder text for channel controls",
  },
  publishedLabel: {
    id: "U5dMfQ",
    defaultMessage: "Published",
    description: "Label for published toggle",
  },
  availableForPurchaseLabel: {
    id: "pMXWrd",
    defaultMessage: "Available for purchase",
    description: "Label for available for purchase toggle",
  },
  visibleInListingsLabel: {
    id: "EoNN9v",
    defaultMessage: "Show in listings",
    description: "Label for visible in listings toggle",
  },
  sinceDate: {
    id: "qKiqXs",
    defaultMessage: "since {date}",
    description: "Date suffix for toggle controls",
  },
  scheduledDate: {
    id: "1H0tqc",
    defaultMessage: "scheduled {date}",
    description: "Scheduled date for availability",
  },
  headerDescription_hidden: {
    id: "XLBNT0",
    defaultMessage: "Invisible via public API",
    description: "Header description when product is hidden",
  },
  notVisibleToCustomers: {
    id: "Cf7i/g",
    defaultMessage: "Hidden from public API.",
    description: "Info box title when product is not published",
  },
  publicApiReturnsNull: {
    id: "ofT0HH",
    defaultMessage: "Customers cannot find or view this product.",
    description: "Info box description for unpublished products",
  },
  visibleButNotPurchasable: {
    id: "2nnp9+",
    defaultMessage: "Visible but not purchasable.",
    description: "Info box title when product is not available for purchase",
  },
  cannotAddToCart: {
    id: "iAaYh4",
    defaultMessage: "Customers can view this product but cannot add it to cart.",
    description: "Info box description for unavailable products",
  },
  visibleNow: {
    id: "fxbjge",
    defaultMessage: "Visible now",
    description: "Status when product is currently visible on storefront",
  },
  scheduledForDate: {
    id: "uiZoY3",
    defaultMessage: "Scheduled for {date}",
    description: "Status when product is scheduled for future publication",
  },
  scheduledDatePassed: {
    id: "NjORiU",
    defaultMessage: "Scheduled date passed ({date})",
    description: "Warning when scheduled publication date is in the past",
  },
  schedulePublication: {
    id: "XbX2Ta",
    defaultMessage: "Schedule for later",
    description: "Checkbox label for scheduling publication for a future date",
  },
  schedulingWarning: {
    id: "hpBWnU",
    defaultMessage: "Product will be hidden until {date}.",
    description: "Warning when scheduling a visible product for the future",
  },
  availableNow: {
    id: "2FQ5xn",
    defaultMessage: "Available now",
    description: "Status when product is currently available for purchase",
  },
  scheduledAvailabilityDate: {
    id: "8Kk3r9",
    defaultMessage: "Scheduled for {date}",
    description: "Status when product availability is scheduled for future date",
  },
  scheduleAvailability: {
    id: "i3r9KP",
    defaultMessage: "Schedule for later",
    description: "Checkbox label for scheduling availability for a future date",
  },
  schedulingAvailabilityWarning: {
    id: "8sOnqE",
    defaultMessage: "Product will not be purchasable until this date.",
    description: "Warning when scheduling an available product for the future",
  },
  publishImmediately: {
    id: "Duik8x",
    defaultMessage: "Publish immediately instead",
    description: "Link to publish the product immediately instead of scheduling",
  },
  setPublicationDate: {
    id: "3kVRE2",
    defaultMessage: "Set publication date",
    description: "Checkbox label for setting publication date",
  },
  setAvailabilityDate: {
    id: "YFQBs1",
    defaultMessage: "Set availability date",
    description: "product availability date label",
  },
  datePickerPlaceholder: {
    id: "MFUQrr",
    defaultMessage: "dd/mm/yyyy, --:--",
    description: "Placeholder for date picker",
  },
  willBecomePublishedOn: {
    id: "hTLCC2",
    defaultMessage: "Will become published on {date}",
    description: "channel publication date",
  },
  willBecomeAvailableOn: {
    id: "znbVYT",
    defaultMessage: "Will become available on {date}",
    description: "product available for purchase date",
  },
  futureDateWarning: {
    id: "vlRrLz",
    defaultMessage: "This will unpublish the product until {date}.",
    description: "Warning when user moves publication date to the future",
  },
  revertToPreviousDate: {
    id: "U9TPGD",
    defaultMessage: "Revert to previous date",
    description: "Link to revert date change",
  },
  pastDateInfo: {
    id: "xvKNkf",
    defaultMessage:
      "This date is in the past. The product will be visible immediately when you save.",
    description: "Info message when user sets a past publication date",
  },
  editedBadge: {
    id: "Xa8ZOn",
    defaultMessage: "edited",
    description: "Badge shown when channel has unsaved changes",
  },
  toRemoveBadge: {
    id: "wBGCR1",
    defaultMessage: "to remove",
    description: "Badge shown when channel is marked for removal",
  },
  newBadge: {
    id: "/rsk2X",
    defaultMessage: "new",
    description: "Badge shown when channel is newly added",
  },
  errorBadge: {
    id: "+q4WRK",
    defaultMessage: "error",
    description: "Badge shown when channel has validation errors",
  },
  allChannelsHealthy: {
    id: "azych5",
    defaultMessage: "All channels configured correctly",
    description: "Message when no diagnostic issues found",
  },
  issuesSummary: {
    id: "v/tz3W",
    defaultMessage:
      "{errorCount, plural, =0 {} one {# problem} other {# problems}}{hasWarnings, select, true {{hasErrors, select, true {, } other {}}} other {}}{warningCount, plural, =0 {} one {# warning} other {# warnings}} found",
    description: "Summary of diagnostic issues found",
  },
  channelHasIssues: {
    id: "usjqAQ",
    defaultMessage: "{count, plural, one {# issue} other {# issues}}",
    description: "Badge showing number of issues in a channel",
  },
  configurationTitle: {
    id: "f71A+Y",
    defaultMessage: "Delivery configuration",
    description: "Title for delivery configuration section in channel",
  },
  warehousesConfigured: {
    id: "MFC20a",
    defaultMessage: "{count, plural, one {# warehouse} other {# warehouses}}",
    description: "Number of warehouses configured",
  },
  shippingZonesConfigured: {
    id: "J9z6wD",
    defaultMessage: "{count, plural, one {# shipping zone} other {# shipping zones}}",
    description: "Number of shipping zones configured",
  },
  healthCheckPurchasable: {
    id: "YaCu4U",
    defaultMessage: "Customers can buy this product",
    description: "Health check status when product can be purchased",
  },
  healthCheckPurchasableSubtitle: {
    id: "qwp4zK",
    defaultMessage: "Product is visible in store and available for purchase",
    description: "Health check subtitle when product can be purchased",
  },
  healthCheckNotPurchasable: {
    id: "turLD8",
    defaultMessage: "Customers cannot buy this product",
    description: "Health check status when product cannot be purchased",
  },
  healthCheckNotPurchasableSubtitle: {
    id: "7QhDjU",
    defaultMessage: "Check the issues above to fix configuration",
    description: "Health check subtitle when product cannot be purchased",
  },
  healthCheckHiddenButConfigured: {
    id: "dTzCqd",
    defaultMessage: "Not visible to customers",
    description: "Health check status when product is not published but otherwise ready",
  },
  healthCheckHiddenButConfiguredSubtitle: {
    id: "Hebup2",
    defaultMessage: "Product is not published. Publish it to make it visible in your store.",
    description: "Health check subtitle when product is not published",
  },
  healthCheckNotFound: {
    id: "rLnEAj",
    defaultMessage: "Unable to verify",
    description: "Health check error when product not available",
  },
  healthCheckPublished: {
    id: "u3wnIS",
    defaultMessage: "Visible in store",
    description: "Health check label for isPublished field",
  },
  healthCheckAvailable: {
    id: "Ihhutz",
    defaultMessage: "In stock",
    description: "Health check label for isAvailable field",
  },
  healthCheckForPurchase: {
    id: "eCA3n1",
    defaultMessage: "Can add to cart",
    description: "Health check label for isAvailableForPurchase field",
  },
  healthCheckVariantsWithStock: {
    id: "dLQhIT",
    defaultMessage: "Variants with stock: {count}/{total}",
    description: "Health check showing variants with stock count",
  },

  // Search and pagination
  searchChannelsPlaceholder: {
    id: "Nsbu46",
    defaultMessage: "Search channels...",
    description: "Placeholder for channel search input",
  },
  noChannelsMatchSearch: {
    id: "OrEUr6",
    defaultMessage: "No channels match your search",
    description: "Message when search returns no results",
  },
  paginationShowing: {
    id: "iPg/Z+",
    defaultMessage: "Showing {start}-{end} of {total}",
    description: "Pagination info showing current range",
  },
  paginationPrevious: {
    id: "hwSDOP",
    defaultMessage: "Previous",
    description: "Previous page button",
  },
  paginationNext: {
    id: "wDyvFZ",
    defaultMessage: "Next",
    description: "Next page button",
  },
});
