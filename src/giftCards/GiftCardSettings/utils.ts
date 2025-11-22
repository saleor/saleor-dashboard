import { GiftCardSettingsExpiryTypeEnum, GiftCardSettingsUpdateInput } from "@dashboard/graphql";

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
    ? "EXPIRY_PERIOD"
    : "NEVER_EXPIRE";
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
