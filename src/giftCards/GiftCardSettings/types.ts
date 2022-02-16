import { TimePeriodTypeEnum } from "@saleor/graphql";

export interface GiftCardSettingsFormData {
  expiryPeriodActive: boolean;
  expiryPeriodType: TimePeriodTypeEnum;
  expiryPeriodAmount: number;
}
