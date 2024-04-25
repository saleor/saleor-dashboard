import { Pill } from "@dashboard/components/Pill";
import {
  ExtendedGiftCard,
  GiftCardBase,
} from "@dashboard/giftCards/GiftCardUpdate/providers/GiftCardDetailsProvider/types";
import React from "react";
import { useIntl } from "react-intl";

import { giftCardUpdatePageHeaderMessages as giftCardStatusChipMessages } from "../../GiftCardUpdate/GiftCardUpdatePageHeader/messages";

interface GiftCardStatusChipProps<
  T extends ExtendedGiftCard<GiftCardBase & { isActive: boolean }>,
> {
  giftCard: T;
}

function GiftCardStatusChip<T extends ExtendedGiftCard<GiftCardBase & { isActive: boolean }>>({
  giftCard,
}: GiftCardStatusChipProps<T>) {
  const { isExpired, isActive } = giftCard;
  const intl = useIntl();

  if (isExpired) {
    return (
      <Pill
        color="info"
        label={intl.formatMessage(giftCardStatusChipMessages.expiredStatusLabel)}
      />
    );
  }

  if (!isActive) {
    return (
      <Pill
        color="error"
        label={intl.formatMessage(giftCardStatusChipMessages.disabledStatusLabel)}
      />
    );
  }

  return null;
}

export default GiftCardStatusChip;
