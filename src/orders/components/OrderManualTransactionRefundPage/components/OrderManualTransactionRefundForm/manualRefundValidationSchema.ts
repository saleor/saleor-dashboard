import { TransactionItemFragment } from "@dashboard/graphql";
import { IntlShape } from "react-intl";
import { z } from "zod";

import { validationMessages } from "../../messages";

export const getValidationSchema = (intl: IntlShape, transactions: TransactionItemFragment[]) =>
  z
    .object({
      transationId: z.string().min(1, {
        message: intl.formatMessage(validationMessages.transactionIdRequired),
      }),
      amount: z.coerce.number().positive({
        message: intl.formatMessage(validationMessages.amountRequired),
      }),
    })
    .refine(
      data => {
        const selectedTransaction = transactions.find(
          transaction => transaction.id === data.transationId,
        );

        if (!selectedTransaction) {
          return true;
        }

        return data.amount <= selectedTransaction.chargedAmount.amount;
      },
      {
        message: intl.formatMessage(validationMessages.amountExceedsChargedAmount),
        path: ["amount"],
      },
    );

export type ManualRefundForm = z.infer<ReturnType<typeof getValidationSchema>>;
