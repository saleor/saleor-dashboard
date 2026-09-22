import { defineMessages } from "react-intl";

export const messages = defineMessages({
  openGraphiQL: {
    id: "oUkVpp",
    defaultMessage: "Open this customer in GraphiQL",
  },
  editCustomerMetadata: {
    id: "DR3EBs",
    defaultMessage: "Edit customer metadata",
    description: "customer detail page, top-bar metadata button tooltip",
  },
  deleteUser: {
    id: "LQg8/p",
    defaultMessage: "Delete user",
    description: "customer detail cogs menu, opens the delete-confirmation dialog",
  },
  deactivateUser: {
    id: "zP3Rb6",
    defaultMessage: "Deactivate user",
    description: "customer detail cogs menu, deactivates the customer account",
  },
  activateUser: {
    id: "62Rs/K",
    defaultMessage: "Activate user",
    description: "customer detail cogs menu, activates a deactivated customer account",
  },
  saveCompositionGeneral: {
    id: "65MiSm",
    defaultMessage: "details",
    description: "Save composition segment for customer name, email, and note",
  },
  saveCompositionType: {
    id: "XkqRxe",
    defaultMessage: "customer type",
    description: "Save composition segment for a pending customer type change",
  },
  saveCompositionAttributes: {
    id: "FXqc6f",
    defaultMessage: "attributes",
    description: "Save composition segment for customer attribute values",
  },
  attributesTitle: {
    id: "WU4BPj",
    defaultMessage: "Attributes",
    description: "customer detail, attributes settings card title",
  },
});
