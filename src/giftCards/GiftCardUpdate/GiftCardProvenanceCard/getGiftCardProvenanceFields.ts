import { customerUrl } from "@dashboard/customers/urls";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { type GiftCardDetailsQuery, GiftCardEventsEnum } from "@dashboard/graphql";
import { getFullName } from "@dashboard/misc";
import { getOrderNumberLinkObject } from "@dashboard/orders/components/OrderHistory/utils";
import { staffMemberDetailsUrl } from "@dashboard/staff/urls";
import { type MessageDescriptor } from "react-intl";

import { PLACEHOLDER } from "../types";
import { giftCardProvenanceCardMessages as messages } from "./messages";

type GiftCardDetails = NonNullable<GiftCardDetailsQuery["giftCard"]>;

export type GiftCardProvenanceActorIcon = "user" | "mail" | "app" | "staff";

export interface GiftCardProvenanceActor {
  label: MessageDescriptor;
  name: string;
  url?: string;
  /** Email (or other value) available to copy; independent of the display name. */
  copyText?: string;
  icon: GiftCardProvenanceActorIcon;
}

export interface GiftCardProvenanceOrder {
  link: string;
  text: string;
  entity: "order";
}

/**
 * Resolve who issued/bought the card for the provenance sidebar.
 * Prefers event.app, then giftCard.app, then staff/customer fields.
 */
export const getGiftCardProvenanceActor = (giftCard: GiftCardDetails): GiftCardProvenanceActor => {
  const cardIssuedEvent = giftCard.events?.find(event => event.type === GiftCardEventsEnum.ISSUED);
  const issuingApp = cardIssuedEvent?.app ?? giftCard.app;

  if (issuingApp) {
    return {
      label: messages.issuedByAppLabel,
      name: issuingApp.name ?? PLACEHOLDER,
      url: ExtensionsUrls.resolveViewManifestExtensionUrl(issuingApp.id),
      icon: "app",
    };
  }

  if (cardIssuedEvent) {
    const userName = giftCard.createdBy ? getFullName(giftCard.createdBy) : "";

    return {
      label: messages.issuedByLabel,
      name: userName || giftCard.createdByEmail || PLACEHOLDER,
      url: giftCard.createdBy?.id ? staffMemberDetailsUrl(giftCard.createdBy.id) : undefined,
      copyText: giftCard.createdByEmail ?? undefined,
      icon: "staff",
    };
  }

  if (giftCard.createdByEmail && !giftCard.createdBy) {
    return {
      label: messages.boughtByLabel,
      name: giftCard.createdByEmail,
      copyText: giftCard.createdByEmail,
      icon: "mail",
    };
  }

  return {
    label: messages.boughtByLabel,
    name: (giftCard.createdBy ? getFullName(giftCard.createdBy) : "") || PLACEHOLDER,
    url: giftCard.createdBy?.id ? customerUrl(giftCard.createdBy.id) : undefined,
    copyText: giftCard.createdByEmail ?? undefined,
    icon: "user",
  };
};

export const getGiftCardProvenanceOrder = (
  giftCard: GiftCardDetails,
): GiftCardProvenanceOrder | null => {
  const cardIssuedEvent = giftCard.events?.find(event => event.type === GiftCardEventsEnum.ISSUED);
  const cardBoughtEvent = giftCard.events?.find(event => event.type === GiftCardEventsEnum.BOUGHT);

  if (cardIssuedEvent?.orderId && cardIssuedEvent.orderNumber) {
    return getOrderNumberLinkObject({
      id: cardIssuedEvent.orderId,
      number: cardIssuedEvent.orderNumber,
    });
  }

  if (cardBoughtEvent?.orderId && cardBoughtEvent.orderNumber) {
    return getOrderNumberLinkObject({
      id: cardBoughtEvent.orderId,
      number: cardBoughtEvent.orderNumber,
    });
  }

  return null;
};
