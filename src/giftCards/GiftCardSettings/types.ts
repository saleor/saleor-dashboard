import { TimePeriodTypeEnum } from "@dashboard/graphql";

export interface GiftCardSettingsFormData {
  expiryPeriodActive: boolean;
  expiryPeriodType: TimePeriodTypeEnum;
  expiryPeriodAmount: number;
}
