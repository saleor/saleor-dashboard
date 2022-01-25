import { defineMessages } from "react-intl";

export const giftCardListFilterErrorMessages = defineMessages({
  balanceAmount: {
    defaultMessage: "Balance amount is missing",
    description: "balance amound missing error message"
  },
  balanceCurrency: {
    defaultMessage: "Balance currency is missing",
    description: "balance curreny missing error message"
  }
});

export const giftCardListSearchAndFiltersMessages = defineMessages({
  searchPlaceholder: {
    defaultMessage: "Search Gift Cards, e.g {exampleGiftCardCode}",
    description: "search gift card placeholder"
  },
  defaultTabLabel: {
    defaultMessage: "All Gift Cards",
    description: "all gift cards label"
  }
});
