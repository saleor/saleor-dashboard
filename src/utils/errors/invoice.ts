import { commonMessages } from "@saleor/intl";
import { InvoiceErrorFragment } from "@saleor/orders/types/InvoiceErrorFragment";
import { InvoiceErrorCode } from "@saleor/types/globalTypes";
import { defineMessages, IntlShape } from "react-intl";

import commonErrorMessages from "./common";

const messages = defineMessages({
  emailNotSet: {
    defaultMessage: "Email address is not set",
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
        // TODO: update error messages
        return intl.formatMessage({ defaultMessage: "" });
      case InvoiceErrorCode.NOT_FOUND:
        return intl.formatMessage({ defaultMessage: "" });
      case InvoiceErrorCode.NOT_READY:
        return intl.formatMessage({ defaultMessage: "" });
      case InvoiceErrorCode.NUMBER_NOT_SET:
        return intl.formatMessage({ defaultMessage: "" });
      case InvoiceErrorCode.URL_NOT_SET:
        return intl.formatMessage({ defaultMessage: "" });
      case InvoiceErrorCode.REQUIRED:
        return intl.formatMessage(commonMessages.requiredField);
      default:
        return intl.formatMessage(commonErrorMessages.unknownError);
    }
  }

  return undefined;
}

export default getInvoiceErrorMessage;
