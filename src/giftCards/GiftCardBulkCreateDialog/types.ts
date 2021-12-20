import { GiftCardError } from "@saleor/fragments/types/GiftCardError";
import { FormChange } from "@saleor/hooks/useForm";
import { TimePeriodTypeEnum } from "@saleor/types/globalTypes";

import { GiftCardExpiryType } from "../GiftCardCreateDialog/types";

export type GiftCardErrorKey =
  | "tags"
  | "expiryDate"
  | "currency"
  | "expiryPeriod"
  | "amount"
  | "balance"
  | "count";

export const giftCardBulkCreateErrorKeys: GiftCardErrorKey[] = [
  "tags",
  "expiryDate",
  "currency",
  "amount",
  "balance",
  "count"
];

export interface GiftCardBulkCreateFormData
  extends GiftCardCreateCommonFormData {
  cardsAmount: number;
}

export type GiftCardBulkCreateFormError = Pick<GiftCardError, "code" | "field">;

export type GiftCardBulkCreateFormErrors = Partial<
  Record<GiftCardErrorKey, GiftCardBulkCreateFormError>
>;

export interface GiftCardBulkCreateFormCommonProps {
  change: FormChange;
  toggleValue: FormChange;
  errors: GiftCardBulkCreateFormErrors;
  data: GiftCardBulkCreateFormData;
}

export interface GiftCardCreateCommonFormData {
  expirySelected: boolean;
  expiryType: GiftCardExpiryType;
  expiryPeriodType: TimePeriodTypeEnum;
  expiryPeriodAmount: number;
  requiresActivation: boolean;
  tags: string[];
  balanceAmount: number;
  balanceCurrency: string;
  expiryDate: string;
}

export interface GiftCardBulkCreateFormData
  extends GiftCardCreateCommonFormData {
  cardsAmount: number;
}
