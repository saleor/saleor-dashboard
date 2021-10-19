import { defineMessages } from "react-intl";

export const extendedPaymentTimelineEventMessages = defineMessages({
  refundedAmount: {
    defaultMessage: "Refunded amount",
    description: "refund amount title"
  },
  capturedAmount: {
    defaultMessage: "Captured amount",
    description: "capture amount title"
  },
  voidedAmount: {
    defaultMessage: "Voided amount",
    description: "void amount title"
  },
  authorizedAmount: {
    defaultMessage: "Authorized amount",
    description: "authorize amount title"
  },
  pspReference: {
    defaultMessage: "PSP reference",
    description: "psp reference title"
  },
  failReason: {
    defaultMessage: "Fail reason",
    description: "fail reason title"
  }
});
