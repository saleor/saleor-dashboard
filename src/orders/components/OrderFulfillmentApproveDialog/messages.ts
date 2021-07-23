import { defineMessages } from "react-intl";

export const messages = defineMessages({
  title: {
    defaultMessage: "Approve this fulfillment",
    description: "dialog header"
  },
  description: {
    defaultMessage: "Are you sure you want to approve this fullfillment?",
    description: "dialog description"
  },
  notifyCustomer: {
    defaultMessage: "Send shipment details to customer",
    description: "checkbox label, fulfillment approval"
  }
});
