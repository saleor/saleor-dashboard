import { defineMessages } from "react-intl";

export const giftCardCreateMessages = defineMessages({
  title: {
    defaultMessage: "Issue gift card",
    description: "issue gift card dialog title"
  },
  amountLabel: {
    defaultMessage: "Enter amount",
    description: "money amount input label"
  },
  issueButtonLabel: {
    defaultMessage: "Issue",
    description: "issue gift card button label"
  },
  customerLabel: {
    defaultMessage: "Customer",
    description: "customer input label"
  },
  noteLabel: {
    defaultMessage: "Note",
    description: "note input label"
  },
  noteSubtitle: {
    defaultMessage:
      "Why was this gift card issued. This note will not be shown to the customer. Note will be stored in gift card history",
    description: "note input subtitle"
  },
  createdGiftCardLabel: {
    defaultMessage: "This is the code of a created gift card:",
    description: "created gift card code label"
  },
  copyCodeLabel: {
    defaultMessage: "Copy code",
    description: "copy code button label"
  },
  copiedToClipboardTitle: {
    defaultMessage: "Copied to clipboard",
    description: "copied to clipboard alert title"
  },
  createdSuccessAlertTitle: {
    defaultMessage: "Successfully created gift card",
    description: "successfully created gift card alert title"
  },
  requiresActivationLabel: {
    defaultMessage: "Requires activation",
    description: "requires activation checkbox label"
  },
  requiresActivationCaption: {
    defaultMessage: "All issued cards require activation by staff before use.",
    description: "requires activation checkbox caption"
  },
  giftCardsAmountLabel: {
    defaultMessage: "Cards Issued",
    description: "issued cards amount label"
  },
  bulkCreateExplanation: {
    defaultMessage:
      "After creation Saleor will create a list of gift card codes that you will be able to download. ",
    description: "gift card bulk create modal bottom explanation"
  },
  bulkCreateIssuedTitle: {
    defaultMessage: "Bulk Issue Gift Cards",
    description: "gift card bulk create success dialog title"
  },
  bulkCreateIssuedExplanation: {
    defaultMessage:
      "We have issued all of your requested gift cards. You can download the list of new gift cards using the button below.",
    description: "gift card bulk create success dialog content"
  },
  bulkCreateIssuedAccept: {
    defaultMessage: "Ok",
    description: "gift card bulk create success dialog accept button"
  },
  bulkCreateIssuedExportToEmail: {
    defaultMessage: "Export To Email",
    description: "gift card bulk create success dialog export button"
  }
});
