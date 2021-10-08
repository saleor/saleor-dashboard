import { GiftCardError } from "@saleor/fragments/types/GiftCardError";
import { FormChange } from "@saleor/hooks/useForm";
import { TimePeriodTypeEnum } from "@saleor/types/globalTypes";

import {
  GiftCardCreateCommonFormErrors,
  GiftCardExpiryType
} from "../GiftCardCreateDialog/types";
import { GiftCardBulkCreateFormData } from "./GiftCardBulkCreateDialogForm";

export type GiftCardBulkCreateFormErrors = GiftCardCreateCommonFormErrors &
  Record<"count", GiftCardError>;

export interface GiftCardBulkCreateFormCommonProps {
  change: FormChange;
  errors: GiftCardBulkCreateFormErrors;
  data: GiftCardBulkCreateFormData;
}

export interface GiftCardCreateCommonFormData {
  expirySelected: boolean;
  expiryType: GiftCardExpiryType;
  expiryPeriodType: TimePeriodTypeEnum;
  expiryPeriodAmount: number;
  requiresActivation: boolean;
  tag: string;
  balanceAmount: number;
  balanceCurrency: string;
  expiryDate: string;
}
