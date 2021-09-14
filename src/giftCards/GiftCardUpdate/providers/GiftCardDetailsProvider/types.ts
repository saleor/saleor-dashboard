import { GiftCardDetails_giftCard } from "../../types/GiftCardDetails";

export interface ExtendedGiftCard extends GiftCardDetails_giftCard {
  isExpired: boolean;
}
