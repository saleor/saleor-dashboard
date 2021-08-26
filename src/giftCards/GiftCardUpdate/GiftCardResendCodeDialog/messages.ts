import { defineMessages } from "react-intl";

export const giftCardResendCodeDialogMessages = defineMessages({
  title: {
    defaultMessage: "Resend code to customer",
    description: "GiftCardResendCodeDialog title"
  },
  description: {
    defaultMessage:
      "Gift Card Code will be resent to email provided during checkout. You can provide a different email address if you want to:",
    description: "GiftCardResendCodeDialog description"
  },
  consentCheckboxLabel: {
    defaultMessage: "Yes, I want to send gift card to different address",
    description: "GiftCardResendCodeDialog consentCheckboxLabel"
  },
  submitButtonLabel: {
    defaultMessage: "Resend",
    description: "GiftCardResendCodeDialog submitButtonLabel"
  },
  emailInputPlaceholder: {
    defaultMessage: "Provided email address",
    description: "GiftCardResendCodeDialog emailInputPlaceholder"
  },
  successResendAlertText: {
    defaultMessage: "Successfully resent code to customer!",
    description: "GiftCardResendCodeDialog successResendAlertText"
  },
  sendToChannelSelectLabel: {
    defaultMessage: "Send to channel",
    description: "ChannelPickerSelectField sendToChannelLabel"
  }
});
