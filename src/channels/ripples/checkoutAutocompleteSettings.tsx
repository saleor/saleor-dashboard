import { Ripple } from "@dashboard/ripples/types";

export const checkoutAutocompleteSettings: Ripple = {
  ID: "checkout-autocomplete-settings",
  TTL_seconds: 60 * 60 * 24 * 3, // 3 days
  content: {
    oneLiner: "Checkout autocomplete feature can be now configured in settings",
    contextual: "You can configure checkouts to automatically complete when paid",
    global:
      "When checkouts are paid, but not completed by the customer, they can be automatically completed by Saleor. Visit settings to configure this behavior.",
  },
  dateAdded: new Date("2025-12-15"),
};
