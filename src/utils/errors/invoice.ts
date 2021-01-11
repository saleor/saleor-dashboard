import { InvoiceErrorFragment } from "@saleor/fragments/types/InvoiceErrorFragment";
import { commonMessages } from "@saleor/intl";
import { InvoiceErrorCode } from "@saleor/types/globalTypes";
import { defineMessages, IntlShape } from "react-intl";

import commonErrorMessages from "./common";

const messages = defineMessages({
  emailNotSet: {
    defaultMessage: "Email address is not set",
    description: "error message"
  },
  invalidStatus: {
    defaultMessage: "Cannot request an invoice for draft order",
    description: "error message"
  },
  notFound: {
    defaultMessage: "Invoice not found",
    description: "error message"
  },
  notReady: {
    defaultMessage:
      "Billing address is not set or invoice is not ready to be send",
    description: "error message"
  },
  numberNotSet: {
    defaultMessage: "Number not set for an invoice",
    description: "error message"
  },
  urlNotSet: {
    defaultMessage: "URL not set for an invoice",
    description: "error message"
  }
});

function getInvoiceErrorMessage(
  err: InvoiceErrorFragment,
  intl: IntlShape
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
      case InvoiceErrorCode.REQUIRED:
        return intl.formatMessage(commonMessages.requiredField);
      default:
        return intl.formatMessage(commonErrorMessages.unknownError);
    }
  }

  return undefined;
}

export default getInvoiceErrorMessage;
