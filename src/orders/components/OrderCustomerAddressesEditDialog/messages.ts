import { defineMessages } from "react-intl";

export const dialogMessages = defineMessages({
  title: {
    defaultMessage: "Shipping address for order",
    description: "dialog header"
  },
  billingSameAsShipping: {
    defaultMessage: "Billing address same as shipping address",
    description: "checkbox label"
  },
  shippingAddressDescription: {
    defaultMessage:
      "This customer doesn’t have any shipping addresses. Provide address for order:",
    description: "dialog content"
  },
  billingAddressDescription: {
    defaultMessage: "Add a new address:",
    description: "dialog content"
  },
  customerShippingAddressDescription: {
    defaultMessage:
      "Which address would you like to use as shipping address for selected customer:",
    description: "dialog content"
  },
  customerBillingAddressDescription: {
    defaultMessage: "Select one of customer addresses or add a new address:",
    description: "dialog content"
  }
});

export const addressEditMessages = defineMessages({
  customerAddress: {
    defaultMessage: "Use one of customer addresses",
    description: "address type"
  },
  newAddress: {
    defaultMessage: "Add new address",
    description: "address type"
  }
});
