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
    id: "sxpMt3",
    defaultMessage:
      "When you add a shipping method, choose whether it applies based on order value or order weight. One method cannot use both.",
    description: "shipping method types help tooltip intro",
  },
  priceBasedDescription: {
    id: "gNDlQY",
    defaultMessage:
      "<strong>Price-based</strong> — shown when the order subtotal is between your minimum and maximum order value for that channel.",
    description: "shipping method types help price-based bullet",
  },
  weightBasedDescription: {
    id: "xbnx+m",
    defaultMessage:
      "<strong>Weight-based</strong> — shown when the total order weight is between your minimum and maximum weight limits.",
    description: "shipping method types help weight-based bullet",
  },
  tooltipCheckoutNote: {
    id: "jfJnP7",
    defaultMessage:
      "If several methods match the same cart, the customer sees all of them and picks one. Saleor does not hide price-based methods in favor of weight-based ones, or the other way around.",
    description: "shipping method types help checkout note",
  },
  exampleTitle: {
    id: "G0QhNI",
    defaultMessage: "Example",
    description: "shipping method types help example title",
  },
  exampleSetup: {
    id: "yveiQA",
    defaultMessage: "Your zone includes:",
    description: "shipping method types help example setup",
  },
  examplePriceMethod: {
    id: "3jnyYs",
    defaultMessage: '"Free over $100" (price-based, minimum order value $100)',
    description: "shipping method types help example price method",
  },
  exampleWeightMethod: {
    id: "uOmlLG",
    defaultMessage: '"Heavy parcel 5–20 kg" (weight-based)',
    description: "shipping method types help example weight method",
  },
  exampleCartColumn: {
    id: "/tC+ce",
    defaultMessage: "Cart",
    description: "shipping method types help example table cart column",
  },
  exampleResultColumn: {
    id: "imwdWo",
    defaultMessage: "Methods shown",
    description: "shipping method types help example table result column",
  },
  exampleRowOneCart: {
    id: "blhBcp",
    defaultMessage: "$150, 8 kg",
    description: "shipping method types help example row one cart",
  },
  exampleRowOneResult: {
    id: "+0+RJj",
    defaultMessage: "Both methods",
    description: "shipping method types help example row one result",
  },
  exampleRowTwoCart: {
    id: "Be1Tws",
    defaultMessage: "$50, 8 kg",
    description: "shipping method types help example row two cart",
  },
  exampleRowTwoResult: {
    id: "F1f4+A",
    defaultMessage: "Weight-based only",
    description: "shipping method types help example row two result",
  },
  exampleRowThreeCart: {
    id: "C1aDzb",
    defaultMessage: "$150, 2 kg",
    description: "shipping method types help example row three cart",
  },
  exampleRowThreeResult: {
    id: "LZ//yK",
    defaultMessage: "Price-based only",
    description: "shipping method types help example row three result",
  },
});
