import { type ExtendedGiftCard, type GiftCardBase } from "./types";

function isGiftCardExpired<T extends GiftCardBase>(giftCard: T): boolean {
  if (!giftCard?.expiryDate) {
    return false;
  }

  return new Date(giftCard.expiryDate) < new Date();
}

export function getExtendedGiftCard<T extends GiftCardBase>(
  giftCard?: T,
): ExtendedGiftCard<T> | undefined {
  // todo do not accept optional value, check for existence higher
  if (!giftCard) {
    return undefined;
  }

  return {
    ...giftCard,
    isExpired: isGiftCardExpired(giftCard),
  };
}
