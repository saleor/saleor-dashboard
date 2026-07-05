import { defineMessages } from "react-intl";

export const orderFulfillmentApproveDialogMessages = defineMessages({
  title: {
    id: "UQu75k",
    defaultMessage: "Approve this fulfillment",
    description: "dialog header",
  },
  description: {
    id: "G3caQh",
    defaultMessage: "Are you sure you want to approve this fulfillment?",
    description: "dialog description",
  },
  notifyCustomer: {
    id: "IXswaJ",
    defaultMessage: "Send fulfillment email to customer",
    description: "checkbox label, fulfillment approval",
  },
});
