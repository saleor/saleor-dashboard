import { Pill } from "@dashboard/components/Pill";
import {
  type ExtendedGiftCard,
  type GiftCardBase,
} from "@dashboard/giftCards/GiftCardUpdate/providers/GiftCardDetailsProvider/types";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

import { getGiftCardStatusPresentation } from "./getGiftCardStatusPresentation";

interface GiftCardStatusChipProps<
  T extends ExtendedGiftCard<GiftCardBase & { isActive: boolean }>,
> {
  giftCard: T;
}

export function GiftCardStatusChip<
  T extends ExtendedGiftCard<GiftCardBase & { isActive: boolean }>,
>({ giftCard }: GiftCardStatusChipProps<T>): ReactNode {
  const intl = useIntl();
  const status = getGiftCardStatusPresentation(giftCard);

  return <Pill color={status.color} label={intl.formatMessage(status.label)} />;
}
