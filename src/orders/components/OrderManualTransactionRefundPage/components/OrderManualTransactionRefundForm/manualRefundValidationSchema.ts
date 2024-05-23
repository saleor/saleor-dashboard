import { IntlShape } from "react-intl";
import { z } from "zod";

import { validationMessages } from "../../messages";

export const getValidationSchema = (intl: IntlShape, chargedAmount: number) =>
  z.object({
    transationId: z.string().min(1, {
      message: intl.formatMessage(validationMessages.transactionIdRequired),
    }),
    amount: z.coerce
      .number()
      .positive({
        message: intl.formatMessage(validationMessages.amountRequired),
      })
      .refine(value => value <= chargedAmount, {
        message: intl.formatMessage(validationMessages.amountExceedsChargedAmount),
      }),
  });

export type ManualRefundForm = z.infer<ReturnType<typeof getValidationSchema>>;
