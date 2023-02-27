import { defineMessages } from "react-intl";

export const giftCardCreateMessages = defineMessages({
  title: {
    id: "JftRtx",
    defaultMessage: "Issue gift card",
    description: "issue gift card dialog title",
  },
  amountLabel: {
    id: "n9JOI3",
    defaultMessage: "Enter amount",
    description: "money amount input label",
  },
  issueButtonLabel: {
    id: "PilTI6",
    defaultMessage: "Issue",
    description: "issue gift card button label",
  },
  customerLabel: {
    id: "MgdgpT",
    defaultMessage: "Customer",
    description: "customer input label",
  },
  noteLabel: {
    id: "UKgP89",
    defaultMessage: "Note",
    description: "note input label",
  },
  noteSubtitle: {
    id: "ZuqkSp",
    defaultMessage:
      "Why was this gift card issued. This note will not be shown to the customer. Note will be stored in gift card history",
    description: "note input subtitle",
  },
  createdGiftCardLabel: {
    id: "zjZuhM",
    defaultMessage: "This is the code of a created gift card:",
    description: "created gift card code label",
  },
  copyCodeLabel: {
    id: "RXbkle",
    defaultMessage: "Copy code",
    description: "copy code button label",
  },
  copiedToClipboardTitle: {
    id: "hnBvH7",
    defaultMessage: "Copied to clipboard",
    description: "copied to clipboard alert title",
  },
  createdSuccessAlertTitle: {
    id: "WzHfj8",
    defaultMessage: "Successfully created gift card",
    description: "successfully created gift card alert title",
  },
  requiresActivationLabel: {
    id: "vCw7BP",
    defaultMessage: "Requires activation",
    description: "requires activation checkbox label",
  },
  requiresActivationCaption: {
    id: "ArctEg",
    defaultMessage: "All issued cards require activation by staff before use.",
    description: "requires activation checkbox caption",
  },
  giftCardsAmountLabel: {
    id: "uilt7q",
    defaultMessage: "Cards Issued",
    description: "issued cards amount label",
  },
  bulkCreateExplanation: {
    id: "45aV8u",
    defaultMessage:
      "After creation Saleor will create a list of gift card codes that you will be able to download. ",
    description: "gift card bulk create modal bottom explanation",
  },
  bulkCreateIssuedTitle: {
    id: "WyPitj",
    defaultMessage: "Bulk Issue Gift Cards",
    description: "gift card bulk create success dialog title",
  },
  bulkCreateIssuedExplanation: {
    id: "NZtcLb",
    defaultMessage:
      "We have issued all of your requested gift cards. You can download the list of new gift cards using the button below.",
    description: "gift card bulk create success dialog content",
  },
  bulkCreateIssuedAccept: {
    id: "vDnheO",
    defaultMessage: "Ok",
    description: "gift card bulk create success dialog accept button",
  },
  bulkCreateIssuedExportToEmail: {
    id: "IVOjqW",
    defaultMessage: "Export To Email",
    description: "gift card bulk create success dialog export button",
  },
});
