import { DOCS_ULRS } from "@dashboard/links";
import { Ripple } from "@dashboard/ripples/types";
import { defineMessage } from "react-intl";

export const checkoutAutocompleteSettings: Ripple = {
  type: "feature",
  ID: "checkout-autocomplete-settings",
  TTL_seconds: 60 * 60 * 24 * 3, // 3 days
  content: {
    oneLiner: "Checkout autocomplete feature can be now configured in settings",
    contextual: "You can configure checkouts to automatically complete when paid",
    global:
      "When checkouts are paid, but not completed by the customer, they can be automatically completed by Saleor. Visit settings to configure this behavior.",
  },
  dateAdded: new Date("2025-12-15"),
  actions: [
    {
      label: defineMessage({
        defaultMessage: "Read the docs",
        id: "Cm2/+V",
      }),
      href: DOCS_ULRS.TRANSACTIONS_AUTOMATIC_CHECKOUT_COMPLETION,
    },
  ],
};
