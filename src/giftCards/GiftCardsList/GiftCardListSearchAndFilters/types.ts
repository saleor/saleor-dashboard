import {
  AutocompleteFilterOpts,
  FetchMoreProps,
  FilterOpts,
  Filters,
  FiltersWithMultipleValues,
  MinMax,
  Search,
  SearchProps,
} from "@saleor/types";

export enum GiftCardListUrlFiltersEnum {
  currency = "currency",
  initialBalanceAmountFrom = "initialBalanceAmountFrom",
  initialBalanceAmountTo = "initialBalanceAmountTo",
  currentBalanceAmountFrom = "currentBalanceAmountFrom",
  currentBalanceAmountTo = "currentBalanceAmountTo",
  status = "status",
}

export enum GiftCardListUrlFiltersWithMultipleValuesEnum {
  tag = "tag",
  product = "product",
  usedBy = "usedBy",
}

export enum GiftCardListFilterKeys {
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

export type GiftCardListUrlFilters = Filters<GiftCardListUrlFiltersEnum> &
  FiltersWithMultipleValues<GiftCardListUrlFiltersWithMultipleValuesEnum>;

export interface GiftCardListFilterOpts {
  tag: FilterOpts<string[]> & AutocompleteFilterOpts;
  currency: FilterOpts<string> & AutocompleteFilterOpts;
  product: FilterOpts<string[]> & AutocompleteFilterOpts;
  usedBy: FilterOpts<string[]> & AutocompleteFilterOpts;
  initialBalanceAmount: FilterOpts<MinMax>;
  currentBalanceAmount: FilterOpts<MinMax>;
  status: FilterOpts<string>;
}

export type SearchWithFetchMoreProps = FetchMoreProps & Search & SearchProps;

export enum GiftCardStatusFilterEnum {
  enabled = "enabled",
  disabled = "disabled",
}
