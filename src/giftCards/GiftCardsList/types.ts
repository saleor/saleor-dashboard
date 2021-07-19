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

export interface GiftCardListUrlQueryParams {}
