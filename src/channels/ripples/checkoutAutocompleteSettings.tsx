import { DOCS_ULRS } from "@dashboard/links";
import { rippleActionMessages } from "@dashboard/ripples/messages";
import { type Ripple } from "@dashboard/ripples/types";
import { defineMessages } from "react-intl";

const contentMessages = defineMessages({
  oneLiner: {
    id: "xvaNSD",
    defaultMessage: "Checkout autocomplete feature can be now configured in settings",
    description: "ripple title",
  },
  contextual: {
    id: "TXYcg/",
    defaultMessage: "You can configure checkouts to automatically complete when paid",
    description: "ripple contextual hint",
  },
  global: {
    id: "NLDwRL",
    defaultMessage:
      "When checkouts are paid, but not completed by the customer, they can be automatically completed by Saleor. Visit settings to configure this behavior.",
    description: "ripple description in What's New",
  },
});

export const checkoutAutocompleteSettings: Ripple = {
  type: "feature",
  ID: "checkout-autocomplete-settings",
  TTL_seconds: 60 * 60 * 24 * 3, // 3 days
  content: {
    oneLiner: contentMessages.oneLiner,
    contextual: contentMessages.contextual,
    global: contentMessages.global,
  },
  dateAdded: new Date("2025-12-15"),
  actions: [
    {
      label: rippleActionMessages.readTheDocs,
      href: DOCS_ULRS.TRANSACTIONS_AUTOMATIC_CHECKOUT_COMPLETION,
    },
  ],
};
