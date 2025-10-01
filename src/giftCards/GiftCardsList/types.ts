import {
  ActiveTab,
  Dialog,
  Filters,
  FiltersWithMultipleValues,
  Pagination,
  Search,
  SingleAction,
  Sort,
} from "@dashboard/types";

export type GiftCardListColummns = "giftCardCode" | "tag" | "balance" | "usedBy" | "product";

export enum GiftCardUrlSortField {
  usedBy = "usedBy",
  balance = "balance",
  product = "product",
}

type GiftCardUrlSort = Sort<GiftCardUrlSortField>;

export enum GiftCardListActionParamsEnum {
  CREATE = "gift-card-create",
  DELETE = "gift-card-delete",
  SAVE_SEARCH = "save-search",
  DELETE_SEARCH = "delete-search",
  BULK_CREATE = "gift-card-bulk-create",
  EXPORT = "gift-card-export",
}

export type GiftCardListUrlQueryParams = Pagination &
  Dialog<GiftCardListActionParamsEnum> &
  SingleAction &
  GiftCardListUrlFilters &
  GiftCardUrlSort &
  ActiveTab &
  Search;

export enum GiftCardListUrlFiltersEnum {
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
