import { defineMessages } from "react-intl";

export const dialogMessages = defineMessages({
  customerChangeTitle: {
    defaultMessage: "Change address for order",
    description: "dialog header"
  },
  shippingChangeTitle: {
    defaultMessage: "Change customer shipping address",
    description: "dialog header"
  },
  billingChangeTitle: {
    defaultMessage: "Change customer billing address",
    description: "dialog header"
  },
  billingSameAsShipping: {
    defaultMessage: "Set the same for billing address",
    description: "checkbox label"
  },
  shippingSameAsBilling: {
    defaultMessage: "Set the same for shipping address",
    description: "checkbox label"
  },
  addressChangeDescription: {
    defaultMessage: "Select method you want to use to change address",
    description: "dialog content"
  },
  noAddressDescription: {
    defaultMessage:
      "This customer doesn't have any addresses in the address book. Provide address for order:",
    description: "dialog content"
  },
  customerChangeDescription: {
    defaultMessage:
      "Which address would you like to use as shipping address for selected customer:",
    description: "dialog content"
  },
  customerChangeBillingDescription: {
    defaultMessage: "Select one of customer addresses or add a new address:",
    description: "dialog content"
  },
  noAddressBillingDescription: {
    defaultMessage: "Add a new address:",
    description: "dialog content"
  },
  shippingTitle: {
    defaultMessage: "Shipping address",
    description: "search modal shipping title"
  },
  billingTitle: {
    defaultMessage: "Billing address",
    description: "search modal billing title"
  },
  searchInfo: {
    defaultMessage: "Select an address you want to use from the list below",
    description: "modal information under title"
  },
  noResultsFound: {
    defaultMessage: "No results found",
    description: "info when addresses search is unsuccessful"
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
