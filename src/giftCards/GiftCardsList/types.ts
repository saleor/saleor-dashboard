import {
  ActiveTab,
  Dialog,
  Pagination,
  Search,
  SingleAction,
  Sort,
} from "@saleor/types";

import { GiftCardListUrlFilters } from "./GiftCardListSearchAndFilters/types";

export type GiftCardListColummns =
  | "giftCardCode"
  | "tag"
  | "balance"
  | "usedBy"
  | "product";

export enum GiftCardUrlSortField {
  usedBy = "usedBy",
  balance = "balance",
  product = "product",
}

export type GiftCardUrlSort = Sort<GiftCardUrlSortField>;

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
