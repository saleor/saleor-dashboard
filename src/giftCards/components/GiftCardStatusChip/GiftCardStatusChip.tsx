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

  const getStatusChipData = () => {
    if (isExpired) {
      return {
        status: StatusType.NEUTRAL,
        label: intl.formatMessage(giftCardStatusChipMessages.expiredStatusLabel)
      };
    }

    if (!isActive) {
      return {
        status: StatusType.ERROR,
        label: intl.formatMessage(
          giftCardStatusChipMessages.disabledStatusLabel
        )
      };
    }

    return {
      status: null,
      label: null
    };
  };

  return <StatusChip size="md" {...getStatusChipData()} />;
}

export default GiftCardStatusChip;
