import { TimePeriodTypeEnum } from "@saleor/types/globalTypes";

export interface GiftCardSettingsFormData {
  expiryPeriodActive: boolean;
  expiryPeriodType: TimePeriodTypeEnum;
  expiryPeriodAmount: number;
}
