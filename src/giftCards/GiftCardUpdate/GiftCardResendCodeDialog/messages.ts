import { defineMessages } from "react-intl";

export const giftCardResendCodeDialogMessages = defineMessages({
  title: {
    id: "mslSpp",
    defaultMessage: "Resend code to customer",
    description: "resend code to customer title",
  },
  recipientSectionTitle: {
    id: "a80vXY",
    defaultMessage: "Recipient",
    description: "gift card resend dialog recipient section title",
  },
  notificationSectionTitle: {
    id: "eUcaVH",
    defaultMessage: "Notification",
    description: "gift card resend dialog notification section title",
  },
  defaultRecipientLabel: {
    id: "k80FoQ",
    defaultMessage: "Default recipient: {recipient}",
    description: "gift card resend dialog default recipient radio option",
  },
  customRecipientLabel: {
    id: "Zyjb/g",
    defaultMessage: "Different email address",
    description: "gift card resend dialog custom recipient radio option",
  },
  emailFieldLabel: {
    id: "CTASiY",
    defaultMessage: "Email address",
    description: "gift card resend dialog email field label",
  },
  submitButtonLabel: {
    id: "s1IQuN",
    defaultMessage: "Resend",
    description: "resend button label",
  },
  successResendAlertText: {
    id: "jL3caQ",
    defaultMessage: "Code resent to customer",
    description: "resent code success message",
  },
  sendFromChannelLabel: {
    id: "qUMJtL",
    defaultMessage: "Send from channel",
    description: "gift card resend dialog channel field label",
  },
  sendFromChannelHelper: {
    id: "Zhloph",
    defaultMessage: "Uses this channel's email configuration.",
    description: "gift card resend dialog channel field helper text",
  },
  defaultRecipientFallback: {
    id: "ePaUMU",
    defaultMessage: "Default recipient assigned to this gift card",
    description: "gift card resend dialog fallback when default recipient email is unknown",
  },
});
