import { defineMessages } from "react-intl";

export const dialogMessages = defineMessages({
  title: {
    id: "PBd/e+",
    defaultMessage: "Change address for order",
    description: "dialog header"
  },
  billingSameAsShipping: {
    id: "RzDYi8",
    defaultMessage: "Set the same for billing address",
    description: "checkbox label"
  },
  shippingAddressDescription: {
    id: "szPBTr",
    defaultMessage:
      "This customer doesn’t have any shipping addresses. Provide address for order:",
    description: "dialog content"
  },
  billingAddressDescription: {
    id: "Qph0GE",
    defaultMessage: "Add a new address:",
    description: "dialog content"
  },
  customerShippingAddressDescription: {
    id: "CG+awx",
    defaultMessage:
      "Which address would you like to use as shipping address for selected customer:",
    description: "dialog content"
  },
  customerBillingAddressDescription: {
    id: "qov29K",
    defaultMessage: "Select one of customer addresses or add a new address:",
    description: "dialog content"
  }
});

export const addressEditMessages = defineMessages({
  customerAddress: {
    id: "vf56In",
    defaultMessage: "Use one of customer addresses",
    description: "address type"
  },
  newAddress: {
    id: "9gb9b4",
    defaultMessage: "Add new address",
    description: "address type"
  }
});

export const addressSearchMessages = defineMessages({
  shippingTitle: {
    id: "2OH46U",
    defaultMessage: "Shipping address",
    description: "search modal shipping title"
  },
  billingTitle: {
    id: "r4g/vD",
    defaultMessage: "Billing address",
    description: "search modal billing title"
  },
  searchInfo: {
    id: "zqarUF",
    defaultMessage: "Select an address you want to use from the list below",
    description: "modal information under title"
  },
  noResultsFound: {
    id: "hX5PAb",
    defaultMessage: "No results found"
  }
});
