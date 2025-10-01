// @ts-strict-ignore
import { FilterElement } from "@dashboard/components/Filter/types";
import {
  createFilterTabUtils,
  getMinMaxQueryParam,
  getMultipleValueQueryParam,
  getSingleValueQueryParam,
} from "@dashboard/utils/filters";
import { defineMessages } from "react-intl";

import {
  GiftCardListFilterKeys,
  GiftCardListUrlFilters,
  GiftCardListUrlFiltersEnum,
} from "./types";

const GIFT_CARD_FILTERS_KEY = "giftCardFilters";

export function getFilterQueryParam(
  filter: FilterElement<GiftCardListFilterKeys>,
): GiftCardListUrlFilters {
  const { name } = filter;
  const { initialBalanceAmount, currentBalanceAmount, tag, currency, usedBy, product, status } =
    GiftCardListFilterKeys;

  switch (name) {
    case currency:
    case status:
      return getSingleValueQueryParam(filter, name);

    case tag:
    case product:
    case usedBy:
      return getMultipleValueQueryParam(filter, name);

    case initialBalanceAmount:
      return getMinMaxQueryParam(
        filter,
        GiftCardListUrlFiltersEnum.initialBalanceAmountFrom,
        GiftCardListUrlFiltersEnum.initialBalanceAmountTo,
      );

    case currentBalanceAmount:
      return getMinMaxQueryParam(
        filter,
        GiftCardListUrlFiltersEnum.currentBalanceAmountFrom,
        GiftCardListUrlFiltersEnum.currentBalanceAmountTo,
      );
  }
}

export const messages = defineMessages({
  balanceAmountLabel: {
    id: "bVbEZ/",
    defaultMessage: "Amount",
    description: "amount filter label",
  },
  tagLabel: {
    id: "mE+fru",
    defaultMessage: "Tags",
    description: "tag filter label",
  },
  currencyLabel: {
    id: "osPBn1",
    defaultMessage: "Currency",
    description: "currency filter label",
  },
  productLabel: {
    id: "Sjd7wm",
    defaultMessage: "Product",
    description: "product filter label",
  },
  usedByLabel: {
    id: "WMGoqz",
    defaultMessage: "Used by",
    description: "used by filter label",
  },
  statusLabel: {
    id: "D4CsYK",
    defaultMessage: "Status",
    description: "status filter label",
  },
  enabledOptionLabel: {
    id: "vC8vyb",
    defaultMessage: "Enabled",
    description: "enabled status option label",
  },
  disabledOptionLabel: {
    id: "+WTmpr",
    defaultMessage: "Disabled",
    description: "disabled status option label",
  },
  initialBalanceLabel: {
    id: "VceXrc",
    defaultMessage: "Initial balance",
    description: "initial balance filter label",
  },
  currentBalanceLabel: {
    id: "e/61NZ",
    defaultMessage: "Current balance",
    description: "current balance filter label",
  },
});

export const storageUtils = createFilterTabUtils<string>(GIFT_CARD_FILTERS_KEY);
