import { InvoiceErrorCode, InvoiceErrorFragment } from "@saleor/graphql";
import { defineMessages, IntlShape } from "react-intl";

import { getCommonFormFieldErrorMessage } from "./common";

const messages = defineMessages({
  emailNotSet: {
    id: "abTH5q",
    defaultMessage: "Email address is not set",
    description: "error message",
  },
  invalidStatus: {
    id: "dxCVWI",
    defaultMessage: "Cannot request an invoice for draft order",
    description: "error message",
  },
  notFound: {
    id: "uRTj1Q",
    defaultMessage: "Invoice not found",
    description: "error message",
  },
  notReady: {
    id: "Fz3kic",
    defaultMessage:
      "Billing address is not set or invoice is not ready to be send",
    description: "error message",
  },
  numberNotSet: {
    id: "N43t3/",
    defaultMessage: "Number not set for an invoice",
    description: "error message",
  },
  urlNotSet: {
    id: "vP7g2+",
    defaultMessage: "URL not set for an invoice",
    description: "error message",
  },
});

function getInvoiceErrorMessage(
  err: InvoiceErrorFragment,
  intl: IntlShape,
): string {
  if (err) {
    switch (err.code) {
      case InvoiceErrorCode.EMAIL_NOT_SET:
        return intl.formatMessage(messages.emailNotSet);
      case InvoiceErrorCode.INVALID_STATUS:
        return intl.formatMessage(messages.invalidStatus);
      case InvoiceErrorCode.NOT_FOUND:
        return intl.formatMessage(messages.notFound);
      case InvoiceErrorCode.NOT_READY:
        return intl.formatMessage(messages.notReady);
      case InvoiceErrorCode.NUMBER_NOT_SET:
        return intl.formatMessage(messages.numberNotSet);
      case InvoiceErrorCode.URL_NOT_SET:
        return intl.formatMessage(messages.urlNotSet);
    }
  }

  return getCommonFormFieldErrorMessage(err, intl);
}

export default getInvoiceErrorMessage;
