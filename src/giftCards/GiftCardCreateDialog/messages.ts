import { defineMessages } from "react-intl";

export const giftCardCreateMessages = defineMessages({
  title: {
    id: "JftRtx",
    defaultMessage: "Issue gift card",
    description: "issue gift card dialog title",
  },
  description: {
    id: "0UeJGl",
    defaultMessage: "Set the gift card value and optional delivery details.",
    description: "issue gift card dialog intro",
  },
  detailsSection: {
    id: "XvS/E0",
    defaultMessage: "Gift card details",
    description: "issue gift card details section header",
  },
  deliverySection: {
    id: "Zk1shR",
    defaultMessage: "Delivery",
    description: "issue gift card delivery section header",
  },
  optionsSection: {
    id: "/H393C",
    defaultMessage: "Options",
    description: "issue gift card options section header",
  },
  successTitle: {
    id: "HFo3Qe",
    defaultMessage: "Gift card created",
    description: "successfully created gift card alert title",
  },
  successDescription: {
    id: "jKm3k/",
    defaultMessage: "Copy the code below to share with the customer.",
    description: "issue gift card success dialog intro",
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
  useEmail: {
    id: "rccigC",
    defaultMessage: "Use email:",
    description: "option label prefix for using a typed email address",
  },
  restrictToCustomerLabel: {
    id: "bBhgtd",
    defaultMessage: "Restrict to customer",
    description: "restrict gift card to customer field label",
  },
  restrictToCustomerSubtitle: {
    id: "8zFkHk",
    defaultMessage:
      "Only the selected customer will be able to use this gift card. Leave empty to allow any customer.",
    description: "restrict gift card to customer field subtitle",
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
  successCodeLabel: {
    id: "ynhBeQ",
    defaultMessage: "Gift card code",
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
  copyCodeError: {
    id: "kvsZ4J",
    defaultMessage: "Failed to copy to clipboard",
    description: "copy gift card code error",
  },
  createdSuccessAlertTitle: {
    id: "YJ4fhf",
    defaultMessage: "Gift card created",
    description: "successfully created gift card alert notification title",
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
