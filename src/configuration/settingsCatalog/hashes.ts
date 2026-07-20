/**
 * Stable DOM ids / URL hashes for settings hubs.
 * Catalog hrefs and UI `id` props must use these values.
 */
export const settingsHashes = {
  // Orders & fulfillment
  ordersChannelSettings: "per-channel-order-settings",
  ordersAutoConfirm: "automatically-confirm",
  ordersAutoFulfillGiftCards: "auto-fulfill-gift-cards",
  ordersAllowUnpaid: "allow-unpaid",
  ordersDeleteExpired: "delete-expired",
  ordersFulfillment: "fulfillment-settings",
  ordersFulfillmentAutoApprove: "fulfillment-auto-approve",
  ordersFulfillmentAllowUnpaid: "fulfillment-allow-unpaid",
  ordersReservedStock: "reserved-stock",
  ordersCheckoutLimits: "checkout-limits",
  ordersRefundsLink: "refunds-returns",

  // Refunds & returns
  refundsRefundReasons: "refund-reasons",
  refundsReturnReasons: "return-reasons",

  // Store
  storeDetails: "store-details",
  storeCompany: "company-information",
  storeCustomerAccounts: "customer-accounts",
  storeEmailConfirmation: "email-confirmation",
  storePasswordLogin: "password-login",
  storeAdvanced: "advanced",
  storeWebhookEmission: "webhook-emission",
  storeStockAvailability: "stock-availability",
  storeAddressValidation: "address-validation",
} as const;

export type SettingsHash = (typeof settingsHashes)[keyof typeof settingsHashes];

export const settingsHref = (path: string, hash?: SettingsHash | string): string =>
  hash ? `${path}#${hash}` : path;

/** All setting/section hashes that must exist as DOM ids on hub pages. */
export const allSettingsHashes: readonly string[] = Object.values(settingsHashes);
