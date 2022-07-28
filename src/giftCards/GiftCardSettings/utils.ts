import {
  GiftCardSettingsExpiryTypeEnum,
  GiftCardSettingsUpdateInput,
} from "@saleor/graphql";

import { GiftCardSettingsFormData } from "./types";

export const getGiftCardSettingsInputData = ({
  expiryPeriodActive,
  expiryPeriodType,
  expiryPeriodAmount,
}: Pick<
  GiftCardSettingsFormData,
  "expiryPeriodActive" | "expiryPeriodType" | "expiryPeriodAmount"
>): GiftCardSettingsUpdateInput => {
  const expiryType = expiryPeriodActive
    ? GiftCardSettingsExpiryTypeEnum.EXPIRY_PERIOD
    : GiftCardSettingsExpiryTypeEnum.NEVER_EXPIRE;

  const expiryPeriod =
    expiryPeriodActive && expiryPeriodType && expiryPeriodAmount
      ? {
          type: expiryPeriodType,
          amount: expiryPeriodAmount,
        }
      : undefined;

  return {
    expiryType,
    expiryPeriod,
  };
};
