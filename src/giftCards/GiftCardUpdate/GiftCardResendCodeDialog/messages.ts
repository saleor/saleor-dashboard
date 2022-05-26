import { defineMessages } from "react-intl";

export const giftCardResendCodeDialogMessages = defineMessages({
  title: {
    id: "mslSpp",
    defaultMessage: "Resend code to customer",
    description: "resend code to customer title",
  },
  description: {
    id: "ttk0w7",
    defaultMessage:
      "Gift Card Code will be resent to email provided during checkout. You can provide a different email address if you want to:",
    description: "resend code to customer description",
  },
  consentCheckboxLabel: {
    id: "v01/tY",
    defaultMessage: "Yes, I want to send gift card to different address",
    description:
      "consent to send gift card to different address checkbox label",
  },
  submitButtonLabel: {
    id: "s1IQuN",
    defaultMessage: "Resend",
    description: "resend button label",
  },
  emailInputPlaceholder: {
    id: "AqHafs",
    defaultMessage: "Provided email address",
    description: "provided email input placeholder",
  },
  successResendAlertText: {
    id: "JQH+Iy",
    defaultMessage: "Successfully resent code to customer!",
    description: "resent code success message",
  },
  sendToChannelSelectLabel: {
    id: "NLNonj",
    defaultMessage: "Send to channel",
    description: "send to channel select label",
  },
});
