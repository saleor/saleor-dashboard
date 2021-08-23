import { GiftCardError } from "@saleor/fragments/types/GiftCardError";
import { FormChange } from "@saleor/hooks/useForm";
import { TimePeriodTypeEnum } from "@saleor/types/globalTypes";

export type GiftCardExpiryType = "EXPIRY_DATE" | "EXPIRY_PERIOD";

export interface GiftCardCreateFormCustomer {
  name: string;
  email: string;
}

export interface GiftCardCommonFormData {
  tag: string;
  balanceAmount: number;
  balanceCurrency: string;
  expiryDate: string;
  expiryType?: GiftCardExpiryType;
  expiryPeriodType?: TimePeriodTypeEnum;
  expiryPeriodAmount?: number;
}

export type GiftCardCreateFormErrors = Record<
  "tag" | "expiryDate" | "customer" | "currency" | "amount",
  GiftCardError
>;

export interface GiftCardCreateFormCommonProps {
  change: FormChange;
  errors: GiftCardCreateFormErrors;
  data: GiftCardCommonFormData;
}
