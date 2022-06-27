import { defineMessages } from "react-intl";

export const dialogMessages = defineMessages({
  customerChangeTitle: {
    id: "PBd/e+",
    defaultMessage: "Change address for order",
    description: "dialog header",
  },
  shippingChangeTitle: {
    id: "129wyQ",
    defaultMessage: "Change customer shipping address",
    description: "dialog header",
  },
  billingChangeTitle: {
    id: "D4W/LE",
    defaultMessage: "Change customer billing address",
    description: "dialog header",
  },
  billingSameAsShipping: {
    id: "RzDYi8",
    defaultMessage: "Set the same for billing address",
    description: "checkbox label",
  },
  shippingSameAsBilling: {
    id: "txOXvy",
    defaultMessage: "Set the same for shipping address",
    description: "checkbox label",
  },
  addressChangeDescription: {
    id: "FIZvTx",
    defaultMessage: "Select method you want to use to change address",
    description: "dialog content",
  },
  noAddressDescription: {
    id: "xWEFrR",
    defaultMessage:
      "This customer doesn't have any addresses in the address book. Provide address for order:",
    description: "dialog content",
  },
  customerChangeDescription: {
    id: "CG+awx",
    defaultMessage:
      "Which address would you like to use as shipping address for selected customer:",
    description: "dialog content",
  },
  customerChangeBillingDescription: {
    id: "qov29K",
    defaultMessage: "Select one of customer addresses or add a new address:",
    description: "dialog content",
  },
  noAddressBillingDescription: {
    id: "Qph0GE",
    defaultMessage: "Add a new address:",
    description: "dialog content",
  },
  shippingTitle: {
    id: "2OH46U",
    defaultMessage: "Shipping address",
    description: "search modal shipping title",
  },
  billingTitle: {
    id: "r4g/vD",
    defaultMessage: "Billing address",
    description: "search modal billing title",
  },
  searchInfo: {
    id: "zqarUF",
    defaultMessage: "Select an address you want to use from the list below",
    description: "modal information under title",
  },
  noResultsFound: {
    id: "kQq6/o",
    defaultMessage: "No results found",
    description: "info when addresses search is unsuccessful",
  },
});

export const addressEditMessages = defineMessages({
  customerAddress: {
    id: "vf56In",
    defaultMessage: "Use one of customer addresses",
    description: "address type",
  },
  newAddress: {
    id: "9gb9b4",
    defaultMessage: "Add new address",
    description: "address type",
  },
});
