import { defineMessages } from "react-intl";

export const giftCardListFilterErrorMessages = defineMessages({
  balanceAmount: {
    id: "kcMVsB",
    defaultMessage: "Balance amount is missing",
    description: "balance amound missing error message",
  },
  balanceCurrency: {
    id: "tXIgmR",
    defaultMessage: "Balance currency is missing",
    description: "balance curreny missing error message",
  },
});

export const giftCardListSearchAndFiltersMessages = defineMessages({
  searchPlaceholder: {
    id: "jY80Gs",
    defaultMessage: "Search by code, e.g {exampleGiftCardCode}",
    description: "search gift card placeholder",
  },
  defaultTabLabel: {
    id: "tTuCYj",
    defaultMessage: "All Gift Cards",
    description: "all gift cards label",
  },
});
