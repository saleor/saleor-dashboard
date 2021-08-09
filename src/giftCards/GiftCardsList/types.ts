import { Dialog, Pagination } from "@saleor/types";

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
  Dialog<GiftCardListActionParamsEnum> & {
    "delete-gift-card-id": string;
  };
