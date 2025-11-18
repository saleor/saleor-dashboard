export type ExtendedGiftCard<T extends GiftCardBase> = T & {
  isExpired: boolean;
};

export interface GiftCardBase {
  expiryDate: string | null;
}
