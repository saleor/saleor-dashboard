import { defineMessages } from "react-intl";

export const orderAddressEditDialogMessages = defineMessages({
  shippingTitle: {
    defaultMessage: "Change customer shipping address",
    description: "dialog header"
  },
  billingTitle: {
    defaultMessage: "Change customer billing address",
    description: "dialog header"
  },
  infoLabel: {
    defaultMessage: "Select method you want to use to change address",
    description: "Dialog info label"
  },
  customerAddressLabel: {
    defaultMessage: "Use one of customer addresses",
    description: "Radio label - select cusotmer address"
  },
  newAddressLabel: {
    defaultMessage: "Add new address",
    description: "Radio label - add new address"
  }
});
