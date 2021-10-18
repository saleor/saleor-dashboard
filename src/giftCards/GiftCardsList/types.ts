import {
  ActiveTab,
  Dialog,
  Pagination,
  Search,
  SingleAction
} from "@saleor/types";

import { GiftCardListUrlFilters } from "./GiftCardListSearchAndFilters/types";

export type GiftCardListColummns =
  | "giftCardCode"
  | "tag"
  | "balance"
  | "usedBy"
  | "product";

export enum GiftCardListActionParamsEnum {
  CREATE = "gift-card-create",
  DELETE = "gift-card-delete",
  SAVE_SEARCH = "save-search",
  DELETE_SEARCH = "delete-search"
}

export type GiftCardListUrlQueryParams = Pagination &
  Dialog<GiftCardListActionParamsEnum> &
  SingleAction &
  GiftCardListUrlFilters &
  ActiveTab &
  Search;

export const GIFT_CARD_LIST_QUERY = "GiftCardList";
