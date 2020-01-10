import { defineMessages } from "react-intl";

const messages = defineMessages({
  availableInGrid: {
    defaultMessage: "Can be used as column",
    description: "attribute can be column in product list table"
  },
  filterableInDashboard: {
    defaultMessage: "Filterable in Dashboard",
    description: "use attribute in filtering"
  },
  filterableInStorefront: {
    defaultMessage: "Filterable in Storefront",
    description: "use attribute in filtering"
  },
  isVariantOnly: {
    defaultMessage: "Variant Only",
    description: "attribute can be used only in variants"
  },
  valueRequired: {
    defaultMessage: "Value Required",
    description: "attribute value is required"
  },
  visibleInStorefront: {
    defaultMessage: "Visible on Product Page in Storefront",
    description: "attribute"
  }
});

export default messages;
