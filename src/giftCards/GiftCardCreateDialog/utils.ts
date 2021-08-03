import {
  GiftCardExpirySettingsInput,
  GiftCardExpiryTypeEnum
} from "@saleor/types/globalTypes";

import { GiftCardCommonFormData } from "./types";

export const getGiftCardExpirySettingsInputData = ({
  expiryType,
  expiryDate,
  expiryPeriodAmount,
  expiryPeriodType
}: Pick<
  GiftCardCommonFormData,
  "expiryDate" | "expiryPeriodAmount" | "expiryPeriodType" | "expiryType"
>): GiftCardExpirySettingsInput => {
  switch (expiryType) {
    case GiftCardExpiryTypeEnum.EXPIRY_DATE: {
      return {
        expiryType,
        expiryDate
      };
    }

    case GiftCardExpiryTypeEnum.EXPIRY_PERIOD: {
      return {
        expiryType,
        expiryPeriod: {
          amount: parseInt(expiryPeriodAmount, 10),
          type: expiryPeriodType
        }
      };
    }

    default: {
      return {
        expiryType
      };
    }
  }
};
