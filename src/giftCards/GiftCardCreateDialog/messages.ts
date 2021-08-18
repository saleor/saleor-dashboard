import { defineMessages } from "react-intl";

export const giftCardCreateDialogMessages = defineMessages({
  title: {
    defaultMessage: "Issue gift card",
    description: "GiftCardCreateDialog title"
  },
  amountLabel: {
    defaultMessage: "Enter amount",
    description: "GiftCardCreateDialog amount label"
  },
  issueButtonLabel: {
    defaultMessage: "Issue",
    description: "GiftCardCreateDialog issue button label"
  },
  customerLabel: {
    defaultMessage: "Customer",
    description: "GiftCardCreateDialog customer label"
  },
  customerSubtitle: {
    defaultMessage:
      "Selected customer will be sent the generated gift card code. Someone else can redeem the gift card code. Gift card will be assigned to account which redeemed the code.",
    description: "GiftCardCreateDialog customer subtitle"
  },
  noteLabel: {
    defaultMessage: "Note",
    description: "GiftCardCreateDialog note label"
  },
  noteSubtitle: {
    defaultMessage:
      "Why was this gift card issued. This note will not be shown to the customer. Note will be stored in gift card history",
    description: "GiftCardCreateDialog note subtitle"
  },
  createdGiftCardLabel: {
    defaultMessage: "This is the code of a created gift card:",
    description: "GiftCardCreateDialog created gift card label"
  },
  copyCodeLabel: {
    defaultMessage: "Copy code",
    description: "GiftCardCreateDialog copy code label"
  },
  copiedToClipboardTitle: {
    defaultMessage: "Copied to clipboard",
    description: "GiftCardCreateDialog copied to clipboard title"
  },
  createdSuccessAlertTitle: {
    defaultMessage: "Successfully created gift card",
    description: "GiftCardCreateDialog createdSuccessAlertTitle"
  }
});
