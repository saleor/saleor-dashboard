import moment from "moment";

import { ExtendedGiftCard, GiftCardBase } from "./types";

export function isGiftCardExpired<T extends GiftCardBase>(
  giftCard: T
): boolean {
  // For testing purposes, will be removed before merge
  // return moment(data?.giftCard?.expiryDate).isBefore(moment());
  return moment("2021-09-01").isBefore(moment());
}

export function getExtendedGiftCard<T extends GiftCardBase>(
  giftCard?: T
): ExtendedGiftCard<T> {
  if (!giftCard) {
    return undefined;
  }

  return {
    ...giftCard,
    isExpired: isGiftCardExpired(giftCard)
  };
}
