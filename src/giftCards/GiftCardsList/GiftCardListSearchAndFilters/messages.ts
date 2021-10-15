import { defineMessages } from "react-intl";

export const giftCardListFilterErrorMessages = defineMessages({
  balanceAmount: {
    defaultMessage: "Balance amount is missing",
    description: "Filter balance amount error"
  },
  balanceCurrency: {
    defaultMessage: "Balance currency is missing",
    description: "Filter balance currency error"
  }
});

export const giftCardListSearchAndFiltersMessages = defineMessages({
  searchPlaceholder: {
    defaultMessage: "Search Gift Cards, e.g {exampleGiftCardCode}",
    description: "gift card search placeholder"
  },
  defaultTabLabel: {
    defaultMessage: "All Gift Cards",
    description: "gift card default tab label"
  }
});
