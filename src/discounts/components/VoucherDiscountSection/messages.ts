import { defineMessages } from "react-intl";

export const voucherDiscountSectionMessages = defineMessages({
  cardTitle: {
    id: "lmMHMT",
    defaultMessage: "Discount",
    description: "voucher discount section title",
  },
  scopeTitle: {
    id: "CXIW51",
    defaultMessage: "What the voucher discounts",
    description: "voucher discount scope section title",
  },
  scopeHint: {
    id: "AULKso",
    defaultMessage: "Changing this changes which other settings apply, so pick it first.",
    description: "voucher discount scope section hint",
  },
  entireOrderTitle: {
    id: "M/xjya",
    defaultMessage: "Entire order",
    description: "voucher scope tile title",
  },
  entireOrderDescription: {
    id: "zJeRkq",
    defaultMessage: "Takes the discount off the order subtotal, whatever is in the basket.",
    description: "voucher scope tile description",
  },
  specificProductTitle: {
    id: "2enMlh",
    defaultMessage: "Products",
    description: "voucher scope tile title",
  },
  specificProductDescription: {
    id: "NyoC9W",
    defaultMessage:
      "Only discounts lines matching the categories, collections, products or variants you choose below.",
    description: "voucher scope tile description",
  },
  freeShippingTitle: {
    id: "jbIfCD",
    defaultMessage: "Free shipping",
    description: "voucher scope tile title",
  },
  freeShippingDescription: {
    id: "pq/k18",
    defaultMessage: "Waives the shipping cost. You can limit it to specific countries.",
    description: "voucher scope tile description",
  },
  amountTitle: {
    id: "LYeyWD",
    defaultMessage: "Discount amount",
    description: "voucher discount amount section title",
  },
  amountHint: {
    id: "p96fcM",
    defaultMessage: "Choose how the discount is calculated.",
    description: "voucher discount amount section hint",
  },
  percentageLabel: {
    id: "/PUjN6",
    defaultMessage: "Percentage",
    description: "voucher discount amount type",
  },
  fixedAmountLabel: {
    id: "I69KV3",
    defaultMessage: "Fixed amount",
    description: "voucher discount amount type",
  },
  percentageValueHint: {
    id: "u3lci+",
    defaultMessage:
      "Set a percentage for each channel — values can differ when markets need different offers.",
    description: "voucher percentage value helper",
  },
  percentageOffLabel: {
    id: "jFNmsS",
    defaultMessage: "Percentage off",
    description: "voucher percentage value field label",
  },
  percentageNeedsChannelsHint: {
    id: "Pst6mm",
    defaultMessage: "Assign channels in Availability to apply this percentage at checkout.",
    description: "helper under percentage input when voucher has no channel listings yet",
  },
  percentagePerChannelTitle: {
    id: "4RC7NL",
    defaultMessage: "Percentage off, per channel",
    description: "voucher percentage per channel section title",
  },
  percentagePasteHint: {
    id: "ArgcnR",
    defaultMessage:
      "You can paste from a spreadsheet. Select a field and paste a column of values to fill percentages down the list.",
    description: "voucher percentage spreadsheet paste hint",
  },
  shippingAmountHint: {
    id: "k+wydb",
    defaultMessage:
      "A free-shipping voucher waives the whole shipping cost, so there is no amount to set.",
    description: "voucher shipping discount amount helper",
  },
  shippingCountriesCallout: {
    id: "z4dBU1",
    defaultMessage:
      "Limit this to particular destinations in {countriesLink} below. Otherwise it applies everywhere you ship.",
    description: "voucher shipping countries callout",
  },
  fixedAmountPerChannelTitle: {
    id: "pIxpPI",
    defaultMessage: "Amount off, per channel",
    description: "voucher fixed amount per channel section title",
  },
  fixedAmountPerChannelHint: {
    id: "q0I4vu",
    defaultMessage:
      "A fixed amount has to be set in each channel's own currency — 10 USD is not 10 PLN.",
    description: "voucher fixed amount per channel section hint",
  },
  fixedAmountPasteHint: {
    id: "1jGDif",
    defaultMessage:
      "You can paste from a spreadsheet. Select a field and paste a column of values to fill amounts down the list.",
    description: "voucher fixed amount spreadsheet paste hint",
  },
  countriesLink: {
    id: "kzSE40",
    defaultMessage: "Countries",
    description: "link text to countries section",
  },
});
