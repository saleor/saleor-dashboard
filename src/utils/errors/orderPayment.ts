import { PaymentErrorFragment } from "@saleor/fragments/types/PaymentErrorFragment";
import { PaymentErrorCode } from "@saleor/types/globalTypes";
import { defineMessages, IntlShape } from "react-intl";

const messages = defineMessages({
  paymentError: {
    defaultMessage: "There was a problem processing your payment",
    description: "payment error message"
  },
  defaultError: {
    defaultMessage: "Somethig went wrong",
    description: "default payment error message"
  }
});

function getOrderPaymentErrorMessage(
  err: PaymentErrorFragment,
  intl: IntlShape
): string {
  if (err) {
    switch (err.code) {
      case PaymentErrorCode.PAYMENT_ERROR:
        return intl.formatMessage(messages.paymentError);
      default:
        return intl.formatMessage(messages.defaultError);
    }
  }
  return undefined;
}

export default getOrderPaymentErrorMessage;
