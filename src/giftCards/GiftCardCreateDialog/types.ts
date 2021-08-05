import { GiftCardError } from "@saleor/fragments/types/GiftCardError";
import { FormChange } from "@saleor/hooks/useForm";
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
  balanceAmount: number;
  balanceCurrency: string;
  expiryDate: string;
  expiryType: GiftCardExpiryTypeEnum;
  expiryPeriodType: TimePeriodTypeEnum;
  expiryPeriodAmount: number;
}

export type GiftCardCreateFormErrors = Record<
  "tag" | "expiryDate" | "expiryPeriod" | "customer" | "currency" | "amount",
  GiftCardError
>;

export interface GiftCardCreateFormCommonProps {
  change: FormChange;
  errors: GiftCardCreateFormErrors;
  data: GiftCardCommonFormData;
}
