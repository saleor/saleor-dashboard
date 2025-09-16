import {
  AutocompleteFilterOpts,
  FetchMoreProps,
  FilterOpts,
  Filters,
  FiltersWithMultipleValues,
  MinMax,
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

type GiftCardListUrlFilters = Filters<GiftCardListUrlFiltersEnum> &
  FiltersWithMultipleValues<GiftCardListUrlFiltersWithMultipleValuesEnum>;

interface GiftCardListFilterOpts {
  tag: FilterOpts<string[]> & AutocompleteFilterOpts;
  currency: FilterOpts<string> & AutocompleteFilterOpts;
  product: FilterOpts<string[]> & AutocompleteFilterOpts;
  usedBy: FilterOpts<string[]> & AutocompleteFilterOpts;
  initialBalanceAmount: FilterOpts<MinMax>;
  currentBalanceAmount: FilterOpts<MinMax>;
  status: FilterOpts<string>;
}

export type SearchWithFetchMoreProps = FetchMoreProps & Search & SearchProps;

enum GiftCardStatusFilterEnum {
  enabled = "enabled",
  disabled = "disabled",
}
