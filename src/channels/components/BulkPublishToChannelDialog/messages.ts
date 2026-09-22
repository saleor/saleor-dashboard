import { defineMessages } from "react-intl";

export const messages = defineMessages({
  title: {
    id: "c7Pl4C",
    defaultMessage: "Add products to {channelName}",
    description: "bulk publish to channel wizard title",
  },
  selectStep: {
    id: "f6X5Cp",
    defaultMessage: "Select products",
    description: "bulk publish wizard step 1",
  },
  defaultsStep: {
    id: "hapYhy",
    defaultMessage: "Defaults",
    description: "bulk publish wizard defaults step",
  },
  reviewStep: {
    id: "kbdk/c",
    defaultMessage: "Review products",
    description: "bulk publish wizard review step",
  },
  confirmStep: {
    id: "mwmYkm",
    defaultMessage: "Confirm & publish",
    description: "bulk publish wizard confirm step",
  },
  defaultsIntro: {
    id: "PFJYxb",
    defaultMessage: "These apply to every product you selected.",
    description: "bulk publish defaults step intro",
  },
  visibilitySectionTitle: {
    id: "HbPBZk",
    defaultMessage: "Visibility in this channel",
    description: "bulk publish defaults visibility section title",
  },
  visibilitySectionDescription: {
    id: "/IvojM",
    defaultMessage:
      "Applied to every selected product. You can change any of these per product later.",
    description: "bulk publish defaults visibility section description",
  },
  publishDescription: {
    id: "vMdO8a",
    defaultMessage: "Makes the products visible to customers in this channel.",
    description: "bulk publish publish toggle description",
  },
  visibleInListingsDescription: {
    id: "Cn6Q/T",
    defaultMessage: "Include in category listings and search. Does not affect collections.",
    description: "bulk publish visible in listings toggle description",
  },
  availableForPurchaseDescription: {
    id: "6I1Qdg",
    defaultMessage: "When off, customers can still see the products but cannot buy them.",
    description: "bulk publish available for purchase toggle description",
  },
  inventorySectionTitle: {
    id: "GDM+GZ",
    defaultMessage: "Inventory",
    description: "bulk publish defaults inventory section title",
  },
  inventorySectionOptional: {
    id: "SeGiFv",
    defaultMessage: "Optional",
    description: "bulk publish defaults inventory optional label",
  },
  inventorySectionNote: {
    id: "rtHRcz",
    defaultMessage: "Stock is not part of this channel's listing.",
    description: "bulk publish defaults inventory section note",
  },
  enableStockDescription: {
    id: "pmzMmq",
    defaultMessage:
      "Seeds a quantity for every variant. Leave off to publish without touching inventory.",
    description: "bulk publish stock toggle description",
  },
  stockExistingInventoryInfo: {
    id: "pva0/a",
    defaultMessage:
      "Products are published with their existing inventory. Any variant with no stock shows as out of stock until you add some.",
    description: "bulk publish stock disabled info callout",
  },
  stockRequiresChannelWarehouse: {
    id: "A/BBdr",
    defaultMessage:
      "Assign at least one warehouse to this channel before you can set stock here. You can still publish products and set prices.",
    description: "bulk publish stock disabled without channel warehouses",
  },
  stockWarehouseScopeTitle: {
    id: "TRl/Xe",
    defaultMessage: "Write stock to",
    description: "bulk publish stock warehouse scope section title",
  },
  stockAllChannelWarehousesLabel: {
    id: "apfBOX",
    defaultMessage: "All assigned warehouses",
    description: "bulk publish stock all channel warehouses radio label",
  },
  stockAllChannelWarehousesDescription: {
    id: "naU0Gz",
    defaultMessage: "Applies the default quantity in each warehouse assigned to this channel.",
    description: "bulk publish stock all channel warehouses radio description",
  },
  stockSingleWarehouseDescription: {
    id: "Fx7aD4",
    defaultMessage: "Applies the default quantity only in this warehouse.",
    description: "bulk publish stock single warehouse radio description",
  },
  stockSingleWarehouseRequired: {
    id: "VkUgug",
    defaultMessage: "Select a warehouse to write stock to.",
    description: "bulk publish stock single warehouse validation",
  },
  stockSingleWarehouseInfo: {
    id: "ofGciN",
    defaultMessage: "Stock will be set in {warehouseName}.",
    description: "bulk publish stock single assigned warehouse info",
  },
  stockPerWarehouseHint: {
    id: "Ys9GCT",
    defaultMessage: "{scope, select, single {Per variant.} other {Per variant, per warehouse.}}",
    description: "bulk publish default stock per warehouse hint",
  },
  stockDescription: {
    id: "ppUdc+",
    defaultMessage:
      "Prefills stock on the next step only. Clear any row there to skip updating that product.",
    description: "bulk publish default stock helper",
  },
  defaultStockQuantity: {
    id: "O6fFzA",
    defaultMessage: "Default stock level",
    description: "bulk publish default stock quantity label",
  },
  productPrice: {
    id: "/ts0XA",
    defaultMessage: "Price",
    description: "bulk publish per product price field label",
  },
  productCostPrice: {
    id: "DpVPvW",
    defaultMessage: "Cost price",
    description: "bulk publish per product cost price field label",
  },
  productStock: {
    id: "fl7+le",
    defaultMessage: "Stock",
    description: "bulk publish per product stock field label",
  },
  reviewCardTitle: {
    id: "P0LSN7",
    defaultMessage: "Products",
    description: "bulk publish review card title",
  },
  reviewCardSubtitle: {
    id: "czNpQW",
    defaultMessage: "{count, plural, one {# product} other {# products}}",
    description: "bulk publish review card subtitle",
  },
  reviewColumnPrice: {
    id: "8lKCb2",
    defaultMessage: "Price",
    description: "bulk publish review table price column",
  },
  reviewColumnPriceUnchangedHint: {
    defaultMessage: "Blank keeps current",
    id: "C1+aT0",
    description: "bulk publish review table price column hint",
  },
  reviewPriceUnchangedPlaceholder: {
    defaultMessage: "Unchanged",
    id: "1xn94O",
    description: "bulk publish review price placeholder when the price is kept",
  },
  reviewPriceOverwritesMixed: {
    defaultMessage:
      "Overwrites {count, plural, one {# variant price} other {# different variant prices}}",
    id: "/NkQFN",
    description: "bulk publish review warning when one price replaces varied variant prices",
  },
  reviewVariantsStayUnlisted: {
    defaultMessage:
      "{count, plural, one {# variant has no price here and stays unlisted} other {# variants have no price here and stay unlisted}}. Set a price to publish {count, plural, one {it} other {them}}.",
    id: "BhLnBj",
    description: "bulk publish review warning about variants left without a channel listing",
  },
  reviewPriceUpdateCount: {
    defaultMessage:
      "{count, plural, =0 {No price changes} one {# price change} other {# price changes}}",
    id: "FmZAfR",
    description: "bulk publish review count of products whose price will change",
  },
  reviewColumnCostPrice: {
    id: "7E7y/o",
    defaultMessage: "Cost price (optional)",
    description: "bulk publish review table cost price column",
  },
  reviewColumnStock: {
    id: "M8sTdd",
    defaultMessage: "Stock",
    description: "bulk publish review table stock column",
  },
  reviewSpreadsheetPasteHint: {
    id: "NRaMt5",
    defaultMessage:
      "{hasStock, select, true {You can paste from a spreadsheet. Select a field and paste tab-separated rows to fill price, cost price, and stock down the list.} other {You can paste from a spreadsheet. Select a field and paste tab-separated rows to fill price and cost price down the list.}}",
    description: "bulk publish review spreadsheet paste hint",
  },
  reviewVariantLimitHint: {
    id: "NRWfwM",
    defaultMessage:
      "Prices, cost, and stock apply to all variants of each product (up to {max} per product).",
    description: "bulk publish review variant limit hint",
  },
  reviewManyVariantsWarning: {
    id: "zMHrO2",
    defaultMessage:
      "{count, plural, one {# product has} other {# products have}} more than {threshold} variants. Publishing may take longer.",
    description: "bulk publish review many variants warning",
  },
  reviewVariantLimitWarning: {
    id: "Azdlay",
    defaultMessage:
      "{count, plural, one {# product has} other {# products have}} more than {max} variants and cannot be published here: {productNames}",
    description: "bulk publish review variant limit warning",
  },
  productExceedsVariantLimit: {
    id: "Kg0yyk",
    defaultMessage: "Over {max} variants",
    description: "bulk publish product exceeds variant limit chip",
  },
  productManyVariants: {
    id: "+qtDGu",
    defaultMessage: "Many variants",
    description: "bulk publish product many variants chip",
  },
  productMissingCategory: {
    id: "FgR9Yp",
    defaultMessage: "No category",
    description: "bulk publish product missing category chip",
  },
  reviewMissingCategoryWarning: {
    id: "xsd8Wt",
    defaultMessage:
      "{count, plural, one {# product has} other {# products have}} no category and cannot be published: {productNames}. Assign a category on the product, or turn off Publish in Defaults.",
    description: "bulk publish review missing category warning",
  },
  reviewStockHint: {
    id: "o+OjmT",
    defaultMessage:
      "Only stock is prefilled from your default quantity. Clear a row to leave that product's inventory unchanged.",
    description: "bulk publish review stock hint",
  },
  enableStock: {
    id: "DtYy/u",
    defaultMessage: "Also set stock levels",
    description: "bulk publish stock toggle",
  },
  reviewDescription: {
    id: "sZpp65",
    defaultMessage:
      "Set prices in {currency} for each product. Cost price and stock are optional. Values apply to all variants of that product.",
    description: "bulk publish review step description",
  },
  confirmIntro: {
    id: "XkJr/+",
    defaultMessage:
      "Confirming publishes these products to <strong>{channelName}</strong>. Nothing has been written yet.",
    description: "bulk publish confirm step intro",
  },
  confirmSectionProducts: {
    id: "5iAXw5",
    defaultMessage: "Products",
    description: "bulk publish confirm products section label",
  },
  confirmSectionPricing: {
    id: "4hOnpC",
    defaultMessage: "Pricing",
    description: "bulk publish confirm pricing section label",
  },
  confirmSectionStock: {
    id: "ze+o5l",
    defaultMessage: "Stock",
    description: "bulk publish confirm stock section label",
  },
  confirmSectionVisibility: {
    id: "uP7qYe",
    defaultMessage: "Visibility",
    description: "bulk publish confirm visibility section label",
  },
  confirmProductNamesWithMore: {
    id: "es9wf4",
    defaultMessage: "{previewNames}, and {remainingCount} more",
    description: "bulk publish confirm truncated product names",
  },
  confirmNoCostPrices: {
    id: "XaOLzw",
    defaultMessage: "No cost prices set",
    description: "bulk publish confirm no cost prices",
  },
  confirmPartialCostPrices: {
    id: "vmLY5S",
    defaultMessage: "Cost prices set for {count, plural, one {# product} other {# products}}",
    description: "bulk publish confirm partial cost prices",
  },
  confirmPricesUnchanged: {
    defaultMessage:
      "{count, plural, one {# product keeps its current prices} other {# products keep their current prices}}",
    id: "6e2YdE",
    description: "bulk publish confirm products with no price change",
  },
  confirmNoPriceChanges: {
    defaultMessage: "Prices unchanged",
    id: "GYXouB",
    description: "bulk publish confirm title when no price is set",
  },
  confirmStockSkippedTitle: {
    id: "RB7zH3",
    defaultMessage: "Stock will not be changed",
    description: "bulk publish confirm stock skipped title",
  },
  confirmStockSkippedDetail: {
    id: "FokiTS",
    defaultMessage: "Inventory updates were turned off in the previous step.",
    description: "bulk publish confirm stock skipped detail",
  },
  confirmStockEnabledNoneTitle: {
    id: "EUI+gH",
    defaultMessage: "No stock quantities set",
    description: "bulk publish confirm stock enabled none title",
  },
  confirmStockEnabledNoneDetail: {
    id: "dHhnXx",
    defaultMessage: "Existing inventory will not be changed.",
    description: "bulk publish confirm stock enabled none detail",
  },
  confirmStockQuantitySingle: {
    id: "+23eZr",
    defaultMessage: "{quantity} units per variant",
    description: "bulk publish confirm single stock quantity",
  },
  confirmStockQuantityRange: {
    id: "YYLVFC",
    defaultMessage: "{min} – {max} units per variant",
    description: "bulk publish confirm stock quantity range",
  },
  confirmStockWarehouseSingle: {
    id: "WNwbEi",
    defaultMessage:
      "Applies to {productCount, plural, one {# product} other {# products}} in {warehouseName}",
    description: "bulk publish confirm stock single warehouse detail",
  },
  confirmStockWarehouseAll: {
    id: "UGUTLP",
    defaultMessage:
      "Applies to {productCount, plural, one {# product} other {# products}} in all assigned warehouses",
    description: "bulk publish confirm stock all warehouses detail",
  },
  confirmVisibilityPublished: {
    id: "a1kRZJ",
    defaultMessage: "Published",
    description: "bulk publish confirm visibility published item",
  },
  confirmVisibilityAllEnabled: {
    id: "GoZ/jJ",
    defaultMessage: "Customers can find and buy these products.",
    description: "bulk publish confirm visibility all enabled detail",
  },
  confirmVisibilityNotPublished: {
    id: "eobdhS",
    defaultMessage: "Products will be added to the channel but remain unpublished.",
    description: "bulk publish confirm visibility not published detail",
  },
  confirmVisibilityNotAvailable: {
    id: "oGsDpe",
    defaultMessage: "Products will be visible but not available for purchase.",
    description: "bulk publish confirm visibility not available detail",
  },
  confirmVisibilityHiddenFromListings: {
    id: "FOJ5Ak",
    defaultMessage: "Products will not appear in storefront listings.",
    description: "bulk publish confirm visibility hidden from listings detail",
  },
  confirmAddProducts: {
    id: "Uy6UVW",
    defaultMessage: "{count, plural, one {Add # product} other {Add # products}}",
    description: "bulk publish confirm add products button",
  },
  publishingDescription: {
    id: "8uYDAT",
    defaultMessage: "Publishing products to the channel. This may take a moment.",
    description: "bulk publish in progress description",
  },
  variantCount: {
    id: "Wo/OGT",
    defaultMessage: "{count, plural, one {# variant} other {# variants}}",
    description: "bulk publish variant count per product",
  },
  alreadyInChannel: {
    id: "KgabNG",
    defaultMessage: "Already listed",
    description: "bulk publish product already listed badge",
  },
  alreadyInChannelTooltip: {
    defaultMessage:
      "{hasStock, select, true {Already in this channel. Leave price or stock blank to keep the current values.} other {Already in this channel. Leave the price blank to keep the current prices.}}",
    id: "BZyOKE",
    description: "bulk publish already listed badge tooltip",
  },
  publishLabel: {
    id: "UrZRxo",
    defaultMessage: "Publish to channel",
    description: "bulk publish publish toggle",
  },
  visibleInListings: {
    id: "6LB3kZ",
    defaultMessage: "Visible in listings",
    description: "bulk publish visible in listings toggle",
  },
  availableForPurchase: {
    id: "dEhO58",
    defaultMessage: "Available for purchase",
    description: "bulk publish available for purchase toggle",
  },
  summary: {
    id: "t3POsd",
    defaultMessage:
      "{productCount, plural, one {# product} other {# products}} · {variantCount, plural, one {# variant} other {# variants}}",
    description: "bulk publish summary line",
  },
  success: {
    id: "pjHBHZ",
    defaultMessage: "Products published to channel",
    description: "bulk publish success notification",
  },
  partialSuccess: {
    id: "JRuUWT",
    defaultMessage: "Some products could not be published. Review errors and try again.",
    description: "bulk publish partial failure notification",
  },
  noProductsSelected: {
    id: "u9npnE",
    defaultMessage: "Select at least one product to continue.",
    description: "bulk publish validation",
  },
  productsLoadFailed: {
    id: "tkZoWk",
    defaultMessage: "Could not load selected products. Go back and try again.",
    description: "bulk publish product data fetch failure",
  },
  productsPartiallyLoaded: {
    id: "gWc9xM",
    defaultMessage:
      "Only {loaded} of {selected} selected products could be loaded. Go back and try again.",
    description: "bulk publish partial product data fetch failure",
  },
  stockRequiresWarehouse: {
    id: "Uf1Fl5",
    defaultMessage: "Create at least one warehouse in your shop to set stock levels.",
    description: "bulk publish stock disabled without any warehouses",
  },
  priceRequired: {
    defaultMessage: "Enter a price for products that are not in this channel yet.",
    id: "Em4Fzl",
    description: "bulk publish price validation",
  },
  priceInvalid: {
    defaultMessage: "Enter a valid price or leave it blank to keep the current one.",
    id: "H31h5O",
    description: "bulk publish price format validation",
  },
  costPriceInvalid: {
    id: "bJ8HZb",
    defaultMessage: "Enter a valid cost price or leave it blank.",
    description: "bulk publish cost price validation",
  },
  stockInvalid: {
    id: "tyw+kv",
    defaultMessage: "Enter a valid stock level or leave it blank.",
    description: "bulk publish stock validation",
  },
  tooManyProducts: {
    id: "vFm31D",
    defaultMessage: "Select up to {max} products at a time.",
    description: "bulk publish product limit",
  },
  selectAllTruncated: {
    id: "snjvVg",
    defaultMessage:
      "Only {max} products can be selected at once. {skipped, plural, one {# more visible product was} other {# more visible products were}} not selected.",
    description: "bulk publish select all hit max selection cap",
  },
  excludeListedInChannel: {
    id: "utpPc4",
    defaultMessage: "Only products not in channel",
    description: "bulk publish picker filter label",
  },
  excludeListedInChannelHelper: {
    id: "XixXDN",
    defaultMessage:
      "Turn off to include products already listed and update their prices and stock.",
    description: "bulk publish picker filter helper",
  },
  excludeMissingCategoryHelper: {
    id: "R5IYxa",
    defaultMessage: "Products without a category are hidden because they cannot be published.",
    description: "bulk publish picker helper about missing category filter",
  },
  exitWizardDescription: {
    id: "XYvupB",
    defaultMessage: "Your product selection and pricing changes will be lost.",
    description: "bulk publish exit wizard confirmation",
  },
  retryFailed: {
    id: "YIUVBj",
    defaultMessage: "Retry failed",
    description: "bulk publish retry failed products button",
  },
  publishFailed: {
    id: "+WPPzl",
    defaultMessage: "Publishing failed. Try again.",
    description: "bulk publish unexpected error",
  },
  variantLimitExceeded: {
    id: "fZzBxX",
    defaultMessage:
      "{count, plural, one {# product has} other {# products have}} more than {max} variants and cannot be published with this wizard.",
    description: "bulk publish variant count limit validation",
  },
  missingCategoryForPublish: {
    id: "RmWKtT",
    defaultMessage:
      "{count, plural, one {# product has} other {# products have}} no category. Assign a category before publishing, or turn off Publish in Defaults.",
    description: "bulk publish missing category validation",
  },
  productLoadFailed: {
    id: "efbank",
    defaultMessage: "Could not load product data.",
    description: "bulk publish progress error when product fetch misses a row",
  },
});
