import { defineMessages } from "react-intl";

export const messages = defineMessages({
  editCustomerTypeMetadata: {
    id: "V4BDBb",
    defaultMessage: "Edit customer type metadata",
    description: "customer type detail page, top-bar metadata button tooltip",
  },
  openGraphiQL: {
    id: "+kNjdQ",
    defaultMessage: "Open this customer type in GraphiQL",
  },
  deleteCustomerType: {
    id: "N5qrPL",
    defaultMessage: "Delete customer type",
    description: "customer type detail cogs menu, opens the delete-confirmation dialog",
  },
  setAsDefault: {
    id: "eU9J97",
    defaultMessage: "Set as default",
    description: "customer type detail cogs menu, promotes this type to default",
  },
  defaultPill: {
    id: "oRfxTZ",
    defaultMessage: "Default",
    description: "customer type default status pill",
  },
  slug: {
    id: "ZSheIU",
    defaultMessage: "Slug",
    description: "customer type slug field",
  },
  defaultHint: {
    id: "vOnJjB",
    defaultMessage:
      "New customers are assigned this type. To delete it, set another customer type as the default first.",
    description: "hint under general information when this type is the default",
  },
});
