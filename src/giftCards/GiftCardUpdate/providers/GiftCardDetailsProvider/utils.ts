import moment from "moment";

import { ExtendedGiftCard, GiftCardBase } from "./types";

function isGiftCardExpired<T extends GiftCardBase>(giftCard: T): boolean {
  if (!giftCard?.expiryDate) {
    return false;
  }

  return moment(giftCard?.expiryDate).isBefore(moment());
}

export function getExtendedGiftCard<T extends GiftCardBase>(
  giftCard?: T,
): ExtendedGiftCard<T> | undefined {
  if (!giftCard) {
    return undefined;
  }

  return {
    ...giftCard,
    isExpired: isGiftCardExpired(giftCard),
  };
}

export function isDefinedExtendedGiftCard<T extends GiftCardBase>(
  giftCard: ExtendedGiftCard<T> | undefined,
): giftCard is ExtendedGiftCard<T> {
  return giftCard !== undefined;
}
