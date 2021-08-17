import {
  GiftCardSettingsExpiryTypeEnum,
  GiftCardSettingsUpdateInput
} from "@saleor/types/globalTypes";

import { GiftCardSettingsFormData } from "./types";

export const getGiftCardSettingsInputData = ({
  expiryPeriodActive,
  expiryPeriodType,
  expiryPeriodAmount
}: Pick<
  GiftCardSettingsFormData,
  "expiryPeriodActive" | "expiryPeriodType" | "expiryPeriodAmount"
>): GiftCardSettingsUpdateInput => ({
  expiryType: expiryPeriodActive
    ? GiftCardSettingsExpiryTypeEnum.EXPIRY_PERIOD
    : GiftCardSettingsExpiryTypeEnum.NEVER_EXPIRE,
  expiryPeriod:
    expiryPeriodActive && expiryPeriodType && expiryPeriodAmount
      ? {
          type: expiryPeriodType,
          amount: expiryPeriodAmount
        }
      : undefined
});
