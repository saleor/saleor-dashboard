import { GiftCardError } from "@saleor/fragments/types/GiftCardError";
import { FormChange } from "@saleor/hooks/useForm";

export interface GiftCardCreateFormCustomer {
  name: string;
  email: string;
}

export interface GiftCardCommonFormData {
  tag: string;
  balanceAmount: number;
  balanceCurrency: string;
  expiryDate: string;
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
