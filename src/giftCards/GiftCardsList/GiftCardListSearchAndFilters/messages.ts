import { defineMessages } from "react-intl";

export const giftCardListFilterErrorMessages = defineMessages({
  balanceAmount: {
    id: "t2rI66",
    defaultMessage: "Balance amount is missing",
    description: "Filter balance amount error"
  },
  balanceCurrency: {
    id: "aT3iwW",
    defaultMessage: "Balance currency is missing",
    description: "Filter balance currency error"
  }
});

export const giftCardListSearchAndFiltersMessages = defineMessages({
  searchPlaceholder: {
    id: "RZZamz",
    defaultMessage: "Search Gift Cards, e.g {exampleGiftCardCode}",
    description: "gift card search placeholder"
  },
  defaultTabLabel: {
    id: "PYvgVs",
    defaultMessage: "All Gift Cards",
    description: "gift card default tab label"
  }
});
