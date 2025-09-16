import {
  FetchMoreProps,
  Search,
  SearchProps,
} from "@dashboard/types";

enum GiftCardListUrlFiltersEnum {
  currency = "currency",
  initialBalanceAmountFrom = "initialBalanceAmountFrom",
  initialBalanceAmountTo = "initialBalanceAmountTo",
  currentBalanceAmountFrom = "currentBalanceAmountFrom",
  currentBalanceAmountTo = "currentBalanceAmountTo",
  status = "status",
}

enum GiftCardListUrlFiltersWithMultipleValuesEnum {
  tag = "tag",
  product = "product",
  usedBy = "usedBy",
}

enum GiftCardListFilterKeys {
  currency = "currency",
  balance = "balance",
  initialBalance = "initialBalance",
  currentBalance = "currentBalance",
  initialBalanceAmount = "initialBalanceAmount",
  currentBalanceAmount = "currentBalanceAmount",
  tag = "tag",
  product = "product",
  usedBy = "usedBy",
  status = "status",
}

export type SearchWithFetchMoreProps = FetchMoreProps & Search & SearchProps;

enum GiftCardStatusFilterEnum {
  enabled = "enabled",
  disabled = "disabled",
}
