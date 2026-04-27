import { type TransactionItemFragment } from "@dashboard/graphql";
import { type IntlShape } from "react-intl";
import { z } from "zod";

import { validationMessages } from "../../messages";

const amountRequiredMessage = (intl: IntlShape) =>
  intl.formatMessage(validationMessages.amountRequired);

/**
 * `z.coerce.number()` turns `undefined` into `NaN`, which Zod rejects with a confusing
 * "Expected number, received nan". Map empty / invalid input to `undefined` instead.
 */
const manualRefundAmountSchema = (intl: IntlShape) =>
  z.preprocess(
    (val: unknown) => {
      if (val === undefined || val === null || val === "") {
        return undefined;
      }

      if (typeof val === "number") {
        return Number.isFinite(val) ? val : undefined;
      }

      if (typeof val === "string") {
        const trimmed = val.trim();

        if (trimmed === "") {
          return undefined;
        }

        const parsed = Number(trimmed);

        return Number.isFinite(parsed) ? parsed : undefined;
      }

      return undefined;
    },
    z
      .number({
        required_error: amountRequiredMessage(intl),
        invalid_type_error: amountRequiredMessage(intl),
      })
      .positive({ message: amountRequiredMessage(intl) }),
  );

export const getValidationSchema = (intl: IntlShape, transactions: TransactionItemFragment[]) =>
  z
    .object({
      transationId: z.string().min(1, {
        message: intl.formatMessage(validationMessages.transactionIdRequired),
      }),
      amount: manualRefundAmountSchema(intl),
      reason: z.string(),
      reasonReferenceId: z.string(),
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
