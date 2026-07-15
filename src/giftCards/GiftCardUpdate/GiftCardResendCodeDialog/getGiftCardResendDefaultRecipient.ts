import { type GiftCardDetailsQuery, GiftCardEventsEnum } from "@dashboard/graphql";
import { getFullName } from "@dashboard/misc";

type GiftCardForResend = NonNullable<GiftCardDetailsQuery["giftCard"]>;

export type GiftCardResendRecipientEvent = {
  type: GiftCardEventsEnum | null;
  email: string | null;
};

export type GiftCardResendRecipientInput = {
  lastUsedOn: GiftCardForResend["lastUsedOn"];
  createdByEmail: string | null;
  createdBy: { firstName: string; lastName: string } | null;
  events: ReadonlyArray<GiftCardResendRecipientEvent>;
};

export type GiftCardResendDefaultRecipient = {
  email: string | null;
  name: string | null;
};

const DELIVERY_EVENT_TYPES = [GiftCardEventsEnum.SENT_TO_CUSTOMER, GiftCardEventsEnum.RESENT];

const getLatestDeliveryEmail = (
  events: ReadonlyArray<GiftCardResendRecipientEvent>,
): string | null => {
  const deliveryEvents = events.filter(
    event => event.type && DELIVERY_EVENT_TYPES.includes(event.type) && event.email,
  );

  if (deliveryEvents.length === 0) {
    return null;
  }

  return deliveryEvents[deliveryEvents.length - 1].email ?? null;
};

export const getGiftCardResendDefaultRecipient = (
  giftCard: GiftCardResendRecipientInput | undefined | null,
): GiftCardResendDefaultRecipient => {
  if (!giftCard) {
    return {
      email: null,
      name: null,
    };
  }

  // Backend resends to the last user when the card was used. That recipient is no
  // longer exposed reliably after usedBy/usedByEmail removal, so the UI falls back
  // to a generic label instead of guessing.
  if (giftCard.lastUsedOn) {
    return {
      email: null,
      name: null,
    };
  }

  const deliveryEmail = getLatestDeliveryEmail(giftCard.events);

  if (deliveryEmail) {
    return {
      email: deliveryEmail,
      name: null,
    };
  }

  return {
    email: giftCard.createdByEmail ?? null,
    name: giftCard.createdBy ? getFullName(giftCard.createdBy) : null,
  };
};
