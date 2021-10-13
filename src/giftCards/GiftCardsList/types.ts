import { Dialog, Pagination, SingleAction } from "@saleor/types";

export type GiftCardListColummns =
  | "giftCardCode"
  | "tag"
  | "balance"
  | "usedBy"
  | "product";

export enum GiftCardListActionParamsEnum {
  CREATE = "gift-card-create",
  DELETE = "gift-card-delete",
  BULK_CREATE = "gift-card-bulk-create",
  EXPORT = "gift-card-export"
}

export type GiftCardListUrlQueryParams = Pagination &
  Dialog<GiftCardListActionParamsEnum> &
  SingleAction;

export const GIFT_CARD_LIST_QUERY = "GiftCardList";
