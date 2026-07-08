import { type GiftCardDetailsQuery } from "@dashboard/graphql";
import { getFullName } from "@dashboard/misc";

type GiftCardForResend = NonNullable<GiftCardDetailsQuery["giftCard"]>;

export type GiftCardResendDefaultRecipient = {
  email: string | null;
  name: string | null;
};

const giftCardWasUsed = (giftCard: GiftCardForResend): boolean =>
  Boolean(giftCard.usedBy || giftCard.usedByEmail || giftCard.lastUsedOn);

export const getGiftCardResendDefaultRecipient = (
  giftCard: GiftCardForResend | undefined | null,
): GiftCardResendDefaultRecipient => {
  if (!giftCard) {
    return {
      email: null,
      name: null,
    };
  }

  if (giftCardWasUsed(giftCard)) {
    return {
      email: giftCard.usedByEmail ?? null,
      name: giftCard.usedBy ? getFullName(giftCard.usedBy) : null,
    };
  }

  return {
    email: giftCard.createdByEmail ?? null,
    name: giftCard.createdBy ? getFullName(giftCard.createdBy) : null,
  };
};
