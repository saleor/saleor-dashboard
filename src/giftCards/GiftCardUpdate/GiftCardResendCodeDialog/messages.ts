import { defineMessages } from "react-intl";

export const giftCardResendCodeDialogMessages = defineMessages({
  title: {
    defaultMessage: "Resend code to customer",
    description: "resend code to customer title"
  },
  description: {
    defaultMessage:
      "Gift Card Code will be resent to email provided during checkout. You can provide a different email address if you want to:",
    description: "resend code to customer description"
  },
  consentCheckboxLabel: {
    defaultMessage: "Yes, I want to send gift card to different address",
    description: "consent to send gift card to different address checkbox label"
  },
  submitButtonLabel: {
    defaultMessage: "Resend",
    description: "resend button label"
  },
  emailInputPlaceholder: {
    defaultMessage: "Provided email address",
    description: "provided email input placeholder"
  },
  successResendAlertText: {
    defaultMessage: "Successfully resent code to customer!",
    description: "resent code success message"
  },
  sendToChannelSelectLabel: {
    defaultMessage: "Send to channel",
    description: "send to channel select label"
  }
});
