import { type Ripple } from "@dashboard/ripples/types";
import { defineMessages } from "react-intl";

const contentMessages = defineMessages({
  oneLiner: {
    id: "RdE7BQ",
    defaultMessage: "Customer types",
    description: "ripple title",
  },
  contextual: {
    id: "BOVeB6",
    defaultMessage:
      "Customers can now have a type, like B2B or Wholesale, with its own attributes. Set up types in Configuration → Customer types.",
    description: "ripple contextual hint",
  },
  global: {
    id: "8DCm4V",
    defaultMessage:
      "You can now group customers into types — B2B, Wholesale, VIP, whatever fits your business. Each type defines its own attributes, so you can record details like tax ID or account manager on the customer profile instead of keeping them in metadata or notes. Create and edit types in Configuration → Customer types, then pick a type on any customer profile. The customer list has a tab per type, and the type badge in the profile header opens that tab.",
    description: "ripple description in What's New",
  },
});

export const rippleCustomerTypes: Ripple = {
  type: "feature",
  ID: "customer-types",
  TTL_seconds: 60 * 60 * 24 * 14,
  dateAdded: new Date(2026, 7, 20),
  content: {
    oneLiner: contentMessages.oneLiner,
    contextual: contentMessages.contextual,
    global: contentMessages.global,
  },
};
