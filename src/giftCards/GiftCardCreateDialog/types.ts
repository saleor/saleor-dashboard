import {
  GiftCardExpiryTypeEnum,
  TimePeriodTypeEnum
} from "@saleor/types/globalTypes";

export interface GiftCardCreateFormCustomer {
  name: string;
  email: string;
}

export interface GiftCardCommonFormData {
  tag: string;
  balanceAmount: string;
  balanceCurrency: string;
  expiryDate: string;
  expiryType: GiftCardExpiryTypeEnum;
  expiryPeriodType: TimePeriodTypeEnum;
  expiryPeriodAmount: string;
}
