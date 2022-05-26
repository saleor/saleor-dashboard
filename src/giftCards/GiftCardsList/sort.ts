import { GiftCardUrlSortField } from "./types";

export function canBeSorted(
  sort: GiftCardUrlSortField,
  isCurrencySelected: boolean,
) {
  switch (sort) {
    case GiftCardUrlSortField.balance:
      return isCurrencySelected;
    default:
      return true;
  }
}
