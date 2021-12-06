import { defineMessages } from "react-intl";

export const giftCardResendCodeDialogMessages = defineMessages({
  title: {
    id: "gdipgH",
    defaultMessage: "Resend code to customer",
    description: "GiftCardResendCodeDialog title"
  },
  description: {
    id: "TLFPZr",
    defaultMessage:
      "Gift Card Code will be resent to email provided during checkout. You can provide a different email address if you want to:",
    description: "GiftCardResendCodeDialog description"
  },
  consentCheckboxLabel: {
    id: "BTm21Z",
    defaultMessage: "Yes, I want to send gift card to different address",
    description: "GiftCardResendCodeDialog consentCheckboxLabel"
  },
  submitButtonLabel: {
    id: "6taMHC",
    defaultMessage: "Resend",
    description: "GiftCardResendCodeDialog submitButtonLabel"
  },
  emailInputPlaceholder: {
    id: "sEh5Qw",
    defaultMessage: "Provided email address",
    description: "GiftCardResendCodeDialog emailInputPlaceholder"
  },
  successResendAlertText: {
    id: "6hD2yP",
    defaultMessage: "Successfully resent code to customer!",
    description: "GiftCardResendCodeDialog successResendAlertText"
  },
  sendToChannelSelectLabel: {
    id: "IASULG",
    defaultMessage: "Send to channel",
    description: "ChannelPickerSelectField sendToChannelLabel"
  }
});
