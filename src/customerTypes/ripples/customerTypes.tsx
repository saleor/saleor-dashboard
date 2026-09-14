import { type Ripple } from "@dashboard/ripples/types";
import { defineMessage, FormattedMessage } from "react-intl";

import { customerTypeListUrl } from "../urls";

export const rippleCustomerTypes: Ripple = {
  type: "feature",
  ID: "customer-types",
  TTL_seconds: 60 * 60 * 24 * 14,
  dateAdded: new Date(2026, 7, 20),
  contextualAction: {
    label: defineMessage({ defaultMessage: "Set up types", id: "tfplrt" }),
    url: customerTypeListUrl(),
  },
  content: {
    oneLiner: "Customer types",
    contextual: (
      <FormattedMessage
        defaultMessage="Group customers into types like B2B or Wholesale, each with its own attributes."
        id="2cxQy7"
      />
    ),
    global:
      "You can now group customers into types — B2B, Wholesale, VIP, whatever fits your business. Each type defines its own attributes, so you can record details like tax ID or account manager on the customer profile instead of keeping them in metadata or notes. Create and edit types in Configuration → Customer types, then pick a type on any customer profile. The customer list has a tab per type, and the type badge in the profile header opens that tab.",
  },
};
