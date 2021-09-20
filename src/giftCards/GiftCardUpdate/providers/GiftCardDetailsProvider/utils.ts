import moment from "moment";

import { ExtendedGiftCard, GiftCardBase } from "./types";

export function isGiftCardExpired<T extends GiftCardBase>(
  giftCard: T
): boolean {
  return moment(giftCard?.expiryDate).isBefore(moment());
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
