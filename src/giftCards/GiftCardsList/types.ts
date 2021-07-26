import { Pagination } from "@saleor/types";

export type GiftCardListColummns =
  | "giftCardCode"
  | "tag"
  | "balance"
  | "usedBy"
  | "product";

export interface GiftCardsListTableCommonProps {
  numberOfColumns: number;
  disabled: boolean;
}

export enum GiftCardListParamsEnum {
  CREATE = "gift-card-create"
}

export interface GiftCardListUrlQueryParams extends Pagination {
  action: GiftCardListParamsEnum;
}
