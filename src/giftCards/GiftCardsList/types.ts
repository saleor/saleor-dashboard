import { Pagination } from "@saleor/types";

export type GiftCardListColummns =
  | "giftCardCode"
  | "tag"
  | "balance"
  | "usedBy"
  | "product";

export enum GiftCardListParamsEnum {
  CREATE = "gift-card-create"
}

export interface GiftCardListUrlQueryParams extends Pagination {
  action: GiftCardListParamsEnum;
}
