import { Dialog, Pagination, SingleAction } from "@saleor/types";

export type GiftCardListColummns =
  | "giftCardCode"
  | "tag"
  | "balance"
  | "usedBy"
  | "product";

export enum GiftCardListActionParamsEnum {
  CREATE = "gift-card-create",
  DELETE = "gift-card-delete"
}

export type GiftCardListUrlQueryParams = Pagination &
  Dialog<GiftCardListActionParamsEnum> &
  SingleAction;

export const GIFT_CARD_LIST_QUERY = "GiftCardList";
