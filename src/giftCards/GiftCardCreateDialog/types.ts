import { GiftCardErrorFragment } from "@dashboard/graphql";
import { FormChange } from "@dashboard/hooks/useForm";

import { GiftCardCreateFormData } from "./GiftCardCreateDialogForm";

export type GiftCardExpiryType = "EXPIRY_DATE" | "EXPIRY_PERIOD";

export interface GiftCardCreateFormCustomer {
  name: string;
  email: string;
}

type GiftCardCreateCommonFormErrors = Record<
  "tags" | "expiryDate" | "currency" | "amount" | "balance",
  GiftCardErrorFragment
>;

type GiftCardCreateFormErrors = GiftCardCreateCommonFormErrors &
  Record<"customer", GiftCardErrorFragment>;

export interface GiftCardCreateFormCommonProps {
  change: FormChange;
  toggleValue: FormChange;
  errors: GiftCardCreateFormErrors;
  data: GiftCardCreateFormData;
}
