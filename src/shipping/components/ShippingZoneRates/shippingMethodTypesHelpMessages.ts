import { defineMessages } from "react-intl";

export const shippingMethodTypesHelpMessages = defineMessages({
  tooltipAriaLabel: {
    id: "ayGq6n",
    defaultMessage: "How price-based and weight-based shipping methods work",
    description: "shipping method types help tooltip aria label",
  },
  tooltipTitle: {
    id: "d6ZaoI",
    defaultMessage: "Price-based vs weight-based methods",
    description: "shipping method types help tooltip title",
  },
  tooltipIntro: {
    id: "XhvMVe",
    defaultMessage: "Each method applies by order value or weight—not both.",
    description: "shipping method types help tooltip intro",
  },
  priceBasedDescription: {
    id: "eyrUob",
    defaultMessage:
      "<strong>Price-based</strong> — subtotal within the channel min/max order value.",
    description: "shipping method types help price-based bullet",
  },
  weightBasedDescription: {
    id: "NA7KFR",
    defaultMessage: "<strong>Weight-based</strong> — total weight within min/max limits.",
    description: "shipping method types help weight-based bullet",
  },
  tooltipCheckoutNote: {
    id: "cJbx/i",
    defaultMessage:
      "All matching methods appear at checkout; neither type takes priority over the other.",
    description: "shipping method types help checkout note",
  },
  exampleSetup: {
    id: "ICJ3mp",
    defaultMessage:
      'Example — zone with "Free over $100" (price) and "Heavy parcel 5–20 kg" (weight):',
    description: "shipping method types help example setup",
  },
  exampleCartColumn: {
    id: "/tC+ce",
    defaultMessage: "Cart",
    description: "shipping method types help example table cart column",
  },
  exampleResultColumn: {
    id: "EbwsDr",
    defaultMessage: "Shown",
    description: "shipping method types help example table result column",
  },
  exampleRowOneCart: {
    id: "blhBcp",
    defaultMessage: "$150, 8 kg",
    description: "shipping method types help example row one cart",
  },
  exampleRowOneResult: {
    id: "K+QQU5",
    defaultMessage: "Both",
    description: "shipping method types help example row one result",
  },
  exampleRowTwoCart: {
    id: "Be1Tws",
    defaultMessage: "$50, 8 kg",
    description: "shipping method types help example row two cart",
  },
  exampleRowTwoResult: {
    id: "22gNDo",
    defaultMessage: "Weight only",
    description: "shipping method types help example row two result",
  },
  exampleRowThreeCart: {
    id: "C1aDzb",
    defaultMessage: "$150, 2 kg",
    description: "shipping method types help example row three cart",
  },
  exampleRowThreeResult: {
    id: "nvpGUR",
    defaultMessage: "Price only",
    description: "shipping method types help example row three result",
  },
});
