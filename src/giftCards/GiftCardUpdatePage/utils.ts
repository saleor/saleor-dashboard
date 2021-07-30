import { GiftCardExpiryTypeEnum } from "@saleor/types/globalTypes";

import { GiftCardExpirySettingsFormData } from "../GiftCardCreateDialog/types";

export const getGiftCardExpirySettingsInputData = ({
  expiryType,
  expiryDate,
  expiryPeriodAmount,
  expiryPeriodType
}: GiftCardExpirySettingsFormData) => {
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
          amount: expiryPeriodAmount,
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
