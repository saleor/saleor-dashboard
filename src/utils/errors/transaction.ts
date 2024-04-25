import {
  TransactionCreateErrorCode,
  TransactionCreateErrorFragment,
  TransactionRequestActionErrorCode,
  TransactionRequestActionErrorFragment,
} from "@dashboard/graphql";
import { defineMessages, IntlShape } from "react-intl";

import { getCommonFormFieldErrorMessage } from "./common";

export const transactionRequestMessages = defineMessages({
  missingWebhook: {
    defaultMessage: "No app or plugin is configured to handle requested transaction action",
    id: "qDfaDI",
  },
  notFound: {
    defaultMessage: "Transaction wasn't found",
    id: "B06DG8",
  },
  success: {
    defaultMessage: "Transaction action requested successfully",
    id: "gr1BBC",
  },
});

export function getOrderTransactionErrorMessage(
  err: TransactionRequestActionErrorFragment,
  intl: IntlShape,
): string {
  if (err) {
    switch (err.code) {
      case TransactionRequestActionErrorCode.MISSING_TRANSACTION_ACTION_REQUEST_WEBHOOK:
        return intl.formatMessage(transactionRequestMessages.missingWebhook);
      case TransactionRequestActionErrorCode.NOT_FOUND:
        return intl.formatMessage(transactionRequestMessages.notFound);
    }

    return getCommonFormFieldErrorMessage(err, intl) || "";
  }

  return "";
}

export const transactionCreateMessages = defineMessages({
  notFound: {
    defaultMessage: "Cannot create transaction to non-existing order",
    id: "aKSUWR",
  },
  incorrectCurrency: {
    defaultMessage: "Invalid currency used to create transaction",
    id: "/eWPsp",
  },
  unique: {
    defaultMessage: "Transaction is not unique",
    id: "Vtjlpw",
  },
  success: {
    defaultMessage: "Manual transaction ({amount}) was created",
    id: "tmrBDK",
  },
});

export function getTransactionCreateErrorMessage(
  err: TransactionCreateErrorFragment,
  intl: IntlShape,
): string {
  if (err) {
    switch (err.code) {
      case TransactionCreateErrorCode.NOT_FOUND:
        return intl.formatMessage(transactionCreateMessages.notFound);
      case TransactionCreateErrorCode.UNIQUE:
        return intl.formatMessage(transactionCreateMessages.unique);
      case TransactionCreateErrorCode.INCORRECT_CURRENCY:
        return intl.formatMessage(transactionCreateMessages.incorrectCurrency);
    }

    return getCommonFormFieldErrorMessage(err, intl) || "";
  }

  return "";
}
