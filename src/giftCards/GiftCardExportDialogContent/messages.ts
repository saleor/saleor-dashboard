import { defineMessages } from "react-intl";

export const giftCardExportDialogMessages = defineMessages({
  title: {
    defaultMessage: "Export Gift Card Codes",
    description: "gift card export dialog title"
  },
  exportTypeLabel: {
    defaultMessage: "gift cards",
    description: "gift card export type label"
  },
  confirmButtonLabel: {
    defaultMessage: "Export codes",
    description: "gift card export dialog confirm button label"
  },
  successAlertDescription: {
    defaultMessage:
      "We are currently exporting your gift card codes. As soon as your file is available it will be sent to your email address",
    description: "gift card export success alert description"
  },
  successAlertTitle: {
    defaultMessage: "Exporting CSV",
    description: "gift card export csv success alert title"
  }
});
