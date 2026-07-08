import { defineMessages } from "react-intl";

export const orderInvoiceEmailSendDialogMessages = defineMessages({
  title: {
    id: "5JT4v2",
    defaultMessage: "Send Invoice",
    description: "dialog header",
  },
  description: {
    id: "Yxnwa3",
    defaultMessage:
      "Are you sure you want to send this invoice: <strong>{invoiceNumber}</strong> to the customer?",
    description: "dialog content",
  },
});
