export interface GiftCardSaveComposition {
  hasTags: boolean;
  hasExpiry: boolean;
}

export const buildGiftCardSaveComposition = (
  changedFieldNames: ReadonlyArray<string>,
): GiftCardSaveComposition => ({
  hasTags: changedFieldNames.includes("tags"),
  hasExpiry: changedFieldNames.includes("expiryDate"),
});

export const hasGiftCardSaveComposition = (composition: GiftCardSaveComposition): boolean =>
  composition.hasTags || composition.hasExpiry;

export const EMPTY_GIFT_CARD_SAVE_COMPOSITION: GiftCardSaveComposition = {
  hasTags: false,
  hasExpiry: false,
};
