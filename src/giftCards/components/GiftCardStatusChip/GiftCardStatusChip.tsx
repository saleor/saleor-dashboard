import StatusChip from "@saleor/components/StatusChip";
import { StatusType } from "@saleor/components/StatusChip/types";
import {
  ExtendedGiftCard,
  GiftCardBase
} from "@saleor/giftCards/GiftCardUpdate/providers/GiftCardDetailsProvider/types";
import React from "react";
import { useIntl } from "react-intl";

import { giftCardUpdatePageHeaderMessages as giftCardStatusChipMessages } from "../../GiftCardUpdate/GiftCardUpdatePageHeader/messages";

interface GiftCardStatusChipProps<
  T extends ExtendedGiftCard<GiftCardBase & { isActive: boolean }>
> {
  giftCard: T;
}

function GiftCardStatusChip<
  T extends ExtendedGiftCard<GiftCardBase & { isActive: boolean }>
>({ giftCard }: GiftCardStatusChipProps<T>) {
  const { isExpired, isActive } = giftCard;
  const intl = useIntl();

  const getGiftCardChipStatus = () => {
    if (isExpired) {
      return StatusType.NEUTRAL;
    }

    if (!isActive) {
      return StatusType.ERROR;
    }

    return null;
  };

  const getGiftCardChipLabel = () => {
    if (isExpired) {
      return giftCardStatusChipMessages.expiredStatusLabel;
    }

    if (!isActive) {
      return giftCardStatusChipMessages.disabledStatusLabel;
    }

    return null;
  };

  if (!getGiftCardChipStatus()) {
    return null;
  }

  return (
    <StatusChip
      size="md"
      status={getGiftCardChipStatus()}
      label={intl.formatMessage(getGiftCardChipLabel())}
    />
  );
}

export default GiftCardStatusChip;
