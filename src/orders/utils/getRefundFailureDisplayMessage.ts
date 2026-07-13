import { defineMessages, type IntlShape } from "react-intl";

export const refundFailureDisplayMessages = defineMessages({
  generic: {
    id: "KzpsXH",
    defaultMessage:
      "The payment provider did not complete this refund. Open the refund to review and try again.",
    description: "fallback when transaction refund failure has no provider message",
  },
});

export const getRefundFailureDisplayMessage = (
  failureMessage: string | null | undefined,
  intl: IntlShape,
): string => failureMessage?.trim() || intl.formatMessage(refundFailureDisplayMessages.generic);
