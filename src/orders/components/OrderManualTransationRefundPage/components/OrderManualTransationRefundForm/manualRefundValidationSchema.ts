import { IntlShape } from "react-intl";
import { z } from "zod";

import { validationMessages } from "../../messages";

export const getValidationSchema = (intl: IntlShape) =>
  z.object({
    transationId: z.string().min(1, {
      message: intl.formatMessage(validationMessages.transactionIdRequired),
    }),
    amount: z.coerce.number().min(1, {
      message: intl.formatMessage(validationMessages.amountRequired),
    }),
  });

export type ManualRefundForm = z.infer<ReturnType<typeof getValidationSchema>>;
