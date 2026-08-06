import { defineMessages } from "react-intl";

export const shippingZoneMethodsMessages = defineMessages({
  priceBasedSectionTitle: {
    id: "o/BzOd",
    defaultMessage: "Price-based shipping methods",
    description: "price based shipping methods, section header",
  },
  weightBasedSectionTitle: {
    id: "l1n7y2",
    defaultMessage: "Weight-based shipping methods",
    description: "weight based shipping methods, section header",
  },
  addShippingMethod: {
    id: "HQxM32",
    defaultMessage: "Add shipping method",
    description: "button",
  },
  noShippingMethods: {
    id: "sRB887",
    defaultMessage: "No shipping methods in this zone",
    description: "empty shipping methods list in shipping zone",
  },
  channelsAssigned: {
    id: "p8wPET",
    defaultMessage: "{count, plural, one {# channel} other {# channels}}",
    description: "shipping method assigned channel count when all have prices",
  },
  channelsPriced: {
    id: "wN8PkE",
    defaultMessage: "Priced for {configured} of {total} channels",
    description: "shipping method channel coverage when some assigned channels lack prices",
  },
  channelsMissingPricing: {
    id: "vPW5Zc",
    defaultMessage:
      "{count, plural, one {# channel without pricing} other {# channels without pricing}}",
    description: "shipping method assigned channels missing a price",
  },
  assignChannelsHint: {
    id: "avj76v",
    defaultMessage:
      "Assign channels to this shipping zone so we know which orders will be supported",
    description: "ChannelsSection subtitle",
  },
  noMethodChannelsHint: {
    id: "Pr3zjN",
    defaultMessage:
      "No channels assigned to this shipping method yet. Open the method to set availability and prices.",
    description: "empty state when a shipping method has no channel listings",
  },
  channelColumn: {
    id: "cW7hFJ",
    defaultMessage: "Channel",
    description: "shipping method channel column",
  },
  orderValueRangeColumn: {
    id: "lTWrsA",
    defaultMessage: "Order value range",
    description: "shipping method order value range column",
  },
  priceColumn: {
    id: "EKoPNg",
    defaultMessage: "Price",
    description: "shipping method price",
  },
  notConfigured: {
    id: "hks/QN",
    defaultMessage: "Not configured",
    description: "shipping method channel listing missing",
  },
  searchChannels: {
    id: "Q/qE2a",
    defaultMessage: "Search channels",
    description: "search channels in shipping method breakdown",
  },
  setUpPricing: {
    id: "7B5AK5",
    defaultMessage: "Set up pricing",
    description: "link to configure shipping method channel pricing",
  },
});
