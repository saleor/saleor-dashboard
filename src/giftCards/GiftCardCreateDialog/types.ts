import { GiftCardError } from "@saleor/fragments/types/GiftCardError";
import { FormChange } from "@saleor/hooks/useForm";

import { GiftCardCreateFormData } from "./GiftCardCreateDialogForm";

export type GiftCardExpiryType = "EXPIRY_DATE" | "EXPIRY_PERIOD";

export interface GiftCardCreateFormCustomer {
  name: string;
  email: string;
}

export type GiftCardCreateFormErrors = Record<
  "tag" | "expiryDate" | "customer" | "currency" | "amount" | "balance",
  GiftCardError
>;

export interface GiftCardCreateFormCommonProps {
  change: FormChange;
  errors: GiftCardCreateFormErrors;
  data: GiftCardCreateFormData;
}
