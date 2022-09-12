import {
  TransactionRequestActionErrorCode,
  TransactionRequestActionErrorFragment,
} from "@saleor/graphql";
import { defineMessages, IntlShape } from "react-intl";

import { getCommonFormFieldErrorMessage } from "./common";

export const messages = defineMessages({
  missingWebhook: {
    defaultMessage:
      "No app or plugin is configured to handle requested transaction action",
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
        return intl.formatMessage(messages.missingWebhook);
      case TransactionRequestActionErrorCode.NOT_FOUND:
        return intl.formatMessage(messages.notFound);
    }

    return getCommonFormFieldErrorMessage(err, intl);
  }
}
