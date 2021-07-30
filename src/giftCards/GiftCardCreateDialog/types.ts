import {
  GiftCardExpiryTypeEnum,
  TimePeriodTypeEnum
} from "@saleor/types/globalTypes";

export interface GiftCardCreateFormCustomer {
  name: string;
  email: string;
}

export interface GiftCardExpirySettingsFormData {
  expiryDate: string;
  expiryType: GiftCardExpiryTypeEnum;
  expiryPeriodType: TimePeriodTypeEnum;
  expiryPeriodAmount: number;
}
